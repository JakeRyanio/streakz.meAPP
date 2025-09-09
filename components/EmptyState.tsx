import { Plus, CheckCircle2, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface EmptyStateProps {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  icon?: 'plus' | 'check' | 'target'
}

export function EmptyState({ 
  title, 
  description, 
  actionLabel, 
  onAction, 
  icon = 'plus' 
}: EmptyStateProps) {
  const IconComponent = {
    plus: Plus,
    check: CheckCircle2,
    target: Target
  }[icon]

  return (
    <Card className="p-8 text-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
          <IconComponent className="w-8 h-8 text-muted-foreground" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            {description}
          </p>
        </div>
        
        {actionLabel && onAction && (
          <Button onClick={onAction} className="mt-4">
            <Plus className="w-4 h-4 mr-2" />
            {actionLabel}
          </Button>
        )}
      </div>
    </Card>
  )
}
