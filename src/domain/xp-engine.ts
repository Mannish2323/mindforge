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

export function calcXP(accuracy: number, timeSeconds: number): number {
  const speedBonus = timeSeconds < 90 ? 10 : 0;
  return Math.round(accuracy * 50) + speedBonus;
}

export function calcMasteryDelta(accuracy: number): number {
  return accuracy * 0.15;
}

export function calcXPForScore(correctCount: number, totalQuestions: number, timeSeconds: number): number {
  if (totalQuestions === 0) return 0;
  const accuracy = correctCount / totalQuestions;
  return calcXP(accuracy, timeSeconds);
}
