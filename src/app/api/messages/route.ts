import { NextResponse } from "next/server";

import { isSupabaseConfigured } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Matched chat — only between the two people in an active match.
 * RLS gates every row; the server client acts as the signed-in user.
 */
export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ real: false, signedIn: false, messages: [] });
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ real: true, signedIn: false, messages: [] });
  }

  const { data: me } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();
  if (!me) {
    return NextResponse.json({
      real: true,
      signedIn: true,
      needsProfile: true,
      meId: user.id,
    });
  }

  const { data: match } = await supabase
    .from("matches")
    .select("id, mover, buddy")
    .or(`mover.eq.${user.id},buddy.eq.${user.id}`)
    .eq("status", "active")
    .maybeSingle();

  if (!match) {
    return NextResponse.json({
      real: true,
      signedIn: true,
      matched: false,
      meId: user.id,
    });
  }

  const buddyId = match.mover === user.id ? match.buddy : match.mover;
  const [buddyRes, messagesRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, name, handle, school, to_place, from_place")
      .eq("id", buddyId)
      .maybeSingle(),
    supabase
      .from("messages")
      .select("id, sender, body, created_at")
      .eq("match_id", match.id)
      .order("created_at", { ascending: true })
      .limit(200),
  ]);

  return NextResponse.json({
    real: true,
    signedIn: true,
    matched: true,
    matchId: match.id,
    meId: user.id,
    buddy: buddyRes.data ?? null,
    messages: messagesRes.data ?? [],
  });
}

export async function POST(req: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Database not connected" }, { status: 503 });
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { body } = (await req.json().catch(() => ({}))) as { body?: unknown };
  if (typeof body !== "string" || body.trim().length === 0) {
    return NextResponse.json({ error: "Message can't be empty" }, { status: 400 });
  }
  const clean = body.trim().slice(0, 500);

  const { data: me } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();
  if (!me) {
    return NextResponse.json(
      { error: "Finish onboarding before chatting" },
      { status: 400 }
    );
  }

  const { data: match } = await supabase
    .from("matches")
    .select("id")
    .or(`mover.eq.${user.id},buddy.eq.${user.id}`)
    .eq("status", "active")
    .maybeSingle();
  if (!match) {
    return NextResponse.json(
      { error: "You're not matched yet — check back soon" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("messages")
    .insert({ match_id: match.id, sender: user.id, body: clean })
    .select("id, sender, body, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ message: data });
}
