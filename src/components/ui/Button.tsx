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
      onClick?.(e);
    },
    [onClick]
  );

  const base = 'btn relative select-none font-heading transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none';
  const variants: Record<string, string> = {
    primary: 'btn-primary',
    accent: 'btn-accent',
    ghost: 'btn-ghost',
    success: 'btn-success',
    danger: 'btn-danger',
    outline: 'btn-ghost',
    neon: 'btn-primary',
  };
  const sizes: Record<string, string> = {
    sm: 'btn-sm',
    md: 'text-sm font-bold',
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
      {loading ? <Loader2 className="w-4 h-4 animate-spin text-current" strokeWidth={2.25} /> : leftIcon}
      <span>{children}</span>
      {!loading && rightIcon}
    </button>
  );
}
