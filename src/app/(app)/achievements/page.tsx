'use client';

import { useStore } from '@/hooks/useStore';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Tabs } from '@/components/ui/Tabs';
import { useState } from 'react';
import { Lock } from 'lucide-react';

const DEFAULT_BADGES = [
  { badge_id: 'first_lesson', icon: '🎌', title: 'First Step', description: 'Complete your first lesson', xp: 50 },
  { badge_id: 'streak_7',     icon: '🔥', title: 'Week Warrior', description: '7-day streak', xp: 100 },
  { badge_id: 'streak_30',    icon: '💎', title: 'Month Master', description: '30-day streak', xp: 500 },
  { badge_id: 'vocab_100',    icon: '📚', title: 'Word Collector', description: 'Learn 100 words', xp: 150 },
  { badge_id: 'vocab_500',    icon: '🗺️', title: 'Vocabulary Explorer', description: 'Learn 500 words', xp: 400 },
  { badge_id: 'kanji_50',     icon: '⛩️', title: 'Kanji Apprentice', description: 'Master 50 kanji', xp: 200 },
  { badge_id: 'kanji_200',    icon: '🏯', title: 'Kanji Warrior', description: 'Master 200 kanji', xp: 600 },
  { badge_id: 'n5_complete',  icon: '🌱', title: 'N5 Graduate', description: 'Complete all N5 content', xp: 1000 },
  { badge_id: 'n4_complete',  icon: '🌿', title: 'N4 Graduate', description: 'Complete all N4 content', xp: 2000 },
  { badge_id: 'n3_complete',  icon: '🌲', title: 'N3 Graduate', description: 'Complete all N3 content', xp: 3500 },
  { badge_id: 'n2_complete',  icon: '🌳', title: 'N2 Graduate', description: 'Complete all N2 content', xp: 5000 },
  { badge_id: 'n1_complete',  icon: '🎋', title: 'N1 Master', description: 'Complete all N1 content', xp: 10000 },
  { badge_id: 'ai_chat_10',   icon: '🤖', title: 'AI Friend', description: 'Have 10 AI conversations', xp: 100 },
  { badge_id: 'speak_10',     icon: '🎤', title: 'Speaker', description: 'Complete 10 speaking sessions', xp: 200 },
  { badge_id: 'write_50',     icon: '✍️', title: 'Calligrapher', description: 'Write 50 kanji correctly', xp: 300 },
  { badge_id: 'community_post',icon:'💬', title: 'Community Member', description: 'Make your first post', xp: 50 },
  { badge_id: 'top_10',       icon: '🏆', title: 'Top Learner', description: 'Reach top 10 globally', xp: 1000 },
  { badge_id: 'perfect_week', icon: '⭐', title: 'Perfect Week', description: 'Complete all daily goals for 7 days', xp: 350 },
];

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'streak', label: '🔥 Streak' },
  { id: 'vocab', label: '📚 Vocab' },
  { id: 'kanji', label: '⛩️ Kanji' },
  { id: 'jlpt', label: '🎌 JLPT' },
  { id: 'social', label: '💬 Social' },
];

const BADGE_CATEGORIES: Record<string, string[]> = {
  streak: ['streak_7', 'streak_30', 'perfect_week'],
  vocab: ['vocab_100', 'vocab_500'],
  kanji: ['kanji_50', 'kanji_200', 'write_50'],
  jlpt: ['n5_complete','n4_complete','n3_complete','n2_complete','n1_complete'],
  social: ['community_post', 'top_10', 'ai_chat_10'],
};

export default function AchievementsPage() {
  const { state } = useStore();
  const [cat, setCat] = useState('all');

  const unlocked = new Set((state?.badges || []).filter((b: any) => b.unlockedAt).map((b: any) => b.badge_id));

  const filteredBadges = DEFAULT_BADGES.filter(b =>
    cat === 'all' || (BADGE_CATEGORIES[cat] || []).includes(b.badge_id)
  );

  const totalXPFromBadges = DEFAULT_BADGES.filter(b => unlocked.has(b.badge_id)).reduce((acc, b) => acc + b.xp, 0);
  const unlockedCount = DEFAULT_BADGES.filter(b => unlocked.has(b.badge_id)).length;

  return (
    <div className="space-y-5 animate-fade-up">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Unlocked', val: `${unlockedCount}/${DEFAULT_BADGES.length}` },
          { label: 'XP Earned', val: totalXPFromBadges.toLocaleString() },
          { label: 'Completion', val: `${Math.round((unlockedCount/DEFAULT_BADGES.length)*100)}%` },
        ].map(s => (
          <Card key={s.label} padding="md" className="text-center">
            <div className="text-xl font-black text-white">{s.val}</div>
            <div className="text-xs mt-0.5" style={{ color: 'rgba(160,150,220,0.5)' }}>{s.label}</div>
          </Card>
        ))}
      </div>

      <Tabs tabs={CATEGORIES} activeTab={cat} onChange={setCat} variant="pill" />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {filteredBadges.map(badge => {
          const isUnlocked = unlocked.has(badge.badge_id);
          return (
            <div key={badge.badge_id} className={`card p-4 flex flex-col items-center text-center relative transition-all hover:scale-[1.03] ${!isUnlocked ? 'opacity-45' : ''}`}>
              {!isUnlocked && (
                <div className="absolute top-2 right-2">
                  <Lock className="w-3 h-3" style={{ color: 'rgba(160,150,220,0.3)' }} />
                </div>
              )}
              {isUnlocked && (
                <div className="absolute top-2 right-2">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                </div>
              )}
              <div className={`text-4xl mb-2 ${!isUnlocked ? 'grayscale' : ''}`}>{badge.icon}</div>
              <div className="text-xs font-black text-white mb-0.5">{badge.title}</div>
              <div className="text-[10px] leading-relaxed" style={{ color: 'rgba(160,150,220,0.55)' }}>{badge.description}</div>
              <div className="mt-2 text-[10px] font-bold" style={{ color: isUnlocked ? '#4ade80' : 'rgba(160,150,220,0.35)' }}>
                {isUnlocked ? '✓ Earned' : `+${badge.xp} XP`}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
