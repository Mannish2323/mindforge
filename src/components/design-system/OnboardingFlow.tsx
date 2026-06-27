'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, Target, Clock } from 'lucide-react';
import { SakuraAI } from './SakuraAI';

interface OnboardingFlowProps {
  onComplete: (data: {
    name: string;
    goal: number;
    jlptTarget: string;
  }) => void;
  isLoading?: boolean;
}

const GOAL_OPTIONS = [
  {
    minutes: 10,
    label: 'Casual',
    desc: 'Light practice',
    icon: Clock,
    color: '#22c55e',
  },
  {
    minutes: 15,
    label: 'Regular',
    desc: 'Steady progress',
    icon: Clock,
    color: '#3b82f6',
  },
  {
    minutes: 30,
    label: 'Serious',
    desc: 'Deep immersion',
    icon: Clock,
    color: '#8b5cf6',
  },
  {
    minutes: 60,
    label: 'Insane',
    desc: 'Fluency speedrun',
    icon: Clock,
    color: '#f59e0b',
  },
];

const JLPT_OPTIONS = [
  {
    level: 'N5',
    title: 'Beginner',
    desc: 'Start from basics',
    color: '#22c55e',
  },
  {
    level: 'N4',
    title: 'Elementary',
    desc: 'Daily conversations',
    color: '#3b82f6',
  },
  {
    level: 'N3',
    title: 'Intermediate',
    desc: 'Deeper understanding',
    color: '#8b5cf6',
  },
  {
    level: 'N2',
    title: 'Upper-Intermediate',
    desc: 'Advanced topics',
    color: '#ec4899',
  },
  {
    level: 'N1',
    title: 'Advanced',
    desc: 'Native fluency',
    color: '#f59e0b',
  },
];

export function OnboardingFlow({ onComplete, isLoading = false }: OnboardingFlowProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [selectedGoal, setSelectedGoal] = useState(15);
  const [selectedJlpt, setSelectedJlpt] = useState('N5');

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete({ name: name || 'Learner', goal: selectedGoal, jlptTarget: selectedJlpt });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background:
          'linear-gradient(135deg, rgb(9, 7, 26) 0%, rgb(14, 11, 34) 50%, rgb(19, 9, 48) 100%)',
      }}
    >
      {/* Background elements */}
      <div
        className="absolute top-[-20%] left-[-10%] w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.3), transparent)',
        }}
      />
      <div
        className="absolute -bottom-40 right-[-5%] w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.2), transparent)',
        }}
      />

      {/* Main container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-2xl"
      >
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-black text-white">
              Welcome to Velmorth
            </h2>
            <span
              className="text-xs font-bold"
              style={{ color: 'rgba(160, 150, 220, 0.6)' }}
            >
              Step {step}/{totalSteps}
            </span>
          </div>
          <div
            className="h-2 rounded-full overflow-hidden"
            style={{ background: 'rgba(139, 92, 246, 0.1)' }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, #7c3aed, #ec4899)',
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Content area */}
        <div className="flex gap-8 items-center">
          {/* Left: Sakura AI */}
          <motion.div
            className="hidden lg:flex flex-col items-center justify-center"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <SakuraAI
              pose={
                step === 1
                  ? 'wave'
                  : step === 2
                    ? 'point-right'
                    : step === 3
                      ? 'teaching'
                      : 'celebration'
              }
              size="lg"
              animate
            />
            <p
              className="text-xs font-bold mt-4 text-center"
              style={{ color: 'rgba(167, 139, 250, 0.7)' }}
            >
              Sakura AI
            </p>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            className="flex-1 rounded-2xl backdrop-blur-xl border p-8 shadow-2xl"
            style={{
              background: 'rgba(17, 12, 30, 0.4)',
              border: '1px solid rgba(139, 92, 246, 0.25)',
            }}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <AnimatePresence mode="wait">
              {/* Step 1: Welcome */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-2xl font-black text-white mb-2">
                      Let's Begin!
                    </h3>
                    <p
                      className="text-sm"
                      style={{ color: 'rgba(160, 150, 220, 0.6)' }}
                    >
                      First, what should we call you?
                    </p>
                  </div>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-4 py-3 rounded-xl text-white outline-none transition-all"
                    style={{
                      background: 'rgba(139, 92, 246, 0.1)',
                      border: '1px solid rgba(124, 58, 237, 0.3)',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor =
                        'rgba(124, 58, 237, 0.6)';
                      e.currentTarget.style.background =
                        'rgba(139, 92, 246, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor =
                        'rgba(124, 58, 237, 0.3)';
                      e.currentTarget.style.background =
                        'rgba(139, 92, 246, 0.1)';
                    }}
                  />

                  <p
                    className="text-xs"
                    style={{ color: 'rgba(160, 150, 220, 0.4)' }}
                  >
                    This will be your display name in the community and
                    leaderboards.
                  </p>
                </motion.div>
              )}

              {/* Step 2: Daily Goal */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-2xl font-black text-white mb-2">
                      Daily Goal
                    </h3>
                    <p
                      className="text-sm"
                      style={{ color: 'rgba(160, 150, 220, 0.6)' }}
                    >
                      How much time can you dedicate daily?
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {GOAL_OPTIONS.map((goal) => (
                      <motion.button
                        key={goal.minutes}
                        onClick={() => setSelectedGoal(goal.minutes)}
                        className="p-4 rounded-xl border-2 transition-all text-center"
                        style={{
                          background:
                            selectedGoal === goal.minutes
                              ? `rgba(${goal.color.substring(1, 3)}, ${goal.color.substring(3, 5)}, ${goal.color.substring(5, 7)}, 0.15)`
                              : 'rgba(139, 92, 246, 0.05)',
                          borderColor:
                            selectedGoal === goal.minutes
                              ? goal.color
                              : 'rgba(124, 58, 237, 0.2)',
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="font-black text-white text-lg">
                          {goal.minutes}
                        </div>
                        <div className="text-xs font-bold text-gray-300">
                          {goal.label}
                        </div>
                        <div
                          className="text-[10px] mt-1"
                          style={{ color: 'rgba(160, 150, 220, 0.5)' }}
                        >
                          {goal.desc}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 3: JLPT Level */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-2xl font-black text-white mb-2">
                      Target Level
                    </h3>
                    <p
                      className="text-sm"
                      style={{ color: 'rgba(160, 150, 220, 0.6)' }}
                    >
                      Which JLPT level are you aiming for?
                    </p>
                  </div>

                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {JLPT_OPTIONS.map((jlpt) => (
                      <motion.button
                        key={jlpt.level}
                        onClick={() => setSelectedJlpt(jlpt.level)}
                        className="w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-3"
                        style={{
                          background:
                            selectedJlpt === jlpt.level
                              ? `rgba(${jlpt.color.substring(1, 3)}, ${jlpt.color.substring(3, 5)}, ${jlpt.color.substring(5, 7)}, 0.15)`
                              : 'rgba(139, 92, 246, 0.05)',
                          borderColor:
                            selectedJlpt === jlpt.level
                              ? jlpt.color
                              : 'rgba(124, 58, 237, 0.2)',
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {selectedJlpt === jlpt.level && (
                          <CheckCircle2
                            className="w-5 h-5 flex-shrink-0"
                            style={{ color: jlpt.color }}
                          />
                        )}
                        <div className="flex-1">
                          <div className="font-black text-white">
                            {jlpt.level} — {jlpt.title}
                          </div>
                          <div
                            className="text-xs"
                            style={{ color: 'rgba(160, 150, 220, 0.5)' }}
                          >
                            {jlpt.desc}
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 4: Confirmation */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-2xl font-black text-white mb-2">
                      All Set!
                    </h3>
                    <p
                      className="text-sm"
                      style={{ color: 'rgba(160, 150, 220, 0.6)' }}
                    >
                      Ready to start your journey?
                    </p>
                  </div>

                  <div className="space-y-3 p-4 rounded-xl"
                    style={{
                      background: 'rgba(139, 92, 246, 0.08)',
                      border: '1px solid rgba(124, 58, 237, 0.2)',
                    }}>
                    <div className="flex items-center justify-between">
                      <span style={{ color: 'rgba(160, 150, 220, 0.6)' }}>
                        Name
                      </span>
                      <span className="font-bold text-white">{name || 'Learner'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span style={{ color: 'rgba(160, 150, 220, 0.6)' }}>
                        Daily Goal
                      </span>
                      <span className="font-bold text-white">
                        {selectedGoal} minutes
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span style={{ color: 'rgba(160, 150, 220, 0.6)' }}>
                        Target Level
                      </span>
                      <span className="font-bold text-white">JLPT {selectedJlpt}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-8 gap-4">
          <motion.button
            onClick={handleBack}
            disabled={step === 1}
            className="px-6 py-3 rounded-xl font-bold text-sm transition-all"
            style={{
              background: 'rgba(139, 92, 246, 0.05)',
              border: '1px solid rgba(124, 58, 237, 0.2)',
              color: step === 1 ? 'rgba(160, 150, 220, 0.3)' : 'white',
            }}
            whileHover={{ scale: step === 1 ? 1 : 1.05 }}
            whileTap={{ scale: step === 1 ? 1 : 0.95 }}
          >
            Back
          </motion.button>

          <motion.button
            onClick={handleNext}
            disabled={isLoading || (step === 1 && !name)}
            className="px-8 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all"
            style={{
              background: isLoading
                ? 'rgba(124, 58, 237, 0.3)'
                : 'linear-gradient(135deg, rgba(124, 58, 237, 0.8), rgba(219, 39, 119, 0.6))',
              border: '1px solid rgba(124, 58, 237, 0.3)',
              color: 'white',
            }}
            whileHover={{
              scale: isLoading || (step === 1 && !name) ? 1 : 1.05,
            }}
            whileTap={{ scale: isLoading || (step === 1 && !name) ? 1 : 0.95 }}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-transparent border-t-white animate-spin" />
                Saving...
              </>
            ) : step === totalSteps ? (
              <>
                Start Learning
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
