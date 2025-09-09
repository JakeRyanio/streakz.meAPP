'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  CheckCircle2, 
  Circle, 
  MoreHorizontal, 
  Plus,
  ExternalLink,
  Flame
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { PriorityBadge } from './PriorityBadge'
import { Task, Subtask, TaskLink } from '@/lib/types'
import { cn } from '@/lib/utils'

interface TaskCardProps {
  task: Task
  onComplete?: (task: Task) => void
  onEdit?: (task: Task) => void
  onAddSubtask?: (taskId: string, title: string) => void
  onToggleSubtask?: (subtask: Subtask) => void
  className?: string
}

export function TaskCard({ 
  task, 
  onComplete, 
  onEdit, 
  onAddSubtask, 
  onToggleSubtask,
  className 
}: TaskCardProps) {
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('')
  const [showAddSubtask, setShowAddSubtask] = useState(false)

  const isCompleted = !!task.completed_at
  const completionPercentage = task.completion.total > 0 
    ? Math.round((task.completion.completedCount / task.completion.total) * 100)
    : 0

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault()
    if (newSubtaskTitle.trim() && onAddSubtask) {
      onAddSubtask(task.id, newSubtaskTitle.trim())
      setNewSubtaskTitle('')
      setShowAddSubtask(false)
    }
  }

  const handleComplete = () => {
    if (onComplete) {
      onComplete(task)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className={cn(
          'cursor-pointer transition-all hover:shadow-lg',
          isCompleted && 'opacity-75',
          className
        )}
        onClick={() => onEdit?.(task)}
      >
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="mt-0.5 h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleComplete()
                  }}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground hover:text-primary" />
                  )}
                </Button>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className={cn(
                      'font-medium',
                      isCompleted && 'line-through text-muted-foreground'
                    )}>
                      {task.title}
                    </h3>
                    
                    {task.is_daily && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {task.daily_meta?.currentStreak && task.daily_meta.currentStreak > 0 && (
                          <div className="flex items-center gap-1">
                            <Flame className="h-3 w-3 text-orange-500" fill="currentColor" />
                            <span className="text-xs font-medium text-orange-500">
                              {task.daily_meta.currentStreak}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {task.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {task.description}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <PriorityBadge priority={task.priority} />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation()
                    onEdit?.(task)
                  }}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Progress */}
            {task.subtasks && task.subtasks.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {task.completion.completedCount} of {task.completion.total} completed
                  </span>
                  <span className="text-xs font-medium">{completionPercentage}%</span>
                </div>
                <Progress value={completionPercentage} className="h-2" />
              </div>
            )}

            {/* Subtasks */}
            {task.subtasks && task.subtasks.length > 0 && (
              <div className="space-y-1">
                {task.subtasks.slice(0, 3).map((subtask) => (
                  <div
                    key={subtask.id}
                    className="flex items-center gap-2 text-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4"
                      onClick={() => onToggleSubtask?.(subtask)}
                    >
                      {subtask.done ? (
                        <CheckCircle2 className="h-3 w-3 text-primary" />
                      ) : (
                        <Circle className="h-3 w-3 text-muted-foreground" />
                      )}
                    </Button>
                    <span className={cn(
                      subtask.done && 'line-through text-muted-foreground'
                    )}>
                      {subtask.title}
                    </span>
                  </div>
                ))}
                
                {task.subtasks.length > 3 && (
                  <p className="text-xs text-muted-foreground pl-6">
                    +{task.subtasks.length - 3} more subtasks
                  </p>
                )}
              </div>
            )}

            {/* Links */}
            {task.links && task.links.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {task.links.slice(0, 2).map((link) => (
                  <Badge
                    key={link.id}
                    variant="outline"
                    className="text-xs cursor-pointer hover:bg-accent"
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(link.url, '_blank')
                    }}
                  >
                    <ExternalLink className="h-2 w-2 mr-1" />
                    {link.label}
                  </Badge>
                ))}
                {task.links.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{task.links.length - 2} more
                  </Badge>
                )}
              </div>
            )}

            {/* Quick add subtask */}
            {showAddSubtask ? (
              <form onSubmit={handleAddSubtask} onClick={(e) => e.stopPropagation()}>
                <div className="flex gap-2">
                  <Input
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    placeholder="Add a subtask..."
                    className="h-8 text-sm"
                    autoFocus
                    onBlur={() => {
                      if (!newSubtaskTitle.trim()) {
                        setShowAddSubtask(false)
                      }
                    }}
                  />
                  <Button type="submit" size="sm" className="h-8">
                    Add
                  </Button>
                </div>
              </form>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-muted-foreground hover:text-foreground"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowAddSubtask(true)
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add subtask
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
