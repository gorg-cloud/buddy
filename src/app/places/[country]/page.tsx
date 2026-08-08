import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Landmark, Milestone, Sparkles } from "lucide-react";

import { Barcode } from "@/components/barcode";
import { PageHeader } from "@/components/signage";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { countryBySlug, slugify } from "@/lib/countries";
import { getGuide } from "@/lib/guides";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string }>;
}): Promise<Metadata> {
  const { country } = await params;
  const c = countryBySlug(country);
  if (!c) return { title: "Guide not found — Buddy" };
  const guide = getGuide(c.name, c.code);
  return {
    title: `${c.name} guide — Buddy`,
    description: guide.tagline,
  };
}

export default async function CountryGuidePage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  const c = countryBySlug(country);
  if (!c) notFound();

  const guide = getGuide(c.name, c.code);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <PageHeader
          tag={`${c.code} · ${c.region}`}
          title={
            <>
              Landing in {c.name}.
            </>
          }
          lede={guide.tagline}
        >
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Badge variant={guide.curated ? "success" : "outline"} className="board">
              {guide.curated ? "CURATED GUIDE" : "STARTER GUIDE"}
            </Badge>
            <span className="board text-[10px] tracking-[0.2em] text-ink/50">
              {c.lat.toFixed(1)}° {c.lng >= 0 ? "N" : "S"} · {Math.abs(c.lng).toFixed(1)}°{" "}
              {c.lng >= 0 ? "E" : "W"}
            </span>
          </div>
        </PageHeader>

        <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
          {guide.curated ? (
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="space-y-8">
                <div>
                  <p className="board flex items-center gap-2 text-[11px] tracking-[0.25em] text-amber-deep">
                    <Landmark className="size-4" /> GOOD PLACES
                  </p>
                  <div className="mt-4 space-y-3">
                    {guide.places.map((p, i) => (
                      <div
                        key={p.name}
                        className="border-2 border-ink/20 bg-paper p-4 shadow-[2px_2px_0_0_rgba(22,19,14,0.12)]"
                      >
                        <p className="font-display text-lg uppercase tracking-tight">
                          <span className="text-amber-deep">{String(i + 1).padStart(2, "0")}</span>{" "}
                          {p.name}
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {p.note}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="board flex items-center gap-2 text-[11px] tracking-[0.25em] text-amber-deep">
                    <Sparkles className="size-4" /> GOOD TO KNOW
                  </p>
                  <ul className="mt-4 space-y-2.5">
                    {guide.know.map((k) => (
                      <li
                        key={k}
                        className="flex gap-3 border border-ink/20 bg-muted/40 p-3 text-sm leading-relaxed text-ink/80"
                      >
                        <span className="board mt-0.5 shrink-0 text-[10px] text-signal">
                          ✓
                        </span>
                        {k}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="board flex items-center gap-2 text-[11px] tracking-[0.25em] text-amber-deep">
                    <Milestone className="size-4" /> MEETING PEOPLE
                  </p>
                  <ul className="mt-4 space-y-2.5">
                    {guide.meet.map((m) => (
                      <li
                        key={m}
                        className="flex gap-3 border border-ink/20 bg-muted/40 p-3 text-sm leading-relaxed text-ink/80"
                      >
                        <span className="board mt-0.5 shrink-0 text-[10px] text-amber-deep">
                          →
                        </span>
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-2xl border-2 border-ink/30 bg-paper p-8 text-center shadow-[3px_3px_0_0_rgba(22,19,14,0.14)]">
              <p className="board text-xs tracking-[0.25em] text-amber-deep">
                THIS GUIDE IS A STARTER
              </p>
              <p className="mt-4 text-lg leading-relaxed text-ink/85">
                Nobody&apos;s written the full guide for {c.name} yet — so the
                real intel comes from the kids who are there right now. Join
                the room, ask your questions, and be the first to share what
                you learn.
              </p>
            </div>
          )}

          {/* Honest fallback sections for uncurated countries */}
          {!guide.curated && (
            <div className="mx-auto mt-8 grid max-w-3xl gap-6 sm:grid-cols-2">
              <div className="border-2 border-ink/20 bg-paper p-5">
                <p className="board text-[10px] tracking-[0.22em] text-amber-deep">
                  MEETING PEOPLE
                </p>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink/80">
                  {guide.meet.map((m) => (
                    <li key={m} className="flex gap-2">
                      <span className="text-amber-deep">→</span> {m}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-2 border-ink/20 bg-paper p-5">
                <p className="board text-[10px] tracking-[0.22em] text-amber-deep">
                  GOOD TO KNOW
                </p>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink/80">
                  {guide.know.map((k) => (
                    <li key={k} className="flex gap-2">
                      <span className="text-signal">✓</span> {k}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
            <div className="flex flex-col justify-between gap-4 border-2 border-ink/30 bg-paper p-5">
              <div>
                <p className="font-display text-lg uppercase tracking-tight">
                  Join the room
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Ask the kids in {c.name} anything — they&apos;re there right
                  now.
                </p>
              </div>
              <Button asChild>
                <Link href={`/community?room=${encodeURIComponent(c.name)}`}>
                  The {c.name} lounge <ArrowRight />
                </Link>
              </Button>
            </div>
            <div className="flex flex-col justify-between gap-4 border-2 border-ink/30 bg-paper p-5">
              <div>
                <p className="font-display text-lg uppercase tracking-tight">
                  See who&apos;s there
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Anchors and movers plotted on the real map.
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/map">Open the map <ArrowRight /></Link>
              </Button>
            </div>
          </div>

          {/* Ticket footer */}
          <div className="mx-auto mt-10 max-w-3xl">
            <div className="perf" aria-hidden />
            <div className="flex items-center justify-between gap-4 border-2 border-ink bg-ink px-5 py-3">
              <span className="board text-[10px] tracking-[0.2em] text-paper/60">
                BUDDY FIELD GUIDE · {c.code}
              </span>
              <Barcode seed={`guide-${c.code}`} className="h-6 w-28 opacity-80" />
              <span className="board hidden text-[10px] tracking-[0.2em] text-amber sm:block">
                {slugify(c.name).toUpperCase()}
              </span>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
