'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { SakuraParticles } from '@/components/animations/SakuraParticles';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, BookOpen, Briefcase, Plane, Heart,
  ArrowRight, ArrowLeft, Check, Bell, BellOff,
  Clock, Zap, Target, Flame, Gamepad2, Music,
  Utensils, MessageCircle, Landmark, Globe
} from 'lucide-react';

type Step = 'welcome' | 'slides' | 'goal' | 'level' | 'time' | 'interests' | 'complete';
const STEPS: Step[] = ['welcome', 'slides', 'goal', 'level', 'time', 'interests', 'complete'];

export default function OnboardingPage() {
  const { profile, updateSettings, signUpStep3 } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<Step>('welcome');
  const [slideIndex, setSlideIndex] = useState(0);
  const [goals, setGoals] = useState<string[]>([]);
  const [level, setLevel] = useState('beginner');
  const [studyTime, setStudyTime] = useState(10);
  const [interests, setInterests] = useState<string[]>([]);

  const currentIndex = STEPS.indexOf(step);
  const progress = ((currentIndex) / (STEPS.length - 1)) * 100;

  const next = () => {
    const i = STEPS.indexOf(step);
    if (i < STEPS.length - 1) setStep(STEPS[i + 1]);
  };
  const prev = () => {
    const i = STEPS.indexOf(step);
    if (i > 0) setStep(STEPS[i - 1]);
  };

  const handleFinish = async () => {
    try {
      await updateSettings({
        jlpt_target: level === 'beginner' ? 'N5' : level === 'elementary' ? 'N4' : level === 'intermediate' ? 'N3' : 'N2',
        goal_minutes: studyTime,
        notifications: true,
      });
      await signUpStep3(studyTime);
    } catch (e) {
      console.error('Onboarding save error:', e);
    }
    router.replace('/home');
  };

  useEffect(() => {
    if (step === 'complete') {
      const timer = setTimeout(handleFinish, 2500);
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const slideVariants = {
    enter: { x: 60, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -60, opacity: 0 },
  };

  const toggleGoal = (id: string) => {
    setGoals(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]);
  };

  const toggleInterest = (id: string) => {
    setInterests(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const goalOptions = [
    { id: 'travel', emoji: '🇯🇵', label: 'Travel', desc: 'Navigate Japan with confidence' },
    { id: 'career', emoji: '💼', label: 'Career', desc: 'Business Japanese skills' },
    { id: 'anime', emoji: '🎌', label: 'Anime & Manga', desc: 'Understand without subtitles' },
    { id: 'conversation', emoji: '🗣️', label: 'Conversation', desc: 'Talk with native speakers' },
    { id: 'study', emoji: '📚', label: 'Study', desc: 'Academic Japanese' },
    { id: 'personal', emoji: '❤️', label: 'Personal Interest', desc: 'Learn at my own pace' },
  ];

  const levelOptions = [
    { id: 'beginner', label: 'Complete Beginner', desc: "I'm starting from zero", jp: '初心者', jplabel: 'Shoshinsha' },
    { id: 'elementary', label: 'Beginner', desc: 'I know a few words', jp: '初級', jplabel: 'Shokyū' },
    { id: 'intermediate', label: 'Intermediate', desc: 'I can understand basic Japanese', jp: '中級', jplabel: 'Chūkyū' },
    { id: 'advanced', label: 'Advanced', desc: 'I want to sharpen my skills', jp: '上級', jplabel: 'Jōkyū' },
  ];

  const timeOptions = [
    { min: 5, label: '5 min', desc: 'Quick & easy', emoji: '⚡' },
    { min: 10, label: '10 min', desc: 'Recommended', emoji: '🎯', recommended: true },
    { min: 15, label: '15 min', desc: 'Steady progress', emoji: '📈' },
    { min: 30, label: '30 min', desc: 'Serious learner', emoji: '🔥' },
  ];

  const interestOptions = [
    { id: 'food', emoji: '🍜', label: 'Food' },
    { id: 'anime', emoji: '🎬', label: 'Anime' },
    { id: 'music', emoji: '🎵', label: 'Music' },
    { id: 'travel', emoji: '✈️', label: 'Travel' },
    { id: 'culture', emoji: '🏯', label: 'Culture' },
    { id: 'games', emoji: '🎮', label: 'Games' },
    { id: 'business', emoji: '💼', label: 'Business' },
    { id: 'conversation', emoji: '💬', label: 'Conversation' },
  ];

  const slides = [
    {
      title: 'Learn Japanese naturally',
      desc: 'Learn Hiragana, Katakana, Kanji and vocabulary through short interactive lessons.',
      visual: (
        <div className="flex gap-3 justify-center flex-wrap">
          {['あ', 'カ', '日', '語'].map((char, i) => (
            <motion.div
              key={char}
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: i * 0.15, type: 'spring' }}
              className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-lg ${
                ['bg-cat-green', 'bg-cat-blue', 'bg-cat-purple', 'bg-cat-orange'][i]
              }`}
            >
              <span className="font-jp">{char}</span>
            </motion.div>
          ))}
        </div>
      ),
    },
    {
      title: 'Learn words in context',
      desc: 'Master greetings, everyday expressions, and essential vocabulary with colourful flashcards.',
      visual: (
        <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
          {[
            { label: 'Greetings', jp: 'こんにちは', color: 'bg-cat-green-light border-cat-green/20', text: 'text-cat-green' },
            { label: 'Expressions', jp: 'ありがとう', color: 'bg-cat-blue-light border-cat-blue/20', text: 'text-cat-blue' },
            { label: 'Pronouns', jp: 'わたし', color: 'bg-cat-purple-light border-cat-purple/20', text: 'text-cat-purple' },
            { label: 'Questions', jp: 'なに？', color: 'bg-cat-orange-light border-cat-orange/20', text: 'text-cat-orange' },
          ].map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-4 rounded-2xl border ${card.color}`}
            >
              <p className={`text-xs font-bold ${card.text}`}>{card.label}</p>
              <p className="text-lg font-bold text-ink mt-1 font-jp">{card.jp}</p>
            </motion.div>
          ))}
        </div>
      ),
    },
    {
      title: 'Build a daily habit',
      desc: 'Track your streaks, set goals, and watch your progress grow every day.',
      visual: (
        <div className="space-y-4 max-w-xs mx-auto">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-3 p-4 bg-cat-orange-light rounded-2xl border border-cat-orange/20"
          >
            <span className="text-3xl">🔥</span>
            <div>
              <p className="text-lg font-bold text-ink">7 Day Streak</p>
              <p className="text-xs text-ink-muted">Keep it going!</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="p-4 bg-white rounded-2xl border border-edge"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-bold text-ink">Today&apos;s Goal 🎯</p>
              <p className="text-sm font-bold text-brand">7 / 10 min</p>
            </div>
            <div className="w-full h-3 bg-warm-soft rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '70%' }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="h-full rounded-full bg-gradient-to-r from-brand to-accent"
              />
            </div>
          </motion.div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen min-h-[100dvh] bg-warm text-ink flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <SakuraParticles />

      {/* Subtle decorative circles */}
      <div className="absolute w-[40vw] h-[40vw] rounded-full bg-sakura-light/30 blur-[100px] pointer-events-none top-[-10%] right-[-10%]" />
      <div className="absolute w-[30vw] h-[30vw] rounded-full bg-cat-purple-light/40 blur-[80px] pointer-events-none bottom-[-5%] left-[-5%]" />

      <div className="w-full max-w-lg z-10 space-y-8">
        {/* Progress bar */}
        {step !== 'complete' && step !== 'welcome' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-ink-muted">
              <span>Step {currentIndex} of {STEPS.length - 2}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-warm-soft overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-brand to-accent"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* Step: Welcome */}
          {step === 'welcome' && (
            <motion.div key="welcome" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ type: 'spring', stiffness: 200, damping: 25 }} className="space-y-8 text-center">
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}>
                <Logo size={80} glow={true} className="mx-auto" />
              </motion.div>
              <div className="space-y-3">
                <h1 className="text-3xl font-extrabold font-heading text-ink">
                  Learn Japanese without the boring memorization.
                </h1>
                <p className="text-ink-muted text-sm leading-relaxed max-w-sm mx-auto">
                  Build a daily habit, learn words in context, and actually use what you learn.
                </p>
              </div>
              <div className="space-y-3">
                <Button onClick={next} className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Start Learning
                </Button>
                <button
                  onClick={() => router.push('/auth')}
                  className="text-sm font-semibold text-ink-muted hover:text-brand transition-colors cursor-pointer"
                >
                  I already have an account
                </button>
              </div>
            </motion.div>
          )}

          {/* Step: Onboarding Slides */}
          {step === 'slides' && (
            <motion.div key="slides" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ type: 'spring', stiffness: 200, damping: 25 }} className="space-y-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={slideIndex}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold font-heading text-ink">{slides[slideIndex].title}</h2>
                    <p className="text-sm text-ink-muted max-w-sm mx-auto">{slides[slideIndex].desc}</p>
                  </div>
                  {slides[slideIndex].visual}
                </motion.div>
              </AnimatePresence>

              {/* Dots */}
              <div className="flex justify-center gap-2">
                {slides.map((_, i) => (
                  <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all ${i === slideIndex ? 'bg-brand w-6' : 'bg-warm-soft'}`} />
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={slideIndex > 0 ? () => setSlideIndex(slideIndex - 1) : prev} className="flex items-center gap-1 text-sm text-ink-muted hover:text-ink transition-colors cursor-pointer">
                  <ArrowLeft className="w-4 h-4" />Back
                </button>
                <Button
                  onClick={slideIndex < slides.length - 1 ? () => setSlideIndex(slideIndex + 1) : next}
                  className="flex-1"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  {slideIndex < slides.length - 1 ? 'Next' : "Let's Begin"}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step: Learning Goals (multi-select) */}
          {step === 'goal' && (
            <motion.div key="goal" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ type: 'spring', stiffness: 200, damping: 25 }} className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold font-heading text-ink">What do you want to learn Japanese for?</h2>
                <p className="text-sm text-ink-muted">Select all that apply</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {goalOptions.map((g) => {
                  const selected = goals.includes(g.id);
                  return (
                    <motion.button
                      key={g.id}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => toggleGoal(g.id)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all cursor-pointer text-center ${
                        selected
                          ? 'bg-brand/5 border-brand shadow-[0_0_0_3px_rgba(109,60,255,0.1)]'
                          : 'bg-white border-edge hover:border-edge-hover hover:shadow-md'
                      }`}
                    >
                      <span className="text-2xl">{g.emoji}</span>
                      <div>
                        <span className="text-sm font-bold text-ink block">{g.label}</span>
                        <span className="text-[11px] text-ink-muted">{g.desc}</span>
                      </div>
                      {selected && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-5 h-5 rounded-full bg-brand flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
              <div className="flex gap-3">
                <button onClick={prev} className="flex items-center gap-1 text-sm text-ink-muted hover:text-ink transition-colors cursor-pointer"><ArrowLeft className="w-4 h-4" />Back</button>
                <Button onClick={next} className="flex-1" rightIcon={<ArrowRight className="w-4 h-4" />} disabled={goals.length === 0}>
                  Continue
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step: Japanese Level */}
          {step === 'level' && (
            <motion.div key="level" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ type: 'spring', stiffness: 200, damping: 25 }} className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold font-heading text-ink">What&apos;s your Japanese level?</h2>
                <p className="text-sm text-ink-muted">We&apos;ll customize your learning path</p>
              </div>
              <div className="space-y-3">
                {levelOptions.map((l) => {
                  const selected = level === l.id;
                  return (
                    <motion.button
                      key={l.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { setLevel(l.id); }}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer text-left ${
                        selected
                          ? 'bg-brand/5 border-brand shadow-[0_0_0_3px_rgba(109,60,255,0.1)]'
                          : 'bg-white border-edge hover:border-edge-hover hover:shadow-md'
                      }`}
                    >
                      <div className={`px-3 py-2 rounded-xl font-jp font-bold text-lg ${selected ? 'bg-brand/10 text-brand' : 'bg-warm-soft text-ink-muted'}`}>
                        {l.jp}
                      </div>
                      <div className="flex-1">
                        <span className="text-sm font-bold text-ink block">{l.label}</span>
                        <span className="text-xs text-ink-muted">{l.desc}</span>
                      </div>
                      {selected && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-5 h-5 rounded-full bg-brand flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-white" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
              <div className="flex gap-3">
                <button onClick={prev} className="flex items-center gap-1 text-sm text-ink-muted hover:text-ink transition-colors cursor-pointer"><ArrowLeft className="w-4 h-4" />Back</button>
                <Button onClick={next} className="flex-1" rightIcon={<ArrowRight className="w-4 h-4" />}>Continue</Button>
              </div>
            </motion.div>
          )}

          {/* Step: Daily Goal */}
          {step === 'time' && (
            <motion.div key="time" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ type: 'spring', stiffness: 200, damping: 25 }} className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold font-heading text-ink">How much time can you learn each day?</h2>
                <p className="text-sm text-ink-muted">🎯 Your daily target</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {timeOptions.map((t) => {
                  const selected = studyTime === t.min;
                  return (
                    <motion.button
                      key={t.min}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setStudyTime(t.min)}
                      className={`flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                        selected
                          ? 'bg-brand/5 border-brand shadow-[0_0_0_3px_rgba(109,60,255,0.1)]'
                          : 'bg-white border-edge hover:border-edge-hover hover:shadow-md'
                      }`}
                    >
                      <span className="text-2xl">{t.emoji}</span>
                      <span className="text-lg font-bold text-ink">{t.label}</span>
                      <span className="text-xs text-ink-muted">{t.desc}</span>
                      {t.recommended && !selected && (
                        <span className="text-[10px] font-bold text-brand bg-brand/10 px-2 py-0.5 rounded-full">Recommended</span>
                      )}
                      {selected && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-5 h-5 rounded-full bg-brand flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
              <div className="flex gap-3">
                <button onClick={prev} className="flex items-center gap-1 text-sm text-ink-muted hover:text-ink transition-colors cursor-pointer"><ArrowLeft className="w-4 h-4" />Back</button>
                <Button onClick={next} className="flex-1" rightIcon={<ArrowRight className="w-4 h-4" />}>Continue</Button>
              </div>
            </motion.div>
          )}

          {/* Step: Interests */}
          {step === 'interests' && (
            <motion.div key="interests" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ type: 'spring', stiffness: 200, damping: 25 }} className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold font-heading text-ink">What are you interested in?</h2>
                <p className="text-sm text-ink-muted">We&apos;ll personalize your content</p>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {interestOptions.map((item) => {
                  const selected = interests.includes(item.id);
                  return (
                    <motion.button
                      key={item.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleInterest(item.id)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                        selected
                          ? 'bg-brand/5 border-brand'
                          : 'bg-white border-edge hover:border-edge-hover'
                      }`}
                    >
                      <span className="text-2xl">{item.emoji}</span>
                      <span className="text-[11px] font-bold text-ink">{item.label}</span>
                    </motion.button>
                  );
                })}
              </div>
              <div className="flex gap-3">
                <button onClick={prev} className="flex items-center gap-1 text-sm text-ink-muted hover:text-ink transition-colors cursor-pointer"><ArrowLeft className="w-4 h-4" />Back</button>
                <Button onClick={() => setStep('complete')} className="flex-1" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Finish Setup
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step: Complete */}
          {step === 'complete' && (
            <motion.div key="complete" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ type: 'spring', stiffness: 200, damping: 25 }} className="space-y-6 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="mx-auto w-20 h-20 rounded-full bg-gradient-to-r from-brand to-accent flex items-center justify-center shadow-lg"
              >
                <Check className="w-10 h-10 text-white" />
              </motion.div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold font-heading text-ink">You&apos;re All Set! 🎉</h2>
                <p className="text-sm text-ink-muted">
                  Your personalized Japanese journey is ready. Let&apos;s begin!
                </p>
              </div>
              <div className="w-32 h-1.5 rounded-full overflow-hidden bg-warm-soft mx-auto">
                <motion.div className="h-full rounded-full bg-gradient-to-r from-brand to-accent" initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 2 }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
