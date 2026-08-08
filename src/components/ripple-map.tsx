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
import { cn } from "@/lib/utils";

/** Deterministic pseudo-random from a string — stable across renders. */
function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
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
      .map((p) => ({ kind: "peer" as const, id: p.id, name: p.handle, country: p.to, emoji: p.emoji, role: "moving there" as const }));
    const anchorsList = anchors.map((a) => ({
      kind: "anchor" as const,
      id: a.id,
      name: a.name,
      country: a.country,
      emoji: a.emoji,
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
      {/* The ripple visual */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="board text-xs text-muted-foreground">
            YOUR WORLD — {people.length} PEOPLE AROUND YOU
          </p>
          <div className="flex items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <span className="size-2 rounded-full bg-primary" /> anchor
            </span>
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <span className="size-2 rounded-full bg-accent" /> peer
            </span>
          </div>
        </div>

        <svg viewBox="0 0 400 400" className="mx-auto w-full max-w-md" role="img" aria-label="Map of people around you">
          {bands.map((b) => (
            <circle
              key={b.r}
              cx="200"
              cy="200"
              r={b.r}
              fill="none"
              stroke="var(--border)"
              strokeWidth="1"
              strokeDasharray="3 5"
            />
          ))}
          {bands.map((b) => (
            <text
              key={b.r}
              x="200"
              y={200 - b.r - 8}
              textAnchor="middle"
              className="board"
              fill="var(--muted-foreground)"
              fontSize="8"
            >
              {b.label}
            </text>
          ))}

          {/* center — you */}
          <circle cx="200" cy="200" r="16" fill="var(--primary)" opacity="0.15" />
          <circle cx="200" cy="200" r="6" fill="var(--primary)" />
          <text
            x="200"
            y="228"
            textAnchor="middle"
            className="board"
            fill="var(--foreground)"
            fontSize="9"
            fontWeight="700"
          >
            YOU
          </text>

          {pins.map((p) => (
            <g key={p.id}>
              <circle
                cx={p.x}
                cy={p.y}
                r={p.kind === "anchor" ? 8 : 6}
                fill={p.kind === "anchor" ? "var(--primary)" : "var(--accent)"}
                opacity="0.9"
              />
              <circle
                cx={p.x}
                cy={p.y}
                r={p.kind === "anchor" ? 13 : 10}
                fill="none"
                stroke={p.kind === "anchor" ? "var(--primary)" : "var(--accent)"}
                strokeWidth="1"
                opacity="0.35"
              />
              <text
                x={p.x}
                y={p.y + 22}
                textAnchor="middle"
                className="board"
                fill="var(--muted-foreground)"
                fontSize="8"
              >
                {p.name}
              </text>
            </g>
          ))}
        </svg>

        <p className="board mt-2 text-center text-[10px] text-muted-foreground">
          ANCHORS ANSWER QUESTIONS. THEY ARE NOT FOR MEETING UP. EVER.
        </p>
      </div>

      {/* List */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="font-display text-lg font-semibold">Near you</p>
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
              className="flex items-center gap-3 rounded-lg border border-border/70 bg-muted/30 p-3"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-lg">
                {p.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{p.name}</p>
                <p className="board text-[10px] text-muted-foreground">
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
          <Compass className="mt-0.5 size-4 shrink-0 text-primary" />
          <p>
            Anchors are kids who've lived where you're going. Ask them anything:
            school, neighbourhoods, how to make friends fast. They're here to
            guide — never to meet up.
          </p>
        </div>
      </div>
    </div>
  );
}
