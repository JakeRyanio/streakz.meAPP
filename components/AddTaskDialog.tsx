'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
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
import { PriorityMatrix } from '@/components/PriorityMatrix'
import { PriorityType } from '@/lib/types'
import { CreateTaskInput } from '@/lib/validations'
import { useTaskUI } from '@/store/useTaskUI'
import { toast } from 'sonner'

interface AddTaskDialogProps {
  onTaskCreate?: (task: CreateTaskInput) => Promise<void>
}

export function AddTaskDialog({ onTaskCreate }: AddTaskDialogProps) {
  const { isAddTaskOpen, closeAddTask } = useTaskUI()
  const [isLoading, setIsLoading] = useState(false)
  
  const [formData, setFormData] = useState<CreateTaskInput>({
    title: '',
    description: '',
    is_daily: false,
    priority: 'NI',
    order_index: 0
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast.error('Task title is required')
      return
    }

    setIsLoading(true)
    
    try {
      await onTaskCreate?.(formData)
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        is_daily: false,
        priority: 'NI',
        order_index: 0
      })
      
      closeAddTask()
      toast.success('Task created successfully!')
    } catch (error) {
      console.error('Error creating task:', error)
      toast.error('Failed to create task')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isAddTaskOpen} onOpenChange={closeAddTask}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="What needs to be done?"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add more details... (optional)"
              disabled={isLoading}
              rows={3}
            />
          </div>
          
          <div className="space-y-4">
            <PriorityMatrix
              value={formData.priority}
              onChange={(priority) => setFormData({ ...formData, priority })}
              disabled={isLoading}
            />
            
            <div className="space-y-2">
              <Label htmlFor="is_daily">Daily Task</Label>
              <div className="flex items-center space-x-2">
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
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={closeAddTask}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                'Creating...'
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Task
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
