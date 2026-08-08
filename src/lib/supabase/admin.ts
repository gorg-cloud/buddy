import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/**
 * Service-role client — bypasses Row Level Security.
 * SERVER ONLY. Never import this from a client component, and never expose
 * SUPABASE_SERVICE_ROLE_KEY to the browser.
 *
 * Used by the matching logic, which needs to read all buddy profiles to
 * find the best match for a mover.
 */
export function createSupabaseAdmin(): SupabaseClient {
  if (client) return client;
  client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  return client;
}

export function hasServiceRoleKey() {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
}
