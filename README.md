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

**Demo mode:** until Supabase keys are added, the site runs with sample data — every page works, sign-up drops you straight in.

## Go live (Supabase, ~5 minutes)

1. Create a free project at [supabase.com](https://supabase.com).
2. Open **SQL Editor → New query**, paste the contents of [`supabase/schema.sql`](supabase/schema.sql), run it.
3. Copy **Project Settings → API** keys into `.env.local` (see [`.env.local.example`](.env.local.example)).
4. Restart `npm run dev`. Real accounts now work.

## Deploy

Push to GitHub, then import the repo at [vercel.com](https://vercel.com) — no configuration needed.

## Safety

14+ only · profiles are private by design · anchors never meet up · one-tap reporting · never share private info.

---

© 2026 Buddy — no likes, no followers, no algorithms. Just one person who's been where you're going.
