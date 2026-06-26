import { SRSCard, MistakeCluster, DifficultyLevel, AdaptiveDifficulty } from "../types";

// SM-2 Spaced Repetition Algorithm (quality: 0=hard, 1=ok, 2=easy)
export function updateSRSCard(card: Omit<SRSCard, "vocab_id" | "kanji" | "romaji" | "meaning_en" | "meaning_hi" | "cardId"> | null, quality: number): {
  ease: number;
  interval: number;
  repetitions: number;
  dueDate: string;
} {
  const currentCard = card || {
    ease: 2.5,
    interval: 1,
    repetitions: 0,
    dueDate: new Date().toISOString(),
  };

  let { ease, interval, repetitions } = currentCard;
  const easeMap = [0, 0.15, 0.3];
  const easeChange = easeMap[quality] ?? 0;

  if (quality === 0) {
    interval = 1;
    repetitions = 0;
  } else if (quality === 1) {
    interval = Math.max(1, interval);
    repetitions += 1;
  } else {
    interval = repetitions === 0 ? 1 : repetitions === 1 ? 6 : Math.round(interval * ease);
    repetitions += 1;
  }

  ease = Math.max(1.3, ease + easeChange);
  const due = new Date();
  due.setDate(due.getDate() + interval);

  return {
    ease,
    interval,
    repetitions,
    dueDate: due.toISOString(),
  };
}

// Cluster SRS cards by error rate to identify weak areas
export function clusterWeakWords(
  srsData: Record<string, SRSCard & { errorCount?: number }>
): MistakeCluster[] {
  const cards = Object.values(srsData);
  const weakCards = cards.filter(c => (c.errorCount || 0) > 1 || c.ease < 1.8);

  if (weakCards.length === 0) return [];

  // Group by ease factor buckets
  const clusters: MistakeCluster[] = [
    {
      cluster_id: 'pronunciation',
      word_ids: weakCards.filter(c => c.ease < 1.5).map(c => c.vocab_id),
      error_count: weakCards.filter(c => c.ease < 1.5).reduce((sum, c) => sum + (c.errorCount || 1), 0),
      error_rate: weakCards.filter(c => c.ease < 1.5).length / Math.max(cards.length, 1),
      pattern_type: 'pronunciation' as const,
      suggested_review: weakCards.filter(c => c.ease < 1.5).map(c => c.kanji).slice(0, 5),
    },
    {
      cluster_id: 'meaning',
      word_ids: weakCards.filter(c => c.ease >= 1.5 && c.ease < 1.8).map(c => c.vocab_id),
      error_count: weakCards.filter(c => c.ease >= 1.5 && c.ease < 1.8).reduce((sum, c) => sum + (c.errorCount || 1), 0),
      error_rate: weakCards.filter(c => c.ease >= 1.5 && c.ease < 1.8).length / Math.max(cards.length, 1),
      pattern_type: 'meaning' as const,
      suggested_review: weakCards.filter(c => c.ease >= 1.5 && c.ease < 1.8).map(c => c.kanji).slice(0, 5),
    },
  ].filter(c => c.word_ids.length > 0);

  return clusters;
}

// Calculate adaptive difficulty recommendation based on accuracy history
export function calcAdaptiveDifficulty(
  accuracyHistory: number[],
  completedCount: number
): AdaptiveDifficulty {
  const recent = accuracyHistory.slice(-7);
  const avg7day = recent.length > 0
    ? recent.reduce((a, b) => a + b, 0) / recent.length
    : 0.5;

  let level: DifficultyLevel = 'beginner';
  if (avg7day >= 0.9 && completedCount >= 20) level = 'expert';
  else if (avg7day >= 0.8 && completedCount >= 10) level = 'advanced';
  else if (avg7day >= 0.7 && completedCount >= 5) level = 'intermediate';
  else if (avg7day >= 0.6) level = 'elementary';

  return {
    recommended_level: level,
    accuracy_7day: Math.round(avg7day * 100),
    weak_areas: avg7day < 0.7 ? ['vocabulary', 'particles'] : ['kanji'],
    strong_areas: avg7day >= 0.8 ? ['greetings', 'numbers'] : [],
    next_lesson_id: 'ja_u01_l01_hello_basic',
    confidence_score: Math.round(avg7day * 100),
  };
}
