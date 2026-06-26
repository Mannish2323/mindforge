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

// Streak shield logic
export function calcStreakShieldUsage(
  streakBroken: boolean,
  shield: { active: boolean; uses_remaining: number }
): { shieldUsed: boolean; streakSaved: boolean; newUsesRemaining: number } {
  if (streakBroken && shield.active && shield.uses_remaining > 0) {
    return {
      shieldUsed: true,
      streakSaved: true,
      newUsesRemaining: shield.uses_remaining - 1,
    };
  }
  return { shieldUsed: false, streakSaved: false, newUsesRemaining: shield.uses_remaining };
}
