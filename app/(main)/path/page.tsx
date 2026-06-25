'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useStoreContext } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { AppShell } from '@/components/layout/AppShell';
import { LessonCard } from '@/components/learn/LessonCard';
import { Card, Button, Modal } from '@evlo/ui';

export default function PathPage() {
  const { state, isLoaded } = useStoreContext();
  const { user, profile } = useAuth();
  const router = useRouter();

  const [activeCategory, setActiveCategory] = useState<'All' | 'Greetings' | 'Numbers' | 'Days' | 'JLPT N5' | 'Phrases'>('All');
  const [unitsIndex, setUnitsIndex] = useState<any>(null);
  const [lessonsCache, setLessonsCache] = useState<Record<string, any>>({});
  const [loadingLessons, setLoadingLessons] = useState(true);

  // Animation states for cards
  const [shakingLessonId, setShakingLessonId] = useState<string | null>(null);
  const [pulsingLessonId, setPulsingLessonId] = useState<string | null>(null);

  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch('/data/config/units_index.json');
        const data = await res.json();
        setUnitsIndex(data);

        const cache: Record<string, any> = {};
        for (const unit of data.units) {
          const ures = await fetch(`/data/lessons/${unit.unit_id}.json`);
          cache[unit.unit_id] = await ures.json();
        }
        setLessonsCache(cache);
      } catch (e) {
        console.error('Failed to load lessons config data', e);
      } finally {
        setLoadingLessons(false);
      }
    }
    loadConfig();
  }, []);

  if (!isLoaded || loadingLessons) {
    return (
      <AppShell>
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="skeleton" style={{ height: '40px', width: '100%', borderRadius: '12px' }} />
          {[200, 200].map((h, i) => (
            <div key={i} className="skeleton skeleton-card" style={{ height: `${h}px`, borderRadius: '16px' }} />
          ))}
        </div>
      </AppShell>
    );
  }

  const isLessonLocked = (lessonIndex: number, unitIndex: number) => {
    if (unitIndex === 0 && lessonIndex === 0) return false;
    if (!unitsIndex) return true;

    const currentUnitLessons = lessonsCache[unitsIndex.units[unitIndex]?.unit_id]?.lessons || [];

    if (lessonIndex > 0) {
      const prevLessonId = currentUnitLessons[lessonIndex - 1]?.lesson_id;
      return !state.lessonProgress[prevLessonId]?.completed;
    } else {
      const prevUnit = unitsIndex.units[unitIndex - 1];
      if (!prevUnit) return true;
      const prevUnitLessons = lessonsCache[prevUnit.unit_id]?.lessons || [];
      const lastLessonId = prevUnitLessons[prevUnitLessons.length - 1]?.lesson_id;
      return !state.lessonProgress[lastLessonId]?.completed;
    }
  };

  const getCompletedCount = (unitId: string) => {
    const lessons = lessonsCache[unitId]?.lessons || [];
    return lessons.filter((l: any) => state.lessonProgress[l.lesson_id]?.completed).length;
  };

  // Category Filtering
  const filteredUnits = (unitsIndex?.units || []).filter((unit: any) => {
    if (activeCategory === 'All') return true;
    const uid = unit.unit_id.toLowerCase();
    
    if (activeCategory === 'Greetings') {
      return uid.includes('greetings') || uid.includes('self_intro');
    }
    if (activeCategory === 'Numbers') {
      return uid.includes('numbers') || uid.includes('colors');
    }
    if (activeCategory === 'Days') {
      return uid.includes('time');
    }
    if (activeCategory === 'JLPT N5') {
      return uid.includes('objects') || uid.includes('locations') || uid.includes('verbs');
    }
    if (activeCategory === 'Phrases') {
      return uid.includes('greetings') || uid.includes('family') || uid.includes('food');
    }
    return true;
  });

  const categories: Array<'All' | 'Greetings' | 'Numbers' | 'Days' | 'JLPT N5' | 'Phrases'> = [
    'All',
    'Greetings',
    'Numbers',
    'Days',
    'JLPT N5',
    'Phrases',
  ];

  const handleLessonClick = (lessonId: string, isLocked: boolean, isCompleted: boolean) => {
    if (isLocked) {
      setShakingLessonId(lessonId);
      setTimeout(() => setShakingLessonId(null), 150, 0); // 120ms total duration
      return;
    }

    if (isCompleted) {
      setPulsingLessonId(lessonId);
      setTimeout(() => {
        setPulsingLessonId(null);
        router.push(`/learn/${lessonId}`);
      }, 300);
      return;
    }

    router.push(`/learn/${lessonId}`);
  };

  return (
    <AppShell>
      <div style={{ padding: '16px', maxWidth: '480px', margin: '0 auto' }}>
        {/* Category chips row */}
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '12px',
          marginBottom: '16px',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
        }}>
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <motion.button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                animate={{
                  scale: isActive ? 1.05 : 1.0,
                  opacity: isActive ? 1.0 : 0.7,
                }}
                transition={{ duration: 0.2 }}
                style={{
                  position: 'relative',
                  color: isActive ? '#fff' : 'var(--text-2, #b3b3b9)',
                  border: '1px solid var(--border, #2d2d34)',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: isActive ? 800 : 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  background: 'transparent',
                }}
              >
                {/* Active chip sliding background pill */}
                {isActive && (
                  <motion.div
                    layoutId="categoryChipActiveBg"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'var(--primary, #ff9800)',
                      borderRadius: '20px',
                      zIndex: -1,
                    }}
                    transition={{ type: 'tween', duration: 0.2, ease: 'easeInOut' }}
                  />
                )}
                {/* Inactive background wrapper */}
                {!isActive && (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'var(--surface-2, #2d2d34)',
                    borderRadius: '20px',
                    zIndex: -2,
                  }} />
                )}
                <span style={{ position: 'relative', zIndex: 1 }}>{cat}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Stacked Unit Cards */}
        <motion.div
          layout
          style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
        >
          {filteredUnits.map((unit: any) => {
            const lessons = lessonsCache[unit.unit_id]?.lessons || [];
            const completedCount = getCompletedCount(unit.unit_id);
            const totalCount = lessons.length;
            const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
            const originalUnitIndex = unitsIndex.units.findIndex((u: any) => u.unit_id === unit.unit_id);

            return (
              <motion.div
                key={unit.unit_id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                style={{
                  background: 'var(--surface-1, #1e1e24)',
                  border: '1px solid var(--border-strong, #2d2d34)',
                  borderRadius: '20px',
                  padding: '20px',
                  boxShadow: 'var(--shadow-md)',
                }}
              >
                {/* Unit Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '24px' }}>{unit.icon}</span>
                    <div>
                      <h3 style={{ margin: 0, fontWeight: 900, fontSize: '16px', color: 'var(--text-primary, #fff)' }}>
                        {unit.unit_title}
                      </h3>
                      <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: 'var(--text-secondary, #b3b3b9)' }}>
                        {completedCount}/{totalCount} lessons completed
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--primary, #ff9800)' }}>
                      {pct}%
                    </span>
                    <div style={{ width: '60px', height: '4px', background: 'var(--surface-3, #3a3a42)', borderRadius: '2px', marginTop: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary, #ff9800), #eab308)' }} />
                    </div>
                  </div>
                </div>

                {/* Lessons list inside unit */}
                <div>
                  {lessons.map((lesson: any, lIdx: number) => {
                    const locked = isLessonLocked(lIdx, originalUnitIndex);
                    const completed = !!state.lessonProgress[lesson.lesson_id]?.completed;
                    
                    // Locked shaking animation control
                    const isShaking = shakingLessonId === lesson.lesson_id;
                    const isPulsing = pulsingLessonId === lesson.lesson_id;

                    return (
                      <motion.div
                        key={lesson.lesson_id}
                        animate={isShaking ? {
                          x: [0, -6, 6, -6, 6, -6, 6, 0],
                        } : isPulsing ? {
                          scale: [1, 1.02, 1],
                          boxShadow: [
                            '0px 0px 0px 0px rgba(76, 175, 80, 0)',
                            '0px 0px 15px 5px rgba(76, 175, 80, 0.4)',
                            '0px 0px 0px 0px rgba(76, 175, 80, 0)'
                          ]
                        } : {}}
                        transition={isShaking ? { duration: 0.12, ease: 'linear' } : isPulsing ? { duration: 0.3 } : {}}
                        style={{ position: 'relative' }}
                      >
                        <LessonCard
                          lessonId={lesson.lesson_id}
                          title={lesson.lesson_title}
                          description={`${lesson.vocabulary?.length ?? 0} words · ${lesson.difficulty}`}
                          xpReward={lesson.xp_reward || 15}
                          isCompleted={completed}
                          isLocked={locked}
                          isInProgress={!completed && !locked}
                          category={activeCategory}
                          index={lIdx}
                          onClick={() => handleLessonClick(lesson.lesson_id, locked, completed)}
                        />
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </AppShell>
  );
}
