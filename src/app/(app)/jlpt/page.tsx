'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthModal } from '@/components/shared/AuthModal';
import { 
  BookOpen, Sparkles, Award, Lock, CheckCircle2, ChevronRight,
  Headphones, Dumbbell, HelpCircle, Book, Layers, GraduationCap, Volume2, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MFCard } from '@/components/ui/MFCard';
import { MFButton } from '@/components/ui/MFButton';
import { MFIcon, MFIconType } from '@/components/ui/MFIcon';

type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
type ModuleTab = 'lessons' | 'grammar' | 'vocabulary' | 'kanji' | 'quiz' | 'audio' | 'exercises';

interface ModuleItem {
  id: string;
  title: string;
  subtitle: string;
  count: string;
  href: string;
  badge?: string;
  isLocked?: boolean;
}

export default function JLPTPage() {
  const router = useRouter();
  const { requireAuth } = useAuthModal();
  const [selectedLevel, setSelectedLevel] = useState<JLPTLevel>('N5');
  const [selectedTab, setSelectedTab] = useState<ModuleTab>('lessons');

  const levels: { id: JLPTLevel; name: string; desc: string; variant: 'mint' | 'sky' | 'lavender' | 'sakura' | 'yellow' }[] = [
    { id: 'N5', name: 'N5', desc: 'Beginner • Basic Japanese', variant: 'mint' },
    { id: 'N4', name: 'N4', desc: 'Elementary • Daily Conversation', variant: 'sky' as any },
    { id: 'N3', name: 'N3', desc: 'Intermediate • Everyday Situations', variant: 'lavender' },
    { id: 'N2', name: 'N2', desc: 'Pre-Advanced • Business & Media', variant: 'sakura' },
    { id: 'N1', name: 'N1', desc: 'Advanced • Native Fluency', variant: 'yellow' },
  ];

  const tabs: { id: ModuleTab; label: string; iconName: MFIconType; count: string }[] = [
    { id: 'lessons', label: 'Lessons', iconName: 'learn', count: '12 Units' },
    { id: 'grammar', label: 'Grammar', iconName: 'grammar', count: '45 Points' },
    { id: 'vocabulary', label: 'Vocabulary', iconName: 'vocabulary', count: '800 Words' },
    { id: 'kanji', label: 'Kanji', iconName: 'kanji', count: '103 Characters' },
    { id: 'quiz', label: 'Quiz', iconName: 'star', count: '15 Tests' },
    { id: 'audio', label: 'Audio', iconName: 'listening', count: '30 Tracks' },
    { id: 'exercises', label: 'Exercises', iconName: 'speaking', count: '50 Drills' },
  ];

  const getModuleContent = (level: JLPTLevel, tab: ModuleTab): ModuleItem[] => {
    const isFree = level === 'N5' || level === 'N4';
    
    switch (tab) {
      case 'lessons':
        return [
          { id: `${level}-l1`, title: `${level} Core Unit 1: Greetings & Foundations`, subtitle: 'Master basic greetings, hiragana, and introduces yourself', count: '5 Lessons', href: '/path', badge: 'Active' },
          { id: `${level}-l2`, title: `${level} Core Unit 2: Numbers & Counting`, subtitle: 'Counters, telling time, and shopping conversations', count: '4 Lessons', href: '/path' },
          { id: `${level}-l3`, title: `${level} Core Unit 3: Daily Routines & Verbs`, subtitle: 'Present tense, verb forms, and daily schedules', count: '6 Lessons', href: '/path', isLocked: !isFree },
        ];
      case 'grammar':
        return [
          { id: `${level}-g1`, title: `${level} Particle は (wa) vs が (ga)`, subtitle: 'Topic marker vs Subject emphasis', count: 'Grammar Rule', href: '/grammar' },
          { id: `${level}-g2`, title: `${level} Verb て-form (Te-form)`, subtitle: 'Connecting sentences and making requests', count: 'Verb Conjugation', href: '/grammar' },
          { id: `${level}-g3`, title: `${level} Desu / Masu Polite Form`, subtitle: 'Formal speech patterns for daily usage', count: 'Polite Form', href: '/grammar', isLocked: !isFree },
        ];
      case 'vocabulary':
        return [
          { id: `${level}-v1`, title: `${level} Essential Daily Nouns`, subtitle: 'Food, objects, family, and locations', count: '250 Words', href: '/vocabulary' },
          { id: `${level}-v2`, title: `${level} Action Verbs Pack`, subtitle: 'Common daily activity verbs and conjugations', count: '180 Verbs', href: '/vocabulary' },
          { id: `${level}-v3`, title: `${level} Adjectives & Descriptors`, subtitle: 'I-adjectives & Na-adjectives mastery', count: '120 Words', href: '/vocabulary', isLocked: !isFree },
        ];
      case 'kanji':
        return [
          { id: `${level}-k1`, title: `${level} Numbers & Calendar Kanji`, subtitle: '一, 二, 三, 日, 月, 火, 水, 木, 金, 土', count: '10 Kanji', href: '/script' },
          { id: `${level}-k2`, title: `${level} People & Nature Kanji`, subtitle: '人, 男, 女, 子, 山, 川, 天, 気', count: '15 Kanji', href: '/script' },
          { id: `${level}-k3`, title: `${level} Directions & Movement Kanji`, subtitle: '上, 下, 中, 外, 前, 後, 行, 来', count: '20 Kanji', href: '/script', isLocked: !isFree },
        ];
      case 'quiz':
        return [
          { id: `${level}-q1`, title: `${level} Diagnostic Baseline Quiz`, subtitle: 'Test your overall proficiency across all skills', count: '20 Questions', href: '/quiz' },
          { id: `${level}-q2`, title: `${level} Grammar & Sentence Order Test`, subtitle: 'Particle placement and clause ordering', count: '15 Questions', href: '/quiz' },
          { id: `${level}-q3`, title: `${level} Full Mock Examination`, subtitle: 'Timed simulated JLPT exam under test conditions', count: '50 Questions', href: '/quiz', isLocked: !isFree },
        ];
      case 'audio':
        return [
          { id: `${level}-a1`, title: `${level} Short Dialogue Listening`, subtitle: 'Native speaker conversations at standard speed', count: '10 Tracks', href: '/listening' },
          { id: `${level}-a2`, title: `${level} Pronunciation & Pitch Accent Drill`, subtitle: 'Minimal pairs and pitch accent practice audio', count: '15 Tracks', href: '/listening' },
        ];
      case 'exercises':
        return [
          { id: `${level}-e1`, title: `${level} Interactive Speaking Practice`, subtitle: 'AI Voice tutor pronunciation evaluation', count: '10 Exercises', href: '/speak' },
          { id: `${level}-e2`, title: `${level} Kanji & Sentence Writing Canvas`, subtitle: 'Stroke order recognition & handwriting check', count: '15 Writing Drills', href: '/writing' },
        ];
    }
  };

  const currentContent = getModuleContent(selectedLevel, selectedTab);

  return (
    <div className="space-y-7 md:space-y-9 max-w-6xl mx-auto pb-14">
      {/* Top Study Sheet Banner */}
      <MFCard variant="sakura" washiTape="pink" padding="lg">
        <div className="space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-edge text-xs font-extrabold text-brand shadow-sm">
            <GraduationCap className="w-4 h-4 text-brand" />
            <span>JLPT Study Roadmap</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-ink font-heading tracking-tight">
            JLPT Standard Curriculum
          </h1>
          <p className="text-xs sm:text-sm text-ink-secondary max-w-2xl font-medium leading-relaxed">
            Comprehensive curriculum from JLPT N5 to N1. Explore lessons, grammar rules, vocabulary packs, kanji stroke orders, quizzes, native audio, and speaking exercises.
          </p>
        </div>
      </MFCard>

      {/* 1. Level Selector Tabs (N5 -> N1) */}
      <div className="grid grid-cols-5 gap-2 md:gap-3 p-1.5 rounded-2xl bg-cream border border-edge">
        {levels.map((lvl) => {
          const isSelected = selectedLevel === lvl.id;
          return (
            <button
              key={lvl.id}
              onClick={() => setSelectedLevel(lvl.id)}
              className={`py-3 px-2 rounded-xl text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                isSelected
                  ? 'bg-card text-brand border-[1.5px] border-brand shadow-[var(--paper-press-shadow)] scale-[1.02]'
                  : 'text-ink-muted hover:text-ink hover:bg-card/50'
              }`}
            >
              <span className="text-base sm:text-lg font-extrabold font-heading">{lvl.name}</span>
              <span className="text-[10px] hidden md:block font-medium opacity-80">{lvl.desc.split('•')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* 2. Sub-Module Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {tabs.map((tab) => {
          const isActive = selectedTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                isActive
                  ? 'bg-brand text-white border-brand shadow-[var(--paper-press-shadow)]'
                  : 'bg-card border-edge text-ink-muted hover:text-ink hover:bg-cream'
              }`}
            >
              <MFIcon name={tab.iconName} size={18} />
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${isActive ? 'bg-card/25 text-white' : 'bg-cream text-ink-muted'}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Dynamic Module Grid Content */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-ink flex items-center gap-2 font-heading">
            <span>{selectedLevel} {tabs.find(t => t.id === selectedTab)?.label} Modules</span>
          </h2>
          <span className="text-xs font-bold text-ink-muted">{currentContent.length} modules available</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedLevel}-${selectedTab}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {currentContent.map((item) => (
              <MFCard
                key={item.id}
                variant="paper"
                lifted={!item.isLocked}
                padding="md"
                className={`relative flex flex-col justify-between ${
                  item.isLocked ? 'opacity-60' : 'cursor-pointer'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold bg-cream border border-edge text-ink">
                      {item.count}
                    </span>
                    {item.isLocked && (
                      <div className="flex items-center gap-1 text-orange text-xs font-bold">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Locked</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-ink font-heading leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-ink-secondary leading-relaxed font-medium">
                    {item.subtitle}
                  </p>
                </div>

                <div className="pt-3 mt-3 flex items-center justify-between border-t border-dashed border-edge text-xs">
                  <span className="text-[10px] font-bold text-ink-muted uppercase tracking-wider">
                    JLPT {selectedLevel}
                  </span>

                  {item.isLocked ? (
                    <span className="text-[11px] font-bold text-ink-muted">Requires Upgrade</span>
                  ) : (
                    <button
                      onClick={() => {
                        if (selectedTab === 'grammar' || selectedTab === 'vocabulary') {
                          router.push(item.href);
                        } else {
                          requireAuth(() => router.push(item.href), item.title);
                        }
                      }}
                      className="inline-flex items-center gap-1 font-extrabold text-brand hover:underline cursor-pointer"
                    >
                      <span>Start Module</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </MFCard>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
