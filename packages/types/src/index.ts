export interface VocabItem {
  vocab_id: string;
  kanji: string;
  romaji: string;
  meaning_en: string;
  meaning_hi: string;
}

export interface Example {
  japanese: string;
  romaji: string;
  english: string;
  hindi: string;
}

export interface GrammarPoint {
  grammar_id: string;
  title: string;
  structure: string;
  explanation_en: string;
  explanation_hi?: string;
}

export interface PronunciationTip {
  tip_id: string;
  japanese: string;
  romaji: string;
  audio_ref?: string;
  tip_en: string;
  tip_hi?: string;
}

export interface Exercise {
  type: string; // 'translate' | 'tap' | 'fill' | 'match'
  prompt: string;
  correct_index?: number;
  options?: string[];
  correct_tap_order?: string[];
  options_tap?: string[];
}

export interface Lesson {
  lesson_id: string;
  lesson_title: string;
  difficulty: string;
  xp_reward: number;
  is_premium?: boolean;
  vocabulary: VocabItem[];
  grammar_point: GrammarPoint;
  pronunciation_tip?: PronunciationTip;
  examples: Example[];
  review_words: string[];
}

export interface Unit {
  unit_id: string;
  unit_title: string;
  unit_icon?: string;
  lessons: Lesson[];
}

export interface UserProgress {
  uid: string;
  lessonId: string;
  score: number;
  completed: boolean;
  completedAt: string;
}

export interface UserState {
  uid: string;
  name: string;
  username: string;
  email: string;
  profileImage?: string;
  xp: number;
  level: number;
  streak: number;
  leafBalance: number;
  isPremium: boolean;
  darkMode: boolean;
  createdAt: string;
  lastActive: string;
}

export interface SRSCard {
  cardId: string; // vocabId
  vocab_id: string;
  kanji: string;
  romaji: string;
  meaning_en: string;
  meaning_hi: string;
  interval: number; // in days
  ease: number; // ease factor
  repetitions: number;
  dueDate: string; // ISO string
}

// Monorepo Blueprint additions
export interface UserProfile {
  displayName: string;
  photoURL?: string;
  targetLanguage: string;
  nativeLanguage: string;
  goalMinutes: number;
  role: "learner" | "creator" | "moderator" | "admin";
  createdAt: string;
  updatedAt: string;
}

export interface Progress {
  mastery: number;
  xp: number;
  accuracy: number;
  lastReviewedAt: string;
  updatedAt: string;
}

export interface ScoreRequest {
  total_questions: number;
  correct_answers: number;
  time_seconds: number;
}
