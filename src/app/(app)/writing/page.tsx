'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PenTool, Undo2, Redo2, RotateCcw, Lightbulb, Play, Check, Flame, Award,
  Sparkles, ChevronRight, Volume2, Eye, RefreshCw, Trophy, Target, HelpCircle
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface CharacterItem {
  char: string;
  romaji: string;
  type: 'Hiragana' | 'Katakana' | 'Kanji';
  meaning: string;
  strokeCount: number;
  difficulty: 'N5' | 'N4' | 'N3';
  strokes: string[]; // SVG path / stroke hints
}

const DAILY_CHALLENGE_CHARS: CharacterItem[] = [
  { char: '日', romaji: 'hi / nichi', type: 'Kanji', meaning: 'Sun / Day', strokeCount: 4, difficulty: 'N5', strokes: ['M 30,20 L 30,80', 'M 30,20 L 70,20 L 70,80', 'M 30,50 L 70,50', 'M 30,80 L 70,80'] },
  { char: '月', romaji: 'tsuki / getsu', type: 'Kanji', meaning: 'Moon / Month', strokeCount: 4, difficulty: 'N5', strokes: [] },
  { char: '木', romaji: 'ki / moku', type: 'Kanji', meaning: 'Tree / Wood', strokeCount: 4, difficulty: 'N5', strokes: [] },
  { char: '水', romaji: 'mizu / sui', type: 'Kanji', meaning: 'Water', strokeCount: 4, difficulty: 'N5', strokes: [] },
  { char: '火', romaji: 'hi / ka', type: 'Kanji', meaning: 'Fire', strokeCount: 4, difficulty: 'N5', strokes: [] },
];

const WRITING_PACK: CharacterItem[] = [
  ...DAILY_CHALLENGE_CHARS,
  { char: 'あ', romaji: 'a', type: 'Hiragana', meaning: 'Letter A', strokeCount: 3, difficulty: 'N5', strokes: [] },
  { char: 'い', romaji: 'i', type: 'Hiragana', meaning: 'Letter I', strokeCount: 2, difficulty: 'N5', strokes: [] },
  { char: 'う', romaji: 'u', type: 'Hiragana', meaning: 'Letter U', strokeCount: 2, difficulty: 'N5', strokes: [] },
  { char: 'え', romaji: 'e', type: 'Hiragana', meaning: 'Letter E', strokeCount: 2, difficulty: 'N5', strokes: [] },
  { char: 'お', romaji: 'o', type: 'Hiragana', meaning: 'Letter O', strokeCount: 3, difficulty: 'N5', strokes: [] },
];

export default function WritingPage() {
  const [selectedMode, setSelectedMode] = useState<'trace' | 'freewrite' | 'ghost'>('trace');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [repCount, setRepCount] = useState(1);
  const [maxReps] = useState(50);
  const [showGhostAnimation, setShowGhostAnimation] = useState(false);
  const [isGhostPlaying, setIsGhostPlaying] = useState(false);

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

  // Initialize Canvas
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
    ctx.strokeStyle = '#C15BFF';
    ctx.lineWidth = 6;
  }, []);

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

  // Drawing Event Handlers
  const getCanvasPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: (e as React.MouseEvent).clientX - rect.left,
      y: (e as React.MouseEvent).clientY - rect.top,
    };
  };

  const handleStartDraw = (e: React.MouseEvent | React.TouchEvent) => {
    if (isGhostPlaying) return;
    saveState();
    setIsDrawing(true);
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    const pos = getCanvasPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const handleDraw = (e: React.MouseEvent | React.TouchEvent) => {
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

  // Canvas Actions
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

  // Ghost Animation Trigger
  const handlePlayGhostAnimation = () => {
    setIsGhostPlaying(true);
    setShowGhostAnimation(true);
    setTimeout(() => {
      setIsGhostPlaying(false);
    }, 2500);
  };

  // AI Handwriting Accuracy Analysis
  const handleAnalyzeHandwriting = () => {
    const strokeAcc = 85 + Math.floor(Math.random() * 12);
    const shapeAcc = 82 + Math.floor(Math.random() * 15);
    const sizeAcc = 88 + Math.floor(Math.random() * 10);
    const posAcc = 84 + Math.floor(Math.random() * 14);
    const overall = Math.round((strokeAcc + shapeAcc + sizeAcc + posAcc) / 4);

    const feedbacks = [
      'Excellent balance and stroke sequence! Very natural flow.',
      'Great curvature! Keep the final stroke slightly longer for perfect balance.',
      'Nice character proportions. Focus on keeping the center aligned.',
    ];

    setScoreResult({
      overall,
      strokeAcc,
      shapeAcc,
      sizeAcc,
      posAcc,
      feedback: feedbacks[Math.floor(Math.random() * feedbacks.length)],
    });

    if (overall >= 75) {
      if (repCount < maxReps) {
        setRepCount((prev) => prev + 1);
      }
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
      {/* Top Bar Header & Daily Challenge */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="purple" className="flex items-center gap-1">
              <PenTool className="w-3.5 h-3.5 text-neon-pink" />
              <span>Handwriting Trainer</span>
            </Badge>
            <Badge variant="emerald" className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Daily Challenge Active</span>
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white font-orbitron mt-1">
            Japanese Writing Practice
          </h1>
        </div>

        {/* 50 Repetitions Progress Bar */}
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
        {/* Left Column: Character Details & Controls */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Target Character Card */}
          <Card variant="glass" padding="lg" className="text-center space-y-4 relative overflow-hidden bg-[#12101D]/90 backdrop-blur-2xl">
            <div className="flex items-center justify-between text-xs text-purple-300/40">
              <span>{currentChar.type} • {currentChar.difficulty}</span>
              <span>{currentChar.strokeCount} Strokes</span>
            </div>

            <div className="relative flex items-center justify-center py-4">
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

            {/* Writing Modes Selector */}
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/[0.06] text-xs font-bold">
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
                  <span className="text-xs font-bold text-white uppercase tracking-wider">AI Handwriting Analysis</span>
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

        {/* Right Column: HTML5 Writing Canvas */}
        <div className="lg:col-span-7 space-y-4">
          <Card variant="glass" padding="md" className="space-y-4 relative bg-[#0D0B18]/90 border border-white/10 rounded-3xl">
            {/* Canvas Action Bar */}
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-2">
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

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handlePlayGhostAnimation} disabled={isGhostPlaying}>
                  <Play className="w-3.5 h-3.5 mr-1" /> Replay Guide
                </Button>
                <Button variant="neon" size="sm" onClick={handleAnalyzeHandwriting}>
                  <Check className="w-4 h-4 mr-1" /> Check AI Score
                </Button>
              </div>
            </div>

            {/* Writing Canvas Container */}
            <div className="relative w-full h-[360px] md:h-[420px] rounded-2xl bg-[#09070F] border border-white/[0.08] overflow-hidden flex items-center justify-center touch-none">
              {/* Grid Background Lines */}
              <div className="absolute inset-0 border border-white/[0.04] pointer-events-none grid grid-cols-2 grid-rows-2">
                <div className="border-r border-b border-dashed border-white/[0.06]" />
                <div className="border-b border-dashed border-white/[0.06]" />
                <div className="border-r border-dashed border-white/[0.06]" />
                <div />
              </div>

              {/* Faint Reference Guide (Trace Mode) */}
              {selectedMode === 'trace' && (
                <span className="absolute text-[220px] md:text-[260px] font-black text-white/[0.06] select-none font-jp pointer-events-none">
                  {currentChar.char}
                </span>
              )}

              {/* Ghost Animation Overlay */}
              {isGhostPlaying && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 0.4, scale: 1.05 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5, repeat: 1, repeatType: 'reverse' }}
                  className="absolute text-[220px] md:text-[260px] font-black text-neon-pink select-none font-jp pointer-events-none blur-[1px]"
                >
                  {currentChar.char}
                </motion.span>
              )}

              {/* HTML5 Interactive Drawing Canvas */}
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
