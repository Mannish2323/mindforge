'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PenTool, Undo2, RotateCcw, Lightbulb, Eye, ChevronRight, Check } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';

const WRITING_CHARS = [
  { char: 'あ', romaji: 'a', type: 'Hiragana' },
  { char: 'い', romaji: 'i', type: 'Hiragana' },
  { char: 'う', romaji: 'u', type: 'Hiragana' },
  { char: 'え', romaji: 'e', type: 'Hiragana' },
  { char: 'お', romaji: 'o', type: 'Hiragana' },
  { char: 'か', romaji: 'ka', type: 'Hiragana' },
];

export default function WritingPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  const currentChar = WRITING_CHARS[currentIndex];
  const progress = (completed.size / WRITING_CHARS.length) * 100;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#C15BFF';
    ctx.lineWidth = 4;
  }, [currentIndex]);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: (e as React.MouseEvent).clientX - rect.left, y: (e as React.MouseEvent).clientY - rect.top };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    setIsDrawing(true);
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDraw = () => setIsDrawing(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setScore(null);
  };

  const submitDrawing = () => {
    const randomScore = 70 + Math.floor(Math.random() * 30);
    setScore(randomScore);
    if (randomScore >= 60) {
      setCompleted(prev => new Set(prev).add(currentIndex));
    }
  };

  const nextChar = () => {
    if (currentIndex < WRITING_CHARS.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setScore(null);
      setShowHint(false);
    }
  };

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">Writing Practice</h1>
        <p className="text-sm text-purple-300/45">Trace and write Japanese characters</p>
      </motion.div>

      <motion.div variants={item}>
        <ProgressBar value={progress} label={`${completed.size}/${WRITING_CHARS.length} completed`} showLabel />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Character Display */}
        <motion.div variants={item}>
          <Card variant="glass" padding="lg" className="space-y-5">
            <div className="flex items-center justify-between">
              <Badge variant="pink" size="md">{currentChar.type}</Badge>
              <span className="text-xs text-purple-300/40 font-medium">{currentIndex + 1}/{WRITING_CHARS.length}</span>
            </div>
            <div className="flex flex-col items-center gap-3 py-4">
              <span className="text-8xl font-jp text-white">{currentChar.char}</span>
              <span className="text-lg text-brand-light font-semibold">{currentChar.romaji}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowHint(!showHint)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium cursor-pointer transition-all ${showHint ? 'bg-neon-purple/10 border-neon-purple/20 text-brand-light' : 'bg-white/[0.03] border-white/[0.06] text-purple-300/50'}`}
              >
                <Lightbulb className="w-4 h-4" />{showHint ? 'Hide Hint' : 'Show Hint'}
              </button>
            </div>
            {showHint && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-xl bg-neon-purple/5 border border-neon-purple/10 text-center">
                <p className="text-7xl font-jp text-neon-purple/20">{currentChar.char}</p>
                <p className="text-xs text-purple-300/40 mt-2">Trace over the character</p>
              </motion.div>
            )}
          </Card>
        </motion.div>

        {/* Drawing Canvas */}
        <motion.div variants={item}>
          <Card variant="glass" padding="md" className="space-y-4">
            <div className="relative aspect-square rounded-xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
              {/* Grid lines */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-0 right-0 h-px bg-white/[0.04]" />
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/[0.04]" />
                <div className="absolute inset-0 border-2 border-dashed border-white/[0.03] rounded-xl m-4" />
              </div>
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
                onMouseDown={startDraw}
                onMouseMove={draw}
                onMouseUp={stopDraw}
                onMouseLeave={stopDraw}
                onTouchStart={startDraw}
                onTouchMove={draw}
                onTouchEnd={stopDraw}
              />
            </div>

            {/* Score */}
            {score !== null && (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className={`p-4 rounded-xl text-center ${score >= 80 ? 'bg-emerald-500/10 border border-emerald-500/20' : score >= 60 ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-rose-500/10 border border-rose-500/20'}`}
              >
                <span className={`text-3xl font-bold font-orbitron ${score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>{score}%</span>
                <p className="text-xs text-purple-300/50 mt-1">{score >= 80 ? 'Excellent!' : score >= 60 ? 'Good effort!' : 'Try again!'}</p>
              </motion.div>
            )}

            {/* Controls */}
            <div className="flex gap-2">
              <button onClick={clearCanvas}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm font-medium text-purple-300/60 hover:text-white transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />Clear
              </button>
              {score === null ? (
                <Button onClick={submitDrawing} className="flex-1 btn btn-primary btn-sm" leftIcon={<Check className="w-4 h-4" />}>
                  Check
                </Button>
              ) : (
                <Button onClick={nextChar} className="flex-1 btn btn-primary btn-sm" rightIcon={<ChevronRight className="w-4 h-4" />}>
                  Next
                </Button>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
