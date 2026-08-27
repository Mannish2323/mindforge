'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Eye, EyeOff, ChevronRight, BookOpen, Volume2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

const READING_PASSAGES = [
  {
    id: 1, title: '自己紹介 (Self Introduction)', level: 'N5',
    japanese: 'はじめまして。わたしの名前はさくらです。日本語を勉強しています。毎日少しずつ練習しています。よろしくおねがいします。',
    english: 'Nice to meet you. My name is Sakura. I am studying Japanese. I practice a little every day. Please treat me well.',
    questions: [
      { q: 'What is the speaker studying?', options: ['English', 'Japanese', 'Chinese', 'Korean'], answer: 1 },
      { q: 'How often do they practice?', options: ['Weekly', 'Monthly', 'Every day', 'Never'], answer: 2 },
    ],
  },
  {
    id: 2, title: '天気の話 (Weather Talk)', level: 'N5',
    japanese: '今日はとてもいい天気です。空は青くて、太陽が明るいです。公園で散歩したいです。',
    english: 'Today is very nice weather. The sky is blue and the sun is bright. I want to take a walk in the park.',
    questions: [
      { q: 'What is the weather like?', options: ['Rainy', 'Cloudy', 'Very nice', 'Snowy'], answer: 2 },
    ],
  },
];

export default function ReadingPage() {
  const [activeTab, setActiveTab] = useState('N5');
  const [selectedPassage, setSelectedPassage] = useState<typeof READING_PASSAGES[0] | null>(null);
  const [showFurigana, setShowFurigana] = useState(true);
  const [showTranslation, setShowTranslation] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});

  const tabs = ['N5', 'N4', 'N3', 'N2', 'N1'];
  const filtered = READING_PASSAGES.filter(p => p.level === activeTab);

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">Reading Practice</h1>
        <p className="text-sm text-ink-muted">Read Japanese passages and test comprehension</p>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={item} className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map(tab => (
          <button key={tab} onClick={() => { setActiveTab(tab); setSelectedPassage(null); }}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${activeTab === tab ? 'bg-brand/20 text-ink border border-brand/30' : 'bg-white/[0.03] text-ink-muted border border-white/[0.04] hover:border-edge'}`}
          >{tab}</button>
        ))}
      </motion.div>

      {selectedPassage ? (
        <motion.div variants={item} className="space-y-6">
          {/* Passage Card */}
          <Card variant="glass" padding="lg" className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">{selectedPassage.title}</h3>
                <Badge variant="purple" size="sm" className="mt-1">{selectedPassage.level}</Badge>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowFurigana(!showFurigana)}
                  className={`p-2 rounded-lg border transition-all cursor-pointer ${showFurigana ? 'bg-brand/10 border-brand/20 text-brand-light' : 'bg-white/[0.03] border-white/[0.06] text-ink-muted'}`}
                  title="Toggle furigana"
                >
                  <BookOpen className="w-4 h-4" />
                </button>
                <button onClick={() => setShowTranslation(!showTranslation)}
                  className={`p-2 rounded-lg border transition-all cursor-pointer ${showTranslation ? 'bg-brand/10 border-brand/20 text-brand-light' : 'bg-white/[0.03] border-white/[0.06] text-ink-muted'}`}
                  title="Toggle translation"
                >
                  {showTranslation ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Japanese text */}
            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <p className="text-lg font-jp text-ink leading-loose tracking-wide">
                {selectedPassage.japanese}
              </p>
            </div>

            {/* Translation */}
            {showTranslation && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                className="p-4 rounded-xl bg-brand/5 border border-brand/8"
              >
                <p className="text-sm text-ink-secondary italic">{selectedPassage.english}</p>
              </motion.div>
            )}
          </Card>

          {/* Comprehension Questions */}
          <Card variant="glass" padding="lg" className="space-y-4">
            <h4 className="text-sm font-bold text-white">Comprehension Check</h4>
            {selectedPassage.questions.map((q, qi) => (
              <div key={qi} className="space-y-2">
                <p className="text-sm text-purple-200/70 font-medium">{qi + 1}. {q.q}</p>
                <div className="grid grid-cols-2 gap-2">
                  {q.options.map((opt, oi) => (
                    <button key={oi}
                      onClick={() => setSelectedAnswers(prev => ({ ...prev, [qi]: oi }))}
                      className={`p-3 rounded-xl text-sm font-medium border transition-all cursor-pointer text-left ${
                        selectedAnswers[qi] === oi
                          ? selectedAnswers[qi] === q.answer
                            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                            : 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                          : 'bg-white/[0.02] border-white/[0.06] text-ink-secondary hover:border-edge'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </Card>

          <Button onClick={() => setSelectedPassage(null)} variant="ghost" className="btn btn-ghost">
            ← Back to passages
          </Button>
        </motion.div>
      ) : (
        <motion.div variants={item} className="space-y-3">
          {filtered.length > 0 ? filtered.map(passage => (
            <Card key={passage.id} variant="glass" padding="md"
              className="flex items-center justify-between cursor-pointer"
              onClick={() => { setSelectedPassage(passage); setSelectedAnswers({}); }}
            >
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-emerald-500/10">
                  <FileText className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{passage.title}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant="purple" size="sm">{passage.level}</Badge>
                    <span className="text-[10px] text-ink-muted">{passage.questions.length} questions</span>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-ink-light" />
            </Card>
          )) : (
            <Card variant="glass" padding="lg" className="text-center">
              <p className="text-sm text-ink-muted">No passages available for {activeTab} yet</p>
            </Card>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
