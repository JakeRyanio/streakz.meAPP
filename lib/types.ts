export interface Task {
  id: string
  user_id: string
  title: string
  description?: string
  is_daily: boolean
  priority: 'UI' | 'UN' | 'NI' | 'NN'
  order_index: number
  completed_at?: string
  completion: {
    completedCount: number
    total: number
  }
  daily_meta?: {
    lastCompletedDate?: string
    currentStreak: number
    bestStreak?: number
  }
  created_at: string
  updated_at: string
  subtasks?: Subtask[]
  links?: TaskLink[]
}

export interface Subtask {
  id: string
  task_id: string
  user_id: string
  title: string
  done: boolean
  created_at: string
}

export interface TaskLink {
  id: string
  task_id: string
  user_id: string
  label: string
  url: string
  created_at: string
}

export interface Settings {
  id: string
  user_id: string
  timezone: string
  sort_mode: 'priorityThenManual' | 'manualOnly'
  show_completed: boolean
  created_at: string
}

export type PriorityType = 'UI' | 'UN' | 'NI' | 'NN'

export const PRIORITY_LABELS = {
  UI: 'Do Now',
  UN: 'Quick',
  NI: 'Schedule',
  NN: 'Maybe'
} as const

export const PRIORITY_COLORS = {
  UI: 'destructive',
  UN: 'amber',
  NI: 'blue',
  NN: 'muted'
} as const
