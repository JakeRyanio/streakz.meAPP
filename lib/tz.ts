import { format, startOfDay, endOfDay, isAfter, isBefore, parseISO, formatISO } from 'date-fns'
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz'

export function getDefaultTimezone(): string {
  return process.env.NEXT_PUBLIC_DEFAULT_TZ || 'UTC'
}

export function getCurrentDateInTimezone(timezone: string): Date {
  const now = new Date()
  return utcToZonedTime(now, timezone)
}

export function getStartOfDayInTimezone(date: Date, timezone: string): Date {
  const zonedDate = utcToZonedTime(date, timezone)
  const startOfDayZoned = startOfDay(zonedDate)
  return zonedTimeToUtc(startOfDayZoned, timezone)
}

export function getEndOfDayInTimezone(date: Date, timezone: string): Date {
  const zonedDate = utcToZonedTime(date, timezone)
  const endOfDayZoned = endOfDay(zonedDate)
  return zonedTimeToUtc(endOfDayZoned, timezone)
}

export function formatDateForTimezone(date: Date, timezone: string, formatStr: string = 'yyyy-MM-dd'): string {
  const zonedDate = utcToZonedTime(date, timezone)
  return format(zonedDate, formatStr)
}

export function isToday(date: Date | string, timezone: string): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  const now = getCurrentDateInTimezone(timezone)
  const todayStart = getStartOfDayInTimezone(now, timezone)
  const todayEnd = getEndOfDayInTimezone(now, timezone)
  
  return !isBefore(dateObj, todayStart) && !isAfter(dateObj, todayEnd)
}

export function wasYesterday(date: Date | string, timezone: string): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  const now = getCurrentDateInTimezone(timezone)
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  const yesterdayStart = getStartOfDayInTimezone(yesterday, timezone)
  const yesterdayEnd = getEndOfDayInTimezone(yesterday, timezone)
  
  return !isBefore(dateObj, yesterdayStart) && !isAfter(dateObj, yesterdayEnd)
}

export function getTodayString(timezone: string): string {
  const now = getCurrentDateInTimezone(timezone)
  return formatDateForTimezone(now, timezone)
}
