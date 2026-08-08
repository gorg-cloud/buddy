"use client";

import { useMemo, useState } from "react";
import { Anchor, Compass, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { anchors, profiles } from "@/lib/demo-data";

/** Deterministic pseudo-random from a string — stable across renders. */
function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

const bandByCountry: Record<string, number> = {
  Portugal: 1,
  Canada: 2,
  Netherlands: 1,
  Australia: 3,
  "New Zealand": 3,
};

const bands = [
  { r: 70, label: "near — same region" },
  { r: 130, label: "one ocean away" },
  { r: 190, label: "the other side of the world" },
];

const ALL = "all";

export function RippleMap() {
  const [country, setCountry] = useState(ALL);

  const people = useMemo(() => {
    const peers = profiles
      .filter((p) => p.role !== "anchor")
      .map((p) => ({
        kind: "peer" as const,
        id: p.id,
        name: p.handle,
        country: p.to,
        role: "moving there" as const,
      }));
    const anchorsList = anchors.map((a) => ({
      kind: "anchor" as const,
      id: a.id,
      name: a.name,
      country: a.country,
      role: "anchor — experienced" as const,
    }));
    const all = [...peers, ...anchorsList];
    return country === ALL ? all : all.filter((p) => p.country === country);
  }, [country]);

  const pins = useMemo(() => {
    return people.map((p, i) => {
      const band = bandByCountry[p.country] ?? 2;
      const angle = (hash(p.id) % 3600) / 10; // 0–360
      const jitter = (hash(p.id + "j") % 30) - 15;
      const r = bands[band - 1].r + jitter;
      const rad = (angle * Math.PI) / 180;
      return {
        ...p,
        x: 200 + r * Math.cos(rad),
        y: 200 + r * Math.sin(rad),
        band,
      };
    });
  }, [people]);

  const countries = useMemo(() => {
    const set = new Set<string>([
      ...anchors.map((a) => a.country),
      ...profiles.filter((p) => p.role !== "anchor").map((p) => p.to),
    ]);
    return [ALL, ...set];
  }, []);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      {/* The ripple visual — a paper terminal map */}
      <div className="border-2 border-ink/30 bg-paper p-4 shadow-[3px_3px_0_0_rgba(22,19,14,0.14)]">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="board text-[11px] tracking-[0.2em] text-ink/60">
            YOUR WORLD — {people.length} PEOPLE AROUND YOU
          </p>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="board inline-flex items-center gap-1.5 text-ink/60">
              <span className="size-2 bg-amber" /> anchor
            </span>
            <span className="board inline-flex items-center gap-1.5 text-ink/60">
              <span className="size-2 bg-signal" /> peer
            </span>
          </div>
        </div>

        <svg
          viewBox="0 0 400 400"
          className="mx-auto w-full max-w-md"
          role="img"
          aria-label="Map of people around you"
        >
          {/* paper texture rings */}
          {bands.map((b) => (
            <circle
              key={b.r}
              cx="200"
              cy="200"
              r={b.r}
              fill="none"
              stroke="var(--ink)"
              strokeOpacity="0.18"
              strokeWidth="1.5"
              strokeDasharray="4 6"
            />
          ))}
          {bands.map((b) => (
            <text
              key={b.r}
              x="200"
              y={200 - b.r - 10}
              textAnchor="middle"
              fontFamily="var(--font-space-mono)"
              fontSize="8"
              letterSpacing="2"
              fill="var(--ink)"
              opacity="0.5"
            >
              {b.label}
            </text>
          ))}

          {/* compass */}
          <g transform="translate(352, 52)">
            <circle r="14" fill="none" stroke="var(--ink)" strokeOpacity="0.4" />
            <path d="M0 -9 L3 3 L0 0 L-3 3 Z" fill="var(--ink)" opacity="0.6" />
            <text
              y="-16"
              textAnchor="middle"
              fontFamily="var(--font-space-mono)"
              fontSize="7"
              letterSpacing="1"
              fill="var(--ink)"
              opacity="0.5"
            >
              N
            </text>
          </g>

          {/* center — you */}
          <circle
            cx="200"
            cy="200"
            r="18"
            fill="var(--amber)"
            opacity="0.18"
          />
          <circle cx="200" cy="200" r="7" fill="var(--amber)" />
          <text
            x="200"
            y="234"
            textAnchor="middle"
            fontFamily="var(--font-space-mono)"
            fontSize="10"
            fontWeight="700"
            letterSpacing="2"
            fill="var(--ink)"
          >
            YOU
          </text>

          {pins.map((p) => (
            <g key={p.id}>
              <circle
                cx={p.x}
                cy={p.y}
                r={p.kind === "anchor" ? 8 : 6}
                fill={p.kind === "anchor" ? "var(--amber)" : "var(--signal)"}
              />
              <circle
                cx={p.x}
                cy={p.y}
                r={p.kind === "anchor" ? 13 : 10}
                fill="none"
                stroke={p.kind === "anchor" ? "var(--amber)" : "var(--signal)"}
                strokeWidth="1"
                opacity="0.4"
              />
              <text
                x={p.x}
                y={p.y + 24}
                textAnchor="middle"
                fontFamily="var(--font-space-mono)"
                fontSize="8"
                letterSpacing="1.5"
                fill="var(--ink)"
                opacity="0.65"
              >
                {initials(p.name)}
              </text>
            </g>
          ))}
        </svg>

        <p className="board mt-2 text-center text-[10px] tracking-[0.2em] text-alarm">
          ANCHORS ANSWER QUESTIONS. THEY ARE NOT FOR MEETING UP. EVER.
        </p>
      </div>

      {/* List */}
      <div className="border-2 border-ink/30 bg-paper p-4 shadow-[3px_3px_0_0_rgba(22,19,14,0.14)]">
        <div className="flex items-center justify-between gap-2">
          <p className="font-display text-lg uppercase tracking-tight">
            Near you
          </p>
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((c) => (
                <SelectItem key={c} value={c}>
                  {c === ALL ? "Everywhere" : c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-4 space-y-2">
          {pins.map((p) => (
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
                  {p.country} · {p.role}
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
          ))}
          {pins.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Nobody around you yet. Be the first anchor in this region.
            </p>
          )}
        </div>

        <Separator className="my-4" />
        <div className="flex items-start gap-3 text-sm text-muted-foreground">
          <Compass className="mt-0.5 size-4 shrink-0 text-amber" />
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
