// src/lib/supabase.ts
import { createBrowserClient, createServerSupabaseClient } from '@supabase/ssr';

/**
 * Browser client – used in React components and client‑side code.
 */
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * Server‑side client – used in API routes, getServerSideProps, etc.
 * Pass the incoming request to obtain the session from cookies.
 */
export const createSupabaseServerClient = (request: Request) =>
  createServerSupabaseClient({
    request,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  });

/**
 * Helper to retrieve the current user session on the server.
 */
export const getSession = async (request: Request) => {
  const supabaseServer = createSupabaseServerClient(request);
  const { data, error } = await supabaseServer.auth.getSession();
  if (error) {
    console.error('Supabase session error:', error);
    return null;
  }
  return data.session;
};
