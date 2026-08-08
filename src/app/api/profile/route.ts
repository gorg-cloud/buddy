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
  const { name, age, from, to, school, country, moveDate, answers, role } =
    body;

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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Server-side extras (service role): arrivals for the public board and
  // anchor rows for the map. Never exposed to the browser.
  const admin = createSupabaseAdmin();

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
