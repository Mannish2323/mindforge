// src/constants/index.ts

/** Application‑wide constants */
export const API_BASE_URL = "/api";
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** Example enum for user roles */
export enum UserRole {
  Guest = "guest",
  Member = "member",
  Premium = "premium",
  Admin = "admin",
}
