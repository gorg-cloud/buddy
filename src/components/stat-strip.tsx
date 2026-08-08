"use client";

import { useEffect, useState } from "react";

import { CountUp } from "@/components/count-up";

interface Stats {
  real: boolean;
  arrivals: number;
  carried: number;
  waiting: number;
}

const items = [
  { key: "arrivals" as const, label: "Arrivals on the board" },
  { key: "carried" as const, label: "Kids carried — the chain" },
  { key: "waiting" as const, label: "Waiting for a buddy" },
];

export function StatStrip() {
  const [stats, setStats] = useState<Stats>({
    real: false,
    arrivals: 0,
    carried: 0,
    waiting: 0,
  });

  useEffect(() => {
    let cancelled = false;
    fetch("/api/stats")
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch(() => {
        /* not live yet — the dashes stay */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="grid grid-cols-1 divide-y-2 divide-ink/15 border-2 border-ink/25 bg-paper shadow-[3px_3px_0_0_rgba(22,19,14,0.14)] sm:grid-cols-3 sm:divide-x-2 sm:divide-y-0">
      {items.map((item) => (
        <div key={item.key} className="px-6 py-5 text-center">
          <p className="board text-4xl font-bold text-ink sm:text-5xl">
            {stats.real ? (
              <CountUp to={stats[item.key]} duration={1.8} />
            ) : (
              "—"
            )}
          </p>
          <p className="board mt-2 text-[10px] tracking-[0.2em] text-ink/55">
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
}
