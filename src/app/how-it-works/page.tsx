import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  Handshake,
  ListChecks,
  Lock,
  MessageCircleQuestion,
  UserRoundPlus,
} from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const steps = [
  {
    icon: UserRoundPlus,
    title: "Make your profile",
    body: "Answer the real questions: what scares you about the move, what you want at your new school, what you do when you feel alone. No bios. No curated photos.",
  },
  {
    icon: CalendarClock,
    title: "Tell us your landing date",
    body: "Everything runs on your move date. A countdown starts. Your buddy is matched by destination and age — weeks before you arrive.",
  },
  {
    icon: ListChecks,
    title: "Do missions together",
    body: "No awkward small talk. You get shared tasks: teach each other three words, see the school on a video call, plan day one. Text-based, nothing more.",
  },
  {
    icon: Handshake,
    title: "Day one, handled",
    body: "Your buddy introduces you to three people. That's the whole goal: three is enough to start building your life.",
  },
  {
    icon: ArrowRight,
    title: "Six months later: carry",
    body: "You know the place now. You become a buddy for the next kid arriving at your school. The chain continues — and your only stat is how many kids you've carried.",
  },
];

const principles = [
  {
    icon: Lock,
    title: "Nothing is public",
    body: "No public profiles, no browsing, no likes, no followers, no algorithms. You only ever see your matches.",
  },
  {
    icon: MessageCircleQuestion,
    title: "Questions, not bios",
    body: "Profiles are answers to honest questions. That's what you connect over — not vibes.",
  },
  {
    icon: Handshake,
    title: "Anchors guide, they don't meet",
    body: "Experienced kids on the map answer your questions about school, the city, how to settle. Never for meetups. Ever.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="border-b border-border/70">
          <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
            <p className="board text-xs text-primary">HOW IT WORKS</p>
            <h1 className="mt-3 max-w-2xl font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
              The chain, not the feed.
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Everyone who was helped, helps. That&apos;s the whole design.
            </p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {steps.map((step, i) => (
              <Card key={step.title}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <step.icon className="size-6 text-primary" />
                    <span className="board text-2xl text-primary/40">
                      0{i + 1}
                    </span>
                  </div>
                  <CardTitle>{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {step.body}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="border-t border-border/70 bg-card/40">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
            <p className="board text-xs text-primary">THE RULES</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight">
              Anti-social media, on purpose.
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {principles.map((p) => (
                <div key={p.title} className="rounded-xl border border-border bg-card p-6">
                  <p.icon className="size-6 text-primary" />
                  <h3 className="mt-4 font-display text-lg font-semibold">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {p.body}
                  </p>
                </div>
              ))}
            </div>

            <Separator className="my-14" />

            <div className="flex flex-col items-start justify-between gap-6 rounded-xl border border-border bg-card p-8 sm:flex-row sm:items-center">
              <div>
                <h3 className="font-display text-2xl font-bold">
                  Your first day doesn&apos;t have to start at zero.
                </h3>
                <p className="mt-2 text-muted-foreground">
                  It takes two minutes to make your profile.
                </p>
              </div>
              <Button size="lg" asChild>
                <Link href="/signup">
                  Get a buddy <ArrowRight />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
