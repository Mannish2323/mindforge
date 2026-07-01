// src/lib/realtime.ts

import { supabase } from "./supabase";

/** Simple wrapper for Supabase realtime subscriptions */
export const subscribeToChanges = (
  table: string,
  callback: (payload: any) => void
) => {
  const channel = supabase.channel(`public:${table}`);
  channel
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table },
      (payload: any) => callback(payload)
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
