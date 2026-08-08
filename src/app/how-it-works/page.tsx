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

import { PageHeader, Signage } from "@/components/signage";
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
        <PageHeader
          tag="How it works"
          title="The chain, not the feed."
          lede="Everyone who was helped, helps. That's the whole design."
        />

        <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {steps.map((step, i) => (
              <Card key={step.title} className="gap-0 overflow-hidden p-0">
                <CardHeader className="border-b border-dashed border-ink/25">
                  <div className="flex items-center justify-between">
                    <step.icon className="size-5 text-amber" />
                    <span className="board text-xl text-ink/30">
                      0{i + 1}
                    </span>
                  </div>
                  <CardTitle className="mt-2">{step.title}</CardTitle>
                </CardHeader>
                <CardContent className="py-4">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {step.body}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="border-t-2 border-ink/80">
          <Signage tag="The rules">Anti-social media, on purpose.</Signage>
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
            <div className="grid gap-6 md:grid-cols-3">
              {principles.map((p) => (
                <div
                  key={p.title}
                  className="border-2 border-ink/30 bg-paper p-6 shadow-[3px_3px_0_0_rgba(22,19,14,0.14)]"
                >
                  <p.icon className="size-5 text-amber" />
                  <h3 className="mt-4 font-display text-lg uppercase tracking-wide">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {p.body}
                  </p>
                </div>
              ))}
            </div>

            <Separator className="my-14" />

            <div className="flex flex-col items-start justify-between gap-6 border-2 border-ink/30 bg-paper p-8 shadow-[3px_3px_0_0_rgba(22,19,14,0.14)] sm:flex-row sm:items-center">
              <div>
                <h3 className="font-display text-2xl uppercase tracking-tight">
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
