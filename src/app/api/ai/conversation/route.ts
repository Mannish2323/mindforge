import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { callGemini, extractGeminiText, VELMORTH_SENSEI_PROMPT } from '@/lib/gemini';

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
  const timestamps = (rateLimitMap.get(userId) ?? []).filter(ts => now - ts < windowMs);
  if (timestamps.length >= MAX_REQUESTS_PER_MIN) return true;
  timestamps.push(now);
  rateLimitMap.set(userId, timestamps);
  return false;
}

// Enforced JSON suffix
const JSON_STRUCTURE_SUFFIX = `

IMPORTANT — You MUST respond ONLY with a valid JSON object. No prose, no markdown fences.
The JSON must have exactly these four keys:
{
  "content_ja": "<Japanese text using kanji and kana>",
  "content_romaji": "<romaji reading of the Japanese text>",
  "content_en": "<English translation>",
  "grammar_note": "<one helpful grammar or vocabulary tip, starting with 💡>"
}
If the user writes something unrelated to Japanese language learning, respond:
{
  "content_ja": "日本語の勉強に集中しましょう！",
  "content_romaji": "Nihongo no benkyou ni shuuchuu shimashou!",
  "content_en": "Let's focus on Japanese learning!",
  "grammar_note": "💡 I can only help with Japanese language topics."
}`;

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
    }

    // Verify user
    let user = null;
    if (supabaseUrl === 'https://dummy.supabase.co' || token === 'dummy-token') {
      user = { id: 'dummy-user-id', email: 'test@velmorth.com' };
    } else {
      const userClient = createClient(supabaseUrl, anonKey);
      const { data: { user: supabaseUser }, error: authErr } = await userClient.auth.getUser(token);
      if (authErr || !supabaseUser) {
        return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
      }
      user = supabaseUser;
    }

    const body = await request.json();
    const { message, history = [], session_id, jlptLevel } = body;

    // 1. Per-user rate limiting (sliding window)
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

        // 2. Fetch entitlements (limit + subscription expiry + fallback usage)
        const { data: ent } = await adminSupabase
          .from('entitlements')
          .select('ai_limit_daily, ends_at, status, ai_chats_used_today, ai_chats_reset_at')
          .eq('user_id', user.id)
          .maybeSingle();

        // Check subscription expiry
        if (ent?.ends_at && new Date(ent.ends_at) < new Date()) {
          // Expired — downgrade to free limits
          limit = 5;
        } else {
          limit = ent?.ai_limit_daily ?? 5;
        }

        // 3. Try usage_counters first, fall back to entitlements.ai_chats_used_today
        const { data: usage, error: usageErr } = await adminSupabase
          .from('usage_counters')
          .select('ai_requests')
          .eq('user_id', user.id)
          .eq('date', today)
          .maybeSingle();

        if (usageErr || usage === null) {
          // Fallback: use ai_chats_used_today on entitlements (reset if date differs)
          const resetDate = ent?.ai_chats_reset_at;
          used = (resetDate === today) ? (ent?.ai_chats_used_today ?? 0) : 0;
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

    // Build conversation history for Gemini
    const contents = history.map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    // Add current user turn
    contents.push({ role: 'user', parts: [{ text: message }] });

    // Combine master sensei prompt with strict JSON enforcement
    const systemPrompt = VELMORTH_SENSEI_PROMPT + 
      (jlptLevel ? `\nTarget JLPT Level: ${jlptLevel}` : '') + 
      JSON_STRUCTURE_SUFFIX;

    const data = await callGemini(contents, systemPrompt);
    const responseText = extractGeminiText(data);

    // Parse structured JSON response
    let parsed: {
      content_ja: string;
      content_romaji: string;
      content_en: string;
      grammar_note: string;
    };

    try {
      // Strip markdown code fences if Gemini wraps in ```json ... ```
      const cleaned = responseText
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/\s*```$/, '')
        .trim();
      parsed = JSON.parse(cleaned);
    } catch {
      // Fallback extraction
      const jaMatch     = responseText.match(/"content_ja"\s*:\s*"([^"]+)"/);
      const romajiMatch = responseText.match(/"content_romaji"\s*:\s*"([^"]+)"/);
      const enMatch     = responseText.match(/"content_en"\s*:\s*"([^"]+)"/);
      const noteMatch   = responseText.match(/"grammar_note"\s*:\s*"([^"]+)"/);
      const jaFallback  = responseText.match(/[ぁ-んァ-ヶ一-龥][^\n]*/)?.[0] ?? responseText;

      parsed = {
        content_ja:     jaMatch?.[1]     ?? jaFallback,
        content_romaji: romajiMatch?.[1] ?? '',
        content_en:     enMatch?.[1]     ?? '',
        grammar_note:   noteMatch?.[1]   ?? '',
      };
    }

    const formattedResponse = parsed.content_ja
      ? `${parsed.content_ja}\n\n*${parsed.content_romaji}*\n\n${parsed.content_en}${parsed.grammar_note ? '\n\n' + parsed.grammar_note : ''}`
      : responseText;

    if (supabaseUrl !== 'https://dummy.supabase.co') {
      try {
        const adminSupabase = createClient(supabaseUrl, serviceKey);
        // Save user message to database
        await adminSupabase.from('ai_chat_messages').insert({
          user_id: user.id,
          role: 'user',
          content: message,
          session_id: session_id || null
        });

        // Save assistant message to database
        await adminSupabase.from('ai_chat_messages').insert({
          user_id: user.id,
          role: 'assistant',
          content: formattedResponse,
          session_id: session_id || null
        });

        // Increment daily AI requests count
        await adminSupabase.rpc('increment_daily_usage', {
          p_user_id: user.id,
          p_counter: 'ai_requests'
        });
      } catch (err) {
        console.error('Error saving chat logs:', err);
      }
    }

    return NextResponse.json({
      message_id:     `ai-${Date.now()}`,
      role:           'assistant',
      content_ja:     parsed.content_ja     || '',
      content_romaji: parsed.content_romaji || '',
      content_en:     parsed.content_en     || '',
      grammar_note:   parsed.grammar_note   || '',
      raw:            responseText,
      timestamp:      new Date().toISOString(),
      fallback:       false,
    });
  } catch (error: any) {
    console.error('[Gemini] Conversation route error:', error.message);
    return NextResponse.json({
      message_id:     `ai-fallback-${Date.now()}`,
      role:           'assistant',
      content_ja:     'はじめまして！日本語を一緒に勉強しましょう。',
      content_romaji: 'Hajimemashite! Nihongo o issho ni benkyou shimashou.',
      content_en:     "Nice to meet you! Let's study Japanese together.",
      grammar_note:   '💡 はじめまして (hajimemashite) is the formal greeting when meeting someone for the first time.',
      timestamp:      new Date().toISOString(),
      fallback:       true,
    });
  }
}
