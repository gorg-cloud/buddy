import { createSupabaseAdmin, hasServiceRoleKey } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * The Chain's matching rules:
 * 1. You must have a profile (complete onboarding first).
 * 2. Existing active matches are returned, never duplicated.
 * 3. Candidates: profiles with role 'buddy' in your destination country,
 *    excluding yourself.
 * 4. Same school first — a buddy at your exact new school wins. Then the
 *    closest age. Country is the boundary, school is the preference.
 * 5. On a new match, starter missions are created automatically.
 */

export interface MatchResult {
  real: boolean;
  me: Record<string, unknown> | null;
  buddy: Record<string, unknown> | null;
  missions: Record<string, unknown>[];
}

export async function findOrCreateMatch(userId: string): Promise<MatchResult> {
  const supabase = await createSupabaseServerClient();

  // 1. My profile (RLS: users see their own profile)
  const { data: me } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (!me) return { real: true, me: null, buddy: null, missions: [] };

  // 2. Existing active match?
  const { data: existing } = await supabase
    .from("matches")
    .select("id, buddy")
    .or(`mover.eq.${userId},buddy.eq.${userId}`)
    .eq("status", "active")
    .maybeSingle();

  if (existing?.buddy) {
    const { data: buddy } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", existing.buddy)
      .maybeSingle();
    const { data: missions } = await supabase
      .from("missions")
      .select("*")
      .eq("match_id", existing.id)
      .order("created_at");
    // The board: this mover's flight is now FOUND.
    if (hasServiceRoleKey()) {
      await createSupabaseAdmin()
        .from("arrivals")
        .update({ status: "found" })
        .eq("profile_id", userId);
    }
    return { real: true, me, buddy, missions: missions ?? [] };
  }

  // 3. Matching needs the service-role key (server-only)
  if (!hasServiceRoleKey()) {
    return { real: true, me, buddy: null, missions: [] };
  }
  const admin = createSupabaseAdmin();

  // 4. Buddies in my destination country. Same school wins; ties break
  //    by closest age.
  const { data: candidates } = await admin
    .from("profiles")
    .select("*")
    .eq("role", "buddy")
    .eq("country", me.country)
    .neq("id", userId)
    .limit(50);

  if (!candidates || candidates.length === 0) {
    return { real: true, me, buddy: null, missions: [] };
  }

  const mySchool = String(me.school ?? "").trim().toLowerCase();
  const score = (b: Record<string, unknown>) => {
    const sameSchool =
      mySchool !== "" &&
      String(b.school ?? "").trim().toLowerCase() === mySchool
        ? 0
        : 1;
    const ageDiff = Math.abs(Number(b.age ?? 99) - Number(me.age ?? 99));
    return sameSchool * 1_000_000 + ageDiff;
  };
  const buddy = [...candidates].sort((a, b) => score(a) - score(b))[0];

  // 5. Create the match + starter missions
  const { data: match } = await admin
    .from("matches")
    .insert({ mover: userId, buddy: buddy.id, status: "active" })
    .select()
    .single();

  if (match) {
    // The board: this mover's flight is now FOUND.
    await admin
      .from("arrivals")
      .update({ status: "found" })
      .eq("profile_id", userId);

    const starters = [
      {
        title: "Send a first hello",
        description:
          "Message your buddy: one thing you're scared of and one thing you're excited about. They'll reply with theirs.",
        kind: "intro",
      },
      {
        title: "Language swap",
        description:
          "Teach each other 3 words from your languages. Write them down so you don't forget.",
        kind: "intro",
      },
      {
        title: "See the school",
        description:
          "Ask your buddy to describe the school on a video call — cafeteria, hallways, the places people hang out.",
        kind: "intro",
      },
      {
        title: "Plan day one",
        description:
          "Pick one thing you'll do together your first week — lunch spot, club, or just where to sit.",
        kind: "landing",
      },
    ];
    await admin
      .from("missions")
      .insert(starters.map((m) => ({ ...m, match_id: match.id })));
  }

  const { data: missions } = await admin
    .from("missions")
    .select("*")
    .eq("match_id", match?.id ?? "");

  return { real: true, me, buddy, missions: missions ?? [] };
}
