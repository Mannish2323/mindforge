'use client';

import React from 'react';
import { cn } from '@/utils';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className,
  id,
}: ToggleProps) {
  const toggleId = id || `toggle-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <label
      htmlFor={toggleId}
      className={cn(
        'flex items-center justify-between gap-4 cursor-pointer select-none group',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {(label || description) && (
        <div className="flex-1 min-w-0">
          {label && (
            <span className="text-sm font-semibold text-ink block">
              {label}
            </span>
          )}
          {description && (
            <span className="text-xs text-ink-muted mt-0.5 block">
              {description}
            </span>
          )}
        </div>
      )}
      <div className="relative flex-shrink-0">
        <input
          type="checkbox"
          id={toggleId}
          checked={checked}
          onChange={(e) => !disabled && onChange(e.target.checked)}
          className="sr-only"
          disabled={disabled}
        />
        <div
          className={cn(
            'w-12 h-7 rounded-full transition-all duration-300 border',
            checked
              ? 'bg-gradient-to-r from-brand to-accent border-brand/30 shadow-[0_0_8px_rgba(109,60,255,0.15)]'
              : 'bg-warm-soft border-edge group-hover:border-edge-hover'
          )}
        />
        <div
          className={cn(
            'absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300',
            checked ? 'left-[calc(100%-26px)]' : 'left-0.5'
          )}
        />
      </div>
    </label>
  );
}
