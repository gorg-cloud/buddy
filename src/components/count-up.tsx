"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

/**
 * React Bits `CountUp` — a number that counts up (or down) from `from` to
 * `to` when it scrolls into view. Pure JS + framer-motion.
 */
export function CountUp({
  to,
  from = 0,
  direction = "up",
  delay = 0,
  duration = 1.8,
  className = "",
  startWhen = true,
  separator = "",
  onStart,
  onEnd,
}: {
  to: number;
  from?: number;
  direction?: "up" | "down";
  delay?: number;
  duration?: number;
  className?: string;
  startWhen?: boolean;
  separator?: string;
  onStart?: () => void;
  onEnd?: () => void;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === "down" ? to : from);
  const springValue = useSpring(motionValue, { duration, bounce: 0 });
  const isInView = useInView(ref, { once: true, margin: "0px" });

  useEffect(() => {
    if (isInView && startWhen) {
      if (typeof onStart === "function") onStart();
      const timeoutId = setTimeout(() => {
        motionValue.set(direction === "down" ? from : to);
      }, delay * 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [isInView, startWhen, delay, direction, from, to, motionValue, onStart]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        const formatted = separator
          ? Number(latest.toFixed(0)).toLocaleString("en-US")
          : Math.floor(latest).toString();
        ref.current.textContent = separator
          ? formatted
          : formatted.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
      }
      if (typeof onEnd === "function" && latest === to) onEnd();
    });
    return unsubscribe;
  }, [springValue, to, onEnd, separator]);

  return <span ref={ref} className={className} />;
}
