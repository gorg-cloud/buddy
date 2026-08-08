"use client";

import { useEffect, useState } from "react";

import { isSupabaseConfigured } from "@/lib/auth";
import {
  currentUser as demoUser,
  missions as demoMissions,
  profiles,
  type BuddyProfile,
  type Mission,
} from "@/lib/demo-data";

interface MatchState {
  loading: boolean;
  real: boolean;
  me: BuddyProfile | null;
  buddy: BuddyProfile | null;
  missions: Mission[];
}

const demoBuddy = profiles.find(
  (p) => p.role === "buddy" && p.to === demoUser.to
) ?? null;

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
    emoji: String(row.emoji ?? "🧭"),
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

export function useMatch(): MatchState {
  const [state, setState] = useState<MatchState>({
    loading: true,
    real: false,
    me: demoUser,
    buddy: demoBuddy,
    missions: demoMissions,
  });

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setState({
        loading: false,
        real: false,
        me: demoUser,
        buddy: demoBuddy,
        missions: demoMissions,
      });
      return;
    }

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
