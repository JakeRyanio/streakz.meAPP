'use client'

import { useState, useEffect } from 'react'
import { Calendar, Filter, Settings } from 'lucide-react'
import { TaskCard } from '@/components/TaskCard'
import { DraggableTaskList } from '@/components/DraggableTaskList'
import { AddTaskDialog } from '@/components/AddTaskDialog'
import { TaskDetailModal } from '@/components/TaskDetailModal'
import { EmptyState } from '@/components/EmptyState'
import { StreakCelebration } from '@/components/StreakCelebration'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Task, Subtask, Settings as UserSettings, TaskLink } from '@/lib/types'
import { CreateTaskInput, UpdateTaskInput } from '@/lib/validations'
import { groupTasksByPriority, sortTasks } from '@/lib/sort'
import { updateStreakOnCompletion, resetDailyTaskIfNeeded } from '@/lib/streaks'
import { getTodayString } from '@/lib/tz'
import { useTaskUI } from '@/store/useTaskUI'
import { toast } from 'sonner'

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [celebrationStreak, setCelebrationStreak] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)
  
  const { activeTaskId, openTaskDetail } = useTaskUI()

  const activeTask = tasks.find(t => t.id === activeTaskId)

  useEffect(() => {
    fetchTasks()
    fetchSettings()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks')
      if (!response.ok) throw new Error('Failed to fetch tasks')
      
      const fetchedTasks = await response.json()
      
      // Reset daily tasks if needed
      const timezone = settings?.timezone || 'UTC'
      const processedTasks = fetchedTasks.map((task: Task) => 
        resetDailyTaskIfNeeded(task, timezone)
      )
      
      setTasks(processedTasks)
    } catch (error) {
      console.error('Error fetching tasks:', error)
      toast.error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      if (!response.ok) throw new Error('Failed to fetch settings')
      
      const userSettings = await response.json()
      setSettings(userSettings)
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
  }

  const handleCreateTask = async (taskData: CreateTaskInput) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      })

      if (!response.ok) throw new Error('Failed to create task')
      
      const newTask = await response.json()
      setTasks(prev => [...prev, { ...newTask, subtasks: [], links: [] }])
    } catch (error) {
      console.error('Error creating task:', error)
      throw error
    }
  }

  const handleUpdateTask = async (taskId: string, updates: UpdateTaskInput) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      if (!response.ok) throw new Error('Failed to update task')
      
      const updatedTask = await response.json()
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, ...updatedTask } : task
      ))
    } catch (error) {
      console.error('Error updating task:', error)
      throw error
    }
  }

  const handleCompleteTask = async (task: Task) => {
    try {
      const timezone = settings?.timezone || 'UTC'
      const updatedTask = updateStreakOnCompletion(task, timezone)
      
      await handleUpdateTask(task.id, {
        completed_at: updatedTask.completed_at,
        daily_meta: updatedTask.daily_meta
      })

      // Show celebration for daily tasks
      if (task.is_daily && updatedTask.daily_meta?.currentStreak) {
        setCelebrationStreak(updatedTask.daily_meta.currentStreak)
        setShowCelebration(true)
      }
    } catch (error) {
      console.error('Error completing task:', error)
      toast.error('Failed to complete task')
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete task')
      
      setTasks(prev => prev.filter(task => task.id !== taskId))
    } catch (error) {
      console.error('Error deleting task:', error)
      throw error
    }
  }

  const handleAddSubtask = async (taskId: string, title: string) => {
    try {
      const response = await fetch('/api/subtasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_id: taskId, title })
      })

      if (!response.ok) throw new Error('Failed to add subtask')
      
      const newSubtask = await response.json()
      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              subtasks: [...(task.subtasks || []), newSubtask],
              completion: {
                completedCount: task.completion.completedCount,
                total: (task.completion.total || 0) + 1
              }
            }
          : task
      ))
    } catch (error) {
      console.error('Error adding subtask:', error)
      throw error
    }
  }

  const handleToggleSubtask = async (subtask: Subtask) => {
    try {
      const response = await fetch(`/api/subtasks/${subtask.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ done: !subtask.done })
      })

      if (!response.ok) throw new Error('Failed to update subtask')
      
      setTasks(prev => prev.map(task => 
        task.id === subtask.task_id
          ? {
              ...task,
              subtasks: task.subtasks?.map(st => 
                st.id === subtask.id ? { ...st, done: !st.done } : st
              ),
              completion: {
                completedCount: task.subtasks?.filter(st => 
                  st.id === subtask.id ? !subtask.done : st.done
                ).length || 0,
                total: task.subtasks?.length || 0
              }
            }
          : task
      ))
    } catch (error) {
      console.error('Error toggling subtask:', error)
      toast.error('Failed to update subtask')
    }
  }

  const handleDeleteSubtask = async (subtaskId: string) => {
    try {
      const response = await fetch(`/api/subtasks/${subtaskId}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete subtask')
      
      setTasks(prev => prev.map(task => ({
        ...task,
        subtasks: task.subtasks?.filter(st => st.id !== subtaskId),
        completion: {
          completedCount: task.subtasks?.filter(st => 
            st.id !== subtaskId && st.done
          ).length || 0,
          total: Math.max(0, (task.subtasks?.length || 1) - 1)
        }
      })))
    } catch (error) {
      console.error('Error deleting subtask:', error)
      throw error
    }
  }

  const handleAddLink = async (taskId: string, label: string, url: string) => {
    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_id: taskId, label, url })
      })

      if (!response.ok) throw new Error('Failed to add link')
      
      const newLink = await response.json()
      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { ...task, links: [...(task.links || []), newLink] }
          : task
      ))
    } catch (error) {
      console.error('Error adding link:', error)
      throw error
    }
  }

  const handleDeleteLink = async (linkId: string) => {
    try {
      const response = await fetch(`/api/links/${linkId}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete link')
      
      setTasks(prev => prev.map(task => ({
        ...task,
        links: task.links?.filter(link => link.id !== linkId)
      })))
    } catch (error) {
      console.error('Error deleting link:', error)
      throw error
    }
  }

  const handleTasksReorder = async (reorderedTasks: Task[]) => {
    // Optimistically update the UI
    setTasks(prev => {
      const otherTasks = prev.filter(task => !reorderedTasks.find(rt => rt.id === task.id))
      return [...otherTasks, ...reorderedTasks]
    })

    // Update each task's order in the database
    try {
      await Promise.all(
        reorderedTasks.map(task =>
          fetch(`/api/tasks/${task.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order_index: task.order_index })
          })
        )
      )
    } catch (error) {
      console.error('Error updating task order:', error)
      toast.error('Failed to update task order')
      // Revert on error
      fetchTasks()
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Tasks</h1>
        </div>
        
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  const dailyTasks = tasks.filter(task => task.is_daily && !task.completed_at)
  const currentTasks = tasks.filter(task => !task.is_daily && !task.completed_at)
  const sortedCurrentTasks = sortTasks(currentTasks, settings?.sort_mode || 'priorityThenManual')
  const groupedTasks = groupTasksByPriority(sortedCurrentTasks)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Daily Tasks */}
      {dailyTasks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Daily Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DraggableTaskList
              tasks={dailyTasks}
              onTasksReorder={handleTasksReorder}
              onTaskComplete={handleCompleteTask}
              onTaskEdit={openTaskDetail}
              onAddSubtask={handleAddSubtask}
              onToggleSubtask={handleToggleSubtask}
            />
          </CardContent>
        </Card>
      )}

      {/* Current Tasks by Priority */}
      {Object.entries(groupedTasks).map(([priority, priorityTasks]) => {
        if (priorityTasks.length === 0) return null

        const priorityLabels = {
          UI: 'Do Now',
          UN: 'Quick',
          NI: 'Schedule',
          NN: 'Maybe'
        }

        const priorityColors = {
          UI: 'destructive',
          UN: 'amber',
          NI: 'blue',
          NN: 'muted'
        }

        return (
          <Card key={priority}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant={priorityColors[priority as keyof typeof priorityColors] as any}>
                  {priorityLabels[priority as keyof typeof priorityLabels]}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {priorityTasks.length} tasks
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DraggableTaskList
                tasks={priorityTasks}
                onTasksReorder={handleTasksReorder}
                onTaskComplete={handleCompleteTask}
                onTaskEdit={openTaskDetail}
                onAddSubtask={handleAddSubtask}
                onToggleSubtask={handleToggleSubtask}
              />
            </CardContent>
          </Card>
        )
      })}

      {/* Empty State */}
      {tasks.length === 0 && (
        <EmptyState
          title="No tasks yet"
          description="Create your first task to get started on your productivity journey."
          actionLabel="Add your first task"
          onAction={() => useTaskUI.getState().openAddTask()}
        />
      )}

      {/* Modals */}
      <AddTaskDialog onTaskCreate={handleCreateTask} />
      
      <TaskDetailModal
        task={activeTask}
        onTaskUpdate={handleUpdateTask}
        onTaskDelete={handleDeleteTask}
        onSubtaskAdd={handleAddSubtask}
        onSubtaskUpdate={handleToggleSubtask}
        onSubtaskDelete={handleDeleteSubtask}
        onLinkAdd={handleAddLink}
        onLinkDelete={handleDeleteLink}
      />

      {/* Celebration */}
      <StreakCelebration
        streak={celebrationStreak}
        isVisible={showCelebration}
        onComplete={() => setShowCelebration(false)}
      />
    </div>
  )
}
