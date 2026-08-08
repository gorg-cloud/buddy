import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";

import { RippleMap } from "@/components/ripple-map";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

export default function MapPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="border-b border-border/70">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
            <p className="board text-xs text-primary">THE MAP</p>
            <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
              Your world, as ripples.
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Anchors and peers around you — people who&apos;ve been where
              you&apos;re going, and people moving the same way you are.
            </p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
          <RippleMap />

          <div className="mt-10 flex flex-col items-start justify-between gap-6 rounded-xl border border-border bg-card p-8 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <Info className="mt-1 size-5 shrink-0 text-primary" />
              <div>
                <h2 className="font-display text-xl font-semibold">
                  Want to become an anchor?
                </h2>
                <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                  Lived somewhere for a while and know the place? Be the person
                  a new kid wishes they had. Answer questions, share the
                  shortcuts, keep the chain going.
                </p>
              </div>
            </div>
            <Button asChild>
              <Link href="/signup">
                Become an anchor <ArrowRight />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
