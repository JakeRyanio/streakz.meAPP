'use client'

import { useState } from 'react'
import { Filter as FilterIcon, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { PriorityType, PRIORITY_LABELS } from '@/lib/types'

export interface TaskFilters {
  priorities: PriorityType[]
  showDaily: boolean
  showRegular: boolean
  showCompleted: boolean
  showWithSubtasks: boolean
  showWithLinks: boolean
}

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  filters: TaskFilters
  onFiltersChange: (filters: TaskFilters) => void
}

const DEFAULT_FILTERS: TaskFilters = {
  priorities: ['UI', 'UN', 'NI', 'NN'],
  showDaily: true,
  showRegular: true,
  showCompleted: false,
  showWithSubtasks: true,
  showWithLinks: true
}

export function FilterModal({ isOpen, onClose, filters, onFiltersChange }: FilterModalProps) {
  const [localFilters, setLocalFilters] = useState<TaskFilters>(filters)

  const handlePriorityToggle = (priority: PriorityType) => {
    const newPriorities = localFilters.priorities.includes(priority)
      ? localFilters.priorities.filter(p => p !== priority)
      : [...localFilters.priorities, priority]
    
    setLocalFilters({ ...localFilters, priorities: newPriorities })
  }

  const handleApply = () => {
    onFiltersChange(localFilters)
    onClose()
  }

  const handleReset = () => {
    setLocalFilters(DEFAULT_FILTERS)
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (localFilters.priorities.length < 4) count++
    if (!localFilters.showDaily || !localFilters.showRegular) count++
    if (localFilters.showCompleted) count++
    if (!localFilters.showWithSubtasks || !localFilters.showWithLinks) count++
    return count
  }

  const priorityColors = {
    UI: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/20 dark:text-red-200 dark:border-red-700',
    UN: 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/20 dark:text-orange-200 dark:border-orange-700',
    NI: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/20 dark:text-blue-200 dark:border-blue-700',
    NN: 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800/20 dark:text-gray-200 dark:border-gray-700'
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FilterIcon className="w-5 h-5" />
              Filter Tasks
            </div>
            {getActiveFilterCount() > 0 && (
              <Badge variant="secondary">
                {getActiveFilterCount()} active
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Priority Filters */}
          <div className="space-y-3">
            <Label>Priority</Label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(PRIORITY_LABELS).map(([key, label]) => {
                const priority = key as PriorityType
                const isSelected = localFilters.priorities.includes(priority)
                
                return (
                  <button
                    key={priority}
                    onClick={() => handlePriorityToggle(priority)}
                    className={`
                      flex items-center justify-between p-3 rounded-lg border-2 transition-all text-left
                      ${isSelected 
                        ? priorityColors[priority] 
                        : 'border-border bg-background hover:bg-accent'
                      }
                    `}
                  >
                    <span className="font-medium text-sm">{label}</span>
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-current" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Task Type Filters */}
          <div className="space-y-3">
            <Label>Task Types</Label>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Daily Tasks</div>
                  <div className="text-xs text-muted-foreground">
                    Tasks that repeat every day
                  </div>
                </div>
                <Switch
                  checked={localFilters.showDaily}
                  onCheckedChange={(checked) => 
                    setLocalFilters({ ...localFilters, showDaily: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Regular Tasks</div>
                  <div className="text-xs text-muted-foreground">
                    One-time tasks
                  </div>
                </div>
                <Switch
                  checked={localFilters.showRegular}
                  onCheckedChange={(checked) => 
                    setLocalFilters({ ...localFilters, showRegular: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Completed Tasks</div>
                  <div className="text-xs text-muted-foreground">
                    Show finished tasks
                  </div>
                </div>
                <Switch
                  checked={localFilters.showCompleted}
                  onCheckedChange={(checked) => 
                    setLocalFilters({ ...localFilters, showCompleted: checked })
                  }
                />
              </div>
            </div>
          </div>

          {/* Content Filters */}
          <div className="space-y-3">
            <Label>Content</Label>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Tasks with Subtasks</div>
                  <div className="text-xs text-muted-foreground">
                    Tasks that have subtasks
                  </div>
                </div>
                <Switch
                  checked={localFilters.showWithSubtasks}
                  onCheckedChange={(checked) => 
                    setLocalFilters({ ...localFilters, showWithSubtasks: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Tasks with Links</div>
                  <div className="text-xs text-muted-foreground">
                    Tasks that have URL links
                  </div>
                </div>
                <Switch
                  checked={localFilters.showWithLinks}
                  onCheckedChange={(checked) => 
                    setLocalFilters({ ...localFilters, showWithLinks: checked })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={handleReset}>
            Reset Filters
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleApply}>
              Apply Filters
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
