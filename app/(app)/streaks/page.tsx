'use client'

import { useState, useEffect } from 'react'
import { Calendar, Trophy, Target, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StreakFlame } from '@/components/StreakFlame'
import { PriorityBadge } from '@/components/PriorityBadge'
import { EmptyState } from '@/components/EmptyState'
import { Task, Settings as UserSettings } from '@/lib/types'
import { getCurrentStreaks, getBestStreak } from '@/lib/streaks'
import { formatDateForTimezone } from '@/lib/tz'
import { toast } from 'sonner'

export default function StreaksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [tasksResponse, settingsResponse] = await Promise.all([
        fetch('/api/tasks'),
        fetch('/api/settings')
      ])

      if (!tasksResponse.ok) throw new Error('Failed to fetch tasks')
      if (!settingsResponse.ok) throw new Error('Failed to fetch settings')

      const [fetchedTasks, userSettings] = await Promise.all([
        tasksResponse.json(),
        settingsResponse.json()
      ])

      setTasks(fetchedTasks)
      setSettings(userSettings)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load streak data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Streaks</h1>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  const timezone = settings?.timezone || 'UTC'
  const currentStreaks = getCurrentStreaks(tasks, timezone)
  const bestStreak = getBestStreak(tasks)
  const completedTasks = tasks.filter(task => task.completed_at)
  const totalCompleted = completedTasks.length
  const dailyTasksCompleted = completedTasks.filter(task => task.is_daily).length

  // Group completed tasks by date
  const tasksByDate = completedTasks.reduce((acc, task) => {
    if (!task.completed_at) return acc
    
    const date = formatDateForTimezone(new Date(task.completed_at), timezone, 'yyyy-MM-dd')
    if (!acc[date]) acc[date] = []
    acc[date].push(task)
    return acc
  }, {} as Record<string, Task[]>)

  const sortedDates = Object.keys(tasksByDate).sort((a, b) => b.localeCompare(a))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Streaks</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streaks</CardTitle>
            <StreakFlame count={currentStreaks.length} size="sm" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentStreaks.reduce((sum, { streak }) => sum + streak, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total streak days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Streak</CardTitle>
            <Trophy className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bestStreak}</div>
            <p className="text-xs text-muted-foreground">
              Days in a row
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Tasks</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dailyTasksCompleted}</div>
            <p className="text-xs text-muted-foreground">
              Completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <Target className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCompleted}</div>
            <p className="text-xs text-muted-foreground">
              All completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Active Streaks */}
      {currentStreaks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <StreakFlame count={1} size="md" />
              Active Streaks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentStreaks.map(({ task, streak }) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <div>
                      <h4 className="font-medium">{task.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        Daily task
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <PriorityBadge priority={task.priority} />
                    <StreakFlame count={streak} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completion History */}
      <Card>
        <CardHeader>
          <CardTitle>Completion History</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedDates.length > 0 ? (
            <div className="space-y-6">
              {sortedDates.slice(0, 10).map(date => (
                <div key={date} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">
                      {formatDateForTimezone(new Date(date + 'T00:00:00'), timezone, 'EEEE, MMMM d, yyyy')}
                    </h3>
                    <Badge variant="outline">
                      {tasksByDate[date].length} tasks
                    </Badge>
                  </div>
                  
                  <div className="grid gap-3 pl-4">
                    {tasksByDate[date].map(task => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border border-green-200 dark:border-green-800"
                      >
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{task.title}</span>
                              {task.is_daily && (
                                <Badge variant="outline" className="text-xs">
                                  Daily
                                </Badge>
                              )}
                            </div>
                            {task.completed_at && (
                              <p className="text-xs text-muted-foreground">
                                Completed at {formatDateForTimezone(new Date(task.completed_at), timezone, 'h:mm a')}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-500 hover:bg-green-600 text-white font-bold text-xs">
                            SMASHED! 🎉
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              {sortedDates.length > 10 && (
                <p className="text-sm text-muted-foreground text-center">
                  Showing recent 10 days. {sortedDates.length - 10} more days of history available.
                </p>
              )}
            </div>
          ) : (
            <EmptyState
              title="No completed tasks yet"
              description="Complete some tasks to see your progress and streaks here."
              icon="check"
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
