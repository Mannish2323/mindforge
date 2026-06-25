// ================================================================
// Learn with Velmorth — Writing Practice Drawing Canvas
// ================================================================

import React, { useRef, useState, useEffect } from 'react';
import { RefreshCw, Undo, Redo, Grid3X3, Eye } from 'lucide-react';
import { Point } from '@/lib/writingEvaluator';

interface WritingCanvasProps {
  strokePaths: string[];
  currentStrokeIndex: number;
  mode: 'trace' | 'blind';
  onStrokeComplete: (strokePoints: Point[]) => void;
  completedStrokes: Point[][];
  undo: () => void;
  redo: () => void;
  clear: () => void;
  canUndo: boolean;
  canRedo: boolean;
  strokeColor?: string;
  guideColor?: string;
  isCorrectStroke?: boolean | null; // null = idle, true = green flash, false = red flash
}

export function WritingCanvas({
  strokePaths,
  currentStrokeIndex,
  mode,
  onStrokeComplete,
  completedStrokes,
  undo,
  redo,
  clear,
  canUndo,
  canRedo,
  strokeColor = '#10B981', // Emerald/Velmorth green
  guideColor = '#4B5563', // Slate-600
  isCorrectStroke = null,
}: WritingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [showGuide, setShowGuide] = useState(mode === 'trace');
  const [points, setPoints] = useState<Point[]>([]);

  // Update showGuide state when mode changes
  useEffect(() => {
    setShowGuide(mode === 'trace');
  }, [mode]);

  // Adjust canvas size to parent container
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    drawCanvasContent();
  };

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [completedStrokes, points, showGrid, showGuide, currentStrokeIndex]);

  // Main drawing logic
  const drawCanvasContent = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const scaleX = canvas.width / 109;
    const scaleY = canvas.height / 109;

    // 1. Draw Completed Strokes
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = strokeColor;

    completedStrokes.forEach((stroke) => {
      if (stroke.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(stroke[0].x * scaleX, stroke[0].y * scaleY);
      for (let i = 1; i < stroke.length; i++) {
        ctx.lineTo(stroke[i].x * scaleX, stroke[i].y * scaleY);
      }
      ctx.stroke();
    });

    // 2. Draw Current Stroke (being drawn)
    if (points.length > 0) {
      ctx.lineWidth = 6;
      ctx.strokeStyle = isCorrectStroke === false ? '#EF4444' : strokeColor; // Red if failed check
      ctx.beginPath();
      ctx.moveTo(points[0].x * scaleX, points[0].y * scaleY);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x * scaleX, points[i].y * scaleY);
      }
      ctx.stroke();
    }
  };

  // Convert client coordinate to 109x109 KanjiVG scale coordinate
  const getCanvasCoords = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    // Map pointer to 0-109 range
    const x = ((e.clientX - rect.left) / rect.width) * 109;
    const y = ((e.clientY - rect.top) / rect.height) * 109;

    return { x, y };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);

    const pt = getCanvasCoords(e);
    setIsDrawing(true);
    setPoints([pt]);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const pt = getCanvasCoords(e);
    setPoints((prev) => [...prev, pt]);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.releasePointerCapture(e.pointerId);
    }

    setIsDrawing(false);
    
    if (points.length > 2) {
      onStrokeComplete(points);
    }
    setPoints([]);
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full items-center justify-center">
      
      {/* Canvas Box */}
      <div 
        ref={containerRef}
        className={`relative w-full aspect-square max-w-[400px] border-2 rounded-2xl overflow-hidden bg-zinc-950 flex justify-center items-center select-none transition-all duration-300 ${
          isCorrectStroke === true 
            ? 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
            : isCorrectStroke === false
            ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
            : 'border-zinc-800'
        }`}
        style={{ touchAction: 'none' }}
      >
        {/* Background grid guidelines */}
        {showGrid && (
          <div className="absolute inset-0 pointer-events-none opacity-20 flex items-center justify-center">
            {/* Quadrant grid */}
            <div className="absolute w-full h-[1px] bg-dashed bg-white border-t border-dashed border-zinc-400 top-1/2" />
            <div className="absolute h-full w-[1px] bg-dashed bg-white border-l border-dashed border-zinc-400 left-1/2" />
            {/* Diagonal grid */}
            <svg className="absolute w-full h-full inset-0 text-zinc-500" viewBox="0 0 109 109">
              <line x1="0" y1="0" x2="109" y2="109" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3,3" />
              <line x1="109" y1="0" x2="0" y2="109" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3,3" />
            </svg>
          </div>
        )}

        {/* SVG background reference character */}
        {showGuide && strokePaths.length > 0 && (
          <svg 
            className="absolute w-[80%] h-[80%] pointer-events-none opacity-30 select-none text-zinc-600"
            viewBox="0 0 109 109"
          >
            {/* Draw target reference character in light gray */}
            {strokePaths.map((d, index) => (
              <path
                key={index}
                d={d}
                fill="none"
                stroke="currentColor"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}

            {/* Draw current stroke reference highlighted if trace mode */}
            {mode === 'trace' && strokePaths[currentStrokeIndex] && (
              <path
                d={strokePaths[currentStrokeIndex]}
                fill="none"
                stroke="var(--primary)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-70 animate-pulse"
              />
            )}
          </svg>
        )}

        {/* Drawing canvas layer */}
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="absolute inset-0 w-full h-full cursor-crosshair z-10"
        />

        {/* Animated playback stroke helper indicator (Guided Trace Mode) */}
        {showGuide && mode === 'trace' && strokePaths[currentStrokeIndex] && (
          <svg
            className="absolute w-[80%] h-[80%] pointer-events-none z-0"
            viewBox="0 0 109 109"
          >
            <path
              d={strokePaths[currentStrokeIndex]}
              fill="none"
              stroke="#FFF"
              strokeWidth="9"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: '200',
                strokeDashoffset: '200',
                animation: 'drawStrokePlay 2.5s infinite linear',
                opacity: 0.8,
              }}
            />
            {/* CSS Animation Keyframes Inject */}
            <style>{`
              @keyframes drawStrokePlay {
                0% { stroke-dashoffset: 200; }
                50% { stroke-dashoffset: 0; }
                100% { stroke-dashoffset: 0; }
              }
            `}</style>
          </svg>
        )}
      </div>

      {/* Canvas Tool Controls */}
      <div className="flex gap-2 justify-center w-full max-w-[400px]">
        <button
          onClick={undo}
          disabled={!canUndo}
          className="flex-1 min-h-[44px] bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-100 disabled:opacity-40 disabled:hover:bg-zinc-900 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all"
          title="Undo last stroke"
        >
          <Undo size={16} />
          Undo
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          className="flex-1 min-h-[44px] bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-100 disabled:opacity-40 disabled:hover:bg-zinc-900 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all"
          title="Redo stroke"
        >
          <Redo size={16} />
          Redo
        </button>
        <button
          onClick={clear}
          className="flex-1 min-h-[44px] bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-100 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all"
          title="Clear canvas"
        >
          <RefreshCw size={16} />
          Clear
        </button>
        <button
          onClick={() => setShowGrid((prev) => !prev)}
          className={`px-3 min-h-[44px] rounded-xl flex items-center justify-center border transition-all ${
            showGrid 
              ? 'bg-zinc-800 border-zinc-600 text-primary' 
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
          }`}
          title="Toggle Grid Guide"
        >
          <Grid3X3 size={16} />
        </button>
        <button
          onClick={() => setShowGuide((prev) => !prev)}
          className={`px-3 min-h-[44px] rounded-xl flex items-center justify-center border transition-all ${
            showGuide 
              ? 'bg-zinc-800 border-zinc-600 text-primary' 
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
          }`}
          title="Toggle Background Guide"
        >
          <Eye size={16} />
        </button>
      </div>

    </div>
  );
}
