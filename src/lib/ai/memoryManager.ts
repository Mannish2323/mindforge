/**
 * Sakura AI — Memory & User Context Manager
 */

import { UserContext, ConversationTurn } from './types';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function fetchUserContext(userId: string): Promise<UserContext> {
  const defaultContext: UserContext = {
    userId,
    jlptLevel: 'N5',
    preferredLanguage: 'en',
    weakTopics: [],
    weakGrammar: [],
    weakKanji: [],
    dailyXp: 50,
    streakDays: 1,
    planId: 'free',
  };

  if (!supabaseUrl || supabaseUrl === 'https://dummy.supabase.co') {
    return defaultContext;
  }

  try {
    const supabase = createClient(supabaseUrl, serviceKey);

    // Fetch user preferences & entitlements in parallel
    const [prefsRes, entRes, progressRes] = await Promise.all([
      supabase.from('user_preferences').select('*').eq('user_id', userId).maybeSingle(),
      supabase.from('entitlements').select('*').eq('user_id', userId).maybeSingle(),
      supabase.from('course_progress').select('*').eq('user_id', userId).limit(5),
    ]);

    const prefs = prefsRes.data;
    const ent = entRes.data;

    return {
      userId,
      jlptLevel: (prefs?.target_jlpt as any) || 'N5',
      preferredLanguage: prefs?.preferred_language === 'hi' ? 'hi' : 'en',
      dailyXp: prefs?.daily_goal_xp || 50,
      streakDays: prefs?.streak_count || 1,
      planId: ent?.plan_id || 'free',
      aiLimitDaily: ent?.ai_limit_daily || 5,
      aiChatsUsedToday: ent?.ai_chats_used_today || 0,
      weakTopics: prefs?.weak_topics || [],
      weakGrammar: prefs?.weak_grammar || [],
      weakKanji: prefs?.weak_kanji || [],
    };
  } catch (error) {
    console.error('[SakuraAI] Error fetching memory context:', error);
    return defaultContext;
  }
}

export function formatConversationMemory(history: ConversationTurn[], maxTurns = 6): { role: 'user' | 'model'; parts: { text: string }[] }[] {
  const recentTurns = history.slice(-maxTurns);
  return recentTurns.map((turn) => ({
    role: turn.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: turn.content }],
  }));
}
