// src/lib/supabaseClient.ts

import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/** Browser‑side client */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/** Server‑side client (for API routes) */
export const supabaseServer = createClient(supabaseUrl, process.env.NEXT_PRIVATE_SUPABASE_SERVICE_ROLE_KEY!);

// You can extend this file with helper functions for RLS, storage, etc.
