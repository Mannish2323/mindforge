import * as React from 'react';
import { cn } from '@/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-semibold text-ink-secondary"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center group">
          {leftIcon && (
            <div className="absolute left-3.5 text-ink-muted group-focus-within:text-brand transition-colors flex items-center justify-center pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            ref={ref}
            id={inputId}
            className={cn(
              "w-full bg-[var(--bg-input)] border border-edge text-ink placeholder:text-ink-muted text-sm md:text-base rounded-xl h-14 py-0 transition-all outline-none focus:border-brand focus:ring-2 focus:ring-brand/30",
              leftIcon ? 'pl-12' : 'px-5',
              rightIcon ? 'pr-12' : 'pr-5',
              error && 'border-red-400 focus:border-red-500 focus:ring-red-500/10 hover:border-red-400',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 text-ink-muted group-focus-within:text-brand transition-colors flex items-center justify-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-[11px] text-red-500 font-medium tracking-wide leading-none pt-0.5">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
