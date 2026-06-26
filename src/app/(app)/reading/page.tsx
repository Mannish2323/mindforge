'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Tabs } from '@/components/ui/Tabs';
import { JLPTBadge } from '@/components/shared/JLPTBadge';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { CheckCircle2, XCircle, Volume2 } from 'lucide-react';

const PASSAGES = [
  {
    id: 'p1', title: 'Daily Life in Tokyo', level: 'N5', emoji: '🗼',
    text: '東京は日本の首都です。東京にはたくさんの人が住んでいます。電車はとても便利です。毎日、たくさんの人が電車で通勤します。東京には美味しい食べ物がたくさんあります。',
    translation: 'Tokyo is the capital of Japan. Many people live in Tokyo. Trains are very convenient. Every day, many people commute by train. There is a lot of delicious food in Tokyo.',
    vocabulary: [
      { word: '首都', reading: 'しゅと', meaning: 'capital city' },
      { word: '便利', reading: 'べんり', meaning: 'convenient' },
      { word: '通勤', reading: 'つうきん', meaning: 'commute' },
    ],
    questions: [
      { q: 'What is Tokyo?', options: ['Japan\'s capital','Japan\'s largest city','A food city','A train station'], answer: 0 },
      { q: 'What is described as convenient?', options: ['Food','Trains','People','Work'], answer: 1 },
    ],
  },
  {
    id: 'p2', title: 'Seasons in Japan', level: 'N4', emoji: '🌸',
    text: '日本には四つの季節があります。春には桜の花が咲きます。夏はとても暑く、祭りがたくさんあります。秋には紅葉が美しいです。冬は雪が降ることがあります。',
    translation: 'Japan has four seasons. Cherry blossoms bloom in spring. Summer is very hot and there are many festivals. Autumn has beautiful fall foliage. It sometimes snows in winter.',
    vocabulary: [
      { word: '季節', reading: 'きせつ', meaning: 'season' },
      { word: '桜', reading: 'さくら', meaning: 'cherry blossom' },
      { word: '紅葉', reading: 'こうよう', meaning: 'autumn leaves' },
    ],
    questions: [
      { q: 'How many seasons does Japan have?', options: ['Two','Three','Four','Five'], answer: 2 },
      { q: 'What happens in spring?', options: ['Snow falls','Cherry blossoms bloom','Festivals begin','Leaves turn red'], answer: 1 },
    ],
  },
];

export default function ReadingPage() {
  const [selected, setSelected] = useState(PASSAGES[0]);
  const [showTrans, setShowTrans] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const playText = (text: string) => {
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(text); u.lang = 'ja-JP'; u.rate = 0.8;
      speechSynthesis.speak(u);
    }
  };

  const score = submitted ? selected.questions.filter((q, i) => answers[i] === q.answer).length : 0;

  return (
    <div className="space-y-5 animate-fade-up max-w-3xl mx-auto">
      <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2">
        {PASSAGES.map(p => (
          <button key={p.id} onClick={() => { setSelected(p); setShowTrans(false); setAnswers({}); setSubmitted(false); }}
            className="card px-4 py-3 flex-shrink-0 flex items-center gap-2 transition-all hover:scale-[1.02]"
            style={selected.id === p.id ? { border: '2px solid rgba(124,58,237,0.5)', background: 'rgba(124,58,237,0.1)' } : {}}>
            <span>{p.emoji}</span>
            <div className="text-left">
              <div className="text-xs font-bold text-white whitespace-nowrap">{p.title}</div>
              <JLPTBadge level={p.level} size="xs" className="mt-0.5" />
            </div>
          </button>
        ))}
      </div>

      <Card padding="lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">{selected.emoji}</span>
            <div>
              <div className="text-base font-black text-white">{selected.title}</div>
              <JLPTBadge level={selected.level} className="mt-0.5" />
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => playText(selected.text)}>
            <Volume2 className="w-3.5 h-3.5" /> Listen
          </Button>
        </div>

        <div className="text-lg font-jp leading-loose text-white mb-4 p-4 rounded-xl"
          style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)' }}>
          {selected.text}
        </div>

        {showTrans && (
          <div className="p-4 rounded-xl mb-4 animate-fade-up" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
            <div className="text-[10px] font-black text-green-400 mb-1">Translation</div>
            <div className="text-sm leading-relaxed" style={{ color: 'rgba(200,196,255,0.8)' }}>{selected.translation}</div>
          </div>
        )}

        <div className="flex gap-2 mb-4">
          <Button variant="ghost" size="sm" onClick={() => setShowTrans(!showTrans)}>
            {showTrans ? 'Hide' : 'Show'} Translation
          </Button>
        </div>

        {/* Vocabulary */}
        <div className="mb-5">
          <div className="section-title mb-2">Key Vocabulary</div>
          <div className="flex flex-wrap gap-2">
            {selected.vocabulary.map((v, i) => (
              <div key={i} className="px-3 py-2 rounded-xl" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
                <div className="text-sm font-jp font-black text-white">{v.word}</div>
                <div className="text-[10px]" style={{ color: 'rgba(167,139,250,0.7)' }}>{v.reading}</div>
                <div className="text-[10px]" style={{ color: 'rgba(160,150,220,0.5)' }}>{v.meaning}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quiz */}
        <div>
          <div className="section-title mb-3">Comprehension Questions</div>
          <div className="space-y-4">
            {selected.questions.map((q, qi) => (
              <div key={qi}>
                <div className="text-sm font-bold text-white mb-2">{qi + 1}. {q.q}</div>
                <div className="grid grid-cols-2 gap-2">
                  {q.options.map((opt, oi) => {
                    const selected_ans = answers[qi];
                    const isSelected = selected_ans === oi;
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
                        className="px-3 py-2 rounded-xl text-xs font-medium text-left transition-all hover:opacity-90" style={style}>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          {!submitted ? (
            <Button variant="primary" className="mt-4 w-full" onClick={() => setSubmitted(true)} disabled={Object.keys(answers).length < selected.questions.length}>
              Submit Answers
            </Button>
          ) : (
            <div className="mt-4 p-4 rounded-xl animate-fade-up" style={{ background: score === selected.questions.length ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)', border: `1px solid ${score === selected.questions.length ? 'rgba(34,197,94,0.3)' : 'rgba(245,158,11,0.3)'}` }}>
              <div className="text-sm font-black" style={{ color: score === selected.questions.length ? '#4ade80' : '#fbbf24' }}>
                {score}/{selected.questions.length} correct {score === selected.questions.length ? '🎉' : '📖'}
              </div>
              <Button variant="ghost" size="sm" className="mt-2" onClick={() => { setAnswers({}); setSubmitted(false); }}>Try Again</Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
