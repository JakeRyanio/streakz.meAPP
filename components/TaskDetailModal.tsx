'use client'

import { useState, useEffect } from 'react'
import { Trash2, Plus, ExternalLink, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { PriorityBadge } from './PriorityBadge'
import { Task, Subtask, TaskLink, PriorityType, PRIORITY_LABELS } from '@/lib/types'
import { UpdateTaskInput } from '@/lib/validations'
import { useTaskUI } from '@/store/useTaskUI'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface TaskDetailModalProps {
  task?: Task
  onTaskUpdate?: (taskId: string, updates: UpdateTaskInput) => Promise<void>
  onTaskDelete?: (taskId: string) => Promise<void>
  onSubtaskAdd?: (taskId: string, title: string) => Promise<void>
  onSubtaskUpdate?: (subtask: Subtask) => Promise<void>
  onSubtaskDelete?: (subtaskId: string) => Promise<void>
  onLinkAdd?: (taskId: string, label: string, url: string) => Promise<void>
  onLinkDelete?: (linkId: string) => Promise<void>
}

export function TaskDetailModal({
  task,
  onTaskUpdate,
  onTaskDelete,
  onSubtaskAdd,
  onSubtaskUpdate,
  onSubtaskDelete,
  onLinkAdd,
  onLinkDelete
}: TaskDetailModalProps) {
  const { isTaskDetailOpen, closeTaskDetail } = useTaskUI()
  const [isLoading, setIsLoading] = useState(false)
  const [showAddSubtask, setShowAddSubtask] = useState(false)
  const [showAddLink, setShowAddLink] = useState(false)
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('')
  const [newLinkLabel, setNewLinkLabel] = useState('')
  const [newLinkUrl, setNewLinkUrl] = useState('')
  
  const [formData, setFormData] = useState<UpdateTaskInput>({
    title: '',
    description: '',
    is_daily: false,
    priority: 'NI'
  })

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        is_daily: task.is_daily,
        priority: task.priority
      })
    }
  }, [task])

  if (!task) return null

  const completionPercentage = task.completion.total > 0 
    ? Math.round((task.completion.completedCount / task.completion.total) * 100)
    : 0

  const handleUpdate = async () => {
    if (!task || !formData.title?.trim()) {
      toast.error('Task title is required')
      return
    }

    setIsLoading(true)
    
    try {
      await onTaskUpdate?.(task.id, formData)
      toast.success('Task updated successfully!')
    } catch (error) {
      console.error('Error updating task:', error)
      toast.error('Failed to update task')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!task) return
    
    if (!confirm('Are you sure you want to delete this task?')) {
      return
    }

    setIsLoading(true)
    
    try {
      await onTaskDelete?.(task.id)
      closeTaskDetail()
      toast.success('Task deleted successfully!')
    } catch (error) {
      console.error('Error deleting task:', error)
      toast.error('Failed to delete task')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddSubtask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSubtaskTitle.trim()) return

    try {
      await onSubtaskAdd?.(task.id, newSubtaskTitle.trim())
      setNewSubtaskTitle('')
      setShowAddSubtask(false)
      toast.success('Subtask added!')
    } catch (error) {
      console.error('Error adding subtask:', error)
      toast.error('Failed to add subtask')
    }
  }

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newLinkLabel.trim() || !newLinkUrl.trim()) return

    try {
      await onLinkAdd?.(task.id, newLinkLabel.trim(), newLinkUrl.trim())
      setNewLinkLabel('')
      setNewLinkUrl('')
      setShowAddLink(false)
      toast.success('Link added!')
    } catch (error) {
      console.error('Error adding link:', error)
      toast.error('Failed to add link')
    }
  }

  return (
    <Dialog open={isTaskDetailOpen} onOpenChange={closeTaskDetail}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Task Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Task title"
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Add more details..."
                disabled={isLoading}
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: PriorityType) => 
                    setFormData({ ...formData, priority: value })
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PRIORITY_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="is_daily">Daily Task</Label>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="is_daily"
                    checked={formData.is_daily}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, is_daily: checked })
                    }
                    disabled={isLoading}
                  />
                  <Label htmlFor="is_daily" className="text-sm text-muted-foreground">
                    Repeat daily
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {/* Progress */}
          {task.subtasks && task.subtasks.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Progress</Label>
                <span className="text-sm font-medium">{completionPercentage}%</span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {task.completion.completedCount} of {task.completion.total} subtasks completed
              </p>
            </div>
          )}

          {/* Subtasks */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Subtasks</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddSubtask(true)}
                disabled={isLoading}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Subtask
              </Button>
            </div>
            
            {showAddSubtask && (
              <form onSubmit={handleAddSubtask} className="flex gap-2">
                <Input
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  placeholder="Subtask title"
                  autoFocus
                />
                <Button type="submit" size="sm">Add</Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setShowAddSubtask(false)
                    setNewSubtaskTitle('')
                  }}
                >
                  Cancel
                </Button>
              </form>
            )}
            
            <div className="space-y-2">
              {task.subtasks?.map((subtask) => (
                <div
                  key={subtask.id}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={subtask.done}
                      onCheckedChange={(checked) => 
                        onSubtaskUpdate?.({ ...subtask, done: checked })
                      }
                      disabled={isLoading}
                    />
                    <span className={cn(
                      subtask.done && 'line-through text-muted-foreground'
                    )}>
                      {subtask.title}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSubtaskDelete?.(subtask.id)}
                    disabled={isLoading}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Links</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddLink(true)}
                disabled={isLoading}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Link
              </Button>
            </div>
            
            {showAddLink && (
              <form onSubmit={handleAddLink} className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={newLinkLabel}
                    onChange={(e) => setNewLinkLabel(e.target.value)}
                    placeholder="Link label"
                  />
                  <Input
                    value={newLinkUrl}
                    onChange={(e) => setNewLinkUrl(e.target.value)}
                    placeholder="https://..."
                    type="url"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" size="sm">Add Link</Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setShowAddLink(false)
                      setNewLinkLabel('')
                      setNewLinkUrl('')
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
            
            <div className="flex flex-wrap gap-2">
              {task.links?.map((link) => (
                <Badge
                  key={link.id}
                  variant="outline"
                  className="flex items-center gap-2 cursor-pointer hover:bg-accent"
                >
                  <ExternalLink 
                    className="w-3 h-3" 
                    onClick={() => window.open(link.url, '_blank')}
                  />
                  <span onClick={() => window.open(link.url, '_blank')}>
                    {link.label}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => onLinkDelete?.(link.id)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4">
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Task
            </Button>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={closeTaskDetail}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdate}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
