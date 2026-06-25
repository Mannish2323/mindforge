'use client';

import React, { useState } from 'react';
import { Lock, Star, ShieldAlert, Award, MessageCircle, AlertCircle, Play, Check } from 'lucide-react';
import { PremiumIcon } from './ui/PremiumIcon';

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
    if (isCompleted) return <Check size={20} strokeWidth={3} />;
    if (isLocked) return <Lock size={18} strokeWidth={2.5} />;
    
    switch (nodeType) {
      case 'boss': return <PremiumIcon type="boss" size={22} />;
      case 'review': return <PremiumIcon type="review" size={20} />;
      case 'story': return <PremiumIcon type="story" size={20} />;
      default: return isInProgress ? <PremiumIcon type="xp" size={20} /> : <Play size={18} fill="currentColor" style={{ marginLeft: '2px' }} />;
    }
  };

  const getOffsetStyle = (index: number) => {
    const cycle = index % 8;
    let offset = 0;
    if (cycle === 1 || cycle === 7) offset = 35;
    else if (cycle === 2 || cycle === 6) offset = 70;
    else if (cycle === 3 || cycle === 5) offset = 35;
    else if (cycle === 4) offset = 0;
    
    const shift = cycle > 4 ? -offset : offset;
    return shift;
  };

  // Dynamic SVG dashed path drawing connecting the stones (acting as footprint path)
  const renderPathSvg = (lessonsCount: number) => {
    if (lessonsCount <= 1) return null;
    
    const points: { x: number; y: number }[] = [];
    const itemHeight = 80; // 56px node + 24px gap
    const startY = 28; // first node center
    
    for (let i = 0; i < lessonsCount; i++) {
      const shift = getOffsetStyle(i);
      points.push({
        x: 120 + shift, // 120px is the middle of the 240px SVG container
        y: startY + i * itemHeight
      });
    }

    let d = `M ${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      const cpY = (curr.y + next.y) / 2;
      d += ` C ${curr.x},${cpY} ${next.x},${cpY} ${next.x},${next.y}`;
    }

    return (
      <svg 
        style={{
          position: 'absolute',
          top: 0,
          left: 'calc(50% - 120px)',
          width: '240px',
          height: `${startY + (lessonsCount - 1) * itemHeight + 28}px`,
          pointerEvents: 'none',
          zIndex: 0,
          overflow: 'visible',
        }}
      >
        {/* Footprint dotted track */}
        <path
          d={d}
          fill="none"
          stroke="var(--primary-light, rgba(28, 59, 43, 0.15))"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="2, 14" // looks like little foot stepping dot marks!
        />
        <path
          d={d}
          fill="none"
          stroke="var(--success, #5D9C59)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="2, 14"
          style={{ opacity: 0.1 }}
        />
      </svg>
    );
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
      <style>{`
        .stone-node {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          transition: all 0.25s ease;
          box-shadow: 0 4px 10px rgba(0,0,0,0.18);
          z-index: 2;
        }
        .stone-node.completed {
          background: linear-gradient(135deg, #A2E635, #5D9C59);
          border: 4px solid #ffffff;
          box-shadow: 0 0 16px rgba(93, 156, 89, 0.5);
          color: white;
        }
        .stone-node.in-progress {
          background: linear-gradient(135deg, #4ADE80, #16A34A);
          border: 4px solid #ffffff;
          box-shadow: 0 0 24px rgba(74, 222, 128, 0.75), 0 0 0 4px rgba(74, 222, 128, 0.25);
          color: white;
          animation: pulseGlow 1.8s infinite alternate;
        }
        .stone-node.available {
          background: linear-gradient(135deg, #86EFAC, #22C55E);
          border: 3px solid #ffffff;
          color: white;
        }
        .stone-node.locked {
          background: radial-gradient(circle at 30% 30%, #a3a3a3, #525252);
          border: 3px solid #d4d4d4;
          box-shadow: inset 0 -4px 6px rgba(0,0,0,0.25);
          color: #e5e5e5;
          cursor: not-allowed;
        }
        .stone-node:active:not(.locked) {
          transform: scale(0.92) !important;
        }
        
        @keyframes pulseGlow {
          0% { transform: scale(1.08); box-shadow: 0 0 16px rgba(74, 222, 128, 0.6); }
          100% { transform: scale(1.14); box-shadow: 0 0 28px rgba(74, 222, 128, 0.95), 0 0 0 6px rgba(74, 222, 128, 0.35); }
        }
      `}</style>

      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', marginBottom: 'var(--sp-4)' }}>
        <button className="btn-ghost" style={{ padding: '6px 12px', borderRadius: 'var(--radius)' }} onClick={onBack}>← Back</button>
        <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <PremiumIcon type="level1" size={20} /> Your Forest Journey to Language
        </h2>
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
            <div key={unit.unit_id} className="card" style={{ padding: 'var(--sp-5)', background: 'var(--surface)' }}>
              {/* Unit header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                  <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', color: 'var(--text)' }}>{unit.unit_title}</h3>
                  <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>
                    Vocab: {lessons.reduce((acc: number, l: any) => acc + (l.vocabulary?.length || 0), 0)} words
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--primary)' }}>{pct}% Complete</span>
                  <div style={{ width: '80px', height: '6px', background: 'var(--surface-3)', borderRadius: '3px', marginTop: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: 'var(--grad-primary)' }} />
                  </div>
                </div>
              </div>

              {/* Lesson path nodes chain - vertical winding path */}
              <div style={{ 
                position: 'relative', 
                width: '100%', 
                maxWidth: '240px', 
                margin: '0 auto', 
                minHeight: lessons.length > 0 ? `${lessons.length * 80}px` : 'auto'
              }}>
                {/* Winding background footprints line */}
                {renderPathSvg(lessons.length)}

                {/* Vertical flex path */}
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '24px', // 56px node + 24px gap = 80px total height per node item!
                  alignItems: 'center',
                  position: 'relative',
                  zIndex: 2,
                }}>
                  {lessons.map((lesson: any, lIdx: number) => {
                    const locked = isLessonLocked(lIdx, originalUnitIndex);
                    const completed = !!state.lessonProgress[lesson.lesson_id]?.completed;
                    const isInProgress = !completed && !locked && lesson.lesson_id === inProgressLesson?.lesson_id;

                    const isBoss = lIdx === lessons.length - 1;
                    const isStory = lesson.lesson_title.toLowerCase().includes('story') || lesson.is_premium;
                    const isReview = lIdx === 2;
                    const nodeType = isBoss ? 'boss' : isStory ? 'story' : isReview ? 'review' : 'normal';

                    const shift = getOffsetStyle(lIdx);

                    return (
                      <div
                        key={lesson.lesson_id}
                        onClick={() => !locked && setSelectedNode({ ...lesson, nodeType, isInProgress })}
                        className={`stone-node ${completed ? 'completed' : locked ? 'locked' : isInProgress ? 'in-progress' : 'available'}`}
                        style={{
                          transform: `translateX(${shift}px)`,
                          cursor: locked ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {getNodeIcon(nodeType, completed, locked, isInProgress)}
                      </div>
                    );
                  })}
                </div>
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
        <div className="card" style={{ marginTop: 'var(--sp-6)', border: '1px solid var(--border-strong)', background: 'var(--surface-2)', padding: 'var(--sp-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Lesson</span>
            <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', marginTop: '2px', color: 'var(--text)' }}>{inProgressLesson.lesson_title}</h4>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <PremiumIcon type="xp" size={12} /> {inProgressLesson.xp_reward} XP • <PremiumIcon type="heart" size={12} /> 1 Heart
            </p>
          </div>
          <button className="btn-primary" style={{ width: 'auto', margin: 0, padding: '8px 20px', background: 'var(--primary)' }} onClick={() => setSelectedNode({ ...inProgressLesson, nodeType: 'normal', isInProgress: true })}>
            Resume
          </button>
        </div>
      )}

      {/* Pre-lesson Preview Modal */}
      {selectedNode && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(11,30,18,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 'var(--sp-4)', backdropFilter: 'blur(8px)' }} className="animate-fadein">
          <div className="card" style={{ maxWidth: '400px', width: '100%', textAlign: 'center', padding: 'var(--sp-8)', boxShadow: 'var(--shadow-lg)', background: 'var(--surface)' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--sp-4)', color: 'var(--primary)' }}>
              {getNodeIcon(selectedNode.nodeType, false, false, selectedNode.isInProgress)}
            </div>
            
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, color: 'var(--text)' }}>{selectedNode.lesson_title}</h3>
            <p style={{ color: 'var(--text-2)', fontSize: 'var(--text-sm)', margin: 'var(--sp-3) 0 var(--sp-5)' }}>
              {selectedNode.nodeType === 'boss' ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
                  <PremiumIcon type="boss" size={16} /> Boss Lesson! Put your grammar knowledge to the ultimate test.
                </span>
              ) : selectedNode.nodeType === 'story' ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
                  <PremiumIcon type="story" size={16} /> Interactive Japanese story with conversation choices.
                </span>
              ) : (
                'Challenge yourself with new vocabulary and pronunciation drills.'
              )}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-3)', marginBottom: 'var(--sp-6)' }}>
              <div style={{ background: 'var(--surface-2)', padding: 'var(--sp-3)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>REWARD</span>
                <p style={{ fontWeight: 'bold', color: 'var(--xp-gold)', fontSize: '16px', marginTop: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <PremiumIcon type="xp" size={16} /> {selectedNode.xp_reward} XP
                </p>
              </div>
              <div style={{ background: 'var(--surface-2)', padding: 'var(--sp-3)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>COST</span>
                <p style={{ fontWeight: 'bold', color: 'var(--error)', fontSize: '16px', marginTop: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <PremiumIcon type="heart" size={16} /> 1 Heart
                </p>
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

