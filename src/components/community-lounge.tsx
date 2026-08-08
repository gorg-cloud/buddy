"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Globe2 } from "lucide-react";

import { ChatRoom } from "@/components/chat-room";
import { CountryPicker } from "@/components/country-picker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { COUNTRIES, slugify } from "@/lib/countries";
import { cn } from "@/lib/utils";

const FEATURED = [
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Canada",
  "Australia",
  "Spain",
  "France",
  "Germany",
  "Singapore",
  "Netherlands",
];

export function CommunityLounge({ initialRoom }: { initialRoom?: string }) {
  const [room, setRoom] = useState(
    initialRoom && initialRoom !== "global" ? initialRoom : "global"
  );
  const [custom, setCustom] = useState(
    initialRoom && initialRoom !== "global" ? initialRoom : ""
  );

  const featured = useMemo(
    () =>
      FEATURED.map((name) => COUNTRIES.find((c) => c.name === name)).filter(
        (c): c is (typeof COUNTRIES)[number] => Boolean(c)
      ),
    []
  );

  function pick(name: string) {
    setRoom(name === "global" ? "global" : name);
    setCustom(name === "global" ? "" : name);
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      {/* Room switcher */}
      <div className="flex flex-col gap-4 border-2 border-ink/30 bg-paper p-5 shadow-[3px_3px_0_0_rgba(22,19,14,0.14)] md:flex-row md:items-end">
        <div className="min-w-0 flex-1">
          <label
            htmlFor="lounge-room"
            className="board text-[10px] tracking-[0.22em] text-amber-deep"
          >
            WHICH ROOM?
          </label>
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => pick("global")}
              className={cn(
                "board flex cursor-pointer items-center gap-2 border-2 px-4 py-2.5 text-[11px] tracking-[0.18em] transition-colors",
                room === "global"
                  ? "border-ink bg-ink text-amber"
                  : "border-ink/30 bg-paper text-ink/70 hover:border-ink/60"
              )}
            >
              <Globe2 className="size-4" />
              GLOBAL
            </button>
            <div className="flex-1">
              <CountryPicker
                id="lounge-room"
                value={custom}
                onValueChange={pick}
                placeholder="Or jump into a country…"
              />
            </div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {room === "global"
              ? "The worldwide room — everyone from everywhere."
              : `The ${room} room — for kids moving to, or already in, ${room}.`}
          </p>
        </div>
        <Button variant="outline" size="sm" asChild className="shrink-0">
          <Link href={`/places/${slugify(room)}`}>
            Guide for {room === "global" ? "your country" : room} <ArrowRight />
          </Link>
        </Button>
      </div>

      {/* Featured rooms */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span className="board text-[10px] tracking-[0.22em] text-ink/50">
          QUICK JUMP:
        </span>
        {featured.map((c) => (
          <button
            key={c.code}
            type="button"
            onClick={() => pick(c.name)}
            className={cn(
              "board cursor-pointer border-2 px-2.5 py-1 text-[10px] tracking-[0.15em] transition-colors",
              room === c.name
                ? "border-amber bg-amber/20 text-ink"
                : "border-ink/20 bg-paper text-ink/60 hover:border-ink/50"
            )}
          >
            {c.code} · {c.name.toUpperCase()}
          </button>
        ))}
        <Link
          href="/places"
          className="board ml-1 inline-flex items-center gap-1 text-[10px] tracking-[0.15em] text-amber-deep underline underline-offset-2 hover:text-ink"
        >
          ALL 250 GUIDES <ArrowRight className="size-3" />
        </Link>
      </div>

      {/* The chat */}
      <div className="mt-8">
        <ChatRoom mode="community" room={room} />
      </div>

      <div className="mt-6 flex items-start gap-3 border-2 border-ink/20 bg-paper/60 p-4 text-sm text-muted-foreground">
        <Badge variant="sky" className="mt-0.5 shrink-0">
          RULES
        </Badge>
        <p className="leading-relaxed">
          The lounge is public — everyone can read it, so keep it kind and keep
          it safe. No personal contact info in the room. If something feels
          wrong, report it to a trusted adult. 14+ only, always.
        </p>
      </div>
    </section>
  );
}
