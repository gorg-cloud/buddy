"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Anchor, Compass, Crosshair, Users } from "lucide-react";
import { toast } from "sonner";

import { CountryPicker } from "@/components/country-picker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { isSupabaseConfigured } from "@/lib/auth";
import type { MapPerson } from "@/lib/types";

// Leaflet touches `window` at import time — never server-render it.
const MapView = dynamic(
  () => import("@/components/map-view").then((m) => m.MapView),
  { ssr: false }
);

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

interface MapData {
  anchors: MapPerson[];
  peers: MapPerson[];
}

export function RippleMap() {
  const [data, setData] = useState<MapData>({ anchors: [], peers: [] });
  const [loading, setLoading] = useState(true);
  const [country, setCountry] = useState("");
  const [focus, setFocus] = useState<{ lat: number; lng: number } | null>(null);

  // Real anchors + peers from the database, with real coordinates.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/map")
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((d) => {
        if (cancelled) return;
        setData({
          anchors: Array.isArray(d.anchors) ? d.anchors : [],
          peers: Array.isArray(d.peers) ? d.peers : [],
        });
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const people = useMemo(() => {
    const all = [...data.anchors, ...data.peers];
    return country ? all.filter((p) => p.country === country) : all;
  }, [data, country]);

  const findMe = useCallback(() => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      toast.error("Your browser doesn't support location");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );
          const geo = (await res.json()) as {
            address?: { country?: string };
          };
          const place = geo.address?.country;
          if (place) setCountry(place);
          setFocus({ lat: latitude, lng: longitude });
          toast.success(place ? `You're in ${place}` : "Found you on the map");
        } catch {
          setFocus({ lat: latitude, lng: longitude });
        }
      },
      () => toast.error("Couldn't get your location"),
      { enableHighAccuracy: false, timeout: 8000 }
    );
  }, []);

  const inCountry = useMemo(
    () => [...data.anchors, ...data.peers].some((p) => p.country === country),
    [data, country]
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      {/* The real map */}
      <div className="border-2 border-ink/30 bg-paper p-4 shadow-[3px_3px_0_0_rgba(22,19,14,0.14)]">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="board text-[11px] tracking-[0.2em] text-ink/60">
            {loading
              ? "READING THE WORLD…"
              : `THE WORLD — ${people.length} ${
                  people.length === 1 ? "PERSON" : "PEOPLE"
                } ON THIS VIEW`}
          </p>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="board inline-flex items-center gap-1.5 text-ink/60">
              <span className="size-2 bg-amber" /> anchor
            </span>
            <span className="board inline-flex items-center gap-1.5 text-ink/60">
              <span className="size-2 bg-sky" /> peer
            </span>
          </div>
        </div>

        <div className="h-[380px] w-full overflow-hidden border-2 border-ink sm:h-[460px]">
          {loading ? (
            <div className="flex h-full items-center justify-center bg-ink">
              <span className="board animate-pulse text-[11px] tracking-[0.3em] text-amber">
                PLOTTING REAL PLACES…
              </span>
            </div>
          ) : (
            <MapView people={people} focus={focus} />
          )}
        </div>

        <p className="board mt-2 text-center text-[10px] tracking-[0.2em] text-alarm">
          ANCHORS ANSWER QUESTIONS. THEY ARE NOT FOR MEETING UP. EVER.
        </p>
      </div>

      {/* Controls + list */}
      <div className="flex flex-col border-2 border-ink/30 bg-paper p-4 shadow-[3px_3px_0_0_rgba(22,19,14,0.14)]">
        <div className="flex items-center justify-between gap-2">
          <p className="font-display text-lg uppercase tracking-tight">
            Near you
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={findMe}
            className="shrink-0"
          >
            <Crosshair className="size-3.5" />
            Find me
          </Button>
        </div>

        <div className="mt-3 space-y-2">
          <CountryPicker
            value={country}
            onValueChange={setCountry}
            placeholder="Everywhere — pick a country"
          />
          {country && (
            <button
              type="button"
              onClick={() => setCountry("")}
              className="board cursor-pointer text-[10px] tracking-[0.2em] text-amber-deep underline underline-offset-2 hover:text-ink"
            >
              CLEAR FILTER · SHOW EVERYWHERE
            </button>
          )}
        </div>

        {!isSupabaseConfigured() && (
          <p className="board mt-3 border-2 border-amber/40 bg-amber/10 px-3 py-2 text-[10px] tracking-[0.15em] text-amber-deep">
            CONNECT SUPABASE AND REAL ANCHORS + PEERS APPEAR HERE — THE MAP
            ITSELF IS ALREADY THE REAL WORLD.
          </p>
        )}

        <div className="mt-4 flex-1 space-y-2 overflow-y-auto">
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          ) : people.length === 0 ? (
            <div className="border border-ink/20 bg-muted/40 p-6 text-center">
              <p className="board text-[11px] tracking-[0.2em] text-amber-deep">
                {country ? `NOTHING IN ${country.toUpperCase()} YET` : "NO ONE HERE YET"}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {country && !inCountry
                  ? "Nobody has landed here yet. When a mover or an anchor signs up, they appear on the map."
                  : "Be the first. The map fills up as kids sign up — every real place, plotted for real."}
              </p>
            </div>
          ) : (
            people.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-3 border border-ink/20 bg-muted/40 p-3"
              >
                <span className="board flex size-9 shrink-0 items-center justify-center bg-ink text-xs font-bold text-paper">
                  {initials(p.name)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-sm uppercase tracking-wide">
                    {p.name}
                  </p>
                  <p className="board text-[10px] tracking-[0.15em] text-ink/55">
                    {p.city ? `${p.city}, ` : ""}
                    {p.country} · {p.detail}
                  </p>
                </div>
                <Badge
                  variant={p.kind === "anchor" ? "default" : "sky"}
                  className="shrink-0"
                >
                  {p.kind === "anchor" ? (
                    <Anchor className="size-3" />
                  ) : (
                    <Users className="size-3" />
                  )}
                  {p.kind === "anchor" ? "anchor" : "peer"}
                </Badge>
              </div>
            ))
          )}
        </div>

        <Separator className="my-4" />
        <div className="flex items-start gap-3 text-sm text-muted-foreground">
          <Compass className="mt-0.5 size-4 shrink-0 text-amber-deep" />
          <p>
            Anchors are kids who&apos;ve lived where you&apos;re going. Ask
            them anything: school, neighbourhoods, how to make friends fast.
            They&apos;re here to guide — never to meet up.
          </p>
        </div>
      </div>
    </div>
  );
}
