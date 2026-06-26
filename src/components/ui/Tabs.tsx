'use client';
import { useState } from 'react';
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
      <div className={cn('border-b border-[rgba(139,92,246,0.15)] overflow-x-auto scrollbar-none', className)}>
        <div className="flex gap-0 min-w-max">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                'flex items-center gap-2 px-3 sm:px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap',
                tab.id === activeTab
                  ? 'border-purple-500 text-white'
                  : 'border-transparent text-[rgba(160,150,220,0.5)] hover:text-[rgba(200,196,255,0.8)]'
              )}>
              {tab.icon}
              {tab.label}
              {tab.badge !== undefined && (
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full"
                  style={{ background: tab.id === activeTab ? 'rgba(124,58,237,0.3)' : 'rgba(139,92,246,0.1)', color: tab.id === activeTab ? '#a78bfa' : 'rgba(160,150,220,0.5)' }}>
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
        <div className="tab-nav min-w-max">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => onChange(tab.id)}
              className={cn('tab-item whitespace-nowrap', tab.id === activeTab && 'active')}>
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
            'flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all',
            tab.id === activeTab
              ? 'text-white shadow-sm'
              : 'text-[rgba(160,150,220,0.5)] hover:text-white hover:bg-[rgba(139,92,246,0.1)]'
          )}
          style={tab.id === activeTab ? { background: 'linear-gradient(135deg, rgba(124,58,237,0.35), rgba(124,58,237,0.15))', border: '1px solid rgba(124,58,237,0.4)' } : { border: '1px solid transparent' }}
        >
          {tab.icon}
          {tab.label}
          {tab.badge !== undefined && (
            <span className="ml-0.5 px-1 py-0.5 rounded-full text-[9px] font-black bg-[rgba(124,58,237,0.3)] text-purple-300">{tab.badge}</span>
          )}
        </button>
      ))}
    </div>
  );
}
