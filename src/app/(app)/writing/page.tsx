'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PenTool, Undo2, Redo2, RotateCcw, Lightbulb, Play, Check, Flame,
  Sparkles, Volume2, Eye, RefreshCw, ZoomIn, ZoomOut, Maximize2, Sliders, Layers
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { evaluateHandwritingCanvas } from '@/lib/handwritingEvaluator';

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

export default function WritingPage() {
  // Modes & Controls State
  const [selectedMode, setSelectedMode] = useState<'trace' | 'freewrite' | 'ghost'>('trace');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [repCount, setRepCount] = useState(1);
  const [maxReps] = useState(50);
  const [isGhostPlaying, setIsGhostPlaying] = useState(false);

  // Professional Toolbar Settings
  const [brushSize, setBrushSize] = useState<number>(6);
  const [brushStyle, setBrushStyle] = useState<'pen' | 'pencil' | 'brush_pen'>('pen');
  const [guideOpacity, setGuideOpacity] = useState<number>(30); // 10% - 100%
  const [zoomLevel, setZoomLevel] = useState<number>(1); // 0.8x - 2.0x

  // Canvas drawing state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokeHistory, setStrokeHistory] = useState<ImageData[]>([]);
  const [redoHistory, setRedoHistory] = useState<ImageData[]>([]);

  // Scoring state
  const [scoreResult, setScoreResult] = useState<{
    overall: number;
    strokeAcc: number;
    shapeAcc: number;
    sizeAcc: number;
    posAcc: number;
    feedback: string;
  } | null>(null);

  const currentChar = WRITING_PACK[currentIndex];

  // Initialize & Configure Canvas
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (brushStyle === 'pencil') {
      ctx.strokeStyle = 'rgba(193, 91, 255, 0.75)';
      ctx.lineWidth = Math.max(2, brushSize - 1);
    } else if (brushStyle === 'brush_pen') {
      ctx.strokeStyle = '#D946EF';
      ctx.lineWidth = brushSize + 3;
    } else {
      ctx.strokeStyle = '#C15BFF';
      ctx.lineWidth = brushSize;
    }
  }, [brushSize, brushStyle]);

  useEffect(() => {
    setupCanvas();
    window.addEventListener('resize', setupCanvas);
    return () => window.removeEventListener('resize', setupCanvas);
  }, [setupCanvas, currentIndex]);

  // Save Canvas State for Undo
  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setStrokeHistory((prev) => [...prev, imageData]);
    setRedoHistory([]);
  };

  // Drawing Event Handlers (with stylus pressure sensitivity & touch prevention)
  const getCanvasPos = (e: React.MouseEvent | React.TouchEvent | React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0, pressure: 0.5 };
    const rect = canvas.getBoundingClientRect();

    let clientX = 0;
    let clientY = 0;
    let pressure = 0.5;

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
      y: (clientY - rect.top) / zoomLevel,
      pressure,
    };
  };

  const handleStartDraw = (e: React.MouseEvent | React.TouchEvent | React.PointerEvent) => {
    if (isGhostPlaying) return;
    saveState();
    setIsDrawing(true);
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    const pos = getCanvasPos(e);

    // Apply pressure sensitivity if stylus detected
    if (pos.pressure && pos.pressure > 0 && pos.pressure !== 0.5) {
      ctx.lineWidth = Math.max(2, brushSize * (pos.pressure * 1.6));
    } else {
      ctx.lineWidth = brushSize;
    }

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const handleDraw = (e: React.MouseEvent | React.TouchEvent | React.PointerEvent) => {
    if (!isDrawing || isGhostPlaying) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    const pos = getCanvasPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const handleStopDraw = () => {
    setIsDrawing(false);
  };

  // Canvas Controls
  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setStrokeHistory([]);
    setRedoHistory([]);
    setScoreResult(null);
  };

  const handleUndo = () => {
    if (strokeHistory.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentImg = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setRedoHistory((prev) => [...prev, currentImg]);

    const prevHistory = [...strokeHistory];
    const lastState = prevHistory.pop();
    setStrokeHistory(prevHistory);

    if (lastState) {
      ctx.putImageData(lastState, 0, 0);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleRedo = () => {
    if (redoHistory.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prevRedo = [...redoHistory];
    const nextState = prevRedo.pop();
    setRedoHistory(prevRedo);

    if (nextState) {
      saveState();
      ctx.putImageData(nextState, 0, 0);
    }
  };

  // Ghost Stroke Playback Trigger
  const handlePlayGhostAnimation = () => {
    setIsGhostPlaying(true);
    setTimeout(() => {
      setIsGhostPlaying(false);
    }, 2500);
  };

  // Strict Evaluation Engine Trigger
  const handleAnalyzeHandwriting = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const evaluation = evaluateHandwritingCanvas(
      canvas,
      currentChar.char,
      currentChar.strokeCount
    );

    setScoreResult({
      overall: evaluation.overall,
      strokeAcc: evaluation.strokeAcc,
      shapeAcc: evaluation.shapeAcc,
      sizeAcc: evaluation.sizeAcc,
      posAcc: evaluation.posAcc,
      feedback: `${evaluation.tier}: ${evaluation.feedback}`,
    });

    if (evaluation.overall >= 75 && repCount < maxReps) {
      setRepCount((prev) => prev + 1);
    }
  };

  const speakCharacter = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentChar.char);
      utterance.lang = 'ja-JP';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="purple" className="flex items-center gap-1">
              <PenTool className="w-3.5 h-3.5 text-neon-pink" />
              <span>Handwriting Studio</span>
            </Badge>
            <Badge variant="emerald" className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Daily Challenge</span>
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white font-orbitron mt-1">
            Japanese Writing Practice
          </h1>
        </div>

        {/* 50 Repetitions Counter */}
        <div className="w-full md:w-64 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-purple-200">Practice Goal</span>
            <span className="font-extrabold text-neon-pink">{repCount}/{maxReps} Reps</span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-neon-purple to-neon-pink"
              initial={{ width: 0 }}
              animate={{ width: `${(repCount / maxReps) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Character Details & Settings */}
        <div className="lg:col-span-5 space-y-6">
          <Card variant="glass" padding="lg" className="text-center space-y-4 relative overflow-hidden bg-[#12101D]/90 backdrop-blur-2xl">
            <div className="flex items-center justify-between text-xs text-purple-300/40">
              <span>{currentChar.type} • {currentChar.difficulty}</span>
              <span>{currentChar.strokeCount} Strokes</span>
            </div>

            <div className="relative flex items-center justify-center py-2">
              <span className="text-7xl md:text-8xl font-black text-white select-none font-jp tracking-wider">
                {currentChar.char}
              </span>
              <button
                onClick={speakCharacter}
                className="absolute right-2 top-2 p-2.5 rounded-xl bg-neon-purple/10 border border-neon-purple/20 text-brand-light hover:bg-neon-purple/20 transition-all cursor-pointer"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-white capitalize">{currentChar.romaji}</h3>
              <p className="text-xs text-purple-300/50">Meaning: {currentChar.meaning}</p>
            </div>

            {/* Mode Switcher */}
            <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.06] text-xs font-bold">
              <button
                onClick={() => setSelectedMode('trace')}
                className={`py-2 rounded-lg transition-all cursor-pointer ${
                  selectedMode === 'trace' ? 'bg-neon-purple text-white shadow-glow-purple' : 'text-purple-300/50 hover:text-white'
                }`}
              >
                Trace
              </button>
              <button
                onClick={() => setSelectedMode('freewrite')}
                className={`py-2 rounded-lg transition-all cursor-pointer ${
                  selectedMode === 'freewrite' ? 'bg-neon-purple text-white shadow-glow-purple' : 'text-purple-300/50 hover:text-white'
                }`}
              >
                Free Write
              </button>
              <button
                onClick={handlePlayGhostAnimation}
                className={`py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  isGhostPlaying ? 'bg-neon-pink text-white animate-pulse' : 'text-purple-300/50 hover:text-white'
                }`}
              >
                <Play className="w-3 h-3" />
                <span>Ghost</span>
              </button>
            </div>
          </Card>

          {/* Professional Toolbar Controls Card */}
          <Card variant="glass" padding="md" className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
              <span className="text-xs font-extrabold text-white flex items-center gap-1.5 uppercase tracking-wider">
                <Sliders className="w-3.5 h-3.5 text-neon-pink" /> Brush & Canvas Controls
              </span>
              {/* Brush Preview Circle */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-purple-300/40 font-semibold">Preview:</span>
                <div
                  className="rounded-full bg-neon-purple border border-white/20 transition-all"
                  style={{ width: `${brushSize * 2}px`, height: `${brushSize * 2}px` }}
                />
              </div>
            </div>

            {/* Brush Size Presets */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-purple-300/50 block">Brush Size: {brushSize}px</label>
              <div className="flex items-center gap-1.5">
                {[
                  { label: 'Fine', size: 4 },
                  { label: 'Medium', size: 6 },
                  { label: 'Thick', size: 8 },
                  { label: 'Calligraphy', size: 12 },
                ].map((b) => (
                  <button
                    key={b.size}
                    onClick={() => setBrushSize(b.size)}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                      brushSize === b.size
                        ? 'bg-neon-purple/20 border-neon-purple text-brand-light'
                        : 'bg-white/[0.02] border-white/[0.06] text-purple-300/40 hover:text-white'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Reference Guide Opacity Slider */}
            {selectedMode === 'trace' && (
              <div className="space-y-2 pt-1 border-t border-white/[0.04]">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-purple-300/50 flex items-center gap-1">
                    <Layers className="w-3 h-3 text-neon-pink" /> Guide Opacity
                  </span>
                  <span className="text-white">{guideOpacity}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={guideOpacity}
                  onChange={(e) => setGuideOpacity(Number(e.target.value))}
                  className="w-full h-1.5 rounded-lg bg-white/10 accent-neon-purple cursor-pointer"
                />
              </div>
            )}
          </Card>

          {/* AI Score Feedback Panel */}
          {scoreResult && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <Card
                variant="glass"
                padding="md"
                className={`space-y-3 border ${
                  scoreResult.overall >= 75 ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-rose-500/40 bg-rose-500/5'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">AI Evaluation Result</span>
                  <Badge variant={scoreResult.overall >= 75 ? 'emerald' : 'rose'} size="sm">
                    {scoreResult.overall}% Score
                  </Badge>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                  <div className="p-2 rounded-lg bg-white/[0.03]">
                    <span className="text-purple-300/40 block">Strokes</span>
                    <span className="font-extrabold text-white text-xs">{scoreResult.strokeAcc}%</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white/[0.03]">
                    <span className="text-purple-300/40 block">Shape</span>
                    <span className="font-extrabold text-white text-xs">{scoreResult.shapeAcc}%</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white/[0.03]">
                    <span className="text-purple-300/40 block">Size</span>
                    <span className="font-extrabold text-white text-xs">{scoreResult.sizeAcc}%</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white/[0.03]">
                    <span className="text-purple-300/40 block">Position</span>
                    <span className="font-extrabold text-white text-xs">{scoreResult.posAcc}%</span>
                  </div>
                </div>

                <p className="text-xs text-purple-200/80 italic leading-relaxed pt-1">
                  💡 {scoreResult.feedback}
                </p>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Right Column: HTML5 Writing Canvas + Zoom & Canvas Controls */}
        <div className="lg:col-span-7 space-y-4">
          <Card variant="glass" padding="md" className="space-y-4 relative bg-[#0D0B18]/90 border border-white/10 rounded-3xl">
            {/* Canvas Control Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleUndo}
                  disabled={strokeHistory.length === 0}
                  className="p-2.5 rounded-xl bg-white/[0.04] text-purple-200 hover:bg-white/[0.08] disabled:opacity-30 cursor-pointer"
                  title="Undo"
                >
                  <Undo2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleRedo}
                  disabled={redoHistory.length === 0}
                  className="p-2.5 rounded-xl bg-white/[0.04] text-purple-200 hover:bg-white/[0.08] disabled:opacity-30 cursor-pointer"
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
              <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.25))}
                  className="p-1 text-purple-300/60 hover:text-white cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-bold text-white px-1.5">{Math.round(zoomLevel * 100)}%</span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(2.0, z + 0.25))}
                  className="p-1 text-purple-300/60 hover:text-white cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoomLevel(1)}
                  className="p-1 text-purple-300/60 hover:text-white cursor-pointer border-l border-white/10 ml-1 pl-1.5"
                  title="Fit Screen"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handlePlayGhostAnimation} disabled={isGhostPlaying}>
                  <Play className="w-3.5 h-3.5 mr-1" /> Replay Guide
                </Button>
                <Button variant="neon" size="sm" onClick={handleAnalyzeHandwriting}>
                  <Check className="w-4 h-4 mr-1" /> Evaluate Score
                </Button>
              </div>
            </div>

            {/* Interactive Drawing Canvas Container */}
            <div
              className="relative w-full h-[360px] md:h-[420px] rounded-2xl bg-[#09070F] border border-white/[0.08] overflow-hidden flex items-center justify-center touch-none transition-transform duration-200"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              {/* Grid Background Guide */}
              <div className="absolute inset-0 border border-white/[0.04] pointer-events-none grid grid-cols-2 grid-rows-2">
                <div className="border-r border-b border-dashed border-white/[0.06]" />
                <div className="border-b border-dashed border-white/[0.06]" />
                <div className="border-r border-dashed border-white/[0.06]" />
                <div />
              </div>

              {/* Faint Reference Guide (Trace Mode with Opacity Slider) */}
              {selectedMode === 'trace' && (
                <span
                  className="absolute text-[220px] md:text-[260px] font-black text-white select-none font-jp pointer-events-none transition-opacity"
                  style={{ opacity: guideOpacity / 100 }}
                >
                  {currentChar.char}
                </span>
              )}

              {/* Ghost Stroke Animation Overlay */}
              {isGhostPlaying && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 0.5, scale: 1.05 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5, repeat: 1, repeatType: 'reverse' }}
                  className="absolute text-[220px] md:text-[260px] font-black text-neon-pink select-none font-jp pointer-events-none blur-[1px]"
                >
                  {currentChar.char}
                </motion.span>
              )}

              {/* HTML5 Canvas Element */}
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
          </Card>
        </div>
      </div>
    </div>
  );
}
