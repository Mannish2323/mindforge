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

  const base = 'btn';
  const variants: Record<string, string> = {
    primary: 'btn-primary',
    accent: 'btn-accent',
    ghost: 'btn-ghost',
    success: 'btn-success',
    danger: 'btn-danger',
    outline: 'btn-ghost',
    neon: 'btn-neon',
  };
  const sizes: Record<string, string> = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg',
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
      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
}
