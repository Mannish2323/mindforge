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
      
      {/* 1. Greeting & Daily Goal Card */}
      <div className="card animate-fadein delay-100 flex-between flex" style={{ gap: 'var(--sp-4)', flexWrap: 'wrap' }}>
        <div>
          <h2 className="text-xl font-black">Konnichiwa, {username}! 👋</h2>
          <p className="text-muted text-sm mt-2">Let's crush today's Japanese learning target.</p>
        </div>
        <div className="flex" style={{ flexDirection: 'column', gap: 'var(--sp-1)', minWidth: '150px' }}>
          <div className="flex-between flex text-xs font-bold">
            <span className="text-gold">DAILY GOAL</span>
            <span>{currentDailyXP} / {dailyGoal} XP</span>
          </div>
          <div className="lesson-progress-bar" style={{ marginBottom: 0, height: '8px' }}>
            <div className="lesson-progress-fill" style={{ width: `${dailyGoalProgress}%`, background: 'var(--primary)' }} />
          </div>
          <span className="text-muted text-xs align-right" style={{ textAlign: 'right' }}>{dailyGoalProgress}% Completed</span>
        </div>
      </div>

      {/* 2. Spaced Repetition Due Alert */}
      {dueReviewsCount > 0 && (
        <div 
          onClick={() => onNavigate('review')}
          className="feedback-panel correct flex-between flex card-interactive"
          style={{ cursor: 'pointer', margin: 0 }}
        >
          <div className="flex" style={{ alignItems: 'center', gap: 'var(--sp-3)' }}>
            <RotateCcw className="loader-sm" style={{ animation: 'spin 4s linear infinite', borderTopColor: 'var(--success)' }} />
            <div>
              <h4 className="font-bold">Reviews Due</h4>
              <p className="text-sm">You have {dueReviewsCount} items waiting to be reviewed. Keep your streak alive!</p>
            </div>
          </div>
          <ArrowRight size={18} />
        </div>
      )}

      {/* 3. Recommended Path / Continue Learning */}
      <div className="continue-card card-interactive animate-fadein delay-200" onClick={onContinueLesson}>
        <div>
          <span className="sr-only">Recommended</span>
          <h3 className="font-black">Continue Your Path</h3>
          <p className="text-sm mt-2">Master greetings, common vocabulary, and grammar rules for JLPT N5.</p>
        </div>
        <button className="btn-primary" style={{ width: 'auto', marginTop: 0, padding: '10px 20px' }}>
          Resume <ArrowRight size={16} style={{ marginLeft: '8px' }} />
        </button>
      </div>

      {/* 4. Stats Grid */}
      <div className="home-grid animate-fadein delay-300">
        
        {/* Streak Flame Card */}
        <div className="streak-card card-interactive" onClick={() => onNavigate('profile')}>
          <span className="streak-flame">🔥</span>
          <div>
            <div className="streak-count">{state.streak}</div>
            <div className="streak-label">DAY STREAK</div>
          </div>
        </div>

        {/* XP Summary Card */}
        <div className="card card-interactive flex" style={{ flexDirection: 'column', justifyContent: 'center', gap: 'var(--sp-1)' }} onClick={() => onNavigate('analytics')}>
          <div className="flex" style={{ alignItems: 'center', gap: 'var(--sp-2)' }}>
            <Trophy size={18} className="text-gold" />
            <span className="text-xs text-muted font-bold">TOTAL XP</span>
          </div>
          <p className="text-2xl font-black text-gold numeric">{state.xp || 0}</p>
          <span className="text-xs text-muted">Level {Math.floor((state.xp || 0) / 100) + 1}</span>
        </div>

        {/* Spaced Repetition Due Card */}
        <div className="card card-interactive flex" style={{ flexDirection: 'column', justifyContent: 'center', gap: 'var(--sp-1)' }} onClick={() => onNavigate('review')}>
          <div className="flex" style={{ alignItems: 'center', gap: 'var(--sp-2)' }}>
            <RotateCcw size={18} className="text-green" />
            <span className="text-xs text-muted font-bold">DUE REVIEWS</span>
          </div>
          <p className="text-2xl font-black text-green numeric">{dueReviewsCount}</p>
          <span className="text-xs text-muted">Active queue</span>
        </div>

        {/* JLPT Countdown Card */}
        <div className="card card-interactive flex" style={{ flexDirection: 'column', justifyContent: 'center', gap: 'var(--sp-1)' }} onClick={() => onNavigate('jlpt')}>
          <div className="flex" style={{ alignItems: 'center', gap: 'var(--sp-2)' }}>
            <Trophy size={18} style={{ color: 'var(--accent-ai)' }} />
            <span className="text-xs text-muted font-bold">JLPT COUNTDOWN</span>
          </div>
          <p className="text-2xl font-black numeric" style={{ color: 'var(--accent-ai)' }}>{diffDays}</p>
          <span className="text-xs text-muted">Days to Dec Exam</span>
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
