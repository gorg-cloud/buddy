import { cn } from "@/lib/utils";

/**
 * Buddy's tree — it grows roots wherever it lands.
 * Drawn as SVG so it stays crisp at every size.
 */
export function TreeMark({
  className,
  color = "#7CD153",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={cn("block", className)}
      role="img"
      aria-label="Buddy tree"
      fill={color}
    >
      {/* lobed canopy — overlapping shapes merge into one silhouette */}
      <ellipse cx="24" cy="15" rx="13" ry="12" />
      <ellipse cx="24" cy="6" rx="5.5" ry="6" />
      <ellipse cx="32" cy="8.5" rx="5.5" ry="5.5" />
      <ellipse cx="36" cy="16" rx="5.5" ry="6.5" />
      <ellipse cx="32" cy="23.5" rx="5.5" ry="5.5" />
      <ellipse cx="16" cy="23.5" rx="5.5" ry="5.5" />
      <ellipse cx="12" cy="16" rx="5.5" ry="6.5" />
      <ellipse cx="16" cy="8.5" rx="5.5" ry="5.5" />
      {/* trunk, widening into roots at the base */}
      <path d="M21 26 L21 38 C21 41 20 42 17.5 43.5 L17.5 45 L30.5 45 L30.5 43.5 C28 42 27 41 27 38 L27 26 C26 25 25 24.5 24 24.5 C23 24.5 22 25 21 26 Z" />
    </svg>
  );
}
