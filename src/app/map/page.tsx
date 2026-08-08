import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";

import { Beams } from "@/components/beams";
import { RippleMap } from "@/components/ripple-map";
import { PageHeader } from "@/components/signage";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

export default function MapPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <PageHeader
          tag="The map"
          title="Your world, as ripples."
          lede="Anchors and peers around you — people who've been where you're going, and people moving the same way you are."
        />

        <section className="relative mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
          {/* terminal light shafts on the dusk walls */}
          <Beams className="pointer-events-none absolute inset-0 h-full w-full" />
          <div className="relative">
            <RippleMap />

          </div>

          <div className="mt-10 flex flex-col items-start justify-between gap-6 border-2 border-ink/30 bg-paper p-8 shadow-[3px_3px_0_0_rgba(22,19,14,0.14)] sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <Info className="mt-1 size-5 shrink-0 text-amber-deep" />
              <div>
                <h2 className="font-display text-xl uppercase tracking-wide">
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
