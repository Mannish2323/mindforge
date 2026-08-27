'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ChevronRight, Eye, RotateCcw, Sparkles, Check, X } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';

const REVIEW_CARDS = [
  { id: 1, kanji: '食べる', romaji: 'taberu', meaning: 'to eat', example: '寿司を食べます。' },
  { id: 2, kanji: '飲む', romaji: 'nomu', meaning: 'to drink', example: 'お茶を飲みます。' },
  { id: 3, kanji: '行く', romaji: 'iku', meaning: 'to go', example: '学校に行きます。' },
  { id: 4, kanji: '見る', romaji: 'miru', meaning: 'to see/watch', example: 'テレビを見ます。' },
  { id: 5, kanji: '聞く', romaji: 'kiku', meaning: 'to listen/ask', example: '音楽を聞きます。' },
  { id: 6, kanji: '読む', romaji: 'yomu', meaning: 'to read', example: '本を読みます。' },
  { id: 7, kanji: '書く', romaji: 'kaku', meaning: 'to write', example: '手紙を書きます。' },
  { id: 8, kanji: '話す', romaji: 'hanasu', meaning: 'to speak', example: '日本語を話します。' },
];

type Difficulty = 'again' | 'hard' | 'good' | 'easy';

export default function ReviewPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [reviewed, setReviewed] = useState<Set<number>>(new Set());
  const [sessionDone, setSessionDone] = useState(false);
  const [results, setResults] = useState<Record<number, Difficulty>>({});

  const totalCards = REVIEW_CARDS.length;
  const currentCard = REVIEW_CARDS[currentIndex];
  const progress = (reviewed.size / totalCards) * 100;

  const handleAnswer = (difficulty: Difficulty) => {
    setResults(prev => ({ ...prev, [currentIndex]: difficulty }));
    setReviewed(prev => new Set(prev).add(currentIndex));
    setFlipped(false);

    if (currentIndex < totalCards - 1) {
      setTimeout(() => setCurrentIndex(prev => prev + 1), 300);
    } else {
      setSessionDone(true);
    }
  };

  const restart = () => {
    setCurrentIndex(0);
    setFlipped(false);
    setReviewed(new Set());
    setResults({});
    setSessionDone(false);
  };

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

  const difficultyButtons: { key: Difficulty; label: string; color: string; time: string }[] = [
    { key: 'again', label: 'Again', color: 'bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/20', time: '1m' },
    { key: 'hard', label: 'Hard', color: 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20', time: '6m' },
    { key: 'good', label: 'Good', color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20', time: '10m' },
    { key: 'easy', label: 'Easy', color: 'bg-sky-500/10 border-sky-500/20 text-sky-400 hover:bg-sky-500/20', time: '4d' },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-2xl mx-auto">
      <motion.div variants={item} className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-extrabold text-ink flex items-center gap-2">
          <Brain className="w-7 h-7 text-accent" /> Spaced Repetition Review
        </h1>
        <p className="text-sm text-ink-muted">{totalCards} cards due today</p>
      </motion.div>

      <motion.div variants={item}>
        <ProgressBar value={progress} label={`${reviewed.size}/${totalCards}`} showLabel />
      </motion.div>

      {sessionDone ? (
        <motion.div variants={item}>
          <Card variant="gradient" padding="lg" className="text-center space-y-6">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
              className="w-20 h-20 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 flex items-center justify-center mx-auto"
            >
              <Check className="w-10 h-10 text-white" />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold text-white">Session Complete!</h2>
              <p className="text-sm text-ink-muted mt-1">You reviewed {totalCards} cards</p>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {difficultyButtons.map(d => {
                const count = Object.values(results).filter(r => r === d.key).length;
                return (
                  <div key={d.key} className={`p-3 rounded-xl border ${d.color.split(' ').slice(0, 2).join(' ')}`}>
                    <span className="text-xl font-bold text-ink block">{count}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider">{d.label}</span>
                  </div>
                );
              })}
            </div>
            <Button onClick={restart} className="btn btn-primary" leftIcon={<RotateCcw className="w-4 h-4" />}>
              Review Again
            </Button>
          </Card>
        </motion.div>
      ) : (
        <motion.div variants={item}>
          {/* Flashcard */}
          <div className="perspective-1000">
            <Card
              variant="glass"
              padding="none"
              className="min-h-[320px] cursor-pointer select-none"
              onClick={() => setFlipped(!flipped)}
            >
              <AnimatePresence mode="wait">
                {!flipped ? (
                  <motion.div key="front" initial={{ rotateY: 90 }} animate={{ rotateY: 0 }} exit={{ rotateY: -90 }} transition={{ duration: 0.3 }}
                    className="flex flex-col items-center justify-center p-8 min-h-[320px] space-y-4"
                  >
                    <Badge variant="purple" size="sm">Card {currentIndex + 1}</Badge>
                    <span className="text-6xl font-jp text-white">{currentCard.kanji}</span>
                    <p className="text-sm text-ink-light">Tap to reveal answer</p>
                  </motion.div>
                ) : (
                  <motion.div key="back" initial={{ rotateY: -90 }} animate={{ rotateY: 0 }} exit={{ rotateY: 90 }} transition={{ duration: 0.3 }}
                    className="flex flex-col items-center justify-center p-8 min-h-[320px] space-y-4"
                  >
                    <span className="text-4xl font-jp text-white">{currentCard.kanji}</span>
                    <span className="text-xl text-brand-light font-semibold">{currentCard.romaji}</span>
                    <span className="text-lg text-ink font-bold">{currentCard.meaning}</span>
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] w-full text-center">
                      <p className="text-sm font-jp text-ink-secondary">{currentCard.example}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </div>

          {/* Difficulty Buttons */}
          {flipped && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-4 gap-2 mt-4">
              {difficultyButtons.map(d => (
                <button key={d.key} onClick={() => handleAnswer(d.key)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all cursor-pointer ${d.color}`}
                >
                  <span className="text-sm font-bold">{d.label}</span>
                  <span className="text-[9px] opacity-60">{d.time}</span>
                </button>
              ))}
            </motion.div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
