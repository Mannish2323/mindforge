'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Map, Sparkles, BookOpen, Lock, Unlock, Play, CheckCircle2, 
  ChevronRight, Award, Trophy, Star
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Lesson {
  id: string;
  title: string;
  type: 'vocab' | 'grammar' | 'quiz';
  xp: number;
}

interface Unit {
  id: string;
  title: string;
  icon: string;
  lessonsCount: number;
  isPremium: boolean;
  status: 'completed' | 'active' | 'locked';
  progress: number;
  lessons: Lesson[];
}

export default function JLPTPage() {
  const [selectedLevel, setSelectedLevel] = useState<'N5' | 'N4' | 'N3' | 'N2' | 'N1'>('N5');

  const unitsData: Record<'N5' | 'N4' | 'N3' | 'N2' | 'N1', Unit[]> = {
    N5: [
      {
        id: 'ja_u01_greetings',
        title: 'Greetings',
        icon: '🙇',
        lessonsCount: 3,
        isPremium: false,
        status: 'completed',
        progress: 100,
        lessons: [
          { id: 'ja_u01_l01_hello_basic', title: 'Basic Hello & Goodbye', type: 'vocab', xp: 10 },
          { id: 'ja_u01_l02_polite', title: 'Polite Expressions', type: 'grammar', xp: 15 },
          { id: 'ja_u01_l03_quiz', title: 'Unit Greetings Assessment', type: 'quiz', xp: 25 },
        ]
      },
      {
        id: 'ja_u02_numbers',
        title: 'Numbers',
        icon: '🔢',
        lessonsCount: 3,
        isPremium: false,
        status: 'active',
        progress: 33,
        lessons: [
          { id: 'ja_u02_l01_1_10', title: 'Numbers 1 to 10', type: 'vocab', xp: 10 },
          { id: 'ja_u02_l02_counter', title: 'Basic Counting Items', type: 'grammar', xp: 15 },
          { id: 'ja_u02_l03_quiz', title: 'Numbers Review Quiz', type: 'quiz', xp: 25 },
        ]
      },
      {
        id: 'ja_u03_self_intro',
        title: 'Self Introduction',
        icon: '👤',
        lessonsCount: 3,
        isPremium: false,
        status: 'locked',
        progress: 0,
        lessons: [
          { id: 'ja_u03_l01_intro_vocab', title: 'Introduction Vocab', type: 'vocab', xp: 10 },
          { id: 'ja_u03_l02_intro_grammar', title: 'Introducing Nationality', type: 'grammar', xp: 15 },
          { id: 'ja_u03_l03_quiz', title: 'Self Intro Quiz', type: 'quiz', xp: 25 },
        ]
      },
      {
        id: 'ja_u04_objects',
        title: 'Common Objects',
        icon: '📦',
        lessonsCount: 3,
        isPremium: true,
        status: 'locked',
        progress: 0,
        lessons: [
          { id: 'ja_u04_l01_objects_vocab', title: 'Things Around You', type: 'vocab', xp: 10 },
          { id: 'ja_u04_l02_objects_grammar', title: 'This, That, and Over There', type: 'grammar', xp: 15 },
          { id: 'ja_u04_l03_quiz', title: 'Objects Quiz', type: 'quiz', xp: 25 },
        ]
      },
      {
        id: 'ja_u05_time',
        title: 'Days & Time',
        icon: '🕐',
        lessonsCount: 3,
        isPremium: true,
        status: 'locked',
        progress: 0,
        lessons: [
          { id: 'ja_u05_l01_time_vocab', title: 'Telling Time', type: 'vocab', xp: 10 },
          { id: 'ja_u05_l02_time_grammar', title: 'Days of the Week', type: 'grammar', xp: 15 },
          { id: 'ja_u05_l03_quiz', title: 'Time Review Quiz', type: 'quiz', xp: 25 },
        ]
      }
    ],
    N4: [],
    N3: [],
    N2: [],
    N1: []
  };

  const currentUnits = unitsData[selectedLevel] || [];

  return (
    <div className="space-y-8">
      {/* Level selector tabs */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white font-orbitron">
            Course Roadmap
          </h1>
          <p className="text-xs md:text-sm text-purple-300/50 font-semibold tracking-wide uppercase">
            Select JLPT level to track modules progression
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-white/5 border border-white/10 rounded-2xl">
          {(['N5', 'N4', 'N3', 'N2', 'N1'] as const).map((lvl) => {
            const isActive = selectedLevel === lvl;
            const isLocked = lvl !== 'N5';
            return (
              <button
                key={lvl}
                disabled={isLocked}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all relative ${
                  isLocked ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
                } ${
                  isActive 
                    ? 'bg-gradient-to-r from-brand-purple to-sakura-dark text-white shadow-md' 
                    : 'text-purple-300/60 hover:text-white'
                }`}
              >
                <span className="font-orbitron">{lvl}</span>
                {isLocked && <Lock className="w-2.5 h-2.5 absolute top-1 right-1 text-purple-300/40" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Roadmap Timelines layout */}
      {currentUnits.length === 0 ? (
        <div className="glass-card p-12 rounded-[28px] text-center border border-white/5">
          <Lock className="w-12 h-12 text-purple-300/20 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white font-orbitron">Level {selectedLevel} is Locked</h3>
          <p className="text-sm text-purple-300/40 mt-1 max-w-sm mx-auto">
            Complete the previous JLPT course milestones to unlock intermediate structures.
          </p>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-10 relative before:absolute before:left-8 before:top-4 before:bottom-4 before:w-[2px] before:bg-white/5">
          {currentUnits.map((unit, index) => {
            const isCompleted = unit.status === 'completed';
            const isActive = unit.status === 'active';
            const isLocked = unit.status === 'locked';

            return (
              <motion.div 
                key={unit.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-20 group"
              >
                {/* Timeline node icon */}
                <div className={`absolute left-4 top-0 w-10 h-10 rounded-full border flex items-center justify-center text-lg z-10 transition-all ${
                  isCompleted 
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                    : isActive
                    ? 'bg-brand-purple/20 border-brand-purple/40 text-brand-purple-light scale-110 shadow-[0_0_20px_rgba(124,58,237,0.3)] animate-pulse'
                    : 'bg-[#120f26] border-white/5 text-purple-300/20'
                }`}>
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <span>{unit.icon}</span>}
                </div>

                {/* Module detail panel */}
                <div className={`glass-card p-6 md:p-8 rounded-[24px] border ${
                  isActive 
                    ? 'border-brand-purple/30 bg-brand-purple/5' 
                    : 'border-white/5 hover:border-white/10'
                } transition-all duration-300`}>
                  
                  {/* Top info row */}
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold tracking-widest text-purple-300/40 uppercase">
                          MODULE {index + 1}
                        </span>
                        {unit.isPremium && (
                          <span className="text-[9px] font-extrabold tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                            PREMIUM
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-extrabold text-white font-orbitron">{unit.title}</h3>
                    </div>

                    {/* Progress indicator */}
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-[10px] font-extrabold text-purple-300/40 uppercase">PROGRESS</p>
                        <p className="text-xs font-extrabold text-white">{unit.progress}%</p>
                      </div>
                      <div className="w-12 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-brand-purple to-sakura-dark rounded-full" 
                          style={{ width: `${unit.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sub-lessons list panel */}
                  <div className="mt-6 border-t border-white/5 pt-6 space-y-4">
                    {unit.lessons.map((lesson) => {
                      const lessonPlayable = !isLocked;
                      return (
                        <div 
                          key={lesson.id}
                          className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                            lessonPlayable
                              ? 'bg-white/[0.01] border-white/5 hover:border-white/10 hover:bg-white/[0.03]'
                              : 'bg-white/[0.01] border-transparent opacity-40'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-xl ${
                              isCompleted 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                : isActive 
                                ? 'bg-brand-purple/10 text-brand-purple-light border border-brand-purple/20' 
                                : 'bg-[#120f26] border-white/5 text-purple-300/20'
                            }`}>
                              <BookOpen className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-white leading-none">{lesson.title}</h4>
                              <p className="text-[10px] font-bold text-purple-300/40 uppercase mt-1 tracking-wider">
                                {lesson.type} • {lesson.xp} XP
                              </p>
                            </div>
                          </div>

                          {lessonPlayable ? (
                            <Link href={`/path/${lesson.id}`}>
                              <span className="btn btn-ghost btn-sm flex items-center justify-center p-0 w-10 h-10 rounded-xl cursor-pointer">
                                <Play className="w-4 h-4 fill-white" />
                              </span>
                            </Link>
                          ) : (
                            <div className="w-10 h-10 flex items-center justify-center text-purple-300/20">
                              <Lock className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
