/**
 * User Service — Manages user preferences, profile stats & settings
 */

import { createClient } from '@supabase/supabase-js';
import { env } from '@/config/env';

export class UserService {
  private static getClient() {
    return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY);
  }

  static async getUserProfile(userId: string) {
    if (env.SUPABASE_URL === 'https://dummy.supabase.co') {
      return {
        id: userId,
        email: 'test@velmorth.com',
        preferred_categories: ['vocabulary', 'grammar'],
        daily_goal_xp: 50,
      };
    }

    const supabase = this.getClient();
    const { data: prefs } = await supabase.from('user_preferences').select('*').eq('user_id', userId).maybeSingle();
    const { data: ent } = await supabase.from('entitlements').select('*').eq('user_id', userId).maybeSingle();

    return {
      userId,
      preferences: prefs || { daily_goal_xp: 50 },
      entitlements: ent || { plan_id: 'free', status: 'active' },
    };
  }

  static async updateUserPreferences(userId: string, updates: Record<string, any>) {
    if (env.SUPABASE_URL === 'https://dummy.supabase.co') return { success: true };

    const supabase = this.getClient();
    const { data, error } = await supabase
      .from('user_preferences')
      .upsert({ user_id: userId, ...updates, updated_at: new Date().toISOString() })
      .select();

    if (error) throw error;
    return data;
  }
}
