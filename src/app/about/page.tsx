import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";

import { PageHeader } from "@/components/signage";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <PageHeader
          tag="The story"
          title={
            <>
              I moved countries every 2–3 years.{" "}
              <span className="text-amber">Every single time,</span> I built
              my life from zero.
            </>
          }
          lede="New country. New school. New language of friendship to learn. I'd make my people, find my corner, start to belong — and then the move would come and it would all be destroyed. Not slowly. Overnight."
        />

        <section className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
          <div className="space-y-8 text-base leading-relaxed text-ink/80">
            <p>
              The worst part was never the packing or the paperwork. It was{" "}
              <strong className="text-ink">day one</strong>. Walking into a
              school where everyone already had their people, their inside
              jokes, their seats — and I had nothing. I&apos;ve been the new
              kid more times than I can count, and it never got easier.
            </p>
            <p>
              People say kids are resilient. And it&apos;s true — I always
              rebuilt. But I should never have had to do it alone, and neither
              should anyone else. The loneliness of starting over is the part
              nobody talks about.
            </p>
            <p>
              So I built Buddy. The thing I wish someone had handed me at every
              airport, every first day, every time I had to start at zero
              again.
            </p>
          </div>

          <div className="mt-14 border-2 border-ink/30 bg-paper p-8 shadow-[3px_3px_0_0_rgba(22,19,14,0.14)]">
            <div className="flex items-start gap-4">
              <Compass className="mt-1 size-6 shrink-0 text-amber" />
              <div>
                <h2 className="font-display text-2xl uppercase tracking-tight">
                  Never start at zero.
                </h2>
                <p className="mt-2 text-muted-foreground">
                  That&apos;s the whole mission. One buddy before you land, one
                  friend on day one, and one chain of kids carrying each other
                  across every border on earth.
                </p>
                <Button className="mt-6" asChild>
                  <Link href="/signup">
                    Get your buddy <ArrowRight />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
