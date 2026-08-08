import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowRight, Handshake } from "lucide-react";

import type { BuddyProfile } from "@/lib/demo-data";

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
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-full bg-secondary text-2xl">
              {profile.emoji}
            </span>
            <div>
              <p className="font-display text-lg font-semibold">
                {profile.name},{" "}
                <span className="text-muted-foreground">{profile.age}</span>
              </p>
              <p className="board flex items-center gap-1 text-[11px] text-muted-foreground">
                {profile.from}
                <ArrowRight className="size-3" />
                {profile.to}
              </p>
            </div>
          </div>
          <Badge variant={profile.role === "buddy" ? "success" : "sky"}>
            {profile.role === "buddy" ? "buddy" : "moving"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {shown.map(([question, answer]) => (
          <div
            key={question}
            className="rounded-lg border border-border/70 bg-muted/40 p-3"
          >
            <p className="board text-[10px] text-primary">{question}</p>
            <p className="mt-1 text-sm leading-relaxed text-foreground/90">
              {answer}
            </p>
          </div>
        ))}
        <div className="flex items-center justify-between pt-1">
          <span className="board text-[10px] text-muted-foreground">
            {profile.school}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-success">
            <Handshake className="size-3.5" />
            carried {profile.carried}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
