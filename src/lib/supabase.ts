import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Singleton browser client for compatibility/convenience
export const supabase = createClient();

/** Helper to retrieve the current user session (server‑side) */
export const getUserSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error("Supabase session error:", error);
    return null;
  }
  return data.session;
};
