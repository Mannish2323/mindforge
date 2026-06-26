import { Badge } from "../types";

// Check if any badges should be unlocked given current state
export function checkBadgeUnlocks(
  badges: Badge[],
  stats: {
    streak: number;
    totalXP: number;
    lessonsCompleted: number;
    friendCount: number;
    duelsWon: number;
    storiesCompleted: number;
  }
): Badge[] {
  return badges.map(badge => {
    if (badge.unlockedAt !== null) return badge; // already unlocked

    let shouldUnlock = false;
    if (badge.badge_id === 'b_streak_7' && stats.streak >= 7) shouldUnlock = true;
    if (badge.badge_id === 'b_streak_30' && stats.streak >= 30) shouldUnlock = true;
    if (badge.badge_id === 'b_streak_100' && stats.streak >= 100) shouldUnlock = true;
    if (badge.badge_id === 'b_xp_1000' && stats.totalXP >= 1000) shouldUnlock = true;
    if (badge.badge_id === 'b_xp_10000' && stats.totalXP >= 10000) shouldUnlock = true;
    if (badge.badge_id === 'b_lessons_10' && stats.lessonsCompleted >= 10) shouldUnlock = true;
    if (badge.badge_id === 'b_lessons_50' && stats.lessonsCompleted >= 50) shouldUnlock = true;
    if (badge.badge_id === 'b_social_friend' && stats.friendCount >= 1) shouldUnlock = true;
    if (badge.badge_id === 'b_duel_winner' && stats.duelsWon >= 1) shouldUnlock = true;
    if (badge.badge_id === 'b_story_reader' && stats.storiesCompleted >= 1) shouldUnlock = true;

    if (shouldUnlock) {
      return { ...badge, unlockedAt: new Date().toISOString() };
    }
    return badge;
  });
}

// Generate default badge catalog
export function generateDefaultBadges(): Badge[] {
  return [
    { badge_id: 'b_streak_7', title: 'Week Warrior', description: '7-day streak', icon: '🔥', rarity: 'common', unlockedAt: null, category: 'streak' },
    { badge_id: 'b_streak_30', title: 'Month Master', description: '30-day streak', icon: '🌟', rarity: 'rare', unlockedAt: null, category: 'streak' },
    { badge_id: 'b_streak_100', title: 'Centurion', description: '100-day streak', icon: '💯', rarity: 'epic', unlockedAt: null, category: 'streak' },
    { badge_id: 'b_xp_1000', title: 'XP Climber', description: 'Earn 1,000 XP', icon: '⚡', rarity: 'common', unlockedAt: null, category: 'learning' },
    { badge_id: 'b_xp_10000', title: 'XP Legend', description: 'Earn 10,000 XP', icon: '👑', rarity: 'legendary', unlockedAt: null, category: 'learning' },
    { badge_id: 'b_lessons_10', title: 'Dedicated Learner', description: 'Complete 10 lessons', icon: '📚', rarity: 'common', unlockedAt: null, category: 'learning' },
    { badge_id: 'b_lessons_50', title: 'Scholar', description: 'Complete 50 lessons', icon: '🎓', rarity: 'rare', unlockedAt: null, category: 'mastery' },
    { badge_id: 'b_social_friend', title: 'Social Learner', description: 'Add your first friend', icon: '🤝', rarity: 'common', unlockedAt: null, category: 'social' },
    { badge_id: 'b_duel_winner', title: 'Duel Champion', description: 'Win a duel', icon: '⚔️', rarity: 'rare', unlockedAt: null, category: 'social' },
    { badge_id: 'b_story_reader', title: 'Story Explorer', description: 'Complete a story', icon: '📖', rarity: 'common', unlockedAt: null, category: 'learning' },
    { badge_id: 'b_perfect', title: 'Perfectionist', description: 'Get 100% on a lesson', icon: '💎', rarity: 'epic', unlockedAt: null, category: 'mastery' },
    { badge_id: 'b_early', title: 'Early Bird', description: 'First to join EVLO', icon: '🌅', rarity: 'legendary', unlockedAt: new Date().toISOString(), category: 'special' },
  ];
}
