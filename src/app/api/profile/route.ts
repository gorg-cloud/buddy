import { NextResponse } from "next/server";

import { isSupabaseConfigured } from "@/lib/auth";
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
    move_date: moveDate,
    answers: answers ?? {},
    role: role ?? "mover",
    emoji: "🧭",
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
