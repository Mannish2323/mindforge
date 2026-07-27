/**
 * Sakura AI — Intent Detector
 */

import { UserIntent } from './types';

export function detectIntent(text: string): UserIntent {
  const lower = text.toLowerCase();

  // Grammar
  if (
    lower.includes('grammar') ||
    lower.includes('particle') ||
    lower.includes('structure') ||
    lower.includes('rule') ||
    lower.includes('difference between') ||
    lower.includes('how to use') ||
    lower.includes('form') ||
    lower.includes('て形') ||
    lower.includes('文法')
  ) {
    return 'grammar';
  }

  // Kanji
  if (
    lower.includes('kanji') ||
    lower.includes('stroke') ||
    lower.includes('onyomi') ||
    lower.includes('kunyomi') ||
    lower.includes('radical') ||
    lower.includes('漢字')
  ) {
    return 'kanji';
  }

  // Vocabulary
  if (
    lower.includes('vocab') ||
    lower.includes('meaning') ||
    lower.includes('word') ||
    lower.includes('dictionary') ||
    lower.includes('definition') ||
    lower.includes('単語')
  ) {
    return 'vocabulary';
  }

  // Translation
  if (
    lower.includes('translate') ||
    lower.includes('how do you say') ||
    lower.includes('in japanese') ||
    lower.includes('in english') ||
    lower.includes('in hindi') ||
    lower.includes('means in hindi') ||
    lower.includes('翻訳')
  ) {
    return 'translation';
  }

  // Writing
  if (
    lower.includes('write') ||
    lower.includes('hiragana') ||
    lower.includes('katakana') ||
    lower.includes('stroke order') ||
    lower.includes('書き方')
  ) {
    return 'writing';
  }

  // Speaking / Pronunciation
  if (
    lower.includes('speak') ||
    lower.includes('pronunciation') ||
    lower.includes('accent') ||
    lower.includes('pitch') ||
    lower.includes('dialogue') ||
    lower.includes('発音')
  ) {
    return 'speaking';
  }

  // JLPT
  if (
    lower.includes('jlpt') ||
    lower.includes('n5') ||
    lower.includes('n4') ||
    lower.includes('n3') ||
    lower.includes('n2') ||
    lower.includes('n1') ||
    lower.includes('exam') ||
    lower.includes('test prep')
  ) {
    return 'jlpt';
  }

  // Quiz / Flashcards
  if (
    lower.includes('quiz') ||
    lower.includes('test me') ||
    lower.includes('flashcard') ||
    lower.includes('practice question')
  ) {
    return 'quiz';
  }

  // Motivation / Daily Goal
  if (
    lower.includes('streak') ||
    lower.includes('xp') ||
    lower.includes('goal') ||
    lower.includes('motivated') ||
    lower.includes('frustrated')
  ) {
    return 'motivation';
  }

  // Default: Casual Chat with Sakura AI
  return 'casual_chat';
}
