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
      case 'boss': return <ShieldAlert size={24} color="var(--red)" />;
      case 'review': return <Award size={22} color="var(--amber)" />;
      case 'story': return <MessageCircle size={22} color="var(--blue)" />;
      default: return <Star size={20} color="var(--green-500)" />;
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
    return {
      transform: `translateX(${shift}px)`,
    };
  };

  return (
    <div className="learn-path-view page-enter" style={{ padding: 'var(--space-4)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
        <button className="btn btn-ghost btn-sm" onClick={onBack}>← Back</button>
        <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 800 }}>🗺️ N5 Roadmap</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {units.map((unit, uIdx) => {
          const lessons = lessonsCache[unit.unit_id]?.lessons || [];
          const completedCount = getCompletedCount(unit);
          const totalCount = lessons.length;
          const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

          return (
            <div key={unit.unit_id} className="unit-card card-glass" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-5)' }}>
              {/* Unit header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
                <div>
                  <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 'bold' }}>{unit.unit_title}</h3>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Vocab: {lessons.reduce((acc: number, l: any) => acc + (l.vocabulary?.length || 0), 0)} words
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--green-400)' }}>{pct}% Complete</span>
                  <div style={{ width: '80px', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', marginTop: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: 'var(--grad-primary)' }} />
                  </div>
                </div>
              </div>

              {/* Lesson path nodes chain - vertical winding path */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', padding: 'var(--space-4) 0', alignItems: 'center' }}>
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
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        background: completed ? 'var(--grad-primary)' : locked ? 'rgba(255,255,255,0.02)' : 'rgba(22, 163, 74, 0.15)',
                        border: `2px solid ${completed ? 'var(--green-500)' : locked ? 'var(--border)' : 'var(--green-400)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: locked ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s',
                        boxShadow: !locked && !completed ? '0 0 12px rgba(74, 222, 128, 0.25)' : 'none',
                        ...getOffsetStyle(lIdx)
                      }}
                    >
                      {locked ? <Lock size={18} color="var(--text-muted)" /> : getNodeIcon(nodeType)}
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
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 'var(--space-4)' }}>
          <div className="card-glass" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(22, 163, 74, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-4)' }}>
              {getNodeIcon(selectedNode.nodeType)}
            </div>
            
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800 }}>{selectedNode.lesson_title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', margin: 'var(--space-3) 0 var(--space-5)' }}>
              {selectedNode.nodeType === 'boss' ? '🏆 Boss Lesson! Put your grammar knowledge to the ultimate test.' :
               selectedNode.nodeType === 'story' ? '📖 Interactive Japanese story with conversation choices.' :
               'Challenge yourself with new vocabulary and pronunciation drills.'}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>REWARD</span>
                <p style={{ fontWeight: 'bold', color: 'var(--amber)', fontSize: '16px', marginTop: '2px' }}>⚡ {selectedNode.xp_reward} XP</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>COST</span>
                <p style={{ fontWeight: 'bold', color: 'var(--red)', fontSize: '16px', marginTop: '2px' }}>❤️ 1 Heart</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <button 
                className="btn btn-ghost" 
                onClick={() => setSelectedNode(null)}
                style={{ flex: 1, border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}
              >
                Close
              </button>
              <button 
                className="btn btn-primary" 
                onClick={() => {
                  onStartLesson(selectedNode.lesson_id);
                  setSelectedNode(null);
                }}
                style={{ flex: 1, background: 'var(--green-500)', border: 'none', color: '#fff', borderRadius: 'var(--radius-md)', fontWeight: 'bold' }}
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
