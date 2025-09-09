import { Task } from './types'
import { getTodayString, wasYesterday, isToday } from './tz'

export function calculateStreak(task: Task, timezone: string): number {
  if (!task.is_daily || !task.daily_meta) {
    return 0
  }

  const { lastCompletedDate, currentStreak = 0 } = task.daily_meta
  
  if (!lastCompletedDate) {
    return 0
  }

  const today = getTodayString(timezone)
  
  // If completed today, return current streak
  if (lastCompletedDate === today) {
    return currentStreak
  }
  
  // If last completed was yesterday, streak continues
  if (wasYesterday(new Date(lastCompletedDate + 'T00:00:00'), timezone)) {
    return currentStreak
  }
  
  // Otherwise, streak is broken
  return 0
}

export function updateStreakOnCompletion(task: Task, timezone: string): Task {
  if (!task.is_daily) {
    return task
  }

  const today = getTodayString(timezone)
  const currentMeta = task.daily_meta || { currentStreak: 0 }
  const { lastCompletedDate, currentStreak = 0, bestStreak = 0 } = currentMeta

  let newStreak = 1

  // If already completed today, don't change streak
  if (lastCompletedDate === today) {
    newStreak = currentStreak
  } else if (lastCompletedDate && wasYesterday(new Date(lastCompletedDate + 'T00:00:00'), timezone)) {
    // Continue streak from yesterday
    newStreak = currentStreak + 1
  }

  const newBestStreak = Math.max(bestStreak, newStreak)

  return {
    ...task,
    completed_at: new Date().toISOString(),
    daily_meta: {
      lastCompletedDate: today,
      currentStreak: newStreak,
      bestStreak: newBestStreak
    }
  }
}

export function resetDailyTaskIfNeeded(task: Task, timezone: string): Task {
  if (!task.is_daily || !task.completed_at) {
    return task
  }

  // If task was completed today, leave it as is
  if (isToday(task.completed_at, timezone)) {
    return task
  }

  // Reset completion for new day
  return {
    ...task,
    completed_at: undefined,
    completion: {
      completedCount: 0,
      total: task.subtasks?.length || 0
    }
  }
}

export function getBestStreak(tasks: Task[]): number {
  return tasks
    .filter(task => task.is_daily && task.daily_meta?.bestStreak)
    .reduce((max, task) => Math.max(max, task.daily_meta!.bestStreak!), 0)
}

export function getCurrentStreaks(tasks: Task[], timezone: string): { task: Task; streak: number }[] {
  return tasks
    .filter(task => task.is_daily)
    .map(task => ({
      task,
      streak: calculateStreak(task, timezone)
    }))
    .filter(({ streak }) => streak > 0)
    .sort((a, b) => b.streak - a.streak)
}
