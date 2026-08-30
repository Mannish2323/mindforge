'use client';

import React, { useState } from 'react';
import { 
  Book, Search, Volume2, Bookmark, BookmarkCheck, Sparkles, 
  HelpCircle, ChevronRight, CheckCircle2, ChevronLeft, Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MFCard } from '@/components/ui/MFCard';
import { MFButton } from '@/components/ui/MFButton';
import { MFIcon } from '@/components/ui/MFIcon';

interface GrammarPoint {
  id: string;
  structure: string;
  romaji: string;
  meaning: string;
  explanation: string;
  category: 'particle' | 'verb' | 'adjective' | 'conjunction';
  examples: { jp: string; romaji: string; en: string }[];
}

export default function GrammarPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSuccess, setQuizSuccess] = useState<boolean | null>(null);

  const grammarList: GrammarPoint[] = [
    {
      id: 'g1',
      structure: '～は～です (wa... desu)',
      romaji: 'A wa B desu',
      meaning: 'A is B',
      explanation: 'Used to define the subject. は (pronounced wa) is the topic marker, and です (desu) asserts the statement politely.',
      category: 'particle',
      examples: [
        { jp: '私は学生です。', romaji: 'Watashi wa gakusei desu.', en: 'I am a student.' },
        { jp: 'これは本です。', romaji: 'Kore wa hon desu.', en: 'This is a book.' }
      ]
    },
    {
      id: 'g2',
      structure: '～てください (te kudasai)',
      romaji: 'Verb [te-form] + kudasai',
      meaning: 'Please do...',
      explanation: 'Used to make a polite request. Conjugate the verb to its て-form and append ください.',
      category: 'verb',
      examples: [
        { jp: '日本語で話してください。', romaji: 'Nihongo de hanashite kudasai.', en: 'Please speak in Japanese.' },
        { jp: 'ここに来てください。', romaji: 'Koko ni kite kudasai.', en: 'Please come here.' }
      ]
    },
    {
      id: 'g3',
      structure: '～がほしい (ga hoshii)',
      romaji: 'Noun + ga hoshii',
      meaning: 'Want something',
      explanation: 'Used to express a desire for an object. The target item is marked by particle が followed by ほしい.',
      category: 'adjective',
      examples: [
        { jp: 'お水がほしいです。', romaji: 'Omizu ga hoshii desu.', en: 'I want water.' },
        { jp: '新しい本がほしいです。', romaji: 'Atarashii hon ga hoshii desu.', en: 'I want a new book.' }
      ]
    }
  ];

  const quizQuestions: Record<string, { q: string; opts: string[]; correctIdx: number }> = {
    g1: {
      q: "Fill in the blank: 私はアメリカ人___です。",
      opts: ["が (ga)", "を (wo)", "は (wa)", "に (in)"],
      correctIdx: 2
    },
    g2: {
      q: "Which verb conjugate forms are used before ください for request?",
      opts: ["Masu form", "Dictionary form", "Te-form", "Nai form"],
      correctIdx: 2
    },
    g3: {
      q: "Translate 'I want water' to Japanese:",
      opts: ["お水を食べます (omizu wo tabemasu)", "お水がほしいです (omizu ga hoshii desu)", "お水があります (omizu ga arimasu)"],
      correctIdx: 1
    }
  };

  const speakJapanese = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleSave = (id: string) => {
    setSavedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const triggerQuiz = (id: string) => {
    setActiveQuizId(prev => prev === id ? null : id);
    setQuizAnswer(null);
    setQuizSuccess(null);
  };

  const handleSelectQuizOption = (idx: number, correctIdx: number) => {
    setQuizAnswer(idx);
    setQuizSuccess(idx === correctIdx);
  };

  const filteredGrammar = grammarList.filter(item => {
    const matchesSearch = 
      item.structure.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.explanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.romaji.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-7 md:space-y-9 max-w-5xl mx-auto pb-14">
      {/* Top Study Sheet Banner */}
      <MFCard variant="mint" washiTape="mint" padding="lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-card border border-edge text-xs font-extrabold text-brand shadow-sm">
              <MFIcon name="grammar" size={16} />
              <span>JLPT Grammar Reference</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-ink font-heading">
              Japanese Grammar Patterns
            </h1>
            <p className="text-xs sm:text-sm text-ink-secondary font-medium max-w-xl leading-relaxed">
              Master Japanese particles, verb conjugations, and sentence structures with authentic examples and interactive checkpoint quizzes.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-card border border-edge rounded-2xl shadow-sm shrink-0">
            {(['all', 'particle', 'verb', 'adjective'] as const).map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all capitalize cursor-pointer ${
                    isActive 
                      ? 'bg-brand text-white shadow-[var(--paper-press-shadow)]' 
                      : 'text-ink-muted hover:text-ink hover:bg-cream'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </MFCard>

      {/* Search Input filter bar */}
      <div className="relative max-w-xl">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
        <input
          type="text"
          placeholder="Search by grammar structure, definition or meanings..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-card border-[1.5px] border-edge hover:border-edge-hover rounded-2xl pl-10 pr-4 h-12 text-xs font-semibold text-ink placeholder-ink-muted outline-none focus:border-brand transition-all shadow-sm"
        />
      </div>

      {/* Grammar point grid timeline */}
      {filteredGrammar.length === 0 ? (
        <MFCard variant="cream" padding="lg" className="text-center">
          <Book className="w-12 h-12 text-ink-muted mx-auto mb-3 opacity-40" />
          <h3 className="text-base font-bold text-ink font-heading">No Grammar Points found</h3>
          <p className="text-xs text-ink-muted mt-1">Try a different search query.</p>
        </MFCard>
      ) : (
        <div className="space-y-5">
          {filteredGrammar.map((grammar) => {
            const isSaved = savedIds.includes(grammar.id);
            const isQuizActive = activeQuizId === grammar.id;
            const quiz = quizQuestions[grammar.id];

            return (
              <MFCard 
                key={grammar.id}
                variant="paper"
                lifted
                padding="lg"
                className="space-y-4"
              >
                {/* Header structure row */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black tracking-wider text-brand uppercase px-2.5 py-0.5 bg-brand-light rounded-md border border-brand/30">
                      {grammar.category.toUpperCase()}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-ink font-jp mt-1.5">{grammar.structure}</h3>
                    <p className="text-xs text-ink-muted italic font-medium">{grammar.romaji}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleSave(grammar.id)}
                      className="p-2.5 bg-cream border border-edge hover:border-edge-hover rounded-xl text-ink transition-all cursor-pointer"
                      title="Bookmark"
                    >
                      {isSaved ? <BookmarkCheck className="w-4 h-4 text-brand" /> : <Bookmark className="w-4 h-4" />}
                    </button>
                    <MFButton
                      variant={isQuizActive ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => triggerQuiz(grammar.id)}
                    >
                      {isQuizActive ? 'Close Quiz' : 'Quiz Check'}
                    </MFButton>
                  </div>
                </div>

                {/* Explanation text */}
                <div className="space-y-1.5 border-t border-dashed border-edge pt-3 leading-relaxed">
                  <p className="text-[10px] font-extrabold text-ink-muted uppercase tracking-wider">Meaning & Usage</p>
                  <p className="text-sm font-bold text-ink">{grammar.meaning}</p>
                  <p className="text-xs text-ink-secondary font-medium leading-relaxed">{grammar.explanation}</p>
                </div>

                {/* Examples */}
                <div className="space-y-2.5 pt-2">
                  <p className="text-[10px] font-extrabold text-ink-muted uppercase tracking-wider">Example Sentences</p>
                  <div className="space-y-2">
                    {grammar.examples.map((ex, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-cream border border-edge">
                        <div className="space-y-0.5">
                          <p className="text-sm font-bold text-ink font-jp">{ex.jp}</p>
                          <p className="text-[11px] text-ink-muted italic font-medium">{ex.romaji}</p>
                          <p className="text-xs font-semibold text-ink-secondary">{ex.en}</p>
                        </div>
                        <button
                          onClick={() => speakJapanese(ex.jp)}
                          className="p-2 rounded-xl bg-card border border-edge hover:border-edge-hover text-ink transition-all cursor-pointer shrink-0"
                          title="Listen"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interactive Checkpoint Quiz */}
                <AnimatePresence>
                  {isQuizActive && quiz && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 sm:p-5 rounded-2xl bg-yellow-light/50 border border-yellow/40 space-y-3 pt-4 overflow-hidden"
                    >
                      <div className="flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-orange" />
                        <h4 className="font-heading font-extrabold text-xs text-ink uppercase tracking-wider">Quick Mastery Quiz</h4>
                      </div>
                      <p className="text-xs font-bold text-ink">{quiz.q}</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {quiz.opts.map((opt, oIdx) => {
                          const isPicked = quizAnswer === oIdx;
                          const isCorrect = oIdx === quiz.correctIdx;

                          let btnClass = 'bg-card border-edge text-ink hover:border-brand';
                          if (quizAnswer !== null) {
                            if (isCorrect) btnClass = 'bg-mint-light border-mint text-ink font-bold';
                            else if (isPicked) btnClass = 'bg-coral-light border-coral text-ink font-bold';
                          }

                          return (
                            <button
                              key={oIdx}
                              onClick={() => handleSelectQuizOption(oIdx, quiz.correctIdx)}
                              className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer ${btnClass}`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {quizSuccess !== null && (
                        <div className={`p-2.5 rounded-xl text-xs font-bold ${quizSuccess ? 'text-mint' : 'text-coral'}`}>
                          {quizSuccess ? 'Correct answer! Excellent Japanese grammar retention.' : 'Not quite. Check the structure rule above and try again!'}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </MFCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
