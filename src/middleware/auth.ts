/**
 * Authentication Middleware Helper
 * Verifies JWT token from Authorization header or cookie
 */

import { createClient } from '@supabase/supabase-js';
import { env } from '@/config/env';

export interface AuthUser {
  id: string;
  email?: string;
  role?: string;
}

export async function authenticateRequest(request: Request): Promise<{ user: AuthUser | null; errorResponse?: Response }> {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return {
      user: null,
      errorResponse: new Response(
        JSON.stringify({ error: 'Unauthorized: Missing authorization token' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      ),
    };
  }

  // Dummy fallback mode
  if (env.SUPABASE_URL === 'https://dummy.supabase.co' || token === 'dummy-token') {
    return { user: { id: 'dummy-user-id', email: 'test@yamplelabs.com' } };
  }

  try {
    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return {
        user: null,
        errorResponse: new Response(
          JSON.stringify({ error: 'Unauthorized: Invalid or expired token' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        ),
      };
    }

    return { user: { id: data.user.id, email: data.user.email } };
  } catch (err: any) {
    return {
      user: null,
      errorResponse: new Response(
        JSON.stringify({ error: `Authentication error: ${err.message}` }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      ),
    };
  }
}
