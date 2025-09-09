import { Badge } from '@/components/ui/badge'
import { PriorityType, PRIORITY_LABELS, PRIORITY_COLORS } from '@/lib/types'

interface PriorityBadgeProps {
  priority: PriorityType
  className?: string
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const variant = PRIORITY_COLORS[priority] as 'destructive' | 'amber' | 'blue' | 'muted'
  
  return (
    <Badge variant={variant} className={className}>
      {PRIORITY_LABELS[priority]}
    </Badge>
  )
}
