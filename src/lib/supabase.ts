// src/lib/supabase.ts
import { createBrowserClient, createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Browser client generator
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * Browser client singleton – used in React components and client‑side code.
 */
export const supabase = createClient();

/**
 * Server‑side client – used in API routes, Server Components, etc.
 */
export const createSupabaseServerClient = () => {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Can be ignored if handled by middleware
          }
        },
      },
    }
  );
};

/**
 * Helper to retrieve the current user session on the server.
 */
export const getSession = async () => {
  const supabaseServer = createSupabaseServerClient();
  const { data, error } = await supabaseServer.auth.getSession();
  if (error) {
    console.error('Supabase session error:', error);
    return null;
  }
  return data.session;
};
