"use client";

import { useEffect, useState } from "react";

import { isSupabaseConfigured } from "@/lib/auth";
import type { BuddyProfile, Mission } from "@/lib/types";

interface MatchState {
  loading: boolean;
  real: boolean;
  me: BuddyProfile | null;
  buddy: BuddyProfile | null;
  missions: Mission[];
}

const empty: MatchState = {
  loading: false,
  real: false,
  me: null,
  buddy: null,
  missions: [],
};

/** Normalize a database profile row into the shape the UI expects. */
function toBuddyProfile(row: Record<string, unknown>): BuddyProfile {
  return {
    id: String(row.id),
    handle: String(row.handle ?? row.name ?? "buddy"),
    name: String(row.name ?? "Buddy"),
    age: Number(row.age ?? 0),
    role: (row.role as BuddyProfile["role"]) ?? "mover",
    from: String(row.from_place ?? "—"),
    to: String(row.to_place ?? "—"),
    school: String(row.school ?? ""),
    country: String(row.country ?? ""),
    moveDate: row.move_date ? String(row.move_date) : undefined,
    answers: (row.answers as Record<string, string>) ?? {},
    carried: Number(row.carried ?? 0),
    languages: Array.isArray(row.languages) ? row.languages : [],
    avatarUrl: row.avatar_url ? String(row.avatar_url) : undefined,
  };
}

function toMission(row: Record<string, unknown>): Mission {
  return {
    id: String(row.id),
    title: String(row.title ?? ""),
    description: String(row.description ?? ""),
    done: Boolean(row.done),
    kind: (row.kind as Mission["kind"]) ?? "intro",
  };
}

/**
 * The match state, straight from the database. There is no demo mode:
 * without a Supabase connection you get an honest empty state, and the
 * moment the connection is live this returns real data.
 */
export function useMatch(): MatchState {
  const [state, setState] = useState<MatchState>(() =>
    isSupabaseConfigured()
      ? { loading: true, real: false, me: null, buddy: null, missions: [] }
      : empty
  );

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    let cancelled = false;
    fetch("/api/matches")
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data) => {
        if (cancelled) return;
        setState({
          loading: false,
          real: true,
          me: data.me ? toBuddyProfile(data.me) : null,
          buddy: data.buddy ? toBuddyProfile(data.buddy) : null,
          missions: Array.isArray(data.missions)
            ? data.missions.map(toMission)
            : [],
        });
      })
      .catch(() => {
        if (cancelled) return;
        setState({
          loading: false,
          real: true,
          me: null,
          buddy: null,
          missions: [],
        });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
