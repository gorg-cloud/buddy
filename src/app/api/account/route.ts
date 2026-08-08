import { NextResponse } from "next/server";

import { isSupabaseConfigured } from "@/lib/auth";
import {
  createSupabaseAdmin,
  hasServiceRoleKey,
} from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Erase account — the whole profile, match, messages, arrival row and
 * community posts cascade away with the auth user (schema FK cascades).
 * Hard delete on purpose: a kid's right to be forgotten wins here.
 */
export async function DELETE() {
  if (!isSupabaseConfigured() || !hasServiceRoleKey()) {
    return NextResponse.json(
      { error: "Database isn't connected yet" },
      { status: 503 }
    );
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const admin = createSupabaseAdmin();
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  await supabase.auth.signOut();
  return NextResponse.json({ ok: true });
}
