'use client';

import React, { useState } from 'react';
import { Lock, Star, ShieldAlert, Award, MessageCircle, AlertCircle, Play, Check } from 'lucide-react';

interface LearnPathProps {
  state: any;
  units: any[];
  lessonsCache: Record<string, any>;
  onStartLesson: (lessonId: string) => void;
  onBack: () => void;
}

export function LearnPath({ state, units, lessonsCache, onStartLesson, onBack }: LearnPathProps) {
  const [selectedNode, setSelectedNode] = useState<any | null>(null);
  const [activeCategory, setActiveCategory] = useState<'All' | 'Greetings' | 'Numbers' | 'Time' | 'Food' | 'Verbs'>('All');

  const getCompletedCount = (unit: any) => {
    const lessons = lessonsCache[unit.unit_id]?.lessons || [];
    return lessons.filter((l: any) => state.lessonProgress[l.lesson_id]?.completed).length;
  };

  const isLessonLocked = (lessonIndex: number, unitIndex: number) => {
    if (unitIndex === 0 && lessonIndex === 0) return false;
    
    const currentUnitLessons = lessonsCache[units[unitIndex].unit_id]?.lessons || [];
    
    if (lessonIndex > 0) {
      const prevLessonId = currentUnitLessons[lessonIndex - 1]?.lesson_id;
      return !state.lessonProgress[prevLessonId]?.completed;
    } else {
      const prevUnit = units[unitIndex - 1];
      const prevUnitLessons = lessonsCache[prevUnit.unit_id]?.lessons || [];
      const lastLessonId = prevUnitLessons[prevUnitLessons.length - 1]?.lesson_id;
      return !state.lessonProgress[lastLessonId]?.completed;
    }
  };

  // Find the current active/in-progress lesson (first unlocked incomplete lesson)
  const findInProgressLesson = () => {
    for (let uIdx = 0; uIdx < units.length; uIdx++) {
      const lessons = lessonsCache[units[uIdx].unit_id]?.lessons || [];
      for (let lIdx = 0; lIdx < lessons.length; lIdx++) {
        const lesson = lessons[lIdx];
        if (!state.lessonProgress[lesson.lesson_id]?.completed && !isLessonLocked(lIdx, uIdx)) {
          return lesson;
        }
      }
    }
    return null;
  };

  const inProgressLesson = findInProgressLesson();

  const getNodeIcon = (nodeType: string, isCompleted: boolean, isLocked: boolean, isInProgress: boolean) => {
    if (isCompleted) return <Check size={20} />;
    if (isLocked) return <Lock size={18} />;
    
    switch (nodeType) {
      case 'boss': return <ShieldAlert size={22} />;
      case 'review': return <Award size={20} />;
      case 'story': return <MessageCircle size={20} />;
      default: return isInProgress ? <Star size={20} /> : <Play size={18} style={{ marginLeft: '2px' }} />;
    }
  };

  const getOffsetStyle = (index: number, scaleUp: boolean) => {
    const cycle = index % 8;
    let offset = 0;
    if (cycle === 1 || cycle === 7) offset = 35;
    else if (cycle === 2 || cycle === 6) offset = 70;
    else if (cycle === 3 || cycle === 5) offset = 35;
    else if (cycle === 4) offset = 0;
    
    const shift = cycle > 4 ? -offset : offset;
    return {
      transform: `translateX(${shift}px)${scaleUp ? ' scale(1.1)' : ''}`,
    };
  };

  const filteredUnits = units.filter(unit => {
    if (activeCategory === 'All') return true;
    const uid = unit.unit_id.toLowerCase();
    if (activeCategory === 'Greetings') return uid.includes('greetings') || uid.includes('self_intro');
    if (activeCategory === 'Numbers') return uid.includes('numbers') || uid.includes('colors');
    if (activeCategory === 'Time') return uid.includes('time') || uid.includes('locations');
    if (activeCategory === 'Food') return uid.includes('food');
    if (activeCategory === 'Verbs') return uid.includes('verbs') || uid.includes('objects');
    return true;
  });

  const CATEGORIES = ['All', 'Greetings', 'Numbers', 'Time', 'Food', 'Verbs'] as const;

  return (
    <div className="learn-path-view page-transition animate-fadein" style={{ padding: 'var(--sp-4)' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', marginBottom: 'var(--sp-4)' }}>
        <button className="btn-ghost" style={{ padding: '6px 12px', borderRadius: 'var(--radius)' }} onClick={onBack}>← Back</button>
        <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 800 }}>🗺️ Japanese N5 Roadmap</h2>
      </div>

      {/* Category Chips */}
      <div className="chip-group" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: 'var(--sp-3)', marginBottom: 'var(--sp-5)' }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`chip${activeCategory === cat ? ' active' : ''}`}
            onClick={() => setActiveCategory(cat)}
            style={{ whiteSpace: 'nowrap' }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Path List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}>
        {filteredUnits.map((unit, uIdx) => {
          const lessons = lessonsCache[unit.unit_id]?.lessons || [];
          const completedCount = getCompletedCount(unit);
          const totalCount = lessons.length;
          const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

          // Find the real index of this unit in the original units array for lock calculations
          const originalUnitIndex = units.findIndex(u => u.unit_id === unit.unit_id);

          return (
            <div key={unit.unit_id} className="card" style={{ padding: 'var(--sp-5)' }}>
              {/* Unit header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--sp-4)' }}>
                <div>
                  <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold' }}>{unit.unit_title}</h3>
                  <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>
                    Vocab: {lessons.reduce((acc: number, l: any) => acc + (l.vocabulary?.length || 0), 0)} words
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--primary)' }}>{pct}% Complete</span>
                  <div style={{ width: '80px', height: '6px', background: 'var(--surface-3)', borderRadius: '3px', marginTop: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--accent-violet))' }} />
                  </div>
                </div>
              </div>

              {/* Lesson path nodes chain - vertical winding path */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)', padding: 'var(--sp-4) 0', alignItems: 'center', position: 'relative' }}>
                {lessons.map((lesson: any, lIdx: number) => {
                  const locked = isLessonLocked(lIdx, originalUnitIndex);
                  const completed = !!state.lessonProgress[lesson.lesson_id]?.completed;
                  const isInProgress = !completed && !locked && lesson.lesson_id === inProgressLesson?.lesson_id;
                  const isAvailable = !completed && !locked && !isInProgress;

                  // Simple classification for node types
                  const isBoss = lIdx === lessons.length - 1;
                  const isStory = lesson.lesson_title.toLowerCase().includes('story') || lesson.is_premium;
                  const isReview = lIdx === 2;
                  const nodeType = isBoss ? 'boss' : isStory ? 'story' : isReview ? 'review' : 'normal';

                  return (
                    <div
                      key={lesson.lesson_id}
                      onClick={() => !locked && setSelectedNode({ ...lesson, nodeType, isInProgress })}
                      className={`node-icon ${completed ? 'completed' : locked ? 'locked' : isInProgress ? 'in-progress' : 'available'}`}
                      style={{
                        width: '56px',
                        height: '56px',
                        cursor: locked ? 'not-allowed' : 'pointer',
                        ...getOffsetStyle(lIdx, isInProgress)
                      }}
                    >
                      {getNodeIcon(nodeType, completed, locked, isInProgress)}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {filteredUnits.length === 0 && (
          <div style={{ textAlign: 'center', padding: 'var(--sp-10)', color: 'var(--text-muted)' }}>
            No units found in this category.
          </div>
        )}
      </div>

      {/* Current Lesson Preview Card at Bottom */}
      {inProgressLesson && activeCategory === 'All' && (
        <div className="card" style={{ marginTop: 'var(--sp-6)', border: '1px solid rgba(22, 163, 74, 0.3)', background: 'var(--primary-light)', padding: 'var(--sp-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Lesson</span>
            <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', marginTop: '2px' }}>{inProgressLesson.lesson_title}</h4>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-2)' }}>⚡ {inProgressLesson.xp_reward} XP • ❤️ 1 Heart</p>
          </div>
          <button className="btn-primary" style={{ width: 'auto', margin: 0, padding: '8px 20px', background: 'var(--primary)' }} onClick={() => setSelectedNode({ ...inProgressLesson, nodeType: 'normal', isInProgress: true })}>
            Resume
          </button>
        </div>
      )}

      {/* Pre-lesson Preview Modal */}
      {selectedNode && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(2,6,23,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 'var(--sp-4)', backdropFilter: 'blur(8px)' }} className="animate-fadein">
          <div className="card" style={{ maxWidth: '400px', width: '100%', textAlign: 'center', padding: 'var(--sp-8)', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--sp-4)', color: 'var(--primary)' }}>
              {getNodeIcon(selectedNode.nodeType, false, false, selectedNode.isInProgress)}
            </div>
            
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800 }}>{selectedNode.lesson_title}</h3>
            <p style={{ color: 'var(--text-2)', fontSize: 'var(--text-sm)', margin: 'var(--sp-3) 0 var(--sp-5)' }}>
              {selectedNode.nodeType === 'boss' ? '🏆 Boss Lesson! Put your grammar knowledge to the ultimate test.' :
               selectedNode.nodeType === 'story' ? '📖 Interactive Japanese story with conversation choices.' :
               'Challenge yourself with new vocabulary and pronunciation drills.'}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-3)', marginBottom: 'var(--sp-6)' }}>
              <div style={{ background: 'var(--surface-2)', padding: 'var(--sp-3)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>REWARD</span>
                <p style={{ fontWeight: 'bold', color: 'var(--xp-gold)', fontSize: '16px', marginTop: '2px' }}>⚡ {selectedNode.xp_reward} XP</p>
              </div>
              <div style={{ background: 'var(--surface-2)', padding: 'var(--sp-3)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>COST</span>
                <p style={{ fontWeight: 'bold', color: 'var(--error)', fontSize: '16px', marginTop: '2px' }}>❤️ 1 Heart</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--sp-3)' }}>
              <button 
                className="btn-secondary" 
                onClick={() => setSelectedNode(null)}
                style={{ flex: 1, margin: 0, minHeight: '44px' }}
              >
                Close
              </button>
              <button 
                className="btn-primary" 
                onClick={() => {
                  onStartLesson(selectedNode.lesson_id);
                  setSelectedNode(null);
                }}
                style={{ flex: 1, margin: 0, minHeight: '44px', background: 'var(--primary)', border: 'none' }}
              >
                Start
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
