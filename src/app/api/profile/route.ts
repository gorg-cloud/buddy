import { NextResponse } from "next/server";

import { isSupabaseConfigured } from "@/lib/auth";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ real: false });
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "not signed in" }, { status: 401 });
  }

  const body = await request.json();
  const {
    name,
    age,
    from,
    to,
    school,
    country,
    moveDate,
    answers,
    role,
    restart,
  } = body;

  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    name,
    age: Number(age),
    from_place: from,
    to_place: to,
    school,
    country,
    move_date: moveDate || null,
    answers: answers ?? {},
    role: role ?? "mover",
  });

  if (error) {
    const friendly = /could not find the table|does not exist|schema cache/i.test(
      error.message
    )
      ? "The database isn't set up yet — run supabase/schema.sql in the Supabase SQL editor, then try again."
      : error.message;
    return NextResponse.json({ error: friendly }, { status: 500 });
  }

  // Server-side extras (service role): arrivals for the public board and
  // anchor rows for the map. Never exposed to the browser.
  const admin = createSupabaseAdmin();

  if (restart) {
    // They're moving again, no matter what they were before. Close the old
    // chapter cleanly: graduate any active match and drop the anchor row.
    // The chain (kids carried) stays on the profile.
    await admin
      .from("matches")
      .update({ status: "graduated" })
      .or(`mover.eq.${user.id},buddy.eq.${user.id}`)
      .eq("status", "active");
    await admin.from("anchors").delete().eq("id", user.id);
  }

  if (role === "mover") {
    // A mover's flight appears on the arrival board as WAITING, and flips
    // to FOUND the moment the matching engine pairs them with a buddy.
    const flight = `MOVE-${Math.floor(1000 + Math.random() * 9000)}`;
    await admin.from("arrivals").upsert(
      {
        profile_id: user.id,
        flight,
        from_city: from,
        to_city: to,
        status: "waiting",
      },
      { onConflict: "profile_id" }
    );
  } else if (role === "anchor") {
    await admin.from("anchors").upsert({
      id: user.id,
      city: to,
      years_lived: 1,
      expertise: [],
      answers: answers ?? {},
    });
  }

  return NextResponse.json({ ok: true });
}
