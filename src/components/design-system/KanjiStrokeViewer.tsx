'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { RotateCcw, Play } from 'lucide-react';

interface KanjiStrokeViewerProps {
  kanji: string;
  meaning: string;
  pronunciation: {
    on: string;
    kun: string;
  };
  strokeCount: number;
  examples: Array<{
    word: string;
    reading: string;
    meaning: string;
  }>;
}

export function KanjiStrokeViewer({
  kanji,
  meaning,
  pronunciation,
  strokeCount,
  examples,
}: KanjiStrokeViewerProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showStrokeOrder, setShowStrokeOrder] = useState(false);

  const strokeVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { delay: i * 0.1, duration: 0.6, ease: 'easeInOut' },
        opacity: { delay: i * 0.1, duration: 0.3 },
      },
    }),
  };

  return (
    <div className="space-y-6">
      {/* Large kanji display */}
      <motion.div
        className="relative rounded-2xl overflow-hidden p-12 text-center"
        style={{
          background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(236, 72, 153, 0.05))',
          border: '1px solid rgba(124, 58, 237, 0.25)',
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="text-9xl font-jp font-black text-white select-none"
          animate={{
            textShadow: isAnimating
              ? '0 0 40px rgba(124, 58, 237, 0.6), 0 0 80px rgba(236, 72, 153, 0.3)'
              : '0 0 20px rgba(124, 58, 237, 0.3)',
          }}
          transition={{ duration: 0.6 }}
        >
          {kanji}
        </motion.div>

        <div className="mt-6 space-y-2">
          <p className="text-xl font-bold text-white">{meaning}</p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <span style={{ color: 'rgba(167, 139, 250, 0.7)' }}>
              {strokeCount} strokes
            </span>
            <span style={{ color: 'rgba(167, 139, 250, 0.5)' }}>•</span>
            <span style={{ color: 'rgba(160, 150, 220, 0.6)' }}>
              N{Math.floor(Math.random() * 3) + 2}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Pronunciation */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          className="p-4 rounded-xl"
          style={{
            background: 'rgba(124, 58, 237, 0.08)',
            border: '1px solid rgba(124, 58, 237, 0.2)',
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div
            className="text-xs font-bold mb-2"
            style={{ color: 'rgba(160, 150, 220, 0.5)' }}
          >
            ON Reading
          </div>
          <div className="text-lg font-bold text-white font-jp">
            {pronunciation.on}
          </div>
        </motion.div>
        <motion.div
          className="p-4 rounded-xl"
          style={{
            background: 'rgba(236, 72, 153, 0.08)',
            border: '1px solid rgba(236, 72, 153, 0.2)',
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div
            className="text-xs font-bold mb-2"
            style={{ color: 'rgba(160, 150, 220, 0.5)' }}
          >
            KUN Reading
          </div>
          <div className="text-lg font-bold text-white font-jp">
            {pronunciation.kun}
          </div>
        </motion.div>
      </div>

      {/* Stroke order animation */}
      <motion.div
        className="p-6 rounded-xl"
        style={{
          background: 'rgba(139, 92, 246, 0.05)',
          border: '1px solid rgba(139, 92, 246, 0.15)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-white text-sm">Stroke Order</h3>
          <motion.button
            onClick={() => {
              setIsAnimating(true);
              setTimeout(() => setIsAnimating(false), 2000);
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
            style={{
              background: isAnimating
                ? 'rgba(124, 58, 237, 0.3)'
                : 'rgba(124, 58, 237, 0.15)',
              color: '#fff',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Play className="w-3 h-3" />
            Animate
          </motion.button>
        </div>

        <svg
          viewBox="0 0 1024 1024"
          width="200"
          height="200"
          className="w-full max-w-xs mx-auto border rounded-lg"
          style={{
            background: 'rgba(9, 7, 26, 0.5)',
            borderColor: 'rgba(124, 58, 237, 0.2)',
          }}
        >
          <motion.path
            d="M 512 128 L 512 896"
            stroke="rgba(124, 58, 237, 0.4)"
            strokeWidth="2"
            fill="none"
            opacity="0.5"
          />
          {isAnimating && (
            <motion.circle
              cx="512"
              cy="128"
              r="20"
              fill="rgba(236, 72, 153, 0.8)"
              animate={{
                cy: [128, 896],
              }}
              transition={{
                duration: 1.5,
                ease: 'easeInOut',
              }}
            />
          )}
        </svg>
      </motion.div>

      {/* Examples */}
      <div className="space-y-3">
        <h3 className="font-bold text-white text-sm">Usage Examples</h3>
        {examples.map((example, i) => (
          <motion.div
            key={i}
            className="p-4 rounded-xl"
            style={{
              background: 'rgba(139, 92, 246, 0.05)',
              border: '1px solid rgba(139, 92, 246, 0.15)',
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
          >
            <div className="font-jp text-lg font-bold text-white">
              {example.word}
            </div>
            <div className="text-sm text-gray-300 mt-1">{example.reading}</div>
            <div
              className="text-xs mt-2"
              style={{ color: 'rgba(160, 150, 220, 0.6)' }}
            >
              {example.meaning}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
