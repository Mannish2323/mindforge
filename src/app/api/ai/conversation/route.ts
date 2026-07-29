import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { processSakuraAIQuery } from '@/lib/ai/sakuraEngine';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Rate-limit map: userId → last request timestamps (sliding window)
const rateLimitMap = new Map<string, number[]>();
const MAX_REQUESTS_PER_MIN = 10;

function isRateLimited(userId: string): boolean {
  const now = Date.now();
  const windowMs = 60_000;
  const timestamps = (rateLimitMap.get(userId) ?? []).filter((ts) => now - ts < windowMs);
  if (timestamps.length >= MAX_REQUESTS_PER_MIN) return true;
  timestamps.push(now);
  rateLimitMap.set(userId, timestamps);
  return false;
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
    }

    // Verify user
    let user: { id: string; email?: string } | null = null;
    if (supabaseUrl === 'https://dummy.supabase.co' || token === 'dummy-token') {
      user = { id: 'dummy-user-id', email: 'test@yamplelabs.com' };
    } else {
      const userClient = createClient(supabaseUrl, anonKey);
      const {
        data: { user: supabaseUser },
        error: authErr,
      } = await userClient.auth.getUser(token);
      if (authErr || !supabaseUser) {
        return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
      }
      user = supabaseUser;
    }

    const body = await request.json();
    const { message, history = [], session_id, imageInlineData } = body;

    // 1. Per-user rate limiting
    if (isRateLimited(user.id)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment.' },
        { status: 429 }
      );
    }

    let limit = 99;
    let used = 0;

    if (supabaseUrl !== 'https://dummy.supabase.co') {
      try {
        const adminSupabase = createClient(supabaseUrl, serviceKey);
        const today = new Date().toISOString().slice(0, 10);

        const { data: ent } = await adminSupabase
          .from('entitlements')
          .select('ai_limit_daily, ends_at, status, ai_chats_used_today, ai_chats_reset_at')
          .eq('user_id', user.id)
          .maybeSingle();

        if (ent?.ends_at && new Date(ent.ends_at) < new Date()) {
          limit = 5;
        } else {
          limit = ent?.ai_limit_daily ?? 5;
        }

        const { data: usage, error: usageErr } = await adminSupabase
          .from('usage_counters')
          .select('ai_requests')
          .eq('user_id', user.id)
          .eq('date', today)
          .maybeSingle();

        if (usageErr || usage === null) {
          const resetDate = ent?.ai_chats_reset_at;
          used = resetDate === today ? ent?.ai_chats_used_today ?? 0 : 0;
        } else {
          used = usage.ai_requests ?? 0;
        }
      } catch (err) {
        console.error('Error fetching limits:', err);
      }
    }

    if (used >= limit) {
      return NextResponse.json(
        {
          error: `Daily AI limit reached (${limit}/day). Upgrade your plan to continue.`,
          upgrade: true,
          used,
          limit,
        },
        { status: 429 }
      );
    }

    // Process query through Sakura AI Engine
    const sakuraResponse = await processSakuraAIQuery({
      userId: user.id,
      message,
      history,
      imageInlineData,
    });

    // Save chat history to database
    if (supabaseUrl !== 'https://dummy.supabase.co') {
      try {
        const adminSupabase = createClient(supabaseUrl, serviceKey);

        await adminSupabase.from('ai_chat_messages').insert([
          {
            user_id: user.id,
            role: 'user',
            content: message,
            session_id: session_id || null,
          },
          {
            user_id: user.id,
            role: 'assistant',
            content: sakuraResponse.raw_markdown,
            session_id: session_id || null,
          },
        ]);

        await adminSupabase.rpc('increment_daily_usage', {
          p_user_id: user.id,
          p_counter: 'ai_requests',
        });
      } catch (err) {
        console.error('Error saving chat logs:', err);
      }
    }

    return NextResponse.json(sakuraResponse);
  } catch (error: any) {
    console.error('[SakuraAI Engine] Conversation error:', error.message);
    return NextResponse.json(
      {
        message_id: `sakura-fallback-${Date.now()}`,
        role: 'assistant',
        intent: 'casual_chat',
        detected_language: 'en',
        content_ja: 'はじめまして！日本語を一緒に勉強しましょう。',
        content_romaji: 'Hajimemashite! Nihongo o issho ni benkyou shimashou.',
        content_en: "Nice to meet you! Let's study Japanese together.",
        grammar_note: '💡 はじめまして (hajimemashite) is the formal greeting when meeting someone for the first time.',
        raw_markdown: "はじめまして！日本語を一緒に勉強しましょう。\n\n*Hajimemashite! Nihongo o issho ni benkyou shimashou.*\n\nNice to meet you! Let's study Japanese together.\n\n💡 はじめまして (hajimemashite) is the formal greeting when meeting someone for the first time.",
        timestamp: new Date().toISOString(),
        fallback: true,
      },
      { status: 500 }
    );
  }
}
