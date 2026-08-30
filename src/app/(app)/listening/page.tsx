'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Play, Pause, SkipForward, Clock, BookOpen, Headphones, ChevronRight, Lock } from 'lucide-react';
import { MFCard } from '@/components/ui/MFCard';
import { MFButton } from '@/components/ui/MFButton';
import { MFIcon } from '@/components/ui/MFIcon';
import { useAuth } from '@/app/context/AuthContext';

const LISTENING_EXERCISES = [
  { id: 1, title: 'Greetings & Introductions', level: 'N5', duration: '2:30', status: 'available' as const },
  { id: 2, title: 'At the Restaurant', level: 'N5', duration: '3:15', status: 'available' as const },
  { id: 3, title: 'Asking for Directions', level: 'N5', duration: '2:45', status: 'available' as const },
  { id: 4, title: 'Shopping Conversation', level: 'N4', duration: '4:00', status: 'locked' as const },
  { id: 5, title: 'Weather Discussion', level: 'N4', duration: '3:30', status: 'locked' as const },
];

export default function ListeningPage() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('N5');
  const [playing, setPlaying] = useState(false);
  const [currentExercise, setCurrentExercise] = useState<number | null>(1);
  const [progress, setProgress] = useState(35);

  const tabs = ['N5', 'N4', 'N3', 'N2', 'N1'];
  const filtered = LISTENING_EXERCISES.filter(e => e.level === activeTab);

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-7 md:space-y-9 max-w-5xl mx-auto pb-14">
      {/* Top Banner */}
      <MFCard variant="sky" washiTape="pink" padding="lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-card border border-edge text-xs font-extrabold text-brand shadow-sm">
              <MFIcon name="listening" size={16} />
              <span>Native Audio Lab</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-ink font-heading tracking-tight">
              Japanese Listening Comprehension
            </h1>
            <p className="text-xs sm:text-sm text-ink-secondary font-medium max-w-xl leading-relaxed">
              Listen to native Japanese dialogues, train your pitch accent perception, and build instinctive comprehension.
            </p>
          </div>
        </div>
      </MFCard>

      {/* Level Tabs */}
      <motion.div variants={item} className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
              activeTab === tab
                ? 'bg-brand text-white border-brand shadow-[var(--paper-press-shadow)]'
                : 'bg-card text-ink-muted border-edge hover:text-ink hover:bg-cream'
            }`}
          >
            {tab}
          </button>
        ))}
      </motion.div>

      {/* Audio Player (when exercise selected) */}
      {currentExercise !== null && (
        <motion.div variants={item}>
          <MFCard variant="paper" lifted padding="lg" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-brand-light text-brand border border-brand/30">
                  JLPT {activeTab}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-ink font-heading mt-1">
                  {LISTENING_EXERCISES.find(e => e.id === currentExercise)?.title}
                </h3>
              </div>
              <div className="p-2.5 rounded-2xl bg-cream border border-edge text-brand">
                <Headphones className="w-5 h-5" />
              </div>
            </div>

            {/* Waveform visualization */}
            <div className="flex items-center gap-1.5 h-14 px-3 bg-cream rounded-2xl border border-edge">
              {Array.from({ length: 36 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-full bg-brand transition-all"
                  style={{
                    height: `${14 + Math.sin(i * 0.4 + (playing ? Date.now() * 0.002 : 0)) * 16}px`,
                    opacity: i / 36 <= progress / 100 ? 1 : 0.25,
                  }}
                />
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 pt-1">
              <button className="p-2.5 rounded-xl bg-cream border border-edge text-ink-muted hover:text-ink transition-all cursor-pointer">
                <Clock className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPlaying(!playing)}
                className="p-3.5 rounded-2xl bg-brand text-white shadow-[var(--paper-press-shadow)] hover:bg-brand-hover transition-all cursor-pointer"
              >
                {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
              </button>
              <button className="p-2.5 rounded-xl bg-cream border border-edge text-ink-muted hover:text-ink transition-all cursor-pointer">
                <SkipForward className="w-4 h-4" />
              </button>
            </div>
          </MFCard>
        </motion.div>
      )}

      {/* Exercise List */}
      <motion.div variants={item} className="space-y-3">
        {filtered.length > 0 ? filtered.map(exercise => (
          <MFCard 
            key={exercise.id} 
            variant="paper" 
            lifted={exercise.status !== 'locked'} 
            padding="md"
            className={`flex items-center justify-between cursor-pointer ${exercise.status === 'locked' ? 'opacity-50' : ''}`}
            onClick={() => exercise.status !== 'locked' && setCurrentExercise(exercise.id)}
          >
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-2xl bg-sky-light border border-sky/30 text-ink">
                <Volume2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-ink font-heading">{exercise.title}</h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-cream border border-edge text-ink">
                    {exercise.level}
                  </span>
                  <span className="text-[11px] text-ink-muted font-medium">{exercise.duration}</span>
                </div>
              </div>
            </div>
            {exercise.status === 'locked' ? (
              <div className="flex items-center gap-1 text-xs font-bold text-orange">
                <Lock className="w-3.5 h-3.5" />
                <span>Premium</span>
              </div>
            ) : (
              <ChevronRight className="w-4 h-4 text-ink-light" />
            )}
          </MFCard>
        )) : (
          <MFCard variant="cream" padding="lg" className="text-center">
            <p className="text-xs text-ink-muted font-medium">No exercises available for {activeTab} yet</p>
          </MFCard>
        )}
      </motion.div>
    </motion.div>
  );
}
