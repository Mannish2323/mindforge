'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Tabs } from '@/components/ui/Tabs';
import { JLPTBadge } from '@/components/shared/JLPTBadge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Volume2, Sparkles, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

interface GrammarPoint {
  id: string; pattern: string; meaning: string; usage: string;
  explanation: string; jlpt: string; examples: { jp: string; en: string; notes?: string }[];
  common_mistakes?: string; related?: string[];
}

const GRAMMAR_DATA: GrammarPoint[] = [
  {
    id: 'g1', pattern: '〜たい', meaning: 'want to ~', jlpt: 'N5',
    usage: 'Verb stem + たい', explanation: 'Expresses the speaker\'s desire to do something. Only used for first-person desires, not for describing others\' wants.',
    examples: [
      { jp: '日本へ行きたいです。', en: 'I want to go to Japan.', notes: 'Formal form with です' },
      { jp: '寿司を食べたい！', en: 'I want to eat sushi!', notes: 'Casual form' },
      { jp: '日本語を上手に話したいです。', en: 'I want to speak Japanese well.' },
    ],
    common_mistakes: 'Do NOT use 〜たい to describe what others want. Use 〜たがっている for third person.',
    related: ['〜てほしい', '〜たがる'],
  },
  {
    id: 'g2', pattern: '〜ている', meaning: 'is doing / has done', jlpt: 'N5',
    usage: 'Verb te-form + いる', explanation: 'Describes an ongoing action (progressive) or a state resulting from a completed action.',
    examples: [
      { jp: '今、勉強しています。', en: 'I am studying now.', notes: 'Progressive action' },
      { jp: '結婚しています。', en: 'I am married.', notes: 'Resultant state' },
      { jp: '雨が降っています。', en: 'It is raining.' },
    ],
    common_mistakes: 'The meaning changes depending on the verb type — action verbs (progressive) vs. change-of-state verbs (resultant state).',
    related: ['〜てある', '〜ていた'],
  },
  {
    id: 'g3', pattern: '〜から', meaning: 'because / from', jlpt: 'N5',
    usage: 'Sentence + から + result', explanation: 'Used to give a reason or cause. The reason comes before から, and the result/conclusion comes after.',
    examples: [
      { jp: '雨が降っているから、家にいます。', en: 'Because it is raining, I will stay home.' },
      { jp: '疲れたから、休みます。', en: 'Because I am tired, I will rest.' },
      { jp: '好きだから、食べます。', en: 'I\'ll eat it because I like it.' },
    ],
    common_mistakes: 'Don\'t confuse 〜から (because/reason) with 〜から (from a place/time).',
    related: ['〜ので', '〜ため'],
  },
  {
    id: 'g4', pattern: '〜ませんか', meaning: 'Won\'t you ~? / Shall we~?', jlpt: 'N5',
    usage: 'Verb masu-stem + ませんか', explanation: 'Politely invites someone to do something together. A soft suggestion or invitation.',
    examples: [
      { jp: '一緒に食べませんか？', en: 'Would you like to eat together?' },
      { jp: '映画を見ませんか？', en: 'Shall we watch a movie?' },
    ],
    common_mistakes: 'Compare with 〜ましょうか which is "shall I?" (offering to do something for someone).',
    related: ['〜ましょう', '〜ましょうか'],
  },
  {
    id: 'g5', pattern: '〜てもいい', meaning: 'may ~, it\'s okay to ~', jlpt: 'N5',
    usage: 'Verb te-form + もいい', explanation: 'Used to give or ask for permission.',
    examples: [
      { jp: 'ここに座ってもいいですか？', en: 'May I sit here?' },
      { jp: 'もう帰ってもいいです。', en: 'You may go home now.' },
    ],
    common_mistakes: 'To deny permission, use 〜てはいけない (must not) or 〜てはだめ (no good).',
    related: ['〜てはいけない', '〜なければならない'],
  },
];

function GrammarCard({ g }: { g: GrammarPoint }) {
  const [expanded, setExpanded] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiExplain, setAiExplain] = useState('');

  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) { const u = new SpeechSynthesisUtterance(text); u.lang = 'ja-JP'; speechSynthesis.speak(u); }
  };

  const askAI = async () => {
    setLoadingAI(true);
    try {
      const res = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: g.pattern, type: 'grammar' }),
      });
      const d = await res.json();
      setAiExplain(d.explanation || d.response || 'AI explanation unavailable.');
    } catch {
      setAiExplain('AI explanation unavailable. Please check your connection.');
    } finally { setLoadingAI(false); }
  };

  return (
    <Card className="overflow-hidden">
      <button className="w-full p-4 text-left" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-lg font-jp font-black text-white">{g.pattern}</span>
              <JLPTBadge level={g.jlpt} size="sm" />
            </div>
            <div className="text-sm" style={{ color: 'rgba(200,196,255,0.7)' }}>{g.meaning}</div>
            <div className="text-xs mt-1 font-mono" style={{ color: 'rgba(167,139,250,0.5)' }}>{g.usage}</div>
          </div>
          {expanded ? <ChevronUp className="w-4 h-4 flex-shrink-0" style={{ color: 'rgba(167,139,250,0.5)' }} />
            : <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: 'rgba(167,139,250,0.5)' }} />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-4 animate-fade-up border-t" style={{ borderColor: 'rgba(139,92,246,0.15)' }}>
          {/* Explanation */}
          <div className="pt-3">
            <div className="section-title mb-2">Explanation</div>
            <p className="text-sm" style={{ color: 'rgba(200,196,255,0.75)' }}>{g.explanation}</p>
          </div>

          {/* Examples */}
          <div>
            <div className="section-title mb-2">Examples</div>
            <div className="space-y-2">
              {g.examples.map((ex, i) => (
                <div key={i} className="p-3 rounded-xl" style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)' }}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="text-sm font-jp font-bold text-white">{ex.jp}</div>
                      <div className="text-xs mt-0.5" style={{ color: 'rgba(160,150,220,0.6)' }}>{ex.en}</div>
                      {ex.notes && <div className="text-[10px] mt-1 italic" style={{ color: 'rgba(167,139,250,0.5)' }}>{ex.notes}</div>}
                    </div>
                    <button onClick={() => playAudio(ex.jp)} className="btn btn-ghost btn-icon flex-shrink-0">
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Common mistakes */}
          {g.common_mistakes && (
            <div className="p-3 rounded-xl" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <div className="text-[10px] font-black text-red-400 mb-1">⚠ Common Mistake</div>
              <div className="text-xs" style={{ color: 'rgba(200,196,255,0.7)' }}>{g.common_mistakes}</div>
            </div>
          )}

          {/* AI Explain */}
          {aiExplain ? (
            <div className="p-3 rounded-xl" style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}>
              <div className="text-[10px] font-black text-purple-300 mb-1">🧝‍♀️ AI Explanation</div>
              <div className="text-xs" style={{ color: 'rgba(200,196,255,0.7)' }}>{aiExplain}</div>
            </div>
          ) : (
            <Button variant="ghost" size="sm" onClick={askAI} loading={loadingAI} className="w-full">
              <Sparkles className="w-3.5 h-3.5" /> Explain with AI
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}

export default function GrammarPage() {
  const [jlptFilter, setJlptFilter] = useState('all');
  const filtered = GRAMMAR_DATA.filter(g => jlptFilter === 'all' || g.jlpt === jlptFilter);

  return (
    <div className="space-y-5 animate-fade-up">
      <Tabs tabs={[{id:'all',label:'All'},{id:'N5',label:'N5'},{id:'N4',label:'N4'},{id:'N3',label:'N3'},{id:'N2',label:'N2'},{id:'N1',label:'N1'}]}
        activeTab={jlptFilter} onChange={setJlptFilter} variant="pill" />
      <div className="text-xs" style={{ color: 'rgba(160,150,220,0.5)' }}>{filtered.length} grammar points</div>
      {filtered.length === 0
        ? <EmptyState variant="search" />
        : <div className="space-y-3">{filtered.map(g => <GrammarCard key={g.id} g={g} />)}</div>
      }
    </div>
  );
}
