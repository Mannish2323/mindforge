'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Star, Bookmark, BookmarkCheck } from 'lucide-react';

interface VocabularyCardProps {
  japanese: string;
  romaji: string;
  meaning: string;
  example?: string;
  exampleTranslation?: string;
  jlptLevel?: string;
  audioUrl?: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onPlayAudio?: () => void;
  size?: 'sm' | 'md' | 'lg';
  flipped?: boolean;
}

export function VocabularyCard({
  japanese,
  romaji,
  meaning,
  example,
  exampleTranslation,
  jlptLevel = 'N5',
  audioUrl,
  isFavorite = false,
  onToggleFavorite,
  onPlayAudio,
  size = 'md',
  flipped = false,
}: VocabularyCardProps) {
  const [isFlipped, setIsFlipped] = useState(flipped);
  const [isPlaying, setIsPlaying] = useState(false);

  const sizeStyles = {
    sm: { height: 'h-48', padding: 'p-4', textSize: 'text-2xl' },
    md: { height: 'h-64', padding: 'p-6', textSize: 'text-4xl' },
    lg: { height: 'h-80', padding: 'p-8', textSize: 'text-5xl' },
  };

  const style = sizeStyles[size];

  const handlePlayAudio = async () => {
    if (audioUrl) {
      setIsPlaying(true);
      try {
        const audio = new Audio(audioUrl);
        await audio.play();
      } catch (err) {
        console.error('Audio playback failed:', err);
      } finally {
        setIsPlaying(false);
      }
    } else if (onPlayAudio) {
      setIsPlaying(true);
      await onPlayAudio();
      setIsPlaying(false);
    }
  };

  return (
    <motion.div
      onClick={() => setIsFlipped(!isFlipped)}
      className={`relative ${style.height} cursor-pointer group`}
      style={{ perspective: '1000px' }}
    >
      <motion.div
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', bounce: 0.3 }}
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front side */}
        <motion.div
          style={{ backfaceVisibility: 'hidden' }}
          className={`absolute inset-0 rounded-2xl border backdrop-blur-xl ${style.padding} flex flex-col items-center justify-center overflow-hidden`}
          style={{
            background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(236, 72, 153, 0.05))',
            border: '1px solid rgba(124, 58, 237, 0.25)',
          }}
        >
          {/* Background glow */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity"
            style={{
              background:
                'radial-gradient(circle at top right, rgba(124, 58, 237, 0.4), transparent)',
            }}
          />

          {/* JLPT Badge */}
          <motion.div
            className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold"
            style={{
              background: 'rgba(124, 58, 237, 0.2)',
              border: '1px solid rgba(124, 58, 237, 0.4)',
              color: '#a78bfa',
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {jlptLevel}
          </motion.div>

          {/* Content */}
          <div className="relative z-10 text-center space-y-4">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className={`${style.textSize} font-jp font-black text-white`}>
                {japanese}
              </div>
              <div className="text-sm text-gray-300 mt-2">{romaji}</div>
            </motion.div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayAudio();
                }}
                className="p-2 rounded-lg transition-all"
                style={{
                  background: isPlaying
                    ? 'rgba(236, 72, 153, 0.3)'
                    : 'rgba(124, 58, 237, 0.15)',
                  border: '1px solid rgba(124, 58, 237, 0.3)',
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Volume2
                  className="w-5 h-5"
                  style={{
                    color: isPlaying ? '#ec4899' : '#a78bfa',
                  }}
                />
              </motion.button>

              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite?.();
                }}
                className="p-2 rounded-lg transition-all"
                style={{
                  background: isFavorite
                    ? 'rgba(236, 72, 153, 0.2)'
                    : 'rgba(139, 92, 246, 0.1)',
                  border: '1px solid rgba(124, 58, 237, 0.3)',
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isFavorite ? (
                  <BookmarkCheck className="w-5 h-5 text-pink-400" />
                ) : (
                  <Bookmark className="w-5 h-5 text-gray-400" />
                )}
              </motion.button>
            </div>

            {/* Hint */}
            <div
              className="text-xs mt-4"
              style={{ color: 'rgba(160, 150, 220, 0.5)' }}
            >
              Click to reveal meaning
            </div>
          </div>
        </motion.div>

        {/* Back side */}
        <motion.div
          style={{ backfaceVisibility: 'hidden', rotateY: 180 }}
          className={`absolute inset-0 rounded-2xl border backdrop-blur-xl ${style.padding} flex flex-col items-center justify-center overflow-hidden`}
          style={{
            background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(124, 58, 237, 0.05))',
            border: '1px solid rgba(236, 72, 153, 0.25)',
          }}
        >
          {/* Background glow */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity"
            style={{
              background:
                'radial-gradient(circle at bottom left, rgba(236, 72, 153, 0.4), transparent)',
            }}
          />

          <div className="relative z-10 text-center space-y-6 w-full">
            {/* Meaning */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-3xl font-black text-white mb-2">
                {meaning}
              </div>
              <div className="text-xs" style={{ color: 'rgba(160, 150, 220, 0.5)' }}>
                {romaji}
              </div>
            </motion.div>

            {/* Example if available */}
            {example && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="pt-4"
                style={{
                  borderTop: '1px solid rgba(124, 58, 237, 0.2)',
                }}
              >
                <div className="text-xs font-bold text-gray-300 mb-2">
                  Example
                </div>
                <div className="text-sm font-jp text-white mb-2">{example}</div>
                {exampleTranslation && (
                  <div className="text-xs italic text-gray-400">
                    "{exampleTranslation}"
                  </div>
                )}
              </motion.div>
            )}

            {/* Hint */}
            <div
              className="text-xs"
              style={{ color: 'rgba(160, 150, 220, 0.4)' }}
            >
              Click to see Japanese
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
