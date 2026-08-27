'use client';
import { cn } from '@/utils';

interface Tab { id: string; label: string; icon?: React.ReactNode; badge?: string | number; }
interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: 'pill' | 'underline' | 'segment';
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, variant = 'pill', className }: TabsProps) {
  if (variant === 'underline') {
    return (
      <div className={cn('border-b border-edge overflow-x-auto scrollbar-none', className)}>
        <div className="flex gap-0 min-w-max">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                'flex items-center gap-2 px-3 sm:px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer',
                tab.id === activeTab
                  ? 'border-brand text-ink'
                  : 'border-transparent text-ink-muted hover:text-ink'
              )}>
              {tab.icon}
              {tab.label}
              {tab.badge !== undefined && (
                <span className={cn(
                  'text-[10px] font-black px-1.5 py-0.5 rounded-full',
                  tab.id === activeTab ? 'bg-brand/10 text-brand' : 'bg-warm-soft text-ink-muted'
                )}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'segment') {
    return (
      <div className={cn('overflow-x-auto scrollbar-none', className)}>
        <div className="inline-flex bg-warm-soft rounded-xl p-1 gap-0.5 min-w-max">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => onChange(tab.id)}
              className={cn(
                'px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer',
                tab.id === activeTab
                  ? 'bg-white text-ink shadow-sm'
                  : 'text-ink-muted hover:text-ink'
              )}>
              {tab.icon && <span className="inline-block mr-1">{tab.icon}</span>}
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border',
            tab.id === activeTab
              ? 'bg-brand/8 border-brand/15 text-brand shadow-sm'
              : 'text-ink-muted border-transparent hover:text-ink hover:bg-warm-soft'
          )}
        >
          {tab.icon}
          {tab.label}
          {tab.badge !== undefined && (
            <span className="ml-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-black bg-brand/10 text-brand">{tab.badge}</span>
          )}
        </button>
      ))}
    </div>
  );
}
