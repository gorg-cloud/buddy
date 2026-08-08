import Link from "next/link";
import {
  ArrowRight,
  HeartHandshake,
  Lock,
  MapPin,
  MessageCircleQuestion,
} from "lucide-react";

import { ArrivalBoard } from "@/components/arrival-board";
import { ProfileCard } from "@/components/profile-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { profiles } from "@/lib/demo-data";

const chain = [
  {
    step: "01",
    title: "Arrive",
    body: "Tell us where you're going and when. We match you with a student already at your new school — before you even land.",
  },
  {
    step: "02",
    title: "Get carried",
    body: "You talk for weeks before day one. Your buddy walks you through the school, the city, and that terrifying first morning.",
  },
  {
    step: "03",
    title: "Carry",
    body: "Six months in, you're the one who knows the place. You become a buddy for the next kid arriving. The chain continues.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="terminal-grid absolute inset-0" aria-hidden />
          <div className="glow-amber absolute inset-0" aria-hidden />
          <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-4 pt-20 pb-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:pt-28 lg:pb-24">
            <div>
              <p className="board text-xs text-primary">
                ● FOR KIDS WHO MOVE · 14+
              </p>
              <h1 className="mt-5 font-display text-5xl leading-[1.02] font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                Never start
                <br />
                at <span className="text-primary">zero</span>.
              </h1>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
                Buddy matches you with someone at your new school{" "}
                <span className="text-foreground">before you arrive</span> — so
                your first day starts with one familiar face, not a room full of
                strangers.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="/signup">
                    Get a buddy <ArrowRight />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/how-it-works">See how it works</Link>
                </Button>
              </div>
              <p className="board mt-6 text-[11px] text-muted-foreground">
                no likes · no followers · no algorithms — just one person
              </p>
            </div>

            <ArrivalBoard />
          </div>
        </section>

        {/* THE CHAIN */}
        <section className="border-t border-border/70">
          <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
            <p className="board text-xs text-primary">THE CHAIN</p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Everyone who was helped, helps.
            </h2>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              This isn&apos;t a social network. It&apos;s a chain — and the
              only stat that matters is how many kids you&apos;ve carried.
            </p>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {chain.map((item) => (
                <div
                  key={item.step}
                  className="relative rounded-xl border border-border bg-card p-6"
                >
                  <span className="board text-4xl text-primary/60">
                    {item.step}
                  </span>
                  <h3 className="mt-4 font-display text-xl font-semibold">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* QUESTIONS, NOT BIOS */}
        <section className="border-t border-border/70 bg-card/40">
          <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
            <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:items-start">
              <div>
                <p className="board text-xs text-primary">
                  QUESTIONS, NOT BIOS
                </p>
                <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                  You connect over answers.
                  <br />
                  Not vibes.
                </h2>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  No &quot;about me&quot; bios. No curated photos. Your profile
                  is the truth: what scares you, what you want, what you do
                  when you feel alone. That&apos;s what you and your buddy talk
                  about first — so there&apos;s no awkward &quot;hi, how are
                  you.&quot;
                </p>
                <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
                  <Lock className="size-4 text-primary" />
                  Profiles are private — visible only to your matches.
                </div>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <ProfileCard profile={profiles[0]} compact />
                <ProfileCard profile={profiles[1]} compact />
              </div>
            </div>
          </div>
        </section>

        {/* THE MAP */}
        <section className="border-t border-border/70">
          <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div className="order-2 lg:order-1">
                <div className="rounded-xl border border-border bg-card p-4">
                  <svg viewBox="0 0 400 260" className="mx-auto w-full max-w-md" aria-hidden>
                    <circle cx="200" cy="130" r="90" fill="none" stroke="var(--border)" strokeWidth="1" strokeDasharray="3 5" />
                    <circle cx="200" cy="130" r="50" fill="none" stroke="var(--border)" strokeWidth="1" strokeDasharray="3 5" />
                    <circle cx="200" cy="130" r="10" fill="var(--primary)" />
                    <circle cx="120" cy="90" r="8" fill="var(--primary)" opacity="0.9" />
                    <circle cx="272" cy="72" r="6" fill="var(--accent)" opacity="0.9" />
                    <circle cx="150" cy="180" r="8" fill="var(--primary)" opacity="0.9" />
                    <circle cx="290" cy="160" r="6" fill="var(--accent)" opacity="0.9" />
                    <circle cx="210" cy="48" r="6" fill="var(--accent)" opacity="0.9" />
                  </svg>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <p className="board text-xs text-primary">THE MAP</p>
                <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                  People who&apos;ve been
                  <br />
                  where you&apos;re going.
                </h2>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  See who&apos;s in your country — <strong className="text-foreground">anchors</strong>{" "}
                  who&apos;ve lived there for years and answer your questions,
                  and <strong className="text-foreground">peers</strong> moving
                  the same way you are. Anchors guide. They don&apos;t meet up.
                </p>
                <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="size-4 text-primary" />
                  Your world, as ripples. Never alone in the crowd.
                </div>
                <Button variant="outline" className="mt-8" asChild>
                  <Link href="/map">
                    Open the map <ArrowRight />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* MISSION BAND */}
        <section className="border-t border-border/70">
          <div className="mx-auto w-full max-w-6xl px-4 py-20 text-center sm:px-6">
            <MessageCircleQuestion className="mx-auto size-8 text-primary" />
            <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Day one is the hardest day.
              <br />
              You don&apos;t have to face it alone.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Built by a kid who moved countries and schools more times than
              they can count. This is the thing I wish I&apos;d had — every
              single time.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/signup">
                  <HeartHandshake />
                  Get your buddy
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/about">Read the story</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
