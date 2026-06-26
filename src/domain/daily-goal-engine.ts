import { Quest } from "../types";

// Evaluate which daily/weekly quests are now complete
export function evaluateQuests(
  quests: Quest[],
  stats: { lessonsCompleted: number; xpEarned: number; reviewsDone: number; streakDays: number }
): Quest[] {
  return quests.map(quest => {
    let progress = quest.progress;
    if (quest.quest_id === 'q_lessons_today') progress = stats.lessonsCompleted;
    if (quest.quest_id === 'q_xp_today') progress = stats.xpEarned;
    if (quest.quest_id === 'q_reviews_today') progress = stats.reviewsDone;
    if (quest.quest_id === 'q_streak_week') progress = stats.streakDays;

    const newStatus: Quest['status'] =
      progress >= quest.target && quest.status === 'active' ? 'completed' : quest.status;

    return { ...quest, progress, status: newStatus };
  });
}

// Generate default daily quests
export function generateDailyQuests(): Quest[] {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const expiresAt = tomorrow.toISOString();

  return [
    {
      quest_id: 'q_lessons_today',
      title: 'Lesson Sprint',
      description: 'Complete 3 lessons today',
      type: 'daily',
      xp_reward: 20,
      gem_reward: 5,
      icon: '📚',
      target: 3,
      progress: 0,
      status: 'active',
      expiresAt,
    },
    {
      quest_id: 'q_xp_today',
      title: 'XP Chaser',
      description: 'Earn 50 XP today',
      type: 'daily',
      xp_reward: 15,
      gem_reward: 3,
      icon: '⚡',
      target: 50,
      progress: 0,
      status: 'active',
      expiresAt,
    },
    {
      quest_id: 'q_reviews_today',
      title: 'Memory Master',
      description: 'Review 10 flashcards',
      type: 'daily',
      xp_reward: 10,
      gem_reward: 2,
      icon: '🧠',
      target: 10,
      progress: 0,
      status: 'active',
      expiresAt,
    },
  ];
}
