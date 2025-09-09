'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Plus, LogOut, CheckSquare, Flame } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/Logo'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useAuth } from '@/app/providers'
import { useTaskUI } from '@/store/useTaskUI'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const { openAddTask } = useTaskUI()

  useEffect(() => {
    if (!user && !loading) {
      router.push('/')
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

  if (!user) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo & Navigation */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <Logo size="md" />
                <div>
                  <h1 className="font-bold text-lg">Streakz</h1>
                  <p className="text-xs text-muted-foreground">Get sh*t done. Every day.</p>
                </div>
              </div>
              
              <nav className="flex items-center gap-1">
                <Link href="/tasks">
                  <Button 
                    variant={pathname === '/tasks' ? 'default' : 'ghost'} 
                    size="sm"
                    className="gap-2"
                  >
                    <CheckSquare className="w-4 h-4" />
                    Tasks
                  </Button>
                </Link>
                <Link href="/streaks">
                  <Button 
                    variant={pathname === '/streaks' ? 'default' : 'ghost'} 
                    size="sm"
                    className="gap-2"
                  >
                    <Flame className="w-4 h-4" />
                    Streaks
                  </Button>
                </Link>
              </nav>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button onClick={openAddTask}>
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
              
              <ThemeToggle />
              
              <Button 
                variant="ghost" 
                size="icon"
                onClick={signOut}
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}
