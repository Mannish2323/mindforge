'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthModal } from '@/components/shared/AuthModal';
import { 
  BookOpen, Sparkles, Award, Lock, CheckCircle2, ChevronRight,
  Headphones, Dumbbell, HelpCircle, Book, Layers, GraduationCap, Volume2, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

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

  const levels: { id: JLPTLevel; name: string; desc: string; color: string }[] = [
    { id: 'N5', name: 'N5', desc: 'Beginner • Basic Japanese', color: 'from-emerald-500 to-teal-600' },
    { id: 'N4', name: 'N4', desc: 'Elementary • Daily Conversation', color: 'from-sky-500 to-blue-600' },
    { id: 'N3', name: 'N3', desc: 'Intermediate • Everyday Situations', color: 'from-purple-500 to-indigo-600' },
    { id: 'N2', name: 'N2', desc: 'Pre-Advanced • Business & Media', color: 'from-pink-500 to-rose-600' },
    { id: 'N1', name: 'N1', desc: 'Advanced • Native Fluency', color: 'from-amber-500 to-orange-600' },
  ];

  const tabs: { id: ModuleTab; label: string; icon: any; count: string }[] = [
    { id: 'lessons', label: 'Lessons', icon: BookOpen, count: '12 Units' },
    { id: 'grammar', label: 'Grammar', icon: FileText, count: '45 Points' },
    { id: 'vocabulary', label: 'Vocabulary', icon: Book, count: '800 Words' },
    { id: 'kanji', label: 'Kanji', icon: Layers, count: '103 Characters' },
    { id: 'quiz', label: 'Quiz', icon: HelpCircle, count: '15 Tests' },
    { id: 'audio', label: 'Audio', icon: Headphones, count: '30 Tracks' },
    { id: 'exercises', label: 'Exercises', icon: Dumbbell, count: '50 Drills' },
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
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand/10 border border-brand/20 text-xs font-bold text-brand-light">
          <GraduationCap className="w-4 h-4 text-accent" />
          <span>JLPT Mastery Roadmap</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-ink font-heading tracking-tight">
          JLPT Standard Curriculum
        </h1>
        <p className="text-sm md:text-base text-ink-muted max-w-2xl">
          Comprehensive curriculum from JLPT N5 to N1. Explore lessons, grammar rules, vocabulary packs, kanji stroke orders, quizzes, native audio, and speaking exercises.
        </p>
      </div>

      {/* 1. Level Selector Tabs (N5 -> N1) */}
      <div className="grid grid-cols-5 gap-2 md:gap-4 p-1.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
        {levels.map((lvl) => {
          const isSelected = selectedLevel === lvl.id;
          return (
            <button
              key={lvl.id}
              onClick={() => setSelectedLevel(lvl.id)}
              className={`relative py-3.5 px-2 rounded-xl text-center transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-1 ${
                isSelected
                  ? 'bg-gradient-to-r ' + lvl.color + ' text-ink shadow-glow-purple scale-[1.02]'
                  : 'text-ink-muted hover:text-ink hover:bg-white/[0.04]'
              }`}
            >
              <span className="text-base md:text-xl font-extrabold font-heading">{lvl.name}</span>
              <span className="text-[10px] hidden md:block opacity-80 font-medium">{lvl.desc.split('•')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* 2. Sub-Module Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = selectedTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                isActive
                  ? 'bg-brand/20 border-neon-purple text-brand-light shadow-[0_0_15px_rgba(109,60,255,0.3)]'
                  : 'bg-white/[0.02] border-white/[0.06] text-ink-muted hover:text-ink hover:bg-white/[0.05]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-accent' : 'text-ink-muted'}`} />
              <span>{tab.label}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${isActive ? 'bg-brand/40 text-white' : 'bg-white/[0.05] text-ink-light'}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Dynamic Module Grid Content */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-ink flex items-center gap-2">
            <span>{selectedLevel} {tabs.find(t => t.id === selectedTab)?.label} Modules</span>
          </h2>
          <span className="text-xs text-ink-muted">{currentContent.length} modules available</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedLevel}-${selectedTab}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {currentContent.map((item) => (
              <Card
                key={item.id}
                variant="glass"
                padding="md"
                className={`relative group rounded-2xl border transition-all duration-300 ${
                  item.isLocked
                    ? 'opacity-60 border-white/[0.04]'
                    : 'hover:border-neon-purple/40 hover:shadow-glow-purple cursor-pointer'
                }`}
              >
                <div className="flex flex-col h-full justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant={item.isLocked ? 'default' : 'purple'} size="sm">
                        {item.count}
                      </Badge>
                      {item.isLocked && (
                        <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                          <Lock className="w-3.5 h-3.5" />
                          <span>Locked</span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-ink group-hover:text-brand-light transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-ink-muted leading-relaxed">
                      {item.subtitle}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-white/[0.04]">
                    <span className="text-[11px] font-bold text-ink-muted uppercase tracking-wider">
                      JLPT {selectedLevel}
                    </span>

                    {item.isLocked ? (
                      <span className="text-xs font-semibold text-ink-light">Requires Level Upgrade</span>
                    ) : (
                      <button
                        onClick={() => {
                          if (selectedTab === 'grammar' || selectedTab === 'vocabulary') {
                            router.push(item.href);
                          } else {
                            requireAuth(() => router.push(item.href), item.title);
                          }
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-accent group-hover:translate-x-1 transition-transform cursor-pointer"
                      >
                        <span>Start Module</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
