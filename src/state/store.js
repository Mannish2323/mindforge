// =====================================================
// VELMORTH STORE — Central State Management
// Uses localStorage for persistence
// =====================================================

const STORAGE_KEY = 'velmorth_state_v2';

const DEFAULT_STATE = {
  // User info
  username: 'Learner',
  avatar: '🦊',
  joinDate: new Date().toISOString(),

  // Gamification
  xp: 0,
  gems: 50,
  hearts: 5,
  maxHearts: 5,
  streak: 0,
  lastStudyDate: null,

  // Lesson progress: { [lesson_id]: { completed: bool, xp: num, completedAt: str } }
  lessonProgress: {},

  // Review / SRS: { [vocab_id]: { ease: float, interval: int, due: str, reps: int } }
  srsData: {},

  // Activity log for heatmap: { [date_str]: sessions }
  activityLog: {},

  // Settings
  theme: 'dark',
  uiLang: 'en',
  ttsEnabled: true,

  // Leaderboard mock data
  leaderboard: generateLeaderboard(),
};

function generateLeaderboard() {
  const names = [
    { name: 'Sakura_99', avatar: '🌸' },
    { name: 'TokyoDrift', avatar: '🏎️' },
    { name: 'NihongoKing', avatar: '👑' },
    { name: 'ArigatouGuy', avatar: '🎌' },
    { name: 'KanjiMaster', avatar: '⛩️' },
    { name: 'Yuki_learns', avatar: '❄️' },
    { name: 'Sensei_Pro', avatar: '🎓' },
    { name: 'MangaFan2k', avatar: '📚' },
    { name: 'OsakaVibes', avatar: '🦌' },
  ];
  return names.map((n, i) => ({
    ...n,
    xp: Math.floor(Math.random() * 800) + 200 - i * 40,
    rank: i + 1,
    isYou: false,
  }));
}

// =====================================================
// STORE CLASS
// =====================================================

class Store {
  constructor() {
    this._state = this._load();
    this._listeners = new Set();
    this._checkStreak();
  }

  _load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_STATE, ...parsed };
      }
    } catch (e) {
      console.warn('Store: failed to load state', e);
    }
    return { ...DEFAULT_STATE };
  }

  _save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this._state));
    } catch (e) {
      console.warn('Store: failed to save state', e);
    }
  }

  _checkStreak() {
    const today = new Date().toDateString();
    const last = this._state.lastStudyDate;
    if (!last) return;

    const lastDate = new Date(last);
    const diffDays = Math.floor((new Date() - lastDate) / (1000 * 60 * 60 * 24));

    if (diffDays > 1) {
      // Streak broken
      this._state.streak = 0;
      this._save();
    }
  }

  subscribe(listener) {
    this._listeners.add(listener);
    return () => this._listeners.delete(listener);
  }

  _notify(changed) {
    this._listeners.forEach(fn => fn(changed, this._state));
  }

  get(key) {
    return key ? this._state[key] : this._state;
  }

  // ===== XP =====
  addXP(amount) {
    this._state.xp += amount;
    this._updateActivityLog();
    this._save();
    this._notify('xp');
    return this._state.xp;
  }

  // ===== HEARTS =====
  loseHeart() {
    if (this._state.hearts > 0) {
      this._state.hearts -= 1;
      this._save();
      this._notify('hearts');
    }
    return this._state.hearts;
  }

  refillHearts() {
    this._state.hearts = this._state.maxHearts;
    this._save();
    this._notify('hearts');
  }

  // ===== GEMS =====
  addGems(amount) {
    this._state.gems += amount;
    this._save();
    this._notify('gems');
  }

  spendGems(amount) {
    if (this._state.gems >= amount) {
      this._state.gems -= amount;
      this._save();
      this._notify('gems');
      return true;
    }
    return false;
  }

  // ===== STREAK =====
  _updateStreak() {
    const today = new Date().toDateString();
    const last  = this._state.lastStudyDate;

    if (!last) {
      this._state.streak = 1;
    } else {
      const lastDate = new Date(last);
      const diffDays = Math.floor((new Date() - lastDate) / (1000 * 60 * 60 * 24));
      if (diffDays === 0) {
        // Same day, no change
      } else if (diffDays === 1) {
        this._state.streak += 1;
      } else {
        this._state.streak = 1;
      }
    }

    this._state.lastStudyDate = new Date().toISOString();
    this._save();
    this._notify('streak');
  }

  // ===== ACTIVITY LOG =====
  _updateActivityLog() {
    const today = new Date().toISOString().split('T')[0];
    this._state.activityLog[today] = (this._state.activityLog[today] || 0) + 1;
  }

  // ===== LESSON PROGRESS =====
  completeLesson(lessonId, xpReward) {
    if (!this._state.lessonProgress[lessonId]) {
      this._state.lessonProgress[lessonId] = {
        completed: true,
        xp: xpReward,
        completedAt: new Date().toISOString(),
      };
      this.addXP(xpReward);
      this.addGems(5);
      this._updateStreak();
    } else {
      // Re-doing lesson gives half XP
      this.addXP(Math.floor(xpReward / 2));
      this._updateStreak();
    }
    this._save();
    this._notify('lessonProgress');
  }

  isLessonCompleted(lessonId) {
    return !!this._state.lessonProgress[lessonId]?.completed;
  }

  getLessonProgress(unitLessons) {
    const completed = unitLessons.filter(l => this.isLessonCompleted(l)).length;
    return { completed, total: unitLessons.length, pct: completed / unitLessons.length };
  }

  // ===== SRS DATA =====
  getSRSCard(vocabId) {
    return this._state.srsData[vocabId] || null;
  }

  updateSRSCard(vocabId, quality) {
    // SM-2 algorithm (0=hard, 1=ok, 2=easy)
    const card = this._state.srsData[vocabId] || {
      ease: 2.5,
      interval: 1,
      reps: 0,
      due: new Date().toISOString(),
    };

    const easeMap = [0, 0.15, 0.3];
    const easeChange = easeMap[quality] ?? 0;

    if (quality === 0) {
      card.interval = 1;
      card.reps = 0;
    } else if (quality === 1) {
      card.interval = Math.max(1, card.interval);
      card.reps += 1;
    } else {
      card.interval = card.reps === 0 ? 1 : card.reps === 1 ? 6 : Math.round(card.interval * card.ease);
      card.reps += 1;
    }

    card.ease = Math.max(1.3, card.ease + easeChange);
    const due = new Date();
    due.setDate(due.getDate() + card.interval);
    card.due = due.toISOString();

    this._state.srsData[vocabId] = card;
    this._save();
  }

  getDueCards() {
    const now = new Date();
    return Object.entries(this._state.srsData)
      .filter(([, c]) => new Date(c.due) <= now)
      .map(([id]) => id);
  }

  // ===== SETTINGS =====
  setTheme(theme) {
    this._state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    this._save();
    this._notify('theme');
  }

  setUILang(lang) {
    this._state.uiLang = lang;
    this._save();
    this._notify('uiLang');
  }

  toggleTTS() {
    this._state.ttsEnabled = !this._state.ttsEnabled;
    this._save();
    this._notify('ttsEnabled');
    return this._state.ttsEnabled;
  }

  // ===== LEADERBOARD =====
  getLeaderboard() {
    const myEntry = {
      name: this._state.username,
      avatar: this._state.avatar,
      xp: this._state.xp,
      isYou: true,
    };
    const board = [...this._state.leaderboard, myEntry]
      .sort((a, b) => b.xp - a.xp)
      .map((p, i) => ({ ...p, rank: i + 1 }));
    return board;
  }

  // ===== HEATMAP =====
  getHeatmapData(weeks = 13) {
    const cells = [];
    const today = new Date();
    const totalDays = weeks * 7;
    for (let i = totalDays - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const sessions = this._state.activityLog[key] || 0;
      cells.push({ date: key, sessions, level: Math.min(4, sessions) });
    }
    return cells;
  }

  // ===== STATS =====
  getStats() {
    return {
      totalXP: this._state.xp,
      streak: this._state.streak,
      lessonsCompleted: Object.keys(this._state.lessonProgress).length,
      wordsLearned: Object.keys(this._state.srsData).length,
      gems: this._state.gems,
      hearts: this._state.hearts,
    };
  }
}

export const store = new Store();
