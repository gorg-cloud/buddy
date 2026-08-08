"use client";

import Link from "next/link";
import { ArrowRight, Handshake, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { ProfileCard } from "@/components/profile-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { currentUser, profiles } from "@/lib/demo-data";

export default function MatchesPage() {
  const buddy = profiles.find(
    (p) => p.role === "buddy" && p.to === currentUser.to
  );
  const peer = profiles.find((p) => p.role === "mover" && p.id !== "me");

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="border-b border-border/70">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
            <p className="board text-xs text-primary">YOUR MATCHES</p>
            <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
              Someone is already waiting.
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              {buddy
                ? `Matched by destination and age: ${buddy.name}, at ${buddy.school} in ${buddy.to}.`
                : "We're still matching you — check back soon."}
            </p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
          {buddy ? (
            <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <Badge variant="success" className="board">
                    MATCHED ✓
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {currentUser.from} → {buddy.to} · same destination, close
                    in age
                  </span>
                </div>
                <ProfileCard profile={buddy} />
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Sparkles className="size-4 text-primary" />
                      First hello
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Your first mission is on your dashboard: tell {buddy.name}{" "}
                      one thing you&apos;re scared of and one thing
                      you&apos;re excited about. They&apos;ll reply with
                      theirs. That&apos;s how every Buddy friendship starts.
                    </p>
                    <Button
                      className="w-full"
                      onClick={() =>
                        toast.success(
                          "First hello unlocked on your dashboard"
                        )
                      }
                    >
                      Say hello <ArrowRight />
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/dashboard">Open my missions</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-success/40 bg-success/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Handshake className="size-4 text-success" />
                      The chain
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Six months after you land at {currentUser.school}, you
                      become the buddy for the next kid arriving there.
                      {buddy.name} was carried. One day, you carry.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Card className="mx-auto max-w-lg text-center">
              <CardContent className="py-12">
                <p className="board text-2xl text-primary">WAITING…</p>
                <p className="mt-3 text-muted-foreground">
                  Nobody at your destination has signed up as a buddy yet. Be
                  the first to arrive — or invite a friend at your new school
                  to join.
                </p>
                <Button className="mt-6" asChild>
                  <Link href="/map">
                    See who&apos;s around <ArrowRight />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {peer && (
            <div className="mt-14">
              <h2 className="font-display text-xl font-bold">
                Others moving your way
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                You&apos;re not the only one making this journey.
              </p>
              <div className="mt-6 max-w-md">
                <ProfileCard profile={peer} compact />
              </div>
            </div>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
