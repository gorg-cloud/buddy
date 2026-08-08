import { NextResponse } from "next/server";

import { isSupabaseConfigured } from "@/lib/auth";
import {
  createSupabaseAdmin,
  hasServiceRoleKey,
} from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Signup, server-side. Creates the account with the email already
 * confirmed (no "check your inbox" wall — new kids land straight in
 * onboarding) and signs them in so the session cookie is set before
 * they leave the page.
 *
 * Note: this skips email verification on purpose for now. The service
 * key never touches the browser; only this route can create users.
 */
export async function POST(req: Request) {
  if (!isSupabaseConfigured() || !hasServiceRoleKey()) {
    return NextResponse.json(
      { error: "Database isn't connected yet" },
      { status: 503 }
    );
  }

  const { name, email, password } = (await req.json().catch(() => ({}))) as {
    name?: unknown;
    email?: unknown;
    password?: unknown;
  };

  if (typeof name !== "string" || name.trim().length < 1) {
    return NextResponse.json({ error: "Tell us your name" }, { status: 400 });
  }
  if (typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "That email doesn't look right" }, { status: 400 });
  }
  if (typeof password !== "string" || password.length < 8) {
    return NextResponse.json(
      { error: "Password needs at least 8 characters" },
      { status: 400 }
    );
  }

  const cleanName = name.trim().slice(0, 60);
  const cleanEmail = email.trim().toLowerCase();

  const admin = createSupabaseAdmin();
  const { error: createError } = await admin.auth.admin.createUser({
    email: cleanEmail,
    password,
    email_confirm: true,
    user_metadata: { name: cleanName },
  });
  if (createError) {
    return NextResponse.json({ error: createError.message }, { status: 400 });
  }

  // Set the session cookie so the new kid lands already signed in.
  const supabase = await createSupabaseServerClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: cleanEmail,
    password,
  });
  if (signInError) {
    // The account exists — just have them log in on the next page.
    return NextResponse.json({
      ok: true,
      note: "Account created — log in to continue",
    });
  }

  return NextResponse.json({ ok: true });
}
