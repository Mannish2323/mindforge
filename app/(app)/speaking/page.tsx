'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import {
  Mic, MicOff, Volume2, ChevronRight, CheckCircle2, XCircle,
  Lock, Crown, Sparkles, Star, ArrowRight,
  MessageSquare, Globe, Headphones, Activity
} from 'lucide-react';
import { JLPTBadge } from '@/components/shared/JLPTBadge';

// ─── Data ──────────────────────────────────────────────────────────────────────
const FREE_CONVERSATIONS = [
  {
    id: 'greet', title: 'Greetings', level: 'N5', emoji: '👋',
    prompts: [
      { jp: 'おはようございます。', en: 'Good morning.', hint: 'A formal morning greeting' },
      { jp: 'お元気ですか？', en: 'How are you?', hint: 'A polite inquiry about someone\'s well-being' },
    ],
  },
];

const ALL_CONVERSATIONS = [
  ...FREE_CONVERSATIONS,
  {
    id: 'shopping', title: 'Shopping', level: 'N5', emoji: '🛍️',
    prompts: [
      { jp: 'これはいくらですか？', en: 'How much is this?', hint: 'Asking for a price' },
      { jp: 'これをください。', en: 'Please give me this.', hint: 'Making a purchase request' },
    ],
  },
  {
    id: 'restaurant', title: 'Restaurant', level: 'N5', emoji: '🍜',
    prompts: [
      { jp: 'メニューをください。', en: 'Please give me the menu.', hint: 'Asking for a menu' },
      { jp: 'おすすめは何ですか？', en: 'What do you recommend?', hint: 'Asking for recommendations' },
    ],
  },
  {
    id: 'directions', title: 'Directions', level: 'N4', emoji: '🗺️',
    prompts: [
      { jp: '駅はどこですか？', en: 'Where is the station?', hint: 'Asking for directions to the station' },
    ],
  },
  {
    id: 'business', title: 'Business', level: 'N3', emoji: '💼',
    prompts: [
      { jp: 'よろしくお願いします。', en: 'Please treat me well.', hint: 'Formal business introduction' },
    ],
  },
  {
    id: 'job', title: 'Job Interview', level: 'N2', emoji: '🏢',
    prompts: [
      { jp: '御社を志望した理由は何ですか？', en: 'Why did you apply to our company?', hint: 'Common job interview question' },
    ],
  },
];

const BENEFITS = [
  'AI pronunciation scoring with phoneme analysis',
  'Native speaker audio for every phrase',
  'Real-time waveform visualization',
  '50+ conversation scenarios (N5→N1)',
  'AI conversation partner (open dialogue)',
  'Weekly speaking progress reports',
];

const TESTIMONIALS = [
  { text: 'I spoke with my Japanese colleagues for the first time after 2 months of Speaking mode. The AI feedback is incredible.', author: 'Priya K.', avatar: '🇮🇳' },
  { text: 'The pronunciation scoring showed me exactly which sounds I was getting wrong. My accent improved massively.', author: 'Carlos M.', avatar: '🇧🇷' },
];

type RecordingState = 'idle' | 'recording' | 'processing' | 'done';

// ─── Waveform animation (visual only) ────────────────────────────────────────
function WaveformVisualizer({ active }: { active: boolean }) {
  const bars = 24;
  return (
    <div className="flex items-center justify-center gap-0.5 h-12">
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className="rounded-full transition-all"
          style={{
            width: 3,
            background: active ? 'linear-gradient(to top, #7c3aed, #db2777)' : 'rgba(139,92,246,0.25)',
            height: active
              ? `${12 + Math.random() * 32}px`
              : `${4 + Math.sin(i * 0.5) * 4 + 4}px`,
            animation: active ? `wave-bar ${0.4 + Math.random() * 0.6}s ease-in-out infinite alternate` : 'none',
            animationDelay: `${i * 0.04}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes wave-bar {
          from { height: 4px; }
          to { height: ${12 + Math.floor(Math.random() * 32)}px; }
        }
      `}</style>
    </div>
  );
}

// ─── Premium Speaking Preview ─────────────────────────────────────────────────
function PremiumSpeakingPreview() {
  const router = useRouter();
  const [demoScore] = useState(79);
  const [animScore, setAnimScore] = useState(0);
  const [waveActive, setWaveActive] = useState(false);

  useEffect(() => {
    // Animate score
    const t = setTimeout(() => {
      const iv = setInterval(() => {
        setAnimScore(s => { if (s >= demoScore) { clearInterval(iv); return demoScore; } return s + 2; });
      }, 20);
      return () => clearInterval(iv);
    }, 800);

    // Pulse waveform
    const w = setInterval(() => setWaveActive(a => !a), 1800);
    return () => { clearTimeout(t); clearInterval(w); };
  }, [demoScore]);

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Hero */}
      <div
        className="relative rounded-3xl overflow-hidden p-8"
        style={{
          background: 'linear-gradient(135deg, rgba(219,39,119,0.2) 0%, rgba(124,58,237,0.2) 60%, rgba(16,12,40,0.95) 100%)',
          border: '1px solid rgba(219,39,119,0.25)',
        }}
      >
        {/* Decorative */}
        <div
          className="absolute right-6 top-1/2 -translate-y-1/2 text-[160px] select-none pointer-events-none"
          style={{ opacity: 0.05, lineHeight: 1 }}
          aria-hidden
        >
          🎙️
        </div>
        <div className="relative z-10 max-w-lg">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black mb-4"
            style={{ background: 'rgba(219,39,119,0.15)', border: '1px solid rgba(219,39,119,0.35)', color: '#f472b6' }}
          >
            <Crown className="w-3.5 h-3.5" />
            Premium Feature
          </div>
          <h1 className="text-3xl font-black text-white mb-3 leading-tight">
            AI Speaking Practice &<br />Pronunciation Coach
          </h1>
          <p className="text-sm mb-6 leading-relaxed" style={{ color: 'rgba(200,196,255,0.7)' }}>
            Speak Japanese and receive instant AI pronunciation scores. Compare your voice to native speakers,
            identify exact phoneme errors, and build natural fluency through real conversation scenarios.
          </p>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => router.push('/billing')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-sm text-white transition-all hover:scale-105 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #db2777, #7c3aed)', boxShadow: '0 4px 24px rgba(219,39,119,0.35)' }}
            >
              <Sparkles className="w-4 h-4" /> Unlock Speaking Practice <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Feature grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: <Activity className="w-5 h-5" />, title: 'Waveform Analysis', desc: 'Real-time voice visualization', color: '#f472b6' },
          { icon: <Headphones className="w-5 h-5" />, title: 'Native Audio', desc: 'Every phrase voiced by natives', color: '#a78bfa' },
          { icon: <Globe className="w-5 h-5" />, title: '50+ Scenarios', desc: 'Travel, business, casual', color: '#60a5fa' },
          { icon: <MessageSquare className="w-5 h-5" />, title: 'AI Conversation', desc: 'Open dialogue partner', color: '#34d399' },
        ].map((f, i) => (
          <div key={i} className="rounded-2xl p-4" style={{ background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.15)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${f.color}18`, color: f.color }}>
              {f.icon}
            </div>
            <div className="text-sm font-black text-white mb-1">{f.title}</div>
            <div className="text-xs" style={{ color: 'rgba(160,150,220,0.6)' }}>{f.desc}</div>
          </div>
        ))}
      </div>

      {/* Demo preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mic demo */}
        <div>
          <div className="section-title mb-3 flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-pink-400" />
            Live Mic Preview (Demo)
          </div>
          <Card padding="lg" className="text-center space-y-4">
            <div className="text-2xl font-black" style={{ fontFamily: "'Noto Sans JP', serif", color: '#e2e0ff' }}>
              おはようございます。
            </div>
            <div className="text-sm" style={{ color: 'rgba(200,196,255,0.6)' }}>Good morning.</div>

            <WaveformVisualizer active={waveActive} />

            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto relative cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, rgba(219,39,119,0.3), rgba(124,58,237,0.3))', border: '1px solid rgba(219,39,119,0.3)' }}
            >
              <Mic className="w-8 h-8 text-white opacity-50" />
              <div className="absolute inset-0 flex items-center justify-center rounded-full" style={{ background: 'rgba(10,8,22,0.5)' }}>
                <Lock className="w-5 h-5 text-purple-300" />
              </div>
            </div>
            <div className="text-xs" style={{ color: 'rgba(160,150,220,0.4)' }}>Unlock to speak</div>
          </Card>
        </div>

        {/* Score preview */}
        <div>
          <div className="section-title mb-3 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            Pronunciation Score Preview
          </div>
          <Card padding="md" className="space-y-4">
            {/* Main score */}
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 flex-shrink-0">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(219,39,119,0.15)" strokeWidth="8" />
                  <circle
                    cx="40" cy="40" r="34" fill="none"
                    stroke="url(#speakGrad)"
                    strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 34}`}
                    strokeDashoffset={`${2 * Math.PI * 34 * (1 - animScore / 100)}`}
                    style={{ transition: 'stroke-dashoffset 0.04s linear' }}
                  />
                  <defs>
                    <linearGradient id="speakGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#db2777" />
                      <stop offset="100%" stopColor="#7c3aed" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-black text-pink-400">{animScore}%</span>
                </div>
              </div>
              <div>
                <div className="text-sm font-black text-white mb-1">👍 Good Pronunciation!</div>
                <div className="text-xs" style={{ color: 'rgba(200,196,255,0.6)' }}>Pitch: Natural · Tempo: Slightly fast · Clarity: Good</div>
              </div>
            </div>

            {/* Phoneme breakdown */}
            {[
              { label: 'Vowel Accuracy', val: 88, color: '#f472b6' },
              { label: 'Consonants', val: 76, color: '#a78bfa' },
              { label: 'Pitch Pattern', val: 64, color: '#60a5fa' },
              { label: 'Natural Rhythm', val: 72, color: '#34d399' },
            ].map(m => (
              <div key={m.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: 'rgba(200,196,255,0.7)' }}>{m.label}</span>
                  <span className="font-bold" style={{ color: m.color }}>{m.val}%</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: 'rgba(139,92,246,0.15)' }}>
                  <div className="h-full rounded-full" style={{ width: `${m.val}%`, background: m.color }} />
                </div>
              </div>
            ))}

            <div
              className="flex items-center gap-2 p-3 rounded-xl text-xs font-black"
              style={{ background: 'rgba(219,39,119,0.1)', border: '1px solid rgba(219,39,119,0.2)', color: '#f472b6' }}
            >
              <Lock className="w-3.5 h-3.5" />
              Unlock to see phoneme-level AI feedback
            </div>
          </Card>
        </div>
      </div>

      {/* Scenario preview */}
      <div>
        <div className="section-title mb-3">Available Conversation Scenarios</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {ALL_CONVERSATIONS.map((c, i) => (
            <div
              key={c.id}
              className="relative rounded-2xl p-4 transition-all"
              style={{
                background: i === 0 ? 'rgba(124,58,237,0.12)' : 'rgba(139,92,246,0.04)',
                border: `1px solid ${i === 0 ? 'rgba(124,58,237,0.4)' : 'rgba(139,92,246,0.12)'}`,
                opacity: i > 0 ? 0.6 : 1,
              }}
            >
              {i > 0 && <Lock className="absolute top-3 right-3 w-3.5 h-3.5" style={{ color: 'rgba(139,92,246,0.5)' }} />}
              <div className="text-2xl mb-2">{c.emoji}</div>
              <div className="text-sm font-black text-white mb-1">{c.title}</div>
              <JLPTBadge level={c.level} size="xs" />
            </div>
          ))}
          <div
            className="rounded-2xl p-4 flex flex-col items-center justify-center text-center"
            style={{ background: 'rgba(139,92,246,0.04)', border: '1px dashed rgba(139,92,246,0.2)' }}
          >
            <Lock className="w-5 h-5 mb-2" style={{ color: 'rgba(139,92,246,0.4)' }} />
            <div className="text-xs font-black" style={{ color: 'rgba(139,92,246,0.5)' }}>+44 more</div>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {BENEFITS.map((b, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.12)' }}>
            <CheckCircle2 className="w-4 h-4 text-pink-400 flex-shrink-0" />
            <span className="text-sm" style={{ color: 'rgba(200,196,255,0.8)' }}>{b}</span>
          </div>
        ))}
      </div>

      {/* Testimonials */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TESTIMONIALS.map((t, i) => (
          <div key={i} className="p-5 rounded-2xl" style={{ background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.15)' }}>
            <div className="flex mb-3">{[...Array(5)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />)}</div>
            <p className="text-sm italic mb-3" style={{ color: 'rgba(200,196,255,0.8)' }}>&ldquo;{t.text}&rdquo;</p>
            <div className="flex items-center gap-2">
              <span className="text-xl">{t.avatar}</span>
              <span className="text-xs font-black text-white">{t.author}</span>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div
        className="rounded-3xl p-8 text-center"
        style={{ background: 'linear-gradient(135deg, rgba(219,39,119,0.15), rgba(124,58,237,0.2))', border: '1px solid rgba(219,39,119,0.2)' }}
      >
        <div className="text-3xl mb-3">🎙️</div>
        <h3 className="text-xl font-black text-white mb-2">Speak Japanese Fluently</h3>
        <p className="text-sm mb-6" style={{ color: 'rgba(200,196,255,0.6)' }}>
          Train your pronunciation with AI that listens, scores, and helps you sound natural.
        </p>
        <button
          onClick={() => router.push('/billing')}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-black text-white transition-all hover:scale-105 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #db2777, #7c3aed)', boxShadow: '0 4px 32px rgba(219,39,119,0.35)' }}
        >
          <Sparkles className="w-4 h-4" />
          Unlock Speaking Practice — From ₹99/mo
          <ArrowRight className="w-4 h-4" />
        </button>
        <p className="text-[11px] mt-3" style={{ color: 'rgba(160,150,220,0.35)' }}>Cancel anytime · Secure payment</p>
      </div>
    </div>
  );
}

// ─── Free speaking component ──────────────────────────────────────────────────
function FreeSpeakingPractice() {
  const [promptIdx, setPromptIdx] = useState(0);
  const [recordState, setRecordState] = useState<RecordingState>('idle');
  const [transcript, setTranscript] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [history, setHistory] = useState<{ jp: string; said: string; score: number }[]>([]);
  const recognitionRef = useRef<any>(null);

  const conv = FREE_CONVERSATIONS[0];
  const currentPrompt = conv.prompts[promptIdx];

  const playNative = (text: string) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'ja-JP'; u.rate = 0.85; u.pitch = 1.1;
      speechSynthesis.speak(u);
    }
  };

  const calcScore = (said: string, target: string): number => {
    const s = said.replace(/[。、！？\s]/g, '').toLowerCase();
    const t = target.replace(/[。、！？\s]/g, '').toLowerCase();
    if (s === t) return 100;
    let matches = 0;
    for (const char of s) { if (t.includes(char)) matches++; }
    return Math.round((matches / Math.max(s.length, t.length)) * 100);
  };

  const startRecording = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert('Speech recognition not supported. Use Chrome.'); return; }
    const r = new SR(); r.lang = 'ja-JP'; r.interimResults = true; r.maxAlternatives = 1;
    recognitionRef.current = r;
    r.onresult = (e: any) => setTranscript(e.results[e.results.length - 1][0].transcript);
    r.onend = () => {
      setRecordState('processing');
      setTimeout(() => {
        const sc = calcScore(transcript, currentPrompt.jp);
        setScore(sc);
        setHistory(prev => [...prev, { jp: currentPrompt.jp, said: transcript, score: sc }]);
        setRecordState('done');
      }, 600);
    };
    r.onerror = () => setRecordState('idle');
    setRecordState('recording'); setTranscript(''); setScore(null);
    r.start();
  }, [transcript, currentPrompt]);

  const stopRecording = useCallback(() => { recognitionRef.current?.stop(); }, []);
  const nextPrompt = () => { setPromptIdx((promptIdx + 1) % conv.prompts.length); setRecordState('idle'); setTranscript(''); setScore(null); };

  return (
    <Card padding="lg" className="space-y-5">
      <div className="text-center">
        <div className="text-xs mb-3 font-bold" style={{ color: 'rgba(167,139,250,0.6)' }}>
          {promptIdx + 1} / {conv.prompts.length} — {conv.title} (Free)
        </div>
        <div className="text-3xl font-black text-white mb-2" style={{ fontFamily: "'Noto Sans JP', serif" }}>{currentPrompt.jp}</div>
        <div className="text-base mb-1" style={{ color: 'rgba(200,196,255,0.7)' }}>{currentPrompt.en}</div>
        <div className="text-xs italic" style={{ color: 'rgba(160,150,220,0.5)' }}>{currentPrompt.hint}</div>
      </div>

      <div className="flex justify-center">
        <Button variant="ghost" onClick={() => playNative(currentPrompt.jp)}>
          <Volume2 className="w-4 h-4" /> Listen to Native
        </Button>
      </div>

      <div className="min-h-14 p-4 rounded-xl text-center" style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.18)' }}>
        {transcript
          ? <span className="text-lg font-black text-white" style={{ fontFamily: "'Noto Sans JP', serif" }}>{transcript}</span>
          : <span className="text-sm" style={{ color: 'rgba(160,150,220,0.4)' }}>
            {recordState === 'recording' ? '🎙 Listening…' : 'Your speech will appear here'}
          </span>}
      </div>

      {score !== null && (
        <div className="animate-fade-up">
          <div className="text-center mb-3">
            <div className="text-4xl font-black mb-1" style={{ color: score >= 80 ? '#4ade80' : score >= 50 ? '#fbbf24' : '#f87171' }}>{score}%</div>
            <div className="text-sm" style={{ color: 'rgba(160,150,220,0.6)' }}>
              {score >= 80 ? '🎉 Excellent pronunciation!' : score >= 50 ? '👍 Good effort!' : '💪 Keep trying!'}
            </div>
          </div>
          <ProgressBar value={score} color={score >= 80 ? 'success' : score >= 50 ? 'warning' : 'error'} size="md" animated />
        </div>
      )}

      <div className="flex flex-col items-center gap-3">
        {recordState === 'idle' || recordState === 'done' ? (
          <button onClick={startRecording}
            className="w-20 h-20 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #db2777)', boxShadow: '0 0 32px rgba(124,58,237,0.5)' }}>
            <Mic className="w-8 h-8 text-white" />
          </button>
        ) : recordState === 'recording' ? (
          <button onClick={stopRecording}
            className="w-20 h-20 rounded-full flex items-center justify-center animate-pulse"
            style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)' }}>
            <MicOff className="w-8 h-8 text-white" />
          </button>
        ) : (
          <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.2)' }}>
            <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <div className="text-xs" style={{ color: 'rgba(160,150,220,0.5)' }}>
          {recordState === 'idle' ? 'Tap to speak' : recordState === 'recording' ? 'Tap to stop' : recordState === 'processing' ? 'Analyzing…' : 'Done!'}
        </div>
        {recordState === 'done' && <Button variant="primary" onClick={nextPrompt}>Next Phrase <ChevronRight className="w-3.5 h-3.5" /></Button>}
      </div>
    </Card>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function SpeakingPage() {
  const { profile } = useAuth();

  if (!profile?.isPremium) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="section-title mb-1">Free Speaking Practice</div>
          <p className="text-xs mb-4" style={{ color: 'rgba(160,150,220,0.5)' }}>
            Try our basic speaking practice below. Upgrade to unlock all 50+ scenarios with AI pronunciation scoring.
          </p>
          <FreeSpeakingPractice />
        </div>
        <PremiumSpeakingPreview />
      </div>
    );
  }

  // Full premium experience
  return <FullSpeakingPage />;
}

// ─── Full premium speaking page ────────────────────────────────────────────────
function FullSpeakingPage() {
  const [selectedConv, setSelectedConv] = useState(ALL_CONVERSATIONS[0]);
  const [promptIdx, setPromptIdx] = useState(0);
  const [recordState, setRecordState] = useState<RecordingState>('idle');
  const [transcript, setTranscript] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [history, setHistory] = useState<{ jp: string; said: string; score: number }[]>([]);
  const recognitionRef = useRef<any>(null);
  const currentPrompt = selectedConv.prompts[promptIdx];

  const playNative = (text: string) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'ja-JP'; u.rate = 0.85; u.pitch = 1.1;
      speechSynthesis.speak(u);
    }
  };

  const calcScore = (said: string, target: string): number => {
    const s = said.replace(/[。、！？\s]/g, '').toLowerCase();
    const t = target.replace(/[。、！？\s]/g, '').toLowerCase();
    if (s === t) return 100;
    let matches = 0;
    for (const char of s) { if (t.includes(char)) matches++; }
    return Math.round((matches / Math.max(s.length, t.length)) * 100);
  };

  const startRecording = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert('Speech recognition not supported. Use Chrome.'); return; }
    const r = new SR(); r.lang = 'ja-JP'; r.interimResults = true; r.maxAlternatives = 1;
    recognitionRef.current = r;
    r.onresult = (e: any) => setTranscript(e.results[e.results.length - 1][0].transcript);
    r.onend = () => {
      setRecordState('processing');
      setTimeout(() => {
        const sc = calcScore(transcript, currentPrompt.jp);
        setScore(sc);
        setHistory(prev => [...prev, { jp: currentPrompt.jp, said: transcript, score: sc }]);
        setRecordState('done');
      }, 600);
    };
    r.onerror = () => setRecordState('idle');
    setRecordState('recording'); setTranscript(''); setScore(null);
    r.start();
  }, [transcript, currentPrompt]);

  const stopRecording = useCallback(() => { recognitionRef.current?.stop(); }, []);
  const nextPrompt = () => { setPromptIdx((promptIdx + 1) % selectedConv.prompts.length); setRecordState('idle'); setTranscript(''); setScore(null); };

  return (
    <div className="space-y-5 animate-fade-up max-w-3xl mx-auto">
      <div className="grid grid-cols-3 gap-3">
        {ALL_CONVERSATIONS.map(c => (
          <button key={c.id} onClick={() => { setSelectedConv(c); setPromptIdx(0); setRecordState('idle'); setTranscript(''); setScore(null); }}
            className="card p-3 text-left transition-all hover:scale-[1.02]"
            style={selectedConv.id === c.id ? { border: '2px solid rgba(124,58,237,0.5)', background: 'rgba(124,58,237,0.12)' } : {}}>
            <div className="text-xl mb-1">{c.emoji}</div>
            <div className="text-xs font-black text-white">{c.title}</div>
            <JLPTBadge level={c.level} size="xs" className="mt-1" />
          </button>
        ))}
      </div>

      <Card padding="lg">
        <div className="text-center mb-6">
          <div className="text-xs mb-3 font-bold" style={{ color: 'rgba(167,139,250,0.6)' }}>
            {promptIdx + 1} / {selectedConv.prompts.length} — {selectedConv.title}
          </div>
          <div className="text-3xl font-black text-white mb-2" style={{ fontFamily: "'Noto Sans JP', serif" }}>{currentPrompt.jp}</div>
          <div className="text-base mb-1" style={{ color: 'rgba(200,196,255,0.7)' }}>{currentPrompt.en}</div>
          <div className="text-xs italic" style={{ color: 'rgba(160,150,220,0.5)' }}>{currentPrompt.hint}</div>
        </div>

        <div className="flex justify-center mb-6">
          <Button variant="ghost" onClick={() => playNative(currentPrompt.jp)}>
            <Volume2 className="w-4 h-4" /> Listen to Native
          </Button>
        </div>

        <div className="min-h-14 mb-6 p-4 rounded-xl text-center" style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.18)' }}>
          {transcript
            ? <span className="text-lg font-black text-white" style={{ fontFamily: "'Noto Sans JP', serif" }}>{transcript}</span>
            : <span className="text-sm" style={{ color: 'rgba(160,150,220,0.4)' }}>{recordState === 'recording' ? '🎙 Listening…' : 'Your speech will appear here'}</span>}
        </div>

        {score !== null && (
          <div className="mb-6 animate-fade-up">
            <div className="text-center mb-3">
              <div className="text-4xl font-black mb-1" style={{ color: score >= 80 ? '#4ade80' : score >= 50 ? '#fbbf24' : '#f87171' }}>{score}%</div>
              <div className="text-sm" style={{ color: 'rgba(160,150,220,0.6)' }}>
                {score >= 80 ? '🎉 Excellent pronunciation!' : score >= 50 ? '👍 Good effort! Keep practicing.' : '💪 Keep trying! Listen and repeat.'}
              </div>
            </div>
            <ProgressBar value={score} color={score >= 80 ? 'success' : score >= 50 ? 'warning' : 'error'} size="md" animated />
          </div>
        )}

        <div className="flex flex-col items-center gap-3">
          {recordState === 'idle' || recordState === 'done' ? (
            <button onClick={startRecording}
              className="w-20 h-20 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #db2777)', boxShadow: '0 0 32px rgba(124,58,237,0.5)' }}>
              <Mic className="w-8 h-8 text-white" />
            </button>
          ) : recordState === 'recording' ? (
            <button onClick={stopRecording}
              className="w-20 h-20 rounded-full flex items-center justify-center animate-pulse"
              style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)' }}>
              <MicOff className="w-8 h-8 text-white" />
            </button>
          ) : (
            <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.2)' }}>
              <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          <div className="text-xs" style={{ color: 'rgba(160,150,220,0.5)' }}>
            {recordState === 'idle' ? 'Tap to speak' : recordState === 'recording' ? 'Tap to stop' : recordState === 'processing' ? 'Analyzing…' : 'Done!'}
          </div>
          {recordState === 'done' && <Button variant="primary" onClick={nextPrompt}>Next Phrase <ChevronRight className="w-3.5 h-3.5" /></Button>}
        </div>
      </Card>

      {history.length > 0 && (
        <Card padding="md">
          <div className="section-title mb-3">Session History</div>
          <div className="space-y-2">
            {history.map((h, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl" style={{ background: 'rgba(139,92,246,0.06)' }}>
                {h.score >= 80 ? <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" /> : <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-black text-white truncate" style={{ fontFamily: "'Noto Sans JP', serif" }}>{h.jp}</div>
                  <div className="text-[10px] truncate" style={{ color: 'rgba(160,150,220,0.5)' }}>You said: {h.said || '(no speech detected)'}</div>
                </div>
                <div className="text-sm font-black flex-shrink-0" style={{ color: h.score >= 80 ? '#4ade80' : h.score >= 50 ? '#fbbf24' : '#f87171' }}>
                  {h.score}%
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
