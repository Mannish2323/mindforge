import { cn } from '@/utils';
import { BookOpen, Search, AlertCircle, Wifi, Lock } from 'lucide-react';

type EmptyVariant = 'empty' | 'search' | 'error' | 'offline' | 'locked' | 'loading';

interface EmptyStateProps {
  variant?: EmptyVariant;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

const DEFAULTS: Record<EmptyVariant, { icon: React.ReactNode; title: string; description: string }> = {
  empty:   { icon: <BookOpen className="w-10 h-10" />, title: 'Nothing here yet', description: 'Start learning to see your progress here.' },
  search:  { icon: <Search className="w-10 h-10" />, title: 'No results found', description: 'Try a different search term or filter.' },
  error:   { icon: <AlertCircle className="w-10 h-10" />, title: 'Something went wrong', description: 'An error occurred. Please try again.' },
  offline: { icon: <Wifi className="w-10 h-10" />, title: 'You are offline', description: 'Check your internet connection and try again.' },
  locked:  { icon: <Lock className="w-10 h-10" />, title: 'Premium required', description: 'Upgrade your plan to unlock this feature.' },
  loading: { icon: <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />, title: 'Loading…', description: 'Please wait a moment.' },
};

export function EmptyState({ variant = 'empty', title, description, action, className, icon }: EmptyStateProps) {
  const defaults = DEFAULTS[variant];
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-6 text-center', className)}>
      <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5 text-[rgba(139,92,246,0.5)]"
        style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)' }}>
        {icon || defaults.icon}
      </div>
      <h3 className="text-base font-black text-white mb-2">{title || defaults.title}</h3>
      <p className="text-sm text-[rgba(160,150,220,0.6)] max-w-xs leading-relaxed">{description || defaults.description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
