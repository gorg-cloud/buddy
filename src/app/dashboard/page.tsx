"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CalendarClock, Handshake } from "lucide-react";

import { MissionCard } from "@/components/mission-card";
import { ProfileCard } from "@/components/profile-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useMatch } from "@/hooks/use-match";
import { daysUntil } from "@/lib/utils";

export default function DashboardPage() {
  const router = useRouter();
  const { loading, real, me, buddy, missions } = useMatch();
  const [greeting, setGreeting] = useState("You");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const session = localStorage.getItem("buddy:session");
    if (session) {
      try {
        setGreeting(JSON.parse(session).name || "You");
      } catch {
        /* ignore */
      }
    }
  }, []);

  // Real mode: if you're signed in but haven't finished onboarding, go build your profile.
  useEffect(() => {
    if (!loading && real && !me) router.push("/onboarding");
  }, [loading, real, me, router]);

  const days = me?.moveDate && mounted ? daysUntil(me.moveDate) : 0;
  const doneCount = missions.filter((m) => m.done).length;
  const pct = missions.length
    ? Math.round((doneCount / missions.length) * 100)
    : 0;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Countdown band */}
        <section className="border-b-2 border-ink/80 bg-paper/60">
          <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-16 w-40" />
              </div>
            ) : (
              <>
                <p className="board text-xs text-primary">
                  ● YOUR LANDING · {me?.from ?? "—"} → {me?.to ?? "—"}
                </p>
                <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
                  <div>
                    <p className="board text-6xl font-bold text-foreground sm:text-7xl">
                      {days}
                    </p>
                    <p className="board mt-1 text-xs text-muted-foreground">
                      {days === 0
                        ? "TODAY. YOU'VE GOT THIS."
                        : days === 1
                          ? "DAY UNTIL YOU LAND"
                          : "DAYS UNTIL YOU LAND"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarClock className="size-4 text-primary" />
                    {buddy ? (
                      <span>
                        Your buddy is{" "}
                        <Link
                          href="/matches"
                          className="text-foreground underline underline-offset-4 hover:text-primary"
                        >
                          {buddy.name}
                        </Link>{" "}
                        — already waiting
                      </span>
                    ) : (
                      <span>Still matching you — check back soon</span>
                    )}
                  </div>
                </div>
              </>
            )}

            <div className="mt-6">
              <div className="mb-2 flex justify-between text-xs text-muted-foreground">
                <span>Missions done</span>
                <span>
                  {doneCount}/{missions.length}
                </span>
              </div>
              <Progress value={pct} className="h-2.5" />
            </div>
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.6fr_1fr]">
          {/* Missions */}
          <div>
            <div className="flex items-center justify-between">
              <h1 className="font-display text-2xl uppercase tracking-wide">
                Hey {greeting.split(" ")[0]} — your missions
              </h1>
              <Badge variant="outline" className="board">
                TEXT ONLY · NO VOICE NOTES
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Shared tasks with {buddy?.name ?? "your buddy"}. No awkward
              small talk — just things to do together.
            </p>
            <div className="mt-6 space-y-3">
              {missions.length === 0 ? (
                <Card>
                  <CardContent className="py-10 text-center text-sm text-muted-foreground">
                    No missions yet. {buddy ? "Say hello to get started." : "They'll appear when you're matched."}
                  </CardContent>
                </Card>
              ) : (
                missions.map((mission) => (
                  <MissionCard key={mission.id} mission={mission} />
                ))
              )}
            </div>
          </div>

          {/* Side column */}
          <div className="space-y-6">
            {me ? (
              <ProfileCard profile={me} compact />
            ) : (
              <Skeleton className="h-64 w-full" />
            )}

            {buddy && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Handshake className="size-5 text-success" />
                    Your buddy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {buddy.name} is at {buddy.school || "their school"}, matching
                    your move to {buddy.to || "your destination"}. Say hello
                    when you&apos;re ready.
                  </p>
                  <Button asChild className="w-full">
                    <Link href="/matches">
                      See your match <ArrowRight />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            <Card className="border-success/40 bg-success/5">
              <CardHeader>
                <CardTitle className="text-base">
                  Six months from now
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  You&apos;ll know this place. Then it&apos;s your turn: become
                  the buddy for the next kid arriving at{" "}
                  {me?.school || "your school"}. The chain continues.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
