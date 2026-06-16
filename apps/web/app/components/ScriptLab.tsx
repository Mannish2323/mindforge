'use client';

import React, { useState } from 'react';
import { Volume2, Award, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { speakText } from '@evlo/utils';

interface ScriptLabProps {
  onBack: () => void;
}

const KANA_DATA = [
  { char: 'さ', romaji: 'sa', sound: 'sa', type: 'hiragana', hints: 'Looks like a key, but watch the break in strokes!' },
  { char: 'ち', romaji: 'chi', sound: 'chi', type: 'hiragana', hints: 'Looks like sa but flipped, do not mix them up!' },
  { char: 'ぬ', romaji: 'nu', sound: 'nu', type: 'hiragana', hints: 'Has a loop at the tail, like noodles!' },
  { char: 'め', romaji: 'me', sound: 'me', type: 'hiragana', hints: 'No loop at the tail, just a clean stroke!' },
  { char: 'あ', romaji: 'a', sound: 'a', type: 'hiragana', hints: 'Looks like an apple with a stem!' },
  { char: 'い', romaji: 'i', sound: 'i', type: 'hiragana', hints: 'Two vertical strokes, like two eels!' },
];

export function ScriptLab({ onBack }: ScriptLabProps) {
  const [activeMode, setActiveMode] = useState<'learn' | 'quiz' | 'confusion'>('learn');
  const [selectedCharIdx, setSelectedCharIdx] = useState(0);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);

  const currentChar = KANA_DATA[selectedCharIdx];

  const handlePlaySound = (text: string) => {
    speakText(text, 'ja-JP');
  };

  const startQuiz = () => {
    setQuizIdx(0);
    setQuizScore(0);
    setQuizDone(false);
    setIsAnswered(false);
    setSelectedOption(null);
    generateQuizOptions(0);
    setActiveMode('quiz');
  };

  const generateQuizOptions = (idx: number) => {
    const correct = KANA_DATA[idx].romaji;
    const pool = KANA_DATA.filter(k => k.romaji !== correct).map(k => k.romaji);
    // Shuffle pool and take 3
    const options = pool.sort(() => 0.5 - Math.random()).slice(0, 3);
    options.push(correct);
    // Shuffle options
    setShuffledOptions(options.sort(() => 0.5 - Math.random()));
  };

  const handleQuizAnswer = (romaji: string) => {
    if (isAnswered) return;
    setSelectedOption(romaji);
    setIsAnswered(true);
    const correct = KANA_DATA[quizIdx].romaji;
    if (romaji === correct) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleQuizNext = () => {
    const nextIdx = quizIdx + 1;
    if (nextIdx < KANA_DATA.length) {
      setQuizIdx(nextIdx);
      setIsAnswered(false);
      setSelectedOption(null);
      generateQuizOptions(nextIdx);
    } else {
      setQuizDone(true);
    }
  };

  return (
    <div className="script-lab-view page-enter" style={{ padding: 'var(--space-4)' }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <button className="btn btn-ghost btn-sm" onClick={onBack}>← Back</button>
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 800 }}>✍️ Script Lab</h2>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-1)', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setActiveMode('learn')} 
            className={`btn btn-sm ${activeMode === 'learn' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: 'var(--radius-pill)', fontSize: '11px', fontWeight: 'bold', padding: '4px 10px' }}
          >
            Study
          </button>
          <button 
            onClick={startQuiz} 
            className={`btn btn-sm ${activeMode === 'quiz' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: 'var(--radius-pill)', fontSize: '11px', fontWeight: 'bold', padding: '4px 10px' }}
          >
            Quiz
          </button>
          <button 
            onClick={() => setActiveMode('confusion')} 
            className={`btn btn-sm ${activeMode === 'confusion' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: 'var(--radius-pill)', fontSize: '11px', fontWeight: 'bold', padding: '4px 10px' }}
          >
            Pairs
          </button>
        </div>
      </div>

      {/* LEARN MODE */}
      {activeMode === 'learn' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', alignItems: 'center' }}>
          {/* Hero Character Card */}
          <div className="card-glass" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: '360px', textAlign: 'center', position: 'relative' }}>
            <span style={{ position: 'absolute', top: 'var(--space-3)', right: 'var(--space-4)', background: 'rgba(22, 163, 74, 0.1)', color: 'var(--green-400)', fontSize: '10px', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
              Mastery: 80%
            </span>

            {/* Large Character Hero */}
            <div style={{ fontSize: '72px', fontWeight: 'bold', margin: 'var(--space-4) 0', fontFamily: 'var(--font-ja)' }}>
              {currentChar.char}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>/{currentChar.romaji}/</span>
              <button 
                onClick={() => handlePlaySound(currentChar.char)}
                style={{ border: 'none', background: 'rgba(255,255,255,0.05)', color: 'var(--green-400)', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <Volume2 size={18} />
              </button>
            </div>

            {/* Stroke trace placeholder / animation canvas */}
            <div style={{ border: '1px dashed var(--border)', padding: 'var(--space-5)', borderRadius: 'var(--radius-lg)', margin: 'var(--space-4) 0', background: 'rgba(0,0,0,0.2)' }}>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Interactive Stroke Canvas</p>
              <div style={{ fontSize: '48px', opacity: 0.15, userSelect: 'none', margin: '10px 0', fontFamily: 'var(--font-ja)' }}>
                {currentChar.char}
              </div>
              <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Trace with your mouse/finger</span>
            </div>

            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.02)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)' }}>
              💡 <strong>Hint:</strong> {currentChar.hints}
            </p>
          </div>

          {/* Navigation controls */}
          <div style={{ display: 'flex', gap: 'var(--space-3)', width: '100%', maxWidth: '360px' }}>
            <button 
              disabled={selectedCharIdx === 0}
              className="btn btn-ghost" 
              onClick={() => setSelectedCharIdx(prev => prev - 1)}
              style={{ flex: 1, border: '1px solid var(--border)' }}
            >
              Previous
            </button>
            <button 
              disabled={selectedCharIdx === KANA_DATA.length - 1}
              className="btn btn-primary" 
              onClick={() => setSelectedCharIdx(prev => prev + 1)}
              style={{ flex: 1, background: 'var(--green-500)', color: '#fff' }}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* QUIZ MODE */}
      {activeMode === 'quiz' && !quizDone && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', alignItems: 'center' }}>
          <div className="card-glass" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: '360px', textAlign: 'center' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Question {quizIdx + 1} of {KANA_DATA.length}</span>
            <div style={{ fontSize: '80px', fontWeight: 'bold', margin: '20px 0', fontFamily: 'var(--font-ja)' }}>
              {KANA_DATA[quizIdx].char}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
              {shuffledOptions.map((opt) => {
                const correct = KANA_DATA[quizIdx].romaji;
                const isSelected = selectedOption === opt;
                let bg = 'rgba(255,255,255,0.02)';
                let border = 'var(--border)';
                
                if (isAnswered) {
                  if (opt === correct) {
                    bg = 'rgba(34, 197, 94, 0.15)';
                    border = 'var(--green-500)';
                  } else if (isSelected) {
                    bg = 'rgba(239, 68, 68, 0.15)';
                    border = 'var(--red)';
                  }
                }

                return (
                  <button 
                    key={opt}
                    onClick={() => handleQuizAnswer(opt)}
                    style={{
                      padding: 'var(--space-4)',
                      borderRadius: 'var(--radius-md)',
                      background: bg,
                      border: `1px solid ${border}`,
                      color: '#fff',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      cursor: isAnswered ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <button 
                onClick={handleQuizNext}
                className="btn btn-primary"
                style={{ marginTop: 'var(--space-5)', width: '100%', background: 'var(--green-500)', border: 'none', color: '#fff' }}
              >
                Continue
              </button>
            )}
          </div>
        </div>
      )}

      {/* QUIZ COMPLETED SUMMARY */}
      {activeMode === 'quiz' && quizDone && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', alignItems: 'center' }}>
          <div className="card-glass" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: '360px', textAlign: 'center' }}>
            <Award size={48} color="var(--amber)" style={{ margin: '0 auto var(--space-4)' }} />
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800 }}>Quiz Finished!</h3>
            <p style={{ margin: 'var(--space-3) 0 var(--space-5)', color: 'var(--text-secondary)' }}>
              You scored {quizScore} out of {KANA_DATA.length} characters correctly.
            </p>
            <button 
              onClick={startQuiz}
              className="btn btn-primary" 
              style={{ width: '100%', background: 'var(--green-500)', border: 'none', color: '#fff' }}
            >
              Retry Quiz
            </button>
          </div>
        </div>
      )}

      {/* CONFUSION PAIRS MODE */}
      {activeMode === 'confusion' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="card-glass" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: 'var(--space-5)', borderRadius: 'var(--radius-lg)' }}>
            <h3 style={{ fontWeight: 'bold', marginBottom: 'var(--space-3)' }}>さ (sa) vs ち (chi)</h3>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.02)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', flex: 1 }}>
                <span style={{ fontSize: '36px', fontFamily: 'var(--font-ja)' }}>さ</span>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>Strokes break at bottom</p>
              </div>
              <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.02)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', flex: 1 }}>
                <span style={{ fontSize: '36px', fontFamily: 'var(--font-ja)' }}>ち</span>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>Crosses like a 5 or T</p>
              </div>
            </div>
          </div>

          <div className="card-glass" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: 'var(--space-5)', borderRadius: 'var(--radius-lg)' }}>
            <h3 style={{ fontWeight: 'bold', marginBottom: 'var(--space-3)' }}>ぬ (nu) vs め (me)</h3>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.02)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', flex: 1 }}>
                <span style={{ fontSize: '36px', fontFamily: 'var(--font-ja)' }}>ぬ</span>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>Has a loops loop loop tail</p>
              </div>
              <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.02)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', flex: 1 }}>
                <span style={{ fontSize: '36px', fontFamily: 'var(--font-ja)' }}>め</span>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>No loop at the tail end</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
