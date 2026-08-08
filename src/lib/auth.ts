/**
 * Supabase connection helpers.
 *
 * Buddy has no demo mode. Without keys in `.env.local` the app shows honest
 * empty states and guides you to connect; the moment the keys are present,
 * signup/login/onboarding talk to the real database.
 */

export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/** Name cache for the dashboard greeting — never an auth mechanism. */
export const SESSION_KEY = "buddy:session";

/** Role picked at signup, stored with the profile row. */
export const ROLE_KEY = "buddy:role";

/** Set when someone starts a new move from the dashboard. */
export const RESTART_KEY = "buddy:restart";

export type Session = {
  name: string;
  email: string;
  role: "mover" | "anchor" | "buddy";
  onboarded: boolean;
};
