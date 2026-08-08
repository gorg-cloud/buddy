"use client";

import { useEffect, useRef, useState } from "react";

import { arrivals, type Arrival } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

const VISIBLE = 3;

/**
 * One amber character cell that flips like a real split-flap: the old top
 * half folds away, the new bottom half swings up. Falls back to a static
 * cell when the value didn't change or motion is reduced.
 */
function FlipCell({
  value,
  prev,
  className,
}: {
  value: string;
  prev?: string;
  className?: string;
}) {
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduce(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const flip = !reduce && prev !== undefined && prev !== value;

  return (
    <span
      className={cn("flap-scene relative inline-block", className)}
      style={{ height: "1.25em" }}
      aria-hidden
    >
      {flip ? (
        <>
          <span className="flap-panel flap-top-old">
            <span className="flap-half">{prev}</span>
          </span>
          <span className="flap-panel flap-top-new">
            <span className="flap-half">{value}</span>
          </span>
          <span className="flap-panel flap-bottom-old">
            <span className="flap-half">{prev}</span>
          </span>
          <span className="flap-panel flap-bottom-new">
            <span className="flap-half">{value}</span>
          </span>
        </>
      ) : (
        <span className="block leading-[1.25]">{value}</span>
      )}
    </span>
  );
}

function Screw({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "pointer-events-none absolute size-2 rounded-full bg-black/70 shadow-[inset_0_0_2px_rgba(255,255,255,0.18)]",
        className
      )}
      aria-hidden
    />
  );
}

export function ArrivalBoard() {
  const [tick, setTick] = useState(0);
  const tickRef = useRef(0);
  const [prev, setPrev] = useState<Arrival[]>(() =>
    Array.from({ length: VISIBLE }, (_, i) => arrivals[i % arrivals.length])
  );

  useEffect(() => {
    const id = setInterval(() => {
      setPrev(
        Array.from(
          { length: VISIBLE },
          (_, i) => arrivals[(tickRef.current + i) % arrivals.length]
        )
      );
      tickRef.current += 1;
      setTick(tickRef.current);
    }, 3400);
    return () => clearInterval(id);
  }, []);

  const rows = Array.from(
    { length: VISIBLE },
    (_, i) => arrivals[(tick + i) % arrivals.length]
  );

  return (
    <div className="relative">
      <div className="rounded-[4px] border-2 border-ink/70 bg-[#0d0b08] p-1.5 shadow-[8px_8px_0_0_rgba(22,19,14,0.22)] sm:p-2">
        {/* brushed metal frame */}
        <div className="rounded-[2px] bg-gradient-to-b from-[#4a443a] via-[#262219] to-[#17140f] p-[3px]">
          <div className="rounded-[1px] bg-[#0d0b08]">
            {/* header */}
            <div className="flex items-center justify-between border-b border-amber/15 px-3 py-2.5 sm:px-4">
              <span className="board flex items-center gap-2 text-[11px] tracking-[0.25em] text-amber">
                <span className="size-1.5 rounded-full bg-alarm shadow-[0_0_7px_2px_rgba(196,59,44,0.55)]" />
                Arrivals — live
              </span>
              <span className="board text-[11px] tracking-[0.25em] text-paper/50">
                Buddy Gate 01
              </span>
            </div>

            {/* column labels */}
            <div className="board grid grid-cols-[5.2rem_1fr_1fr_auto] items-center gap-3 border-b border-amber/10 px-4 py-1.5 text-[10px] tracking-[0.2em] text-paper/40">
              <span>FLT</span>
              <span>FROM</span>
              <span>TO</span>
              <span className="pr-1">STATUS</span>
            </div>

            {/* rows */}
            <div className="divide-y divide-amber/10">
              {rows.map((arrival, rowIndex) => (
                <div
                  key={`${arrival.id}-${tick}`}
                  className="board grid grid-cols-[5.2rem_1fr_1fr_auto] items-center gap-3 px-4 py-3 text-[15px]"
                >
                  <FlipCell
                    value={arrival.flight}
                    prev={prev[rowIndex]?.flight}
                    className="text-amber"
                  />
                  <FlipCell
                    value={arrival.from}
                    prev={prev[rowIndex]?.from}
                    className="text-paper/85"
                  />
                  <span className="flex items-center gap-1.5 text-paper/90">
                    <span className="text-amber/50">→</span>
                    <FlipCell
                      value={arrival.to}
                      prev={prev[rowIndex]?.to}
                      className="font-bold text-paper"
                    />
                  </span>
                  <span className="flex justify-end">
                    {arrival.status === "found" ? (
                      <span className="inline-flex items-center gap-1.5 text-[#35c97e]">
                        <span className="size-1.5 rounded-full bg-[#35c97e] shadow-[0_0_7px_1px_rgba(53,201,126,0.6)]" />
                        <span className="text-[10px] tracking-[0.15em]">
                          FOUND
                        </span>
                      </span>
                    ) : (
                      <span className="pulse-soft inline-flex items-center gap-1.5 text-amber">
                        <span className="size-1.5 rounded-full bg-amber shadow-[0_0_7px_1px_rgba(242,165,22,0.6)]" />
                        <span className="text-[10px] tracking-[0.15em]">
                          WAITING
                        </span>
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>

            {/* footer */}
            <div className="board flex items-center justify-between border-t border-amber/15 px-3 py-2 text-[10px] tracking-[0.2em] text-paper/50 sm:px-4">
              <span>Every kid arrives with someone</span>
              <span className="text-amber">
                {tick % 2 === 0 ? "NEXT FLIGHT 00:47" : "BOARDING NOW"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* housing screws */}
      <Screw className="top-2.5 left-2.5" />
      <Screw className="top-2.5 right-2.5" />
      <Screw className="bottom-2.5 left-2.5" />
      <Screw className="right-2.5 bottom-2.5" />
    </div>
  );
}
