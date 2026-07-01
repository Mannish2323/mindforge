// src/lib/storage.ts

import { supabase } from "./supabase";

/** Simple wrappers around Supabase storage buckets */
export const uploadFile = async (
  bucket: string,
  path: string,
  file: File,
  options?: { upsert?: boolean }
) => {
  const { data, error } = await supabase.storage.from(bucket).upload(path, file, options);
  if (error) throw new Error(error.message);
  return data;
};

export const downloadFile = async (bucket: string, path: string) => {
  const { data, error } = await supabase.storage.from(bucket).download(path);
  if (error) throw new Error(error.message);
  return data;
};

export const deleteFile = async (bucket: string, path: string) => {
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw new Error(error.message);
};
