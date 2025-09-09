import { Task } from './types'

const PRIORITY_ORDER = { UI: 0, UN: 1, NI: 2, NN: 3 }

export function sortTasks(tasks: Task[], sortMode: 'priorityThenManual' | 'manualOnly'): Task[] {
  if (sortMode === 'manualOnly') {
    return [...tasks].sort((a, b) => a.order_index - b.order_index)
  }

  // priorityThenManual
  return [...tasks].sort((a, b) => {
    const priorityDiff = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
    if (priorityDiff !== 0) {
      return priorityDiff
    }
    return a.order_index - b.order_index
  })
}

export function groupTasksByPriority(tasks: Task[]): Record<string, Task[]> {
  const groups = {
    UI: [] as Task[],
    UN: [] as Task[],
    NI: [] as Task[],
    NN: [] as Task[]
  }

  tasks.forEach(task => {
    groups[task.priority].push(task)
  })

  return groups
}

export function updateTaskOrder(tasks: Task[], taskId: string, newIndex: number): Task[] {
  const taskToMove = tasks.find(t => t.id === taskId)
  if (!taskToMove) return tasks

  const otherTasks = tasks.filter(t => t.id !== taskId)
  const result = [...otherTasks]
  result.splice(newIndex, 0, taskToMove)

  // Update order_index for all tasks
  return result.map((task, index) => ({
    ...task,
    order_index: index
  }))
}
