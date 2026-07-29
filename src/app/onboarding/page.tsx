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
  Clock, Zap, Target, Flame
} from 'lucide-react';

type Step = 'welcome' | 'goal' | 'jlpt' | 'time' | 'daily' | 'notify' | 'complete';
const STEPS: Step[] = ['welcome', 'goal', 'jlpt', 'time', 'daily', 'notify', 'complete'];

export default function OnboardingPage() {
  const { profile, updateSettings, signUpStep3 } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<Step>('welcome');
  const [goal, setGoal] = useState('');
  const [jlpt, setJlpt] = useState('N5');
  const [studyTime, setStudyTime] = useState(15);
  const [dailyGoal, setDailyGoal] = useState<'casual' | 'regular' | 'intense' | 'insane'>('regular');
  const [notifyEnabled, setNotifyEnabled] = useState(true);

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
      const goalXp = dailyGoal === 'casual' ? 10 : dailyGoal === 'regular' ? 25 : dailyGoal === 'intense' ? 50 : 100;
      await updateSettings({
        jlpt_target: jlpt,
        goal_minutes: studyTime,
        notifications: notifyEnabled,
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

  const goals = [
    { id: 'jlpt', icon: BookOpen, label: 'Pass JLPT Exam', desc: 'N5 to N1 preparation' },
    { id: 'travel', icon: Plane, label: 'Travel to Japan', desc: 'Conversational Japanese' },
    { id: 'career', icon: Briefcase, label: 'Career Growth', desc: 'Business Japanese' },
    { id: 'hobby', icon: Heart, label: 'Personal Interest', desc: 'Learn at my pace' },
  ];

  const jlptLevels = [
    { id: 'N5', label: 'N5', desc: 'Beginner — Hiragana, basic vocabulary' },
    { id: 'N4', label: 'N4', desc: 'Elementary — Basic grammar, 300+ kanji' },
    { id: 'N3', label: 'N3', desc: 'Intermediate — Everyday conversations' },
    { id: 'N2', label: 'N2', desc: 'Advanced — Complex texts, business' },
    { id: 'N1', label: 'N1', desc: 'Expert — Near-native fluency' },
  ];

  const times = [
    { min: 5, label: '5 min', desc: 'Quick review' },
    { min: 10, label: '10 min', desc: 'Light study' },
    { min: 15, label: '15 min', desc: 'Balanced' },
    { min: 20, label: '20 min', desc: 'Focused' },
    { min: 30, label: '30 min', desc: 'Intensive' },
  ];

  const dailyGoals = [
    { id: 'casual' as const, icon: Sparkles, label: 'Casual', xp: '10 XP/day', desc: 'A few minutes daily' },
    { id: 'regular' as const, icon: Target, label: 'Regular', xp: '25 XP/day', desc: 'Steady progress' },
    { id: 'intense' as const, icon: Flame, label: 'Intense', xp: '50 XP/day', desc: 'Fast learner' },
    { id: 'insane' as const, icon: Zap, label: 'Insane', xp: '100 XP/day', desc: 'Serious dedication' },
  ];

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#0B0717] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <SakuraParticles />
      <div className="absolute w-[40vw] h-[40vw] rounded-full bg-neon-purple/8 blur-[100px] pointer-events-none top-1/4 left-1/4 animate-pulse-glow" />

      <div className="w-full max-w-lg z-10 space-y-8">
        {/* Progress bar */}
        {step !== 'complete' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-purple-300/40">
              <span>Step {currentIndex + 1} of {STEPS.length - 1}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-neon-purple to-neon-pink"
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
                <h1 className="text-3xl font-extrabold">Welcome to <span className="bg-gradient-to-r from-neon-purple to-neon-pink bg-clip-text text-transparent">MindForge</span></h1>
                <p className="text-purple-200/50 text-sm leading-relaxed max-w-sm mx-auto">
                  Let&apos;s personalize your Japanese learning experience. This takes about 30 seconds.
                </p>
              </div>
              <Button onClick={next} className="w-full btn btn-neon" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Let&apos;s Get Started
              </Button>
            </motion.div>
          )}

          {/* Step: Goal */}
          {step === 'goal' && (
            <motion.div key="goal" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ type: 'spring', stiffness: 200, damping: 25 }} className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">What&apos;s your goal?</h2>
                <p className="text-sm text-purple-300/40">Choose what motivates you most</p>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {goals.map((g) => (
                  <button key={g.id} onClick={() => { setGoal(g.id); next(); }}
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer text-left ${goal === g.id ? 'bg-neon-purple/15 border-neon-purple/30' : 'bg-white/[0.02] border-white/[0.06] hover:border-white/10 hover:bg-white/[0.04]'}`}
                  >
                    <div className="p-2.5 rounded-xl bg-neon-purple/10"><g.icon className="w-5 h-5 text-brand-light" /></div>
                    <div><span className="text-sm font-semibold text-white block">{g.label}</span><span className="text-xs text-purple-300/40">{g.desc}</span></div>
                  </button>
                ))}
              </div>
              <button onClick={prev} className="flex items-center gap-1 text-xs text-purple-300/40 hover:text-white transition-colors mx-auto cursor-pointer"><ArrowLeft className="w-3 h-3" />Back</button>
            </motion.div>
          )}

          {/* Step: JLPT Level */}
          {step === 'jlpt' && (
            <motion.div key="jlpt" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ type: 'spring', stiffness: 200, damping: 25 }} className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Your JLPT Level</h2>
                <p className="text-sm text-purple-300/40">Where should we start?</p>
              </div>
              <div className="space-y-2">
                {jlptLevels.map((l) => (
                  <button key={l.id} onClick={() => { setJlpt(l.id); next(); }}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${jlpt === l.id ? 'bg-neon-purple/15 border-neon-purple/30' : 'bg-white/[0.02] border-white/[0.06] hover:border-white/10'}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-orbitron font-bold text-sm text-brand-light bg-neon-purple/15 px-2.5 py-1 rounded-lg">{l.label}</span>
                      <span className="text-xs text-purple-200/60">{l.desc}</span>
                    </div>
                    {jlpt === l.id && <Check className="w-4 h-4 text-neon-pink" />}
                  </button>
                ))}
              </div>
              <button onClick={prev} className="flex items-center gap-1 text-xs text-purple-300/40 hover:text-white transition-colors mx-auto cursor-pointer"><ArrowLeft className="w-3 h-3" />Back</button>
            </motion.div>
          )}

          {/* Step: Study Time */}
          {step === 'time' && (
            <motion.div key="time" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ type: 'spring', stiffness: 200, damping: 25 }} className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Daily Study Time</h2>
                <p className="text-sm text-purple-300/40">How much time can you dedicate?</p>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {times.map((t) => (
                  <button key={t.min} onClick={() => setStudyTime(t.min)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all cursor-pointer ${studyTime === t.min ? 'bg-neon-purple/15 border-neon-purple/30' : 'bg-white/[0.02] border-white/[0.06] hover:border-white/10'}`}
                  >
                    <Clock className={`w-4 h-4 ${studyTime === t.min ? 'text-neon-pink' : 'text-purple-300/40'}`} />
                    <span className="text-sm font-bold text-white">{t.label}</span>
                    <span className="text-[9px] text-purple-300/30">{t.desc}</span>
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={prev} className="flex items-center gap-1 text-xs text-purple-300/40 hover:text-white transition-colors cursor-pointer"><ArrowLeft className="w-3 h-3" />Back</button>
                <Button onClick={next} className="flex-1 btn btn-primary" rightIcon={<ArrowRight className="w-4 h-4" />}>Continue</Button>
              </div>
            </motion.div>
          )}

          {/* Step: Daily Goal */}
          {step === 'daily' && (
            <motion.div key="daily" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ type: 'spring', stiffness: 200, damping: 25 }} className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Daily XP Goal</h2>
                <p className="text-sm text-purple-300/40">How fast do you want to learn?</p>
              </div>
              <div className="space-y-2">
                {dailyGoals.map((d) => (
                  <button key={d.id} onClick={() => setDailyGoal(d.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${dailyGoal === d.id ? 'bg-neon-purple/15 border-neon-purple/30' : 'bg-white/[0.02] border-white/[0.06] hover:border-white/10'}`}
                  >
                    <div className="p-2.5 rounded-xl bg-neon-purple/10"><d.icon className={`w-5 h-5 ${dailyGoal === d.id ? 'text-neon-pink' : 'text-brand-light'}`} /></div>
                    <div className="flex-1 text-left">
                      <span className="text-sm font-semibold text-white block">{d.label}</span>
                      <span className="text-xs text-purple-300/40">{d.desc}</span>
                    </div>
                    <span className="text-xs font-bold text-brand-light bg-neon-purple/10 px-2 py-1 rounded-lg">{d.xp}</span>
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={prev} className="flex items-center gap-1 text-xs text-purple-300/40 hover:text-white transition-colors cursor-pointer"><ArrowLeft className="w-3 h-3" />Back</button>
                <Button onClick={next} className="flex-1 btn btn-primary" rightIcon={<ArrowRight className="w-4 h-4" />}>Continue</Button>
              </div>
            </motion.div>
          )}

          {/* Step: Notifications */}
          {step === 'notify' && (
            <motion.div key="notify" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ type: 'spring', stiffness: 200, damping: 25 }} className="space-y-8 text-center">
              <div className="space-y-3">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-neon-purple/10 flex items-center justify-center">
                  {notifyEnabled ? <Bell className="w-8 h-8 text-neon-pink" /> : <BellOff className="w-8 h-8 text-purple-300/40" />}
                </div>
                <h2 className="text-2xl font-bold">Stay on Track</h2>
                <p className="text-sm text-purple-300/40 max-w-xs mx-auto">
                  Get daily reminders to maintain your streak and hit your learning goals.
                </p>
              </div>
              <div className="flex gap-3">
                <Button onClick={() => { setNotifyEnabled(false); setStep('complete'); }} variant="ghost" className="flex-1 btn btn-ghost">
                  Skip
                </Button>
                <Button onClick={() => { setNotifyEnabled(true); setStep('complete'); }} className="flex-1 btn btn-neon" leftIcon={<Bell className="w-4 h-4" />}>
                  Enable
                </Button>
              </div>
              <button onClick={prev} className="flex items-center gap-1 text-xs text-purple-300/40 hover:text-white transition-colors mx-auto cursor-pointer"><ArrowLeft className="w-3 h-3" />Back</button>
            </motion.div>
          )}

          {/* Step: Complete */}
          {step === 'complete' && (
            <motion.div key="complete" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ type: 'spring', stiffness: 200, damping: 25 }} className="space-y-6 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="mx-auto w-20 h-20 rounded-full bg-gradient-to-r from-neon-purple to-neon-pink flex items-center justify-center"
              >
                <Check className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold">You&apos;re All Set!</h2>
              <p className="text-sm text-purple-300/40">
                Your personalized learning journey is ready. Let&apos;s begin!
              </p>
              <div className="w-32 h-1 rounded-full overflow-hidden bg-white/[0.06] mx-auto">
                <motion.div className="h-full rounded-full bg-gradient-to-r from-neon-purple to-neon-pink" initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 2 }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
