/**
 * Sakura AI Engine — Master Orchestrator
 * Implements the 10-step AI Reply Pipeline
 */

import { validateUserInput } from './inputValidator';
import { detectLanguage } from './languageDetector';
import { detectIntent } from './intentDetector';
import { fetchUserContext, formatConversationMemory } from './memoryManager';
import { retrieveKnowledge } from './knowledgeRetriever';
import { buildSakuraSystemPrompt } from './promptBuilder';
import { formatAndValidateResponse } from './responseFormatter';
import { callGemini, extractGeminiText, GeminiContent } from '@/lib/gemini';
import { SakuraAIResponsePayload, ConversationTurn } from './types';

export interface ExecuteSakuraQueryOptions {
  userId: string;
  message: string;
  history?: ConversationTurn[];
  imageInlineData?: { mimeType: string; data: string }; // OCR support
}

export async function processSakuraAIQuery(
  options: ExecuteSakuraQueryOptions
): Promise<SakuraAIResponsePayload> {
  const { userId, message, history = [], imageInlineData } = options;

  // 1. Input Validation
  const validation = validateUserInput(message);
  if (!validation.isValid) {
    throw new Error(validation.rejectionReason || 'Invalid input message.');
  }

  // Handle off-topic queries immediately with polite redirect
  if (validation.isOffTopic) {
    return {
      message_id: `sakura-offtopic-${Date.now()}`,
      role: 'assistant',
      intent: 'casual_chat',
      detected_language: 'en',
      content_ja: '日本語の勉強に集中しましょう！',
      content_romaji: 'Nihongo no benkyou ni shuuchuu shimashou!',
      content_en: "Let's focus on Japanese learning! 🌸 Ask me anything about Japanese grammar, vocabulary, or kanji.",
      grammar_note: '💡 I specialize in helping you learn Japanese.',
      raw_markdown: "日本語の勉強に集中しましょう！\n\n*Nihongo no benkyou ni shuuchuu shimashou!*\n\nLet's focus on Japanese learning! 🌸 Ask me anything about Japanese grammar, vocabulary, or kanji.\n\n💡 I specialize in helping you learn Japanese.",
      timestamp: new Date().toISOString(),
      fallback: false,
    };
  }

  const cleanMessage = validation.sanitizedMessage;

  // 2. Language Detection
  const language = detectLanguage(cleanMessage);

  // 3. Intent Detection
  const intent = detectIntent(cleanMessage);

  // 4. Memory & User Context Loading
  const userContext = await fetchUserContext(userId);

  // 5. Knowledge Retrieval Engine (RAG)
  const knowledge = await retrieveKnowledge(cleanMessage, intent);

  // 6. System Prompt Construction
  const systemPrompt = buildSakuraSystemPrompt(userContext, intent, knowledge);

  // Build Gemini contents payload with memory history
  const contents: GeminiContent[] = formatConversationMemory(history);

  // Add current turn with optional OCR image data
  if (imageInlineData) {
    contents.push({
      role: 'user',
      parts: [
        { inlineData: imageInlineData },
        { text: `${cleanMessage}\n[Task: Perform Japanese OCR, translate, extract vocabulary and explain]` },
      ],
    });
  } else {
    contents.push({
      role: 'user',
      parts: [{ text: cleanMessage }],
    });
  }

  // 7. LLM Execution (Gemini with 4-key rotation)
  const geminiRaw = await callGemini(contents, systemPrompt);
  const rawResponseText = extractGeminiText(geminiRaw);

  // 8. Response Validation & Formatting
  const responsePayload = formatAndValidateResponse(rawResponseText, intent, language);

  return responsePayload;
}
