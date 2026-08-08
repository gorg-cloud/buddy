import { createBrowserClient } from "@supabase/ssr";

import { isSupabaseConfigured } from "@/lib/auth";

let client: ReturnType<typeof createBrowserClient> | null = null;

/**
 * Browser Supabase client (cookie-backed so the server can read the
 * session). Returns null in demo mode — when the env keys aren't set.
 */
export function getSupabase() {
  if (!isSupabaseConfigured()) return null;
  if (client) return client;

  client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  return client;
}
