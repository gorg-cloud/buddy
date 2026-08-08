import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

/**
 * React Bits `ShinyText` — a slow shine sweeping across the text,
 * like light passing over a printed ticket. Pure CSS, no deps.
 * The animation lives in a class so `prefers-reduced-motion` can kill it.
 */
export function ShinyText({
  text,
  disabled = false,
  speed = 6,
  className = "",
}: {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "shiny-text bg-clip-text text-transparent",
        "bg-[linear-gradient(110deg,currentColor_45%,rgba(156,90,0,0.55)_50%,currentColor_55%)] bg-[length:200%_100%]",
        disabled && "bg-none",
        className
      )}
      style={{ "--shiny-speed": `${speed}s` } as CSSProperties}
    >
      {text}
    </span>
  );
}
