import { LeagueTier } from "../types";

// Re-export Spaced Repetition logic from Domain Layer
export { updateSRSCard, clusterWeakWords, calcAdaptiveDifficulty } from "../domain/srs-engine";

// Re-export Streak logic from Domain Layer
export { checkStreakBroken, calcStreakShieldUsage } from "../domain/streak-engine";

// Re-export XP logic from Domain Layer
export { calculateCompletedLessonXP, calcXP, calcMasteryDelta, calcXPForScore } from "../domain/xp-engine";

// Re-export Achievements from Domain Layer
export { checkBadgeUnlocks, generateDefaultBadges } from "../domain/achievement-engine";

// Re-export Quests / Daily Goals from Domain Layer
export { evaluateQuests, generateDailyQuests } from "../domain/daily-goal-engine";

// Re-export Leagues from Domain Layer
export { calculateLeagueTier, getLeagueThresholds, getDaysUntilLeagueReset } from "../domain/league-engine";


// ===== LEFTOVER UTILITIES / MOCKS =====

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

// Duel scoring
export function calcDuelResult(
  challengerScore: number,
  opponentScore: number,
  xpStake: number
): { winnerId: 'challenger' | 'opponent' | 'draw'; xpDelta: number; message: string } {
  if (challengerScore > opponentScore) {
    return { winnerId: 'challenger', xpDelta: xpStake, message: '🏆 You won the duel!' };
  } else if (opponentScore > challengerScore) {
    return { winnerId: 'opponent', xpDelta: -xpStake, message: '😤 Challenger wins this round.' };
  }
  return { winnerId: 'draw', xpDelta: 0, message: '🤝 It\'s a draw!' };
}
