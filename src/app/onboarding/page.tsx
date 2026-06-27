'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { useStore } from '@/hooks/useStore';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ArrowRight, Sparkles, Trophy, BookOpen, Target, CheckCircle2, User } from 'lucide-react';

const GOAL_OPTIONS = [
  { minutes: 10, label: 'Casual', desc: '10 min/day — Perfect for staying active', icon: '☕' },
  { minutes: 15, label: 'Regular', desc: '15 min/day — Steady progress', icon: '⚡' },
  { minutes: 30, label: 'Serious', desc: '30 min/day — Deep language immersion', icon: '🎯' },
  { minutes: 60, label: 'Insane', desc: '60 min/day — Ultimate fluency speedrun', icon: '🔥' },
];

const JLPT_OPTIONS = [
  { level: 'N5', title: 'Beginner', desc: 'Basic vocabulary, hiragana, katakana, and elementary grammar.', color: '#22c55e' },
  { level: 'N4', title: 'Elementary', desc: 'Daily conversations, standard conjugations, and basic reading.', color: '#3b82f6' },
  { level: 'N3', title: 'Intermediate', desc: 'Covers natural speed dialogues, work-related terms, and news topics.', color: '#8b5cf6' },
  { level: 'N2', title: 'Upper-Intermediate', desc: 'Understanding of diverse topics, advanced essays, and natural speech.', color: '#ec4899' },
  { level: 'N1', title: 'Advanced', desc: 'Full native-level fluency, complex literature, and professional settings.', color: '#f59e0b' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { profile, updateProfileDetails, updateSettings } = useAuth();
  const { setGoalMinutes } = useStore();

  const [step, setStep] = useState(1);
  const [name, setName] = useState(profile?.name || '');
  const [selectedGoal, setSelectedGoal] = useState<number>(15);
  const [selectedJlpt, setSelectedJlpt] = useState<string>('N5');
  const [loading, setLoading] = useState(false);

  const totalSteps = 4;
  const progressPercent = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const handleFinish = async (option: 'start' | 'placement') => {
    setLoading(true);
    try {
      // 1. Update Display Name
      const finalName = name.trim() || profile?.name || 'Learner';
      await updateProfileDetails(finalName, profile?.bio || '', profile?.avatarUrl || '🦊');
      
      // 2. Update Settings in Supabase
      await updateSettings({
        goal_minutes: selectedGoal,
        jlpt_target: selectedJlpt,
      });

      // 3. Update Zustand Store Goal
      setGoalMinutes(selectedGoal);

      // 4. Redirect based on choice
      if (option === 'placement') {
        router.replace('/jlpt');
      } else {
        router.replace('/home');
      }
    } catch (err) {
      console.error('Error during onboarding save:', err);
      // Fallback redirect if something fails
      router.replace('/home');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09071a] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow animations */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-purple-900/10 blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-pink-900/10 blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="w-full max-w-lg relative z-10">
        {/* Progress header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20">
              <span className="text-white font-bold text-xs">✦</span>
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-300/60">Onboarding Setup</span>
          </div>
          <span className="text-xs font-bold text-purple-300/80">Step {step} of {totalSteps}</span>
        </div>
        <ProgressBar value={progressPercent} color="brand" size="xs" className="mb-8" />

        {/* Wizard Card */}
        <div className="bg-[#120f26]/80 border border-purple-800/30 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-purple-950/40 relative">
          
          {/* STEP 1: Name Setup */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-up">
              <div className="text-center sm:text-left">
                <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center mb-4 mx-auto sm:mx-0">
                  <User className="w-6 h-6 text-purple-400" />
                </div>
                <h2 className="text-2xl font-black text-white leading-tight">What should we call you?</h2>
                <p className="text-xs text-purple-200/50 mt-1">This will be your display name on the leaderboard and social feeds.</p>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-purple-300/40 uppercase tracking-widest">Your Nickname</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Kenji, Sarah, Sakura"
                  maxLength={20}
                  className="w-full bg-[#0a0815] border border-purple-800/30 rounded-xl px-4 py-3.5 text-white placeholder-purple-300/20 focus:outline-none focus:border-purple-500/60 text-sm transition-all focus:ring-1 focus:ring-purple-500/20"
                />
              </div>

              <Button
                variant="primary"
                className="w-full py-3.5 rounded-xl font-bold text-sm"
                onClick={handleNext}
                disabled={!name.trim()}
              >
                Continue <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* STEP 2: Goal Selection */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-up">
              <div className="text-center sm:text-left">
                <div className="w-12 h-12 bg-pink-500/10 border border-pink-500/20 rounded-2xl flex items-center justify-center mb-4 mx-auto sm:mx-0">
                  <Target className="w-6 h-6 text-pink-400" />
                </div>
                <h2 className="text-2xl font-black text-white leading-tight">Choose your daily goal</h2>
                <p className="text-xs text-purple-200/50 mt-1">Consistency is key! Select a daily target you can comfortably commit to.</p>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {GOAL_OPTIONS.map((g) => {
                  const selected = selectedGoal === g.minutes;
                  return (
                    <button
                      key={g.minutes}
                      onClick={() => setSelectedGoal(g.minutes)}
                      className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                        selected
                          ? 'bg-purple-500/10 border-purple-500 shadow-lg shadow-purple-500/5'
                          : 'bg-[#0a0815] border-purple-900/20 hover:border-purple-800/40'
                      }`}
                    >
                      <span className="text-2xl">{g.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-white">{g.label}</span>
                          <span className="text-xs font-black text-purple-400">{g.minutes} min/day</span>
                        </div>
                        <span className="text-[11px] block mt-0.5" style={{ color: 'rgba(200,196,255,0.5)' }}>{g.desc}</span>
                      </div>
                      {selected && <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <Button variant="ghost" className="flex-1 py-3" onClick={handleBack}>
                  Back
                </Button>
                <Button variant="primary" className="flex-1 py-3" onClick={handleNext}>
                  Continue <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: JLPT Level Selection */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-up">
              <div className="text-center sm:text-left">
                <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mb-4 mx-auto sm:mx-0">
                  <Trophy className="w-6 h-6 text-blue-400" />
                </div>
                <h2 className="text-2xl font-black text-white leading-tight">Select your target level</h2>
                <p className="text-xs text-purple-200/50 mt-1">Don&apos;t worry, you can easily change this target level at any time in settings.</p>
              </div>

              <div className="grid grid-cols-1 gap-2.5 max-h-[280px] overflow-y-auto pr-1">
                {JLPT_OPTIONS.map((l) => {
                  const selected = selectedJlpt === l.level;
                  return (
                    <button
                      key={l.level}
                      onClick={() => setSelectedJlpt(l.level)}
                      className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                        selected
                          ? 'bg-blue-500/10 border-blue-500 shadow-lg shadow-blue-500/5'
                          : 'bg-[#0a0815] border-purple-900/20 hover:border-purple-800/40'
                      }`}
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
                        style={{ border: `2px solid ${l.color}`, color: l.color, background: `${l.color}15` }}
                      >
                        {l.level}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-bold text-white">{l.title}</span>
                        <span className="text-[11px] block mt-0.5" style={{ color: 'rgba(200,196,255,0.5)' }}>{l.desc}</span>
                      </div>
                      {selected && <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <Button variant="ghost" className="flex-1 py-3" onClick={handleBack}>
                  Back
                </Button>
                <Button variant="primary" className="flex-1 py-3" onClick={handleNext}>
                  Continue <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: Ready to Start */}
          {step === 4 && (
            <div className="space-y-6 animate-fade-up">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-purple-500/20 animate-bounce">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-black text-white leading-tight">You&apos;re all set!</h2>
                <p className="text-sm text-purple-200/60 mt-2">
                  Welcome to Velmorth, <span className="text-purple-400 font-bold">{name}</span>. How would you like to start your journey?
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {/* Option A: Start standard path */}
                <button
                  onClick={() => handleFinish('start')}
                  disabled={loading}
                  className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-purple-600/20 to-pink-600/10 border border-purple-500/30 hover:border-purple-500/50 hover:scale-[1.02] text-left transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0 text-xl">🚀</div>
                  <div className="flex-1">
                    <span className="text-sm font-bold text-white block">Start N5 Beginner Timeline</span>
                    <span className="text-xs text-purple-300/60 block mt-0.5">Start from the absolute basics with Unit 1 Greetings.</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-purple-400 flex-shrink-0" />
                </button>

                {/* Option B: Placement test */}
                <button
                  onClick={() => handleFinish('placement')}
                  disabled={loading}
                  className="flex items-center gap-4 p-5 rounded-2xl bg-[#0a0815] border border-purple-900/30 hover:border-purple-700/40 hover:scale-[1.02] text-left transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-950/60 flex items-center justify-center flex-shrink-0 text-xl">📝</div>
                  <div className="flex-1">
                    <span className="text-sm font-bold text-white block">Take Placement Assessment</span>
                    <span className="text-xs text-purple-300/40 block mt-0.5">Already know some Japanese? Skip beginner lessons now.</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-purple-400/40 flex-shrink-0" />
                </button>
              </div>

              <div className="flex gap-3">
                <Button variant="ghost" className="w-full py-3" onClick={handleBack} disabled={loading}>
                  Back
                </Button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
