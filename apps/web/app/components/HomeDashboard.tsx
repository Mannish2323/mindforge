'use client';

import React from 'react';
import { BookOpen, RotateCcw, Trophy, Sparkles, Mic, Flame, Shield, ArrowRight, MessageSquare, BookOpenText } from 'lucide-react';

interface HomeDashboardProps {
  state: any;
  onNavigate: (tab: any, subView?: any) => void;
  onContinueLesson: () => void;
  onActivateShield: () => void;
}

export function HomeDashboard({ state, onNavigate, onContinueLesson, onActivateShield }: HomeDashboardProps) {
  // If state is not loaded yet, show premium skeleton loaders
  if (!state) {
    return (
      <div className="flex flex-col gap-4 animate-fadein" style={{ padding: 'var(--sp-4)' }}>
        <div className="skeleton skeleton-card" style={{ height: '100px' }} />
        <div className="skeleton skeleton-card" style={{ height: '140px' }} />
        <div className="grid gap-3" style={{ gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-3)' }}>
          <div className="skeleton skeleton-card" style={{ height: '110px' }} />
          <div className="skeleton skeleton-card" style={{ height: '110px' }} />
        </div>
        <div className="skeleton skeleton-card" style={{ height: '80px' }} />
      </div>
    );
  }

  const dueReviewsCount = Object.values(state.srsData || {}).filter((c: any) => {
    return new Date(c.dueDate) <= new Date();
  }).length;

  const weakScriptsCount = Object.values(state.srsData || {}).filter((c: any) => {
    return (c.errorCount || 0) > 1 || c.ease < 1.8;
  }).length;

  // Simple countdown to JLPT (e.g. December 6, 2026)
  const jlptDate = new Date('2026-12-06T00:00:00');
  const today = new Date();
  const diffTime = Math.max(0, jlptDate.getTime() - today.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Daily goal XP calculation (50 XP target)
  const dailyGoal = 50;
  const currentDailyXP = state.xp % dailyGoal;
  const dailyGoalProgress = Math.min(100, Math.round((currentDailyXP / dailyGoal) * 100));

  const username = state.username || 'Learner';

  return (
    <div className="animate-fadein flex" style={{ flexDirection: 'column', gap: 'var(--sp-4)' }}>
      
      {/* 1. Greeting / Welcome Back Card */}
      <div className="card animate-fadein delay-100 flex-between flex" style={{ gap: 'var(--sp-4)', flexWrap: 'wrap', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(139, 92, 246, 0.04))', border: '1px solid var(--border)' }}>
        <div>
          <h2 className="text-xl font-black">👋 Welcome Back, {username}!</h2>
          <p className="text-muted text-sm mt-2">Level {Math.floor((state.xp || 0) / 100) + 1} • {state.xp || 0} XP total</p>
        </div>
        <div className="flex" style={{ flexDirection: 'column', gap: 'var(--sp-1)', minWidth: '150px' }}>
          <div className="flex-between flex text-xs font-bold">
            <span className="text-gold">DAILY GOAL</span>
            <span>{currentDailyXP} / {dailyGoal} XP</span>
          </div>
          <div className="lesson-progress-bar" style={{ marginBottom: 0, height: '8px' }}>
            <div className="lesson-progress-fill" style={{ width: `${dailyGoalProgress}%`, background: 'var(--primary)' }} />
          </div>
          <span className="text-muted text-xs" style={{ textAlign: 'right' }}>{dailyGoalProgress}% Completed</span>
        </div>
      </div>

      {/* 2. Fixed Streak Card near top */}
      <div className="streak-card animate-fadein delay-100 card-interactive" onClick={() => onNavigate('profile')}>
        <span className="streak-flame">🔥</span>
        <div>
          <h3 className="font-black text-lg" style={{ color: 'var(--xp-gold)' }}>{state.streak} Day Streak</h3>
          <p className="text-xs text-muted">Keep learning every day to protect your streak!</p>
        </div>
      </div>

      {/* 3. Continue Learning / Recommended Path Card */}
      <div className="continue-card card-interactive animate-fadein delay-200" onClick={onContinueLesson}>
        <div>
          <span className="text-xs font-bold text-green uppercase tracking-wider">Recommended Lesson</span>
          <h3 className="font-black mt-1">Continue Learning</h3>
          <p className="text-sm text-muted mt-2">Unit 3 Lesson 5 • Master grammar patterns & expressions</p>
        </div>
        <button className="btn-primary" style={{ width: 'auto', marginTop: 0, padding: '12px 24px', boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)' }}>
          Resume <ArrowRight size={16} style={{ marginLeft: '8px' }} />
        </button>
      </div>

      {/* 4. Due Reviews Alert Card */}
      {dueReviewsCount > 0 && (
        <div 
          onClick={() => onNavigate('review')}
          className="card card-interactive animate-fadein delay-200 flex-between flex"
          style={{ cursor: 'pointer', border: '1px solid rgba(34, 197, 94, 0.3)', background: 'rgba(34, 197, 94, 0.05)' }}
        >
          <div className="flex" style={{ alignItems: 'center', gap: 'var(--sp-3)' }}>
            <RotateCcw className="loader-sm" style={{ animation: 'spin 6s linear infinite', borderTopColor: 'var(--success)', borderLeftColor: 'transparent', borderBottomColor: 'transparent', borderRightColor: 'transparent' }} />
            <div>
              <h4 className="font-bold text-green">Due Reviews: {dueReviewsCount}</h4>
              <p className="text-xs text-muted mt-1">Keep your memory fresh by practicing today's review list.</p>
            </div>
          </div>
          <button className="btn-primary" style={{ width: 'auto', marginTop: 0, padding: '8px 16px', background: 'var(--success)' }}>
            Start Review
          </button>
        </div>
      )}

      {/* 5. Weekly Progress Card */}
      <div className="card animate-fadein delay-300 flex" style={{ flexDirection: 'column', gap: 'var(--sp-3)' }}>
        <h4 className="font-bold text-sm">Weekly Progress</h4>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-between', alignItems: 'flex-end', height: '80px', padding: 'var(--sp-2) 0' }}>
          {[12, 24, 0, 45, 10, 50, 15].map((xp, index) => {
            const pct = Math.min(100, (xp / 50) * 100);
            const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            return (
              <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, height: '100%', justifyContent: 'flex-end', gap: 'var(--sp-1)' }}>
                <div style={{ width: '100%', height: `${pct || 8}%`, background: xp >= 50 ? 'var(--success)' : xp > 0 ? 'var(--primary)' : 'var(--surface-3)', borderRadius: 'var(--radius-xs)' }} title={`${xp} XP`} />
                <span style={{ fontSize: '10px', color: 'var(--text-3)' }}>{days[index]}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Today's Focus / Micro Modes Grid */}
      <h3 className="text-lg font-bold mt-2">Today's Focus Areas</h3>
      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--sp-3)' }}>
        
        {/* Script Lab */}
        <div className="card card-interactive flex" style={{ flexDirection: 'column', gap: 'var(--sp-2)' }} onClick={() => onNavigate('script')}>
          <div className="flex-between flex">
            <Sparkles size={20} className="text-green" />
            <span className="text-xs text-muted font-bold">PRACTICE KANA</span>
          </div>
          <h4 className="font-bold">Script Lab</h4>
          <p className="text-xs text-muted">
            {weakScriptsCount > 0 ? `Review your ${weakScriptsCount} weak hiragana/katakana.` : 'Master hiragana & katakana writing strokes.'}
          </p>
        </div>

        {/* AI Roleplay */}
        <div className="card card-interactive flex" style={{ flexDirection: 'column', gap: 'var(--sp-2)' }} onClick={() => onNavigate('speak')}>
          <div className="flex-between flex">
            <Mic size={20} style={{ color: 'var(--accent-ai)' }} />
            <span className="text-xs text-muted font-bold">SPEAKING</span>
          </div>
          <h4 className="font-bold">AI Speak Roleplay</h4>
          <p className="text-xs text-muted">Practice speaking in real-world scenarios with live voice evaluation.</p>
        </div>

        {/* AI Chat */}
        <div className="card card-interactive flex" style={{ flexDirection: 'column', gap: 'var(--sp-2)' }} onClick={() => onNavigate('social', 'ai-chat')}>
          <div className="flex-between flex">
            <MessageSquare size={20} className="text-gold" />
            <span className="text-xs text-muted font-bold">AI TUTOR</span>
          </div>
          <h4 className="font-bold">Gemini Chat AI</h4>
          <p className="text-xs text-muted">Engage in natural conversations and ask for Japanese grammar help.</p>
        </div>

        {/* Stories */}
        <div className="card card-interactive flex" style={{ flexDirection: 'column', gap: 'var(--sp-2)' }} onClick={() => onNavigate('social', 'stories')}>
          <div className="flex-between flex">
            <BookOpenText size={20} style={{ color: 'var(--gem)' }} />
            <span className="text-xs text-muted font-bold">READING</span>
          </div>
          <h4 className="font-bold">Manga & Stories</h4>
          <p className="text-xs text-muted">Read interactive short stories and boost reading comprehension.</p>
        </div>

      </div>

      {/* 6. League & Social Snapshot */}
      <div className="card flex-between flex animate-fadein delay-400">
        <div>
          <span className="text-xs text-muted font-bold">LEAGUE STATUS</span>
          <p className="font-bold mt-1">
            {state.leagueTier ? state.leagueTier.toUpperCase() : 'BRONZE'} LEAGUE • Weekly: <span className="text-gold">{state.weeklyXP || 0} XP</span>
          </p>
        </div>
        <button 
          onClick={() => onNavigate('leaderboard')}
          className="btn-ghost"
          style={{ padding: '8px 16px', borderRadius: 'var(--radius-pill)' }}
        >
          View Leaderboard →
        </button>
      </div>

    </div>
  );
}
