'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ProgressRingProps {
  percentage: number;
  label: string;
  color?: string;
  backgroundColor?: string;
  size?: 'sm' | 'md' | 'lg';
  children?: ReactNode;
  animated?: boolean;
}

export function ProgressRing({
  percentage,
  label,
  color = '#7c3aed',
  backgroundColor = 'rgba(139, 92, 246, 0.1)',
  size = 'md',
  children,
  animated = true,
}: ProgressRingProps) {
  const sizes = {
    sm: { radius: 35, width: 70, height: 70, strokeWidth: 4, fontSize: 'text-xs' },
    md: {
      radius: 55,
      width: 120,
      height: 120,
      strokeWidth: 5,
      fontSize: 'text-sm',
    },
    lg: {
      radius: 80,
      width: 180,
      height: 180,
      strokeWidth: 6,
      fontSize: 'text-base',
    },
  };

  const sizeStyle = sizes[size];
  const circumference = 2 * Math.PI * sizeStyle.radius;
  const strokeDashoffset =
    circumference - (Math.min(percentage, 100) / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative inline-flex items-center justify-center">
        {/* Background glow */}
        {animated && (
          <motion.div
            className="absolute inset-0 rounded-full blur-xl opacity-40"
            style={{
              background: `radial-gradient(circle, ${color}, transparent)`,
            }}
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          />
        )}

        {/* SVG Circle */}
        <svg
          width={sizeStyle.width}
          height={sizeStyle.height}
          style={{ transform: 'rotate(-90deg)' }}
        >
          {/* Background circle */}
          <circle
            cx={sizeStyle.width / 2}
            cy={sizeStyle.height / 2}
            r={sizeStyle.radius}
            fill="none"
            stroke={backgroundColor}
            strokeWidth={sizeStyle.strokeWidth}
          />

          {/* Progress circle */}
          <motion.circle
            cx={sizeStyle.width / 2}
            cy={sizeStyle.height / 2}
            r={sizeStyle.radius}
            fill="none"
            stroke={color}
            strokeWidth={sizeStyle.strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            strokeLinecap="round"
            initial={animated ? { strokeDashoffset: circumference } : undefined}
            animate={
              animated
                ? { strokeDashoffset: strokeDashoffset }
                : { strokeDashoffset: strokeDashoffset }
            }
            transition={animated ? { duration: 1.5, ease: 'easeInOut' } : {}}
          />

          {/* Glow effect on progress */}
          <motion.circle
            cx={sizeStyle.width / 2}
            cy={sizeStyle.height / 2}
            r={sizeStyle.radius}
            fill="none"
            stroke={color}
            strokeWidth={sizeStyle.strokeWidth * 2}
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            strokeLinecap="round"
            opacity="0"
            initial={animated ? { strokeDashoffset: circumference } : undefined}
            animate={
              animated
                ? {
                    strokeDashoffset: strokeDashoffset,
                    opacity: [0.6, 0, 0],
                  }
                : {}
            }
            transition={animated ? { duration: 1.5, ease: 'easeInOut' } : {}}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {children ? (
            children
          ) : (
            <>
              <motion.div
                className={`${sizeStyle.fontSize} font-black text-white`}
                initial={animated ? { scale: 0 } : undefined}
                animate={animated ? { scale: 1 } : undefined}
                transition={animated ? { delay: 0.5, duration: 0.5 } : {}}
              >
                {Math.round(percentage)}%
              </motion.div>
            </>
          )}
        </div>
      </div>

      {/* Label */}
      <motion.div
        className="text-center"
        initial={animated ? { opacity: 0, y: 10 } : undefined}
        animate={animated ? { opacity: 1, y: 0 } : undefined}
        transition={animated ? { delay: 0.3 } : {}}
      >
        <div
          className="text-xs font-bold"
          style={{ color: 'rgba(160, 150, 220, 0.6)' }}
        >
          {label}
        </div>
      </motion.div>
    </div>
  );
}
