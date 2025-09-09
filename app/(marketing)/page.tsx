'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Target, Focus, TrendingUp, Zap } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { AuthCard } from '@/components/AuthCard'
import { useAuth } from '@/app/providers'

export default function LandingPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && !loading) {
      router.push('/tasks')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin">
          <Logo size="lg" />
        </div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-4rem)]">
          {/* Left side - Hero */}
          <div className="space-y-8 text-white">
            <div className="flex items-center gap-3">
              <Logo size="lg" />
              <h1 className="text-3xl font-bold">Streakz</h1>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-5xl font-bold leading-tight">
                Get sh*t done.<br />
                <span className="text-emerald-300">Every day.</span>
              </h2>
              
              <p className="text-xl text-emerald-100 max-w-md">
                Build unstoppable momentum with daily streaks, smart prioritization, 
                and the satisfaction of consistent progress.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Prioritize</h3>
                  <p className="text-sm text-emerald-100">
                    Use the Eisenhower Matrix to focus on what truly matters
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <Focus className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Focus</h3>
                  <p className="text-sm text-emerald-100">
                    Break down complex tasks into manageable subtasks
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Track</h3>
                  <p className="text-sm text-emerald-100">
                    Visualize your progress with detailed completion history
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Celebrate</h3>
                  <p className="text-sm text-emerald-100">
                    Build momentum with daily streaks and achievements
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side - Auth */}
          <div className="flex justify-center lg:justify-end">
            <AuthCard />
          </div>
        </div>
      </div>
    </div>
  )
}
