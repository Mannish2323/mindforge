'use client';

import React, { useState } from 'react';
import { Award, BookOpen, Clock, Play, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

interface JlptPrepProps {
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

export function JlptPrep({ onBack }: JlptPrepProps) {
  const [selectedLevel, setSelectedLevel] = useState<'N5' | 'N4' | 'N3' | 'N2' | 'N1'>('N5');
  const [drillActive, setDrillActive] = useState(false);
  const [drillIdx, setDrillIdx] = useState(0);
  const [drillScore, setDrillScore] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [drillFinished, setDrillFinished] = useState(false);

  const startDrill = () => {
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

  return (
    <div className="jlpt-prep-view animate-fadein" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
      {/* Header */}
      <div className="flex" style={{ alignItems: 'center', gap: 'var(--sp-3)', marginBottom: 'var(--sp-2)' }}>
        <button className="btn-ghost" style={{ padding: '6px 12px', borderRadius: 'var(--radius-pill)' }} onClick={drillActive ? () => setDrillActive(false) : onBack}>
          ← Back
        </button>
        <h2 className="text-xl font-black">🏆 JLPT Prep Center</h2>
      </div>

      {!drillActive ? (
        <div className="flex" style={{ flexDirection: 'column', gap: 'var(--sp-5)' }}>
          {/* Level selector tabs */}
          <div className="flex gap-2" style={{ background: 'var(--surface-2)', padding: '6px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border)', flexWrap: 'wrap' }}>
            {(['N5', 'N4', 'N3', 'N2', 'N1'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`toggle-btn ${selectedLevel === lvl ? 'active' : ''}`}
                style={{ flex: 1, textAlign: 'center', padding: '8px 0', border: 'none' }}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Daily Roadmap Planner card */}
          <div className="card animate-fadein">
            <span style={{ fontSize: '10px', color: 'var(--text-3)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.06em' }}>PLANNER</span>
            <h3 className="font-bold mt-2">Your Daily {selectedLevel} Goal</h3>
            <p className="text-muted text-sm mt-2 mb-4">
              Complete 1 mini mock test and review 5 grammar points to stay on track for your target exam.
            </p>
            <div className="flex" style={{ alignItems: 'center', gap: 'var(--sp-2)' }}>
              <div className="lesson-progress-bar" style={{ flex: 1, marginBottom: 0, height: '8px' }}>
                <div className="lesson-progress-fill" style={{ width: '40%', background: 'var(--xp-gold)' }} />
              </div>
              <span className="text-gold font-bold text-sm">40%</span>
            </div>
          </div>

          {/* Exam modules selection */}
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--sp-4)' }}>
            
            {/* Vocab & Grammar Drill Card */}
            <div className="card card-interactive flex" style={{ flexDirection: 'column', gap: 'var(--sp-2)' }}>
              <BookOpen size={28} className="text-gold" />
              <h4 className="font-bold mt-1">Grammar & Vocabulary Drills</h4>
              <p className="text-muted text-xs">
                Targeted practice sets matching standard {selectedLevel} question formats.
              </p>
              <button onClick={startDrill} className="btn-secondary" style={{ width: '100%', marginTop: 'auto' }}>
                Start Drill
              </button>
            </div>

            {/* Mock Listening Card */}
            <div className="card card-interactive flex" style={{ flexDirection: 'column', gap: 'var(--sp-2)' }}>
              <Clock size={28} style={{ color: 'var(--accent-ai)' }} />
              <h4 className="font-bold mt-1">Mock Mini-Test</h4>
              <p className="text-muted text-xs">
                10-question timed set to evaluate your overall level capability.
              </p>
              <button onClick={startDrill} className="btn-secondary" style={{ width: '100%', marginTop: 'auto' }}>
                Begin Mock
              </button>
            </div>
            
          </div>
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
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px' }}
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
                style={{ width: '100%' }}
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
