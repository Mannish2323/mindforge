'use client';

import React, { useMemo } from 'react';
import {
  BookOpen, RotateCcw, Trophy, Sparkles, Mic, Flame, Shield, MessageSquare,
  BookOpenText, Zap, Target, ChevronRight, PenLine, Medal, Star
} from 'lucide-react';

interface HomeDashboardProps {
  state: any;
  profile?: any;
  user?: any;
  onNavigate: (tab: any, subView?: any) => void;
  onContinueLesson: () => void;
  onActivateShield: () => void;
}

const WORD_OF_DAY = [
  { kanji: '勉強', romaji: 'benkyou', meaning: 'Study / Learning', level: 'N5' },
  { kanji: '友達', romaji: 'tomodachi', meaning: 'Friend', level: 'N5' },
  { kanji: '電車', romaji: 'densha', meaning: 'Train', level: 'N5' },
  { kanji: '図書館', romaji: 'toshokan', meaning: 'Library', level: 'N4' },
  { kanji: '挑戦', romaji: 'chousen', meaning: 'Challenge', level: 'N3' },
];

export function HomeDashboard({ state, profile, user, onNavigate, onContinueLesson, onActivateShield }: HomeDashboardProps) {
  if (!state) {
    return (
      <div className="animate-fadein flex" style={{ flexDirection: 'column', gap: 'var(--sp-4)', padding: 'var(--sp-4)' }}>
        {[100, 140, 110, 80, 120].map((h, i) => (
          <div key={i} className="skeleton skeleton-card" style={{ height: `${h}px` }} />
        ))}
      </div>
    );
  }

  const dueReviewsCount = Object.values(state.srsData || {}).filter(
    (c: any) => new Date(c.dueDate) <= new Date()
  ).length;

  const weeklyXpData: number[] = useMemo(() => {
    const xpArray = [0, 0, 0, 0, 0, 0, 0]; // Mon, Tue, Wed, Thu, Fri, Sat, Sun
    const today = new Date();
    
    // Get ISO date string (YYYY-MM-DD) in local time
    const getLocalDateString = (date: Date) => {
      const offset = date.getTimezoneOffset();
      const local = new Date(date.getTime() - (offset * 60 * 1000));
      return local.toISOString().split('T')[0];
    };

    const currentDay = today.getDay(); // 0 is Sunday, 1 is Monday, etc.
    const distanceToMonday = currentDay === 0 ? 6 : currentDay - 1;
    const monday = new Date(today);
    monday.setDate(today.getDate() - distanceToMonday);
    monday.setHours(0, 0, 0, 0);

    const thisWeekDays: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      thisWeekDays.push(getLocalDateString(d));
    }

    // Lessons XP
    const lprog = state?.lessonProgress || {};
    Object.values(lprog).forEach((l: any) => {
      if (l.completed && l.completedAt) {
        const compDate = new Date(l.completedAt);
        const dStr = getLocalDateString(compDate);
        const idx = thisWeekDays.indexOf(dStr);
        if (idx !== -1) {
          xpArray[idx] += (l.xp || 15);
        }
      }
    });

    // Stories XP
    const stories = state?.stories || [];
    stories.forEach((s: any) => {
      if (s.completed && s.completedAt) {
        const compDate = new Date(s.completedAt);
        const dStr = getLocalDateString(compDate);
        const idx = thisWeekDays.indexOf(dStr);
        if (idx !== -1) {
          xpArray[idx] += (s.xp_reward || 30);
        }
      }
    });

    return xpArray;
  }, [state?.lessonProgress, state?.stories]);

  const goalXp = state.goalXp || 50;
  const dailyGoalProgress = Math.min(100, Math.round(((state.xp % goalXp) / goalXp) * 100));
  const currentDailyXP = state.xp % goalXp;
  const username = state.username || profile?.name || 'Learner';
  const isNewUser = (state.xp || 0) === 0;
  const todayStudied = dailyGoalProgress > 0;
  const streak = state.streak || 0;
  const unlockedBadges = (state.badges || []).filter((b: any) => b.unlockedAt !== null);
  const wordIdx = new Date().getDate() % WORD_OF_DAY.length;
  const wordOfDay = WORD_OF_DAY[wordIdx];
  const weeklyTotal = weeklyXpData.reduce((a, b) => a + b, 0);

  // Missions
  const missions = useMemo(() => [
    {
      id: 'lesson', label: 'Complete 1 Lesson', icon: '📖',
      done: Object.values(state.lessonProgress || {}).some((l: any) => {
        const ts = l.completedAt;
        return ts && new Date(ts).toDateString() === new Date().toDateString();
      }),
      xp: 20,
    },
    {
      id: 'review', label: 'Do 5 Reviews', icon: '🔁',
      done: false, xp: 15,
    },
    {
      id: 'speak', label: 'Speak 1 Session', icon: '🎤',
      done: false, xp: 25,
    },
  ], [state]);

  const completedMissions = missions.filter(m => m.done).length;

  return (
    <div className="animate-fadein" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>

      {/* ── 1. Daily Streak Login Card (FIRST) ── */}
      <div
        className="card card-interactive animate-fadein"
        onClick={() => onNavigate('profile')}
        style={{
          background: streak > 0
            ? 'linear-gradient(135deg, rgba(245,158,11,0.18) 0%, rgba(239,68,68,0.10) 100%)'
            : 'linear-gradient(135deg, var(--surface-2), var(--surface-3))',
          border: streak > 0 ? '1px solid rgba(245,158,11,0.3)' : '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: 'var(--sp-4) var(--sp-5)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
          <span style={{
            fontSize: '36px',
            display: 'inline-block',
            animation: streak > 0 ? 'flame-rise 2.4s ease-in-out infinite' : 'none',
          }}>🔥</span>
          <div>
            <h3 style={{ fontWeight: 900, fontSize: 'var(--text-lg)', color: streak > 0 ? 'var(--xp-gold)' : 'var(--text)' }}>
              {streak > 0 ? `${streak} Day Streak!` : 'Start Your Streak'}
            </h3>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-2)', marginTop: '2px' }}>
              {todayStudied
                ? '✅ You studied today — streak protected!'
                : streak > 0
                ? '⚠️ Study today to protect your streak!'
                : 'Complete a lesson or review to begin your streak.'}
            </p>
          </div>
        </div>
        {!todayStudied && (
          <button
            className="btn-primary"
            onClick={e => { e.stopPropagation(); onContinueLesson(); }}
            style={{ whiteSpace: 'nowrap', width: 'auto', padding: '8px 16px', fontSize: 'var(--text-xs)' }}
          >
            Study Now
          </button>
        )}
        {todayStudied && (
          <span style={{ fontSize: '24px' }}>✅</span>
        )}
      </div>

      {/* ── ZERO STATE — new users only ── */}
      {isNewUser && (
        <div className="card animate-fadein" style={{
          background: 'var(--grad-hero)', border: '1px solid rgba(22,163,74,0.2)',
          padding: 'var(--sp-5)'
        }}>
          <h2 style={{ fontWeight: 900, fontSize: 'var(--text-xl)', marginBottom: 'var(--sp-2)' }}>
            🌿 Welcome to Velmorth!
          </h2>
          <p style={{ color: 'var(--text-2)', fontSize: 'var(--text-sm)', marginBottom: 'var(--sp-4)', lineHeight: 1.6 }}>
            Start your Japanese journey. Complete your first lesson to earn XP and begin your streak!
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--sp-2)' }}>
            {[
              { icon: '📖', label: 'First Lesson', action: onContinueLesson },
              { icon: 'あ', label: 'Script Lab', action: () => onNavigate('script') },
              { icon: '🎯', label: 'JLPT Path', action: () => onNavigate('jlpt') },
            ].map(item => (
              <button key={item.label}
                onClick={item.action}
                className="card card-interactive"
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', padding: 'var(--sp-3)', border: '1px solid var(--border)', background: 'var(--surface)', cursor: 'pointer' }}>
                <span style={{ fontSize: '24px', fontFamily: 'var(--font-ja)' }}>{item.icon}</span>
                <span style={{ fontSize: '11px', fontWeight: 600 }}>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── 2. Continue Learning Card ── */}
      <div
        className="continue-card card-interactive animate-fadein"
        onClick={onContinueLesson}
        style={{ cursor: 'pointer' }}
      >
        <div>
          <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {isNewUser ? 'Get Started' : 'Recommended Lesson'}
          </span>
          <h3 style={{ fontWeight: 900, marginTop: '4px', fontSize: 'var(--text-lg)' }}>
            {isNewUser ? 'Begin Learning Japanese' : 'Continue Learning'}
          </h3>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-2)', marginTop: '6px' }}>
            {isNewUser ? 'Dive into Unit 1 — Greetings & Basics' : 'Pick up where you left off & earn XP'}
          </p>
        </div>
        <span className="continue-badge">📖</span>
      </div>

      {/* ── 3. Daily Goal Card ── */}
      <div className="card animate-fadein" style={{ padding: 'var(--sp-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--sp-3)' }}>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Daily Goal</span>
            <h4 style={{ fontWeight: 800, marginTop: '2px' }}>{currentDailyXP} / {goalXp} XP</h4>
          </div>
          <div style={{ position: 'relative', width: '52px', height: '52px' }}>
            <svg width="52" height="52" viewBox="0 0 52 52" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="26" cy="26" r="20" fill="none" stroke="var(--surface-3)" strokeWidth="5" />
              <circle cx="26" cy="26" r="20" fill="none"
                stroke={dailyGoalProgress >= 100 ? 'var(--success)' : 'var(--primary)'}
                strokeWidth="5"
                strokeDasharray={`${(dailyGoalProgress / 100) * 125.6} 125.6`}
                strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 0.6s ease' }} />
            </svg>
            <span style={{
              position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', fontWeight: 800, color: 'var(--primary)'
            }}>{dailyGoalProgress}%</span>
          </div>
        </div>
        <div style={{ height: '6px', background: 'var(--surface-3)', borderRadius: 'var(--radius-pill)', overflow: 'hidden' }}>
          <div style={{ width: `${dailyGoalProgress}%`, height: '100%', background: 'var(--grad-primary)', transition: 'width 0.5s ease', borderRadius: 'var(--radius-pill)' }} />
        </div>
      </div>

      {/* ── 4. Due Review Alert ── */}
      {dueReviewsCount > 0 && (
        <div
          className="card card-interactive animate-fadein"
          onClick={() => onNavigate('review')}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgba(34,197,94,0.25)', background: 'rgba(34,197,94,0.04)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius)', background: 'rgba(34,197,94,0.15)', display: 'grid', placeItems: 'center' }}>
              <RotateCcw size={18} style={{ color: 'var(--success)' }} />
            </div>
            <div>
              <h4 style={{ fontWeight: 800, color: 'var(--success)' }}>
                {dueReviewsCount} Card{dueReviewsCount !== 1 ? 's' : ''} Due for Review
              </h4>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-2)', marginTop: '2px' }}>
                Keep your memory fresh — review now!
              </p>
            </div>
          </div>
          <button
            className="btn-primary"
            onClick={e => { e.stopPropagation(); onNavigate('review'); }}
            style={{ width: 'auto', padding: '8px 14px', fontSize: 'var(--text-xs)', background: 'var(--success)', whiteSpace: 'nowrap' }}
          >
            Start Review
          </button>
        </div>
      )}

      {/* ── 5. Quick Actions Row ── */}
      <div>
        <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 800, marginBottom: 'var(--sp-3)', color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quick Actions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--sp-2)' }}>
          {[
            { icon: <PenLine size={20} style={{ color: 'var(--primary)' }} />, label: 'Script', bg: 'rgba(22,163,74,0.12)', action: () => onNavigate('script') },
            { icon: <Mic size={20} style={{ color: 'var(--accent-ai)' }} />, label: 'Speak', bg: 'rgba(14,165,233,0.12)', action: () => onNavigate('speak') },
            { icon: <RotateCcw size={20} style={{ color: 'var(--gem)' }} />, label: 'Review', bg: 'rgba(139,92,246,0.12)', action: () => onNavigate('review') },
            { icon: <Medal size={20} style={{ color: 'var(--xp-gold)' }} />, label: 'JLPT', bg: 'rgba(251,191,36,0.12)', action: () => onNavigate('jlpt') },
          ].map(item => (
            <button
              key={item.label}
              onClick={item.action}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                padding: 'var(--sp-3) var(--sp-2)', borderRadius: 'var(--radius-lg)',
                background: item.bg, border: '1px solid var(--border)',
                cursor: 'pointer', color: 'var(--text)', transition: 'transform var(--t-fast)',
              }}
              className="card-interactive"
            >
              {item.icon}
              <span style={{ fontSize: '11px', fontWeight: 700 }}>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── 6. Recent Badges Card ── */}
      {unlockedBadges.length > 0 && (
        <div
          className="card card-interactive animate-fadein"
          onClick={() => onNavigate('profile', 'badges')}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recent Badges</span>
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              {unlockedBadges.slice(-3).map((b: any) => (
                <span key={b.badge_id} style={{ fontSize: '24px' }}>{b.icon}</span>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
            View All <ChevronRight size={14} />
          </div>
        </div>
      )}

      {/* ── 7. Daily Missions Card ── */}
      <div className="card animate-fadein" style={{ padding: 'var(--sp-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--sp-3)' }}>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Daily Missions</span>
            <h4 style={{ fontWeight: 800, marginTop: '2px' }}>{completedMissions} / {missions.length} Done</h4>
          </div>
          <span style={{ fontSize: '18px' }}>🎯</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
          {missions.map(mission => (
            <div key={mission.id} style={{
              display: 'flex', alignItems: 'center', gap: 'var(--sp-3)',
              padding: 'var(--sp-2) var(--sp-3)',
              background: mission.done ? 'rgba(34,197,94,0.08)' : 'var(--surface-2)',
              borderRadius: 'var(--radius)',
              border: mission.done ? '1px solid rgba(34,197,94,0.2)' : '1px solid transparent',
              opacity: mission.done ? 0.7 : 1,
            }}>
              <span style={{ fontSize: '18px' }}>{mission.icon}</span>
              <span style={{ flex: 1, fontSize: 'var(--text-sm)', fontWeight: 600, textDecoration: mission.done ? 'line-through' : 'none', color: mission.done ? 'var(--text-3)' : 'var(--text)' }}>
                {mission.label}
              </span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--xp-gold)' }}>+{mission.xp} XP</span>
              {mission.done && <span style={{ fontSize: '14px' }}>✅</span>}
            </div>
          ))}
        </div>
      </div>



      {/* ── 9. Focus of the Day Card ── */}
      <div className="card animate-fadein" style={{ padding: 'var(--sp-5)', background: 'linear-gradient(135deg, rgba(139,92,246,0.10), rgba(14,165,233,0.08))' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--sp-3)' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Focus of the Day</span>
          <span style={{ fontSize: '11px', background: 'var(--surface-3)', color: 'var(--text-3)', padding: '2px 8px', borderRadius: 'var(--radius-pill)', fontWeight: 600 }}>{wordOfDay.level}</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-ja)', fontSize: '52px', fontWeight: 900, marginBottom: '4px', color: 'var(--text)' }}>
            {wordOfDay.kanji}
          </div>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-2)', fontWeight: 600 }}>{wordOfDay.romaji}</div>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-3)', marginTop: '4px' }}>{wordOfDay.meaning}</div>
        </div>
      </div>

      {/* ── League Snapshot ── */}
      <div className="card card-interactive animate-fadein" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} onClick={() => onNavigate('leaderboard')}>
        <div>
          <span style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>League Status</span>
          <p style={{ fontWeight: 800, marginTop: '4px' }}>
            {state.leagueTier ? state.leagueTier.toUpperCase() : 'BRONZE'} LEAGUE · <span style={{ color: 'var(--xp-gold)' }}>{state.weeklyXP || 0} XP</span> this week
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
          Leaderboard <ChevronRight size={14} />
        </div>
      </div>

    </div>
  );
}
