'use client';

import React from 'react';
import { cn } from '@/utils';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  level?: number;
  showLevel?: boolean;
}

export function Avatar({
  src,
  name,
  size = 'md',
  level,
  showLevel = false,
  className,
  ...props
}: AvatarProps) {
  const sizes: Record<string, { container: string; text: string; levelBadge: string }> = {
    sm: { container: 'w-8 h-8', text: 'text-xs', levelBadge: 'text-[7px] w-4 h-4 -bottom-0.5 -right-0.5' },
    md: { container: 'w-10 h-10', text: 'text-sm', levelBadge: 'text-[8px] w-5 h-5 -bottom-0.5 -right-0.5' },
    lg: { container: 'w-14 h-14', text: 'text-lg', levelBadge: 'text-[9px] w-6 h-6 -bottom-1 -right-1' },
    xl: { container: 'w-20 h-20', text: 'text-2xl', levelBadge: 'text-[10px] w-7 h-7 -bottom-1 -right-1' },
  };

  const initial = name?.[0]?.toUpperCase() || '?';
  const sizeConfig = sizes[size];

  return (
    <div className={cn('relative inline-flex', className)} {...props}>
      <div
        className={cn(
          sizeConfig.container,
          'rounded-full bg-cream flex items-center justify-center font-bold text-ink shadow-sm border border-edge relative overflow-hidden flex-shrink-0',
          sizeConfig.text
        )}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={name || 'avatar'} className="w-full h-full object-cover" />
        ) : (
          <span>{initial}</span>
        )}
      </div>
      {showLevel && level && (
        <div
          className={cn(
            'absolute rounded-full bg-card border-2 border-brand flex items-center justify-center font-bold text-brand font-heading shadow-sm',
            sizeConfig.levelBadge
          )}
        >
          {level}
        </div>
      )}
    </div>
  );
}
