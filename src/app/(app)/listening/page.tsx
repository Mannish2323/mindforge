'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Play, Pause, SkipForward, Clock, BookOpen, Headphones, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
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
  const [currentExercise, setCurrentExercise] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);

  const tabs = ['N5', 'N4', 'N3', 'N2', 'N1'];
  const filtered = LISTENING_EXERCISES.filter(e => e.level === activeTab);

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">Listening Practice</h1>
        <p className="text-sm text-ink-muted">Improve your comprehension with audio exercises</p>
      </motion.div>

      {/* Level Tabs */}
      <motion.div variants={item} className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab
                ? 'bg-brand/20 text-ink border border-brand/30'
                : 'bg-white/[0.03] text-ink-muted border border-white/[0.04] hover:border-edge'
            }`}
          >
            {tab}
          </button>
        ))}
      </motion.div>

      {/* Audio Player (when exercise selected) */}
      {currentExercise !== null && (
        <motion.div variants={item}>
          <Card variant="gradient" padding="lg" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">{LISTENING_EXERCISES.find(e => e.id === currentExercise)?.title}</h3>
                <Badge variant="purple" size="sm">{activeTab}</Badge>
              </div>
              <Headphones className="w-6 h-6 text-accent" />
            </div>

            {/* Waveform visualization */}
            <div className="flex items-center gap-1 h-12 px-2">
              {Array.from({ length: 40 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-full bg-brand/30 transition-all"
                  style={{
                    height: `${20 + Math.sin(i * 0.5 + (playing ? Date.now() * 0.001 : 0)) * 20}px`,
                    opacity: i / 40 <= progress / 100 ? 1 : 0.3,
                  }}
                />
              ))}
            </div>

            {/* Progress */}
            <ProgressBar value={progress} size="sm" color="gradient" />

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <button className="p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-ink-muted hover:text-ink transition-all cursor-pointer">
                <Clock className="w-5 h-5" />
              </button>
              <button
                onClick={() => setPlaying(!playing)}
                className="p-4 rounded-full bg-gradient-to-r from-neon-purple to-neon-pink text-ink shadow-lg hover:shadow-xl transition-all cursor-pointer"
              >
                {playing ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
              <button className="p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-ink-muted hover:text-ink transition-all cursor-pointer">
                <SkipForward className="w-5 h-5" />
              </button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Exercise List */}
      <motion.div variants={item} className="space-y-3">
        {filtered.length > 0 ? filtered.map(exercise => (
          <Card key={exercise.id} variant="glass" padding="md"
            className={`flex items-center justify-between cursor-pointer ${exercise.status === 'locked' ? 'opacity-50' : ''}`}
            onClick={() => exercise.status !== 'locked' && setCurrentExercise(exercise.id)}
          >
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-sky-500/10">
                <Volume2 className="w-5 h-5 text-sky-400" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">{exercise.title}</h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <Badge variant="purple" size="sm">{exercise.level}</Badge>
                  <span className="text-[10px] text-ink-muted">{exercise.duration}</span>
                </div>
              </div>
            </div>
            {exercise.status === 'locked' ? (
              <span className="text-xs text-ink-light">🔒 Premium</span>
            ) : (
              <ChevronRight className="w-4 h-4 text-ink-light" />
            )}
          </Card>
        )) : (
          <Card variant="glass" padding="lg" className="text-center">
            <p className="text-sm text-ink-muted">No exercises available for {activeTab} yet</p>
          </Card>
        )}
      </motion.div>
    </motion.div>
  );
}
