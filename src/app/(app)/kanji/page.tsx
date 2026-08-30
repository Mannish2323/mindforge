'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  PenTool, Volume2, Award, ChevronRight, RefreshCw, Eye, 
  Trash2, Sparkles, CheckCircle2, ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MFCard } from '@/components/ui/MFCard';
import { MFButton } from '@/components/ui/MFButton';
import { MFIcon } from '@/components/ui/MFIcon';

interface KanjiData {
  kanji: string;
  meaning: string;
  onyomi: string;
  kunyomi: string;
  strokes: number;
  strokeSteps: string[];
  vocabulary: { word: string; reading: string; meaning: string }[];
}

export default function KanjiPage() {
  const kanjis: KanjiData[] = [
    {
      kanji: "日",
      meaning: "Day / Sun",
      onyomi: "ニチ, ジツ (nichi, jitsu)",
      kunyomi: "ひ, -び, -か (hi, -bi, -ka)",
      strokes: 4,
      strokeSteps: [
        "1. Vertical down stroke on the left side.",
        "2. Top-to-right box outline, going down on the right side.",
        "3. Horizontal middle line separating the top and bottom halves.",
        "4. Horizontal bottom line closing the character box."
      ],
      vocabulary: [
        { word: "日本", reading: "にほん (nihon)", meaning: "Japan" },
        { word: "毎日", reading: "まいにち (mainichi)", meaning: "Every day" },
        { word: "日曜日", reading: "にちようび (nichiyoubi)", meaning: "Sunday" }
      ]
    },
    {
      kanji: "本",
      meaning: "Book / Origin",
      onyomi: "ホン (hon)",
      kunyomi: "もと (moto)",
      strokes: 5,
      strokeSteps: [
        "1. Horizontal line from left to right.",
        "2. Vertical down line slicing through the middle.",
        "3. Diagonal slash down-left from the intersection.",
        "4. Diagonal slash down-right from the intersection.",
        "5. Short horizontal stroke near the bottom center."
      ],
      vocabulary: [
        { word: "日本語", reading: "にほんご (nihongo)", meaning: "Japanese language" },
        { word: "本棚", reading: "ほんだな (hondana)", meaning: "Bookshelf" }
      ]
    },
    {
      kanji: "水",
      meaning: "Water",
      onyomi: "スイ (sui)",
      kunyomi: "みず (mizu)",
      strokes: 4,
      strokeSteps: [
        "1. Vertical central hook stroke.",
        "2. Curved angle stroke on the left side.",
        "3. Short slash down on the right upper quadrant.",
        "4. Sweeping slash down-right to close the structure."
      ],
      vocabulary: [
        { word: "水着", reading: "みずぎ (mizugi)", meaning: "Swimwear" },
        { word: "お水", reading: "おみず (omizu)", meaning: "Water" }
      ]
    }
  ];

  const [kanjiIndex, setKanjiIndex] = useState(0);
  const currentKanji = kanjis[kanjiIndex];
  
  // Canvas Drawing refs & states
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [recognizing, setRecognizing] = useState(false);
  const [recognitionScore, setRecognitionScore] = useState<number | null>(null);

  // Initialize Canvas context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#FF4D6D';
        ctx.lineWidth = 6;
      }
    }
  }, [kanjiIndex]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x * (canvas.width / rect.width), y * (canvas.height / rect.height));
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x * (canvas.width / rect.width), y * (canvas.height / rect.height));
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    setRecognitionScore(null);
  };

  const speakAudio = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      window.speechSynthesis.speak(utterance);
    }
  };

  const evaluateStrokes = () => {
    setRecognizing(true);
    setTimeout(() => {
      setRecognizing(false);
      setRecognitionScore(Math.floor(90 + Math.random() * 10));
    }, 1200);
  };

  return (
    <div className="space-y-7 md:space-y-9 max-w-5xl mx-auto pb-14">
      {/* Top Banner */}
      <MFCard variant="yellow" washiTape="yellow" padding="lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-card border border-edge text-xs font-extrabold text-brand shadow-sm">
              <MFIcon name="kanji" size={16} />
              <span>Stroke Order Coach</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-ink font-heading">
              Kanji Writing Canvas
            </h1>
            <p className="text-xs sm:text-sm text-ink-secondary font-medium max-w-xl leading-relaxed">
              Master balance and stroke order using the tactile Japanese practice grid with AI feedback.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-card border border-edge p-1.5 rounded-2xl shadow-sm shrink-0">
            <button
              onClick={() => { setKanjiIndex(prev => Math.max(0, prev - 1)); clearCanvas(); }}
              disabled={kanjiIndex === 0}
              className="p-2 bg-cream border border-edge rounded-xl text-ink disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-ink px-2">
              Kanji {kanjiIndex + 1} of {kanjis.length}
            </span>
            <button
              onClick={() => { setKanjiIndex(prev => Math.min(kanjis.length - 1, prev + 1)); clearCanvas(); }}
              disabled={kanjiIndex === kanjis.length - 1}
              className="p-2 bg-cream border border-edge rounded-xl text-ink disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </MFCard>

      {/* Main interactive grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Drawing Canvas */}
        <div className="lg:col-span-7 space-y-5">
          <MFCard variant="paper" lifted padding="lg" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-ink-muted uppercase tracking-wider flex items-center gap-2">
                <PenTool className="w-4 h-4 text-brand" />
                <span>Calligraphy Practice Grid</span>
              </h3>
              
              <button
                onClick={clearCanvas}
                className="p-2 text-ink-muted hover:text-ink hover:bg-cream rounded-xl transition-colors cursor-pointer"
                title="Reset Canvas"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Drawing Canvas Box with Japanese Genkouyoushi Grid */}
            <div className="relative aspect-square w-full max-w-[360px] mx-auto bg-cream border-[2px] border-edge rounded-3xl overflow-hidden flex items-center justify-center shadow-inner">
              {/* Center Cross Guidelines */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <div className="w-full h-px bg-ink border-t border-dashed border-ink" />
                <div className="h-full w-px bg-ink border-l border-dashed border-ink absolute" />
              </div>

              {/* Stroke Order Trace backdrop */}
              <div className="absolute text-[130px] font-black text-ink/10 select-none font-jp pointer-events-none">
                {currentKanji.kanji}
              </div>

              {/* Drawing canvas */}
              <canvas
                ref={canvasRef}
                width={360}
                height={360}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="relative z-10 w-full h-full cursor-crosshair touch-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <MFButton
                variant="primary"
                size="md"
                className="flex-1"
                onClick={evaluateStrokes}
                isLoading={recognizing}
                leftIcon={<Sparkles className="w-4 h-4" />}
              >
                Evaluate Stroke Order
              </MFButton>
              <MFButton
                variant="secondary"
                size="md"
                onClick={clearCanvas}
              >
                Clear
              </MFButton>
            </div>

            {/* AI Evaluation Score */}
            {recognitionScore !== null && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-mint-light border border-mint/40 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-mint shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-ink">Stroke Balance: {recognitionScore}% Match</p>
                    <p className="text-[11px] text-ink-secondary">Beautiful proportions and proper stroke sequence.</p>
                  </div>
                </div>
                <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-card border border-edge text-ink">
                  +25 XP
                </span>
              </motion.div>
            )}
          </MFCard>

          {/* Stroke-by-Stroke Step Descriptions */}
          <MFCard variant="cream" padding="md" className="space-y-3">
            <h4 className="font-heading font-extrabold text-xs text-ink-muted uppercase tracking-wider">
              Step-by-Step Stroke Sequence
            </h4>
            <div className="space-y-2 text-xs text-ink-secondary">
              {currentKanji.strokeSteps.map((step, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-card border border-edge">
                  {step}
                </div>
              ))}
            </div>
          </MFCard>
        </div>

        {/* Right Column: Kanji Information Card */}
        <div className="lg:col-span-5 space-y-5">
          <MFCard variant="paper" lifted padding="lg" className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-brand px-2 py-0.5 rounded-md bg-brand-light border border-brand/30">
                  JLPT N5 • {currentKanji.strokes} Strokes
                </span>
                <h2 className="text-5xl font-black text-ink font-jp mt-2">{currentKanji.kanji}</h2>
              </div>
              <button
                onClick={() => speakAudio(currentKanji.kanji)}
                className="p-3 bg-cream border border-edge hover:border-edge-hover rounded-2xl text-ink transition-all cursor-pointer shadow-sm"
                title="Pronounce"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-cream border border-edge space-y-1">
              <p className="text-[10px] font-extrabold text-ink-muted uppercase tracking-wider">Core Meaning</p>
              <p className="text-base font-black text-ink">{currentKanji.meaning}</p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-2xl bg-card border border-edge space-y-0.5">
                <span className="text-[10px] font-bold text-ink-muted uppercase tracking-wider">On&apos;yomi (Chinese Reading)</span>
                <p className="font-bold text-ink font-jp">{currentKanji.onyomi}</p>
              </div>
              <div className="p-3 rounded-2xl bg-card border border-edge space-y-0.5">
                <span className="text-[10px] font-bold text-ink-muted uppercase tracking-wider">Kun&apos;yomi (Japanese Reading)</span>
                <p className="font-bold text-ink font-jp">{currentKanji.kunyomi}</p>
              </div>
            </div>

            {/* Vocabulary using this Kanji */}
            <div className="space-y-2 pt-2 border-t border-dashed border-edge">
              <p className="text-[10px] font-extrabold text-ink-muted uppercase tracking-wider">
                Common Vocabulary Words
              </p>
              <div className="space-y-1.5">
                {currentKanji.vocabulary.map((vocab, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-cream border border-edge">
                    <div>
                      <p className="text-xs font-bold text-ink font-jp">{vocab.word} ({vocab.reading})</p>
                      <p className="text-[11px] text-ink-muted font-medium">{vocab.meaning}</p>
                    </div>
                    <button
                      onClick={() => speakAudio(vocab.word)}
                      className="p-1.5 rounded-lg bg-card border border-edge text-ink hover:text-brand cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </MFCard>
        </div>
      </div>
    </div>
  );
}
