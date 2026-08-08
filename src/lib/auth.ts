/**
 * Auth + demo-mode helpers.
 *
 * Until Supabase keys are added to `.env.local`, Buddy runs in demo mode:
 * sign-up/login store a lightweight session in localStorage and every page
 * renders with sample data. Once keys are present, the real Supabase client
 * takes over.
 */

export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export const SESSION_KEY = "buddy:session";

export type Session = {
  name: string;
  email: string;
  role: "mover" | "anchor" | "buddy";
  onboarded: boolean;
};
