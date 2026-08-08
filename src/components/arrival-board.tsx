"use client";

import { useEffect, useState } from "react";

import { arrivals } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

const VISIBLE = 3;

export function ArrivalBoard() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 3500);
    return () => clearInterval(id);
  }, []);

  const rows = Array.from(
    { length: VISIBLE },
    (_, i) => arrivals[(tick + i) % arrivals.length]
  );

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
      {/* board header */}
      <div className="flex items-center justify-between border-b border-border bg-black/40 px-4 py-2">
        <span className="board text-[11px] text-muted-foreground">
          ● ARRIVALS — LIVE
        </span>
        <span className="board text-[11px] text-muted-foreground">
          BUDDY GATE 01
        </span>
      </div>

      {/* column labels */}
      <div className="board grid grid-cols-[2.5rem_1fr_1fr_auto] items-center gap-3 border-b border-border/60 px-4 py-2 text-[10px] text-muted-foreground/70 sm:grid-cols-[4rem_1fr_1fr_auto]">
        <span>FLT</span>
        <span>FROM</span>
        <span>TO</span>
        <span className="pr-1">STATUS</span>
      </div>

      {/* rows */}
      <div className="divide-y divide-border/60">
        {rows.map((arrival, rowIndex) => (
          <div
            key={`${arrival.id}-${tick}`}
            className="board grid grid-cols-[2.5rem_1fr_1fr_auto] items-center gap-3 px-4 py-3.5 text-xs sm:grid-cols-[4rem_1fr_1fr_auto] sm:text-sm"
          >
            <span className="flap-cell text-primary">{arrival.flight}</span>
            <span className="flap-cell text-foreground/85">{arrival.from}</span>
            <span className="flap-cell flex items-center gap-1.5 text-foreground/85">
              <span className="text-muted-foreground">→</span>
              <span className="font-bold text-foreground">{arrival.to}</span>
            </span>
            <span className="flap-cell flex justify-end">
              {arrival.status === "found" ? (
                <span className="inline-flex items-center gap-1 text-success">
                  <span className="size-1.5 rounded-full bg-success" />
                  FOUND
                </span>
              ) : (
                <span className="pulse-soft inline-flex items-center gap-1 text-primary">
                  <span className="size-1.5 rounded-full bg-primary" />
                  WAITING
                </span>
              )}
            </span>
          </div>
        ))}
      </div>

      {/* footer */}
      <div
        className={cn(
          "board flex items-center justify-between border-t border-border bg-black/40 px-4 py-2 text-[10px] text-muted-foreground"
        )}
      >
        <span>EVERY KID ARRIVES WITH SOMEONE</span>
        <span>{tick % 2 === 0 ? "NEXT FLIGHT 00:47" : "BOARDING NOW"}</span>
      </div>
    </div>
  );
}
