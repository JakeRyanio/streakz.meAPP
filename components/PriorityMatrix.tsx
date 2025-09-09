'use client'

import { PriorityType, PRIORITY_LABELS } from '@/lib/types'
import { cn } from '@/lib/utils'

interface PriorityMatrixProps {
  value: PriorityType
  onChange: (priority: PriorityType) => void
  disabled?: boolean
}

export function PriorityMatrix({ value, onChange, disabled }: PriorityMatrixProps) {
  const matrixItems = [
    {
      priority: 'UI' as PriorityType,
      label: 'Do Now',
      description: 'Urgent & Important',
      color: 'bg-red-100 hover:bg-red-200 border-red-300 text-red-900 dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:border-red-700 dark:text-red-100',
      selectedColor: 'bg-red-200 border-red-500 dark:bg-red-900/40 dark:border-red-500',
      position: 'top-left'
    },
    {
      priority: 'UN' as PriorityType,
      label: 'Quick',
      description: 'Urgent & Not Important',
      color: 'bg-orange-100 hover:bg-orange-200 border-orange-300 text-orange-900 dark:bg-orange-900/20 dark:hover:bg-orange-900/30 dark:border-orange-700 dark:text-orange-100',
      selectedColor: 'bg-orange-200 border-orange-500 dark:bg-orange-900/40 dark:border-orange-500',
      position: 'top-right'
    },
    {
      priority: 'NI' as PriorityType,
      label: 'Schedule',
      description: 'Not Urgent & Important',
      color: 'bg-blue-100 hover:bg-blue-200 border-blue-300 text-blue-900 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 dark:border-blue-700 dark:text-blue-100',
      selectedColor: 'bg-blue-200 border-blue-500 dark:bg-blue-900/40 dark:border-blue-500',
      position: 'bottom-left'
    },
    {
      priority: 'NN' as PriorityType,
      label: 'Maybe',
      description: 'Not Urgent & Not Important',
      color: 'bg-gray-100 hover:bg-gray-200 border-gray-300 text-gray-900 dark:bg-gray-800/20 dark:hover:bg-gray-800/30 dark:border-gray-700 dark:text-gray-100',
      selectedColor: 'bg-gray-200 border-gray-500 dark:bg-gray-800/40 dark:border-gray-500',
      position: 'bottom-right'
    }
  ]

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium">Priority Matrix</div>
      
      {/* Matrix Grid */}
      <div className="relative">
        {/* Axis Labels */}
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground font-medium">
          URGENT
        </div>
        <div className="absolute -left-12 top-1/2 transform -translate-y-1/2 -rotate-90 text-xs text-muted-foreground font-medium">
          IMPORTANT
        </div>
        
        {/* Grid */}
        <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
          {matrixItems.map((item) => (
            <button
              key={item.priority}
              type="button"
              disabled={disabled}
              onClick={() => onChange(item.priority)}
              className={cn(
                'relative p-4 rounded-lg border-2 transition-all text-left min-h-[80px] flex flex-col justify-center',
                value === item.priority 
                  ? item.selectedColor
                  : item.color,
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              <div className="font-semibold text-sm">{item.label}</div>
              <div className="text-xs opacity-75 mt-1">{item.description}</div>
              
              {/* Selection indicator */}
              {value === item.priority && (
                <div className="absolute top-1 right-1 w-3 h-3 rounded-full bg-current opacity-60" />
              )}
            </button>
          ))}
        </div>
        
        {/* Grid lines for visual reference */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-border" />
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border" />
        </div>
      </div>
      
      {/* Legend */}
      <div className="text-xs text-muted-foreground">
        <div className="flex justify-between">
          <span>← Not Urgent</span>
          <span>Urgent →</span>
        </div>
        <div className="flex flex-col items-start mt-1">
          <span>↑ Important</span>
          <span className="mt-8">↓ Not Important</span>
        </div>
      </div>
    </div>
  )
}
