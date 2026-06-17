import { useState, useEffect } from 'react';
import {
  calculateCompletedLessonXP, updateSRSCard, generateLeaderboardMock,
  generateHeatmapData, generateDailyQuests, generateDefaultBadges,
  evaluateQuests, checkBadgeUnlocks, calculateLeagueTier, getDaysUntilLeagueReset
} from '@evlo/core-logic';
import { SRSCard, Quest, Badge, Friend, Duel, StudyCircle, Story, StreakShield, LeagueTier } from '@evlo/types';

const STORAGE_KEY = 'velmorth_state_v3';

// --- Mock social data ---
const MOCK_FRIENDS: Friend[] = [
  { friend_id: 'f1', username: 'Sakura_99', avatar: '🌸', xp: 1240, streak: 12, status: 'accepted', lastActive: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), nudged_today: false },
  { friend_id: 'f2', username: 'TokyoDrift', avatar: '🏎️', xp: 890, streak: 5, status: 'accepted', lastActive: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), nudged_today: false },
  { friend_id: 'f3', username: 'NihongoKing', avatar: '👑', xp: 2100, streak: 30, status: 'pending', lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), nudged_today: false },
];

const MOCK_DUELS: Duel[] = [
  {
    duel_id: 'd1', challenger_id: 'me', challenger_name: 'You', challenger_avatar: '😊',
    opponent_id: 'f1', opponent_name: 'Sakura_99', opponent_avatar: '🌸',
    lesson_id: 'ja_u01_l01_hello_basic', challenger_score: 85, opponent_score: null,
    status: 'active', winner_id: null, xp_stake: 20,
    createdAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  },
];

const MOCK_CIRCLES: StudyCircle[] = [
  {
    circle_id: 'c1', name: 'N5 Ninjas', description: 'JLPT N5 study group for beginners',
    avatar: '🥷', member_count: 24, weekly_xp: 4200,
    current_mission: 'Complete 50 lessons this week', mission_progress: 31, mission_target: 50,
    is_member: true,
  },
  {
    circle_id: 'c2', name: 'Kanji Crusaders', description: 'Dedicated to mastering Japanese kanji',
    avatar: '⛩️', member_count: 18, weekly_xp: 3100,
    current_mission: 'Review 200 SRS cards', mission_progress: 87, mission_target: 200,
    is_member: false,
  },
];

const MOCK_STORIES: Story[] = [
  {
    story_id: 's1', title: 'First Day in Tokyo', description: 'Navigate your first day in Japan',
    thumbnail: '🗼', difficulty: 'N5', estimated_minutes: 5, xp_reward: 30,
    tags: ['travel', 'greetings', 'N5'],
    is_locked: false, completed: false, completedAt: null,
    scenes: [
      {
        scene_id: 'sc1', background: '🏙️ Tokyo Station',
        dialogue: [
          { speaker: 'Station Staff', avatar: '👩', japanese: 'いらっしゃいませ！', romaji: 'Irasshaimase!', english: 'Welcome!', hindi: 'स्वागत है!' },
          { speaker: 'Station Staff', avatar: '👩', japanese: 'どちらへ行かれますか？', romaji: 'Dochira e ikaremasu ka?', english: 'Where are you going?', hindi: 'आप कहाँ जाना चाहते हैं?' },
        ],
        choices: [
          { choice_id: 'c1a', text_en: 'Shibuya, please', text_ja: 'しぶやへ、おねがいします', next_scene_id: 'sc2', xp_bonus: 10, is_correct: true },
          { choice_id: 'c1b', text_en: 'I don\'t know', text_ja: 'わかりません', next_scene_id: 'sc2', xp_bonus: 0, is_correct: false },
        ],
      },
      {
        scene_id: 'sc2', background: '🚇 Train Platform',
        dialogue: [
          { speaker: 'Velmorth AI', avatar: '🤖', japanese: 'よくできました！電車に乗りましょう。', romaji: 'Yoku dekimashita! Densha ni norimashou.', english: 'Well done! Let\'s board the train.', hindi: 'शाबाश! चलो ट्रेन में सवार होते हैं।' },
        ],
        is_end: true,
      },
    ],
  },
  {
    story_id: 's2', title: 'Ramen Shop Adventure', description: 'Order your favourite ramen in Japanese',
    thumbnail: '🍜', difficulty: 'N5', estimated_minutes: 7, xp_reward: 40,
    tags: ['food', 'ordering', 'N5'],
    is_locked: false, completed: false, completedAt: null,
    scenes: [
      {
        scene_id: 'r1', background: '🍜 Ramen Shop',
        dialogue: [
          { speaker: 'Chef', avatar: '👨‍🍳', japanese: 'いらっしゃいませ！何名様ですか？', romaji: 'Irasshaimase! Nanmei sama desu ka?', english: 'Welcome! How many people?', hindi: 'स्वागत है! कितने लोग?' },
        ],
        choices: [
          { choice_id: 'r1a', text_en: 'Just one person', text_ja: 'ひとりです', next_scene_id: 'r2', xp_bonus: 10, is_correct: true },
          { choice_id: 'r1b', text_en: 'I want ramen', text_ja: 'ラーメンをください', next_scene_id: 'r2', xp_bonus: 5, is_correct: false },
        ],
      },
      {
        scene_id: 'r2', background: '🍜 Ramen Shop',
        dialogue: [
          { speaker: 'Chef', avatar: '👨‍🍳', japanese: 'ありがとうございます！どうぞ。', romaji: 'Arigatou gozaimasu! Douzo.', english: 'Thank you! Please go ahead.', hindi: 'धन्यवाद! कृपया आगे बढ़ें।' },
        ],
        is_end: true,
      },
    ],
  },
  {
    story_id: 's3', title: 'Shopping in Harajuku', description: 'Buy clothes and accessories in Japanese',
    thumbnail: '🛍️', difficulty: 'N4', estimated_minutes: 10, xp_reward: 50,
    tags: ['shopping', 'N4'],
    is_locked: true, completed: false, completedAt: null,
    scenes: [],
  },
];

const DEFAULT_STATE = {
  username: 'Learner',
  avatar: '🦊',
  joinDate: new Date().toISOString(),
  xp: 0,
  gems: 50,
  hearts: 5,
  maxHearts: 5,
  streak: 0,
  lastStudyDate: null as string | null,
  lessonProgress: {} as Record<string, { completed: boolean; xp: number; completedAt: string }>,
  srsData: {} as Record<string, SRSCard>,
  activityLog: {} as Record<string, number>,
  theme: 'dark',
  uiLang: 'en',
  ttsEnabled: true,
  leaderboard: [] as any[],
  // --- New EVLO state ---
  quests: [] as Quest[],
  badges: [] as Badge[],
  weeklyXP: 0,
  leagueTier: 'bronze' as LeagueTier,
  streakShield: { active: false, uses_remaining: 0, max_uses: 3, activatedAt: null } as StreakShield,
  friends: MOCK_FRIENDS,
  duels: MOCK_DUELS,
  circles: MOCK_CIRCLES,
  stories: MOCK_STORIES,
  accuracyHistory: [] as number[],
  dailyLessonsCompleted: 0,
  dailyXPEarned: 0,
  dailyReviewsDone: 0,
  duelsWon: 0,
  storiesCompleted: 0,
  goalMinutes: 10,
};

export function useStore() {
  const [state, setState] = useState(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      let parsed = saved ? JSON.parse(saved) : {};

      // Seed leaderboard if empty
      if (!parsed.leaderboard || parsed.leaderboard.length === 0) {
        parsed.leaderboard = generateLeaderboardMock();
      }

      // Seed quests if empty
      if (!parsed.quests || parsed.quests.length === 0) {
        parsed.quests = generateDailyQuests();
      }

      // Seed badges if empty
      if (!parsed.badges || parsed.badges.length === 0) {
        parsed.badges = generateDefaultBadges();
      }

      // Always use fresh mock social data (no persistence needed for demo)
      parsed.friends = MOCK_FRIENDS;
      parsed.duels = MOCK_DUELS;
      parsed.circles = MOCK_CIRCLES;
      parsed.stories = parsed.stories || MOCK_STORIES;

      const merged = { ...DEFAULT_STATE, ...parsed };

      // Check streak
      if (merged.lastStudyDate) {
        const lastDate = new Date(merged.lastStudyDate);
        const diffDays = Math.floor((new Date().getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays > 1 && !merged.streakShield?.active) {
          merged.streak = 0;
        }
      }

      // Recompute league tier
      merged.leagueTier = calculateLeagueTier(merged.weeklyXP || 0);

      setState(merged);
    } catch (e) {
      console.warn('Failed to load local state', e);
    }
    setIsLoaded(true);
  }, []);

  const save = (newState: typeof state) => {
    setState(newState);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch (e) {
      console.warn('Failed to save local state', e);
    }
  };

  const addXP = (amount: number) => {
    const today = new Date().toISOString().split('T')[0];
    const log = { ...state.activityLog };
    log[today] = (log[today] || 0) + 1;

    const newWeeklyXP = (state.weeklyXP || 0) + amount;
    const updated = {
      ...state,
      xp: state.xp + amount,
      weeklyXP: newWeeklyXP,
      leagueTier: calculateLeagueTier(newWeeklyXP),
      dailyXPEarned: (state.dailyXPEarned || 0) + amount,
      activityLog: log,
    };
    save(updated);
    return updated.xp;
  };

  const loseHeart = () => {
    if (state.hearts > 0) {
      const updated = { ...state, hearts: state.hearts - 1 };
      save(updated);
      return updated.hearts;
    }
    return state.hearts;
  };

  const refillHearts = () => {
    const updated = { ...state, hearts: state.maxHearts };
    save(updated);
  };

  const addGems = (amount: number) => {
    const updated = { ...state, gems: state.gems + amount };
    save(updated);
  };

  const spendGems = (amount: number) => {
    if (state.gems >= amount) {
      const updated = { ...state, gems: state.gems - amount };
      save(updated);
      return true;
    }
    return false;
  };

  const updateStreakOnLesson = () => {
    let newStreak = state.streak;
    const last = state.lastStudyDate;

    if (!last) {
      newStreak = 1;
    } else {
      const lastDate = new Date(last);
      const diffDays = Math.floor((new Date().getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        newStreak += 1;
      } else if (diffDays > 1) {
        newStreak = 1;
      }
    }

    return {
      streak: newStreak,
      lastStudyDate: new Date().toISOString(),
    };
  };

  const completeLesson = (lessonId: string, xpReward: number) => {
    const progress = { ...state.lessonProgress };
    const lessonResult = calculateCompletedLessonXP(lessonId, progress, xpReward);
    const xpGained = lessonResult.xpToAdd;
    const gemsGained = lessonResult.gemsToAdd;
    const streakUpdate = updateStreakOnLesson();

    progress[lessonId] = {
      completed: true,
      xp: xpReward,
      completedAt: new Date().toISOString(),
    };

    const today = new Date().toISOString().split('T')[0];
    const log = { ...state.activityLog };
    log[today] = (log[today] || 0) + 1;

    const newWeeklyXP = (state.weeklyXP || 0) + xpGained;
    const newDailyLessons = (state.dailyLessonsCompleted || 0) + 1;
    const newDailyXP = (state.dailyXPEarned || 0) + xpGained;
    const newAccuracy = [...(state.accuracyHistory || []), xpGained / Math.max(xpReward, 1)];

    // Evaluate quests
    const updatedQuests = evaluateQuests(state.quests || [], {
      lessonsCompleted: newDailyLessons,
      xpEarned: newDailyXP,
      reviewsDone: state.dailyReviewsDone || 0,
      streakDays: streakUpdate.streak,
    });

    // Check badge unlocks
    const completedCount = Object.keys(progress).length;
    const updatedBadges = checkBadgeUnlocks(state.badges || [], {
      streak: streakUpdate.streak,
      totalXP: state.xp + xpGained,
      lessonsCompleted: completedCount,
      friendCount: state.friends.filter(f => f.status === 'accepted').length,
      duelsWon: state.duelsWon || 0,
      storiesCompleted: state.storiesCompleted || 0,
    });

    const updated = {
      ...state,
      xp: state.xp + xpGained,
      gems: state.gems + gemsGained,
      weeklyXP: newWeeklyXP,
      leagueTier: calculateLeagueTier(newWeeklyXP),
      streak: streakUpdate.streak,
      lastStudyDate: streakUpdate.lastStudyDate,
      lessonProgress: progress,
      activityLog: log,
      quests: updatedQuests,
      badges: updatedBadges,
      dailyLessonsCompleted: newDailyLessons,
      dailyXPEarned: newDailyXP,
      accuracyHistory: newAccuracy.slice(-30), // keep last 30 days
    };
    save(updated);
  };

  const handleSRSCardUpdate = (vocab: any, quality: number) => {
    const currentCard = state.srsData[vocab.vocab_id] || null;
    const result = updateSRSCard(currentCard, quality);

    const srsData = { ...state.srsData };
    srsData[vocab.vocab_id] = {
      cardId: vocab.vocab_id,
      vocab_id: vocab.vocab_id,
      kanji: vocab.kanji,
      romaji: vocab.romaji,
      meaning_en: vocab.meaning_en,
      meaning_hi: vocab.meaning_hi,
      ...result,
    };

    // Update review count for quests
    const newDailyReviews = (state.dailyReviewsDone || 0) + 1;
    const updatedQuests = evaluateQuests(state.quests || [], {
      lessonsCompleted: state.dailyLessonsCompleted || 0,
      xpEarned: state.dailyXPEarned || 0,
      reviewsDone: newDailyReviews,
      streakDays: state.streak,
    });

    save({ ...state, srsData, dailyReviewsDone: newDailyReviews, quests: updatedQuests });
  };

  const setTheme = (theme: 'dark' | 'light' | 'system') => {
    const updated = { ...state, theme };
    save(updated);
    if (theme === 'system') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
  };

  const setUILang = (uiLang: 'en' | 'hi') => {
    save({ ...state, uiLang });
  };

  const toggleTTS = () => {
    const updated = { ...state, ttsEnabled: !state.ttsEnabled };
    save(updated);
    return updated.ttsEnabled;
  };

  const getLeaderboardList = () => {
    const myEntry = {
      name: state.username,
      avatar: state.avatar,
      xp: state.xp,
      isYou: true,
    };
    return [...state.leaderboard, myEntry]
      .sort((a, b) => b.xp - a.xp)
      .map((p, i) => ({ ...p, rank: i + 1 }));
  };

  const getHeatmapList = () => {
    return generateHeatmapData(state.activityLog);
  };

  // --- New actions ---

  const claimQuest = (questId: string) => {
    const quests = state.quests.map(q =>
      q.quest_id === questId && q.status === 'completed'
        ? { ...q, status: 'claimed' as const }
        : q
    );
    const quest = state.quests.find(q => q.quest_id === questId);
    const xpBonus = quest?.xp_reward || 0;
    const gemBonus = quest?.gem_reward || 0;
    const updated = {
      ...state,
      quests,
      xp: state.xp + xpBonus,
      gems: state.gems + gemBonus,
    };
    save(updated);
  };

  const nudgeFriend = (friendId: string) => {
    const friends = state.friends.map(f =>
      f.friend_id === friendId ? { ...f, nudged_today: true } : f
    );
    save({ ...state, friends });
  };

  const addFriend = (username: string) => {
    const newFriend: Friend = {
      friend_id: `f-${Date.now()}`,
      username,
      avatar: '👤',
      xp: 0,
      streak: 0,
      status: 'pending',
      lastActive: new Date().toISOString(),
      nudged_today: false,
    };
    save({ ...state, friends: [...state.friends, newFriend] });
  };

  const challengeDuel = (friendId: string) => {
    const friend = state.friends.find(f => f.friend_id === friendId);
    if (!friend) return;
    const newDuel: Duel = {
      duel_id: `d-${Date.now()}`,
      challenger_id: 'me',
      challenger_name: state.username,
      challenger_avatar: state.avatar,
      opponent_id: friendId,
      opponent_name: friend.username,
      opponent_avatar: friend.avatar,
      lesson_id: 'ja_u01_l01_hello_basic',
      challenger_score: null,
      opponent_score: null,
      status: 'pending',
      winner_id: null,
      xp_stake: 20,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
    save({ ...state, duels: [...state.duels, newDuel] });
  };

  const joinCircle = (circleId: string) => {
    const circles = state.circles.map(c =>
      c.circle_id === circleId ? { ...c, is_member: true, member_count: c.member_count + 1 } : c
    );
    save({ ...state, circles });
  };

  const completeStory = (storyId: string, xpReward: number) => {
    const stories = state.stories.map(s =>
      s.story_id === storyId ? { ...s, completed: true, completedAt: new Date().toISOString() } : s
    );
    const newStoriesCompleted = (state.storiesCompleted || 0) + 1;
    const updatedBadges = checkBadgeUnlocks(state.badges || [], {
      streak: state.streak,
      totalXP: state.xp + xpReward,
      lessonsCompleted: Object.keys(state.lessonProgress).length,
      friendCount: state.friends.filter(f => f.status === 'accepted').length,
      duelsWon: state.duelsWon || 0,
      storiesCompleted: newStoriesCompleted,
    });
    const updated = {
      ...state,
      stories,
      storiesCompleted: newStoriesCompleted,
      xp: state.xp + xpReward,
      badges: updatedBadges,
    };
    save(updated);
  };

  const activateStreakShield = () => {
    if (state.gems >= 10) {
      save({
        ...state,
        gems: state.gems - 10,
        streakShield: { active: true, uses_remaining: 1, max_uses: 1, activatedAt: new Date().toISOString() },
      });
      return true;
    }
    return false;
  };

  const setGoalMinutes = (minutes: number) => {
    save({ ...state, goalMinutes: minutes });
  };

  return {
    state,
    isLoaded,
    addXP,
    loseHeart,
    refillHearts,
    addGems,
    spendGems,
    completeLesson,
    handleSRSCardUpdate,
    setTheme,
    setUILang,
    toggleTTS,
    getLeaderboardList,
    getHeatmapList,
    // New actions
    claimQuest,
    nudgeFriend,
    addFriend,
    challengeDuel,
    joinCircle,
    completeStory,
    activateStreakShield,
    setGoalMinutes,
  };
}
