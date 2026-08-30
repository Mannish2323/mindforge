'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PenTool, Undo2, Redo2, RotateCcw, Play, Check, Flame,
  Sparkles, Volume2, ZoomIn, ZoomOut, Maximize2, Sliders, Layers,
  TrendingUp, AlertTriangle, Target, Info
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MFIcon } from '@/components/ui/MFIcon';
import { evaluateHandwritingCanvas, type GeometryBreakdown, type StrokeVector } from '@/lib/handwritingEvaluator';

interface CharacterItem {
  char: string;
  romaji: string;
  type: 'Hiragana' | 'Katakana' | 'Kanji';
  meaning: string;
  strokeCount: number;
  difficulty: 'N5' | 'N4' | 'N3';
}

const WRITING_PACK: CharacterItem[] = [
  { char: '日', romaji: 'hi / nichi', type: 'Kanji', meaning: 'Sun / Day', strokeCount: 4, difficulty: 'N5' },
  { char: '月', romaji: 'tsuki / getsu', type: 'Kanji', meaning: 'Moon / Month', strokeCount: 4, difficulty: 'N5' },
  { char: '木', romaji: 'ki / moku', type: 'Kanji', meaning: 'Tree / Wood', strokeCount: 4, difficulty: 'N5' },
  { char: '水', romaji: 'mizu / sui', type: 'Kanji', meaning: 'Water', strokeCount: 4, difficulty: 'N5' },
  { char: '火', romaji: 'hi / ka', type: 'Kanji', meaning: 'Fire', strokeCount: 4, difficulty: 'N5' },
  { char: 'あ', romaji: 'a', type: 'Hiragana', meaning: 'Letter A', strokeCount: 3, difficulty: 'N5' },
  { char: 'い', romaji: 'i', type: 'Hiragana', meaning: 'Letter I', strokeCount: 2, difficulty: 'N5' },
  { char: 'う', romaji: 'u', type: 'Hiragana', meaning: 'Letter U', strokeCount: 2, difficulty: 'N5' },
  { char: 'え', romaji: 'e', type: 'Hiragana', meaning: 'Letter E', strokeCount: 2, difficulty: 'N5' },
  { char: 'お', romaji: 'o', type: 'Hiragana', meaning: 'Letter O', strokeCount: 3, difficulty: 'N5' },
];

// Score component metadata
const SCORE_COMPONENTS = [
  { key: 'boundingBoxScore',     label: 'Bounding Box',    weight: '20%', iconName: 'kanji', desc: 'Size & aspect ratio vs reference' },
  { key: 'pixelOverlapScore',    label: 'Pixel Overlap',   weight: '30%', iconName: 'star', desc: 'Ink overlapping the reference character' },
  { key: 'strokeCountScore',     label: 'Stroke Count',    weight: '10%', iconName: 'edit', desc: 'Number of strokes drawn' },
  { key: 'strokePositionScore',  label: 'Centering',       weight: '20%', iconName: 'bookmarks', desc: 'Character centred in guide zone' },
  { key: 'strokeDirectionScore', label: 'Direction',       weight: '10%', iconName: 'share', desc: 'Consistent stroke direction' },
  { key: 'canvasOverflowScore',  label: 'Within Guide',    weight: '10%', iconName: 'check', desc: 'Ink inside the guide boundaries' },
] as const;

function ScoreBar({ score, color }: { score: number; color: string }) {
  return (
    <div className="w-full h-1.5 rounded-full bg-card/10 overflow-hidden">
      <motion.div
        className={`h-full rounded-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />
    </div>
  );
}

function scoreColor(score: number) {
  if (score >= 85) return 'bg-emerald-500';
  if (score >= 65) return 'bg-amber-500';
  if (score >= 45) return 'bg-orange-500';
  return 'bg-rose-500';
}

function scoreBadgeColor(score: number) {
  if (score >= 85) return 'text-emerald-400';
  if (score >= 65) return 'text-amber-400';
  if (score >= 45) return 'text-orange-400';
  return 'text-rose-400';
}

export default function WritingPage() {
  // Modes & Controls State
  const [selectedMode, setSelectedMode] = useState<'trace' | 'freewrite' | 'ghost'>('trace');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [repCount, setRepCount] = useState(1);
  const [maxReps] = useState(50);
  const [isGhostPlaying, setIsGhostPlaying] = useState(false);

  // Professional Toolbar Settings
  const [brushSize, setBrushSize] = useState<number>(6);
  const [guideOpacity, setGuideOpacity] = useState<number>(30);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Canvas drawing state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokeHistory, setStrokeHistory] = useState<ImageData[]>([]);
  const [redoHistory, setRedoHistory] = useState<ImageData[]>([]);

  // Stroke vector tracking � each completed stroke is stored here
  const currentStrokePoints = useRef<{ x: number; y: number }[]>([]);
  const [recordedStrokes, setRecordedStrokes] = useState<StrokeVector[]>([]);

  // Scoring state
  const [scoreResult, setScoreResult] = useState<GeometryBreakdown | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Show/hide breakdown detail
  const [showBreakdown, setShowBreakdown] = useState(false);

  const currentChar = WRITING_PACK[currentIndex];

  // -- Canvas setup ------------------------------------------------------------
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr    = window.devicePixelRatio || 1;
    const width  = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    canvas.width  = width  * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    ctx.lineCap  = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#C15BFF';
    ctx.lineWidth   = brushSize;
  }, [brushSize]);

  useEffect(() => {
    setupCanvas();
    window.addEventListener('resize', setupCanvas);
    return () => window.removeEventListener('resize', setupCanvas);
  }, [setupCanvas, currentIndex]);

  // -- Canvas helpers ----------------------------------------------------------
  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setStrokeHistory(prev => [...prev, imageData]);
    setRedoHistory([]);
  };

  const getCanvasPos = (e: React.MouseEvent | React.TouchEvent | React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0, pressure: 0.5 };
    const rect = canvas.getBoundingClientRect();

    let clientX = 0, clientY = 0, pressure = 0.5;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
      if ('pressure' in e && (e as React.PointerEvent).pressure > 0) {
        pressure = (e as React.PointerEvent).pressure;
      }
    }

    return {
      x: (clientX - rect.left) / zoomLevel,
      y: (clientY - rect.top)  / zoomLevel,
      pressure,
    };
  };

  // -- Drawing handlers --------------------------------------------------------
  const handleStartDraw = (e: React.MouseEvent | React.TouchEvent | React.PointerEvent) => {
    if (isGhostPlaying) return;
    saveState();
    setIsDrawing(true);

    const pos = getCanvasPos(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    // Apply pressure-sensitive width
    ctx.lineWidth = (pos.pressure && pos.pressure !== 0.5)
      ? Math.max(2, brushSize * (pos.pressure * 1.6))
      : brushSize;

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);

    // Start recording stroke vector
    currentStrokePoints.current = [{ x: pos.x, y: pos.y }];
  };

  const handleDraw = (e: React.MouseEvent | React.TouchEvent | React.PointerEvent) => {
    if (!isDrawing || isGhostPlaying) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    const pos = getCanvasPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    // Record point into current stroke
    currentStrokePoints.current.push({ x: pos.x, y: pos.y });
  };

  const handleStopDraw = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    // Finalise the stroke vector
    if (currentStrokePoints.current.length >= 2) {
      setRecordedStrokes(prev => [
        ...prev,
        { points: [...currentStrokePoints.current] },
      ]);
    }
    currentStrokePoints.current = [];
  };

  // -- Canvas controls ---------------------------------------------------------
  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setStrokeHistory([]);
    setRedoHistory([]);
    setRecordedStrokes([]);
    setScoreResult(null);
  };

  const handleUndo = () => {
    if (strokeHistory.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const current = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setRedoHistory(prev => [...prev, current]);

    const prev = [...strokeHistory];
    const last = prev.pop();
    setStrokeHistory(prev);

    if (last) {
      ctx.putImageData(last, 0, 0);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Remove last stroke vector too
    setRecordedStrokes(prev => prev.slice(0, -1));
    setScoreResult(null);
  };

  const handleRedo = () => {
    if (redoHistory.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prevRedo = [...redoHistory];
    const next = prevRedo.pop();
    setRedoHistory(prevRedo);

    if (next) {
      saveState();
      ctx.putImageData(next, 0, 0);
    }
  };

  const handlePlayGhostAnimation = () => {
    setIsGhostPlaying(true);
    setTimeout(() => setIsGhostPlaying(false), 2500);
  };

  // -- Evaluation --------------------------------------------------------------
  const handleAnalyzeHandwriting = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsEvaluating(true);

    // Small timeout so the button state updates before the synchronous pixel scan
    setTimeout(() => {
      const result = evaluateHandwritingCanvas(
        canvas,
        currentChar.char,
        currentChar.strokeCount,
        recordedStrokes
      );

      setScoreResult(result);
      setShowBreakdown(true);
      setIsEvaluating(false);

      // Advance rep counter on success
      if (result.overall >= 75 && repCount < maxReps) {
        setRepCount(prev => prev + 1);
      }
    }, 50);
  };

  const speakCharacter = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentChar.char);
      utterance.lang = 'ja-JP';
      window.speechSynthesis.speak(utterance);
    }
  };

  // -- UI helpers --------------------------------------------------------------
  const tierColors: Record<GeometryBreakdown['tier'], string> = {
    'Nearly Perfect':  'border-emerald-500/50 bg-emerald-500/5',
    'Minor Mistakes':  'border-sky-500/50     bg-sky-500/5',
    'Good':            'border-amber-500/50   bg-amber-500/5',
    'Needs Improvement': 'border-orange-500/50 bg-orange-500/5',
    'Major Mismatch':  'border-rose-500/50    bg-rose-500/5',
  };

  const tierBadge: Record<GeometryBreakdown['tier'], string> = {
    'Nearly Perfect':  'S Tier',
    'Minor Mistakes':  'A Tier',
    'Good':            'B Tier',
    'Needs Improvement': 'C Tier',
    'Major Mismatch':  'D Tier',
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">

      {/* -- Header ----------------------------------------------------------- */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="lavender" className="flex items-center gap-1">
              <PenTool className="w-3.5 h-3.5 text-accent" />
              <span>Handwriting Studio</span>
            </Badge>
            <Badge variant="emerald" className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Daily Challenge</span>
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-ink font-heading mt-1">
            Japanese Writing Practice
          </h1>
          <p className="text-xs text-ink-muted mt-1 flex items-center gap-1">
            <Info className="w-3 h-3" />
            Geometry-based scoring � instant, deterministic, AI-free
          </p>
        </div>

        {/* 50-Rep counter */}
        <div className="w-full md:w-64 p-3 rounded-2xl bg-card/[0.03] border border-white/[0.08] space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-ink-secondary">Practice Goal</span>
            <span className="font-extrabold text-accent">{repCount}/{maxReps} Reps</span>
          </div>
          <div className="w-full h-2 rounded-full bg-card/10 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-brand to-coral"
              initial={{ width: 0 }}
              animate={{ width: `${(repCount / maxReps) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* -- Main Workspace --------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* -- Left: Character + Toolbar + Score ------------------------------ */}
        <div className="lg:col-span-5 space-y-6">

          {/* Character Card */}
          <Card variant="glass" padding="lg" className="text-center space-y-4 relative overflow-hidden bg-card-subtle/90 backdrop-blur-2xl">
            <div className="flex items-center justify-between text-xs text-ink-muted">
              <span>{currentChar.type} � {currentChar.difficulty}</span>
              <span>{currentChar.strokeCount} Strokes Expected</span>
            </div>

            <div className="relative flex items-center justify-center py-2">
              <span className="text-7xl md:text-8xl font-black text-ink select-none font-jp tracking-wider">
                {currentChar.char}
              </span>
              <button
                onClick={speakCharacter}
                className="absolute right-2 top-2 p-2.5 rounded-xl bg-brand/10 border border-brand/20 text-brand-light hover:bg-brand/20 transition-all cursor-pointer"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-ink capitalize">{currentChar.romaji}</h3>
              <p className="text-xs text-ink-muted">Meaning: {currentChar.meaning}</p>
            </div>

            {/* Mode Switcher */}
            <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-card/[0.04] border border-white/[0.06] text-xs font-bold">
              <button
                onClick={() => setSelectedMode('trace')}
                className={`py-2 rounded-lg transition-all cursor-pointer ${
                  selectedMode === 'trace' ? 'bg-brand text-ink shadow-[var(--paper-press-shadow)]' : 'text-ink-muted hover:text-ink'
                }`}
              >
                Trace
              </button>
              <button
                onClick={() => setSelectedMode('freewrite')}
                className={`py-2 rounded-lg transition-all cursor-pointer ${
                  selectedMode === 'freewrite' ? 'bg-brand text-ink shadow-[var(--paper-press-shadow)]' : 'text-ink-muted hover:text-ink'
                }`}
              >
                Free Write
              </button>
              <button
                onClick={handlePlayGhostAnimation}
                className={`py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  isGhostPlaying ? 'bg-accent text-ink animate-pulse' : 'text-ink-muted hover:text-ink'
                }`}
              >
                <Play className="w-3 h-3" />
                <span>Ghost</span>
              </button>
            </div>

            {/* Stroke counter live */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-ink-muted">
              <span>Strokes drawn:</span>
              <span className="font-extrabold text-accent">{recordedStrokes.length}</span>
              <span className="text-ink-light">/ {currentChar.strokeCount} expected</span>
            </div>
          </Card>

          {/* Toolbar Card */}
          <Card variant="glass" padding="md" className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
              <span className="text-xs font-extrabold text-ink flex items-center gap-1.5 uppercase tracking-wider">
                <Sliders className="w-3.5 h-3.5 text-accent" /> Brush &amp; Canvas Controls
              </span>
              {/* Live brush preview */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-ink-muted font-semibold">Preview:</span>
                <div
                  className="rounded-full bg-brand border border-edge-hover transition-all"
                  style={{ width: `${brushSize * 2}px`, height: `${brushSize * 2}px` }}
                />
              </div>
            </div>

            {/* Brush Size Presets */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-ink-muted block">Brush Size: {brushSize}px</label>
              <div className="flex items-center gap-1.5">
                {[
                  { label: 'Fine',       size: 4  },
                  { label: 'Medium',     size: 6  },
                  { label: 'Thick',      size: 8  },
                  { label: 'Calligraphy',size: 12 },
                ].map(b => (
                  <button
                    key={b.size}
                    onClick={() => setBrushSize(b.size)}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                      brushSize === b.size
                        ? 'bg-brand/20 border-brand text-brand'
                        : 'bg-card/[0.02] border-white/[0.06] text-ink-muted hover:text-ink'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Guide Opacity Slider (Trace mode only) */}
            {selectedMode === 'trace' && (
              <div className="space-y-2 pt-1 border-t border-white/[0.04]">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-ink-muted flex items-center gap-1">
                    <Layers className="w-3 h-3 text-accent" /> Guide Opacity
                  </span>
                  <span className="text-ink">{guideOpacity}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={guideOpacity}
                  onChange={e => setGuideOpacity(Number(e.target.value))}
                  className="w-full h-1.5 rounded-lg bg-card/10 accent-brand cursor-pointer"
                />
              </div>
            )}
          </Card>

          {/* -- Score Result Panel ------------------------------------------- */}
          <AnimatePresence>
            {scoreResult && (
              <motion.div
                key="score"
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              >
                <Card
                  variant="glass"
                  padding="md"
                  className={`space-y-4 border ${tierColors[scoreResult.tier]}`}
                >
                  {/* Header row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-card/10 text-xs font-bold text-accent">
                        {tierBadge[scoreResult.tier]}
                      </span>
                      <div>
                        <p className="text-[10px] text-ink-muted uppercase tracking-widest">AI Score</p>
                        <p className="text-xs font-extrabold text-white">{scoreResult.tier}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-3xl font-black ${scoreBadgeColor(scoreResult.overall)}`}>
                        {scoreResult.overall}
                      </span>
                      <span className="text-xs text-ink-muted">/100</span>
                    </div>
                  </div>

                  {/* Big overall bar */}
                  <div className="w-full h-2 rounded-full bg-card/10 overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${scoreColor(scoreResult.overall)}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${scoreResult.overall}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>

                  {/* 6-Component Breakdown Grid */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-ink uppercase tracking-widest">Score Breakdown</span>
                      <button
                        onClick={() => setShowBreakdown(v => !v)}
                        className="text-[10px] text-brand/70 hover:text-brand cursor-pointer flex items-center gap-0.5"
                      >
                        <TrendingUp className="w-3 h-3" />
                        {showBreakdown ? 'Hide detail' : 'Show detail'}
                      </button>
                    </div>

                    {/* Compact bars always visible */}
                    <div className="grid grid-cols-2 gap-2">
                      {SCORE_COMPONENTS.map(comp => {
                        const val = scoreResult[comp.key] as number;
                        return (
                          <div key={comp.key} className="space-y-1 p-2 rounded-xl bg-card/[0.03] border border-white/[0.04]">
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="text-ink-muted font-semibold flex items-center gap-1">
                                <span><MFIcon name={comp.iconName as any} size={14} /></span>
                                <span>{comp.label}</span>
                              </span>
                              <span className={`font-extrabold ${scoreBadgeColor(val)}`}>{val}%</span>
                            </div>
                            <ScoreBar score={val} color={scoreColor(val)} />
                            <p className="text-[9px] text-ink-light">{comp.weight} weight</p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Expanded insight bullets */}
                    <AnimatePresence>
                      {showBreakdown && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-1.5 overflow-hidden"
                        >
                          <div className="pt-2 border-t border-white/[0.06] space-y-1.5">
                            {SCORE_COMPONENTS.map((comp, i) => {
                              const insight = scoreResult.insights[i] ?? '';
                              const val = scoreResult[comp.key] as number;
                              if (!insight) return null;
                              return (
                                <div key={comp.key} className="flex gap-2 text-[11px]">
                                  <span className={`mt-0.5 flex-shrink-0 ${scoreBadgeColor(val)}`}><MFIcon name={comp.iconName as any} size={14} /></span>
                                  <p className="text-ink-secondary leading-relaxed">
                                    <span className="font-bold text-white">{comp.label}:</span> {insight}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Scribble warning */}
                    {scoreResult.isScribble && (
                      <div className="flex items-center gap-2 p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                        <span>Random scribble detected. Please trace the character strokes carefully.</span>
                      </div>
                    )}
                  </div>

                  {/* Algorithm badge */}
                  <div className="flex items-center gap-1.5 text-[9px] text-ink-light border-t border-white/[0.04] pt-2">
                    <Target className="w-3 h-3" />
                    <span>Deterministic geometry engine � BB 20% � Pixel 30% � Count 10% � Position 20% � Direction 10% � Overflow 10%</span>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* -- Right: Canvas --------------------------------------------------- */}
        <div className="lg:col-span-7 space-y-4">
          <Card variant="glass" padding="md" className="space-y-4 relative bg-card-subtle/90 border border-edge rounded-3xl">

            {/* Canvas Control Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleUndo}
                  disabled={strokeHistory.length === 0}
                  className="p-2.5 rounded-xl bg-card/[0.04] text-ink-secondary hover:bg-card/[0.08] disabled:opacity-30 cursor-pointer"
                  title="Undo"
                >
                  <Undo2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleRedo}
                  disabled={redoHistory.length === 0}
                  className="p-2.5 rounded-xl bg-card/[0.04] text-ink-secondary hover:bg-card/[0.08] disabled:opacity-30 cursor-pointer"
                  title="Redo"
                >
                  <Redo2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleClear}
                  className="p-2.5 rounded-xl bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 cursor-pointer"
                  title="Clear Canvas"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-card/[0.04] border border-white/[0.06]">
                <button
                  onClick={() => setZoomLevel(z => Math.max(0.8, z - 0.25))}
                  className="p-1 text-ink-muted hover:text-ink cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-bold text-ink px-1.5">{Math.round(zoomLevel * 100)}%</span>
                <button
                  onClick={() => setZoomLevel(z => Math.min(2.0, z + 0.25))}
                  className="p-1 text-ink-muted hover:text-ink cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoomLevel(1)}
                  className="p-1 text-ink-muted hover:text-ink cursor-pointer border-l border-edge ml-1 pl-1.5"
                  title="Fit Screen"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handlePlayGhostAnimation} disabled={isGhostPlaying}>
                  <Play className="w-3.5 h-3.5 mr-1" /> Replay Guide
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleAnalyzeHandwriting}
                  disabled={isEvaluating || strokeHistory.length === 0}
                >
                  {isEvaluating ? (
                    <><Sparkles className="w-4 h-4 mr-1 animate-spin" /> Scoring�</>
                  ) : (
                    <><Check className="w-4 h-4 mr-1" /> Evaluate Score</>
                  )}
                </Button>
              </div>
            </div>

            {/* Drawing Canvas Container */}
            <div
              className="relative w-full h-[360px] md:h-[420px] rounded-2xl bg-warm border border-white/[0.08] overflow-hidden flex items-center justify-center touch-none transition-transform duration-200"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              {/* Grid Guide */}
              <div className="absolute inset-0 pointer-events-none grid grid-cols-2 grid-rows-2 border border-white/[0.04]">
                <div className="border-r border-b border-dashed border-white/[0.06]" />
                <div className="border-b border-dashed border-white/[0.06]" />
                <div className="border-r border-dashed border-white/[0.06]" />
                <div />
              </div>

              {/* Faint Reference (Trace Mode) */}
              {selectedMode === 'trace' && (
                <span
                  className="absolute text-[220px] md:text-[260px] font-black text-ink select-none font-jp pointer-events-none transition-opacity"
                  style={{ opacity: guideOpacity / 100 }}
                >
                  {currentChar.char}
                </span>
              )}

              {/* Ghost Stroke Overlay */}
              {isGhostPlaying && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 0.5, scale: 1.05 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5, repeat: 1, repeatType: 'reverse' }}
                  className="absolute text-[220px] md:text-[260px] font-black text-accent select-none font-jp pointer-events-none blur-[1px]"
                >
                  {currentChar.char}
                </motion.span>
              )}

              {/* HTML5 Canvas */}
              <canvas
                ref={canvasRef}
                onMouseDown={handleStartDraw}
                onMouseMove={handleDraw}
                onMouseUp={handleStopDraw}
                onMouseLeave={handleStopDraw}
                onTouchStart={handleStartDraw}
                onTouchMove={handleDraw}
                onTouchEnd={handleStopDraw}
                className="w-full h-full cursor-crosshair relative z-10 touch-none"
              />
            </div>

            {/* Canvas status bar */}
            <div className="flex items-center justify-between text-[10px] text-ink-light px-1">
              <span>
                {recordedStrokes.length === 0
                  ? 'Draw the character above ?'
                  : `${recordedStrokes.length} stroke${recordedStrokes.length !== 1 ? 's' : ''} recorded � tap Evaluate Score when done`}
              </span>
              <span className="flex items-center gap-1">
                <Target className="w-3 h-3" />
                Geometry engine
              </span>
            </div>
          </Card>

          {/* Algorithm Explainer (collapsed by default) */}
          <details className="group">
            <summary className="text-[11px] text-ink-light hover:text-ink-muted cursor-pointer select-none flex items-center gap-1.5 transition-colors">
              <Info className="w-3 h-3" />
              How is the score calculated?
            </summary>
            <div className="mt-2 p-3 rounded-xl bg-card/[0.02] border border-white/[0.05] text-[11px] text-ink-muted space-y-1 leading-relaxed">
              <p className="font-bold text-ink-secondary">Score = S (Component × Weight)</p>
              {SCORE_COMPONENTS.map(c => (
                <p key={c.key} className="flex items-center gap-1">
                  <span className="font-semibold flex items-center gap-1 text-white/50"><MFIcon name={c.iconName as any} size={12} /> {c.label} ({c.weight})</span> — {c.desc}
                </p>
              ))}
              <p className="text-ink-light pt-1 italic">
                Zero random numbers. Zero AI calls. All scoring is pure pixel geometry.
                AI will be added later for natural-language feedback only.
              </p>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}
