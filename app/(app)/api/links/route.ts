import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createTaskLinkSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createTaskLinkSchema.parse(body)

    // Verify task ownership
    const { data: task } = await supabase
      .from('tasks')
      .select('id')
      .eq('id', validatedData.task_id)
      .eq('user_id', user.id)
      .single()

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    const { data: link, error } = await supabase
      .from('task_links')
      .insert({
        ...validatedData,
        user_id: user.id
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating task link:', error)
      return NextResponse.json({ error: 'Failed to create task link' }, { status: 500 })
    }

    return NextResponse.json(link, { status: 201 })
  } catch (error) {
    if (error instanceof Error && 'issues' in error) {
      return NextResponse.json({ error: 'Validation failed', details: error }, { status: 400 })
    }
    
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
