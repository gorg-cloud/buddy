import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ArrivalBoard } from "@/components/arrival-board";
import { Barcode } from "@/components/barcode";
import { Signage } from "@/components/signage";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

const chain = [
  {
    no: "01",
    title: "Arrive",
    body: "Tell us where you're going and when. We match you with a student already at your new school — before you even land.",
  },
  {
    no: "02",
    title: "Get carried",
    body: "You talk for weeks before day one. Your buddy walks you through the school, the city, and that terrifying first morning.",
  },
  {
    no: "03",
    title: "Carry",
    body: "Six months in, you're the one who knows the place. You become a buddy for the next kid arriving. The chain continues.",
  },
];

const tapeMessage =
  "NO LIKES · NO FOLLOWERS · NO ALGORITHMS — JUST ONE PERSON";

const profileQuestions = [
  "What's the scariest part of your move?",
  "One thing you want to do at your new school?",
  "What do you do when you feel alone?",
  "What's the first thing you'd show a new kid?",
];

function ChainStub({
  no,
  title,
  body,
}: {
  no: string;
  title: string;
  body: string;
}) {
  return (
    <div className="relative flex h-full flex-col border-2 border-ink/30 bg-paper shadow-[3px_3px_0_0_rgba(22,19,14,0.14)]">
      <div className="perf border-b border-dashed border-ink/30" aria-hidden />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="board text-[11px] tracking-[0.25em] text-amber-deep">
            SEQUENCE {no}
          </p>
          <Barcode seed={title} className="h-5 w-16 shrink-0" />
        </div>
        <h3 className="mt-3 font-display text-3xl uppercase leading-none tracking-tight text-ink">
          {title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-ink/70">{body}</p>
        <div className="mt-auto flex items-center justify-between border-t border-dashed border-ink/25 pt-3">
          <span className="board text-[9px] tracking-[0.2em] text-ink/55">
            PASS — BUDDY CHAIN
          </span>
          <span className="board text-[9px] tracking-[0.2em] text-ink/55">
            NO. {no}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* HERO — the check-in desk */}
        <section className="relative overflow-hidden">
          <div className="terminal-grid absolute inset-0" aria-hidden />
          <div className="glow-amber absolute inset-0" aria-hidden />
          <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-4 pt-16 pb-20 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16 lg:pt-24 lg:pb-28">
            <div className="page-enter">
              <p className="board inline-flex items-center gap-2 border-2 border-ink/25 bg-paper/70 px-2.5 py-1 text-[11px] tracking-[0.22em] text-ink/70">
                <span className="size-1.5 bg-amber" aria-hidden />
                For kids who move · 14+
              </p>
              <h1 className="mt-6 font-display text-5xl uppercase leading-[0.95] tracking-tight text-ink sm:text-7xl lg:text-[5.5rem]">
                Never start
                <br />
                at <span className="text-amber-deep">zero</span>.
              </h1>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-ink/70">
                Buddy matches you with someone at your new school{" "}
                <strong className="text-ink">before you arrive</strong> — so
                your first day starts with one familiar face, not a room full
                of strangers.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="/signup">
                    Get a buddy <ArrowRight />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/how-it-works">See how it works</Link>
                </Button>
              </div>
              <p className="board mt-8 text-[10px] tracking-[0.25em] text-ink/50">
                Check-in desk 01 · boarding pass required
              </p>
            </div>

            <div className="page-enter" style={{ animationDelay: "140ms" }}>
              <ArrivalBoard />
            </div>
          </div>
        </section>

        {/* TICKER TAPE */}
        <div
          className="overflow-hidden border-y-2 border-ink bg-ink py-2.5"
          aria-hidden
        >
          <div className="tape-track board text-xs tracking-[0.3em] text-amber">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="flex shrink-0 items-center">
                <span className="px-6">{tapeMessage}</span>
                <span className="mx-1 inline-block size-2 bg-amber/70" />
              </span>
            ))}
            {[0, 1, 2, 3].map((i) => (
              <span key={`b-${i}`} className="flex shrink-0 items-center">
                <span className="px-6">{tapeMessage}</span>
                <span className="mx-1 inline-block size-2 bg-amber/70" />
              </span>
            ))}
          </div>
        </div>

        {/* THE CHAIN */}
        <section className="relative">
          <Signage tag="The design" className="pt-10 pb-12 sm:pt-14 sm:pb-16">
            The chain, not the feed.
          </Signage>
          <div className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
            <div className="relative mt-10">
              {/* dashed connector */}
              <div
                className="absolute top-6 right-[12%] left-[12%] hidden border-t-2 border-dashed border-ink/30 lg:block"
                aria-hidden
              />
              <div className="grid gap-6 md:grid-cols-3">
                {chain.map((item) => (
                  <ChainStub key={item.no} {...item} />
                ))}
              </div>
            </div>
            <p className="board mt-10 text-[11px] tracking-[0.2em] text-ink/55">
              Everyone who was helped, helps. The only stat that matters is
              how many kids you&apos;ve carried.
            </p>
          </div>
        </section>

        {/* QUESTIONS, NOT BIOS */}
        <section className="border-t-2 border-ink/80">
          <Signage tag="Questions, not bios">You connect over answers.</Signage>
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.3fr] lg:items-start lg:py-20">
            <div>
              <h2 className="font-display text-3xl uppercase leading-tight tracking-tight text-ink sm:text-4xl">
                Not vibes.
              </h2>
              <p className="mt-4 leading-relaxed text-ink/70">
                No &quot;about me&quot; bios. No curated photos. Your profile
                is the truth: what scares you, what you want, what you do when
                you feel alone. That&apos;s what you and your buddy talk about
                first — so there&apos;s no awkward &quot;hi, how are you.&quot;
              </p>
              <div className="mt-6 inline-flex items-center gap-2 border-2 border-ink/25 bg-paper px-3 py-2 text-sm text-ink/70">
                <span className="board text-[10px] tracking-[0.2em] text-signal">
                  PRIVATE
                </span>
                Profiles are visible only to your matches.
              </div>
            </div>
            <div className="relative border-2 border-ink/30 bg-paper shadow-[3px_3px_0_0_rgba(22,19,14,0.14)]">
              <div className="perf border-b border-dashed border-ink/30" aria-hidden />
              <div className="flex items-center justify-between gap-3 p-5">
                <div>
                  <p className="board text-[10px] tracking-[0.2em] text-amber-deep">
                    PROFILE — QUESTIONS FIRST
                  </p>
                  <p className="mt-1 font-display text-xl uppercase text-ink">
                    The whole profile is four questions
                  </p>
                </div>
                <span className="stamp shrink-0">private</span>
              </div>
              <div className="space-y-3 px-5 pb-5">
                {profileQuestions.map((q, i) => (
                  <div key={q} className="border border-ink/20 bg-muted/50 p-3">
                    <p className="board text-[10px] font-bold tracking-[0.18em] text-amber-deep">
                      Q{i + 1}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-ink/85">
                      {q}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between border-t-2 border-ink bg-ink px-5 py-2">
                <span className="board text-[9px] tracking-[0.25em] text-paper/60">
                  PASSENGER · YOU
                </span>
                <span className="board text-[9px] tracking-[0.25em] text-paper/60">
                  SEAT 01A
                </span>
              </div>
              <p className="board border-t border-dashed border-ink/25 px-5 py-3 text-[10px] tracking-[0.15em] text-ink/50">
                NO FABRICATED PROFILES HERE — REAL KIDS&apos; ANSWERS LAND ON
                THIS TICKET THE MOMENT THEY SIGN UP.
              </p>
            </div>
          </div>
        </section>

        {/* THE MAP */}
        <section className="border-t-2 border-ink/80">
          <Signage tag="The map">
            People who&apos;ve been where you&apos;re going.
          </Signage>
          <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-20">
            <div className="border-2 border-ink/30 bg-paper p-4 shadow-[3px_3px_0_0_rgba(22,19,14,0.14)]">
              <svg
                viewBox="0 0 400 260"
                className="mx-auto w-full max-w-md"
                aria-hidden
              >
                <circle
                  cx="200"
                  cy="130"
                  r="90"
                  fill="none"
                  stroke="var(--ink)"
                  strokeOpacity="0.18"
                  strokeWidth="1.5"
                  strokeDasharray="4 6"
                />
                <circle
                  cx="200"
                  cy="130"
                  r="50"
                  fill="none"
                  stroke="var(--ink)"
                  strokeOpacity="0.18"
                  strokeWidth="1.5"
                  strokeDasharray="4 6"
                />
                <circle cx="200" cy="130" r="8" fill="var(--amber)" />
                <circle
                  cx="120"
                  cy="90"
                  r="6"
                  fill="var(--amber)"
                  opacity="0.95"
                />
                <circle
                  cx="272"
                  cy="72"
                  r="5"
                  fill="var(--signal)"
                  opacity="0.95"
                />
                <circle
                  cx="150"
                  cy="180"
                  r="6"
                  fill="var(--amber)"
                  opacity="0.95"
                />
                <circle
                  cx="290"
                  cy="160"
                  r="5"
                  fill="var(--signal)"
                  opacity="0.95"
                />
                <circle
                  cx="210"
                  cy="48"
                  r="5"
                  fill="var(--signal)"
                  opacity="0.95"
                />
                <text
                  x="200"
                  y="162"
                  textAnchor="middle"
                  fontFamily="var(--font-space-mono)"
                  fontSize="10"
                  fontWeight="700"
                  letterSpacing="2"
                  fill="var(--ink)"
                >
                  YOU
                </text>
              </svg>
              <p className="board mt-2 text-center text-[10px] tracking-[0.2em] text-ink/50">
                Anchors guide. They don&apos;t meet up.
              </p>
            </div>
            <div>
              <p className="board text-[11px] tracking-[0.22em] text-ink/55">
                Anchors &amp; peers — never a crowd
              </p>
              <h2 className="mt-3 font-display text-4xl uppercase leading-[1.02] tracking-tight text-ink sm:text-5xl">
                Your world, as ripples.
              </h2>
              <p className="mt-5 max-w-lg leading-relaxed text-ink/70">
                See who&apos;s in your country —{" "}
                <strong className="text-ink">anchors</strong> who&apos;ve
                lived there for years and answer your questions, and{" "}
                <strong className="text-ink">peers</strong> moving the same
                way you are. Never alone in the crowd.
              </p>
              <Button variant="outline" className="mt-8" asChild>
                <Link href="/map">
                  Open the map <ArrowRight />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* NOW BOARDING — the close */}
        <section className="border-t-2 border-ink bg-ink text-paper">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-20">
            <p className="board inline-flex items-center gap-2 text-[11px] tracking-[0.3em] text-amber">
              <span className="size-1.5 rounded-full bg-alarm shadow-[0_0_7px_2px_rgba(196,59,44,0.55)]" />
              Now boarding
            </p>
            <h2 className="mx-auto mt-5 max-w-3xl font-display text-4xl uppercase leading-[1.02] tracking-tight sm:text-5xl md:text-6xl">
              Day one is the hardest day. You don&apos;t have to face it
              alone.
            </h2>
            <p className="mx-auto mt-6 max-w-xl leading-relaxed text-paper/70">
              Built by a kid who moved countries and schools more times than
              they can count. This is the thing I wish I&apos;d had — every
              single time.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/signup">
                  Get your buddy <ArrowRight />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-paper text-paper hover:bg-paper/10"
                asChild
              >
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
