'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Eye, RotateCcw, Check } from 'lucide-react';
import { MFCard } from '@/components/ui/MFCard';
import { MFButton } from '@/components/ui/MFButton';
import { MFIcon } from '@/components/ui/MFIcon';

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
      setTimeout(() => setCurrentIndex(prev => prev + 1), 250);
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
  const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

  const difficultyButtons: { key: Difficulty; label: string; btnClass: string; time: string; iconName: string; color: string }[] = [
    { key: 'again', label: 'Again', btnClass: 'srs-btn-again', time: '<1m', iconName: 'review', color: 'bg-coral-light/50 border-coral/30 text-coral' },
    { key: 'hard', label: 'Hard', btnClass: 'srs-btn-hard', time: '6m', iconName: 'zap', color: 'bg-orange-light/50 border-orange/30 text-orange' },
    { key: 'good', label: 'Good', btnClass: 'srs-btn-good', time: '10m', iconName: 'check', color: 'bg-sky-light/50 border-sky/30 text-sky' },
    { key: 'easy', label: 'Easy', btnClass: 'srs-btn-easy', time: '4d', iconName: 'sparkles', color: 'bg-mint-light/50 border-mint/30 text-mint' },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-7 md:space-y-9 max-w-2xl mx-auto pb-14">
      {/* Top Banner */}
      <MFCard variant="sakura" washiTape="pink" padding="lg">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-card border border-edge text-xs font-extrabold text-brand shadow-sm">
              <MFIcon name="review" size={16} />
              <span>Smart SRS Vault</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink font-heading tracking-tight">
              Spaced Repetition Review
            </h1>
            <p className="text-xs text-ink-secondary font-medium">{totalCards} cards due for recall today</p>
          </div>
        </div>
      </MFCard>

      {/* Progress Bar */}
      <motion.div variants={item} className="space-y-2">
        <div className="flex justify-between text-xs font-bold text-ink-muted">
          <span>Session Progress</span>
          <span className="text-brand">{reviewed.size} / {totalCards} cards</span>
        </div>
        <div className="h-3 w-full bg-cream rounded-full overflow-hidden border border-edge shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-brand to-coral rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-1.5 pt-1">
          {REVIEW_CARDS.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i < reviewed.size ? 'bg-brand scale-100' :
                i === currentIndex && !sessionDone ? 'bg-brand/50 scale-125' :
                'bg-cream border border-edge'
              }`}
            />
          ))}
        </div>
      </motion.div>

      {sessionDone ? (
        <motion.div variants={item}>
          <MFCard variant="mint" washiTape="mint" padding="lg" className="text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-mint text-white flex items-center justify-center mx-auto shadow-sm">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-ink font-heading">Session Complete!</h2>
              <p className="text-xs text-ink-secondary font-medium mt-1">You reviewed all {totalCards} flashcards for today.</p>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {difficultyButtons.map(d => {
                const count = Object.values(results).filter(r => r === d.key).length;
                return (
                  <div key={d.key} className={`p-2.5 rounded-2xl border ${d.color}`}>
                    <span className="text-lg font-black text-ink block">{count}</span>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider">{d.label}</span>
                  </div>
                );
              })}
            </div>
            <MFButton variant="primary" size="md" onClick={restart} leftIcon={<RotateCcw className="w-4 h-4" />}>
              Review Again
            </MFButton>
          </MFCard>
        </motion.div>
      ) : (
        <motion.div variants={item} className="space-y-4">
          {/* 3D Flashcard */}
          <div
            className="card-flip-container w-full cursor-pointer select-none"
            style={{ height: '300px' }}
            onClick={() => setFlipped(!flipped)}
          >
            <div className={`card-flip-inner ${flipped ? 'flipped' : ''}`}>
              {/* Front */}
              <div className="card-flip-front">
                <MFCard variant="paper" lifted padding="none" className="h-full border-[2px]">
                  <div className="flex flex-col items-center justify-center h-full p-8 space-y-5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-brand px-2.5 py-0.5 rounded-md bg-brand-light border border-brand/30">
                      Card {currentIndex + 1} of {totalCards}
                    </span>
                    <span className="text-5xl sm:text-7xl font-black font-jp text-ink">{currentCard.kanji}</span>
                    <div className="flex items-center gap-2 text-xs text-ink-muted font-medium">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Tap to flip card</span>
                    </div>
                  </div>
                </MFCard>
              </div>
              {/* Back */}
              <div className="card-flip-back">
                <MFCard variant="mint" lifted padding="none" className="h-full border-[2px]">
                  <div className="flex flex-col items-center justify-center h-full p-8 space-y-3 text-center">
                    <span className="text-2xl font-black font-jp text-ink">{currentCard.kanji}</span>
                    <span className="text-xl text-brand font-bold italic">{currentCard.romaji}</span>
                    <span className="text-lg font-black text-ink">{currentCard.meaning}</span>
                    <div className="p-3 rounded-2xl bg-card/80 border border-edge w-full mt-2">
                      <p className="text-sm font-bold font-jp text-ink-secondary">{currentCard.example}</p>
                    </div>
                  </div>
                </MFCard>
              </div>
            </div>
          </div>

          {/* SRS Difficulty Buttons */}
          {flipped && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-4 gap-2">
              {difficultyButtons.map(d => (
                <button 
                  key={d.key} 
                  onClick={() => handleAnswer(d.key)}
                  className={`flex flex-col items-center gap-1 px-2 py-3 transition-all cursor-pointer ${d.btnClass}`}
                >
                  <MFIcon name={d.iconName as any} size={24} />
                  <span className="text-xs font-black mt-1">{d.label}</span>
                  <span className="text-[9px] font-bold opacity-70">{d.time}</span>
                </button>
              ))}
            </motion.div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
