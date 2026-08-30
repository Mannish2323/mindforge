'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils';
import { CheckCircle2, XCircle, Zap, Flame, Trophy, Info } from 'lucide-react';

export type MFToastType = 'success' | 'error' | 'xp' | 'streak' | 'achievement' | 'info';

export interface MFToastData {
  id: string;
  type: MFToastType;
  message: string;
  subMessage?: string;
  amount?: number;   // for XP toasts
  duration?: number; // ms, default 3500
}

interface MFToastItemProps extends MFToastData {
  onDismiss: (id: string) => void;
}

const toastConfig: Record<MFToastType, {
  bg: string; border: string; icon: React.ReactNode; iconBg: string;
}> = {
  success: {
    bg: 'bg-mint-light',
    border: 'border-mint',
    icon: <CheckCircle2 className="w-5 h-5 text-mint" />,
    iconBg: 'bg-mint-light',
  },
  error: {
    bg: 'bg-coral-light',
    border: 'border-coral',
    icon: <XCircle className="w-5 h-5 text-coral" />,
    iconBg: 'bg-coral-light',
  },
  xp: {
    bg: 'bg-yellow-light',
    border: 'border-yellow',
    icon: <Zap className="w-5 h-5 text-orange fill-orange" />,
    iconBg: 'bg-orange-light',
  },
  streak: {
    bg: 'bg-orange-light',
    border: 'border-orange',
    icon: <Flame className="w-5 h-5 text-orange fill-orange" />,
    iconBg: 'bg-orange-light',
  },
  achievement: {
    bg: 'bg-lavender-light',
    border: 'border-lavender',
    icon: <Trophy className="w-5 h-5 text-lavender" />,
    iconBg: 'bg-lavender-light',
  },
  info: {
    bg: 'bg-sky-light',
    border: 'border-sky',
    icon: <Info className="w-5 h-5 text-sky" />,
    iconBg: 'bg-sky-light',
  },
};

function MFToastItem({ id, type, message, subMessage, amount, duration = 3500, onDismiss }: MFToastItemProps) {
  const config = toastConfig[type];

  useEffect(() => {
    const t = setTimeout(() => onDismiss(id), duration);
    return () => clearTimeout(t);
  }, [id, duration, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ x: 100, opacity: 0, scale: 0.9 }}
      animate={{ x: 0, opacity: 1, scale: 1 }}
      exit={{ x: 100, opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      onClick={() => onDismiss(id)}
      className={cn(
        'relative flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 shadow-lg cursor-pointer min-w-[260px] max-w-[320px]',
        config.bg, config.border
      )}
      role="alert"
      aria-live="assertive"
    >
      {/* Icon */}
      <div className={cn('p-2 rounded-xl flex-shrink-0', config.iconBg)}>
        {config.icon}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-ink truncate">{message}</p>
          {type === 'xp' && amount && (
            <span className="text-xs font-extrabold text-orange bg-yellow px-1.5 py-0.5 rounded-full shrink-0">
              +{amount} XP
            </span>
          )}
        </div>
        {subMessage && (
          <p className="text-xs text-ink-muted font-medium mt-0.5 truncate">{subMessage}</p>
        )}
      </div>

      {/* Timer bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-1 rounded-full bg-current opacity-20"
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: duration / 1000, ease: 'linear' }}
      />
    </motion.div>
  );
}

// ─── Toast Container + Hook ──────────────────────────────────────────────────

interface ToastContextValue {
  toasts: MFToastData[];
  addToast: (toast: Omit<MFToastData, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextValue>({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
});

export function MFToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<MFToastData[]>([]);

  const addToast = React.useCallback((toast: Omit<MFToastData, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev.slice(-3), { ...toast, id }]); // max 4 visible
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div
        className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none"
        aria-label="Notifications"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map(toast => (
            <div key={toast.id} className="pointer-events-auto">
              <MFToastItem {...toast} onDismiss={removeToast} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useMFToast() {
  const ctx = React.useContext(ToastContext);

  const toast = React.useMemo(() => ({
    success: (message: string, sub?: string) =>
      ctx.addToast({ type: 'success', message, subMessage: sub }),
    error: (message: string, sub?: string) =>
      ctx.addToast({ type: 'error', message, subMessage: sub }),
    xp: (amount: number, message = `+${amount} XP earned!`) =>
      ctx.addToast({ type: 'xp', message, amount, duration: 2500 }),
    streak: (days: number) =>
      ctx.addToast({ type: 'streak', message: `${days}-day streak!`, subMessage: 'Keep it going!' }),
    achievement: (title: string, desc?: string) =>
      ctx.addToast({ type: 'achievement', message: title, subMessage: desc }),
    info: (message: string) =>
      ctx.addToast({ type: 'info', message }),
  }), [ctx]);

  return toast;
}
