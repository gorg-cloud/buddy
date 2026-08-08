"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

import type { Mission } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

const kindLabel = {
  intro: "Before you land",
  landing: "Day one",
  settle: "The chain",
} as const;

export function MissionCard({ mission }: { mission: Mission }) {
  const [done, setDone] = useState(mission.done);

  return (
    <Card className={cn("gap-0 overflow-hidden p-0", done && "opacity-70")}>
      <div className="flex items-start justify-between gap-3 p-4">
        <button
          type="button"
          onClick={() => setDone((d) => !d)}
          className="flex items-start gap-3 text-left"
          aria-pressed={done}
        >
          {done ? (
            <span className="board mt-0.5 flex size-5 shrink-0 items-center justify-center border-2 border-signal bg-signal text-[11px] font-bold text-paper">
              ✓
            </span>
          ) : (
            <span className="board mt-0.5 flex size-5 shrink-0 items-center justify-center border-2 border-ink/30 text-[10px] text-ink/40">
              &nbsp;
            </span>
          )}
          <span>
            <span
              className={cn(
                "font-display text-sm uppercase tracking-wide",
                done && "text-ink/40 line-through decoration-ink/40"
              )}
            >
              {mission.title}
            </span>
            <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
              {mission.description}
            </span>
          </span>
        </button>
        <Badge variant="outline" className="shrink-0">
          {kindLabel[mission.kind]}
        </Badge>
      </div>
    </Card>
  );
}
