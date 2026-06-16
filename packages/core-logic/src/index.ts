import { SRSCard } from "@evlo/types";

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

// Streak Validation Helper
export function checkStreakBroken(lastStudyDate: string | null, currentStreak: number): number {
  if (!lastStudyDate) return 0;
  const lastDate = new Date(lastStudyDate);
  const diffDays = Math.floor((new Date().getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays > 1) {
    return 0; // Streak broken
  }
  return currentStreak;
}

// XP/Streak update on completion
export function calculateCompletedLessonXP(lessonId: string, completedLessons: Record<string, any>, xpReward: number): {
  xpToAdd: number;
  gemsToAdd: number;
  shouldIncrementStreak: boolean;
} {
  const isAlreadyCompleted = !!completedLessons[lessonId];
  if (!isAlreadyCompleted) {
    return {
      xpToAdd: xpReward,
      gemsToAdd: 5,
      shouldIncrementStreak: true
    };
  } else {
    return {
      xpToAdd: Math.floor(xpReward / 2),
      gemsToAdd: 0,
      shouldIncrementStreak: true
    };
  }
}

// Heatmap generator helper
export function generateHeatmapData(activityLog: Record<string, number>, weeks: number = 13): Array<{ date: string; sessions: number; level: number }> {
  const cells = [];
  const today = new Date();
  const totalDays = weeks * 7;
  for (let i = totalDays - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().split("T")[0];
    const sessions = activityLog[key] || 0;
    cells.push({ date: key, sessions, level: Math.min(4, sessions) });
  }
  return cells;
}

// Mock Leaderboard
export function generateLeaderboardMock(): Array<{ name: string; avatar: string; xp: number; rank: number; isYou: boolean }> {
  const names = [
    { name: "Sakura_99", avatar: "🌸" },
    { name: "TokyoDrift", avatar: "🏎️" },
    { name: "NihongoKing", avatar: "👑" },
    { name: "ArigatouGuy", avatar: "🎌" },
    { name: "KanjiMaster", avatar: "⛩️" },
    { name: "Yuki_learns", avatar: "❄️" },
    { name: "Sensei_Pro", avatar: "🎓" },
    { name: "MangaFan2k", avatar: "📚" },
    { name: "OsakaVibes", avatar: "🦌" },
  ];
  return names.map((n, i) => ({
    ...n,
    xp: Math.floor(Math.random() * 800) + 200 - i * 40,
    rank: i + 1,
    isYou: false,
  }));
}

export * from "./xp";

