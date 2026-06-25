'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ListSkeleton } from '@/components/ui/Skeleton';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { CheckCircle2, XCircle, RotateCcw, Zap, ChevronRight } from 'lucide-react';
import { JLPTBadge } from '@/components/shared/JLPTBadge';
import { Tabs } from '@/components/ui/Tabs';

const QUIZ_SETS = [
  {
    id: 'vocab-n5', title: 'N5 Vocabulary', level: 'N5', emoji: '📚', questions: [
      { q: 'What does 食べる mean?', options: ['to drink','to eat','to sleep','to run'], answer: 1 },
      { q: 'What is 水 in English?', options: ['fire','earth','water','wind'], answer: 2 },
      { q: 'How do you say "school" in Japanese?', options: ['学生','学校','先生','教室'], answer: 1 },
      { q: 'What does 大きい mean?', options: ['small','fast','big','slow'], answer: 2 },
      { q: 'Translate: "I am a student"', options: ['私は先生です','私は学生です','私は医者です','あなたは学生です'], answer: 1 },
    ],
  },
  {
    id: 'kanji-n5', title: 'N5 Kanji', level: 'N5', emoji: '⛩️', questions: [
      { q: 'What does 日 mean?', options: ['moon','sun/day','mountain','river'], answer: 1 },
      { q: 'Which kanji means "mountain"?', options: ['川','火','山','木'], answer: 2 },
      { q: 'What is the reading of 月?', options: ['ひ','つき','き','みず'], answer: 1 },
      { q: 'How many strokes does 木 have?', options: ['3','4','5','6'], answer: 1 },
      { q: 'What does 学 mean?', options: ['teach','work','study','live'], answer: 2 },
    ],
  },
  {
    id: 'grammar-n5', title: 'N5 Grammar', level: 'N5', emoji: '📖', questions: [
      { q: 'Complete: 私は日本へ___たいです', options: ['行き','行く','行った','行かない'], answer: 0 },
      { q: 'Which particle marks the topic?', options: ['を','が','は','に'], answer: 2 },
      { q: 'Complete: 雨が降っている___、家にいます', options: ['から','のに','ても','たら'], answer: 0 },
      { q: '"May I sit here?" = ここに___もいいですか？', options: ['座って','座り','座る','座っ'], answer: 0 },
      { q: 'Polite negative of 食べます:', options: ['食べない','食べません','食べなかった','食べなかっです'], answer: 1 },
    ],
  },
];

type Phase = 'select' | 'quiz' | 'result';

export default function QuizPage() {
  const { user } = useAuth();
  const [phase, setPhase] = useState<Phase>('select');
  const [quizSet, setQuizSet] = useState(QUIZ_SETS[0]);
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);

  const currentQ = quizSet.questions[qIdx];
  const score = answers.filter(Boolean).length;

  const handleSelect = (oi: number) => {
    if (showFeedback) return;
    setSelected(oi);
    const correct = oi === currentQ.answer;
    setAnswers(prev => [...prev, correct]);
    setShowFeedback(true);
  };

  const next = () => {
    if (qIdx + 1 >= quizSet.questions.length) { setPhase('result'); return; }
    setQIdx(q => q + 1); setSelected(null); setShowFeedback(false);
  };

  const restart = () => { setQIdx(0); setSelected(null); setAnswers([]); setShowFeedback(false); setPhase('select'); };

  if (phase === 'select') return (
    <div className="space-y-5 animate-fade-up max-w-2xl mx-auto">
      <div className="section-title">Choose a Quiz</div>
      <div className="grid gap-4">
        {QUIZ_SETS.map(qs => (
          <button key={qs.id} onClick={() => { setQuizSet(qs); setQIdx(0); setAnswers([]); setSelected(null); setShowFeedback(false); setPhase('quiz'); }}
            className="card p-5 text-left flex items-center gap-4 hover:border-[rgba(124,58,237,0.4)] transition-all hover:scale-[1.01]">
            <div className="text-4xl">{qs.emoji}</div>
            <div>
              <div className="text-base font-black text-white">{qs.title}</div>
              <div className="flex items-center gap-2 mt-1">
                <JLPTBadge level={qs.level} />
                <span className="text-xs" style={{ color: 'rgba(160,150,220,0.5)' }}>{qs.questions.length} questions</span>
              </div>
            </div>
            <ChevronRight className="ml-auto w-5 h-5" style={{ color: 'rgba(167,139,250,0.4)' }} />
          </button>
        ))}
      </div>
    </div>
  );

  if (phase === 'result') return (
    <div className="max-w-md mx-auto animate-fade-up">
      <Card padding="lg" className="text-center">
        <div className="text-6xl mb-4">{score >= quizSet.questions.length * 0.8 ? '🎉' : score >= quizSet.questions.length * 0.5 ? '👍' : '💪'}</div>
        <div className="text-3xl font-black text-white mb-1">{score}/{quizSet.questions.length}</div>
        <div className="text-sm mb-4" style={{ color: 'rgba(160,150,220,0.6)' }}>
          {score >= quizSet.questions.length * 0.8 ? 'Excellent! You\'re mastering this!' : score >= quizSet.questions.length * 0.5 ? 'Good effort! Keep practicing.' : 'Keep studying and try again!'}
        </div>
        <ProgressBar value={(score / quizSet.questions.length) * 100} size="md" color={score >= quizSet.questions.length * 0.8 ? 'success' : 'warning'} className="mb-5" />
        <div className="flex gap-2">
          <Button variant="ghost" className="flex-1" onClick={restart}><RotateCcw className="w-3.5 h-3.5" /> Try Again</Button>
          <Button variant="primary" className="flex-1" onClick={() => setPhase('select')}>New Quiz</Button>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto animate-fade-up">
      {/* Progress */}
      <div className="mb-5">
        <div className="flex justify-between text-xs mb-2">
          <span className="font-bold text-white">{quizSet.title}</span>
          <span style={{ color: 'rgba(160,150,220,0.5)' }}>{qIdx + 1} / {quizSet.questions.length}</span>
        </div>
        <ProgressBar value={((qIdx) / quizSet.questions.length) * 100} size="sm" />
      </div>

      <Card padding="lg">
        <div className="text-base font-black text-white mb-6">{qIdx + 1}. {currentQ.q}</div>
        <div className="space-y-3 mb-6">
          {currentQ.options.map((opt, oi) => {
            const isSelected = selected === oi;
            const isCorrect = oi === currentQ.answer;
            let style: any = { background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)', color: 'rgba(200,196,255,0.8)' };
            if (showFeedback) {
              if (isCorrect) style = { background: 'rgba(34,197,94,0.15)', border: '2px solid rgba(34,197,94,0.5)', color: '#4ade80' };
              else if (isSelected) style = { background: 'rgba(239,68,68,0.15)', border: '2px solid rgba(239,68,68,0.4)', color: '#f87171' };
            } else if (isSelected) {
              style = { background: 'rgba(124,58,237,0.2)', border: '2px solid rgba(124,58,237,0.5)', color: '#f0efff' };
            }
            return (
              <button key={oi} onClick={() => handleSelect(oi)} disabled={showFeedback}
                className="w-full px-4 py-3.5 rounded-xl text-sm font-medium text-left flex items-center justify-between transition-all"
                style={style}>
                <span>{opt}</span>
                {showFeedback && isCorrect && <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />}
                {showFeedback && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />}
              </button>
            );
          })}
        </div>

        {showFeedback && (
          <div className="animate-fade-up">
            <div className="p-3 rounded-xl mb-4"
              style={{ background: answers[answers.length-1] ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${answers[answers.length-1] ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
              <div className="text-sm font-black" style={{ color: answers[answers.length-1] ? '#4ade80' : '#f87171' }}>
                {answers[answers.length-1] ? '✓ Correct! +10 XP' : `✗ Correct answer: ${currentQ.options[currentQ.answer]}`}
              </div>
            </div>
            <Button variant="primary" className="w-full" onClick={next}>
              {qIdx + 1 >= quizSet.questions.length ? 'See Results' : 'Next Question'} →
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
