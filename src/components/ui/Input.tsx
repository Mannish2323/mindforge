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
            className="block text-[10px] font-bold text-purple-300/40 uppercase tracking-widest"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center group">
          {leftIcon && (
            <div className="absolute left-3.5 text-purple-300/40 group-focus-within:text-purple-400 transition-colors flex items-center justify-center pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            ref={ref}
            id={inputId}
            className={cn(
              "w-full bg-[#0a0815] border border-purple-900/20 hover:border-purple-800/40 text-white placeholder-purple-300/20 text-sm md:text-base rounded-xl h-14 py-0 transition-all outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/20",
              leftIcon ? 'pl-12' : 'px-5',
              rightIcon ? 'pr-12' : 'pr-5',
              error && 'border-red-500/40 focus:border-red-500/60 focus:ring-red-500/10 hover:border-red-500/30',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 text-purple-300/40 group-focus-within:text-purple-400 transition-colors flex items-center justify-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-[11px] text-red-400/90 font-medium tracking-wide leading-none pt-0.5">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
