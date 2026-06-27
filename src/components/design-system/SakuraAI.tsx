'use client';

import { motion } from 'framer-motion';

interface SakuraAIProps {
  pose?:
    | 'smile'
    | 'wave'
    | 'point-left'
    | 'point-right'
    | 'thinking'
    | 'teaching'
    | 'celebration'
    | 'sad'
    | 'victory'
    | 'chat';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
  className?: string;
}

export function SakuraAI({
  pose = 'smile',
  size = 'md',
  animate = true,
  className = '',
}: SakuraAIProps) {
  const sizes = {
    sm: { width: 80, height: 100 },
    md: { width: 140, height: 180 },
    lg: { width: 200, height: 260 },
    xl: { width: 280, height: 360 },
  };

  const sizeStyle = sizes[size];

  const getPoseAnimation = () => {
    switch (pose) {
      case 'wave':
        return { rotate: [0, -10, 0], transition: { duration: 1.5, repeat: Infinity } };
      case 'point-left':
        return { x: [0, -5, 0], transition: { duration: 1.5, repeat: Infinity } };
      case 'point-right':
        return { x: [0, 5, 0], transition: { duration: 1.5, repeat: Infinity } };
      case 'thinking':
        return { y: [0, -8, 0], transition: { duration: 2, repeat: Infinity } };
      case 'celebration':
        return {
          y: [0, -15, 0],
          rotate: [0, 5, -5, 0],
          transition: { duration: 1, repeat: Infinity },
        };
      case 'victory':
        return { scale: [1, 1.05, 1], transition: { duration: 1.5, repeat: Infinity } };
      default:
        return { y: [0, -5, 0], transition: { duration: 2, repeat: Infinity } };
    }
  };

  return (
    <motion.div
      animate={animate ? getPoseAnimation() : {}}
      className={className}
      style={sizeStyle}
    >
      <svg
        viewBox="0 0 200 260"
        width={sizeStyle.width}
        height={sizeStyle.height}
        className="w-full h-full"
      >
        {/* Hair */}
        <defs>
          <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(124, 58, 237, 0.9)" />
            <stop offset="100%" stopColor="rgba(100, 30, 200, 0.8)" />
          </linearGradient>
          <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F4D4C4" />
            <stop offset="100%" stopColor="#E8C5B5" />
          </linearGradient>
          <linearGradient id="robeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(124, 58, 237, 0.6)" />
            <stop offset="100%" stopColor="rgba(236, 72, 153, 0.4)" />
          </linearGradient>
        </defs>

        {/* Hair back */}
        <path
          d="M 60 40 Q 40 60 40 100 Q 40 140 60 160 L 140 160 Q 160 140 160 100 Q 160 60 140 40 Q 100 20 60 40 Z"
          fill="url(#hairGrad)"
        />

        {/* Head */}
        <circle cx="100" cy="80" r="45" fill="url(#skinGrad)" />

        {/* Eyes background */}
        <circle cx="85" cy="70" r="8" fill="white" />
        <circle cx="115" cy="70" r="8" fill="white" />

        {/* Eyes iris */}
        <circle cx="85" cy="72" r="5" fill="rgba(124, 58, 237, 0.9)" />
        <circle cx="115" cy="72" r="5" fill="rgba(124, 58, 237, 0.9)" />

        {/* Eyes shine */}
        <circle cx="87" cy="70" r="2" fill="white" />
        <circle cx="117" cy="70" r="2" fill="white" />

        {/* Mouth based on pose */}
        {(pose === 'smile' ||
          pose === 'wave' ||
          pose === 'point-left' ||
          pose === 'point-right' ||
          pose === 'celebration' ||
          pose === 'victory') && (
          <path
            d="M 85 95 Q 100 105 115 95"
            stroke="rgba(200, 100, 120, 0.8)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        )}

        {pose === 'thinking' && (
          <>
            <path
              d="M 85 95 Q 100 100 115 95"
              stroke="rgba(200, 100, 120, 0.5)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            <circle cx="65" cy="60" r="3" fill="rgba(124, 58, 237, 0.4)" />
            <circle cx="60" cy="50" r="2.5" fill="rgba(124, 58, 237, 0.3)" />
          </>
        )}

        {pose === 'sad' && (
          <path
            d="M 85 105 Q 100 95 115 105"
            stroke="rgba(200, 100, 120, 0.8)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        )}

        {pose === 'chat' && (
          <>
            <circle cx="88" cy="100" r="1.5" fill="rgba(124, 58, 237, 0.8)" />
            <circle cx="100" cy="102" r="1.5" fill="rgba(124, 58, 237, 0.8)" />
            <circle cx="112" cy="100" r="1.5" fill="rgba(124, 58, 237, 0.8)" />
          </>
        )}

        {/* Blush */}
        <circle cx="65" cy="85" r="6" fill="rgba(236, 72, 153, 0.2)" />
        <circle cx="135" cy="85" r="6" fill="rgba(236, 72, 153, 0.2)" />

        {/* Hair ribbons/bows */}
        <circle cx="55" cy="35" r="8" fill="rgba(236, 72, 153, 0.7)" />
        <circle cx="145" cy="35" r="8" fill="rgba(236, 72, 153, 0.7)" />

        {/* Body - Robe */}
        <path
          d="M 60 125 L 50 180 Q 50 220 70 240 L 130 240 Q 150 220 150 180 L 140 125 Z"
          fill="url(#robeGrad)"
          stroke="rgba(124, 58, 237, 0.5)"
          strokeWidth="1"
        />

        {/* Sleeves */}
        <ellipse cx="40" cy="140" rx="12" ry="35" fill="rgba(124, 58, 237, 0.5)" />
        <ellipse cx="160" cy="140" rx="12" ry="35" fill="rgba(124, 58, 237, 0.5)" />

        {/* Arms based on pose */}
        {pose === 'wave' && (
          <>
            <path
              d="M 160 140 L 170 120 L 175 135"
              stroke="url(#skinGrad)"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
            />
            <circle cx="175" cy="135" r="4" fill="url(#skinGrad)" />
          </>
        )}

        {pose === 'point-right' && (
          <>
            <path
              d="M 160 140 L 180 130"
              stroke="url(#skinGrad)"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
            />
            <circle cx="180" cy="130" r="4" fill="url(#skinGrad)" />
          </>
        )}

        {pose === 'point-left' && (
          <>
            <path
              d="M 40 140 L 20 130"
              stroke="url(#skinGrad)"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
            />
            <circle cx="20" cy="130" r="4" fill="url(#skinGrad)" />
          </>
        )}

        {/* Decorative glow */}
        <circle
          cx="100"
          cy="130"
          r="70"
          fill="none"
          stroke="rgba(236, 72, 153, 0.1)"
          strokeWidth="1"
          strokeDasharray="5 5"
          opacity="0.5"
        />
      </svg>
    </motion.div>
  );
}
