'use client';

import React from 'react';
import { cn } from '@/utils';

type SkeletonVariant = 'text' | 'title' | 'avatar' | 'card' | 'button' | 'circle' | 'rect';

interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  className?: string;
  count?: number;
}

export function Skeleton({
  variant = 'text',
  width,
  height,
  className,
  count = 1,
}: SkeletonProps) {
  const variantStyles: Record<SkeletonVariant, string> = {
    text: 'h-4 rounded-lg',
    title: 'h-7 rounded-lg w-2/3',
    avatar: 'w-12 h-12 rounded-xl',
    card: 'h-40 rounded-card-lg',
    button: 'h-14 rounded-xl',
    circle: 'w-10 h-10 rounded-full',
    rect: 'h-20 rounded-xl',
  };

  const items = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className={cn(
        'relative overflow-hidden bg-warm-soft',
        variantStyles[variant],
        className
      )}
      style={{ width, height }}
    >
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer"
      />
    </div>
  ));

  return count === 1 ? items[0] : <div className="space-y-3">{items}</div>;
}

/**
 * Full card skeleton with avatar, title, and body lines
 */
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('bg-white border border-edge rounded-card-lg p-5 space-y-4 shadow-[0_2px_12px_rgba(0,0,0,0.06)]', className)}>
      <div className="flex items-center gap-3">
        <Skeleton variant="avatar" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" className="w-1/2" />
          <Skeleton variant="text" className="w-1/3 h-3" />
        </div>
      </div>
      <Skeleton variant="text" count={3} />
    </div>
  );
}

/**
 * Page-level skeleton with multiple card skeletons
 */
export function PageSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <Skeleton variant="title" />
        <Skeleton variant="text" className="w-1/2" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}
