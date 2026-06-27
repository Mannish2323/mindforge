'use client';

import { motion } from 'framer-motion';

interface AchievementBadgeProps {
  title: string;
  description?: string;
  icon: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked?: boolean;
  progress?: number;
  maxProgress?: number;
  size?: 'sm' | 'md' | 'lg';
  showAnimation?: boolean;
}

export function AchievementBadge({
  title,
  description,
  icon,
  rarity = 'common',
  unlocked = false,
  progress,
  maxProgress,
  size = 'md',
  showAnimation = false,
}: AchievementBadgeProps) {
  const rarityColors: Record<string, { bg: string; border: string; glow: string }> =
    {
      common: {
        bg: 'rgba(108, 117, 125, 0.2)',
        border: '#6c757d',
        glow: 'rgba(108, 117, 125, 0.3)',
      },
      rare: {
        bg: 'rgba(34, 197, 94, 0.15)',
        border: '#22c55e',
        glow: 'rgba(34, 197, 94, 0.4)',
      },
      epic: {
        bg: 'rgba(124, 58, 237, 0.15)',
        border: '#7c3aed',
        glow: 'rgba(124, 58, 237, 0.4)',
      },
      legendary: {
        bg: 'rgba(245, 158, 11, 0.15)',
        border: '#f59e0b',
        glow: 'rgba(245, 158, 11, 0.4)',
      },
    };

  const sizes = {
    sm: { container: 'w-16 h-16', icon: 'text-3xl', title: 'text-xs', desc: 'text-[9px]' },
    md: { container: 'w-24 h-24', icon: 'text-5xl', title: 'text-sm', desc: 'text-xs' },
    lg: { container: 'w-32 h-32', icon: 'text-6xl', title: 'text-base', desc: 'text-sm' },
  };

  const colors = rarityColors[rarity];
  const sizeStyle = sizes[size];

  const containerVariants = {
    hidden: { scale: 0, rotate: -180, opacity: 0 },
    visible: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: { type: 'spring' as const, bounce: 0.5 },
    },
  };

  const glowVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: [0.3, 0.6, 0.3],
      transition: { duration: 2, repeat: Infinity as const },
    },
  };

  const progressPercentage = maxProgress && progress ? (progress / maxProgress) * 100 : 0;

  return (
    <motion.div
      initial={showAnimation ? 'hidden' : 'visible'}
      animate="visible"
      variants={containerVariants}
      className="relative group"
    >
      {/* Badge container */}
      <div
        className={`${sizeStyle.container} relative flex items-center justify-center rounded-2xl cursor-pointer transition-transform`}
        style={{
          background: colors.bg,
          border: `2px solid ${colors.border}`,
        }}
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-30"
          style={{ background: `radial-gradient(circle, ${colors.glow}, transparent)` }}
          animate={unlocked && showAnimation ? 'visible' : 'hidden'}
          variants={glowVariants}
        />

        {/* Icon */}
        <div className={`${sizeStyle.icon} relative z-10`}>{icon}</div>

        {/* Lock overlay if not unlocked */}
        {!unlocked && (
          <div className="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center backdrop-blur-sm">
            <span className="text-xl">🔒</span>
          </div>
        )}

        {/* Progress ring if applicable */}
        {progress !== undefined && maxProgress && (
          <svg
            className="absolute inset-0 w-full h-full transform -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(139, 92, 246, 0.1)"
              strokeWidth="3"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={colors.border}
              strokeWidth="3"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progressPercentage / 100)}`}
              transition={{ duration: 1 }}
            />
          </svg>
        )}
      </div>

      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        whileHover={{ opacity: 1, y: 0 }}
        className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 pointer-events-none group-hover:pointer-events-auto z-50"
      >
        <div
          className="px-3 py-2 rounded-lg backdrop-blur-xl whitespace-nowrap text-center"
          style={{
            background: 'rgba(17, 12, 30, 0.9)',
            border: `1px solid ${colors.border}`,
          }}
        >
          <div className={`${sizeStyle.title} font-bold text-white`}>{title}</div>
          {description && (
            <div className={`${sizeStyle.desc} text-gray-300 mt-1`}>{description}</div>
          )}
          {progress !== undefined && maxProgress && (
            <div className="text-xs text-gray-400 mt-1">
              {progress}/{maxProgress}
            </div>
          )}
        </div>

        {/* Arrow */}
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 transform rotate-45"
          style={{
            background: 'rgba(17, 12, 30, 0.9)',
            border: `1px solid ${colors.border}`,
          }}
        />
      </motion.div>
    </motion.div>
  );
}
