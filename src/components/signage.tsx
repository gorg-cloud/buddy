import { cn } from "@/lib/utils";

/**
 * Overhead terminal signage — the black band that tells you where you are
 * as you walk through a terminal. Used as interior section headers.
 */
export function Signage({
  tag,
  children,
  className,
}: {
  tag?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("signage px-4 py-6 sm:px-6 sm:py-8", className)}>
      <div className="mx-auto w-full max-w-6xl">
        {tag && (
          <p className="board text-[11px] tracking-[0.3em] text-amber">
            {tag}
          </p>
        )}
        <h2 className="mt-1.5 font-display text-3xl uppercase leading-none tracking-tight text-paper sm:text-4xl md:text-5xl">
          {children}
        </h2>
      </div>
    </div>
  );
}

/**
 * The top of a page — like the entrance to a gate: a mono tag, a giant
 * Anton headline, and a line of context on the terminal floor.
 */
export function PageHeader({
  tag,
  title,
  lede,
  children,
}: {
  tag?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b-2 border-ink/80">
      <div className="terminal-grid absolute inset-0" aria-hidden />
      <div className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        {tag && (
          <p className="board text-xs tracking-[0.22em] text-amber-deep">{tag}</p>
        )}
        <h1 className="mt-3 max-w-3xl font-display text-4xl uppercase leading-[1.02] tracking-tight text-ink sm:text-5xl md:text-6xl">
          {title}
        </h1>
        {lede && (
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink/70">
            {lede}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
