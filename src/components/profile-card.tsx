import { ArrowRight, Handshake } from "lucide-react";

import { Barcode } from "@/components/barcode";
import type { BuddyProfile } from "@/lib/types";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

export function ProfileCard({
  profile,
  compact = false,
}: {
  profile: BuddyProfile;
  compact?: boolean;
}) {
  const answers = Object.entries(profile.answers);
  const shown = compact ? answers.slice(0, 2) : answers;

  return (
    <div className="relative flex h-full flex-col border-2 border-ink/30 bg-paper shadow-[3px_3px_0_0_rgba(22,19,14,0.14)]">
      {/* perforated tear-off */}
      <div className="perf border-b border-dashed border-ink/30" aria-hidden />

      <div className="flex items-start justify-between gap-3 p-5">
        <div className="flex items-center gap-3">
          {profile.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatarUrl}
              alt={`${profile.name}'s photo`}
              className="size-11 shrink-0 border-2 border-ink object-cover"
            />
          ) : (
            <span className="board flex size-11 shrink-0 items-center justify-center bg-ink text-sm font-bold text-paper">
              {initials(profile.name)}
            </span>
          )}
          <div>
            <p className="font-display text-xl uppercase leading-none tracking-tight text-ink">
              {profile.name}{" "}
              <span className="text-ink/50">{profile.age}</span>
            </p>
            <p className="board mt-1.5 flex items-center gap-1.5 text-[11px] tracking-[0.18em] text-ink/60">
              {profile.from}
              <ArrowRight className="size-3 text-amber-deep" />
              {profile.to}
            </p>
          </div>
        </div>
        <span className="stamp shrink-0">
          {profile.role === "buddy"
            ? "buddy"
            : profile.role === "anchor"
              ? "anchor"
              : "moving →"}
        </span>
      </div>

      <div className="flex-1 space-y-3 px-5 pb-5">
        {shown.map(([question, answer]) => (
          <div key={question} className="border border-ink/20 bg-muted/50 p-3">
            <p className="board text-[10px] font-bold tracking-[0.18em] text-amber-deep">
              {question}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-ink/85">
              {answer}
            </p>
          </div>
        ))}
        <div className="flex items-center justify-between gap-3 pt-1">
          <span className="board truncate text-[10px] tracking-[0.15em] text-ink/50">
            {profile.school}
          </span>
          <span className="board inline-flex shrink-0 items-center gap-1 text-[10px] tracking-[0.15em] text-signal">
            <Handshake className="size-3.5" />
            carried {profile.carried}
          </span>
        </div>
      </div>

      {/* barcode strip */}
      <div className="flex items-center gap-3 border-t-2 border-ink bg-ink px-5 py-2">
        <Barcode seed={profile.handle} className="h-6 w-24 shrink-0" />
        <span className="board ml-auto truncate text-[9px] tracking-[0.25em] text-paper/60">
          PASSENGER · {profile.handle.toUpperCase()}
        </span>
      </div>
    </div>
  );
}
