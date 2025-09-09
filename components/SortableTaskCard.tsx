'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import { TaskCard } from './TaskCard'
import { Task, Subtask } from '@/lib/types'
import { cn } from '@/lib/utils'

interface SortableTaskCardProps {
  task: Task
  onComplete?: (task: Task) => void
  onEdit?: (task: Task) => void
  onAddSubtask?: (taskId: string, title: string) => void
  onToggleSubtask?: (subtask: Subtask) => void
}

export function SortableTaskCard({
  task,
  onComplete,
  onEdit,
  onAddSubtask,
  onToggleSubtask
}: SortableTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative',
        isDragging && 'z-50'
      )}
    >
      <div className="flex items-center gap-2">
        <button
          {...attributes}
          {...listeners}
          className="flex items-center justify-center w-6 h-6 text-muted-foreground hover:text-foreground transition-colors cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="w-4 h-4" />
        </button>
        
        <div className="flex-1">
          <TaskCard
            task={task}
            onComplete={onComplete}
            onEdit={onEdit}
            onAddSubtask={onAddSubtask}
            onToggleSubtask={onToggleSubtask}
            className={cn(
              isDragging && 'opacity-50'
            )}
          />
        </div>
      </div>
    </div>
  )
}
