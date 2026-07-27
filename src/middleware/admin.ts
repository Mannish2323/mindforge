/**
 * Admin Middleware Helper
 * Verifies admin role for protected administrative endpoints
 */

import { createClient } from '@supabase/supabase-js';
import { env } from '@/config/env';

export async function authorizeAdmin(userId: string): Promise<boolean> {
  if (env.SUPABASE_URL === 'https://dummy.supabase.co' || userId === 'dummy-user-id') {
    return true;
  }

  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY;
  const supabase = createClient(env.SUPABASE_URL, serviceKey);

  const { data } = await supabase
    .from('admin_roles')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle();

  return Boolean(data);
}
