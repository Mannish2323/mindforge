'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { JLPTBadge } from '@/components/shared/JLPTBadge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { RotateCcw, Undo2, Lightbulb, CheckCircle2, Sparkles, ZoomIn } from 'lucide-react';

const KANJI_LIST = [
  { char: '日', meaning: 'sun, day', strokes: 4, hint: 'Three horizontal lines with a vertical line through center' },
  { char: '山', meaning: 'mountain', strokes: 3, hint: 'Three peaks - tall center, shorter sides' },
  { char: '川', meaning: 'river', strokes: 3, hint: 'Three vertical strokes, slightly curved' },
  { char: '木', meaning: 'tree', strokes: 4, hint: 'Vertical line with horizontal, then two diagonal roots' },
  { char: '火', meaning: 'fire', strokes: 4, hint: 'Central stroke with two diagonal flames on each side' },
  { char: '水', meaning: 'water', strokes: 4, hint: 'A central line with two wavy branches' },
  { char: '学', meaning: 'study', strokes: 8, hint: 'Complex: upper radical + child component below' },
  { char: '語', meaning: 'language', strokes: 14, hint: 'Speech radical (言) on left, I/ego (吾) on right' },
];

export default function WritingPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [kanjiIdx, setKanjiIdx] = useState(0);
  const [score, setScore] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [strokes, setStrokes] = useState<ImageData[]>([]);
  const [strokeCount, setStrokeCount] = useState(0);
  const current = KANJI_LIST[kanjiIdx];

  const drawBackground = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.clearRect(0, 0, w, h);
    // Grid lines
    ctx.strokeStyle = 'rgba(139,92,246,0.15)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(w/2, 0); ctx.lineTo(w/2, h); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, h/2); ctx.lineTo(w, h/2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(w, h); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(w, 0); ctx.lineTo(0, h); ctx.stroke();
    ctx.setLineDash([]);
    // Ghost reference
    ctx.font = `${Math.min(w, h) * 0.7}px 'Noto Sans JP', serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(139,92,246,0.06)';
    ctx.fillText(current.char, w/2, h/2);
  }, [current.char]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    drawBackground(ctx, canvas.offsetWidth, canvas.offsetHeight);
  }, [kanjiIdx, drawBackground]);

  const getPos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const { x, y } = getPos(e, canvas);
    const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setStrokes(prev => [...prev, snapshot]);
    ctx.beginPath(); ctx.moveTo(x, y);
    ctx.strokeStyle = '#a78bfa'; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    setIsDrawing(true);
    setStrokeCount(c => c + 1);
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
    const prev = strokes[strokes.length - 1];
    ctx.putImageData(prev, 0, 0);
    setStrokes(prev => prev.slice(0, -1));
    setStrokeCount(c => Math.max(0, c - 1));
  };

  const clear = () => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    drawBackground(ctx, canvas.offsetWidth, canvas.offsetHeight);
    setStrokes([]); setStrokeCount(0); setScore(null);
  };

  const checkScore = async () => {
    // Simulate AI scoring based on stroke count accuracy
    const expected = current.strokes;
    const ratio = Math.min(strokeCount, expected) / Math.max(strokeCount, expected);
    const simScore = Math.round(ratio * 100 * (0.8 + Math.random() * 0.2));
    setScore(Math.min(100, simScore));

    // Try real AI evaluation
    try {
      const canvas = canvasRef.current;
      if (canvas) {
        const imageData = canvas.toDataURL('image/png');
        const res = await fetch('/api/ai/writing-coach', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ kanji: current.char, imageData, strokeCount }),
        });
        if (res.ok) { const d = await res.json(); if (d.score) setScore(d.score); }
      }
    } catch { /* keep simulated score */ }
  };

  const nextKanji = () => {
    setKanjiIdx((kanjiIdx + 1) % KANJI_LIST.length);
    clear(); setScore(null); setShowHint(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 animate-fade-up max-w-5xl mx-auto">
      {/* Kanji list */}
      <div className="space-y-3">
        <div className="section-title">Practice Set</div>
        <div className="space-y-2">
          {KANJI_LIST.map((k, i) => (
            <button key={k.char} onClick={() => { setKanjiIdx(i); clear(); setScore(null); setShowHint(false); }}
              className="card w-full p-3 flex items-center gap-3 text-left transition-all hover:scale-[1.02]"
              style={kanjiIdx === i ? { border: '2px solid rgba(124,58,237,0.5)', background: 'rgba(124,58,237,0.1)' } : {}}>
              <span className="text-2xl font-jp font-black text-white w-8">{k.char}</span>
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
        {/* Current kanji info */}
        <Card padding="md">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-4xl font-jp font-black text-white leading-none">{current.char}</div>
              <div className="text-sm mt-1" style={{ color: 'rgba(200,196,255,0.7)' }}>{current.meaning}</div>
            </div>
            <div className="text-right">
              <div className="text-xs" style={{ color: 'rgba(160,150,220,0.5)' }}>Target strokes</div>
              <div className="text-2xl font-black text-white">{current.strokes}</div>
            </div>
          </div>
          {/* Tabs */}
          <div className="flex gap-2">
            {['Write', 'Meaning', 'Practice'].map(tab => (
              <button key={tab} className="btn btn-ghost btn-sm text-xs">{tab}</button>
            ))}
          </div>
        </Card>

        {/* Drawing canvas */}
        <Card padding="none" className="overflow-hidden">
          <canvas
            ref={canvasRef}
            className="w-full touch-none cursor-crosshair"
            style={{ height: 320, background: '#0a0816' }}
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
          <Button variant="ghost" size="sm" onClick={() => setShowHint(!showHint)}>
            <Lightbulb className="w-3.5 h-3.5" /> Hint
          </Button>
          <div className="flex-1" />
          <div className="text-sm" style={{ color: 'rgba(160,150,220,0.5)' }}>
            Strokes: <span className="text-white font-black">{strokeCount}</span>/{current.strokes}
          </div>
          <Button variant="primary" size="sm" onClick={checkScore} disabled={strokeCount === 0}>
            <Sparkles className="w-3.5 h-3.5" /> Check
          </Button>
        </div>

        {/* Hint */}
        {showHint && (
          <div className="p-3 rounded-xl animate-fade-up" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)' }}>
            <div className="text-[10px] font-black text-yellow-400 mb-1">💡 Writing Hint</div>
            <div className="text-xs" style={{ color: 'rgba(200,196,255,0.7)' }}>{current.hint}</div>
          </div>
        )}

        {/* Score result */}
        {score !== null && (
          <Card padding="md" className="animate-fade-up">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-4xl font-black" style={{ color: score >= 80 ? '#4ade80' : score >= 50 ? '#fbbf24' : '#f87171' }}>
                  {score}%
                </div>
                <div className="text-xs" style={{ color: 'rgba(160,150,220,0.5)' }}>Accuracy</div>
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-white mb-2">
                  {score >= 80 ? '🎉 Perfect! Great writing!' : score >= 50 ? '👍 Good attempt!' : '💪 Keep practicing!'}
                </div>
                <ProgressBar value={score} color={score >= 80 ? 'success' : score >= 50 ? 'warning' : 'error'} size="md" />
                <div className="flex gap-2 mt-3">
                  <Button variant="ghost" size="sm" onClick={clear}>Try Again</Button>
                  <Button variant="primary" size="sm" onClick={nextKanji}>Next Kanji →</Button>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
