import { NextResponse } from "next/server";

import { isSupabaseConfigured } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Who am I? Powers the auth-aware header. GET returns the real session
 * from Supabase cookies; POST signs out server-side.
 */
export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ signedIn: false, name: null });
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ signedIn: false, name: null });
  }

  return NextResponse.json({
    signedIn: true,
    name: String(user.user_metadata?.name ?? user.email ?? "You"),
    email: user.email ?? null,
  });
}

export async function POST() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  return NextResponse.json({ signedIn: false });
}
