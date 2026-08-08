-- ============================================================
-- BUDDY — Supabase schema
-- Run this in the Supabase SQL editor (Project → SQL Editor → New query)
-- after creating your free project at supabase.com.
-- ============================================================

-- Profiles extend auth.users. One row per person.
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  handle text unique,
  name text not null,
  age int check (age between 14 and 18),
  role text check (role in ('mover', 'buddy', 'anchor')),
  from_place text,
  to_place text,
  school text,
  country text,
  move_date date,
  answers jsonb default '{}'::jsonb,   -- questions-first profile
  languages text[] default '{}',
  emoji text default '🧭',
  carried int default 0,                -- the Chain: kids you've helped
  created_at timestamptz default now()
);

-- A match between a mover and a buddy.
create table public.matches (
  id uuid default gen_random_uuid() primary key,
  mover uuid references public.profiles(id) on delete cascade,
  buddy uuid references public.profiles(id) on delete cascade,
  status text default 'pending' check (status in ('pending', 'active', 'graduated')),
  created_at timestamptz default now()
);

-- Text missions that build the connection (no voice notes).
create table public.missions (
  id uuid default gen_random_uuid() primary key,
  match_id uuid references public.matches(id) on delete cascade,
  title text not null,
  description text not null,
  kind text check (kind in ('intro', 'landing', 'settle')),
  done boolean default false,
  created_at timestamptz default now()
);

-- Messages between matched kids.
create table public.messages (
  id uuid default gen_random_uuid() primary key,
  match_id uuid references public.matches(id) on delete cascade,
  sender uuid references public.profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz default now()
);

-- Anchors: experienced kids who answer questions (never meet up).
create table public.anchors (
  id uuid references public.profiles(id) on delete cascade primary key,
  city text,
  years_lived int,
  expertise text[] default '{}',
  answers jsonb default '{}'::jsonb
);

-- Safety reports.
create table public.reports (
  id uuid default gen_random_uuid() primary key,
  reporter uuid references public.profiles(id) on delete cascade,
  target uuid references public.profiles(id) on delete cascade,
  reason text,
  created_at timestamptz default now()
);

-- ============================================================
-- Row Level Security
-- Principle: nothing is public. A profile is visible only to
-- its owner and to people matched with them.
-- ============================================================

alter table public.profiles enable row level security;
alter table public.matches enable row level security;
alter table public.missions enable row level security;
alter table public.messages enable row level security;
alter table public.anchors enable row level security;
alter table public.reports enable row level security;

-- Helper: the set of profile ids a user is matched with.
create or replace function public.matched_with(uid uuid)
returns setof uuid language sql stable as $$
  select case when mover = uid then buddy else mover end
  from public.matches
  where (mover = uid or buddy = uid)
    and status in ('pending', 'active');
$$;

-- Profiles: owner sees own; matched people see each other.
create policy "own profile" on public.profiles
  for all using (auth.uid() = id);

create policy "matched profiles" on public.profiles
  for select using (id in (select public.matched_with(auth.uid())));

-- Matches: only the two people in the match.
create policy "own matches" on public.matches
  for all using (auth.uid() in (mover, buddy));

-- Missions: visible to the two people in the match.
create policy "match missions" on public.missions
  for all using (
    match_id in (select id from public.matches where auth.uid() in (mover, buddy))
  );

-- Messages: visible to the two people in the match.
create policy "match messages" on public.messages
  for all using (
    match_id in (select id from public.matches where auth.uid() in (mover, buddy))
  );

-- Anchors: anyone can ask anchors questions (answers only, no contact).
create policy "anchors public answers" on public.anchors
  for select using (true);

-- Reports: reporters insert, nobody reads except service role.
create policy "report insert" on public.reports
  for insert with check (auth.uid() = reporter);

create policy "report owner" on public.reports
  for select using (auth.uid() = reporter);
