import { cn } from "@/lib/utils";

/** Deterministic pseudo-random from a string — stable across renders. */
function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/**
 * A barcode made of varying-width bars, derived deterministically from a
 * seed string (usually a name). Purely decorative — the airport's way of
 * saying "this ticket belongs to someone specific."
 */
export function Barcode({
  seed,
  className,
}: {
  seed: string;
  className?: string;
}) {
  const h = hash(seed);
  const bars = Array.from({ length: 26 }, (_, i) => {
    const on = (h >> (i % 8)) & 1;
    const wide = (h >> ((i * 3 + 5) % 16)) & 1;
    return on ? (wide ? 3 : 1) : 2;
  });

  return (
    <div
      className={cn("flex items-stretch gap-[2px] overflow-hidden", className)}
      aria-hidden
    >
      {bars.map((w, i) => (
        <span key={i} className="h-full bg-ink" style={{ width: w }} />
      ))}
    </div>
  );
}
