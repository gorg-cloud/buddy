"use client";

import { useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";

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
    <Card
      className={cn(
        "gap-3 p-4 transition-colors",
        done && "opacity-70"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <button
          type="button"
          onClick={() => setDone((d) => !d)}
          className="flex items-start gap-3 text-left"
          aria-pressed={done}
        >
          {done ? (
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" />
          ) : (
            <Circle className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
          )}
          <span>
            <span
              className={cn(
                "font-display text-sm font-semibold",
                done && "line-through decoration-muted-foreground/50"
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
