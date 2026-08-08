"use client";

import { useEffect, useRef } from "react";

/**
 * Film grain — a barely-there animated noise layer. The react-animation
 * playbook's Utility overlay: adds texture to any scene. Static under
 * reduced motion.
 */
export function Noise({
  className,
  opacity = 0.08,
}: {
  className?: string;
  opacity?: number;
}) {
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
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      const rect = el.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      el.width = Math.round(w * dpr);
      el.height = Math.round(h * dpr);
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    let frame = 0;
    function draw() {
      frame += 1;
      // Regenerate every few frames — film grain shimmers, it doesn't strobe.
      if (frame % 3 !== 0) {
        if (!reduce) raf = requestAnimationFrame(draw);
        return;
      }
      const img = c.createImageData(Math.ceil(w), Math.ceil(h));
      const data = img.data;
      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() * 255;
        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
        data[i + 3] = 255;
      }
      c.putImageData(img, 0, 0);
      if (!reduce) raf = requestAnimationFrame(draw);
    }
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className={className}
      style={{ opacity, mixBlendMode: "overlay" }}
      aria-hidden
    />
  );
}
