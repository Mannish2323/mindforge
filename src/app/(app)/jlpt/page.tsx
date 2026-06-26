'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { useStore } from '@/hooks/useStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Tabs } from '@/components/ui/Tabs';
import { JLPTBadge } from '@/components/shared/JLPTBadge';
import {
  CheckCircle2, Lock, ChevronRight, BookOpen, Pen,
  FileText, Headphones, Mic, Target, Sparkles,
  TrendingUp, Award, Clock, Zap, ArrowRight
} from 'lucide-react';

/* ─── JLPT Level Data ─────────────────────────── */
const JLPT_DATA = [
  {
    level: 'N5',
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.08)',
    border: 'rgba(34,197,94,0.25)',
    minXP: 0,
    title: 'Beginner',
    jpTitle: '初級',
    description: 'Understand basic Japanese used in everyday life.',
    skills: [
      { label: 'Vocabulary', count: 800, icon: BookOpen },
      { label: 'Kanji',      count: 100, icon: Pen },
      { label: 'Grammar',    count: 54,  icon: FileText },
      { label: 'Listening',  count: 30,  icon: Headphones },
      { label: 'Reading',    count: 20,  icon: FileText },
    ],
    topics: ['Hiragana & Katakana', 'Basic nouns & verbs', 'Simple sentences', 'Numbers 1-10,000', 'Time & Dates', 'Family members', 'Colors & Adjectives'],
    tips: ['Master all 46 hiragana and katakana characters first', 'Focus on the 100 most common N5 kanji', 'Practice greetings daily', 'Use flashcards for vocabulary'],
    emoji: '🌱',
  },
  {
    level: 'N4',
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.08)',
    border: 'rgba(59,130,246,0.25)',
    minXP: 2000,
    title: 'Elementary',
    jpTitle: '初中級',
    description: 'Understand basic Japanese used in familiar situations.',
    skills: [
      { label: 'Vocabulary', count: 1500, icon: BookOpen },
      { label: 'Kanji',      count: 300,  icon: Pen },
      { label: 'Grammar',    count: 86,   icon: FileText },
      { label: 'Listening',  count: 50,   icon: Headphones },
      { label: 'Reading',    count: 40,   icon: FileText },
    ],
    topics: ['Te-form conjugation', 'Potential form', 'Conditional forms', 'Giving & receiving verbs', 'Transitive/Intransitive', 'Direction & Motion', 'Keigo basics'],
    tips: ['Master te-form — it\'s the foundation of N4', 'Learn compound verbs (〜てあげる、〜てもらう)', 'Practice reading simple manga', 'Use shadowing for listening'],
    emoji: '🌿',
  },
  {
    level: 'N3',
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.08)',
    border: 'rgba(139,92,246,0.25)',
    minXP: 5000,
    title: 'Intermediate',
    jpTitle: '中級',
    description: 'Understand Japanese encountered in everyday situations.',
    skills: [
      { label: 'Vocabulary', count: 3500, icon: BookOpen },
      { label: 'Kanji',      count: 650,  icon: Pen },
      { label: 'Grammar',    count: 168,  icon: FileText },
      { label: 'Listening',  count: 80,   icon: Headphones },
      { label: 'Reading',    count: 70,   icon: FileText },
    ],
    topics: ['Complex conditionals', 'Nominalization', 'Passive & Causative', 'Modal expressions', 'Formal writing style', 'News comprehension', 'Sentence patterns'],
    tips: ['Read NHK Web Easy articles daily', 'Study 20+ new vocab per day', 'Watch Japanese TV with subtitles', 'Keep a vocabulary notebook'],
    emoji: '🌲',
  },
  {
    level: 'N2',
    color: '#ec4899',
    bg: 'rgba(236,72,153,0.08)',
    border: 'rgba(236,72,153,0.25)',
    minXP: 10000,
    title: 'Upper Intermediate',
    jpTitle: '中上級',
    description: 'Understand Japanese in a wide variety of situations.',
    skills: [
      { label: 'Vocabulary', count: 6000, icon: BookOpen },
      { label: 'Kanji',      count: 1000, icon: Pen },
      { label: 'Grammar',    count: 196,  icon: FileText },
      { label: 'Listening',  count: 120,  icon: Headphones },
      { label: 'Reading',    count: 110,  icon: FileText },
    ],
    topics: ['Advanced keigo', 'Business correspondence', 'Newspaper reading', 'Complex grammar patterns', 'Literary expressions', 'Political & Economic vocab', 'Nuanced conditionals'],
    tips: ['Read real Japanese newspapers (Asahi, Yomiuri)', 'Master all 1,000 N2 kanji readings', 'Practice business writing', 'Watch news without subtitles'],
    emoji: '🌳',
  },
  {
    level: 'N1',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.25)',
    minXP: 20000,
    title: 'Advanced',
    jpTitle: '上級',
    description: 'Understand Japanese used in a broad range of situations.',
    skills: [
      { label: 'Vocabulary', count: 10000, icon: BookOpen },
      { label: 'Kanji',      count: 2136,  icon: Pen },
      { label: 'Grammar',    count: 218,   icon: FileText },
      { label: 'Listening',  count: 200,   icon: Headphones },
      { label: 'Reading',    count: 180,   icon: FileText },
    ],
    topics: ['Advanced literary forms', 'Classical Japanese roots', 'All Joyo kanji', 'Technical & scientific vocabulary', 'Idiomatic expressions', 'Proverbs & Set phrases', 'Native-speed comprehension'],
    tips: ['Read full novels (Murakami etc.)', 'Watch unadulterated Japanese TV without any cues', 'Study classical grammar patterns', 'Practice writing essays'],
    emoji: '🎋',
  },
];

/* ─── Mock Test Packs ─────────────────────────── */
const MOCK_TESTS = [
  { level: 'N5', duration: '30 min', questions: 35, emoji: '🌱', available: true },
  { level: 'N4', duration: '45 min', questions: 45, emoji: '🌿', available: true },
  { level: 'N3', duration: '60 min', questions: 60, emoji: '🌲', available: false },
  { level: 'N2', duration: '90 min', questions: 80, emoji: '🌳', available: false },
  { level: 'N1', duration: '110 min', questions: 100, emoji: '🎋', available: false },
];

/* ─── Level Colors ────────────────────────────── */
const LEVEL_COLORS: Record<string, string> = {
  N5: '#22c55e', N4: '#3b82f6', N3: '#8b5cf6', N2: '#ec4899', N1: '#f59e0b'
};

export default function JLPTPage() {
  const { profile } = useAuth();
  const { state } = useStore();
  const router = useRouter();
  const [tab, setTab] = useState('roadmap');
  const [expandedLevel, setExpandedLevel] = useState<string | null>('N5');

  const xp = profile?.xp || 0;
  const targetLevel = profile?.jlpt_target || 'N5';
  const isPremium = profile?.isPremium;

  const getLevelStatus = (level: string) => {
    const data = JLPT_DATA.find(d => d.level === level)!;
    const isUnlocked = xp >= data.minXP;
    const isCurrent = level === targetLevel;
    const isCompleted = isUnlocked && !isCurrent;
    return { isUnlocked, isCurrent, isCompleted };
  };

  return (
    <div className="space-y-5 animate-fade-up">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl p-6"
        style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(219,39,119,0.15))', border: '1px solid rgba(124,58,237,0.3)' }}>
        <div className="absolute top-0 right-0 w-48 h-48 opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
        <div className="relative z-10">
          <div className="flex items-start sm:items-center gap-2 sm:gap-3 mb-3 min-w-0">
            <div className="text-3xl sm:text-4xl flex-shrink-0">🎌</div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-black text-white">JLPT Roadmap</h1>
              <p className="text-xs sm:text-sm" style={{ color: 'rgba(200,196,255,0.7)' }}>
                Japanese Language Proficiency Test — N5 to N1
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: LEVEL_COLORS[targetLevel] }} />
              <span className="text-xs sm:text-sm font-bold" style={{ color: LEVEL_COLORS[targetLevel] }}>
                Target: JLPT {targetLevel}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400" />
              <span className="text-xs sm:text-sm text-white font-bold">{xp.toLocaleString()} XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: 'roadmap', label: 'Roadmap' },
          { id: 'mock', label: 'Mock Tests' },
          { id: 'tips', label: 'Study Tips' },
        ]}
        activeTab={tab}
        onChange={setTab}
        variant="underline"
      />

      {/* ── ROADMAP TAB ──────────────────────────── */}
      {tab === 'roadmap' && (
        <div className="space-y-4">
          {/* Level connector overview */}
          <Card padding="md">
            <div className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: 'rgba(139,92,246,0.5)' }}>
              Your Progress Path
            </div>
            {/* Horizontally scrollable connector — safe at 320px */}
            <div className="overflow-x-auto scrollbar-none -mx-1 px-1">
              <div className="flex items-center pb-2" style={{ minWidth: 'max-content' }}>
              {JLPT_DATA.map((lvl, i) => {
                const { isUnlocked, isCurrent, isCompleted } = getLevelStatus(lvl.level);
                return (
                  <div key={lvl.level} className="flex items-center flex-shrink-0">
                    <button
                      onClick={() => setExpandedLevel(expandedLevel === lvl.level ? null : lvl.level)}
                      className="flex flex-col items-center gap-2 group transition-all"
                    >
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-sm transition-all"
                        style={
                          isCurrent
                            ? { background: `linear-gradient(135deg, ${lvl.color}33, ${lvl.color}11)`, border: `2px solid ${lvl.color}`, color: lvl.color, boxShadow: `0 0 20px ${lvl.color}44`, transform: 'scale(1.1)' }
                            : isCompleted
                            ? { background: `${lvl.color}18`, border: `2px solid ${lvl.color}66`, color: lvl.color }
                            : { background: 'rgba(139,92,246,0.06)', border: '2px solid rgba(139,92,246,0.15)', color: 'rgba(139,92,246,0.3)' }
                        }
                      >
                        {isCompleted ? <CheckCircle2 className="w-6 h-6" style={{ color: lvl.color }} /> :
                         !isUnlocked ? <Lock className="w-5 h-5" /> :
                         <span>{lvl.level}</span>}
                      </div>
                      <div className="text-[11px] font-bold" style={{ color: isCurrent ? lvl.color : isCompleted ? lvl.color : 'rgba(160,150,220,0.4)' }}>
                        {lvl.level}
                      </div>
                      <div className="text-[9px]" style={{ color: 'rgba(160,150,220,0.3)' }}>{lvl.emoji}</div>
                    </button>
                    {i < JLPT_DATA.length - 1 && (
                      <div className="w-8 h-0.5 mx-1 flex-shrink-0 rounded-full"
                        style={{ background: getLevelStatus(JLPT_DATA[i + 1].level).isUnlocked ? `linear-gradient(90deg, ${lvl.color}, ${JLPT_DATA[i+1].color})` : 'rgba(139,92,246,0.12)' }} />
                    )}
                  </div>
                );
              })}
              </div>
            </div>
          </Card>

          {/* Expanded Level Details */}
          {JLPT_DATA.map(lvl => {
            if (expandedLevel !== lvl.level) return null;
            const { isUnlocked, isCurrent } = getLevelStatus(lvl.level);

            return (
              <div key={`detail-${lvl.level}`} className="animate-fade-up space-y-4">
                {/* Level Header */}
                <div className="rounded-2xl p-5" style={{ background: lvl.bg, border: `1px solid ${lvl.border}` }}>
                  <div className="flex items-start justify-between gap-2 mb-3 flex-wrap">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <div className="text-2xl sm:text-3xl flex-shrink-0">{lvl.emoji}</div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <JLPTBadge level={lvl.level} />
                          <span className="text-white font-black text-base sm:text-lg truncate">{lvl.title}</span>
                        </div>
                        <div className="text-xs sm:text-sm font-jp mt-0.5" style={{ color: 'rgba(200,196,255,0.6)' }}>{lvl.jpTitle}</div>
                      </div>
                    </div>
                    {isCurrent && (
                      <span className="text-xs font-black px-2.5 py-1 rounded-full"
                        style={{ background: `${lvl.color}22`, color: lvl.color, border: `1px solid ${lvl.color}44` }}>
                        Your Level
                      </span>
                    )}
                    {!isUnlocked && (
                      <span className="text-xs font-black px-2.5 py-1 rounded-full"
                        style={{ background: 'rgba(139,92,246,0.1)', color: 'rgba(139,92,246,0.5)', border: '1px solid rgba(139,92,246,0.2)' }}>
                        Locked · {lvl.minXP.toLocaleString()} XP
                      </span>
                    )}
                  </div>
                  <p className="text-sm mb-4" style={{ color: 'rgba(200,196,255,0.7)' }}>{lvl.description}</p>
                  {isCurrent && xp > 0 && (
                    <>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span style={{ color: 'rgba(160,150,220,0.6)' }}>XP Progress</span>
                        <span style={{ color: lvl.color }}>{xp.toLocaleString()} / {lvl.minXP > 0 ? (JLPT_DATA[JLPT_DATA.indexOf(lvl)+1]?.minXP || lvl.minXP * 2).toLocaleString() : '2,000'} XP</span>
                      </div>
                      <ProgressBar
                        value={Math.min((xp / (JLPT_DATA[JLPT_DATA.indexOf(lvl)+1]?.minXP || 2000)) * 100, 100)}
                        size="sm"
                        color="brand"
                      />
                    </>
                  )}
                </div>

                {/* Skills Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
                  {lvl.skills.map(skill => (
                    <Card key={skill.label} padding="sm" className="text-center sm:p-4">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-1.5 sm:mb-2"
                        style={{ background: `${lvl.color}18` }}>
                        <skill.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: lvl.color }} />
                      </div>
                      <div className="text-base sm:text-lg font-black text-white">{skill.count >= 1000 ? `${(skill.count/1000).toFixed(1)}K` : skill.count}</div>
                      <div className="text-[10px] mt-0.5" style={{ color: 'rgba(160,150,220,0.5)' }}>{skill.label}</div>
                    </Card>
                  ))}
                </div>

                {/* Topics */}
                <Card padding="md">
                  <div className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: 'rgba(139,92,246,0.5)' }}>
                    Key Topics
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {lvl.topics.map(t => (
                      <span key={t} className="text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{ background: `${lvl.color}12`, color: lvl.color, border: `1px solid ${lvl.color}25` }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </Card>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    variant="primary"
                    className="flex-1"
                    onClick={() => router.push(`/quiz?jlpt=${lvl.level}`)}
                    disabled={!isUnlocked && !isCurrent}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Practice {lvl.level}
                  </Button>
                  <Button
                    variant="ghost"
                    className="flex-1"
                    onClick={() => router.push('/vocabulary')}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    Vocabulary
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── MOCK TESTS TAB ──────────────────────── */}
      {tab === 'mock' && (
        <div className="space-y-4">
          <div className="p-3 rounded-xl text-sm" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-400 flex-shrink-0" />
              <span style={{ color: 'rgba(245,158,11,0.9)' }}>
                Mock tests simulate real JLPT conditions. Complete all sections without pausing.
              </span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MOCK_TESTS.map(test => {
              const { isUnlocked } = getLevelStatus(test.level);
              const canTake = (isUnlocked || test.level === 'N5') && test.available;
              const needsPremium = !test.available && (test.level === 'N3' || test.level === 'N2' || test.level === 'N1');

              return (
                <div
                  key={test.level}
                  className="rounded-2xl p-5 transition-all"
                  style={{
                    background: canTake ? `rgba(${test.level === 'N5' ? '34,197,94' : test.level === 'N4' ? '59,130,246' : test.level === 'N3' ? '139,92,246' : test.level === 'N2' ? '236,72,153' : '245,158,11'},0.06)` : 'rgba(139,92,246,0.04)',
                    border: `1px solid ${canTake ? LEVEL_COLORS[test.level] + '33' : 'rgba(139,92,246,0.12)'}`,
                  }}
                >
                  <div className="text-3xl mb-3">{test.emoji}</div>
                  <div className="flex items-center gap-2 mb-1">
                    <JLPTBadge level={test.level} />
                    <span className="text-white font-black">Mock Test</span>
                  </div>
                  <div className="text-xs mb-4" style={{ color: 'rgba(160,150,220,0.6)' }}>
                    {test.questions} questions · {test.duration}
                  </div>
                  <div className="space-y-1.5 mb-4">
                    {['Language Knowledge', 'Reading', 'Listening'].map(section => (
                      <div key={section} className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(160,150,220,0.6)' }}>
                        <CheckCircle2 className="w-3 h-3" style={{ color: canTake ? LEVEL_COLORS[test.level] : 'rgba(139,92,246,0.25)' }} />
                        {section}
                      </div>
                    ))}
                  </div>
                  {needsPremium && !isPremium ? (
                    <button
                      onClick={() => router.push('/billing')}
                      className="w-full py-2 rounded-xl text-xs font-bold transition-all"
                      style={{ background: 'rgba(219,39,119,0.12)', color: '#f472b6', border: '1px solid rgba(219,39,119,0.25)' }}
                    >
                      🔒 Pro Required
                    </button>
                  ) : canTake ? (
                    <button
                      onClick={() => router.push(`/quiz?jlpt=${test.level}&mode=mock`)}
                      className="w-full py-2 rounded-xl text-xs font-bold transition-all"
                      style={{ background: `linear-gradient(135deg, ${LEVEL_COLORS[test.level]}33, ${LEVEL_COLORS[test.level]}18)`, color: LEVEL_COLORS[test.level], border: `1px solid ${LEVEL_COLORS[test.level]}44` }}
                    >
                      Start Test <ArrowRight className="w-3 h-3 inline ml-1" />
                    </button>
                  ) : (
                    <button
                      className="w-full py-2 rounded-xl text-xs font-bold opacity-40 cursor-not-allowed"
                      style={{ background: 'rgba(139,92,246,0.08)', color: 'rgba(139,92,246,0.4)' }}
                      disabled
                    >
                      🔒 Locked
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── STUDY TIPS TAB ──────────────────────── */}
      {tab === 'tips' && (
        <div className="space-y-4">
          {JLPT_DATA.map(lvl => (
            <Card key={lvl.level} padding="md">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-2xl">{lvl.emoji}</div>
                <div className="flex items-center gap-2">
                  <JLPTBadge level={lvl.level} />
                  <span className="font-black text-white">{lvl.title} Tips</span>
                </div>
              </div>
              <div className="space-y-2">
                {lvl.tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl"
                    style={{ background: `${lvl.color}08` }}>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5"
                      style={{ background: `${lvl.color}20`, color: lvl.color }}>
                      {i + 1}
                    </div>
                    <p className="text-sm" style={{ color: 'rgba(200,196,255,0.8)' }}>{tip}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => { setTab('roadmap'); setExpandedLevel(lvl.level); }}
                className="mt-3 flex items-center gap-1.5 text-xs font-bold transition-colors hover:opacity-80"
                style={{ color: lvl.color }}
              >
                View {lvl.level} Roadmap <ChevronRight className="w-3 h-3" />
              </button>
            </Card>
          ))}

          {/* Study Schedule Banner */}
          <Card padding="md" style={{ border: '1px solid rgba(124,58,237,0.3)' }}>
            <div className="flex items-start gap-4">
              <div className="text-3xl">📅</div>
              <div className="flex-1">
                <div className="font-black text-white mb-1">Recommended Study Schedule</div>
                <div className="text-xs mb-3" style={{ color: 'rgba(200,196,255,0.7)' }}>
                  For N5: 3–6 months · For N4: 6–12 months · For N3: 12–18 months · For N2/N1: 2+ years
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { label: 'Daily vocab', val: '20 words', icon: '📚' },
                    { label: 'Grammar', val: '2 points', icon: '📖' },
                    { label: 'Listening', val: '15 min', icon: '🎧' },
                    { label: 'Speaking', val: '10 min', icon: '🎤' },
                  ].map(s => (
                    <div key={s.label} className="p-2 rounded-lg text-center"
                      style={{ background: 'rgba(139,92,246,0.08)' }}>
                      <div className="text-base mb-1">{s.icon}</div>
                      <div className="text-xs font-black text-white">{s.val}</div>
                      <div className="text-[9px] mt-0.5" style={{ color: 'rgba(160,150,220,0.5)' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
