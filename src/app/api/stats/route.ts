import { NextResponse } from "next/server";

import { isSupabaseConfigured } from "@/lib/auth";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ real: false });
  }

  const admin = createSupabaseAdmin();
  const [arrivalsRes, carriedRes, waitingRes] = await Promise.all([
    admin.from("arrivals").select("id", { count: "exact", head: true }),
    admin.from("profiles").select("carried"),
    admin
      .from("arrivals")
      .select("id", { count: "exact", head: true })
      .eq("status", "waiting"),
  ]);

  // Tables don't exist yet? Then the board isn't live — report honestly.
  if (arrivalsRes.error || carriedRes.error || waitingRes.error) {
    return NextResponse.json({ real: false });
  }

  const carried = (carriedRes.data ?? []).reduce(
    (sum, row) => sum + Number(row.carried ?? 0),
    0
  );

  return NextResponse.json({
    real: true,
    arrivals: arrivalsRes.count ?? 0,
    carried,
    waiting: waitingRes.count ?? 0,
  });
}
