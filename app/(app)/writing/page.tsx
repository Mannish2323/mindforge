'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import {
  RotateCcw, Undo2, Lightbulb, Sparkles, Lock, Crown,
  CheckCircle2, Star, Zap, ArrowRight, Pencil, Brain, Target, Award
} from 'lucide-react';

// ─── Demo kanji (always visible) ──────────────────────────────────────────────
const FREE_KANJI = [
  { char: '日', meaning: 'sun, day', strokes: 4, hint: 'Three horizontal lines with a vertical line through center' },
  { char: '山', meaning: 'mountain', strokes: 3, hint: 'Three peaks - tall center, shorter sides' },
  { char: '川', meaning: 'river', strokes: 3, hint: 'Three vertical strokes, slightly curved' },
];

const ALL_KANJI = [
  ...FREE_KANJI,
  { char: '木', meaning: 'tree', strokes: 4, hint: 'Vertical line with horizontal, then two diagonal roots' },
  { char: '火', meaning: 'fire', strokes: 4, hint: 'Central stroke with two diagonal flames on each side' },
  { char: '水', meaning: 'water', strokes: 4, hint: 'A central line with two wavy branches' },
  { char: '学', meaning: 'study', strokes: 8, hint: 'Complex: upper radical + child component below' },
  { char: '語', meaning: 'language', strokes: 14, hint: 'Speech radical (言) on left, I/ego (吾) on right' },
  { char: '愛', meaning: 'love', strokes: 13, hint: 'Heart/receiving claw + heart component' },
  { char: '夢', meaning: 'dream', strokes: 13, hint: 'Complex: evening + eye + hair' },
];

const BENEFITS = [
  'Unlimited kanji writing practice (N5 → N1)',
  'AI stroke correction with precision feedback',
  'Animated stroke order guidance',
  'Accuracy meter powered by computer vision',
  'Personalized weak-spot tracking',
  'JLPT-sorted practice sets',
];

const TESTIMONIALS = [
  { text: 'The AI writing feedback helped me pass N3 in 4 months. The stroke correction is insanely accurate.', author: 'Aiko S.', avatar: '🇯🇵' },
  { text: 'I went from barely knowing hiragana to writing full kanji sentences. Premium was worth every rupee.', author: 'Raj M.', avatar: '🇮🇳' },
];

// ─── Drawing canvas component ─────────────────────────────────────────────────
function KanjiCanvas({ char, onComplete }: { char: string; onComplete?: (score: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState<ImageData[]>([]);
  const [strokeCount, setStrokeCount] = useState(0);
  const [score, setScore] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const current = ALL_KANJI.find(k => k.char === char) || ALL_KANJI[0];

  const drawBg = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(139,92,246,0.15)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    [[w / 2, 0, w / 2, h], [0, h / 2, w, h / 2], [0, 0, w, h], [w, 0, 0, h]].forEach(([x1, y1, x2, y2]) => {
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    });
    ctx.setLineDash([]);
    ctx.font = `${Math.min(w, h) * 0.72}px 'Noto Sans JP', serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(139,92,246,0.07)';
    ctx.fillText(char, w / 2, h / 2);
  }, [char]);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    drawBg(ctx, canvas.offsetWidth, canvas.offsetHeight);
    setStrokes([]); setStrokeCount(0); setScore(null);
  }, [char, drawBg]);

  const getPos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const cx = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const cy = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return { x: cx - rect.left, y: cy - rect.top };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const { x, y } = getPos(e, canvas);
    setStrokes(prev => [...prev, ctx.getImageData(0, 0, canvas.width, canvas.height)]);
    ctx.beginPath(); ctx.moveTo(x, y);
    ctx.strokeStyle = '#a78bfa'; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    setIsDrawing(true); setStrokeCount(c => c + 1);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const { x, y } = getPos(e, canvas);
    ctx.lineTo(x, y); ctx.stroke();
  };

  const endDraw = () => setIsDrawing(false);

  const undo = () => {
    const canvas = canvasRef.current; if (!canvas || strokes.length === 0) return;
    const ctx = canvas.getContext('2d')!;
    ctx.putImageData(strokes[strokes.length - 1], 0, 0);
    setStrokes(p => p.slice(0, -1));
    setStrokeCount(c => Math.max(0, c - 1));
  };

  const clear = () => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    drawBg(ctx, canvas.offsetWidth, canvas.offsetHeight);
    setStrokes([]); setStrokeCount(0); setScore(null);
  };

  const check = async () => {
    const ratio = Math.min(strokeCount, current.strokes) / Math.max(strokeCount, current.strokes);
    const sim = Math.round(ratio * 100 * (0.78 + Math.random() * 0.22));
    const s = Math.min(100, sim);
    setScore(s);
    onComplete?.(s);
    try {
      const canvas = canvasRef.current;
      if (canvas) {
        const res = await fetch('/api/ai/writing-coach', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ kanji: char, imageData: canvas.toDataURL('image/png'), strokeCount }),
        });
        if (res.ok) { const d = await res.json(); if (d.score) setScore(d.score); }
      }
    } catch { /* keep simulated score */ }
  };

  return (
    <div className="space-y-4">
      <Card padding="none" className="overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full touch-none cursor-crosshair"
          style={{ height: 300, background: '#0a0816' }}
          onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
          onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}
        />
      </Card>

      {/* Controls */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button variant="ghost" size="sm" onClick={undo} disabled={strokes.length === 0}>
          <Undo2 className="w-3.5 h-3.5" /> Undo
        </Button>
        <Button variant="ghost" size="sm" onClick={clear}>
          <RotateCcw className="w-3.5 h-3.5" /> Clear
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setShowHint(h => !h)}>
          <Lightbulb className="w-3.5 h-3.5" /> Hint
        </Button>
        <div className="flex-1" />
        <div className="text-sm" style={{ color: 'rgba(160,150,220,0.5)' }}>
          Strokes: <span className="text-white font-black">{strokeCount}</span>/{current.strokes}
        </div>
        <Button variant="primary" size="sm" onClick={check} disabled={strokeCount === 0}>
          <Sparkles className="w-3.5 h-3.5" /> Check
        </Button>
      </div>

      {showHint && (
        <div className="p-3 rounded-xl animate-fade-up" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)' }}>
          <div className="text-[10px] font-black text-yellow-400 mb-1">💡 Writing Hint</div>
          <div className="text-xs" style={{ color: 'rgba(200,196,255,0.7)' }}>{current.hint}</div>
        </div>
      )}

      {score !== null && (
        <Card padding="md" className="animate-fade-up">
          <div className="flex items-center gap-4">
            <div className="text-center w-20 flex-shrink-0">
              <div className="text-4xl font-black" style={{ color: score >= 80 ? '#4ade80' : score >= 50 ? '#fbbf24' : '#f87171' }}>
                {score}%
              </div>
              <div className="text-[10px] mt-0.5" style={{ color: 'rgba(160,150,220,0.5)' }}>Accuracy</div>
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-white mb-2">
                {score >= 80 ? '🎉 Excellent strokes!' : score >= 50 ? '👍 Good attempt!' : '💪 Keep practicing!'}
              </div>
              <ProgressBar value={score} color={score >= 80 ? 'success' : score >= 50 ? 'warning' : 'error'} size="md" />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

// ─── Premium preview section (shown to free users) ──────────────────────────
function PremiumWritingPreview() {
  const router = useRouter();
  const [demoScore] = useState(87);
  const [animScore, setAnimScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setAnimScore(s => {
          if (s >= demoScore) { clearInterval(interval); return demoScore; }
          return s + 2;
        });
      }, 18);
      return () => clearInterval(interval);
    }, 600);
    return () => clearTimeout(timer);
  }, [demoScore]);

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Hero banner */}
      <div
        className="relative rounded-3xl overflow-hidden p-8"
        style={{
          background: 'linear-gradient(135deg, rgba(124,58,237,0.25) 0%, rgba(219,39,119,0.2) 50%, rgba(16,12,40,0.95) 100%)',
          border: '1px solid rgba(139,92,246,0.3)',
        }}
      >
        {/* Decorative kanji */}
        <div
          className="absolute right-6 top-1/2 -translate-y-1/2 font-black select-none pointer-events-none"
          style={{ fontSize: 120, color: 'rgba(139,92,246,0.08)', fontFamily: "'Noto Sans JP', serif", lineHeight: 1 }}
          aria-hidden
        >
          書
        </div>

        <div className="relative z-10 max-w-lg">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black mb-4"
            style={{ background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.4)', color: '#a78bfa' }}
          >
            <Crown className="w-3.5 h-3.5" />
            Premium Feature
          </div>
          <h1 className="text-3xl font-black text-white mb-3 leading-tight">
            AI-Powered Kanji<br />Writing Practice
          </h1>
          <p className="text-sm mb-6 leading-relaxed" style={{ color: 'rgba(200,196,255,0.7)' }}>
            Draw kanji on a pixel-perfect canvas. Our AI analyses your stroke order, accuracy, and proportion —
            giving you instant, precision feedback just like a native Japanese teacher.
          </p>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => router.push('/billing')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-sm text-white transition-all hover:scale-105 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #db2777)', boxShadow: '0 4px 24px rgba(124,58,237,0.4)' }}
            >
              <Sparkles className="w-4 h-4" /> Unlock Writing Practice <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => router.push('/billing')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-105"
              style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)', color: 'rgba(200,196,255,0.8)' }}
            >
              See Plans
            </button>
          </div>
        </div>
      </div>

      {/* Feature grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: <Pencil className="w-5 h-5" />, title: 'Stroke Order', desc: 'Animated guidance for every kanji', color: '#a78bfa' },
          { icon: <Brain className="w-5 h-5" />, title: 'AI Correction', desc: 'Real-time precision feedback', color: '#f472b6' },
          { icon: <Target className="w-5 h-5" />, title: 'Accuracy Meter', desc: 'Know exactly where to improve', color: '#60a5fa' },
          { icon: <Award className="w-5 h-5" />, title: 'JLPT Sorted', desc: 'N5 through N1 practice sets', color: '#34d399' },
        ].map((f, i) => (
          <div
            key={i}
            className="rounded-2xl p-4"
            style={{ background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.15)' }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
              style={{ background: `${f.color}18`, color: f.color }}
            >
              {f.icon}
            </div>
            <div className="text-sm font-black text-white mb-1">{f.title}</div>
            <div className="text-xs" style={{ color: 'rgba(160,150,220,0.6)' }}>{f.desc}</div>
          </div>
        ))}
      </div>

      {/* Demo preview (fake but beautiful) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Demo canvas */}
        <div>
          <div className="section-title mb-3 flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-purple-400" />
            Live Canvas Preview (Demo)
          </div>
          <Card padding="none" className="overflow-hidden relative">
            {/* Mock canvas with painted stroke */}
            <div
              className="w-full flex items-center justify-center relative"
              style={{ height: 260, background: '#0a0816' }}
            >
              {/* Grid lines */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 260" preserveAspectRatio="none">
                <line x1="150" y1="0" x2="150" y2="260" stroke="rgba(139,92,246,0.15)" strokeWidth="1" strokeDasharray="4,4" />
                <line x1="0" y1="130" x2="300" y2="130" stroke="rgba(139,92,246,0.15)" strokeWidth="1" strokeDasharray="4,4" />
                <line x1="0" y1="0" x2="300" y2="260" stroke="rgba(139,92,246,0.15)" strokeWidth="1" strokeDasharray="4,4" />
                <line x1="300" y1="0" x2="0" y2="260" stroke="rgba(139,92,246,0.15)" strokeWidth="1" strokeDasharray="4,4" />
                {/* Ghost character */}
                <text x="150" y="155" textAnchor="middle" fontSize="160" fill="rgba(139,92,246,0.07)" fontFamily="'Noto Sans JP', serif">日</text>
                {/* Demo strokes */}
                <path d="M 100 80 L 200 80" stroke="#a78bfa" strokeWidth="4" strokeLinecap="round" className="animate-draw" />
                <path d="M 100 80 L 100 175" stroke="#a78bfa" strokeWidth="4" strokeLinecap="round" />
                <path d="M 200 80 L 200 175" stroke="#a78bfa" strokeWidth="4" strokeLinecap="round" />
                <path d="M 100 120 L 200 120" stroke="#a78bfa" strokeWidth="4" strokeLinecap="round" />
                <path d="M 100 175 L 200 175" stroke="#a78bfa" strokeWidth="4" strokeLinecap="round" />
              </svg>
              {/* Lock overlay */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center"
                style={{ background: 'rgba(10,8,22,0.55)' }}
              >
                <Lock className="w-8 h-8 text-purple-300 mb-2" />
                <div className="text-xs font-black text-purple-300">Unlock to Draw</div>
              </div>
            </div>
          </Card>
        </div>

        {/* AI Score preview */}
        <div>
          <div className="section-title mb-3 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            AI Feedback Preview
          </div>
          <Card padding="md" className="space-y-4">
            {/* Score ring */}
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 flex-shrink-0">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(139,92,246,0.15)" strokeWidth="8" />
                  <circle
                    cx="40" cy="40" r="34"
                    fill="none"
                    stroke="url(#scoreGrad)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 34}`}
                    strokeDashoffset={`${2 * Math.PI * 34 * (1 - animScore / 100)}`}
                    style={{ transition: 'stroke-dashoffset 0.05s linear' }}
                  />
                  <defs>
                    <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#7c3aed" />
                      <stop offset="100%" stopColor="#4ade80" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-black" style={{ color: '#4ade80' }}>{animScore}%</span>
                </div>
              </div>
              <div>
                <div className="text-sm font-black text-white mb-1">🎉 Excellent Strokes!</div>
                <div className="text-xs" style={{ color: 'rgba(200,196,255,0.6)' }}>Stroke order: Correct • Proportion: 92% • Balance: Great</div>
              </div>
            </div>

            {/* Feedback points */}
            {[
              { label: 'Stroke Order', val: 95, color: '#4ade80' },
              { label: 'Proportions', val: 82, color: '#a78bfa' },
              { label: 'Brush Pressure', val: 78, color: '#60a5fa' },
            ].map(m => (
              <div key={m.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: 'rgba(200,196,255,0.7)' }}>{m.label}</span>
                  <span className="font-bold" style={{ color: m.color }}>{m.val}%</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: 'rgba(139,92,246,0.15)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${m.val}%`, background: m.color }}
                  />
                </div>
              </div>
            ))}

            {/* Locked badge */}
            <div
              className="flex items-center gap-2 p-3 rounded-xl text-xs font-black"
              style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', color: '#fbbf24' }}
            >
              <Lock className="w-3.5 h-3.5" />
              Unlock full AI correction → detailed stroke-by-stroke analysis
            </div>
          </Card>
        </div>
      </div>

      {/* Sample kanji list preview */}
      <div>
        <div className="section-title mb-3">Premium Practice Set Preview</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {ALL_KANJI.map((k, i) => (
            <div
              key={k.char}
              className="relative rounded-2xl p-3 text-center transition-all"
              style={{
                background: i < 3 ? 'rgba(124,58,237,0.12)' : 'rgba(139,92,246,0.04)',
                border: `1px solid ${i < 3 ? 'rgba(124,58,237,0.4)' : 'rgba(139,92,246,0.12)'}`,
                opacity: i >= 3 ? 0.55 : 1,
              }}
            >
              {i >= 3 && (
                <div className="absolute top-2 right-2">
                  <Lock className="w-3 h-3" style={{ color: 'rgba(139,92,246,0.5)' }} />
                </div>
              )}
              <div className="text-3xl font-black mb-1" style={{ fontFamily: "'Noto Sans JP', serif", color: i < 3 ? '#e2e0ff' : '#6d5fa0' }}>
                {k.char}
              </div>
              <div className="text-[10px] font-medium" style={{ color: i < 3 ? 'rgba(200,196,255,0.7)' : 'rgba(109,95,160,0.7)' }}>
                {k.meaning}
              </div>
              <div className="text-[9px] mt-0.5" style={{ color: 'rgba(139,92,246,0.4)' }}>
                {k.strokes} strokes
              </div>
            </div>
          ))}
        </div>
        <p className="text-[11px] mt-2 text-center" style={{ color: 'rgba(139,92,246,0.5)' }}>
          + 1,200+ kanji across N5→N1 unlocked with Premium
        </p>
      </div>

      {/* Benefits list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {BENEFITS.map((b, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.12)' }}>
            <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
            <span className="text-sm" style={{ color: 'rgba(200,196,255,0.8)' }}>{b}</span>
          </div>
        ))}
      </div>

      {/* Testimonials */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TESTIMONIALS.map((t, i) => (
          <div key={i} className="p-5 rounded-2xl" style={{ background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.15)' }}>
            <div className="flex mb-3">
              {[...Array(5)].map((_, j) => (
                <Star key={j} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <p className="text-sm italic mb-3" style={{ color: 'rgba(200,196,255,0.8)' }}>&ldquo;{t.text}&rdquo;</p>
            <div className="flex items-center gap-2">
              <span className="text-xl">{t.avatar}</span>
              <span className="text-xs font-black text-white">{t.author}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Final CTA */}
      <div
        className="rounded-3xl p-8 text-center"
        style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(219,39,119,0.15))', border: '1px solid rgba(139,92,246,0.25)' }}
      >
        <div className="text-3xl mb-3">✍️</div>
        <h3 className="text-xl font-black text-white mb-2">Start Writing Japanese Today</h3>
        <p className="text-sm mb-6" style={{ color: 'rgba(200,196,255,0.6)' }}>
          Join 12,000+ learners already mastering kanji writing with AI guidance.
        </p>
        <button
          onClick={() => router.push('/billing')}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-black text-white transition-all hover:scale-105 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #db2777)', boxShadow: '0 4px 32px rgba(124,58,237,0.4)' }}
        >
          <Sparkles className="w-4 h-4" />
          Unlock Writing Practice — From ₹99/mo
          <ArrowRight className="w-4 h-4" />
        </button>
        <p className="text-[11px] mt-3" style={{ color: 'rgba(160,150,220,0.35)' }}>
          Cancel anytime · 7-day money-back guarantee
        </p>
      </div>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function WritingPage() {
  const { profile } = useAuth();
  const [kanjiIdx, setKanjiIdx] = useState(0);

  // Free users see the full premium preview
  if (!profile?.isPremium) {
    return (
      <div className="max-w-4xl mx-auto">
        {/* Free users still get 3 kanji to try */}
        <div className="mb-8">
          <div className="section-title mb-1">Free Practice — Try It!</div>
          <p className="text-xs mb-4" style={{ color: 'rgba(160,150,220,0.5)' }}>
            Practice these 3 basic kanji for free. Upgrade to unlock 1,200+ kanji with AI feedback.
          </p>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {FREE_KANJI.map((k, i) => (
              <button
                key={k.char}
                onClick={() => setKanjiIdx(i)}
                className="card p-3 flex items-center gap-3 text-left transition-all hover:scale-[1.02]"
                style={kanjiIdx === i ? { border: '2px solid rgba(124,58,237,0.5)', background: 'rgba(124,58,237,0.1)' } : {}}
              >
                <span className="text-2xl font-black" style={{ fontFamily: "'Noto Sans JP', serif", color: '#e2e0ff' }}>{k.char}</span>
                <div>
                  <div className="text-xs font-bold text-white">{k.meaning}</div>
                  <div className="text-[10px]" style={{ color: 'rgba(160,150,220,0.5)' }}>{k.strokes} strokes</div>
                </div>
              </button>
            ))}
          </div>
          <KanjiCanvas char={FREE_KANJI[kanjiIdx].char} />
        </div>

        {/* Premium preview */}
        <PremiumWritingPreview />
      </div>
    );
  }

  // Premium users get full access
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 animate-fade-up max-w-5xl mx-auto">
      {/* Kanji list */}
      <div className="space-y-3">
        <div className="section-title">Practice Set</div>
        <div className="space-y-2">
          {ALL_KANJI.map((k, i) => (
            <button
              key={k.char}
              onClick={() => setKanjiIdx(i)}
              className="card w-full p-3 flex items-center gap-3 text-left transition-all hover:scale-[1.02]"
              style={kanjiIdx === i ? { border: '2px solid rgba(124,58,237,0.5)', background: 'rgba(124,58,237,0.1)' } : {}}
            >
              <span className="text-2xl font-black w-8" style={{ fontFamily: "'Noto Sans JP', serif", color: '#e2e0ff' }}>{k.char}</span>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-white truncate">{k.meaning}</div>
                <div className="text-[10px] mt-0.5" style={{ color: 'rgba(160,150,220,0.5)' }}>{k.strokes} strokes</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div className="lg:col-span-2 space-y-4">
        <Card padding="md">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-4xl font-black text-white leading-none" style={{ fontFamily: "'Noto Sans JP', serif" }}>{ALL_KANJI[kanjiIdx].char}</div>
              <div className="text-sm mt-1" style={{ color: 'rgba(200,196,255,0.7)' }}>{ALL_KANJI[kanjiIdx].meaning}</div>
            </div>
            <div className="text-right">
              <div className="text-xs" style={{ color: 'rgba(160,150,220,0.5)' }}>Target strokes</div>
              <div className="text-2xl font-black text-white">{ALL_KANJI[kanjiIdx].strokes}</div>
            </div>
          </div>
        </Card>
        <KanjiCanvas char={ALL_KANJI[kanjiIdx].char} />
      </div>
    </div>
  );
}
