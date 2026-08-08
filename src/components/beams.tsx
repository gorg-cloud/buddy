"use client";

import { useEffect, useRef } from "react";

const COLORS = ["#f2a516", "#7dd3fc", "#f4f6fa"];

/**
 * Terminal light shafts — soft amber and sky beams drifting slowly down the
 * dusk walls. Canvas + rAF; renders one static frame under reduced motion.
 */
export function Beams({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const el = canvas; // permanent non-null aliases — TS loses narrowing in closures
    const ctx = el.getContext("2d");
    if (!ctx) return;
    const c = ctx;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    let raf = 0;
    let w = 0;
    let h = 0;
    let dpr = 1;

    const beams = Array.from({ length: 6 }, (_, i) => ({
      x: 0.06 + i * 0.16,
      tilt: (i % 2 === 0 ? -1 : 1) * (0.04 + (i % 3) * 0.02),
      speed: 0.05 + (i % 4) * 0.02,
      phase: i * 1.7,
      color: COLORS[i % COLORS.length],
      width: 0.045 + (i % 3) * 0.02,
    }));

    function resize() {
      const rect = el.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      el.width = Math.round(w * dpr);
      el.height = Math.round(h * dpr);
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    function draw(t: number) {
      c.clearRect(0, 0, w, h);
      const time = reduce ? 0 : t / 1000;
      for (const b of beams) {
        const sway = Math.sin(time * b.speed + b.phase) * b.tilt * w * 0.07;
        const x = b.x * w + sway;
        const half = b.width * w;
        const grad = c.createLinearGradient(x - half, 0, x + half, 0);
        grad.addColorStop(0, "rgba(0,0,0,0)");
        grad.addColorStop(0.5, `${b.color}30`);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        c.fillStyle = grad;
        c.fillRect(x - half, 0, half * 2, h);
      }
      if (!reduce) raf = requestAnimationFrame(draw);
    }
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden />;
}
