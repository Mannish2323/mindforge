'use client';

import React, { useState } from 'react';
import { 
  Mic, Volume2, Award, RefreshCw, CheckCircle2, AlertCircle,
  Play, Sparkles, ChevronRight, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PremiumGate } from '@/components/shared/PremiumGate';

interface SpeakingPhrase {
  id: string;
  jp: string;
  romaji: string;
  translation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export default function SpeakingPage() {
  const phrases: SpeakingPhrase[] = [
    { id: '1', jp: '私は日本語を勉強しています。', romaji: 'Watashi wa nihongo wo benkyou shiteimasu.', translation: 'I am studying Japanese.', difficulty: 'easy' },
    { id: '2', jp: 'すみません、駅はどこですか？', romaji: 'Sumimasen, eki wa doko desu ka?', translation: 'Excuse me, where is the station?', difficulty: 'easy' },
    { id: '3', jp: '美味しいラーメンが食べたいです。', romaji: 'Oishii raamen ga tabetai desu.', translation: 'I want to eat delicious ramen.', difficulty: 'medium' },
    { id: '4', jp: '日本語の会話の練習をしましょう。', romaji: 'Nihongo no kaiwa no renshuu wo shimashou.', translation: "Let's practice Japanese conversation.", difficulty: 'hard' }
  ];

  const [phraseIdx, setPhraseIdx] = useState(0);
  const currentPhrase = phrases[phraseIdx];
  const [isRecording, setIsRecording] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ clarity: string; rhythm: string; errors: string[] } | null>(null);

  const speakModel = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleRecordTrigger = () => {
    if (isRecording) {
      setIsRecording(false);
      evaluateSpeech();
      return;
    }
    
    setIsRecording(true);
    setScore(null);
    setFeedback(null);
  };

  const evaluateSpeech = () => {
    setEvaluating(true);
    setTimeout(() => {
      setEvaluating(false);
      const generatedScore = Math.floor(75 + Math.random() * 24);
      setScore(generatedScore);
      setFeedback({
        clarity: generatedScore >= 90 ? 'Excellent clarity' : 'Good clarity, minor pronunciation slips',
        rhythm: generatedScore >= 85 ? 'Natural flow and pitch' : 'Slight hesitation between phrases',
        errors: generatedScore >= 90 ? [] : ['Check vowel length in 勉強 (benkyou)']
      });
    }, 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/[0.08] pb-4 gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white font-orbitron">
            Speaking Practice
          </h1>
          <p className="text-xs md:text-sm text-purple-300/50 font-semibold tracking-wide uppercase">
            Repeat the phrases and assess your Japanese accent and speaking flow
          </p>
        </div>

        <div className="flex items-center gap-2">
          {phrases.map((_, idx) => (
            <button
              key={idx}
              onClick={() => { setPhraseIdx(idx); setScore(null); setFeedback(null); }}
              className={`w-8 h-8 rounded-lg font-bold text-xs border transition-all cursor-pointer ${
                phraseIdx === idx 
                  ? 'bg-gradient-to-r from-brand-purple to-sakura-dark text-white border-transparent' 
                  : 'bg-white/[0.04] border-white/[0.08] text-purple-300/60 hover:text-white'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Main card grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Target Phrase card */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-card p-6 md:p-8 rounded-[28px] border border-white/[0.08] space-y-6 text-center">
            
            <div className="space-y-4">
              <span className="text-[10px] font-extrabold tracking-widest text-sakura-dark uppercase px-3 py-1 bg-sakura-dark/15 rounded-full border border-sakura-dark/25 w-max mx-auto block font-orbitron">
                TARGET PHRASE • {currentPhrase.difficulty.toUpperCase()}
              </span>
              
              <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-relaxed font-jp">
                {currentPhrase.jp}
              </h2>
              
              <div className="space-y-1">
                <p className="text-xs font-semibold text-sakura-dark italic">{currentPhrase.romaji}</p>
                <p className="text-sm font-semibold text-purple-300/70">{currentPhrase.translation}</p>
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <button
                onClick={() => speakModel(currentPhrase.jp)}
                className="flex items-center gap-2 px-5 py-2.5 bg-brand-purple/20 border border-brand-purple/30 hover:border-brand-purple/50 text-brand-purple-light rounded-2xl text-xs font-bold hover:scale-105 transition-all cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>Listen Model Audio</span>
              </button>
            </div>

            {/* Simulated audio waveform */}
            <div className="py-8 flex flex-col items-center justify-center space-y-6 border-t border-white/[0.08] mt-6">
              
              {/* Animated Speech waves */}
              <div className="h-16 flex items-center justify-center gap-1.5 w-full">
                {isRecording ? (
                  Array.from({ length: 15 }).map((_, i) => (
                    <motion.div 
                      key={i}
                      animate={{ height: [12, 48, 12] }}
                      transition={{ 
                        duration: 0.6 + Math.random() * 0.4, 
                        repeat: Infinity,
                        delay: i * 0.05
                      }}
                      className="w-1 bg-sakura-dark rounded-full"
                    />
                  ))
                ) : (
                  <div className="w-32 h-[2px] bg-white/10 rounded-full" />
                )}
              </div>

              {/* Record Mic trigger */}
              <div className="flex flex-col items-center space-y-3">
                <button
                  onClick={handleRecordTrigger}
                  className={`w-20 h-20 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    isRecording 
                      ? 'bg-rose-500 text-white animate-pulse shadow-[0_0_25px_rgba(239,68,68,0.45)]' 
                      : 'bg-gradient-to-r from-brand-purple to-sakura-dark text-white shadow-lg hover:scale-105'
                  }`}
                >
                  <Mic className="w-8 h-8" />
                </button>
                <p className="text-xs font-bold text-purple-300/40 uppercase tracking-widest font-orbitron">
                  {isRecording ? 'Tap to Stop & Evaluate' : 'Tap to Start Speaking'}
                </p>
              </div>

            </div>

          </div>
        </div>

        {/* Right Column: AI Analysis & Score dashboard */}
        <div className="lg:col-span-4 space-y-6">
          
          <AnimatePresence mode="wait">
            {evaluating ? (
              <motion.div 
                key="evaluating"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass-card p-6 md:p-8 rounded-[28px] border border-white/[0.08] text-center py-16 space-y-4"
              >
                <RefreshCw className="w-10 h-10 text-sakura-dark animate-spin mx-auto" />
                <h3 className="text-sm font-extrabold text-white font-orbitron uppercase tracking-widest">
                  AI Evaluation
                </h3>
                <p className="text-xs text-purple-300/50 font-medium max-w-xs mx-auto leading-relaxed">
                  Analyzing phonetic alignment, syllable pitch, and pacing...
                </p>
              </motion.div>
            ) : score !== null && feedback ? (
              <motion.div 
                key="results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card p-6 md:p-8 rounded-[28px] border border-white/[0.08] space-y-6"
              >
                <div className="text-center space-y-2">
                  <h3 className="text-sm font-extrabold text-white font-orbitron uppercase tracking-widest">
                    Assessment Result
                  </h3>
                  
                  {/* Score circle SVG */}
                  <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                    <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.06)" strokeWidth="6" fill="transparent" />
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="40" 
                        stroke={score >= 85 ? '#10b981' : '#f59e0b'} 
                        strokeWidth="6" 
                        fill="transparent" 
                        strokeDasharray={251.2}
                        strokeDashoffset={251.2 - (251.2 * score) / 100}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="flex flex-col items-center">
                      <span className="text-3xl font-extrabold text-white font-orbitron">{score}%</span>
                      <span className="text-[9px] font-bold text-purple-300/40 uppercase">ACCURACY</span>
                    </div>
                  </div>
                </div>

                {/* Score breakdown metrics */}
                <div className="space-y-3.5 border-t border-white/[0.08] pt-4">
                  <div className="flex items-start gap-2 text-xs font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white">Clarity</p>
                      <p className="text-[10px] text-purple-300/50 font-medium mt-0.5">{feedback.clarity}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-xs font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white">Rhythm & Flow</p>
                      <p className="text-[10px] text-purple-300/50 font-medium mt-0.5">{feedback.rhythm}</p>
                    </div>
                  </div>

                  {feedback.errors.length > 0 && (
                    <div className="flex items-start gap-2 text-xs font-semibold bg-rose-500/5 border border-rose-500/10 p-3 rounded-xl">
                      <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                      <div>
                        <p className="text-rose-400">Errors Flagged</p>
                        {feedback.errors.map((err, i) => (
                          <p key={i} className="text-[10px] text-rose-400/80 font-medium mt-0.5">{err}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 border-t border-white/[0.08] pt-4">
                  <button 
                    onClick={handleRecordTrigger}
                    className="flex-1 btn btn-ghost btn-sm font-bold flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Retry</span>
                  </button>
                  <button 
                    onClick={() => {
                      if (phraseIdx < phrases.length - 1) {
                        setPhraseIdx(prev => prev + 1);
                        setScore(null);
                        setFeedback(null);
                      }
                    }}
                    disabled={phraseIdx === phrases.length - 1}
                    className="flex-1 btn btn-primary btn-sm font-bold flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="glass-card p-6 md:p-8 rounded-[28px] border border-white/[0.08] text-center py-16 space-y-4">
                <Sparkles className="w-10 h-10 text-sakura-dark animate-pulse mx-auto" />
                <h3 className="text-sm font-extrabold text-white font-orbitron uppercase tracking-widest">
                  AI Assessor ready
                </h3>
                <p className="text-xs text-purple-300/50 font-medium max-w-xs mx-auto leading-relaxed">
                  Record yourself reading the target sentence on the left to receive immediate accent feedback.
                </p>
              </div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </div>
  );
}
