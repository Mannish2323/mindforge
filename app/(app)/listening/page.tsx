'use client';

import { useState, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { JLPTBadge } from '@/components/shared/JLPTBadge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Play, Pause, RotateCcw, Volume2, ChevronRight } from 'lucide-react';

const AUDIO_LESSONS = [
  {
    id: 'a1', title: 'At the Train Station', level: 'N5', duration: '2:34', emoji: '🚉',
    script: [
      { speaker: 'A', jp: 'すみません、東京駅はどこですか？', en: 'Excuse me, where is Tokyo Station?' },
      { speaker: 'B', jp: 'まっすぐ行って、左に曲がってください。', en: 'Go straight and turn left.' },
      { speaker: 'A', jp: 'どのくらいかかりますか？', en: 'How long does it take?' },
      { speaker: 'B', jp: '歩いて五分ぐらいです。', en: 'About 5 minutes on foot.' },
      { speaker: 'A', jp: 'ありがとうございます！', en: 'Thank you!' },
    ],
    questions: [
      { q: 'Where does Person A want to go?', options: ['Airport','Tokyo Station','A restaurant','A hotel'], answer: 1 },
      { q: 'How long does it take to walk?', options: ['2 minutes','5 minutes','10 minutes','15 minutes'], answer: 1 },
    ],
  },
  {
    id: 'a2', title: 'Ordering Food', level: 'N5', duration: '1:52', emoji: '🍱',
    script: [
      { speaker: 'Waiter', jp: 'いらっしゃいませ！ご注文はお決まりですか？', en: 'Welcome! Are you ready to order?' },
      { speaker: 'You', jp: 'ラーメンとギョーザをください。', en: 'Please give me ramen and gyoza.' },
      { speaker: 'Waiter', jp: 'お飲み物はいかがですか？', en: 'How about a drink?' },
      { speaker: 'You', jp: 'お水をお願いします。', en: 'Water please.' },
    ],
    questions: [
      { q: 'What food was ordered?', options: ['Sushi','Ramen and gyoza','Udon','Tempura'], answer: 1 },
      { q: 'What drink was ordered?', options: ['Tea','Juice','Water','Coffee'], answer: 2 },
    ],
  },
];

export default function ListeningPage() {
  const [selected, setSelected] = useState(AUDIO_LESSONS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lineIdx, setLineIdx] = useState(-1);
  const [showScript, setShowScript] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();

  const playLesson = () => {
    if (isPlaying) {
      setIsPlaying(false); setLineIdx(-1);
      clearTimeout(timerRef.current);
      speechSynthesis.cancel();
      return;
    }
    setIsPlaying(true); setLineIdx(0);
    const playLine = (idx: number) => {
      if (idx >= selected.script.length) { setIsPlaying(false); setLineIdx(-1); return; }
      setLineIdx(idx);
      const u = new SpeechSynthesisUtterance(selected.script[idx].jp);
      u.lang = 'ja-JP'; u.rate = 0.8;
      u.onend = () => { timerRef.current = setTimeout(() => playLine(idx + 1), 500); };
      speechSynthesis.speak(u);
    };
    playLine(0);
  };

  const score = submitted ? selected.questions.filter((q, i) => answers[i] === q.answer).length : 0;

  return (
    <div className="space-y-5 animate-fade-up max-w-3xl mx-auto">
      {/* Lesson selector */}
      <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2">
        {AUDIO_LESSONS.map(l => (
          <button key={l.id} onClick={() => { setSelected(l); setIsPlaying(false); setLineIdx(-1); setShowScript(false); setAnswers({}); setSubmitted(false); speechSynthesis.cancel(); }}
            className="card px-4 py-3 flex-shrink-0 flex items-center gap-2 transition-all hover:scale-[1.02]"
            style={selected.id === l.id ? { border: '2px solid rgba(124,58,237,0.5)', background: 'rgba(124,58,237,0.1)' } : {}}>
            <span className="text-xl">{l.emoji}</span>
            <div className="text-left">
              <div className="text-xs font-bold text-white whitespace-nowrap">{l.title}</div>
              <div className="flex items-center gap-1 mt-0.5">
                <JLPTBadge level={l.level} size="xs" />
                <span className="text-[10px]" style={{ color: 'rgba(160,150,220,0.5)' }}>{l.duration}</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Player */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-lg font-black text-white">{selected.emoji} {selected.title}</div>
            <JLPTBadge level={selected.level} className="mt-1" />
          </div>
          <div className="text-sm" style={{ color: 'rgba(160,150,220,0.5)' }}>{selected.duration}</div>
        </div>

        {/* Waveform visualizer (decorative) */}
        <div className="flex items-center justify-center gap-0.5 h-12 mb-6">
          {[...Array(40)].map((_, i) => (
            <div key={i} className="w-1 rounded-full transition-all duration-150"
              style={{
                height: isPlaying ? `${Math.random() * 100}%` : '20%',
                background: isPlaying ? `rgba(124,58,237,${0.4 + Math.random() * 0.6})` : 'rgba(139,92,246,0.2)',
              }} />
          ))}
        </div>

        <div className="flex justify-center gap-4">
          <button className="btn btn-ghost btn-icon" onClick={() => { speechSynthesis.cancel(); setLineIdx(-1); setIsPlaying(false); }}>
            <RotateCcw className="w-5 h-5" />
          </button>
          <button
            onClick={playLesson}
            className="w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #db2777)', boxShadow: '0 4px 20px rgba(124,58,237,0.4)' }}>
            {isPlaying ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white ml-0.5" />}
          </button>
          <button className="btn btn-ghost btn-icon" onClick={() => setShowScript(!showScript)}>
            <Volume2 className="w-5 h-5" />
          </button>
        </div>
      </Card>

      {/* Script */}
      {showScript && (
        <Card padding="md" className="animate-fade-up">
          <div className="section-title mb-3">Dialogue Script</div>
          <div className="space-y-3">
            {selected.script.map((line, i) => (
              <div key={i} className="p-3 rounded-xl transition-all"
                style={{ background: lineIdx === i ? 'rgba(124,58,237,0.15)' : 'rgba(139,92,246,0.06)', border: lineIdx === i ? '1px solid rgba(124,58,237,0.35)' : '1px solid transparent' }}>
                <div className="text-[10px] font-black mb-1" style={{ color: 'rgba(167,139,250,0.6)' }}>{line.speaker}</div>
                <div className="text-sm font-jp text-white">{line.jp}</div>
                <div className="text-xs mt-0.5" style={{ color: 'rgba(160,150,220,0.5)' }}>{line.en}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Comprehension quiz */}
      <Card padding="md">
        <div className="section-title mb-4">Comprehension Check</div>
        <div className="space-y-4">
          {selected.questions.map((q, qi) => (
            <div key={qi}>
              <div className="text-sm font-bold text-white mb-2">{qi + 1}. {q.q}</div>
              <div className="grid grid-cols-2 gap-2">
                {q.options.map((opt, oi) => {
                  const isSelected = answers[qi] === oi;
                  const isCorrect = oi === q.answer;
                  let style: any = { background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)', color: 'rgba(200,196,255,0.7)' };
                  if (submitted) {
                    if (isCorrect) style = { background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.35)', color: '#4ade80' };
                    else if (isSelected) style = { background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.35)', color: '#f87171' };
                  } else if (isSelected) {
                    style = { background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.5)', color: '#f0efff' };
                  }
                  return (
                    <button key={oi} disabled={submitted}
                      onClick={() => setAnswers(prev => ({ ...prev, [qi]: oi }))}
                      className="px-3 py-2 rounded-xl text-xs font-medium text-left" style={style}>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        {!submitted ? (
          <Button variant="primary" className="mt-4 w-full" onClick={() => setSubmitted(true)}
            disabled={Object.keys(answers).length < selected.questions.length}>
            Submit
          </Button>
        ) : (
          <div className="mt-4 p-3 rounded-xl text-sm font-black"
            style={{ background: score === selected.questions.length ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)', color: score === selected.questions.length ? '#4ade80' : '#fbbf24' }}>
            {score}/{selected.questions.length} correct {score === selected.questions.length ? '🎉 Perfect!' : '📻 Keep listening!'}
          </div>
        )}
      </Card>
    </div>
  );
}
