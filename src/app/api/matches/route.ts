import { NextResponse } from "next/server";

import { isSupabaseConfigured } from "@/lib/auth";
import { findOrCreateMatch } from "@/lib/matching";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
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

  const result = await findOrCreateMatch(user.id);
  return NextResponse.json(result);
}
