'use client';

import React, { useState } from 'react';
import { Award, BookOpen, Clock, Play, CheckCircle, AlertCircle, ArrowRight, Lock, Headphones, BookOpenText } from 'lucide-react';
import { JlptEncyclopedia } from './jlpt/JlptEncyclopedia';
import { 
  hiraganaData, katakanaData, kanjiData, vocabData, 
  grammarData, conjugationData, numeralData, counterData 
} from './jlpt/encyclopediaData';

interface JlptPrepProps {
  state: any;
  onBack: () => void;
}

interface Question {
  question: string;
  options: string[];
  correct: string;
  translation: string;
  type: 'vocabulary' | 'grammar' | 'listening' | 'reading';
}

// Fisher-Yates shuffle
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Dynamic question generator based on selected level & category
function generateDynamicQuestions(level: string, category: 'vocab' | 'grammar' | 'listening' | 'reading' | 'mock'): Question[] {
  const list: Question[] = [];

  // Helper to get vocabulary distractors
  const allVocabEnglish = vocabData.map(v => v.english);
  const getVocabDistractors = (correct: string) => {
    return shuffle(allVocabEnglish.filter(e => e !== correct)).slice(0, 3);
  };

  // Helper to get grammar distractors
  const allGrammarMeanings = grammarData.map(g => g.meaning);
  const getGrammarDistractors = (correct: string) => {
    return shuffle(allGrammarMeanings.filter(m => m !== correct)).slice(0, 3);
  };

  // Helper to get kana distractors
  const allRomaji = hiraganaData.map(k => k.romaji);
  const getKanaDistractors = (correct: string) => {
    return shuffle(allRomaji.filter(r => r !== correct)).slice(0, 3);
  };

  // Helper to get reading sentence distractors
  const allSentencesEnglish = vocabData.map(v => {
    const parts = v.exampleSentence.split('(');
    return parts.length > 1 ? parts[1].replace(')', '') : '';
  }).filter(s => s !== '');
  const getSentenceDistractors = (correct: string) => {
    return shuffle(allSentencesEnglish.filter(s => s !== correct)).slice(0, 3);
  };

  // 1. Vocabulary drill generator
  const makeVocab = () => {
    // get N5 level kanji or vocabulary
    const levelVocab = vocabData.filter(v => v.category !== 'slang' && v.category !== 'keigo');
    const selected = shuffle(levelVocab).slice(0, 5);
    selected.forEach(v => {
      const dist = getVocabDistractors(v.english);
      list.push({
        question: `What does this word mean? 「${v.japanese}」 (${v.hiragana})`,
        options: shuffle([v.english, ...dist]),
        correct: v.english,
        translation: `Example: ${v.exampleSentence}`,
        type: 'vocabulary'
      });
    });
  };

  // 2. Grammar drill generator
  const makeGrammar = () => {
    // Filter grammar for specific level (fallback to all if list is short)
    let matchedGrammar = grammarData.filter(g => g.level === level);
    if (matchedGrammar.length < 3) {
      matchedGrammar = grammarData;
    }
    const selected = shuffle(matchedGrammar).slice(0, 5);
    selected.forEach(g => {
      const dist = getGrammarDistractors(g.meaning);
      list.push({
        question: `Identify the function/meaning of grammar point: 「${g.point}」`,
        options: shuffle([g.meaning, ...dist]),
        correct: g.meaning,
        translation: `Example: ${g.example}`,
        type: 'grammar'
      });
    });
  };

  // 3. Phonics Phonics/Listening generator
  const makeListening = () => {
    // Select random hiragana/katakana basic characters
    const selection = shuffle(hiraganaData.filter(k => k.type === 'basic')).slice(0, 5);
    selection.forEach(k => {
      const dist = getKanaDistractors(k.romaji);
      list.push({
        question: `Identify the correct Romaji reading for phonetic symbol: 「${k.kana}」`,
        options: shuffle([k.romaji, ...dist]),
        correct: k.romaji,
        translation: `Hiragana syllabary character. Pronounced as "${k.romaji}".`,
        type: 'listening'
      });
    });
  };

  // 4. Reading Comprehension generator
  const makeReading = () => {
    const levelKanji = kanjiData.filter(k => k.level === level);
    const selected = shuffle(levelKanji.length > 0 ? levelKanji : kanjiData).slice(0, 4);
    
    selected.forEach(k => {
      // Find the English translation of the sentence (split at '(')
      const parts = k.exampleSentence.split('(');
      const sentenceJapanese = parts[0].trim();
      const sentenceEnglish = parts.length > 1 ? parts[1].replace(')', '').trim() : k.meaning;
      
      const dist = getSentenceDistractors(sentenceEnglish);
      list.push({
        question: `Translate the sentence: 「${sentenceJapanese}」`,
        options: shuffle([sentenceEnglish, ...dist]),
        correct: sentenceEnglish,
        translation: `Kanji: ${k.kanji} (${k.meaning}) | Onyomi: ${k.onyomi} | Kunyomi: ${k.kunyomi}`,
        type: 'reading'
      });
    });
  };

  // Execution branching
  if (category === 'vocab') {
    makeVocab();
  } else if (category === 'grammar') {
    makeGrammar();
  } else if (category === 'listening') {
    makeListening();
  } else if (category === 'reading') {
    makeReading();
  } else {
    // Mock Exam: blend of all categories (8 questions total)
    makeVocab();
    makeGrammar();
    makeListening();
    makeReading();
    return shuffle(list).slice(0, 8);
  }

  return list;
}

export function JlptPrep({ state, onBack }: JlptPrepProps) {
  const [viewMode, setViewMode] = useState<'prep' | 'encyclopedia'>('prep');
  const [selectedLevel, setSelectedLevel] = useState<'N5' | 'N4' | 'N3' | 'N2' | 'N1'>('N5');
  const [drillActive, setDrillActive] = useState(false);
  const [drillQuestions, setDrillQuestions] = useState<Question[]>([]);
  const [drillIdx, setDrillIdx] = useState(0);
  const [drillScore, setDrillScore] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [drillFinished, setDrillFinished] = useState(false);

  const startDrill = (category: 'vocab' | 'grammar' | 'listening' | 'reading' | 'mock') => {
    if (selectedLevel !== 'N5') return; // Locked level protection
    const questions = generateDynamicQuestions(selectedLevel, category);
    setDrillQuestions(questions);
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
    if (opt === drillQuestions[drillIdx].correct) {
      setDrillScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    const nextIdx = drillIdx + 1;
    if (nextIdx < drillQuestions.length) {
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
    <div className="jlpt-prep-view animate-fadein" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)', maxWidth: '800px', margin: '0 auto', paddingBottom: 'calc(var(--bottom-nav-h) + 24px)' }}>
      {/* Header */}
      <div className="flex-between flex" style={{ marginBottom: 'var(--sp-2)', flexWrap: 'wrap', gap: '12px' }}>
        <div className="flex" style={{ alignItems: 'center', gap: 'var(--sp-3)' }}>
          <button className="btn-ghost" style={{ padding: '6px 12px', borderRadius: 'var(--radius)' }} onClick={drillActive ? () => setDrillActive(false) : onBack}>
            ← Back
          </button>
          <h2 className="text-xl font-black">🏆 JLPT Study Hub</h2>
        </div>

        {/* View Mode Toggle (Prep vs Encyclopedia) */}
        {!drillActive && (
          <div className="flex gap-1" style={{ background: 'var(--surface-3)', padding: '3px', borderRadius: '8px' }}>
            <button
              onClick={() => setViewMode('prep')}
              className={`toggle-btn ${viewMode === 'prep' ? 'active' : ''}`}
              style={{ padding: '6px 14px', fontSize: '12px', border: 'none', borderRadius: '6px' }}
            >
              Practice Drills
            </button>
            <button
              onClick={() => setViewMode('encyclopedia')}
              className={`toggle-btn ${viewMode === 'encyclopedia' ? 'active' : ''}`}
              style={{ padding: '6px 14px', fontSize: '12px', border: 'none', borderRadius: '6px' }}
            >
              Linguistic Encyclopedia
            </button>
          </div>
        )}
      </div>

      {/* Main rendering logic based on active state */}
      {drillActive ? (
        /* DRILL PLAYING STATE */
        <div className="flex" style={{ flexDirection: 'column', gap: 'var(--sp-4)', alignItems: 'center', width: '100%' }}>
          {!drillFinished ? (
            <div className="card animate-fadein" style={{ width: '100%', maxWidth: '560px' }}>
              <div className="flex-between flex" style={{ marginBottom: 'var(--sp-4)' }}>
                <span className="text-xs text-muted">Question {drillIdx + 1} of {drillQuestions.length}</span>
                <span className="badge" style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '4px 10px', borderRadius: 'var(--radius-pill)', fontSize: '10px', fontWeight: 'bold' }}>
                  {drillQuestions[drillIdx].type.toUpperCase()}
                </span>
              </div>

              <p className="font-black text-xl" style={{ textAlign: 'center', margin: 'var(--sp-6) 0', fontFamily: 'var(--font-ja)' }}>
                {drillQuestions[drillIdx].question}
              </p>

              <div className="choices" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
                {drillQuestions[drillIdx].options.map((opt) => {
                  const correct = drillQuestions[drillIdx].correct;
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
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)',
                        background: isSelected ? 'var(--primary-light)' : 'var(--surface-2)',
                        textAlign: 'left',
                        cursor: isAnswered ? 'default' : 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {isAnswered && (
                <div className="animate-fadein" style={{ marginTop: 'var(--sp-4)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div className={`feedback-panel ${selectedOpt === drillQuestions[drillIdx].correct ? 'correct' : 'incorrect'}`} style={{
                    padding: '12px',
                    borderRadius: 'var(--radius)',
                    background: selectedOpt === drillQuestions[drillIdx].correct ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                    border: `1px solid ${selectedOpt === drillQuestions[drillIdx].correct ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                  }}>
                    <h4 className="font-bold">
                      {selectedOpt === drillQuestions[drillIdx].correct ? '🎉 Correct Answer!' : '❌ Incorrect'}
                    </h4>
                    <p className="text-sm mt-1" style={{ color: 'var(--text)' }}>
                      {drillQuestions[drillIdx].translation}
                    </p>
                  </div>
                  <button
                    onClick={handleNext}
                    className="btn-primary"
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'var(--primary)' }}
                  >
                    Next Question <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* DRILL COMPLETED */
            <div className="card animate-bounce" style={{ width: '100%', maxWidth: '440px', textAlign: 'center', padding: 'var(--sp-6)' }}>
              <CheckCircle size={52} className="text-green" style={{ margin: '0 auto var(--sp-4)' }} />
              <h3 className="text-2xl font-black">Drill Completed!</h3>
              <p className="text-muted text-sm mt-3 mb-5">
                You scored {drillScore} out of {drillQuestions.length} correctly. Keep it up!
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
      ) : viewMode === 'encyclopedia' ? (
        /* ENCYCLOPEDIA INTERACTIVE REFERENCE VIEW */
        <JlptEncyclopedia />
      ) : (
        /* STANDARD PREP CENTER DASHBOARD */
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
                  <button onClick={() => startDrill('vocab')} className="btn-secondary" style={{ width: '100%', marginTop: 'auto', padding: '6px 12px', minHeight: 'unset', fontSize: '12px' }}>
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
                  <button onClick={() => startDrill('grammar')} className="btn-secondary" style={{ width: '100%', marginTop: 'auto', padding: '6px 12px', minHeight: 'unset', fontSize: '12px' }}>
                    Practice
                  </button>
                </div>

                {/* Phonics/Listening Block */}
                <div className="card card-interactive flex" style={{ flexDirection: 'column', gap: 'var(--sp-2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Headphones size={20} style={{ color: 'var(--accent-ai)' }} />
                    <h4 className="font-bold">Phonics & Kana</h4>
                  </div>
                  <p className="text-muted text-xs">Identify pronunciation of phonetic characters.</p>
                  <button onClick={() => startDrill('listening')} className="btn-secondary" style={{ width: '100%', marginTop: 'auto', padding: '6px 12px', minHeight: 'unset', fontSize: '12px' }}>
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
                  <button onClick={() => startDrill('reading')} className="btn-secondary" style={{ width: '100%', marginTop: 'auto', padding: '6px 12px', minHeight: 'unset', fontSize: '12px' }}>
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
                <button onClick={() => startDrill('mock')} className="btn-primary" style={{ width: 'auto', margin: 0, padding: '8px 20px', background: 'var(--primary)' }}>
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
      )}
    </div>
  );
}
