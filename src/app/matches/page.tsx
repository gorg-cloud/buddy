"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Handshake, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { ConnectNotice } from "@/components/connect-notice";
import { ProfileCard } from "@/components/profile-card";
import { PageHeader } from "@/components/signage";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMatch } from "@/hooks/use-match";

export default function MatchesPage() {
  const router = useRouter();
  const { loading, real, me, buddy } = useMatch();

  useEffect(() => {
    if (!loading && real && !me) router.push("/onboarding");
  }, [loading, real, me, router]);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <PageHeader
          tag="Your matches"
          title="Someone is already waiting."
          lede={
            buddy
              ? `Matched by school and country: ${buddy.name}, at ${
                  buddy.school || "their school"
                } in ${buddy.to || "your destination"}.`
              : "We're still matching you — check back soon."
          }
        />

        <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
          {!loading && !real ? (
            <ConnectNotice />
          ) : loading ? (
            <Skeleton className="h-96 w-full" />
          ) : buddy ? (
            <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <Badge variant="success" className="board">
                    MATCHED ✓
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {me?.from ?? "—"} → {buddy.to} · same destination, close
                    in age
                  </span>
                </div>
                <ProfileCard profile={buddy} />
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Sparkles className="size-4 text-amber-deep" />
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
                      Six months after you land at{" "}
                      {me?.school || "your new school"}, you become the buddy
                      for the next kid arriving there. {buddy.name} was
                      carried. One day, you carry.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Card className="mx-auto max-w-lg text-center">
              <CardContent className="py-12">
                <p className="board text-2xl text-amber-deep">WAITING…</p>
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
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
