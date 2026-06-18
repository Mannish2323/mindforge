import { NextResponse } from 'next/server';
import { callGemini, extractGeminiText, VELMORTH_SENSEI_PROMPT } from '../../../lib/gemini';

// Rate-limit map: userId → last request timestamps (simple in-memory sliding window)
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { session_id, messages = [], topic, difficulty, user_id } = body;

    // Per-user rate limiting
    if (user_id && isRateLimited(user_id)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment.' },
        { status: 429 }
      );
    }

    // Build conversation history for Gemini
    const contents = messages.map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    // Add current user turn if no history provided
    if (contents.length === 0) {
      const contextText = topic
        ? `Let's practice Japanese conversation about: ${topic}. Difficulty: ${difficulty || 'beginner'}.`
        : 'こんにちは！Let\'s start our Japanese lesson.';
      contents.push({ role: 'user', parts: [{ text: contextText }] });
    }

    const data = await callGemini(contents, VELMORTH_SENSEI_PROMPT);
    const responseText = extractGeminiText(data);

    // Parse structured response: Japanese / Romaji / English / Note
    const lines = responseText.split('\n').filter((l: string) => l.trim());
    const japanese = lines.find((l: string) => /[ぁ-んァ-ヶ一-龥]/.test(l))?.trim() ?? responseText;
    const romaji   = lines.find((l: string) => /[a-zA-Z]{2,}/.test(l) && !/^(Note|Grammar|Vocab)/i.test(l))?.trim() ?? '';
    const english  = lines.find((l: string) => /^[A-Z]/.test(l) && !/[ぁ-んァ-ヶ一-龥]/.test(l))?.trim() ?? '';
    const note     = lines.find((l: string) => /^(Note|Grammar|Vocab|💡|\*)/i.test(l))?.trim() ?? '';

    return NextResponse.json({
      message_id: `ai-${Date.now()}`,
      role: 'assistant',
      content_ja: japanese,
      content_romaji: romaji,
      content_en: english,
      grammar_note: note,
      raw: responseText,
      timestamp: new Date().toISOString(),
      fallback: false,
    });
  } catch (error: any) {
    console.error('[Gemini] Conversation route error:', error.message);
    return NextResponse.json({
      message_id: `ai-fallback-${Date.now()}`,
      role: 'assistant',
      content_ja: 'はじめまして！日本語を一緒に勉強しましょう。',
      content_romaji: 'Hajimemashite! Nihongo o issho ni benkyou shimashou.',
      content_en: "Nice to meet you! Let's study Japanese together.",
      grammar_note: '💡 はじめまして (hajimemashite) is the formal greeting when meeting someone for the first time.',
      timestamp: new Date().toISOString(),
      fallback: true,
    });
  }
}
