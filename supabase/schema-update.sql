-- ============================================================
-- BUDDY — schema update: chat + community rooms
-- Run this in the Supabase SQL editor (Project → SQL Editor → New query)
-- if you already ran the original schema.sql. It adds the community
-- lounge (global room + one per country) and hardens matched chat so
-- the sender must always be the writer.
-- Safe to run more than once.
-- ============================================================

-- Community rooms: a global room plus one per country. The departure
-- lounge — readable by anyone, posting requires an account.
create table if not exists public.community_messages (
  id uuid default gen_random_uuid() primary key,
  room text not null check (room = 'global' or char_length(room) between 2 and 64),
  sender uuid references public.profiles(id) on delete cascade,
  sender_name text not null,
  body text not null check (char_length(body) between 1 and 500),
  created_at timestamptz default now()
);

alter table public.community_messages enable row level security;

drop policy if exists "community read" on public.community_messages;
create policy "community read" on public.community_messages
  for select to anon, authenticated using (true);

drop policy if exists "community write" on public.community_messages;
create policy "community write" on public.community_messages
  for insert to authenticated
  with check (
    auth.uid() = sender
    and char_length(body) between 1 and 500
  );

create index if not exists community_room_created
  on public.community_messages (room, created_at desc);

-- Harden matched chat: the sender must be the writer (no spoofing).
drop policy if exists "match messages" on public.messages;
create policy "match messages" on public.messages
  for all to authenticated
  using (
    match_id in (select id from public.matches where auth.uid() in (mover, buddy))
  )
  with check (
    auth.uid() = sender
    and match_id in (select id from public.matches where auth.uid() in (mover, buddy))
  );

-- Data API access.
grant select on public.community_messages to anon;
grant all on public.community_messages to authenticated;
