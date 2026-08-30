'use client';
import React, { useState } from 'react';

export interface MFInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showPasswordToggle?: boolean;
}

export const MFInput: React.FC<MFInputProps> = ({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  showPasswordToggle = false,
  type = 'text',
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = showPasswordToggle ? (showPassword ? 'text' : 'password') : type;
  
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-semibold text-ink">{label}</label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted">{leftIcon}</div>
        )}
        <input
          type={inputType}
          className={`
            w-full h-14 rounded-2xl border-[1.5px]
            bg-[var(--bg-input)] border-edge text-ink
            placeholder:text-ink-muted
            focus:outline-none focus:ring-2 focus:ring-brand/25 focus:border-brand
            transition-all duration-200
            font-medium text-sm
            ${leftIcon ? 'pl-11' : 'pl-4'}
            ${(rightIcon || showPasswordToggle) ? 'pr-11' : 'pr-4'}
            ${error ? 'border-red-300 focus:ring-red-200' : ''}
            ${className}
          `}
          {...props}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink transition-colors cursor-pointer"
          >
            {showPassword ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </button>
        )}
        {rightIcon && !showPasswordToggle && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-muted">{rightIcon}</div>
        )}
      </div>
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      {hint && !error && <p className="text-xs text-ink-muted">{hint}</p>}
    </div>
  );
};
