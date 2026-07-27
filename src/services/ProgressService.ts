/**
 * Progress Service — Tracks user progress, streaks, XP, achievements & leaderboards
 */

import { createClient } from '@supabase/supabase-js';
import { env } from '@/config/env';

export class ProgressService {
  private static getClient() {
    return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY);
  }

  static async getUserProgress(userId: string) {
    if (env.SUPABASE_URL === 'https://dummy.supabase.co') {
      return { streak: 5, totalXp: 450, level: 'N5' };
    }

    const supabase = this.getClient();
    const { data: prefs } = await supabase.from('user_preferences').select('streak_count, total_xp').eq('user_id', userId).maybeSingle();

    return {
      streak: prefs?.streak_count || 1,
      totalXp: prefs?.total_xp || 0,
    };
  }

  static async updateStreak(userId: string) {
    if (env.SUPABASE_URL === 'https://dummy.supabase.co') return { streak: 6 };

    const supabase = this.getClient();
    const { data } = await supabase.rpc('increment_streak', { p_user_id: userId });
    return data;
  }

  static async addXp(userId: string, amount: number) {
    if (env.SUPABASE_URL === 'https://dummy.supabase.co') return { added: amount };

    const supabase = this.getClient();
    const { data } = await supabase.rpc('add_user_xp', { p_user_id: userId, p_amount: amount });
    return data;
  }
}
