'use client'

import { useState, useEffect } from 'react'
import { Settings as SettingsIcon } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Settings } from '@/lib/types'
import { toast } from 'sonner'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  settings?: Settings
  onSettingsUpdate?: (settings: Partial<Settings>) => void
}

const TIMEZONE_OPTIONS = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEDT/AEST)' }
]

export function SettingsModal({ isOpen, onClose, settings, onSettingsUpdate }: SettingsModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    timezone: 'UTC',
    sort_mode: 'priorityThenManual' as 'priorityThenManual' | 'manualOnly',
    show_completed: false
  })

  useEffect(() => {
    if (settings) {
      setFormData({
        timezone: settings.timezone || 'UTC',
        sort_mode: settings.sort_mode || 'priorityThenManual',
        show_completed: settings.show_completed || false
      })
    }
  }, [settings])

  const handleSave = async () => {
    setIsLoading(true)
    try {
      await onSettingsUpdate?.(formData)
      toast.success('Settings updated successfully!')
      onClose()
    } catch (error) {
      console.error('Error updating settings:', error)
      toast.error('Failed to update settings')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5" />
            Settings
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Timezone */}
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select
              value={formData.timezone}
              onValueChange={(value) => setFormData({ ...formData, timezone: value })}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                {TIMEZONE_OPTIONS.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>
                    {tz.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Used for daily task resets and streak calculations
            </p>
          </div>

          {/* Sort Mode */}
          <div className="space-y-2">
            <Label htmlFor="sort_mode">Task Sorting</Label>
            <Select
              value={formData.sort_mode}
              onValueChange={(value: 'priorityThenManual' | 'manualOnly') => 
                setFormData({ ...formData, sort_mode: value })
              }
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="priorityThenManual">Priority then Manual</SelectItem>
                <SelectItem value="manualOnly">Manual Only</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Priority then Manual: Sort by priority first, then allow manual reordering within each priority group
            </p>
          </div>

          {/* Show Completed */}
          <div className="space-y-2">
            <Label htmlFor="show_completed">Display Options</Label>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Show completed tasks</div>
                <div className="text-xs text-muted-foreground">
                  Display completed tasks alongside active ones
                </div>
              </div>
              <Switch
                id="show_completed"
                checked={formData.show_completed}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, show_completed: checked })
                }
                disabled={isLoading}
              />
            </div>
          </div>

          {/* App Info */}
          <div className="pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              <h4 className="font-medium text-foreground mb-2">About Streakz</h4>
              <p className="mb-1">Version 1.0.0</p>
              <p>Get sh*t done. Every day.</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
