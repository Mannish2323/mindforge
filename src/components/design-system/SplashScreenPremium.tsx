'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface SplashScreenPremiumProps {
  onComplete?: () => void;
  duration?: number;
}

export function SplashScreenPremium({
  onComplete,
  duration = 3000,
}: SplashScreenPremiumProps) {
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsComplete(true);
      onComplete?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  if (isComplete) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, delay: 1.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgb(9, 7, 26) 0%, rgb(14, 11, 34) 50%, rgb(19, 9, 48) 100%)',
      }}
    >
      {/* Floating petals */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-pink-500 opacity-30"
          initial={{
            x: Math.random() * 400 - 200,
            y: Math.random() * 400 - 200,
            scale: 0,
          }}
          animate={{
            x: Math.random() * 800 - 400,
            y: Math.random() * 800 - 400,
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 3,
            delay: i * 0.2,
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2.69l3.66 7.41h8.15l-6.59 4.78 2.52 8.12L12 20.82l-6.74 4.18 2.52-8.12-6.59-4.78h8.15L12 2.69z" />
          </svg>
        </motion.div>
      ))}

      {/* Main logo container */}
      <motion.div
        initial={{ scale: 0, opacity: 0, rotate: -20 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{
          type: 'spring',
          duration: 1,
          bounce: 0.5,
        }}
        className="relative z-10 flex flex-col items-center gap-6"
      >
        {/* Animated logo */}
        <motion.div
          className="relative w-48 h-48"
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Glow background */}
          <motion.div
            className="absolute inset-0 rounded-full blur-3xl opacity-50"
            style={{
              background: 'radial-gradient(circle, rgba(124, 58, 237, 0.4), transparent)',
            }}
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />

          {/* Logo SVG - Velmorth */}
          <motion.svg
            width="192"
            height="192"
            viewBox="0 0 200 200"
            className="relative z-10"
            animate={{ rotate: [0, 5, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          >
            {/* Book */}
            <motion.g
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {/* Book pages */}
              <path
                d="M 50 60 L 50 140 Q 50 150 60 150 L 140 150 Q 150 150 150 140 L 150 60 Z"
                fill="rgba(200, 196, 255, 0.1)"
                stroke="rgba(124, 58, 237, 0.6)"
                strokeWidth="2"
              />
              <path
                d="M 70 70 L 70 140"
                stroke="rgba(124, 58, 237, 0.4)"
                strokeWidth="1"
              />

              {/* Left page */}
              <rect
                x="55"
                y="65"
                width="30"
                height="75"
                fill="rgba(236, 72, 153, 0.15)"
                stroke="rgba(236, 72, 153, 0.3)"
                strokeWidth="1"
              />

              {/* Right page */}
              <rect
                x="100"
                y="65"
                width="35"
                height="75"
                fill="rgba(124, 58, 237, 0.15)"
                stroke="rgba(124, 58, 237, 0.3)"
                strokeWidth="1"
              />

              {/* Spine glow */}
              <line
                x1="100"
                y1="60"
                x2="100"
                y2="150"
                stroke="rgba(124, 58, 237, 0.4)"
                strokeWidth="2"
              />
            </motion.g>

            {/* Torii gate */}
            <motion.g
              animate={{ scale: [1, 1.05, 1] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: 0.3,
              }}
            >
              {/* Vertical pillars */}
              <rect
                x="35"
                y="80"
                width="6"
                height="60"
                fill="rgba(124, 58, 237, 0.7)"
              />
              <rect
                x="159"
                y="80"
                width="6"
                height="60"
                fill="rgba(124, 58, 237, 0.7)"
              />

              {/* Top beam */}
              <rect
                x="25"
                y="75"
                width="150"
                height="8"
                rx="4"
                fill="rgba(124, 58, 237, 0.8)"
              />

              {/* Top-top beam */}
              <rect
                x="20"
                y="65"
                width="160"
                height="6"
                rx="3"
                fill="rgba(236, 72, 153, 0.6)"
              />
            </motion.g>

            {/* Kanji character (学) */}
            <motion.text
              x="100"
              y="55"
              fontSize="28"
              fontWeight="900"
              textAnchor="middle"
              fill="url(#petalGradient)"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              学
            </motion.text>

            {/* Cherry blossoms */}
            <motion.g
              animate={{ rotate: 360 }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{ transformOrigin: '100px 100px' }}
            >
              <circle cx="130" cy="50" r="3" fill="rgba(236, 72, 153, 0.8)" />
              <circle cx="150" cy="80" r="2.5" fill="rgba(236, 72, 153, 0.6)" />
              <circle cx="145" cy="120" r="2" fill="rgba(236, 72, 153, 0.5)" />
            </motion.g>

            <defs>
              <linearGradient
                id="petalGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="rgba(124, 58, 237, 1)" />
                <stop offset="100%" stopColor="rgba(236, 72, 153, 1)" />
              </linearGradient>
            </defs>
          </motion.svg>
        </motion.div>

        {/* Brand name */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center"
        >
          <h1 className="font-black text-white text-4xl tracking-tight">
            Velmorth
          </h1>
          <p
            className="text-sm font-light mt-2 tracking-widest"
            style={{ color: 'rgba(167, 139, 250, 0.6)' }}
          >
            ベルモルス
          </p>
        </motion.div>

        {/* Loading dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex gap-2"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{ background: 'rgba(124, 58, 237, 0.6)' }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-center text-xs tracking-widest uppercase mt-2"
          style={{ color: 'rgba(167, 139, 250, 0.4)' }}
        >
          Learn Japanese • Master Your Future
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
