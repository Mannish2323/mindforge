// src/lib/supabase.ts
// Browser-only Supabase client — safe to import in 'use client' components
import { createBrowserClient } from '@supabase/ssr';

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
