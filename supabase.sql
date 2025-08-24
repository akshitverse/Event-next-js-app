-- Supabase schema for RSVP app (public schema) - Option A
-- Run this in your Supabase project's SQL editor

-- USERS (mirror of auth.users)
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text unique not null,
  created_at timestamptz default now()
);

-- EVENTS
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  title text not null,
  description text,
  event_date timestamptz not null,
  location text,
  is_public boolean default true,
  created_at timestamptz default now()
);

-- RSVPS with cascade on user/event delete
create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  event_id uuid references public.events(id) on delete cascade,
  status text not null check (status in ('Yes','No','Maybe')),
  created_at timestamptz default now(),
  unique (user_id, event_id)
);

-- Indexes
create index if not exists idx_events_event_date on public.events(event_date);

-- Enable RLS
alter table public.users enable row level security;
alter table public.events enable row level security;
alter table public.rsvps enable row level security;

-- Policies: users
drop policy if exists "allow_insert_users" on public.users;
create policy "allow_insert_users" on public.users for insert to authenticated with check (auth.uid() = id);

drop policy if exists "select_users_self" on public.users;
create policy "select_users_self" on public.users for select using (auth.uid() = id);

drop policy if exists "delete_own_user" on public.users;
create policy "delete_own_user" on public.users for delete using (auth.uid() = id);

-- Policies: events
drop policy if exists "public_read_events" on public.events;
create policy "public_read_events" on public.events for select using (is_public = true);

drop policy if exists "insert_own_event" on public.events;
create policy "insert_own_event" on public.events for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "owner_update_event" on public.events;
create policy "owner_update_event" on public.events for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "owner_delete_event" on public.events;
create policy "owner_delete_event" on public.events for delete using (auth.uid() = user_id);

-- Policies: rsvps
drop policy if exists "select_rsvps_public_or_owner" on public.rsvps;
create policy "select_rsvps_public_or_owner" on public.rsvps for select using (
  (exists (select 1 from public.events e where e.id = public.rsvps.event_id and e.is_public = true))
  or (auth.uid() = public.rsvps.user_id)
  or (auth.uid() = (select e.user_id from public.events e where e.id = public.rsvps.event_id))
);

drop policy if exists "insert_own_rsvp" on public.rsvps;
create policy "insert_own_rsvp" on public.rsvps for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "update_own_rsvp" on public.rsvps;
create policy "update_own_rsvp" on public.rsvps for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "delete_own_rsvp" on public.rsvps;
create policy "delete_own_rsvp" on public.rsvps for delete using (auth.uid() = user_id);
