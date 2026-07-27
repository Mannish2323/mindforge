/**
 * Sakura AI — Response Formatter & Validator
 */

import { SakuraAIResponsePayload, UserIntent, SupportedLanguage } from './types';

export function formatAndValidateResponse(
  rawText: string,
  intent: UserIntent,
  language: SupportedLanguage
): SakuraAIResponsePayload {
  const timestamp = new Date().toISOString();
  const messageId = `sakura-${Date.now()}`;

  let parsed: any = null;

  try {
    // Strip markdown code block wrappers if model adds them
    const cleaned = rawText
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/, '')
      .trim();

    parsed = JSON.parse(cleaned);
  } catch {
    // Regex fallback extraction
    const jaMatch = rawText.match(/"content_ja"\s*:\s*"([^"]+)"/);
    const romajiMatch = rawText.match(/"content_romaji"\s*:\s*"([^"]+)"/);
    const enMatch = rawText.match(/"content_en"\s*:\s*"([^"]+)"/);
    const hiMatch = rawText.match(/"content_hi"\s*:\s*"([^"]+)"/);
    const noteMatch = rawText.match(/"grammar_note"\s*:\s*"([^"]+)"/);
    const jaFallback = rawText.match(/[ぁ-んァ-ヶ一-龥][^\n]*/)?.[0] ?? rawText;

    parsed = {
      content_ja: jaMatch?.[1] ?? jaFallback,
      content_romaji: romajiMatch?.[1] ?? '',
      content_en: enMatch?.[1] ?? '',
      content_hi: hiMatch?.[1] ?? '',
      grammar_note: noteMatch?.[1] ?? '💡 Focus on sentence structure and word order.',
    };
  }

  const content_ja = parsed.content_ja || '一緒に日本語を勉強しましょう！';
  const content_romaji = parsed.content_romaji || 'Issho ni nihongo wo benkyou shimashou!';
  const content_en = parsed.content_en || "Let's study Japanese together!";
  const content_hi = parsed.content_hi || 'आइए मिलकर जापानी सीखें!';
  const grammar_note = parsed.grammar_note || '💡 Keep practicing daily to build your streak!';

  // Build clean markdown representation
  let markdown = `${content_ja}\n\n*${content_romaji}*\n\n${content_en}`;

  if (content_hi && language === 'hi') {
    markdown += `\n\n🇮🇳 *${content_hi}*`;
  }

  if (parsed.meaning) {
    markdown += `\n\n**Meaning:**\n${parsed.meaning}`;
  }

  if (grammar_note) {
    markdown += `\n\n${grammar_note.startsWith('💡') ? grammar_note : '💡 ' + grammar_note}`;
  }

  if (parsed.example_ja) {
    markdown += `\n\n**Example:**\n${parsed.example_ja}\n*${parsed.example_romaji || ''}*\n${parsed.example_en || ''}`;
  }

  if (parsed.memory_trick) {
    markdown += `\n\n🧠 **Memory Trick:**\n${parsed.memory_trick}`;
  }

  if (parsed.practice_exercise?.question) {
    markdown += `\n\n✏️ **Practice:**\n${parsed.practice_exercise.question}`;
  }

  return {
    message_id: messageId,
    role: 'assistant',
    intent,
    detected_language: language,
    content_ja,
    content_romaji,
    content_en,
    content_hi,
    meaning: parsed.meaning,
    grammar_note,
    example: parsed.example_ja
      ? {
          ja: parsed.example_ja,
          romaji: parsed.example_romaji || '',
          en: parsed.example_en || '',
          hi: parsed.example_hi || '',
        }
      : undefined,
    pronunciation_tips: parsed.pronunciation_tips,
    memory_trick: parsed.memory_trick,
    related_words: parsed.related_words,
    practice_exercise: parsed.practice_exercise,
    next_lesson_recommendation: parsed.next_lesson_recommendation,
    raw_markdown: markdown,
    timestamp,
    fallback: false,
  };
}
