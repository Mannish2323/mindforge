'use client';

import React, { useRef, useCallback } from 'react';
import { cn } from '@/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'ghost' | 'success' | 'danger' | 'outline' | 'neon';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled,
  onClick,
  ...props
}: ButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      // Ripple effect
      const btn = btnRef.current;
      if (btn) {
        const rect = btn.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
        ripple.className = 'absolute rounded-full bg-white/20 animate-ripple pointer-events-none';
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      }
      onClick?.(e);
    },
    [onClick]
  );

  const base = 'btn relative overflow-hidden transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-pink/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07050D] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:scale-100';
  const variants: Record<string, string> = {
    primary: 'btn-primary shadow-lg shadow-neon-purple/25 hover:shadow-neon-purple/40',
    accent: 'btn-accent shadow-lg shadow-neon-pink/25 hover:shadow-neon-pink/40',
    ghost: 'btn-ghost hover:bg-white/[0.08]',
    success: 'btn-success shadow-lg shadow-emerald-500/25',
    danger: 'btn-danger shadow-lg shadow-rose-500/25',
    outline: 'btn-ghost border border-white/10 hover:border-white/20',
    neon: 'btn-neon shadow-lg shadow-neon-purple/30',
  };
  const sizes: Record<string, string> = {
    sm: 'btn-sm text-xs',
    md: 'text-sm font-semibold',
    lg: 'btn-lg text-base font-bold',
    icon: 'btn-icon',
  };

  return (
    <button
      ref={btnRef}
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      onClick={handleClick}
      {...props}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin text-current" strokeWidth={2.25} /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
}
