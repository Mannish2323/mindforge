/**
 * Sakura AI System Architecture — TypeScript Definitions
 * Learn with Velmorth
 */

export type SupportedLanguage = 'en' | 'hi' | 'ja';

export type UserIntent =
  | 'grammar'
  | 'vocabulary'
  | 'kanji'
  | 'translation'
  | 'writing'
  | 'speaking'
  | 'listening'
  | 'conversation'
  | 'pronunciation'
  | 'jlpt'
  | 'quiz'
  | 'flashcards'
  | 'motivation'
  | 'daily_goal'
  | 'casual_chat';

export interface UserContext {
  userId: string;
  jlptLevel: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  preferredLanguage: SupportedLanguage;
  currentCourse?: string;
  completedLessonsCount?: number;
  weakTopics?: string[];
  weakGrammar?: string[];
  weakKanji?: string[];
  dailyXp?: number;
  streakDays?: number;
  planId?: string;
  aiLimitDaily?: number;
  aiChatsUsedToday?: number;
}

export interface ConversationTurn {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface RetrievedKnowledge {
  topicTitle?: string;
  grammarRules?: string[];
  vocabularyDefinitions?: { word: string; reading: string; meaning: string }[];
  exampleSentences?: { ja: string; romaji: string; en: string; hi?: string }[];
  kanjiInfo?: { character: string; onyomi: string; kunyomi: string; meaning: string }[];
  source: 'database' | 'encyclopedia' | 'grammar_topics' | 'fallback';
}

export interface SakuraAIResponsePayload {
  message_id: string;
  role: 'assistant';
  intent: UserIntent;
  detected_language: SupportedLanguage;
  
  // Core Response Fields
  content_ja: string;
  content_romaji: string;
  content_en: string;
  content_hi?: string;
  
  // Structured Educational Breakdown
  meaning?: string;
  grammar_note?: string;
  example?: {
    ja: string;
    romaji: string;
    en: string;
    hi?: string;
  };
  pronunciation_tips?: string;
  memory_trick?: string;
  related_words?: string[];
  practice_exercise?: {
    question: string;
    options?: string[];
    answer?: string;
    explanation?: string;
  };
  next_lesson_recommendation?: string;
  
  // OCR / Image extraction (if image sent)
  ocr_extracted_text?: string;
  
  // Audio TTS metadata
  audio_url?: string;
  
  raw_markdown: string;
  timestamp: string;
  fallback: boolean;
}
