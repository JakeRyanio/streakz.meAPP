-- Cleanup script to remove existing policies before running the main migration
-- Run this first if you're getting "policy already exists" errors

-- Drop all existing policies
drop policy if exists "tasks_select_own" on public.tasks;
drop policy if exists "tasks_modify_own" on public.tasks;
drop policy if exists "subtasks_select_own" on public.subtasks;
drop policy if exists "subtasks_modify_own" on public.subtasks;
drop policy if exists "links_select_own" on public.task_links;
drop policy if exists "links_modify_own" on public.task_links;
drop policy if exists "settings_select_own" on public.settings;
drop policy if exists "settings_modify_own" on public.settings;

-- Drop existing triggers
drop trigger if exists trg_tasks_updated_at on public.tasks;

-- Drop existing function
drop function if exists public.touch_updated_at();

-- Note: We don't drop tables here to preserve any existing data
-- If you need to start completely fresh, you can manually drop tables in Supabase dashboard
