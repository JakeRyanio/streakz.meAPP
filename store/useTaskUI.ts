import { create } from 'zustand'
import { Task, Subtask } from '@/lib/types'

interface TaskUIState {
  // Modal states
  activeTaskId: string | null
  isTaskDetailOpen: boolean
  isAddTaskOpen: boolean
  
  // DnD state
  draggedTaskId: string | null
  dragOverTaskId: string | null
  
  // Optimistic updates
  optimisticTasks: Task[]
  optimisticSubtasks: Record<string, Subtask[]>
  
  // Actions
  setActiveTask: (taskId: string | null) => void
  openTaskDetail: (taskId: string) => void
  closeTaskDetail: () => void
  openAddTask: () => void
  closeAddTask: () => void
  
  setDraggedTask: (taskId: string | null) => void
  setDragOverTask: (taskId: string | null) => void
  
  setOptimisticTasks: (tasks: Task[]) => void
  updateOptimisticTask: (taskId: string, updates: Partial<Task>) => void
  addOptimisticTask: (task: Task) => void
  removeOptimisticTask: (taskId: string) => void
  
  setOptimisticSubtasks: (taskId: string, subtasks: Subtask[]) => void
  addOptimisticSubtask: (taskId: string, subtask: Subtask) => void
  updateOptimisticSubtask: (taskId: string, subtaskId: string, updates: Partial<Subtask>) => void
  removeOptimisticSubtask: (taskId: string, subtaskId: string) => void
  
  reset: () => void
}

const initialState = {
  activeTaskId: null,
  isTaskDetailOpen: false,
  isAddTaskOpen: false,
  draggedTaskId: null,
  dragOverTaskId: null,
  optimisticTasks: [],
  optimisticSubtasks: {}
}

export const useTaskUI = create<TaskUIState>((set, get) => ({
  ...initialState,
  
  setActiveTask: (taskId) => set({ activeTaskId: taskId }),
  
  openTaskDetail: (taskId) => set({ 
    activeTaskId: taskId, 
    isTaskDetailOpen: true 
  }),
  
  closeTaskDetail: () => set({ 
    activeTaskId: null, 
    isTaskDetailOpen: false 
  }),
  
  openAddTask: () => set({ isAddTaskOpen: true }),
  closeAddTask: () => set({ isAddTaskOpen: false }),
  
  setDraggedTask: (taskId) => set({ draggedTaskId: taskId }),
  setDragOverTask: (taskId) => set({ dragOverTaskId: taskId }),
  
  setOptimisticTasks: (tasks) => set({ optimisticTasks: tasks }),
  
  updateOptimisticTask: (taskId, updates) => set((state) => ({
    optimisticTasks: state.optimisticTasks.map(task =>
      task.id === taskId ? { ...task, ...updates } : task
    )
  })),
  
  addOptimisticTask: (task) => set((state) => ({
    optimisticTasks: [...state.optimisticTasks, task]
  })),
  
  removeOptimisticTask: (taskId) => set((state) => ({
    optimisticTasks: state.optimisticTasks.filter(task => task.id !== taskId)
  })),
  
  setOptimisticSubtasks: (taskId, subtasks) => set((state) => ({
    optimisticSubtasks: {
      ...state.optimisticSubtasks,
      [taskId]: subtasks
    }
  })),
  
  addOptimisticSubtask: (taskId, subtask) => set((state) => ({
    optimisticSubtasks: {
      ...state.optimisticSubtasks,
      [taskId]: [...(state.optimisticSubtasks[taskId] || []), subtask]
    }
  })),
  
  updateOptimisticSubtask: (taskId, subtaskId, updates) => set((state) => ({
    optimisticSubtasks: {
      ...state.optimisticSubtasks,
      [taskId]: (state.optimisticSubtasks[taskId] || []).map(subtask =>
        subtask.id === subtaskId ? { ...subtask, ...updates } : subtask
      )
    }
  })),
  
  removeOptimisticSubtask: (taskId, subtaskId) => set((state) => ({
    optimisticSubtasks: {
      ...state.optimisticSubtasks,
      [taskId]: (state.optimisticSubtasks[taskId] || []).filter(
        subtask => subtask.id !== subtaskId
      )
    }
  })),
  
  reset: () => set(initialState)
}))
