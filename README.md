# Buddy — Never start at zero.

**Buddy connects kids who are moving to a new school or country with a buddy already waiting there — before they arrive.**

When you move, the worst part isn't the packing. It's day one: walking into a school where everyone already has their people, and you have nobody. Buddy fixes that. You tell us where you're going and when, we match you with a student already at your destination, and you start talking weeks before move-in — so your first day starts with one familiar face.

Built by a kid who's moved countries and schools more times than they can count. This is the thing I wish I'd had — every single time.

## Why it's not social media

- **The Chain** — arrive with a buddy, and six months later *you* become the buddy for the next kid. The only stat is how many kids you've carried.
- **The Landing** — no feed. Everything runs on your move date: countdown before, three introductions on day one, a check-in at six months.
- **Questions, not bios** — profiles are honest answers, not curated selves. You connect over answers.
- **Nothing public** — profiles are visible only to your matches. No likes, no followers, no algorithms.
- **Missions, not messages** — shared text tasks that design out the awkward first conversation (no voice notes).
- **The Map** — anchors who've lived where you're going answer your questions. Anchors guide; they never meet up.

## Pages

Landing (arrival board) · How it works · The Map · Sign up / Log in · Profile setup · Dashboard (countdown + missions) · Matches · Safety · About

## Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4** + **shadcn/ui**
- **Supabase** (free): auth + Postgres with Row Level Security
- Deploy free on **Vercel**

## Run it locally

```bash
npm install
npm run dev
# → http://localhost:3000
```

**There is no demo mode.** Buddy shows honest empty states until the
Supabase connection is live — no fabricated people, no fake arrivals. The
map itself is already the real world (OpenStreetMap tiles, real country
coordinates from the ISO dataset, browser-geolocation "Find me").

## Connect Supabase (~5 minutes)

1. Create a free project at [supabase.com](https://supabase.com).
2. Open **SQL Editor → New query**, paste the contents of [`supabase/schema.sql`](supabase/schema.sql), run it.
3. Copy **Project Settings → API** keys into `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (public)
   - `SUPABASE_SERVICE_ROLE_KEY` (**secret**, server-only — the matching engine needs it to find buddy profiles)
   See [`.env.local.example`](.env.local.example).
4. Restart `npm run dev`. Real accounts, matching, the arrival board, and
   map pins all come alive.

**What connects once keys are in:**

- **Auth** — signup/login talk to Supabase Auth (email confirmation on by default).
- **Profiles + matching** — onboarding writes your real profile; the matching engine pairs you with the buddy in your destination country closest to your age and creates starter missions.
- **The arrival board** — a mover's flight appears as *WAITING* and flips to *FOUND* the moment they're matched.
- **The map** — real anchors and movers appear as pins at their country's real coordinates, filtered by the same ISO country dataset.
- **Missions** — toggling a mission done persists to the database.

**How matching works:** finish onboarding → your profile is saved → the
matching engine pairs you with the buddy in your destination country
closest to your age → a match + starter missions are created automatically.
No matches yet? You'll see the waiting state and get matched the moment a
buddy signs up there.

## Deploy

Push to GitHub, then import the repo at [vercel.com](https://vercel.com) — no configuration needed.

## Safety

14+ only · profiles are private by design · anchors never meet up · one-tap reporting · never share private info.

---

© 2026 Buddy — no likes, no followers, no algorithms. Just one person who's been where you're going.
