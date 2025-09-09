import { z } from 'zod'

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
  description: z.string().optional(),
  is_daily: z.boolean().default(false),
  priority: z.enum(['UI', 'UN', 'NI', 'NN']).default('NI'),
  order_index: z.number().default(0)
})

export const updateTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title too long').optional(),
  description: z.string().optional(),
  is_daily: z.boolean().optional(),
  priority: z.enum(['UI', 'UN', 'NI', 'NN']).optional(),
  order_index: z.number().optional(),
  completed_at: z.string().optional(),
  completion: z.object({
    completedCount: z.number(),
    total: z.number()
  }).optional(),
  daily_meta: z.object({
    lastCompletedDate: z.string().optional(),
    currentStreak: z.number(),
    bestStreak: z.number().optional()
  }).optional()
})

export const createSubtaskSchema = z.object({
  task_id: z.string().uuid(),
  title: z.string().min(1, 'Title is required').max(255, 'Title too long')
})

export const updateSubtaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title too long').optional(),
  done: z.boolean().optional()
})

export const createTaskLinkSchema = z.object({
  task_id: z.string().uuid(),
  label: z.string().min(1, 'Label is required').max(100, 'Label too long'),
  url: z.string().url('Invalid URL')
})

export const updateTaskLinkSchema = z.object({
  label: z.string().min(1, 'Label is required').max(100, 'Label too long').optional(),
  url: z.string().url('Invalid URL').optional()
})

export const updateSettingsSchema = z.object({
  timezone: z.string().optional(),
  sort_mode: z.enum(['priorityThenManual', 'manualOnly']).optional(),
  show_completed: z.boolean().optional()
})

export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>
export type CreateSubtaskInput = z.infer<typeof createSubtaskSchema>
export type UpdateSubtaskInput = z.infer<typeof updateSubtaskSchema>
export type CreateTaskLinkInput = z.infer<typeof createTaskLinkSchema>
export type UpdateTaskLinkInput = z.infer<typeof updateTaskLinkSchema>
export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>
