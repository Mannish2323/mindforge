'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronRight, Volume2, BookOpen, Dumbbell, FlaskConical, ArrowLeft, CheckCircle, XCircle, Lightbulb, Crown, Lock, RotateCcw, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createClient } from '../lib/supabase';
import { WordExplainer } from './jlpt/WordExplainer';
import { PremiumIcon } from './ui/PremiumIcon';

// ─── Types ────────────────────────────────────────────────────────────────────
interface VocabWord {
  id: string;
  japanese: string;
  kana: string;
  romaji: string;
  english_meaning: string;
  hindi_meaning: string;
  part_of_speech: string;
  jlpt_level: string;
  category: string;
  example_sentence_japanese: string;
  example_sentence_english: string;
  audio_url: string | null;
}

type VocabMode = 'jlpt_n5' | 'jft_basic' | 'ssw';
type LearningStep = 'menu' | 'teach' | 'quiz' | 'mock' | 'result';
type AnswerState = 'idle' | 'correct' | 'wrong';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateOptions(correct: VocabWord, pool: VocabWord[]): string[] {
  const distractors = shuffle(pool.filter(w => w.id !== correct.id)).slice(0, 3);
  return shuffle([correct.english_meaning, ...distractors.map(d => d.english_meaning)]);
}

// ─── Sub-Components ──────────────────────────────────────────────────────────

const ModeLabel: Record<VocabMode, string> = {
  jlpt_n5: 'JLPT N5',
  jft_basic: 'JFT-Basic',
  ssw: 'SSW',
};

const ModeIcon: Record<VocabMode, string> = {
  jlpt_n5: 'kana',
  jft_basic: 'time',
  ssw: 'swords',
};

const ModeDesc: Record<VocabMode, string> = {
  jlpt_n5: '100 essential words for JLPT N5',
  jft_basic: '50 workplace words for JFT-Basic',
  ssw: '50 SSW industry & visa terms',
};

// ─── Main Component ───────────────────────────────────────────────────────────
interface VocabLearnViewProps {
  state: any;
  onXpGained?: (xp: number) => void;
  onHeartLost?: () => void;
}

export function VocabLearnView({ state, onXpGained, onHeartLost }: VocabLearnViewProps) {
  const { profile, updateProfileStats } = useAuth();

  const [isExplainerOpen, setIsExplainerOpen] = useState(false);
  const [explainerWord, setExplainerWord] = useState('');

  // ── Word pool state ──
  const [mode, setMode] = useState<VocabMode>('jlpt_n5');
  const [wordPool, setWordPool] = useState<VocabWord[]>([]);
  const [learnedIds, setLearnedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  // ── Session state ──
  const [step, setStep] = useState<LearningStep>('menu');
  const [sessionWords, setSessionWords] = useState<VocabWord[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [sessionSize] = useState(5); // words per session

  // ── Teach step ──
  const [showHindi, setShowHindi] = useState(false);
  const [showExample, setShowExample] = useState(false);

  // ── Quiz / Mock step ──
  const [options, setOptions] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>('idle');
  const [showHint, setShowHint] = useState(false);

  // ── Result ──
  const [correctCount, setCorrectCount] = useState(0);
  const [sessionType, setSessionType] = useState<'quiz' | 'mock'>('quiz');

  const speakWord = useCallback((text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'ja-JP';
    utter.rate = 0.9;
    window.speechSynthesis.speak(utter);
  }, []);

  // Load vocabulary JSON
  const loadWordPool = useCallback(async (m: VocabMode) => {
    setLoading(true);
    try {
      const res = await fetch(`/data/vocab/${m}.json`);
      const data: VocabWord[] = await res.json();
      setWordPool(data);
    } catch (e) {
      console.error('Failed to load vocab:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load learned word IDs from Supabase
  const loadLearnedIds = useCallback(async () => {
    if (!profile?.uid) return;
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from('user_learned_words')
        .select('word_id')
        .eq('user_id', profile.uid)
        .eq('quiz_eligible', true);
      if (data) setLearnedIds(new Set(data.map((r: any) => r.word_id)));
    } catch { /* silent — graceful degradation */ }
  }, [profile?.uid]);

  useEffect(() => {
    loadWordPool(mode);
    loadLearnedIds();
  }, [mode, loadWordPool, loadLearnedIds]);

  // Mark a word as learned in Supabase
  const markWordLearned = useCallback(async (wordId: string) => {
    if (!profile?.uid) return;
    try {
      const supabase = createClient();
      await supabase.from('user_learned_words').upsert({
        user_id: profile.uid,
        word_id: wordId,
        quiz_eligible: true,
        first_seen_at: new Date().toISOString(),
      }, { onConflict: 'user_id,word_id' });
      setLearnedIds(prev => new Set([...Array.from(prev), wordId]));
    } catch { /* silent */ }
  }, [profile?.uid]);

  // ── Start sessions ──
  const startTeach = () => {
    if (wordPool.length === 0) return;
    // Prioritise un-learned words, fallback to random from full pool
    const unlearned = wordPool.filter(w => !learnedIds.has(w.id));
    const source = unlearned.length >= sessionSize ? unlearned : wordPool;
    const words = shuffle(source).slice(0, sessionSize);
    setSessionWords(words);
    setCurrentIdx(0);
    setShowHindi(false);
    setShowExample(false);
    setCorrectCount(0);
    setStep('teach');
  };

  const startQuiz = () => {
    const quizPool = wordPool.filter(w => learnedIds.has(w.id));
    if (quizPool.length < 4) {
      alert('Learn at least 4 words first before taking a quiz!');
      return;
    }
    const words = shuffle(quizPool).slice(0, Math.min(sessionSize, quizPool.length));
    setSessionWords(words);
    setSessionType('quiz');
    setCurrentIdx(0);
    setCorrectCount(0);
    setOptions(generateOptions(words[0], quizPool));
    setSelected(null);
    setAnswerState('idle');
    setShowHint(false);
    setStep('quiz');
  };

  const startMock = () => {
    const quizPool = wordPool.filter(w => learnedIds.has(w.id));
    if (quizPool.length < 4) {
      alert('Learn at least 4 words first before taking a mock test!');
      return;
    }
    const words = shuffle(quizPool).slice(0, Math.min(10, quizPool.length));
    setSessionWords(words);
    setSessionType('mock');
    setCurrentIdx(0);
    setCorrectCount(0);
    setOptions(generateOptions(words[0], quizPool));
    setSelected(null);
    setAnswerState('idle');
    setShowHint(false);
    setStep('mock');
  };

  const currentWord = sessionWords[currentIdx];

  // ── Teach step: next card ──
  const handleNextTeach = async () => {
    if (!currentWord) return;
    await markWordLearned(currentWord.id);
    // Award small XP per word learned
    onXpGained?.(5);
    await updateProfileStats(5, 0);

    if (currentIdx + 1 >= sessionWords.length) {
      setStep('result');
      setSessionType('quiz'); // show "now quiz!" result
    } else {
      setCurrentIdx(i => i + 1);
      setShowHindi(false);
      setShowExample(false);
    }
  };

  // ── Quiz / Mock: answer ──
  const handleAnswer = async (opt: string) => {
    if (answerState !== 'idle' || !currentWord) return;
    setSelected(opt);
    const isCorrect = opt === currentWord.english_meaning;
    setAnswerState(isCorrect ? 'correct' : 'wrong');

    if (isCorrect) {
      setCorrectCount(c => c + 1);
      speakWord(currentWord.japanese);
      onXpGained?.(10);
      await updateProfileStats(10, 0);
    } else {
      onHeartLost?.();
    }

    // Auto-advance after 1.4s
    setTimeout(() => {
      const quizPool = wordPool.filter(w => learnedIds.has(w.id));
      if (currentIdx + 1 >= sessionWords.length) {
        setStep('result');
      } else {
        const nextIdx = currentIdx + 1;
        setCurrentIdx(nextIdx);
        setOptions(generateOptions(sessionWords[nextIdx], quizPool));
        setSelected(null);
        setAnswerState('idle');
        setShowHint(false);
      }
    }, 1400);
  };

  // ── Render ────────────────────────────────────────────────────────────────

  // ── MENU ──
  if (step === 'menu') {
    const learnedCount = wordPool.filter(w => learnedIds.has(w.id)).length;
    const pct = wordPool.length > 0 ? Math.round((learnedCount / wordPool.length) * 100) : 0;

    return (
      <div className="vocab-learn-card page-enter" style={{ padding: 'var(--sp-5)', maxWidth: '680px', margin: '0 auto', paddingBottom: 'calc(var(--bottom-nav-h) + 24px)' }}>
        {/* Header */}
        <div style={{ marginBottom: 'var(--sp-5)' }}>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 900, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <PremiumIcon type="book" size={26} /> Vocab Learn
          </h1>
          <p style={{ color: 'var(--text-3)', fontSize: 'var(--text-sm)' }}>
            Teach → Quiz → Mock Test
          </p>
        </div>

        {/* Mode selector */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--sp-2)', marginBottom: 'var(--sp-5)' }}>
          {(['jlpt_n5', 'jft_basic', 'ssw'] as VocabMode[]).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                padding: 'var(--sp-3)',
                borderRadius: 'var(--radius-lg)',
                border: `2px solid ${mode === m ? 'var(--primary)' : 'var(--border)'}`,
                background: mode === m ? 'rgba(var(--primary-rgb),0.08)' : 'var(--surface-2)',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all var(--t-fast)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', height: '28px', marginBottom: '4px', alignItems: 'center' }}>
                <PremiumIcon type={ModeIcon[m] as any} size={24} />
              </div>
              <div style={{ fontSize: '11px', fontWeight: 800, color: mode === m ? 'var(--primary)' : 'var(--text-2)' }}>
                {ModeLabel[m]}
              </div>
            </button>
          ))}
        </div>

        {/* Mode description */}
        <div className="card" style={{ padding: 'var(--sp-4)', marginBottom: 'var(--sp-4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-3)' }}>
            <div>
              <div style={{ fontWeight: 700 }}>{ModeLabel[mode]} Vocabulary</div>
              <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '2px' }}>{ModeDesc[mode]}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '22px', fontWeight: 900, color: 'var(--primary)' }}>{learnedCount}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-3)' }}>learned</div>
            </div>
          </div>
          {/* Progress bar */}
          <div style={{ height: '6px', background: 'var(--surface-3)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: 'var(--primary)', borderRadius: '3px', transition: 'width 0.6s ease' }} />
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '4px', textAlign: 'right' }}>
            {pct}% of {wordPool.length} words
          </div>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: 'var(--sp-4)', color: 'var(--text-3)' }}>Loading vocabulary…</div>
        )}

        {/* Action buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
          {/* Learn New */}
          <button
            onClick={startTeach}
            disabled={loading || wordPool.length === 0}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: 'var(--sp-4)', borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, var(--primary) 0%, #7c3aed 100%)',
              color: 'white', fontWeight: 700, fontSize: 'var(--text-base)',
              cursor: 'pointer', border: 'none',
              boxShadow: '0 4px 20px rgba(139,92,246,0.35)',
              transition: 'all var(--t-fast)',
              opacity: wordPool.length === 0 ? 0.5 : 1,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
              <BookOpen size={22} />
              <div style={{ textAlign: 'left' }}>
                <div>Learn New Words</div>
                <div style={{ fontSize: '12px', fontWeight: 400, opacity: 0.85 }}>5 new cards per session</div>
              </div>
            </div>
            <ChevronRight size={20} />
          </button>

          {/* Quiz */}
          <button
            onClick={startQuiz}
            disabled={loading || learnedCount < 4}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: 'var(--sp-4)', borderRadius: 'var(--radius-lg)',
              background: learnedCount >= 4 ? 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)' : 'var(--surface-2)',
              color: learnedCount >= 4 ? 'white' : 'var(--text-3)',
              fontWeight: 700, fontSize: 'var(--text-base)',
              cursor: learnedCount >= 4 ? 'pointer' : 'not-allowed',
              border: learnedCount >= 4 ? 'none' : '1px solid var(--border)',
              boxShadow: learnedCount >= 4 ? '0 4px 20px rgba(14,165,233,0.3)' : 'none',
              transition: 'all var(--t-fast)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
              <Dumbbell size={22} />
              <div style={{ textAlign: 'left' }}>
                <div>Quiz Mode</div>
                <div style={{ fontSize: '12px', fontWeight: 400, opacity: 0.85 }}>
                  {learnedCount < 4 ? `Learn ${4 - learnedCount} more to unlock` : 'Test learned words only'}
                </div>
              </div>
            </div>
            {learnedCount < 4 ? <Lock size={18} /> : <ChevronRight size={20} />}
          </button>

          {/* Mock Test — Pro feature label, but functional for all */}
          <button
            onClick={startMock}
            disabled={loading || learnedCount < 4}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: 'var(--sp-4)', borderRadius: 'var(--radius-lg)',
              background: learnedCount >= 4 ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'var(--surface-2)',
              color: learnedCount >= 4 ? 'white' : 'var(--text-3)',
              fontWeight: 700, fontSize: 'var(--text-base)',
              cursor: learnedCount >= 4 ? 'pointer' : 'not-allowed',
              border: learnedCount >= 4 ? 'none' : '1px solid var(--border)',
              boxShadow: learnedCount >= 4 ? '0 4px 20px rgba(245,158,11,0.3)' : 'none',
              transition: 'all var(--t-fast)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
              <FlaskConical size={22} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Mock Test
                  {!profile?.isPremium && (
                    <span style={{ fontSize: '9px', background: 'rgba(255,255,255,0.25)', padding: '1px 5px', borderRadius: '10px' }}>PRO</span>
                  )}
                </div>
                <div style={{ fontSize: '12px', fontWeight: 400, opacity: 0.85 }}>
                  {learnedCount < 4 ? `Learn ${4 - learnedCount} more to unlock` : '10-question full test'}
                </div>
              </div>
            </div>
            {learnedCount < 4 ? <Lock size={18} /> : <ChevronRight size={20} />}
          </button>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--sp-2)', marginTop: 'var(--sp-5)' }}>
          {[
            { icon: 'book', label: 'Words Learned', val: learnedCount },
            { icon: 'kana', label: 'Total Available', val: wordPool.length },
            { icon: 'xp', label: 'Mode', val: ModeLabel[mode] },
          ].map(s => (
            <div key={s.label} className="card" style={{ textAlign: 'center', padding: 'var(--sp-3)' }}>
              <div style={{ display: 'flex', justifyContent: 'center', height: '22px', marginBottom: '2px', alignItems: 'center' }}>
                <PremiumIcon type={s.icon as any} size={18} />
              </div>
              <div style={{ fontWeight: 800, fontSize: 'var(--text-sm)', color: 'var(--primary)' }}>{s.val}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-3)', marginTop: '2px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── TEACH ──
  if (step === 'teach' && currentWord) {
    const progress = ((currentIdx) / sessionWords.length) * 100;
    return (
      <div className="vocab-learn-card page-enter" style={{ padding: 'var(--sp-4)', maxWidth: '680px', margin: '0 auto', paddingBottom: 'calc(var(--bottom-nav-h) + 24px)' }}>
        {/* Back + Progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', marginBottom: 'var(--sp-4)' }}>
          <button onClick={() => setStep('menu')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', display: 'flex', alignItems: 'center' }}>
            <ArrowLeft size={20} />
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ height: '6px', background: 'var(--surface-3)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progress}%`, background: 'var(--primary)', borderRadius: '3px', transition: 'width 0.4s ease' }} />
            </div>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-3)', fontWeight: 600, whiteSpace: 'nowrap' }}>{currentIdx + 1}/{sessionWords.length}</span>
        </div>

        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 'var(--sp-3)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <PremiumIcon type="book" size={14} /> Learn New Word
        </div>

        {/* Word card */}
        <div className="card" style={{ padding: 'var(--sp-6)', textAlign: 'center', marginBottom: 'var(--sp-4)', position: 'relative', overflow: 'hidden' }}>
          {/* Decorative glow */}
          <div style={{ position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

          {/* Part of speech badge */}
          <span style={{ fontSize: '10px', fontWeight: 700, background: 'var(--surface-2)', color: 'var(--text-3)', padding: '3px 10px', borderRadius: 'var(--radius-pill)', display: 'inline-block', marginBottom: 'var(--sp-3)', textTransform: 'uppercase' }}>
            {currentWord.part_of_speech}
          </span>

          {/* Japanese */}
          <div style={{ fontSize: '52px', fontFamily: 'var(--font-ja)', fontWeight: 900, lineHeight: 1.1, marginBottom: '8px', color: 'var(--text)' }}>
            {currentWord.japanese}
          </div>

          {/* Kana */}
          <div style={{ fontSize: '18px', fontFamily: 'var(--font-ja)', color: 'var(--text-2)', marginBottom: '4px' }}>
            {currentWord.kana}
          </div>

          {/* Romaji */}
          <div style={{ fontSize: '14px', color: 'var(--text-3)', marginBottom: 'var(--sp-4)', fontStyle: 'italic' }}>
            {currentWord.romaji}
          </div>

          {/* Audio + Explain buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: 'var(--sp-4)' }}>
            <button
              onClick={() => speakWord(currentWord.japanese)}
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-pill)', padding: '8px 20px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: 'var(--primary)' }}
            >
              <Volume2 size={16} /> Listen
            </button>
            <button
              onClick={() => {
                setExplainerWord(currentWord.japanese);
                setIsExplainerOpen(true);
              }}
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-pill)', padding: '8px 20px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: 'var(--primary)' }}
            >
              <Lightbulb size={16} /> Explain Word
            </button>
          </div>

          {/* English meaning */}
          <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text)', marginBottom: 'var(--sp-3)' }}>
            {currentWord.english_meaning}
          </div>

          {/* Hindi meaning — always shown */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            {showHindi ? (
              <div style={{ fontSize: '16px', color: 'var(--accent-ai)', fontWeight: 600 }}>
                🇮🇳 {currentWord.hindi_meaning}
              </div>
            ) : (
              <button
                onClick={() => setShowHindi(true)}
                style={{ fontSize: '12px', color: 'var(--primary)', background: 'none', border: '1px solid var(--border)', borderRadius: 'var(--radius-pill)', padding: '4px 14px', cursor: 'pointer' }}
              >
                Show Hindi 🇮🇳
              </button>
            )}
          </div>
        </div>

        {/* Example sentence */}
        {showExample ? (
          <div className="card" style={{ padding: 'var(--sp-4)', marginBottom: 'var(--sp-4)', background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary)', marginBottom: '8px', textTransform: 'uppercase' }}>Example Sentence</div>
            <div style={{ fontFamily: 'var(--font-ja)', fontSize: '16px', marginBottom: '6px' }}>{currentWord.example_sentence_japanese}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-3)', fontStyle: 'italic' }}>{currentWord.example_sentence_english}</div>
            <button onClick={() => speakWord(currentWord.example_sentence_japanese)}
              style={{ marginTop: '10px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600 }}>
              <Volume2 size={13} /> Play sentence
            </button>
          </div>
        ) : (
          <button onClick={() => setShowExample(true)}
            style={{ width: '100%', marginBottom: 'var(--sp-4)', padding: 'var(--sp-3)', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', cursor: 'pointer', color: 'var(--text-3)', fontSize: '13px', fontWeight: 600 }}>
            📖 Show Example Sentence
          </button>
        )}

        {/* Next button */}
        <button
          onClick={handleNextTeach}
          style={{
            width: '100%', padding: 'var(--sp-4)', background: 'var(--primary)', color: 'white',
            border: 'none', borderRadius: 'var(--radius-lg)', fontWeight: 800, fontSize: 'var(--text-base)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            boxShadow: '0 4px 20px rgba(139,92,246,0.35)',
          }}
        >
          {currentIdx + 1 >= sessionWords.length ? '✅ Finish Learning' : 'Next Word →'}
        </button>

        {/* +5 XP note */}
        <div style={{ textAlign: 'center', marginTop: 'var(--sp-2)', fontSize: '11px', color: 'var(--text-3)' }}>
          +5 XP per word learned
        </div>

        {/* Dynamic Detailed Explainer Modal Overlay */}
        {isExplainerOpen && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(11,30,18,0.9)',
            backdropFilter: 'blur(8px)',
            zIndex: 10000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px'
          }}>
            <div className="card animate-fadein" style={{
              background: 'var(--surface)',
              width: '100%',
              maxWidth: '800px',
              padding: '24px',
              borderRadius: '20px',
              boxShadow: 'var(--shadow-lg)',
              maxHeight: '90vh',
              overflowY: 'auto',
              border: '1px solid var(--border-strong)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div className="flex-between flex" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                <h4 style={{ margin: 0, fontWeight: 900, color: 'var(--primary)', fontSize: '16px' }}>
                  🔍 Word Explainer Profile
                </h4>
                <button 
                  onClick={() => setIsExplainerOpen(false)} 
                  className="btn-ghost" 
                  style={{ width: 'auto', margin: 0, border: '1px solid var(--border)', fontSize: '12px', padding: '6px 12px', borderRadius: '8px', color: 'var(--text)' }}
                >
                  Close Explainer
                </button>
              </div>
              <WordExplainer initialWord={explainerWord} />
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── QUIZ / MOCK ──
  if ((step === 'quiz' || step === 'mock') && currentWord) {
    const progress = (currentIdx / sessionWords.length) * 100;
    const isQuiz = step === 'quiz';

    return (
      <div className="vocab-learn-card page-enter" style={{ padding: 'var(--sp-4)', maxWidth: '680px', margin: '0 auto', paddingBottom: 'calc(var(--bottom-nav-h) + 24px)' }}>
        {/* Back + Progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', marginBottom: 'var(--sp-4)' }}>
          <button onClick={() => setStep('menu')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', display: 'flex', alignItems: 'center' }}>
            <ArrowLeft size={20} />
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ height: '6px', background: 'var(--surface-3)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progress}%`, background: isQuiz ? '#0ea5e9' : '#f59e0b', borderRadius: '3px', transition: 'width 0.4s ease' }} />
            </div>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-3)', fontWeight: 600, whiteSpace: 'nowrap' }}>{currentIdx + 1}/{sessionWords.length}</span>
        </div>

        <div style={{ fontSize: '11px', fontWeight: 700, color: isQuiz ? '#0ea5e9' : '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 'var(--sp-3)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <PremiumIcon type={isQuiz ? 'swords' : 'boss'} size={14} /> {isQuiz ? 'Quiz Mode' : 'Mock Test'}
        </div>

        {/* Question card */}
        <div className="card" style={{ padding: 'var(--sp-5)', textAlign: 'center', marginBottom: 'var(--sp-4)' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: 'var(--sp-2)' }}>What does this mean?</div>
          <div style={{ fontSize: '48px', fontFamily: 'var(--font-ja)', fontWeight: 900, marginBottom: '8px' }}>
            {currentWord.japanese}
          </div>
          <div style={{ fontSize: '16px', color: 'var(--text-3)', marginBottom: 'var(--sp-3)', fontFamily: 'var(--font-ja)' }}>
            {currentWord.kana}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--sp-2)' }}>
            <button onClick={() => speakWord(currentWord.japanese)}
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-pill)', padding: '6px 16px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600, color: 'var(--primary)' }}>
              <Volume2 size={13} /> Listen
            </button>
            {!showHint && (
              <button onClick={() => setShowHint(true)}
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-pill)', padding: '6px 16px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600, color: 'var(--text-3)' }}>
                <Lightbulb size={13} /> Hint
              </button>
            )}
            {showHint && (
              <span style={{ fontSize: '12px', color: 'var(--text-3)', padding: '6px 0', fontStyle: 'italic' }}>
                Romaji: {currentWord.romaji}
              </span>
            )}
          </div>
        </div>

        {/* Feedback banner */}
        {answerState !== 'idle' && (
          <div style={{
            padding: 'var(--sp-3)', marginBottom: 'var(--sp-3)', borderRadius: 'var(--radius-lg)', textAlign: 'center',
            background: answerState === 'correct' ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.10)',
            border: `1px solid ${answerState === 'correct' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.25)'}`,
            animation: 'fadeIn 0.2s ease',
          }}>
            <div style={{ fontWeight: 700, color: answerState === 'correct' ? 'var(--success)' : 'var(--error)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              {answerState === 'correct' ? (
                <>
                  <PremiumIcon type="check" size={14} /> Correct! +10 XP
                </>
              ) : (
                <>
                  <PremiumIcon type="close" size={14} /> Wrong — {currentWord.english_meaning}
                </>
              )}
            </div>
          </div>
        )}

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
          {options.map((opt, i) => {
            const isCorrectOpt = opt === currentWord.english_meaning;
            const isSelectedOpt = selected === opt;
            let bg = 'var(--surface-2)';
            let border = '1px solid var(--border)';
            let color = 'var(--text)';
            if (answerState !== 'idle') {
              if (isCorrectOpt) { bg = 'rgba(34,197,94,0.15)'; border = '1px solid rgba(34,197,94,0.5)'; color = '#22c55e'; }
              else if (isSelectedOpt) { bg = 'rgba(239,68,68,0.12)'; border = '1px solid rgba(239,68,68,0.4)'; color = '#ef4444'; }
            }
            return (
              <button key={i}
                onClick={() => handleAnswer(opt)}
                disabled={answerState !== 'idle'}
                style={{
                  padding: 'var(--sp-4)', background: bg, border, borderRadius: 'var(--radius-lg)',
                  color, fontWeight: 600, fontSize: 'var(--text-base)', textAlign: 'left',
                  cursor: answerState !== 'idle' ? 'default' : 'pointer',
                  transition: 'all 0.2s ease', width: '100%',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}
              >
                <span>{opt}</span>
                {answerState !== 'idle' && isCorrectOpt && <CheckCircle size={18} style={{ color: '#22c55e', flexShrink: 0 }} />}
                {answerState !== 'idle' && isSelectedOpt && !isCorrectOpt && <XCircle size={18} style={{ color: '#ef4444', flexShrink: 0 }} />}
              </button>
            );
          })}
        </div>

        {/* Mascot Reaction Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
          {/* Speech bubble */}
          <div style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--border-strong)',
            borderRadius: '12px',
            padding: '8px 12px',
            fontSize: '12px',
            fontWeight: 600,
            position: 'relative',
            maxWidth: '220px',
            color: 'var(--text-2)',
          }}>
            {answerState === 'idle' && "Can you translate this? Give it a try!"}
            {answerState === 'correct' && "Nodding! That is absolutely correct!"}
            {answerState === 'wrong' && "Don't worry, keep growing! Try another one."}
            {/* Speech bubble arrow */}
            <div style={{
              position: 'absolute',
              right: '-6px',
              top: '12px',
              width: '0',
              height: '0',
              borderTop: '6px solid transparent',
              borderBottom: '6px solid transparent',
              borderLeft: '6px solid var(--surface-2)',
              zIndex: 2,
            }} />
            <div style={{
              position: 'absolute',
              right: '-7px',
              top: '12px',
              width: '0',
              height: '0',
              borderTop: '6px solid transparent',
              borderBottom: '6px solid transparent',
              borderLeft: '6px solid var(--border-strong)',
              zIndex: 1,
            }} />
          </div>

          {/* Mascot illustration */}
          <img
            src="/velmorth_mascot.png"
            alt="Velmorth Mascot"
            className={answerState === 'correct' ? 'animate-bounce' : 'animate-sway'}
            style={{
              width: '56px',
              height: '56px',
              objectFit: 'contain',
            }}
          />
        </div>
      </div>
    );
  }

  // ── RESULT ──
    if (step === 'result') {
      const totalWords = sessionWords.length;
      const pct = Math.round((correctCount / totalWords) * 100);
      const isTeachResult = sessionType === 'quiz' && step === 'result' && correctCount === 0;
      const iconType = isTeachResult ? 'crown' : (pct >= 80 ? 'trophy' : (pct >= 60 ? 'greetings' : 'streak'));

      return (
        <div className="vocab-learn-card page-enter" style={{ padding: 'var(--sp-5)', maxWidth: '680px', margin: '0 auto', textAlign: 'center', paddingBottom: 'calc(var(--bottom-nav-h) + 24px)' }}>
          <div style={{ marginBottom: 'var(--sp-3)', display: 'flex', justifyContent: 'center' }}>
            <PremiumIcon type={iconType} size={64} />
          </div>
          <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 900, marginBottom: 'var(--sp-2)' }}>
            {isTeachResult ? 'Words Learned!' : 'Session Complete!'}
          </h2>
          {!isTeachResult && (
            <div style={{ marginBottom: 'var(--sp-5)' }}>
              <div style={{ fontSize: '48px', fontWeight: 900, color: pct >= 80 ? 'var(--success)' : pct >= 60 ? 'var(--xp-gold)' : 'var(--primary)' }}>
                {pct}%
              </div>
              <div style={{ color: 'var(--text-3)', fontSize: 'var(--text-sm)' }}>
                {correctCount} of {totalWords} correct
              </div>
            </div>
          )}
        {isTeachResult && (
          <p style={{ color: 'var(--text-3)', fontSize: 'var(--text-sm)', marginBottom: 'var(--sp-5)' }}>
            You learned {totalWords} new words! Now try the quiz to test yourself.
          </p>
        )}

        <div className="card" style={{ padding: 'var(--sp-4)', marginBottom: 'var(--sp-4)', background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--sp-4)', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--primary)' }}>+{isTeachResult ? totalWords * 5 : correctCount * 10} XP</div>
              <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>earned this session</div>
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--xp-gold)' }}>{learnedIds.size}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>total words learned</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
          <button
            onClick={() => setStep('menu')}
            style={{
              width: '100%', padding: 'var(--sp-4)', background: 'var(--primary)', color: 'white',
              border: 'none', borderRadius: 'var(--radius-lg)', fontWeight: 800, fontSize: 'var(--text-base)',
              cursor: 'pointer', boxShadow: '0 4px 20px rgba(139,92,246,0.35)',
            }}
          >
            Back to Vocab Menu
          </button>
          {isTeachResult && (
            <button
              onClick={startQuiz}
              style={{
                width: '100%', padding: 'var(--sp-4)', background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                color: 'white', border: 'none', borderRadius: 'var(--radius-lg)', fontWeight: 700,
                fontSize: 'var(--text-base)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
              }}
            >
              <PremiumIcon type="swords" size={16} /> Try a Quiz Now!
            </button>
          )}
        </div>
      </div>
    );
  }

  return null;
}
