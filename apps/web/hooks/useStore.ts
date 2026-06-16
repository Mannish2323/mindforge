import { useState, useEffect } from 'react';
import { calculateCompletedLessonXP, updateSRSCard, generateLeaderboardMock, generateHeatmapData } from '@evlo/core-logic';
import { UserState, SRSCard } from '@evlo/types';

const STORAGE_KEY = 'velmorth_state_v2';

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
      
      const merged = { ...DEFAULT_STATE, ...parsed };
      
      // Check streak
      if (merged.lastStudyDate) {
        const lastDate = new Date(merged.lastStudyDate);
        const diffDays = Math.floor((new Date().getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays > 1) {
          merged.streak = 0;
        }
      }
      
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

    const updated = {
      ...state,
      xp: state.xp + amount,
      activityLog: log
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
    let xpGained = xpReward;
    let gemsGained = 5;

    const lessonResult = calculateCompletedLessonXP(lessonId, progress, xpReward);
    xpGained = lessonResult.xpToAdd;
    gemsGained = lessonResult.gemsToAdd;

    const streakUpdate = updateStreakOnLesson();
    
    progress[lessonId] = {
      completed: true,
      xp: xpReward,
      completedAt: new Date().toISOString(),
    };

    const today = new Date().toISOString().split('T')[0];
    const log = { ...state.activityLog };
    log[today] = (log[today] || 0) + 1;

    const updated = {
      ...state,
      xp: state.xp + xpGained,
      gems: state.gems + gemsGained,
      streak: streakUpdate.streak,
      lastStudyDate: streakUpdate.lastStudyDate,
      lessonProgress: progress,
      activityLog: log
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
      ...result
    };

    save({ ...state, srsData });
  };

  const setTheme = (theme: 'dark' | 'light') => {
    const updated = { ...state, theme };
    save(updated);
    document.documentElement.setAttribute('data-theme', theme);
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
  };
}
