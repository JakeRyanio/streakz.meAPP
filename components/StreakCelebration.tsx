'use client'

import { motion } from 'framer-motion'
import { Flame, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StreakCelebrationProps {
  streak: number
  isVisible: boolean
  onComplete?: () => void
}

export function StreakCelebration({ streak, isVisible, onComplete }: StreakCelebrationProps) {
  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      onAnimationComplete={onComplete}
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
    >
      <div className="relative">
        {/* Confetti particles */}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              opacity: 1, 
              scale: 0,
              x: 0,
              y: 0,
              rotate: 0
            }}
            animate={{ 
              opacity: 0,
              scale: [0, 1.2, 0.8],
              x: Math.cos(i * 30 * Math.PI / 180) * 100,
              y: Math.sin(i * 30 * Math.PI / 180) * 100,
              rotate: 360
            }}
            transition={{ 
              duration: 0.8,
              delay: i * 0.05,
              ease: "easeOut"
            }}
            className="absolute"
          >
            <Sparkles className="w-4 h-4 text-yellow-400" fill="currentColor" />
          </motion.div>
        ))}

        {/* Main celebration */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: [0, 1.2, 1], rotate: 0 }}
          transition={{ duration: 0.6, ease: "backOut" }}
          className="bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl p-6 shadow-2xl border-4 border-white"
        >
          <div className="text-center">
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Flame className="w-12 h-12 text-white mx-auto mb-2" fill="currentColor" />
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold text-white mb-1"
            >
              Smashed It!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-white/90"
            >
              {streak} day streak! 🔥
            </motion.p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
