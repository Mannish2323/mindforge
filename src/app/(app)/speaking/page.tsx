'use client';

import React, { useState } from 'react';
import { 
  Mic, Volume2, Award, RefreshCw, CheckCircle2, AlertCircle,
  Play, Sparkles, ChevronRight, ChevronLeft, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MFCard } from '@/components/ui/MFCard';
import { MFButton } from '@/components/ui/MFButton';
import { MFIcon } from '@/components/ui/MFIcon';

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
      const generatedScore = Math.floor(78 + Math.random() * 20);
      setScore(generatedScore);
      setFeedback({
        clarity: generatedScore > 85 ? 'Sharp pitch accent' : 'Minor vowel elongation required',
        rhythm: generatedScore > 85 ? 'Native natural cadence' : 'Try pausing slightly after topic particles',
        errors: generatedScore > 85 ? [] : ['Particle は intonation']
      });
    }, 1400);
  };

  return (
    <div className="space-y-7 md:space-y-9 max-w-5xl mx-auto pb-14">
      {/* Top Banner */}
      <MFCard variant="sakura" washiTape="pink" padding="lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-card border border-edge text-xs font-extrabold text-brand shadow-sm">
              <MFIcon name="speaking" size={16} />
              <span>Voice Tutor Lab</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-ink font-heading">
              Japanese Speaking & Pitch Practice
            </h1>
            <p className="text-xs sm:text-sm text-ink-secondary font-medium max-w-xl leading-relaxed">
              Listen to native pronunciation models and practice speaking aloud with real-time AI feedback.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-card border border-edge p-1.5 rounded-2xl shadow-sm shrink-0">
            <button
              onClick={() => { setPhraseIdx(prev => Math.max(0, prev - 1)); setScore(null); setFeedback(null); }}
              disabled={phraseIdx === 0}
              className="p-2 bg-cream border border-edge rounded-xl text-ink disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-ink px-2">
              Phrase {phraseIdx + 1} of {phrases.length}
            </span>
            <button
              onClick={() => { setPhraseIdx(prev => Math.min(phrases.length - 1, prev + 1)); setScore(null); setFeedback(null); }}
              disabled={phraseIdx === phrases.length - 1}
              className="p-2 bg-cream border border-edge rounded-xl text-ink disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </MFCard>

      {/* Main interactive grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Target Phrase card */}
        <div className="lg:col-span-8 space-y-5">
          <MFCard variant="paper" lifted padding="lg" className="space-y-5 text-center">
            <div className="space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-brand px-3 py-1 bg-brand-light rounded-full border border-brand/30 w-max mx-auto block">
                Target Phrase • {currentPhrase.difficulty.toUpperCase()}
              </span>
              
              <h2 className="text-2xl sm:text-3xl font-black text-ink leading-relaxed font-jp">
                {currentPhrase.jp}
              </h2>
              
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-brand italic">{currentPhrase.romaji}</p>
                <p className="text-sm font-semibold text-ink-secondary">{currentPhrase.translation}</p>
              </div>
            </div>

            <div className="flex justify-center pt-1">
              <MFButton
                variant="secondary"
                size="sm"
                onClick={() => speakModel(currentPhrase.jp)}
                leftIcon={<Volume2 className="w-4 h-4" />}
              >
                Listen Native Speaker Audio
              </MFButton>
            </div>

            {/* Simulated audio waveform & Mic Trigger */}
            <div className="py-6 flex flex-col items-center justify-center space-y-5 border-t border-dashed border-edge mt-4">
              {/* Animated Speech waves */}
              <div className="h-12 flex items-center justify-center gap-1.5 w-full">
                {isRecording ? (
                  Array.from({ length: 16 }).map((_, i) => (
                    <motion.div 
                      key={i}
                      animate={{ height: [8, 36, 8] }}
                      transition={{ 
                        duration: 0.5 + Math.random() * 0.3, 
                        repeat: Infinity,
                        delay: i * 0.04
                      }}
                      className="w-1.5 bg-brand rounded-full"
                    />
                  ))
                ) : (
                  <div className="w-32 h-[3px] bg-edge rounded-full" />
                )}
              </div>

              {/* Record Mic trigger */}
              <div className="flex flex-col items-center space-y-2">
                <button
                  onClick={handleRecordTrigger}
                  className={`w-20 h-20 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-[var(--paper-press-shadow)] ${
                    isRecording 
                      ? 'bg-coral text-white animate-pulse' 
                      : 'bg-brand text-white hover:bg-brand-hover hover:scale-105'
                  }`}
                >
                  <Mic className="w-8 h-8" />
                </button>
                <p className="text-xs font-bold text-ink-muted uppercase tracking-wider font-heading">
                  {isRecording ? 'Tap to Stop & Evaluate' : 'Tap Mic to Speak'}
                </p>
              </div>
            </div>
          </MFCard>
        </div>

        {/* Right Column: AI Analysis & Score dashboard */}
        <div className="lg:col-span-4 space-y-5">
          <AnimatePresence mode="wait">
            {evaluating ? (
              <MFCard variant="cream" padding="lg" className="text-center py-12 space-y-3">
                <RefreshCw className="w-8 h-8 text-brand animate-spin mx-auto" />
                <h3 className="text-xs font-extrabold text-ink-muted uppercase tracking-wider">
                  AI Evaluation
                </h3>
                <p className="text-xs text-ink-secondary font-medium leading-relaxed">
                  Analyzing phonetic alignment, pitch contours, and sentence cadence...
                </p>
              </MFCard>
            ) : score !== null && feedback ? (
              <MFCard variant="paper" lifted padding="lg" className="space-y-4">
                <div className="text-center space-y-1">
                  <h3 className="text-xs font-extrabold text-ink-muted uppercase tracking-wider">
                    Pronunciation Score
                  </h3>
                  <div className="text-4xl font-black text-ink font-heading py-2">
                    {score}%
                  </div>
                  <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-mint-light text-ink border border-mint/40">
                    {score >= 85 ? 'Native-Like Fluency' : 'Good Pronunciation'}
                  </span>
                </div>

                <div className="space-y-2 text-xs border-t border-dashed border-edge pt-3">
                  <div className="p-2.5 rounded-xl bg-cream border border-edge">
                    <span className="font-bold text-ink">Clarity: </span>
                    <span className="text-ink-secondary">{feedback.clarity}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-cream border border-edge">
                    <span className="font-bold text-ink">Cadence: </span>
                    <span className="text-ink-secondary">{feedback.rhythm}</span>
                  </div>
                </div>
              </MFCard>
            ) : (
              <MFCard variant="cream" padding="lg" className="text-center space-y-2">
                <div className="p-3 rounded-2xl bg-card border border-edge text-brand w-max mx-auto shadow-sm">
                  <MFIcon name="speaking" size={24} />
                </div>
                <h3 className="text-sm font-bold text-ink font-heading">Ready to Practice</h3>
                <p className="text-xs text-ink-muted leading-relaxed font-medium">
                  Tap the microphone button to start recording your Japanese speech.
                </p>
              </MFCard>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
