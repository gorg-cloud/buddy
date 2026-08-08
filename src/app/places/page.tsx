import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

import { PageHeader } from "@/components/signage";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { COUNTRIES, slugify } from "@/lib/countries";

export const metadata = {
  title: "Country guides — Buddy",
  description:
    "Good places, how to make friends, and the unwritten rules for every country on earth — from the kids who've been there.",
};

const REGION_ORDER = ["Asia", "Europe", "Africa", "Americas", "Oceania", "Antarctic"];

export default function PlacesIndexPage() {
  const byRegion = new Map<string, typeof COUNTRIES>();
  for (const c of COUNTRIES) {
    const list = byRegion.get(c.region) ?? [];
    list.push(c);
    byRegion.set(c.region, list);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <PageHeader
          tag="The guides"
          title="Every country on earth."
          lede="Where to go, how to make friends, and what nobody tells you — for all 250 places a kid could land. Curated where we know the place, honest starters where we don't."
        />

        <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
          <div className="grid gap-10">
            {REGION_ORDER.map((region) => {
              const list = (byRegion.get(region) ?? []).sort((a, b) =>
                a.name.localeCompare(b.name)
              );
              if (list.length === 0) return null;
              return (
                <div key={region}>
                  <p className="board text-[11px] tracking-[0.25em] text-amber-deep">
                    {region.toUpperCase()} — {list.length}
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                    {list.map((c) => (
                      <Link
                        key={c.code}
                        href={`/places/${slugify(c.name)}`}
                        className="group flex items-center gap-2.5 border-2 border-ink/20 bg-paper px-3 py-2.5 transition-colors hover:border-ink hover:bg-ink hover:text-paper"
                      >
                        <span className="board w-7 shrink-0 text-[10px] tracking-[0.15em] text-amber-deep group-hover:text-amber">
                          {c.code}
                        </span>
                        <span className="truncate text-sm">{c.name}</span>
                        <ArrowRight className="ml-auto size-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 flex items-start gap-3 border-2 border-ink/30 bg-paper p-6">
            <MapPin className="mt-1 size-5 shrink-0 text-amber-deep" />
            <p className="text-sm leading-relaxed text-muted-foreground">
              Every guide links to its country&apos;s community room and the
              live map. The real intel comes from the kid who&apos;s there —
              the guide just tells you where to look.
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
