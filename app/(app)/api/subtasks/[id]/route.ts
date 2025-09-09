import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { updateSubtaskSchema } from '@/lib/validations'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = updateSubtaskSchema.parse(body)

    const { data: subtask, error } = await supabase
      .from('subtasks')
      .update(validatedData)
      .eq('id', params.id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Subtask not found' }, { status: 404 })
      }
      console.error('Error updating subtask:', error)
      return NextResponse.json({ error: 'Failed to update subtask' }, { status: 500 })
    }

    // Update task completion count
    const { data: subtasks } = await supabase
      .from('subtasks')
      .select('done')
      .eq('task_id', subtask.task_id)

    const completedCount = subtasks?.filter(st => st.done).length || 0
    const total = subtasks?.length || 0

    await supabase
      .from('tasks')
      .update({
        completion: { completedCount, total }
      })
      .eq('id', subtask.task_id)

    return NextResponse.json(subtask)
  } catch (error) {
    if (error instanceof Error && 'issues' in error) {
      return NextResponse.json({ error: 'Validation failed', details: error }, { status: 400 })
    }
    
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get subtask first to update task completion
    const { data: subtask } = await supabase
      .from('subtasks')
      .select('task_id')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (!subtask) {
      return NextResponse.json({ error: 'Subtask not found' }, { status: 404 })
    }

    const { error } = await supabase
      .from('subtasks')
      .delete()
      .eq('id', params.id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error deleting subtask:', error)
      return NextResponse.json({ error: 'Failed to delete subtask' }, { status: 500 })
    }

    // Update task completion count
    const { data: remainingSubtasks } = await supabase
      .from('subtasks')
      .select('done')
      .eq('task_id', subtask.task_id)

    const completedCount = remainingSubtasks?.filter(st => st.done).length || 0
    const total = remainingSubtasks?.length || 0

    await supabase
      .from('tasks')
      .update({
        completion: { completedCount, total }
      })
      .eq('id', subtask.task_id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
