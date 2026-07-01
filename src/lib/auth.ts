// src/lib/auth.ts

import { supabase, supabaseServer } from "./supabaseClient";
import { Provider } from "@supabase/supabase-js";

/** Initiate Google sign‑in (client side) */
export const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({ provider: "google" as Provider });
  if (error) throw new Error(error.message);
};

/** Server‑side verification of the session */
export const getUserFromServer = async (accessToken: string) => {
  const { data, error } = await supabaseServer.auth.getUser(accessToken);
  if (error) throw new Error(error.message);
  return data.user;
};

/** Sign out (client side) */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
};
