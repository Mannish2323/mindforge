'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import {
  Briefcase, ChevronRight, Volume2, Star, Sparkles, Copy, CheckCircle2
} from 'lucide-react';
import {
  industryLexicons, keigoVerbs, emailTemplates, interviewQuestions,
  type JobVocabItem, type KeigoVerbItem, type EmailTemplateItem, type InterviewQuestionItem
} from '@/data/jobPrepData';

const INDUSTRY_META: Record<string, { emoji: string; color: string; bg: string; border: string }> = {
  factory:   { emoji: '🏭', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)' },
  caregiver: { emoji: '🏥', color: '#ec4899', bg: 'rgba(236,72,153,0.08)', border: 'rgba(236,72,153,0.25)' },
  it:        { emoji: '💻', color: '#3b82f6', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.25)' },
  office:    { emoji: '🏢', color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.25)' },
};

function speak(text: string) {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ja-JP'; u.rate = 0.85; u.pitch = 1.05;
    speechSynthesis.speak(u);
  }
}

function VocabCard({ item, color }: { item: JobVocabItem; color: string }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="rounded-xl p-4 transition-all hover:scale-[1.01] cursor-pointer"
      style={{ background: `${color}06`, border: `1px solid ${color}22` }}
      onClick={() => setExpanded(e => !e)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-base font-jp font-black text-white">{item.word}</span>
            <span className="text-xs" style={{ color: `${color}cc` }}>{item.hiragana}</span>
          </div>
          <div className="text-xs" style={{ color: 'rgba(160,150,220,0.5)' }}>{item.romaji}</div>
          <div className="text-sm font-bold text-white mt-1">{item.meaning_en}</div>
          {expanded && (
            <div className="mt-2 space-y-1 animate-fade-up">
              <div className="text-xs" style={{ color: 'rgba(200,196,255,0.7)' }}>🇮🇳 {item.meaning_hi}</div>
              <div className="text-xs p-2 rounded-lg" style={{ background: `${color}0d`, color: 'rgba(200,196,255,0.8)' }}>
                📍 {item.situation}
              </div>
              <div className="text-[10px]" style={{ color: 'rgba(160,150,220,0.5)' }}>💡 {item.notes}</div>
            </div>
          )}
        </div>
        <button
          onClick={e => { e.stopPropagation(); speak(item.word); }}
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all hover:scale-110"
          style={{ background: `${color}15` }}
        >
          <Volume2 className="w-3.5 h-3.5" style={{ color }} />
        </button>
      </div>
    </div>
  );
}

function KeigoCard({ item }: { item: KeigoVerbItem }) {
  const [showExample, setShowExample] = useState(false);
  return (
    <Card padding="md">
      <div className="font-black text-white mb-3">{item.meaning}</div>
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[
          { label: '丁寧語', sub: 'Polite', val: item.polite, color: '#22c55e' },
          { label: '尊敬語', sub: 'Honorific', val: item.honorific, color: '#3b82f6' },
          { label: '謙譲語', sub: 'Humble', val: item.humble, color: '#8b5cf6' },
        ].map(col => (
          <div key={col.label} className="text-center p-2 rounded-xl"
            style={{ background: `${col.color}09`, border: `1px solid ${col.color}20` }}>
            <div className="text-[9px] font-jp mb-0.5" style={{ color: col.color }}>{col.label}</div>
            <div className="text-[9px] mb-1" style={{ color: 'rgba(160,150,220,0.5)' }}>{col.sub}</div>
            <div className="text-xs font-jp font-bold text-white leading-snug">{col.val}</div>
            <button onClick={() => speak(col.val.split(' ')[0])} className="mt-1.5">
              <Volume2 className="w-3 h-3 mx-auto" style={{ color: col.color }} />
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={() => setShowExample(e => !e)}
        className="text-xs flex items-center gap-1 transition-colors"
        style={{ color: 'rgba(167,139,250,0.6)' }}
      >
        <Sparkles className="w-3 h-3" />
        {showExample ? 'Hide' : 'Show'} example dialogue
        <ChevronRight className={`w-3 h-3 transition-transform ${showExample ? 'rotate-90' : ''}`} />
      </button>
      {showExample && (
        <div className="mt-3 space-y-2 animate-fade-up">
          {item.example.split('\n').map((line, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-[10px] font-black w-4 flex-shrink-0 mt-0.5"
                style={{ color: i === 0 ? '#3b82f6' : '#8b5cf6' }}>
                {i === 0 ? 'A:' : 'B:'}
              </span>
              <p className="text-xs font-jp leading-relaxed" style={{ color: 'rgba(200,196,255,0.8)' }}>
                {line.replace(/^[AB]: /, '')}
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function EmailCard({ item }: { item: EmailTemplateItem }) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const copyToClipboard = () => {
    navigator.clipboard.writeText(`件名: ${item.subject}\n\n${item.body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <Card padding="md">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="text-xs font-black uppercase tracking-widest mb-1"
            style={{ color: 'rgba(139,92,246,0.6)' }}>{item.category}</div>
          <div className="font-black text-white">{item.title}</div>
          <div className="text-xs mt-0.5" style={{ color: 'rgba(160,150,220,0.5)' }}>件名: {item.subject}</div>
        </div>
        <button onClick={copyToClipboard}
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all hover:scale-110"
          style={{ background: copied ? 'rgba(34,197,94,0.15)' : 'rgba(139,92,246,0.1)' }}>
          {copied
            ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
            : <Copy className="w-3.5 h-3.5" style={{ color: 'rgba(167,139,250,0.7)' }} />}
        </button>
      </div>
      <button onClick={() => setExpanded(e => !e)}
        className="w-full text-left text-xs font-bold flex items-center gap-1 mb-2 transition-colors"
        style={{ color: 'rgba(167,139,250,0.6)' }}>
        {expanded ? 'Hide' : 'Show'} email body
        <ChevronRight className={`w-3 h-3 transition-transform ${expanded ? 'rotate-90' : ''}`} />
      </button>
      {expanded && (
        <div className="animate-fade-up">
          <pre className="text-xs font-jp leading-relaxed whitespace-pre-wrap p-3 rounded-xl mb-3"
            style={{ background: 'rgba(139,92,246,0.06)', color: 'rgba(200,196,255,0.8)', fontFamily: 'inherit' }}>
            {item.body}
          </pre>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {item.variables.map(v => (
              <span key={v} className="text-[10px] px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(245,158,11,0.1)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.2)' }}>
                {v}
              </span>
            ))}
          </div>
          <div className="p-2 rounded-xl text-xs" style={{ background: 'rgba(34,197,94,0.06)', color: 'rgba(200,196,255,0.7)' }}>
            🇬🇧 {item.explanation_en}
          </div>
        </div>
      )}
    </Card>
  );
}

function InterviewCard({ item, idx }: { item: InterviewQuestionItem; idx: number }) {
  const [showAnswer, setShowAnswer] = useState(false);
  return (
    <Card padding="md">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs flex-shrink-0"
          style={{ background: 'rgba(139,92,246,0.15)', color: '#a78bfa' }}>
          Q{idx + 1}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-jp font-black text-white mb-1">{item.question}</div>
          <div className="text-xs" style={{ color: 'rgba(160,150,220,0.5)' }}>{item.hiragana}</div>
          <div className="text-xs mt-1 font-bold" style={{ color: 'rgba(200,196,255,0.7)' }}>{item.meaning_en}</div>
        </div>
        <button onClick={() => speak(item.question)}
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(139,92,246,0.1)' }}>
          <Volume2 className="w-3 h-3 text-purple-400" />
        </button>
      </div>
      <button
        onClick={() => setShowAnswer(e => !e)}
        className="w-full py-2 rounded-xl text-xs font-bold transition-all"
        style={{ background: showAnswer ? 'rgba(124,58,237,0.15)' : 'rgba(139,92,246,0.08)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.2)' }}
      >
        {showAnswer ? 'Hide Model Answer' : 'Show Model Answer'}
      </button>
      {showAnswer && (
        <div className="mt-3 space-y-3 animate-fade-up">
          <div className="p-3 rounded-xl" style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}>
            <div className="text-[9px] font-black uppercase tracking-widest mb-2" style={{ color: 'rgba(139,92,246,0.5)' }}>Model Answer</div>
            <p className="text-sm font-jp leading-relaxed text-white">{item.modelAnswer}</p>
            <p className="text-xs mt-2 leading-relaxed" style={{ color: 'rgba(200,196,255,0.6)' }}>{item.modelAnswerEn}</p>
          </div>
          <div className="p-3 rounded-xl" style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)' }}>
            <div className="text-[9px] font-black uppercase tracking-widest mb-1 text-green-400">💡 Advice</div>
            <p className="text-xs" style={{ color: 'rgba(200,196,255,0.75)' }}>{item.advice_en}</p>
          </div>
        </div>
      )}
    </Card>
  );
}

export default function JobPrepPage() {
  const { profile } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState('industry');
  const [selectedIndustry, setSelectedIndustry] = useState('office');

  const industries = Object.keys(industryLexicons);
  const currentIndustry = industryLexicons[selectedIndustry];

  return (
    <div className="space-y-5 animate-fade-up">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl p-6"
        style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.15))', border: '1px solid rgba(59,130,246,0.25)' }}>
        <div className="absolute top-0 right-0 w-48 h-48 opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }} />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-4xl">💼</div>
            <div>
              <h1 className="text-2xl font-black text-white">Job Prep Japanese</h1>
              <p className="text-sm" style={{ color: 'rgba(200,196,255,0.7)' }}>
                Master workplace Japanese for real jobs in Japan
              </p>
            </div>
          </div>
        </div>
      </div>

      <Tabs
        tabs={[
          { id: 'industry', label: '🏭 Industry' },
          { id: 'keigo', label: '🎩 Keigo' },
          { id: 'email', label: '📧 Email' },
          { id: 'interview', label: '👔 Interview' },
        ]}
        activeTab={tab}
        onChange={setTab}
        variant="underline"
      />

      {tab === 'industry' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {industries.map(key => {
              const meta = INDUSTRY_META[key] || { emoji: '📌', color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.25)' };
              const industry = industryLexicons[key];
              return (
                <button key={key} onClick={() => setSelectedIndustry(key)}
                  className="p-4 rounded-xl text-left transition-all hover:scale-[1.02]"
                  style={{
                    background: selectedIndustry === key ? meta.bg : 'rgba(139,92,246,0.04)',
                    border: `1px solid ${selectedIndustry === key ? meta.border : 'rgba(139,92,246,0.12)'}`,
                  }}>
                  <div className="text-2xl mb-2">{meta.emoji}</div>
                  <div className="text-sm font-black text-white">{industry.title}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'rgba(160,150,220,0.5)' }}>{industry.vocab.length} terms</div>
                </button>
              );
            })}
          </div>
          <div className="flex items-start gap-3 p-4 rounded-xl"
            style={{ background: INDUSTRY_META[selectedIndustry]?.bg || 'rgba(139,92,246,0.08)', border: `1px solid ${INDUSTRY_META[selectedIndustry]?.border || 'rgba(139,92,246,0.25)'}` }}>
            <div className="text-3xl">{INDUSTRY_META[selectedIndustry]?.emoji}</div>
            <div>
              <div className="font-black text-white">{currentIndustry.title}</div>
              <div className="text-xs font-jp mt-0.5" style={{ color: 'rgba(200,196,255,0.6)' }}>{currentIndustry.jpTitle}</div>
              <div className="text-xs mt-1" style={{ color: 'rgba(200,196,255,0.7)' }}>{currentIndustry.description}</div>
            </div>
          </div>
          <div className="space-y-3">
            {currentIndustry.vocab.map(item => (
              <VocabCard key={item.id} item={item} color={INDUSTRY_META[selectedIndustry]?.color || '#8b5cf6'} />
            ))}
          </div>
        </div>
      )}

      {tab === 'keigo' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl" style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-black text-white">What is Keigo? (敬語)</span>
            </div>
            <p className="text-xs mb-3" style={{ color: 'rgba(200,196,255,0.7)' }}>
              Keigo is the system of honorific speech in Japanese. Using the wrong level can be rude.
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { name: '丁寧語', romaji: 'Teineigo', desc: 'Polite', color: '#22c55e' },
                { name: '尊敬語', romaji: 'Sonkeigo', desc: 'Honorific (↑)', color: '#3b82f6' },
                { name: '謙譲語', romaji: 'Kenjougo', desc: 'Humble (↓)', color: '#8b5cf6' },
              ].map(k => (
                <div key={k.name} className="text-center p-2 rounded-lg"
                  style={{ background: `${k.color}10`, border: `1px solid ${k.color}22` }}>
                  <div className="text-xs font-jp font-black text-white">{k.name}</div>
                  <div className="text-[9px] mt-0.5" style={{ color: k.color }}>{k.romaji}</div>
                  <div className="text-[9px]" style={{ color: 'rgba(160,150,220,0.5)' }}>{k.desc}</div>
                </div>
              ))}
            </div>
          </div>
          {keigoVerbs.map(item => <KeigoCard key={item.id} item={item} />)}
        </div>
      )}

      {tab === 'email' && (
        <div className="space-y-4">
          <div className="p-3 rounded-xl text-sm" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <span style={{ color: 'rgba(147,197,253,0.9)' }}>
                Click &ldquo;Copy&rdquo; on any template, then fill in the highlighted variables.
              </span>
            </div>
          </div>
          {emailTemplates.map(item => <EmailCard key={item.id} item={item} />)}
        </div>
      )}

      {tab === 'interview' && (
        <div className="space-y-4">
          <div className="p-3 rounded-xl text-sm" style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}>
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <span style={{ color: 'rgba(200,196,255,0.8)' }}>
                Tap 🔊 to hear the question. Tap &ldquo;Show Model Answer&rdquo; to reveal the ideal response.
              </span>
            </div>
          </div>
          {interviewQuestions.map((item, idx) => <InterviewCard key={item.id} item={item} idx={idx} />)}
          <Card padding="md" style={{ border: '1px solid rgba(236,72,153,0.25)' }}>
            <div className="flex items-center gap-4">
              <div className="text-4xl">🎤</div>
              <div className="flex-1">
                <div className="font-black text-white mb-1">Practice with AI Tutor</div>
                <div className="text-xs mb-3" style={{ color: 'rgba(200,196,255,0.7)' }}>
                  Use the AI Tutor to simulate a Japanese job interview with real-time feedback.
                </div>
                <div className="flex gap-2">
                  <Button variant="primary" size="sm" onClick={() => router.push('/ai-tutor')}>
                    <Sparkles className="w-3.5 h-3.5" /> AI Mock Interview
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => router.push('/speaking')}>
                    Speaking Practice
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
