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
  avatar_url text,                     -- public storage URL, shown to matches
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
  body text not null check (char_length(body) between 1 and 500),
  created_at timestamptz default now()
);

-- Community rooms: a global room plus one per country. The departure
-- lounge — readable by anyone, posting requires an account.
create table public.community_messages (
  id uuid default gen_random_uuid() primary key,
  room text not null check (room = 'global' or char_length(room) between 2 and 64),
  sender uuid references public.profiles(id) on delete cascade,
  sender_name text not null,
  body text not null check (char_length(body) between 1 and 500),
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

-- Arrivals: the public landing board. Anonymized on purpose — only city
-- pairs and a status, never names or schools. A mover's flight is WAITING
-- until the matching engine pairs them, then it flips to FOUND.
create table public.arrivals (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid references public.profiles(id) on delete cascade unique,
  flight text not null,
  from_city text,
  to_city text,
  status text not null default 'waiting' check (status in ('waiting', 'found')),
  created_at timestamptz default now()
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
-- its owner and to people matched with them. The one exception
-- is the arrivals board, which is anonymized by design.
-- ============================================================

alter table public.profiles enable row level security;
alter table public.matches enable row level security;
alter table public.missions enable row level security;
alter table public.messages enable row level security;
alter table public.anchors enable row level security;
alter table public.arrivals enable row level security;
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
-- WITH CHECK keeps a user from reassigning their row to someone else's id.
create policy "own profile" on public.profiles
  for all to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "matched profiles" on public.profiles
  for select to authenticated
  using (id in (select public.matched_with(auth.uid())));

-- Matches: only the two people in the match.
create policy "own matches" on public.matches
  for all to authenticated
  using (auth.uid() in (mover, buddy))
  with check (auth.uid() in (mover, buddy));

-- Missions: visible to the two people in the match.
create policy "match missions" on public.missions
  for all to authenticated
  using (
    match_id in (select id from public.matches where auth.uid() in (mover, buddy))
  )
  with check (
    match_id in (select id from public.matches where auth.uid() in (mover, buddy))
  );

-- Messages: visible to the two people in the match, and the sender
-- must be the writer — no spoofing someone else's match messages.
create policy "match messages" on public.messages
  for all to authenticated
  using (
    match_id in (select id from public.matches where auth.uid() in (mover, buddy))
  )
  with check (
    auth.uid() = sender
    and match_id in (select id from public.matches where auth.uid() in (mover, buddy))
  );

-- Community: the lounge is open to read, only members write.
alter table public.community_messages enable row level security;

create policy "community read" on public.community_messages
  for select to anon, authenticated using (true);

create policy "community write" on public.community_messages
  for insert to authenticated
  with check (
    auth.uid() = sender
    and char_length(body) between 1 and 500
  );

create index community_room_created on public.community_messages (room, created_at desc);

-- Anchors: anyone can read anchor answers (answers only, no contact).
create policy "anchors public answers" on public.anchors
  for select to anon, authenticated using (true);

-- Arrivals: the board is public, but it carries no personal data.
create policy "arrivals public board" on public.arrivals
  for select to anon, authenticated using (true);

-- Reports: reporters insert, nobody reads except service role.
create policy "report insert" on public.reports
  for insert to authenticated with check (auth.uid() = reporter);

create policy "report owner" on public.reports
  for select to authenticated using (auth.uid() = reporter);

-- ============================================================
-- Data API access grants
-- Tables created via the SQL editor are not automatically exposed to the
-- PostgREST Data API — grant explicitly. RLS still gates every row.
-- ============================================================

grant usage on schema public to anon, authenticated;

grant select on public.arrivals, public.anchors, public.community_messages to anon;

grant all on public.profiles, public.matches, public.missions,
  public.messages, public.anchors, public.arrivals, public.reports,
  public.community_messages
  to authenticated;

-- ============================================================
-- Profile pictures (storage)
-- ============================================================

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update set public = true;

-- Anyone can view avatars (they're shown to matches); only the owner
-- can upload or replace their own.
create policy "avatars read" on storage.objects
  for select to anon, authenticated using (bucket_id = 'avatars');

create policy "avatars upload" on storage.objects
  for insert to authenticated with check (bucket_id = 'avatars' and owner = auth.uid());

create policy "avatars update" on storage.objects
  for update to authenticated using (bucket_id = 'avatars' and owner = auth.uid());
