/**
 * Sakura AI — Language Detector
 * Detects English / Hindi / Japanese
 */

import { SupportedLanguage } from './types';

// Japanese script detection regex (Hiragana, Katakana, Kanji, full-width punctuation)
const JAPANESE_SCRIPT_REGEX = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/;

// Devanagari Hindi script regex
const DEVANAGARI_REGEX = /[\u0900-\u097F]/;

// Common Hinglish words
const HINGLISH_KEYWORDS = [
  'kaise', 'kya', 'hai', 'batao', 'samjha', 'matlab', 'kaise', 'shikho',
  'sikhao', 'baat', 'namaste', 'bhai', 'bataiye', 'sikha'
];

export function detectLanguage(text: string): SupportedLanguage {
  if (JAPANESE_SCRIPT_REGEX.test(text)) {
    return 'ja';
  }

  if (DEVANAGARI_REGEX.test(text)) {
    return 'hi';
  }

  const lowerText = text.toLowerCase();
  const words = lowerText.split(/\s+/);
  const isHinglish = words.some((word) => HINGLISH_KEYWORDS.includes(word));

  if (isHinglish) {
    return 'hi';
  }

  return 'en';
}
