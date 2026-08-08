import { NextResponse } from "next/server";

import { isSupabaseConfigured } from "@/lib/auth";
import { countryByName } from "@/lib/countries";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * The departure lounge — a global room plus one per country.
 * Reading is open (the feed is public, like the arrivals board); posting
 * requires a signed-in profile so nobody can talk as someone else.
 */
function validRoom(room: string | null): string | null {
  if (room === "global") return "global";
  if (room && countryByName(room)) return room;
  return null;
}

export async function GET(req: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ real: false, messages: [] });
  }

  const room = validRoom(new URL(req.url).searchParams.get("room"));
  if (!room) {
    return NextResponse.json({ error: "Unknown room" }, { status: 400 });
  }

  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("community_messages")
    .select("id, room, sender, sender_name, body, created_at")
    .eq("room", room)
    .order("created_at", { ascending: true })
    .limit(200);

  // Optional — lets the client know which bubbles are theirs.
  let meId: string | null = null;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) meId = user.id;

  return NextResponse.json({
    real: true,
    room,
    meId,
    messages: data ?? [],
    error: error ? String(error.message) : null,
  });
}

export async function POST(req: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Database not connected" }, { status: 503 });
  }

  const { room, body } = (await req.json().catch(() => ({}))) as {
    room?: unknown;
    body?: unknown;
  };
  const cleanRoom = validRoom(typeof room === "string" ? room : null);
  if (!cleanRoom) {
    return NextResponse.json({ error: "Unknown room" }, { status: 400 });
  }
  if (typeof body !== "string" || body.trim().length === 0) {
    return NextResponse.json({ error: "Message can't be empty" }, { status: 400 });
  }
  const clean = body.trim().slice(0, 500);

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { error: "Log in to speak in the lounge" },
      { status: 401 }
    );
  }

  const { data: me } = await supabase
    .from("profiles")
    .select("name")
    .eq("id", user.id)
    .maybeSingle();
  if (!me) {
    return NextResponse.json(
      { error: "Finish onboarding before chatting" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("community_messages")
    .insert({
      room: cleanRoom,
      sender: user.id,
      sender_name: String(me.name ?? "You"),
      body: clean,
    })
    .select("id, room, sender, sender_name, body, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ message: data });
}
