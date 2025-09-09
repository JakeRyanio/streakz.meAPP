import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createTaskSchema } from '@/lib/validations'
import { Subtask } from '@/lib/types'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const isDaily = searchParams.get('daily')

    let query = supabase
      .from('tasks')
      .select(`
        *,
        subtasks(*),
        links:task_links(*)
      `)
      .eq('user_id', user.id)
      .order('order_index')

    if (isDaily !== null) {
      query = query.eq('is_daily', isDaily === 'true')
    }

    const { data: tasks, error } = await query

    if (error) {
      console.error('Error fetching tasks:', error)
      return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 })
    }

    // Calculate completion counts for each task
    const tasksWithCompletion = tasks?.map(task => ({
      ...task,
      completion: {
        completedCount: task.subtasks?.filter((st: Subtask) => st.done).length || 0,
        total: task.subtasks?.length || 0
      }
    })) || []

    return NextResponse.json(tasksWithCompletion)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createTaskSchema.parse(body)

    const { data: task, error } = await supabase
      .from('tasks')
      .insert({
        ...validatedData,
        user_id: user.id,
        completion: { completedCount: 0, total: 0 }
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating task:', error)
      return NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
    }

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    if (error instanceof Error && 'issues' in error) {
      return NextResponse.json({ error: 'Validation failed', details: error }, { status: 400 })
    }
    
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
