'use client';

import React, { useState } from 'react';
import { Lock, Star, ShieldAlert, Award, MessageCircle, AlertCircle, Play } from 'lucide-react';

interface LearnPathProps {
  state: any;
  units: any[];
  lessonsCache: Record<string, any>;
  onStartLesson: (lessonId: string) => void;
  onBack: () => void;
}

export function LearnPath({ state, units, lessonsCache, onStartLesson, onBack }: LearnPathProps) {
  const [selectedNode, setSelectedNode] = useState<any | null>(null);

  const getCompletedCount = (unit: any) => {
    const lessons = lessonsCache[unit.unit_id]?.lessons || [];
    return lessons.filter((l: any) => state.lessonProgress[l.lesson_id]?.completed).length;
  };

  const isLessonLocked = (lessonIndex: number, unitIndex: number) => {
    if (unitIndex === 0 && lessonIndex === 0) return false;
    
    const currentUnitLessons = lessonsCache[units[unitIndex].unit_id]?.lessons || [];
    
    // Check if previous lesson in this unit or previous unit's last lesson is complete
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

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'boss': return <ShieldAlert size={24} color="var(--error)" />;
      case 'review': return <Award size={22} color="var(--warn)" />;
      case 'story': return <MessageCircle size={22} color="var(--accent-violet)" />;
      default: return <Star size={20} color="var(--primary)" />;
    }
  };

  const getOffsetStyle = (index: number, scaleUp: boolean) => {
    const cycle = index % 8;
    let offset = 0;
    if (cycle === 1 || cycle === 7) offset = 28;
    else if (cycle === 2 || cycle === 6) offset = 56;
    else if (cycle === 3 || cycle === 5) offset = 28;
    else if (cycle === 4) offset = 0;
    
    const shift = cycle > 4 ? -offset : offset;
    return {
      transform: `translateX(${shift}px)${scaleUp ? ' scale(1.05)' : ''}`,
    };
  };

  return (
    <div className="learn-path-view page-transition" style={{ padding: 'var(--sp-4)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', marginBottom: 'var(--sp-5)' }}>
        <button className="btn-ghost" style={{ padding: '6px 12px', borderRadius: 'var(--radius)' }} onClick={onBack}>← Back</button>
        <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 800 }}>🗺️ Japanese N5 Roadmap</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}>
        {units.map((unit, uIdx) => {
          const lessons = lessonsCache[unit.unit_id]?.lessons || [];
          const completedCount = getCompletedCount(unit);
          const totalCount = lessons.length;
          const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

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
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)', padding: 'var(--sp-4) 0', alignItems: 'center', position: 'relative' }}>
                {lessons.map((lesson: any, lIdx: number) => {
                  const locked = isLessonLocked(lIdx, uIdx);
                  const completed = state.lessonProgress[lesson.lesson_id]?.completed;
                  
                  // Simple classification for node types
                  const isBoss = lIdx === lessons.length - 1;
                  const isStory = lesson.lesson_title.toLowerCase().includes('story') || lesson.is_premium;
                  const isReview = lIdx === 2;
                  const nodeType = isBoss ? 'boss' : isStory ? 'story' : isReview ? 'review' : 'normal';

                  return (
                    <div 
                      key={lesson.lesson_id} 
                      className={`path-node ${locked ? 'locked' : ''} ${completed ? 'completed' : ''}`}
                      onClick={() => !locked && setSelectedNode({ ...lesson, nodeType })}
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: completed 
                          ? 'linear-gradient(135deg, var(--primary), var(--accent-violet))' 
                          : locked 
                          ? 'var(--surface-2)' 
                          : 'var(--primary-light)',
                        border: `3px solid ${completed ? 'var(--primary)' : locked ? 'var(--border)' : 'var(--primary)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: locked ? 'not-allowed' : 'pointer',
                        transition: 'var(--t-base)',
                        boxShadow: !locked && !completed ? '0 0 16px rgba(99, 102, 241, 0.4)' : 'none',
                        ...getOffsetStyle(lIdx, !locked && !completed)
                      }}
                    >
                      {locked ? <Lock size={18} color="var(--text-3)" /> : getNodeIcon(nodeType)}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pre-lesson Preview Modal */}
      {selectedNode && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(2,6,23,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 'var(--sp-4)', backdropFilter: 'blur(8px)' }} className="animate-fadein">
          <div className="card" style={{ maxWidth: '400px', width: '100%', textAlign: 'center', padding: 'var(--sp-8)', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--sp-4)' }}>
              {getNodeIcon(selectedNode.nodeType)}
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
                style={{ flex: 1, margin: 0, minHeight: '44px', background: 'linear-gradient(135deg, var(--primary), var(--accent-violet))', border: 'none' }}
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
