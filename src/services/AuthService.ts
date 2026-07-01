import { supabase } from '../lib/supabaseClient';
import { User } from '@supabase/supabase-js';

export class AuthService {
  /**
   * Triggers Google Sign-In via Supabase OAuth
   */
  static async signInWithGoogle(): Promise<void> {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth` : undefined,
      },
    });
    if (error) {
      console.error('[AuthService] Sign-in error:', error.message);
      throw error;
    }
  }

  /**
   * Signs out the user and clears sessions
   */
  static async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('[AuthService] Sign-out error:', error.message);
      throw error;
    }
  }

  /**
   * Helper to fetch profile details
   */
  static async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('[AuthService] Error fetching profile:', error.message);
    }
    return data || null;
  }

  /**
   * Ensures that a new user gets their profiles and dependent tables initialized.
   */
  static async ensureUserProfile(user: User): Promise<any> {
    if (!user) return null;

    const profile = await this.getProfile(user.id);
    if (profile) {
      return profile;
    }

    // Initialize new user onboarding data
    const email = user.email || '';
    const rawUsername = email.split('@')[0] || 'learner';
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const username = `${rawUsername}_${randomSuffix}`;
    const displayName = user.user_metadata?.full_name || user.user_metadata?.name || rawUsername;
    const avatarUrl = user.user_metadata?.avatar_url || '';

    console.log(`[AuthService] Initializing profile for user: ${user.id} (${email})`);

    // 1. Create Profile
    const { data: newProfile, error: profileErr } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        username,
        display_name: displayName,
        avatar_url: avatarUrl,
        bio: 'Learning Japanese with Velmorth!',
      })
      .select()
      .single();

    if (profileErr) {
      console.error('[AuthService] Profile creation failed:', profileErr.message);
      throw profileErr;
    }

    // 2. Create User Settings
    const { error: settingsErr } = await supabase
      .from('user_settings')
      .insert({
        user_id: user.id,
        theme: 'dark',
        ui_language: 'en',
        tts_enabled: true,
        goal_minutes: 10,
        notifications: true,
        jlpt_target: 'N5',
        heart_system_enabled: true,
      });

    if (settingsErr) {
      console.warn('[AuthService] User Settings creation failed:', settingsErr.message);
    }

    // 3. Create User Stats
    const { error: statsErr } = await supabase
      .from('user_stats')
      .insert({
        user_id: user.id,
        xp_total: 0,
        xp_today: 0,
        gems_balance: 100, // Welcome gift!
        lessons_done: 0,
        words_learned: 0,
        reviews_done: 0,
        kanji_learned: 0,
        speak_sessions: 0,
        hearts_total: 25,
        hearts_used_today: 0,
        hearts_max: 25,
      });

    if (statsErr) {
      console.warn('[AuthService] User Stats creation failed:', statsErr.message);
    }

    // 4. Create Streaks record
    const { error: streakErr } = await supabase
      .from('user_streaks')
      .insert({
        user_id: user.id,
        streak: 0,
        longest: 0,
        freeze_count: 0,
      });

    if (streakErr) {
      console.warn('[AuthService] Streaks initialization failed:', streakErr.message);
    }

    // 5. Create user preferences record
    const { error: prefsErr } = await supabase
      .from('user_preferences')
      .insert({
        user_id: user.id,
        preferred_categories: ['general'],
        daily_goal_xp: 25,
      });

    if (prefsErr) {
      console.warn('[AuthService] Preferences initialization failed:', prefsErr.message);
    }

    return newProfile;
  }
}
