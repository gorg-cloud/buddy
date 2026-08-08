import Link from "next/link";

import { TreeMark } from "@/components/tree-mark";
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
          "flex size-9 shrink-0 items-center justify-center rounded-[7px] bg-ink transition-transform group-hover:-rotate-3",
          on === "ink" ? "border-2 border-paper/50" : "border-2 border-ink"
        )}
      >
        <TreeMark className="size-6.5" />
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
