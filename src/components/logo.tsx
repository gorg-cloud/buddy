import Link from "next/link";

import { cn } from "@/lib/utils";

export function Logo({
  className,
  on = "concrete",
}: {
  className?: string;
  /** "concrete" for light surfaces, "ink" for the black footer band */
  on?: "concrete" | "ink";
}) {
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center gap-2.5",
        className
      )}
    >
      <span
        className={cn(
          "relative flex size-9 shrink-0 items-center justify-center border-2 bg-ink transition-transform group-hover:-rotate-3",
          on === "ink" ? "border-paper/50" : "border-ink"
        )}
        aria-hidden
      >
        {/* punched hole */}
        <span
          className={cn(
            "absolute top-1 left-1 size-2 rounded-full",
            on === "ink" ? "bg-ink" : "bg-concrete"
          )}
        />
        <span className="board text-sm font-bold text-amber">B</span>
        {/* barcode sliver */}
        <span className="absolute inset-x-1 bottom-1 h-[3px] bg-amber [mask-image:repeating-linear-gradient(90deg,black_0_2px,transparent_2px_4px)]" />
      </span>
      <span
        className={cn(
          "font-display text-2xl uppercase tracking-tight",
          on === "ink" ? "text-paper" : "text-ink"
        )}
      >
        Buddy<span className="text-amber">.</span>
      </span>
    </Link>
  );
}
