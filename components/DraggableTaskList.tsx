'use client'

import { useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { SortableTaskCard } from './SortableTaskCard'
import { TaskCard } from './TaskCard'
import { Task, Subtask } from '@/lib/types'
import { updateTaskOrder } from '@/lib/sort'

interface DraggableTaskListProps {
  tasks: Task[]
  onTasksReorder?: (reorderedTasks: Task[]) => void
  onTaskComplete?: (task: Task) => void
  onTaskEdit?: (task: Task) => void
  onAddSubtask?: (taskId: string, title: string) => void
  onToggleSubtask?: (subtask: Subtask) => void
}

export function DraggableTaskList({
  tasks,
  onTasksReorder,
  onTaskComplete,
  onTaskEdit,
  onAddSubtask,
  onToggleSubtask
}: DraggableTaskListProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const sensors = useSensors(useSensor(PointerSensor))

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const task = tasks.find(t => t.id === active.id)
    setActiveTask(task || null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over || active.id === over.id) {
      return
    }

    const oldIndex = tasks.findIndex(task => task.id === active.id)
    const newIndex = tasks.findIndex(task => task.id === over.id)

    if (oldIndex !== -1 && newIndex !== -1) {
      const reorderedTasks = arrayMove(tasks, oldIndex, newIndex)
      const updatedTasks = updateTaskOrder(reorderedTasks, active.id as string, newIndex)
      onTasksReorder?.(updatedTasks)
    }
  }

  if (tasks.length === 0) {
    return null
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-4">
          {tasks.map(task => (
            <SortableTaskCard
              key={task.id}
              task={task}
              onComplete={onTaskComplete}
              onEdit={onTaskEdit}
              onAddSubtask={onAddSubtask}
              onToggleSubtask={onToggleSubtask}
            />
          ))}
        </div>
      </SortableContext>
      
      <DragOverlay>
        {activeTask && (
          <TaskCard
            task={activeTask}
            onComplete={onTaskComplete}
            onEdit={onTaskEdit}
            onAddSubtask={onAddSubtask}
            onToggleSubtask={onToggleSubtask}
            className="rotate-3 shadow-2xl"
          />
        )}
      </DragOverlay>
    </DndContext>
  )
}
