'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, ArrowLeft, Check
} from 'lucide-react';
import { Mascot } from '@/components/mascot/Mascot';
import { SakuraParticles } from '@/components/animations/SakuraParticles';
import { useAuth } from '@/app/context/AuthContext';
import { MFIcon, MFIconType } from '@/components/ui/MFIcon';

type OnboardingStep = 'level' | 'jlpt' | 'time' | 'interests' | 'complete';

const STEPS: OnboardingStep[] = ['level', 'jlpt', 'time', 'interests', 'complete'];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, updateSettings } = useAuth();

  const [step, setStep] = useState<OnboardingStep>('level');

  // User selections
  const [level, setLevel] = useState('beginner');
  const [jlpt, setJlpt] = useState('N5');
  const [studyTime, setStudyTime] = useState(10);
  const [interests, setInterests] = useState<string[]>([]);

  const toggleInterest = (id: string) => {
    setInterests((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const currentIndex = STEPS.indexOf(step);
  // Subtracting 1 from length to not count 'complete' for progress
  const totalSteps = STEPS.length - 1;

  const next = () => {
    const nextIdx = currentIndex + 1;
    if (nextIdx < STEPS.length) {
      setStep(STEPS[nextIdx]);
    }
  };

  const prev = () => {
    const prevIdx = currentIndex - 1;
    if (prevIdx >= 0) {
      setStep(STEPS[prevIdx]);
    }
  };

  const finishOnboarding = async () => {
    if (user && updateSettings) {
      await updateSettings({
        goal_minutes: studyTime,
        jlpt_target: jlpt,
      });
    }
    localStorage.setItem('onboarding_complete', 'true');
    router.push('/home');
  };

  React.useEffect(() => {
    if (step === 'complete') {
      const timer = setTimeout(() => {
        finishOnboarding();
      }, 2200);
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const slideVariants = {
    enter: { opacity: 0, x: 20 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  const levelOptions = [
    { id: 'beginner', label: 'Complete Beginner', desc: "I'm starting from zero", jp: '初心者' },
    { id: 'elementary', label: 'Beginner', desc: 'I know a few words', jp: '初級' },
    { id: 'intermediate', label: 'Intermediate', desc: 'I can understand basic Japanese', jp: '中級' },
    { id: 'advanced', label: 'Advanced', desc: 'I want to sharpen my skills', jp: '上級' },
  ];

  const jlptOptions = [
    { id: 'N5', label: 'JLPT N5', desc: 'Basic Japanese' },
    { id: 'N4', label: 'JLPT N4', desc: 'Elementary Japanese' },
    { id: 'N3', label: 'JLPT N3', desc: 'Intermediate Japanese' },
    { id: 'N2', label: 'JLPT N2', desc: 'Pre-Advanced Japanese' },
    { id: 'N1', label: 'JLPT N1', desc: 'Advanced Japanese' },
  ];

  const timeOptions: { min: number; label: string; desc: string; icon: MFIconType; recommended?: boolean }[] = [
    { min: 5, label: '5 min', desc: 'Quick & easy', icon: 'zap' },
    { min: 10, label: '10 min', desc: 'Recommended', icon: 'star', recommended: true },
    { min: 15, label: '15 min', desc: 'Steady progress', icon: 'progress' },
    { min: 30, label: '30 min', desc: 'Serious learner', icon: 'flame' },
  ];

  const interestOptions: { id: string; icon: MFIconType; label: string }[] = [
    { id: 'food', icon: 'food', label: 'Food' },
    { id: 'anime', icon: 'anime', label: 'Anime' },
    { id: 'music', icon: 'music', label: 'Music' },
    { id: 'travel', icon: 'travel', label: 'Travel' },
    { id: 'culture', icon: 'culture', label: 'Culture' },
    { id: 'games', icon: 'game', label: 'Games' },
    { id: 'business', icon: 'career', label: 'Business' },
    { id: 'conversation', icon: 'conversation', label: 'Conversation' },
  ];

  return (
    <div className="min-h-screen min-h-[100dvh] bg-warm text-ink flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
      <SakuraParticles />

      {/* Decorative background blurs */}
      <div className="absolute w-[40vw] h-[40vw] rounded-full bg-brand/10 blur-[100px] pointer-events-none top-[-10%] right-[-10%]" />
      <div className="absolute w-[30vw] h-[30vw] rounded-full bg-yellow/10 blur-[80px] pointer-events-none bottom-[-5%] left-[-5%]" />

      <div className="w-full max-w-sm z-10 flex flex-col min-h-[600px]">
        {/* Progress indicator */}
        {step !== 'complete' && (
          <div className="mb-6 space-y-3">
            <div className="flex items-center justify-between text-sm font-extrabold text-ink">
              <span>Step {currentIndex + 1} of {totalSteps}</span>
            </div>
            <div className="flex gap-2">
              {Array.from({ length: totalSteps }).map((_, idx) => (
                <div key={idx} className={`h-2 flex-1 rounded-full ${idx <= currentIndex ? 'bg-brand' : 'bg-warm-soft border border-edge'}`} />
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 bg-card rounded-[32px] border-2 border-edge p-6 shadow-sm flex flex-col relative overflow-hidden">
          <AnimatePresence mode="wait">
            
            {/* Step: Japanese Level */}
            {step === 'level' && (
              <motion.div key="level" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="flex-1 flex flex-col h-full">
                <div className="text-center space-y-2 mb-8">
                  <h2 className="text-2xl font-black font-heading text-ink">Choose your level</h2>
                  <p className="text-sm font-medium text-ink-muted">Where are you starting from?</p>
                </div>
                
                <div className="space-y-3 flex-1 overflow-y-auto pb-4 scrollbar-hide">
                  {levelOptions.map((l) => {
                    const selected = level === l.id;
                    return (
                      <motion.button
                        key={l.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setLevel(l.id)}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer text-left ${
                          selected
                            ? 'bg-brand/5 border-brand'
                            : 'bg-warm hover:bg-warm-soft border-transparent'
                        }`}
                      >
                        <div className={`w-12 h-12 flex items-center justify-center rounded-xl font-jp font-black text-lg ${selected ? 'bg-brand/10 text-brand' : 'bg-card text-ink-muted shadow-sm border border-edge'}`}>
                          {l.jp}
                        </div>
                        <div className="flex-1">
                          <span className="text-base font-bold text-ink block">{l.label}</span>
                          <span className="text-xs font-medium text-ink-muted">{l.desc}</span>
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
                
                <div className="mt-4 pt-4 bg-card">
                  <button onClick={next} className="w-full h-14 rounded-2xl bg-brand text-white font-extrabold text-[17px] flex items-center justify-center shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all active:scale-[0.98] focus:outline-none">
                    Continue <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step: JLPT Goal */}
            {step === 'jlpt' && (
              <motion.div key="jlpt" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="flex-1 flex flex-col h-full">
                <div className="text-center space-y-2 mb-8">
                  <h2 className="text-2xl font-black font-heading text-ink">Set a target</h2>
                  <p className="text-sm font-medium text-ink-muted">Which JLPT level is your goal?</p>
                </div>
                
                <div className="space-y-3 flex-1 overflow-y-auto pb-4 scrollbar-hide">
                  {jlptOptions.map((opt) => {
                    const selected = jlpt === opt.id;
                    return (
                      <motion.button
                        key={opt.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setJlpt(opt.id)}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer text-left ${
                          selected
                            ? 'bg-brand/5 border-brand'
                            : 'bg-warm hover:bg-warm-soft border-transparent'
                        }`}
                      >
                        <div className="flex-1 pl-2">
                          <span className="text-base font-bold text-ink block">{opt.label}</span>
                          <span className="text-xs font-medium text-ink-muted">{opt.desc}</span>
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
                
                <div className="mt-4 pt-4 bg-card flex gap-3">
                  <button onClick={prev} className="h-14 w-14 rounded-2xl bg-warm border border-edge flex items-center justify-center text-ink-muted hover:text-ink transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <button onClick={next} className="flex-1 h-14 rounded-2xl bg-brand text-white font-extrabold text-[17px] flex items-center justify-center shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all active:scale-[0.98] focus:outline-none">
                    Continue
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step: Daily Goal */}
            {step === 'time' && (
              <motion.div key="time" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="flex-1 flex flex-col h-full">
                <div className="text-center space-y-2 mb-8">
                  <h2 className="text-2xl font-black font-heading text-ink">Daily goal</h2>
                  <p className="text-sm font-medium text-ink-muted">How much time can you commit?</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3 flex-1">
                  {timeOptions.map((t) => {
                    const selected = studyTime === t.min;
                    return (
                      <motion.button
                        key={t.min}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setStudyTime(t.min)}
                        className={`flex flex-col items-center justify-center text-center gap-2 p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                          selected
                            ? 'bg-brand/5 border-brand'
                            : 'bg-warm hover:bg-warm-soft border-transparent'
                        }`}
                      >
                        <MFIcon name={t.icon} size={32} />
                        <div>
                          <span className="text-lg font-black text-ink block">{t.label}</span>
                          <span className="text-xs font-medium text-ink-muted">{t.desc}</span>
                        </div>
                        {t.recommended && !selected && (
                          <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[10px] font-black text-white bg-brand px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap">
                            RECOMMENDED
                          </span>
                        )}
                        {selected && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-brand flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
                
                <div className="mt-4 pt-4 bg-card flex gap-3">
                  <button onClick={prev} className="h-14 w-14 rounded-2xl bg-warm border border-edge flex items-center justify-center text-ink-muted hover:text-ink transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <button onClick={next} className="flex-1 h-14 rounded-2xl bg-brand text-white font-extrabold text-[17px] flex items-center justify-center shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all active:scale-[0.98] focus:outline-none">
                    Continue
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step: Interests */}
            {step === 'interests' && (
              <motion.div key="interests" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="flex-1 flex flex-col h-full">
                <div className="text-center space-y-2 mb-8">
                  <h2 className="text-2xl font-black font-heading text-ink">What do you like?</h2>
                  <p className="text-sm font-medium text-ink-muted">Select topics to personalize your path</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3 flex-1 overflow-y-auto pb-4 scrollbar-hide">
                  {interestOptions.map((item) => {
                    const selected = interests.includes(item.id);
                    return (
                      <motion.button
                        key={item.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleInterest(item.id)}
                        className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                          selected
                            ? 'bg-brand/5 border-brand'
                            : 'bg-warm hover:bg-warm-soft border-transparent'
                        }`}
                      >
                        <MFIcon name={item.icon} size={24} />
                        <span className="text-sm font-bold text-ink">{item.label}</span>
                      </motion.button>
                    );
                  })}
                </div>
                
                <div className="mt-4 pt-4 bg-card flex gap-3">
                  <button onClick={prev} className="h-14 w-14 rounded-2xl bg-warm border border-edge flex items-center justify-center text-ink-muted hover:text-ink transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <button onClick={() => setStep('complete')} className="flex-1 h-14 rounded-2xl bg-brand text-white font-extrabold text-[17px] flex items-center justify-center shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all active:scale-[0.98] focus:outline-none">
                    Finish Setup
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step: Complete */}
            {step === 'complete' && (
              <motion.div key="complete" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="flex-1 flex flex-col items-center justify-center text-center">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 16, delay: 0.1 }}
                  className="flex justify-center mb-6"
                >
                  <Mascot expression="celebrating" size={160} animate />
                </motion.div>
                <div className="space-y-2 mb-8">
                  <h2 className="text-2xl font-black font-heading text-ink">You&apos;re All Set!</h2>
                  <p className="text-sm font-medium text-ink-muted max-w-[240px] mx-auto">
                    Your personalized Japanese journey is ready. Let&apos;s begin!
                  </p>
                </div>
                <div className="w-48 h-2 rounded-full overflow-hidden bg-warm-soft mx-auto">
                  <motion.div className="h-full rounded-full bg-brand" initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 2 }} />
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
