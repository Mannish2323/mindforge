'use client';

import React, { useState } from 'react';
import { 
  Book, Search, Volume2, Bookmark, BookmarkCheck, Sparkles, 
  HelpCircle, ChevronRight, CheckCircle2, ChevronLeft, Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    setActiveQuizId(id);
    setQuizAnswer(null);
    setQuizSuccess(null);
  };

  const submitAnswer = (idx: number, correctIdx: number) => {
    setQuizAnswer(idx);
    const success = idx === correctIdx;
    setQuizSuccess(success);
  };

  const filteredGrammar = grammarList.filter(g => {
    const matchesSearch = 
      g.structure.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.explanation.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCat = selectedCategory === 'all' || g.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-8">
      {/* Header title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/5 pb-4 gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white font-orbitron">
            Grammar Reference
          </h1>
          <p className="text-xs md:text-sm text-purple-300/50 font-semibold tracking-wide uppercase">
            Learn Japanese sentence structures, particles rules and grammar patterns
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-white/5 border border-white/10 rounded-2xl">
          {(['all', 'particle', 'verb', 'adjective'] as const).map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all capitalize cursor-pointer ${
                  isActive 
                    ? 'bg-gradient-to-r from-brand-purple to-sakura-dark text-white shadow-md' 
                    : 'text-purple-300/60 hover:text-white'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Input filter bar */}
      <div className="relative max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300/40" />
        <input
          type="text"
          placeholder="Search by grammar structure, definition or meanings..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-xl pl-11 pr-5 h-12 text-sm placeholder-purple-300/30 text-white outline-none focus:border-brand-purple/60 focus:ring-1 focus:ring-brand-purple/20 transition-all"
        />
      </div>

      {/* Grammar point grid timeline */}
      {filteredGrammar.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-[28px] border border-white/5">
          <Book className="w-12 h-12 text-purple-300/20 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white font-orbitron">No Grammar Points found</h3>
          <p className="text-xs text-purple-300/40 mt-1">Try a different search query.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredGrammar.map((grammar) => {
            const isSaved = savedIds.includes(grammar.id);
            const isQuizActive = activeQuizId === grammar.id;
            const quiz = quizQuestions[grammar.id];

            return (
              <div 
                key={grammar.id}
                className="glass-card p-6 md:p-8 rounded-[28px] border border-white/5 space-y-6 hover:border-white/10 transition-all"
              >
                {/* Header structure row */}
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold tracking-widest text-sakura-dark uppercase px-2 py-0.5 bg-sakura-dark/15 rounded border border-sakura-dark/25">
                      {grammar.category.toUpperCase()}
                    </span>
                    <h3 className="text-xl md:text-2xl font-extrabold text-white font-jp mt-2">{grammar.structure}</h3>
                    <p className="text-xs text-purple-300/50 italic font-semibold">{grammar.romaji}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleSave(grammar.id)}
                      className="p-3 bg-white/5 border border-white/5 hover:border-white/10 rounded-xl text-purple-300 hover:text-white transition-all cursor-pointer"
                    >
                      {isSaved ? <BookmarkCheck className="w-4 h-4 text-sakura-dark" /> : <Bookmark className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => triggerQuiz(grammar.id)}
                      className="btn btn-ghost btn-sm font-bold cursor-pointer"
                    >
                      Quiz Test
                    </button>
                  </div>
                </div>

                {/* Explanation text */}
                <div className="space-y-2 border-t border-white/5 pt-4 leading-relaxed font-semibold">
                  <p className="text-xs text-purple-300/40 font-bold uppercase tracking-wider">DEFINITION</p>
                  <p className="text-sm text-purple-100/90">{grammar.meaning}</p>
                  <p className="text-xs text-purple-300/60 font-medium leading-relaxed">{grammar.explanation}</p>
                </div>

                {/* Examples */}
                <div className="space-y-3 pt-2">
                  <p className="text-xs text-purple-300/40 font-bold uppercase tracking-wider">FOCUS EXAMPLES</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {grammar.examples.map((ex, idx) => (
                      <div 
                        key={idx}
                        className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl flex items-center justify-between"
                      >
                        <div>
                          <p className="text-sm font-bold text-white font-jp">{ex.jp}</p>
                          <p className="text-[10px] text-purple-300/45 italic font-semibold">{ex.romaji}</p>
                          <p className="text-xs text-purple-300/80 font-medium mt-1">{ex.en}</p>
                        </div>
                        <button
                          onClick={() => speakJapanese(ex.jp)}
                          className="p-2 text-purple-300/40 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dynamic micro quiz */}
                <AnimatePresence>
                  {isQuizActive && quiz && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="p-6 bg-brand-purple/10 border border-brand-purple/20 rounded-3xl mt-4 space-y-4 overflow-hidden"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-extrabold text-white font-orbitron">Micro Quiz</h4>
                        <button 
                          onClick={() => setActiveQuizId(null)}
                          className="text-xs text-purple-300/40 hover:text-white cursor-pointer"
                        >
                          Close
                        </button>
                      </div>
                      
                      <p className="text-sm font-bold text-purple-100">{quiz.q}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                        {quiz.opts.map((opt, idx) => {
                          const isSelected = quizAnswer === idx;
                          const isCorrect = idx === quiz.correctIdx;
                          let btnStyle = 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04] text-purple-300';
                          
                          if (quizAnswer !== null) {
                            if (isCorrect) btnStyle = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
                            else if (isSelected) btnStyle = 'bg-rose-500/10 border-rose-500/30 text-rose-400';
                          }

                          return (
                            <button
                              key={idx}
                              disabled={quizAnswer !== null}
                              onClick={() => submitAnswer(idx, quiz.correctIdx)}
                              className={`p-3.5 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${btnStyle}`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {quizSuccess !== null && (
                        <div className="pt-2 text-xs font-bold">
                          {quizSuccess ? (
                            <p className="text-emerald-400">✨ Correct answer! Excellent grammar retention!</p>
                          ) : (
                            <p className="text-rose-400">❌ Incorrect. Review explanation parameters and try again.</p>
                          )}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
