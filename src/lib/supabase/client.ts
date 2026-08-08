import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { isSupabaseConfigured } from "@/lib/auth";

let client: SupabaseClient | null = null;

/**
 * Returns the Supabase client, or null in demo mode
 * (when NEXT_PUBLIC_SUPABASE_URL / ANON_KEY are not set).
 */
export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (client) return client;

  client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  return client;
}
