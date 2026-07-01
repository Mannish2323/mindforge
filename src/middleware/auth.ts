// src/middleware/auth.ts
/**
 * Server‑side authentication helper.
 * Extracts the Supabase user from the request cookie and returns the session.
 */
import { supabase } from "../lib/supabase";
import { NextApiRequest } from "next";

export async function getServerUser(req: NextApiRequest) {
  // Supabase expects the access token in the `cookie` header under `sb-access-token`
  const token = req.cookies["sb-access-token"] || req.headers["authorization"]?.replace("Bearer ", "");
  if (!token) return null;

  const { data, error } = await supabase.auth.getUser(token);
  if (error) {
    console.warn("Supabase auth error:", error.message);
    return null;
  }
  return data?.user ?? null;
}
