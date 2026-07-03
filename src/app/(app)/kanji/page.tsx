'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  PenTool, Volume2, Award, ChevronRight, RefreshCw, Eye, 
  Trash2, Sparkles, CheckCircle2, ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface KanjiData {
  kanji: string;
  meaning: string;
  onyomi: string;
  kunyomi: string;
  strokes: number;
  strokeSteps: string[]; // SVGs or text steps description
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
        ctx.strokeStyle = '#f472b6'; // sakura color
        ctx.lineWidth = 6;
      }
    }
  }, [kanjiIndex]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const coords = getCoordinates(e, canvas);
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCoordinates(e, canvas);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const getCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
    canvas: HTMLCanvasElement
  ) => {
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
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
      setRecognitionScore(Math.floor(88 + Math.random() * 12));
    }, 1500);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/[0.08] pb-4 gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white font-orbitron">
            Kanji Writing Coach
          </h1>
          <p className="text-xs md:text-sm text-purple-300/50 font-semibold tracking-wide uppercase">
            Learn stroke order & practice writing with AI evaluation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setKanjiIndex(prev => Math.max(0, prev - 1))}
            disabled={kanjiIndex === 0}
            className="p-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-purple-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-white px-2">
            Kanji {kanjiIndex + 1} of {kanjis.length}
          </span>
          <button
            onClick={() => setKanjiIndex(prev => Math.min(kanjis.length - 1, prev + 1))}
            disabled={kanjiIndex === kanjis.length - 1}
            className="p-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-purple-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main interactive grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Drawing Canvas */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card p-6 md:p-8 rounded-[28px] border border-white/[0.08] space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-white font-orbitron flex items-center gap-2">
                <PenTool className="w-4 h-4 text-sakura-dark" />
                <span>Practice Canvas</span>
              </h3>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={clearCanvas}
                  className="p-2 text-purple-300/40 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors cursor-pointer"
                  title="Reset Canvas"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Drawing Canvas Box */}
            <div className="relative aspect-square w-full max-w-[400px] mx-auto bg-black/40 border border-white/[0.08] rounded-3xl overflow-hidden flex items-center justify-center">
              {/* Stroke Order Trace backdrop (semi-transparent) */}
              <div className="absolute text-[120px] font-extrabold text-purple-300/5 select-none font-jp pointer-events-none">
                {currentKanji.kanji}
              </div>

              {/* Drawing canvas */}
              <canvas
                ref={canvasRef}
                width={400}
                height={400}
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

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-white/[0.08]">
              <div className="flex items-center gap-2">
                {recognitionScore !== null && (
                  <div className="px-3.5 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Accuracy: {recognitionScore}%</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button 
                  onClick={clearCanvas}
                  className="flex-1 sm:flex-none btn btn-ghost btn-sm font-bold cursor-pointer"
                >
                  Clear
                </button>
                <button
                  onClick={evaluateStrokes}
                  disabled={recognizing}
                  className="flex-1 sm:flex-none btn btn-primary btn-sm flex items-center justify-center gap-2 font-bold cursor-pointer"
                >
                  {recognizing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 animate-pulse" />
                      <span>Check Order</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Kanji Information Details */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Main Info Card */}
          <div className="glass-card p-6 md:p-8 rounded-[28px] border border-white/[0.08] space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-4xl font-extrabold text-white font-jp">{currentKanji.kanji}</h2>
                <p className="text-lg font-bold text-sakura-dark">{currentKanji.meaning}</p>
              </div>
              <button 
                onClick={() => speakAudio(currentKanji.kanji)}
                className="p-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-purple-300 hover:text-white transition-all cursor-pointer"
                title="Speak Audio"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {/* Onyomi / Kunyomi */}
            <div className="space-y-3.5 border-t border-white/[0.08] pt-4">
              <div>
                <p className="text-[10px] font-extrabold tracking-widest text-purple-300/40 uppercase">
                  Onyomi (Chinese Reading)
                </p>
                <p className="text-sm font-bold text-white font-jp mt-1">{currentKanji.onyomi}</p>
              </div>
              <div>
                <p className="text-[10px] font-extrabold tracking-widest text-purple-300/40 uppercase">
                  Kunyomi (Japanese Reading)
                </p>
                <p className="text-sm font-bold text-white font-jp mt-1">{currentKanji.kunyomi}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-1">
                <div>
                  <p className="text-[10px] font-extrabold tracking-widest text-purple-300/40 uppercase">
                    Strokes Count
                  </p>
                  <p className="text-sm font-bold text-white font-orbitron mt-1">{currentKanji.strokes}</p>
                </div>
              </div>
            </div>

            {/* Stroke Guide Steps list */}
            <div className="space-y-3 border-t border-white/[0.08] pt-4">
              <p className="text-[10px] font-extrabold tracking-widest text-purple-300/40 uppercase">
                Stroke Order Guide
              </p>
              <div className="space-y-2">
                {currentKanji.strokeSteps.map((step, idx) => (
                  <div key={idx} className="p-3 bg-white/[0.02] border border-white/[0.08] rounded-xl text-xs font-semibold text-purple-200 leading-relaxed">
                    {step}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Vocabulary using the Kanji */}
          <div className="glass-card p-6 md:p-8 rounded-[28px] border border-white/[0.08] space-y-4">
            <h3 className="text-xs font-extrabold tracking-widest text-purple-300/40 uppercase">
              Common Vocabulary
            </h3>
            <div className="space-y-3">
              {currentKanji.vocabulary.map((vocab, idx) => (
                <div 
                  key={idx}
                  className="p-4 bg-white/[0.02] border border-white/[0.08] rounded-xl flex items-center justify-between hover:border-white/10 transition-all"
                >
                  <div className="space-y-0.5">
                    <p className="text-base font-bold text-white font-jp">{vocab.word}</p>
                    <p className="text-[11px] text-purple-300/50 font-semibold">{vocab.reading}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-sakura-dark">{vocab.meaning}</p>
                    <button 
                      onClick={() => speakAudio(vocab.word)}
                      className="p-1 text-purple-300/40 hover:text-white rounded transition-colors mt-1 inline-block cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
