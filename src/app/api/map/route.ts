import { NextResponse } from "next/server";

import { isSupabaseConfigured } from "@/lib/auth";
import { countryByName } from "@/lib/countries";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import type { MapPerson } from "@/lib/types";

/**
 * The public map: anchors + movers, plotted at their country's real
 * coordinates. Returns ONLY names, places, and coordinates — no answers,
 * no school, no contact info. The full profile stays private behind RLS.
 * The service-role client is used because profiles are RLS-private; we
 * deliberately select a whitelist of columns.
 */
export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ real: false, anchors: [], peers: [] });
  }

  const admin = createSupabaseAdmin();

  // Anchors (lived there, answer questions) and peers (moving there).
  const [anchorsRes, peersRes] = await Promise.all([
    admin
      .from("profiles")
      .select("id, name, country, anchors!inner(city, years_lived)")
      .limit(200),
    admin
      .from("profiles")
      .select("id, handle, name, country, to_place")
      .eq("role", "mover")
      .limit(200),
  ]);

  const anchors: MapPerson[] = (anchorsRes.data ?? [])
    .map((row): MapPerson | null => {
      const country = countryByName(String(row.country ?? ""));
      if (!country) return null;
      const anchorRow = Array.isArray(row.anchors)
        ? (row.anchors[0] as
            | { city?: string | null; years_lived?: number | null }
            | undefined)
        : undefined;
      const years = Number(anchorRow?.years_lived ?? 1);
      return {
        id: String(row.id),
        name: String(row.name ?? "Anchor"),
        kind: "anchor",
        country: country.name,
        city: anchorRow?.city ?? undefined,
        lat: country.lat,
        lng: country.lng,
        code: country.code,
        detail: `anchor — lived here ${years} ${years === 1 ? "year" : "years"}`,
      };
    })
    .filter((p): p is MapPerson => p !== null);

  const peers: MapPerson[] = (peersRes.data ?? [])
    .map((row): MapPerson | null => {
      const country = countryByName(String(row.country ?? ""));
      if (!country) return null;
      return {
        id: String(row.id),
        name: String(row.name ?? row.handle ?? "Mover"),
        kind: "peer",
        country: country.name,
        city: row.to_place ? String(row.to_place) : undefined,
        lat: country.lat,
        lng: country.lng,
        code: country.code,
        detail: "moving there",
      };
    })
    .filter((p): p is MapPerson => p !== null);

  return NextResponse.json({ real: true, anchors, peers });
}
