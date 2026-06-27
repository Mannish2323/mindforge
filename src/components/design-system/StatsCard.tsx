'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

interface StatsCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'purple' | 'pink' | 'blue' | 'green' | 'orange';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  onClick?: () => void;
}

export function StatsCard({
  icon,
  label,
  value,
  subtitle,
  trend,
  color = 'purple',
  size = 'md',
  animated = true,
  onClick,
}: StatsCardProps) {
  const colorMap = {
    purple: {
      bg: 'rgba(124, 58, 237, 0.08)',
      border: 'rgba(124, 58, 237, 0.25)',
      accent: '#7c3aed',
      icon: 'rgba(124, 58, 237, 0.15)',
    },
    pink: {
      bg: 'rgba(236, 72, 153, 0.08)',
      border: 'rgba(236, 72, 153, 0.25)',
      accent: '#ec4899',
      icon: 'rgba(236, 72, 153, 0.15)',
    },
    blue: {
      bg: 'rgba(59, 130, 246, 0.08)',
      border: 'rgba(59, 130, 246, 0.25)',
      accent: '#3b82f6',
      icon: 'rgba(59, 130, 246, 0.15)',
    },
    green: {
      bg: 'rgba(34, 197, 94, 0.08)',
      border: 'rgba(34, 197, 94, 0.25)',
      accent: '#22c55e',
      icon: 'rgba(34, 197, 94, 0.15)',
    },
    orange: {
      bg: 'rgba(245, 158, 11, 0.08)',
      border: 'rgba(245, 158, 11, 0.25)',
      accent: '#f59e0b',
      icon: 'rgba(245, 158, 11, 0.15)',
    },
  };

  const sizeStyles = {
    sm: { padding: 'p-3', label: 'text-xs', value: 'text-lg', icon: 'w-5 h-5' },
    md: { padding: 'p-4', label: 'text-sm', value: 'text-2xl', icon: 'w-6 h-6' },
    lg: { padding: 'p-6', label: 'text-base', value: 'text-4xl', icon: 'w-8 h-8' },
  };

  const colors = colorMap[color];
  const styles = sizeStyles[size];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: { type: 'spring', duration: 0.6, bounce: 0.4 },
    },
  };

  return (
    <motion.div
      initial={animated ? 'hidden' : 'visible'}
      animate="visible"
      variants={containerVariants}
      onClick={onClick}
      className={`${styles.padding} rounded-xl border transition-all relative overflow-hidden group cursor-pointer`}
      style={{
        background: colors.bg,
        borderColor: colors.border,
      }}
      whileHover={{ scale: 1.05, translateY: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Glow background */}
      <motion.div
        className="absolute -inset-full rounded-full opacity-0 group-hover:opacity-30 transition-opacity"
        style={{
          background: `radial-gradient(circle, ${colors.accent}40, transparent)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <motion.div
          className={`${styles.icon} rounded-lg flex items-center justify-center mb-2 flex-shrink-0`}
          style={{ background: colors.icon, color: colors.accent }}
          variants={iconVariants}
        >
          {icon}
        </motion.div>

        {/* Label */}
        <div
          className={`${styles.label} font-bold mb-1 truncate`}
          style={{ color: 'rgba(160, 150, 220, 0.6)' }}
        >
          {label}
        </div>

        {/* Value */}
        <div className={`${styles.value} font-black text-white mb-1 truncate`}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>

        {/* Subtitle + Trend */}
        <div className="flex items-center justify-between gap-2">
          {subtitle && (
            <div className="text-xs truncate" style={{ color: 'rgba(160, 150, 220, 0.4)' }}>
              {subtitle}
            </div>
          )}

          {trend && (
            <motion.div
              className="flex items-center gap-1 ml-auto flex-shrink-0"
              animate={{
                y: [0, -2, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              <TrendingUp
                className="w-3 h-3"
                style={{
                  color: trend.isPositive ? '#22c55e' : '#ef4444',
                  transform: trend.isPositive ? 'none' : 'rotate(180deg)',
                }}
              />
              <span
                className="text-xs font-bold"
                style={{
                  color: trend.isPositive ? '#22c55e' : '#ef4444',
                }}
              >
                {Math.abs(trend.value)}%
              </span>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
