'use client';

import React, { useState, useEffect } from 'react';
import { 
  Award, HelpCircle, Layers, CheckSquare, RefreshCw, Star, 
  ChevronRight, Timer, Play, CheckCircle2, XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuizQuestion {
  id: string;
  type: 'mcq' | 'typing' | 'match';
  question: string;
  options?: string[]; // for mcq
  correctAnswer: string; // text or option index
  matchPairs?: { left: string; right: string }[]; // for match type
}

export default function QuizPage() {
  const [activeQuizType, setActiveQuizType] = useState<'mcq' | 'match' | null>(null);
  const [quizIndex, setQuizIndex] = useState(0);
  const [timer, setTimer] = useState(60);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [typingInput, setTypingInput] = useState('');
  const [submittedTyping, setSubmittedTyping] = useState(false);
  
  // Matching Game States
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]); // left strings

  // Score stats
  const [correctCount, setCorrectCount] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const mcqQuestions: QuizQuestion[] = [
    { id: '1', type: 'mcq', question: "What is the translation for おはようございます?", options: ["Good afternoon", "Good evening", "Good morning", "Goodbye"], correctAnswer: "2" },
    { id: '2', type: 'mcq', question: "Which particle acts as the direct object marker?", options: ["は (wa)", "を (wo)", "が (ga)", "に (ni)"], correctAnswer: "1" },
    { id: '3', type: 'mcq', question: "What does 水 (mizu) mean?", options: ["Fire", "Tree", "Water", "Gold"], correctAnswer: "2" }
  ];

  const matchingPairs = [
    { left: "猫 (neko)", right: "Cat" },
    { left: "犬 (inu)", right: "Dog" },
    { left: "本 (hon)", right: "Book" },
    { left: "水 (mizu)", right: "Water" }
  ];

  // Timer interval hook
  useEffect(() => {
    if (activeQuizType && !quizFinished && timer > 0) {
      const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setQuizFinished(true);
    }
  }, [activeQuizType, quizFinished, timer]);

  const selectMCQAnswer = (idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    if (String(idx) === mcqQuestions[quizIndex].correctAnswer) {
      setCorrectCount(prev => prev + 1);
    }
  };

  const handleNextMCQ = () => {
    setSelectedAnswer(null);
    if (quizIndex < mcqQuestions.length - 1) {
      setQuizIndex(prev => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const selectMatchItem = (val: string, side: 'left' | 'right') => {
    if (side === 'left') {
      setSelectedLeft(val);
      // Evaluate if matched
      const match = matchingPairs.find(p => p.left === val);
      if (match && selectedRight === match.right) {
        setMatchedPairs(prev => [...prev, val]);
        setCorrectCount(prev => prev + 1);
        setSelectedLeft(null);
        setSelectedRight(null);
      }
    } else {
      setSelectedRight(val);
      const match = matchingPairs.find(p => p.right === val);
      if (match && selectedLeft === match.left) {
        setMatchedPairs(prev => [...prev, match.left]);
        setCorrectCount(prev => prev + 1);
        setSelectedLeft(null);
        setSelectedRight(null);
      }
    }
  };

  useEffect(() => {
    if (activeQuizType === 'match' && matchedPairs.length === matchingPairs.length) {
      setQuizFinished(true);
    }
  }, [matchedPairs, activeQuizType]);

  const resetQuiz = () => {
    setQuizIndex(0);
    setTimer(60);
    setSelectedAnswer(null);
    setTypingInput('');
    setSubmittedTyping(false);
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatchedPairs([]);
    setCorrectCount(0);
    setQuizFinished(false);
  };

  const startQuiz = (type: 'mcq' | 'match') => {
    resetQuiz();
    setActiveQuizType(type);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* Header section */}
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white font-orbitron">
          Quiz Arena
        </h1>
        <p className="text-xs md:text-sm text-purple-300/50 font-semibold tracking-wide uppercase">
          Test your vocabulary and grammar alignment in real-time challenges
        </p>
      </div>

      {/* Mode selection if no active quiz */}
      {activeQuizType === null ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* MCQ challenge card */}
          <div className="glass-card p-6 md:p-8 rounded-[28px] border border-white/5 flex flex-col justify-between space-y-6 hover:border-brand-purple/30 hover:bg-brand-purple/5 transition-all">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white font-orbitron">MCQ challenge</h3>
              <p className="text-xs text-purple-300/50 font-medium leading-relaxed">
                Test your knowledge with multiple choice grammar and vocabulary structures. 3 Questions, 60 seconds.
              </p>
            </div>
            <button
              onClick={() => startQuiz('mcq')}
              className="btn btn-primary w-full btn-sm font-bold flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>Start Challenge</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Match Pairs Challenge card */}
          <div className="glass-card p-6 md:p-8 rounded-[28px] border border-white/5 flex flex-col justify-between space-y-6 hover:border-brand-purple/30 hover:bg-brand-purple/5 transition-all">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white font-orbitron">Match Pairs</h3>
              <p className="text-xs text-purple-300/50 font-medium leading-relaxed">
                Match Japanese terms and kanji characters directly with their English definitions in a grid.
              </p>
            </div>
            <button
              onClick={() => startQuiz('match')}
              className="btn btn-accent w-full btn-sm font-bold flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>Start Matching</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Quiz Gameplay Panel */
        <div className="glass-card p-6 md:p-8 rounded-[28px] border border-white/5 space-y-6 relative overflow-hidden">
          
          {/* Top toolbar */}
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-300/40 uppercase">
              <span>Challenge: {activeQuizType.toUpperCase()}</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs font-bold font-orbitron">
                <Timer className="w-4 h-4 animate-pulse" />
                <span>{timer}s</span>
              </div>
              <button 
                onClick={() => setActiveQuizType(null)}
                className="text-purple-300/40 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Gameplay Switcher */}
          {!quizFinished ? (
            <div className="space-y-6">
              {activeQuizType === 'mcq' && (
                <div className="space-y-6">
                  <div className="flex justify-between text-xs font-bold text-purple-300/40 uppercase">
                    <span>Question {quizIndex + 1} of {mcqQuestions.length}</span>
                    <span>SCORE: {correctCount}</span>
                  </div>

                  <h3 className="text-lg md:text-xl font-bold text-white leading-relaxed font-jp">
                    {mcqQuestions[quizIndex].question}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mcqQuestions[quizIndex].options?.map((opt, idx) => {
                      const isSelected = selectedAnswer === idx;
                      const isCorrect = String(idx) === mcqQuestions[quizIndex].correctAnswer;
                      let btnStyle = 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04] text-purple-300';

                      if (selectedAnswer !== null) {
                        if (isCorrect) btnStyle = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
                        else if (isSelected) btnStyle = 'bg-rose-500/10 border-rose-500/30 text-rose-400';
                      }

                      return (
                        <button
                          key={idx}
                          disabled={selectedAnswer !== null}
                          onClick={() => selectMCQAnswer(idx)}
                          className={`p-4 rounded-xl border text-left text-sm font-semibold transition-all cursor-pointer ${btnStyle}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex justify-end pt-4 border-t border-white/5">
                    <button
                      disabled={selectedAnswer === null}
                      onClick={handleNextMCQ}
                      className="btn btn-primary btn-sm font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span>{quizIndex === mcqQuestions.length - 1 ? 'Finish Challenge' : 'Next'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {activeQuizType === 'match' && (
                <div className="space-y-6">
                  <div className="flex justify-between text-xs font-bold text-purple-300/40 uppercase border-b border-white/5 pb-3">
                    <span>Grid Match</span>
                    <span>MATCHED: {matchedPairs.length} / {matchingPairs.length}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-6 py-4">
                    {/* Left Column Japanese */}
                    <div className="space-y-3">
                      <p className="text-[10px] font-extrabold tracking-widest text-purple-300/40 uppercase text-center mb-1">
                        JAPANESE TERMS
                      </p>
                      {matchingPairs.map(p => {
                        const isMatched = matchedPairs.includes(p.left);
                        const isSelected = selectedLeft === p.left;
                        let itemStyle = 'bg-white/[0.02] border-white/5 hover:border-brand-purple/20 text-white hover:bg-white/[0.05]';
                        
                        if (isMatched) itemStyle = 'opacity-30 border-emerald-500/20 text-emerald-400 bg-emerald-500/5 cursor-not-allowed';
                        else if (isSelected) itemStyle = 'bg-brand-purple/20 border-brand-purple/40 text-brand-purple-light shadow-[0_0_10px_rgba(124,58,237,0.2)] scale-102';

                        return (
                          <button
                            key={p.left}
                            disabled={isMatched}
                            onClick={() => selectMatchItem(p.left, 'left')}
                            className={`w-full p-4 rounded-xl border text-center text-sm font-bold font-jp transition-all cursor-pointer ${itemStyle}`}
                          >
                            {p.left}
                          </button>
                        );
                      })}
                    </div>

                    {/* Right Column Definitions */}
                    <div className="space-y-3">
                      <p className="text-[10px] font-extrabold tracking-widest text-purple-300/40 uppercase text-center mb-1">
                        ENGLISH DEFINITIONS
                      </p>
                      {matchingPairs.map(p => {
                        const isMatched = matchedPairs.some(mp => {
                          const matching = matchingPairs.find(x => x.left === mp);
                          return matching?.right === p.right;
                        });
                        const isSelected = selectedRight === p.right;
                        let itemStyle = 'bg-white/[0.02] border-white/5 hover:border-brand-purple/20 text-white hover:bg-white/[0.05]';
                        
                        if (isMatched) itemStyle = 'opacity-30 border-emerald-500/20 text-emerald-400 bg-emerald-500/5 cursor-not-allowed';
                        else if (isSelected) itemStyle = 'bg-brand-purple/20 border-brand-purple/40 text-brand-purple-light shadow-[0_0_10px_rgba(124,58,237,0.2)] scale-102';

                        return (
                          <button
                            key={p.right}
                            disabled={isMatched}
                            onClick={() => selectMatchItem(p.right, 'right')}
                            className={`w-full p-4 rounded-xl border text-center text-sm font-bold transition-all cursor-pointer ${itemStyle}`}
                          >
                            {p.right}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Quiz Score results summary */
            <div className="text-center py-10 space-y-6 max-w-sm mx-auto">
              <div className="space-y-2">
                <Award className="w-16 h-16 text-yellow-400 mx-auto animate-bounce" />
                <h3 className="text-2xl font-extrabold text-white font-orbitron">Challenge Cleared!</h3>
                <p className="text-xs text-purple-300/50 font-semibold leading-relaxed">
                  Time left: {timer} seconds. Correct matches/answers: {correctCount}.
                </p>
              </div>

              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl text-xs font-bold">
                🎉 Earned +25 XP and +5 gems reward.
              </div>

              <div className="flex gap-4 pt-4 border-t border-white/5">
                <button
                  onClick={resetQuiz}
                  className="flex-1 btn btn-ghost btn-sm font-bold flex items-center justify-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Retry Quiz</span>
                </button>
                <button
                  onClick={() => setActiveQuizType(null)}
                  className="flex-1 btn btn-primary btn-sm font-bold cursor-pointer"
                >
                  Exit Arena
                </button>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
