'use client';

import React, { useState } from 'react';
import { Award, BookOpen, Clock, Play, CheckCircle, AlertCircle, ArrowRight, Lock, Headphones, BookOpenText } from 'lucide-react';

interface JlptPrepProps {
  state: any;
  onBack: () => void;
}

const DRILL_QUESTIONS = [
  {
    question: 'これは何のペンですか。',
    options: ['どこ', 'だれ', 'どれ', 'なに'],
    correct: 'だれ',
    translation: 'Whose pen is this?',
    type: 'grammar'
  },
  {
    question: '昨日、日本料理を＿＿＿＿＿。',
    options: ['食べました', '食べます', '食べる', '食べて'],
    correct: '食べました',
    translation: 'Yesterday, I ate Japanese food.',
    type: 'grammar'
  },
  {
    question: 'Vocab: 「切符」',
    options: ['Ticket', 'Book', 'Wallet', 'Map'],
    correct: 'Ticket',
    translation: 'Kippu means ticket.',
    type: 'vocabulary'
  }
];

export function JlptPrep({ state, onBack }: JlptPrepProps) {
  const [selectedLevel, setSelectedLevel] = useState<'N5' | 'N4' | 'N3' | 'N2' | 'N1'>('N5');
  const [drillActive, setDrillActive] = useState(false);
  const [drillIdx, setDrillIdx] = useState(0);
  const [drillScore, setDrillScore] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [drillFinished, setDrillFinished] = useState(false);

  const startDrill = () => {
    if (selectedLevel !== 'N5') return; // Locked
    setDrillActive(true);
    setDrillIdx(0);
    setDrillScore(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setDrillFinished(false);
  };

  const handleAnswerSelect = (opt: string) => {
    if (isAnswered) return;
    setSelectedOpt(opt);
    setIsAnswered(true);
    if (opt === DRILL_QUESTIONS[drillIdx].correct) {
      setDrillScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    const nextIdx = drillIdx + 1;
    if (nextIdx < DRILL_QUESTIONS.length) {
      setDrillIdx(nextIdx);
      setIsAnswered(false);
      setSelectedOpt(null);
    } else {
      setDrillFinished(true);
    }
  };

  // Compute readiness from real state (lessons completed out of 30 N5 lessons)
  const completedLessonsCount = Object.values(state?.lessonProgress || {}).filter((l: any) => l.completed).length;
  const readinessPercentage = Math.min(100, Math.round((completedLessonsCount / 30) * 100));

  return (
    <div className="jlpt-prep-view animate-fadein" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)', maxWidth: '600px', margin: '0 auto' }}>
      {/* Header */}
      <div className="flex" style={{ alignItems: 'center', gap: 'var(--sp-3)', marginBottom: 'var(--sp-2)' }}>
        <button className="btn-ghost" style={{ padding: '6px 12px', borderRadius: 'var(--radius)' }} onClick={drillActive ? () => setDrillActive(false) : onBack}>
          ← Back
        </button>
        <h2 className="text-xl font-black">🏆 JLPT Prep Center</h2>
      </div>

      {!drillActive ? (
        <div className="flex" style={{ flexDirection: 'column', gap: 'var(--sp-5)' }}>
          {/* Level selector tabs */}
          <div className="flex gap-2" style={{ background: 'var(--surface-2)', padding: '6px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', flexWrap: 'wrap' }}>
            {(['N5', 'N4', 'N3', 'N2', 'N1'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`toggle-btn ${selectedLevel === lvl ? 'active' : ''}`}
                style={{ flex: 1, textAlign: 'center', padding: '8px 0', border: 'none', borderRadius: 'var(--radius)' }}
              >
                {lvl}
              </button>
            ))}
          </div>

          {selectedLevel === 'N5' ? (
            <>
              {/* N5 Readiness progress card */}
              <div className="card animate-fadein">
                <span style={{ fontSize: '10px', color: 'var(--text-3)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.06em' }}>READINESS SCORE</span>
                <h3 className="font-bold mt-2">JLPT N5 Exam Readiness</h3>
                <p className="text-muted text-sm mt-1 mb-4">
                  Calculated based on your completed lessons, vocabulary knowledge, and grammar mastery.
                </p>
                <div className="flex" style={{ alignItems: 'center', gap: 'var(--sp-3)' }}>
                  <div className="lesson-progress-bar" style={{ flex: 1, marginBottom: 0, height: '8px' }}>
                    <div className="lesson-progress-fill" style={{ width: `${readinessPercentage}%`, background: 'var(--success)' }} />
                  </div>
                  <span className="font-bold text-sm" style={{ color: 'var(--success)' }}>{readinessPercentage}%</span>
                </div>
              </div>

              {/* 4 Category blocks */}
              <h3 className="text-base font-bold mt-1">Study Categories</h3>
              <div className="grid gap-3" style={{ gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-3)' }}>
                {/* Vocabulary Block */}
                <div className="card card-interactive flex" style={{ flexDirection: 'column', gap: 'var(--sp-2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <BookOpen size={20} className="text-green" />
                    <h4 className="font-bold">Vocabulary</h4>
                  </div>
                  <p className="text-muted text-xs">Practice 800+ N5 words and kanji.</p>
                  <button onClick={startDrill} className="btn-secondary" style={{ width: '100%', marginTop: 'auto', padding: '6px 12px', minHeight: 'unset', fontSize: '12px' }}>
                    Practice
                  </button>
                </div>

                {/* Grammar Block */}
                <div className="card card-interactive flex" style={{ flexDirection: 'column', gap: 'var(--sp-2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Award size={20} className="text-gold" />
                    <h4 className="font-bold">Grammar</h4>
                  </div>
                  <p className="text-muted text-xs">Master particle rules and N5 structures.</p>
                  <button onClick={startDrill} className="btn-secondary" style={{ width: '100%', marginTop: 'auto', padding: '6px 12px', minHeight: 'unset', fontSize: '12px' }}>
                    Practice
                  </button>
                </div>

                {/* Listening Block */}
                <div className="card card-interactive flex" style={{ flexDirection: 'column', gap: 'var(--sp-2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Headphones size={20} style={{ color: 'var(--accent-ai)' }} />
                    <h4 className="font-bold">Listening</h4>
                  </div>
                  <p className="text-muted text-xs">Audio question drills for N5 listening exam.</p>
                  <button onClick={startDrill} className="btn-secondary" style={{ width: '100%', marginTop: 'auto', padding: '6px 12px', minHeight: 'unset', fontSize: '12px' }}>
                    Practice
                  </button>
                </div>

                {/* Reading Block */}
                <div className="card card-interactive flex" style={{ flexDirection: 'column', gap: 'var(--sp-2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <BookOpenText size={20} style={{ color: 'var(--gem)' }} />
                    <h4 className="font-bold">Reading</h4>
                  </div>
                  <p className="text-muted text-xs">Read comprehension texts and short essays.</p>
                  <button onClick={startDrill} className="btn-secondary" style={{ width: '100%', marginTop: 'auto', padding: '6px 12px', minHeight: 'unset', fontSize: '12px' }}>
                    Practice
                  </button>
                </div>
              </div>

              {/* Mock test card */}
              <div className="card animate-fadein" style={{ border: '1px solid rgba(22, 163, 74, 0.3)', background: 'var(--primary-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--sp-4)', marginTop: 'var(--sp-2)' }}>
                <div>
                  <h4 className="font-black">⏰ Full N5 Mock Exam</h4>
                  <p className="text-muted text-xs mt-1">Simulate real exam rules under strict timers.</p>
                </div>
                <button onClick={startDrill} className="btn-primary" style={{ width: 'auto', margin: 0, padding: '8px 20px', background: 'var(--primary)' }}>
                  Start Mock
                </button>
              </div>
            </>
          ) : (
            /* Locked level display */
            <div className="card animate-fadein flex" style={{ flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: 'var(--sp-10)', gap: 'var(--sp-4)' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                <Lock size={28} />
              </div>
              <div>
                <h3 className="text-lg font-black">Level {selectedLevel} Locked</h3>
                <p className="text-muted text-sm mt-2" style={{ maxWidth: '300px' }}>
                  Complete the JLPT N5 study path and score 80% or higher on the mock exam to unlock the next level.
                </p>
              </div>
              <button 
                onClick={() => setSelectedLevel('N5')}
                className="btn-primary"
                style={{ width: 'auto', margin: 0, padding: '8px 20px', background: 'var(--primary)' }}
              >
                Go back to N5
              </button>
            </div>
          )}
        </div>
      ) : (
        /* DRILL PLAYING STATE */
        <div className="flex" style={{ flexDirection: 'column', gap: 'var(--sp-4)', alignItems: 'center', width: '100%' }}>
          {!drillFinished ? (
            <div className="card animate-fadein" style={{ width: '100%', maxWidth: '520px' }}>
              <div className="flex-between flex" style={{ marginBottom: 'var(--sp-4)' }}>
                <span className="text-xs text-muted">Question {drillIdx + 1} of {DRILL_QUESTIONS.length}</span>
                <span className="badge" style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '4px 10px', borderRadius: 'var(--radius-pill)', fontSize: '10px', fontWeight: 'bold' }}>
                  {DRILL_QUESTIONS[drillIdx].type.toUpperCase()}
                </span>
              </div>

              <p className="font-black text-xl" style={{ textAlign: 'center', margin: 'var(--sp-6) 0', fontFamily: 'var(--font-ja)' }}>
                {DRILL_QUESTIONS[drillIdx].question}
              </p>

              <div className="choices">
                {DRILL_QUESTIONS[drillIdx].options.map((opt) => {
                  const correct = DRILL_QUESTIONS[drillIdx].correct;
                  const isSelected = selectedOpt === opt;
                  let classState = '';

                  if (isAnswered) {
                    if (opt === correct) {
                      classState = 'correct';
                    } else if (isSelected) {
                      classState = 'incorrect';
                    }
                  } else if (isSelected) {
                    classState = 'selected';
                  }

                  return (
                    <button
                      key={opt}
                      onClick={() => handleAnswerSelect(opt)}
                      className={`choice-btn ${classState}`}
                      disabled={isAnswered}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {isAnswered && (
                <div className="animate-fadein" style={{ marginTop: 'var(--sp-4)' }}>
                  <div className={`feedback-panel ${selectedOpt === DRILL_QUESTIONS[drillIdx].correct ? 'correct' : 'incorrect'}`}>
                    <h4 className="font-bold">
                      {selectedOpt === DRILL_QUESTIONS[drillIdx].correct ? '🎉 Correct Answer!' : '❌ Incorrect'}
                    </h4>
                    <p className="text-sm">
                      <strong>Translation:</strong> {DRILL_QUESTIONS[drillIdx].translation}
                    </p>
                  </div>
                  <button
                    onClick={handleNext}
                    className="btn-primary"
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--primary)' }}
                  >
                    Next Question <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* DRILL COMPLETED */
            <div className="card animate-bounce" style={{ width: '100%', maxWidth: '440px', textAlign: 'center' }}>
              <CheckCircle size={52} className="text-green" style={{ margin: '0 auto var(--sp-4)' }} />
              <h3 className="text-2xl font-black">Drill Completed!</h3>
              <p className="text-muted text-sm mt-3 mb-5">
                You scored {drillScore} out of {DRILL_QUESTIONS.length} correctly. Keep it up!
              </p>
              <button
                onClick={() => setDrillActive(false)}
                className="btn-primary"
                style={{ width: '100%', background: 'var(--primary)' }}
              >
                Back to Prep Center
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
