// src/lib/edgeFunctions.ts

import { supabase } from "./supabase";

/** Wrapper to call Supabase Edge Functions */
export const callEdgeFunction = async (functionName: string, payload: any) => {
  const { data, error } = await supabase.functions.invoke(functionName, {
    body: payload,
    method: "POST",
  });
  if (error) throw new Error(error.message);
  return data;
};
