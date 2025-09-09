-- Enable pgcrypto for gen_random_uuid() if not already
create extension if not exists pgcrypto;

-- Tasks table
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  is_daily boolean default false,
  priority text default 'NI' check (priority in ('UI','UN','NI','NN')),
  order_index integer default 0,
  completed_at timestamptz,
  completion jsonb default jsonb_build_object('completedCount',0,'total',0),
  daily_meta jsonb, -- { lastCompletedDate: 'YYYY-MM-DD', currentStreak: n }
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Subtasks
create table if not exists public.subtasks (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  done boolean default false,
  created_at timestamptz default now()
);

-- Task links
create table if not exists public.task_links (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  label text not null,
  url text not null,
  created_at timestamptz default now()
);

-- Settings
create table if not exists public.settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  timezone text default 'UTC',
  sort_mode text default 'priorityThenManual', -- 'priorityThenManual' | 'manualOnly'
  show_completed boolean default false,
  created_at timestamptz default now()
);

-- Update triggers
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists trg_tasks_updated_at on public.tasks;
create trigger trg_tasks_updated_at
before update on public.tasks
for each row execute function public.touch_updated_at();

-- RLS
alter table public.tasks enable row level security;
alter table public.subtasks enable row level security;
alter table public.task_links enable row level security;
alter table public.settings enable row level security;

-- Drop existing policies if they exist, then create new ones
drop policy if exists "tasks_select_own" on public.tasks;
drop policy if exists "tasks_modify_own" on public.tasks;
drop policy if exists "subtasks_select_own" on public.subtasks;
drop policy if exists "subtasks_modify_own" on public.subtasks;
drop policy if exists "links_select_own" on public.task_links;
drop policy if exists "links_modify_own" on public.task_links;
drop policy if exists "settings_select_own" on public.settings;
drop policy if exists "settings_modify_own" on public.settings;

-- Policies: user isolation
create policy "tasks_select_own" on public.tasks for select using (auth.uid() = user_id);
create policy "tasks_modify_own" on public.tasks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "subtasks_select_own" on public.subtasks for select using (auth.uid() = user_id);
create policy "subtasks_modify_own" on public.subtasks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "links_select_own" on public.task_links for select using (auth.uid() = user_id);
create policy "links_modify_own" on public.task_links for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "settings_select_own" on public.settings for select using (auth.uid() = user_id);
create policy "settings_modify_own" on public.settings for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
