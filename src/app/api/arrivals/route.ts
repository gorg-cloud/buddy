import { NextResponse } from "next/server";

import { isSupabaseConfigured } from "@/lib/auth";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import type { Arrival } from "@/lib/types";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ real: false, arrivals: [] });
  }

  const admin = createSupabaseAdmin();
  const { data } = await admin
    .from("arrivals")
    .select("id, flight, from_city, to_city, status")
    .order("created_at", { ascending: false })
    .limit(6);

  const arrivals: Arrival[] = (data ?? []).map((r) => ({
    id: String(r.id),
    flight: String(r.flight),
    from: String(r.from_city ?? "—"),
    to: String(r.to_city ?? "—"),
    status: (r.status as Arrival["status"]) ?? "waiting",
  }));

  return NextResponse.json({ real: true, arrivals });
}
