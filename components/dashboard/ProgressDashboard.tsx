'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useDashboard } from '@/hooks/useDashboard';
import { useAchievements, Badge } from '@/hooks/useAchievements';
import { useAuth } from '../../app/context/AuthContext';

// ================================================================
// Progress Dashboard — Full analytics view
// ================================================================

const JLPT_LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'] as const;
const RARITY_COLORS = {
  common: '#6b7280',
  rare: '#3b82f6',
  epic: '#8b5cf6',
  legendary: '#f59e0b',
};

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

const stagger: Variants = {
  visible: { transition: { staggerChildren: 0.07 } },
};

export function ProgressDashboard() {
  const { data, isLoading, refresh } = useDashboard();
  const { getAllBadges } = useAchievements();
  const { profile } = useAuth();
  const [badges, setBadges] = useState<Array<Badge & { earned: boolean }>>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'jlpt' | 'vocab' | 'achievements'>('overview');

  useEffect(() => {
    getAllBadges().then(setBadges);
  }, []);

  if (isLoading) {
    return (
      <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton" style={{ height: '100px', borderRadius: '16px', animationDelay: `${i * 80}ms` }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '16px', maxWidth: '600px', margin: '0 auto' }}>
      <motion.div initial="hidden" animate="visible" variants={stagger}>

        {/* Header */}
        <motion.div variants={fadeIn} style={{ marginBottom: '20px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text)', margin: 0 }}>
            My Progress
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '4px 0 0' }}>
            {profile?.name || 'Learner'} · Level {data.level}
          </p>
        </motion.div>

        {/* Tab Switcher */}
        <motion.div variants={fadeIn} style={{
          display: 'flex', background: 'var(--card-bg, #1a1a2e)', borderRadius: '12px',
          padding: '4px', gap: '4px', marginBottom: '20px',
        }}>
          {(['overview', 'jlpt', 'vocab', 'achievements'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1, padding: '8px 4px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                fontSize: '12px', fontWeight: 700, textTransform: 'capitalize',
                background: activeTab === tab ? 'var(--primary, #ff9800)' : 'transparent',
                color: activeTab === tab ? '#000' : 'var(--text-secondary)',
                transition: 'all 150ms ease',
              }}
            >
              {tab}
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <OverviewTab key="overview" data={data} />
          )}
          {activeTab === 'jlpt' && (
            <JLPTTab key="jlpt" data={data} />
          )}
          {activeTab === 'vocab' && (
            <VocabTab key="vocab" data={data} />
          )}
          {activeTab === 'achievements' && (
            <AchievementsTab key="achievements" badges={badges} earned={data.badgesEarned} />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Overview Tab
// ──────────────────────────────────────────────
function OverviewTab({ data }: { data: ReturnType<typeof useDashboard>['data'] }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
    >
      {/* XP + Level Card */}
      <GlassCard>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '12px', margin: 0 }}>TOTAL XP</p>
            <p style={{ fontSize: '32px', fontWeight: 900, color: 'var(--primary, #ff9800)', margin: '2px 0' }}>
              {data.xpTotal.toLocaleString()}
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '12px', margin: 0 }}>
              +{data.xpToday} today
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              background: 'var(--primary, #ff9800)', borderRadius: '12px', padding: '8px 16px',
              color: '#000', fontWeight: 900, fontSize: '18px',
            }}>
              Lv.{data.level}
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '11px', margin: '6px 0 0' }}>
              {data.xpInLevel} / {data.xpForNext} XP
            </p>
          </div>
        </div>
        {/* Level progress bar */}
        <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '99px', height: '8px', overflow: 'hidden' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.round(data.levelProgress * 100)}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
            style={{ height: '100%', background: 'linear-gradient(90deg, #ff9800, #ff5722)', borderRadius: '99px' }}
          />
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '11px', marginTop: '6px' }}>
          {data.xpForNext - data.xpInLevel} XP to level {data.level + 1}
        </p>
      </GlassCard>

      {/* Streak Card */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <GlassCard>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '36px', marginBottom: '4px' }}>🔥</div>
            <div style={{ fontSize: '28px', fontWeight: 900, color: '#ff6b35' }}>{data.streak}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>day streak</div>
          </div>
        </GlassCard>
        <GlassCard>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '36px', marginBottom: '4px' }}>🏆</div>
            <div style={{ fontSize: '28px', fontWeight: 900, color: '#f59e0b' }}>{data.longestStreak}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>longest streak</div>
          </div>
        </GlassCard>
      </div>

      {/* Stats Grid */}
      <GlassCard>
        <h3 style={{ margin: '0 0 14px', fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>
          Learning Stats
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          {[
            { label: 'Lessons Done', value: data.lessonsDone, icon: '📚' },
            { label: 'Words Learned', value: data.wordsLearned, icon: '🈶' },
            { label: 'Kanji Learned', value: data.kanjiLearned, icon: '✒️' },
            { label: 'Grammar Done', value: data.grammarLearned, icon: '📝' },
            { label: 'Reviews Done', value: data.reviewsDone, icon: '🎴' },
            { label: 'Badges Earned', value: data.badgesEarned, icon: '🏅' },
          ].map(({ label, value, icon }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '20px' }}>{icon}</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: '18px', color: 'var(--text)' }}>{value.toLocaleString()}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>{label}</div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Overall Completion */}
      <GlassCard>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>
            Overall Completion
          </h3>
          <span style={{ fontSize: '18px', fontWeight: 900, color: 'var(--primary, #ff9800)' }}>
            {data.completionPercentage}%
          </span>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '99px', height: '10px', overflow: 'hidden' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${data.completionPercentage}%` }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
            style={{
              height: '100%',
              background: `linear-gradient(90deg, #4ade80, #22d3ee)`,
              borderRadius: '99px',
            }}
          />
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '11px', marginTop: '6px' }}>
          Based on lessons + vocabulary coverage
        </p>
      </GlassCard>

      {/* Weak Areas */}
      {data.weakAreas.length > 0 && (
        <GlassCard>
          <h3 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 700, color: '#f87171' }}>
            ⚠️ Weak Areas
          </h3>
          {data.weakAreas.map((area, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '8px 0', borderBottom: i < data.weakAreas.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
            }}>
              <span style={{ color: 'var(--text)', fontSize: '13px' }}>{area.grammar_id.replace(/_/g, ' ')}</span>
              <span style={{
                background: area.last_score < 40 ? '#ef4444' : '#f59e0b',
                color: '#fff', borderRadius: '8px', padding: '2px 8px', fontSize: '12px', fontWeight: 700,
              }}>
                {area.last_score}%
              </span>
            </div>
          ))}
        </GlassCard>
      )}

      {/* Activity Heatmap */}
      {data.heatmap.length > 0 && (
        <GlassCard>
          <h3 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>
            Activity (Last 90 Days)
          </h3>
          <HeatmapGrid data={data.heatmap} />
        </GlassCard>
      )}
    </motion.div>
  );
}

// ──────────────────────────────────────────────
// JLPT Tab
// ──────────────────────────────────────────────
function JLPTTab({ data }: { data: ReturnType<typeof useDashboard>['data'] }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
    >
      <GlassCard>
        <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 800, color: 'var(--text)' }}>
          JLPT Readiness
        </h3>
        <p style={{ margin: '0 0 20px', fontSize: '13px', color: 'var(--text-secondary)' }}>
          Based on questions answered correctly per level
        </p>
        {JLPT_LEVELS.map(level => {
          const pct = (data.jlptReadiness as Record<string, number>)[level] ?? 0;
          const color = pct >= 80 ? '#4ade80' : pct >= 50 ? '#facc15' : pct >= 20 ? '#fb923c' : '#6b7280';
          const label = pct >= 80 ? 'Exam Ready' : pct >= 50 ? 'Good' : pct >= 20 ? 'Learning' : 'Not Started';
          return (
            <div key={level} style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    background: color, color: '#000', borderRadius: '6px', padding: '2px 8px',
                    fontSize: '12px', fontWeight: 800,
                  }}>{level}</span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{label}</span>
                </div>
                <span style={{ fontWeight: 800, color, fontSize: '14px' }}>{pct}%</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '99px', height: '8px', overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1, ease: 'easeOut', delay: JLPT_LEVELS.indexOf(level) * 0.1 }}
                  style={{ height: '100%', background: color, borderRadius: '99px' }}
                />
              </div>
            </div>
          );
        })}
      </GlassCard>

      {/* Exam Readiness Summary */}
      <GlassCard>
        <h3 style={{ margin: '0 0 14px', fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>
          📊 Estimated Exam Readiness
        </h3>
        {JLPT_LEVELS.map(level => {
          const pct = (data.jlptReadiness as Record<string, number>)[level] ?? 0;
          const ready = pct >= 75;
          return (
            <div key={level} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '10px 0', borderBottom: level !== 'N1' ? '1px solid rgba(255,255,255,0.06)' : 'none',
            }}>
              <span style={{ fontSize: '20px' }}>{ready ? '✅' : pct > 0 ? '⏳' : '🔒'}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: '14px' }}>JLPT {level}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                  {ready ? 'Ready to attempt!' : pct > 0 ? `${100 - pct}% more practice needed` : 'Not started yet'}
                </div>
              </div>
              <span style={{ fontWeight: 800, color: ready ? '#4ade80' : 'var(--text-secondary)', fontSize: '14px' }}>
                {pct}%
              </span>
            </div>
          );
        })}
      </GlassCard>
    </motion.div>
  );
}

// ──────────────────────────────────────────────
// Vocab Tab
// ──────────────────────────────────────────────
function VocabTab({ data }: { data: ReturnType<typeof useDashboard>['data'] }) {
  const { total, new: newW, learning, learned, mastered, difficult, bookmarked } = data.vocabStats;
  const segments = [
    { key: 'mastered', label: 'Mastered', color: '#4ade80', value: mastered },
    { key: 'learned', label: 'Learned', color: '#22d3ee', value: learned },
    { key: 'learning', label: 'Learning', color: '#facc15', value: learning },
    { key: 'difficult', label: 'Difficult', color: '#f87171', value: difficult },
    { key: 'new', label: 'New', color: '#6b7280', value: newW },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
    >
      <GlassCard>
        <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 800, color: 'var(--text)' }}>
          Vocabulary Progress
        </h3>
        <p style={{ margin: '0 0 20px', fontSize: '13px', color: 'var(--text-secondary)' }}>
          {total} total words tracked
        </p>

        {/* Progress bar breakdown */}
        <div style={{ display: 'flex', height: '16px', borderRadius: '99px', overflow: 'hidden', marginBottom: '16px' }}>
          {segments.map(seg => (
            total > 0 && (
              <motion.div
                key={seg.key}
                initial={{ flexBasis: 0 }}
                animate={{ flexBasis: `${(seg.value / total) * 100}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{ background: seg.color, flexShrink: 0, minWidth: seg.value > 0 ? '4px' : '0' }}
              />
            )
          ))}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {segments.map(seg => (
            <div key={seg.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: seg.color }} />
                <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{seg.label}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 800, color: seg.color, fontSize: '14px' }}>{seg.value}</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>
                  ({total > 0 ? Math.round((seg.value / total) * 100) : 0}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Bookmarks + Difficult */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <GlassCard>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '28px', marginBottom: '4px' }}>🔖</div>
            <div style={{ fontSize: '22px', fontWeight: 900, color: '#f59e0b' }}>{bookmarked}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Bookmarked</div>
          </div>
        </GlassCard>
        <GlassCard>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '28px', marginBottom: '4px' }}>⚠️</div>
            <div style={{ fontSize: '22px', fontWeight: 900, color: '#f87171' }}>{difficult}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Difficult</div>
          </div>
        </GlassCard>
      </div>

      {/* SRS Info */}
      <GlassCard>
        <h3 style={{ margin: '0 0 10px', fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>
          🧠 Spaced Repetition (SM-2)
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: 0, lineHeight: '1.6' }}>
          Words are reviewed using the SM-2 algorithm. Correct answers extend the review interval;
          incorrect answers reset it. Mastered words have intervals of 30+ days.
        </p>
      </GlassCard>
    </motion.div>
  );
}

// ──────────────────────────────────────────────
// Achievements Tab
// ──────────────────────────────────────────────
function AchievementsTab({ badges, earned }: { badges: Array<Badge & { earned: boolean }>; earned: number }) {
  const total = badges.length;
  const pct = total > 0 ? Math.round((earned / total) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
    >
      {/* Summary */}
      <GlassCard>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: 'var(--text)' }}>Achievements</h3>
            <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '13px' }}>
              {earned} of {total} unlocked ({pct}%)
            </p>
          </div>
          <div style={{ fontSize: '36px' }}>🏅</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '99px', height: '8px', overflow: 'hidden' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{ height: '100%', background: 'linear-gradient(90deg, #f59e0b, #ef4444)', borderRadius: '99px' }}
          />
        </div>
      </GlassCard>

      {/* Badge Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        {badges.map(badge => (
          <motion.div
            key={badge.id}
            whileHover={{ scale: badge.earned ? 1.05 : 1 }}
            style={{
              background: badge.earned ? 'var(--card-bg, #1a1a2e)' : 'rgba(255,255,255,0.03)',
              borderRadius: '14px', padding: '14px 10px', textAlign: 'center',
              border: `1px solid ${badge.earned ? RARITY_COLORS[badge.rarity] + '50' : 'rgba(255,255,255,0.06)'}`,
              opacity: badge.earned ? 1 : 0.5,
              cursor: 'default',
              transition: 'all 200ms ease',
            }}
          >
            <div style={{ fontSize: '28px', marginBottom: '6px', filter: badge.earned ? 'none' : 'grayscale(1)' }}>
              {badge.icon}
            </div>
            <div style={{
              fontSize: '11px', fontWeight: 700, color: badge.earned ? RARITY_COLORS[badge.rarity] : 'var(--text-secondary)',
              marginBottom: '3px', lineHeight: '1.2',
            }}>
              {badge.name}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-secondary)', lineHeight: '1.3' }}>
              {badge.description}
            </div>
            {badge.earned && (
              <div style={{
                marginTop: '6px', fontSize: '9px', color: RARITY_COLORS[badge.rarity],
                textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px',
              }}>
                {badge.rarity}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ──────────────────────────────────────────────
// Heatmap Grid
// ──────────────────────────────────────────────
function HeatmapGrid({ data }: { data: Array<{ date: string; xp: number; lessons: number }> }) {
  const today = new Date();
  const cells: Array<{ date: string; xp: number; lessons: number }> = [];

  // Build 13 weeks × 7 days grid
  for (let i = 89; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const found = data.find(h => h.date === dateStr);
    cells.push({ date: dateStr, xp: found?.xp ?? 0, lessons: found?.lessons ?? 0 });
  }

  const maxXP = Math.max(...cells.map(c => c.xp), 1);

  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(13, 1fr)',
        gridTemplateRows: 'repeat(7, 1fr)',
        gap: '3px',
        gridAutoFlow: 'column',
        minWidth: '280px',
      }}>
        {cells.map((cell, i) => {
          const intensity = cell.xp / maxXP;
          const alpha = cell.xp === 0 ? 0.06 : 0.15 + intensity * 0.85;
          return (
            <motion.div
              key={cell.date}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.002, duration: 0.2 }}
              title={`${cell.date}: ${cell.xp} XP, ${cell.lessons} lessons`}
              style={{
                width: '100%',
                paddingBottom: '100%',
                background: `rgba(255, 152, 0, ${alpha})`,
                borderRadius: '3px',
                cursor: 'default',
              }}
            />
          );
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
        <span style={{ color: 'var(--text-secondary)', fontSize: '10px' }}>90 days ago</span>
        <span style={{ color: 'var(--text-secondary)', fontSize: '10px' }}>Today</span>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Glass Card UI Component
// ──────────────────────────────────────────────
function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={fadeIn}
      style={{
        background: 'var(--card-bg, rgba(255,255,255,0.04))',
        borderRadius: '16px',
        padding: '18px',
        border: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {children}
    </motion.div>
  );
}
