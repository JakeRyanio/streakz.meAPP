import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createSubtaskSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createSubtaskSchema.parse(body)

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

    const { data: subtask, error } = await supabase
      .from('subtasks')
      .insert({
        ...validatedData,
        user_id: user.id
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating subtask:', error)
      return NextResponse.json({ error: 'Failed to create subtask' }, { status: 500 })
    }

    // Update task completion count
    const { data: subtasks } = await supabase
      .from('subtasks')
      .select('done')
      .eq('task_id', validatedData.task_id)

    const completedCount = subtasks?.filter(st => st.done).length || 0
    const total = subtasks?.length || 0

    await supabase
      .from('tasks')
      .update({
        completion: { completedCount, total }
      })
      .eq('id', validatedData.task_id)

    return NextResponse.json(subtask, { status: 201 })
  } catch (error) {
    if (error instanceof Error && 'issues' in error) {
      return NextResponse.json({ error: 'Validation failed', details: error }, { status: 400 })
    }
    
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
