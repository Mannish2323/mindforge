/**
 * Learn with Velmorth — Centralized Environment Config
 */

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co',
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  GEMINI_KEYS: [
    process.env.GEMINI_API_KEY_1,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
    process.env.GEMINI_API_KEY_4,
  ].filter(Boolean) as string[],
  RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || '',
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://learn-with-velmorth.vercel.app',
};

export function validateEnv() {
  if (!env.SUPABASE_URL || env.SUPABASE_URL.includes('dummy')) {
    console.warn('[Config] Running with fallback Supabase environment URL.');
  }
}
