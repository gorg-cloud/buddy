import Link from "next/link";
import { Plane } from "lucide-react";

import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center gap-2.5 font-display text-xl font-bold tracking-tight",
        className
      )}
    >
      <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground transition-transform group-hover:-rotate-12">
        <Plane className="size-4.5" />
      </span>
      <span className="text-foreground">
        Buddy<span className="text-primary">.</span>
      </span>
    </Link>
  );
}
