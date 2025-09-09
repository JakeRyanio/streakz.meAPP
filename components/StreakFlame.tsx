import { Flame } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StreakFlameProps {
  count: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function StreakFlame({ count, size = 'md', className }: StreakFlameProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl'
  }

  if (count === 0) {
    return (
      <div className={cn('flex items-center gap-2 text-muted-foreground', className)}>
        <Flame className={cn(sizeClasses[size], 'opacity-50')} />
        <span className={cn('font-bold', textSizeClasses[size])}>0</span>
      </div>
    )
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Flame 
        className={cn(
          sizeClasses[size],
          count > 0 ? 'text-orange-500 animate-pulse' : 'text-muted-foreground opacity-50'
        )} 
        fill={count > 0 ? 'currentColor' : 'none'}
      />
      <span className={cn(
        'font-bold',
        textSizeClasses[size],
        count > 0 ? 'text-orange-500' : 'text-muted-foreground'
      )}>
        {count}
      </span>
    </div>
  )
}
