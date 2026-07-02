'use client';

import React from 'react';
import { cn } from '@/utils';

interface AccordionItem {
  id: string;
  title: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
  allowMultiple?: boolean;
}

export function Accordion({ items, className, allowMultiple = false }: AccordionProps) {
  const [openIds, setOpenIds] = React.useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setOpenIds(prev => {
      const next = new Set(allowMultiple ? prev : []);
      if (prev.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className={cn('space-y-2', className)}>
      {items.map((item) => {
        const isOpen = openIds.has(item.id);
        return (
          <div
            key={item.id}
            className={cn(
              'rounded-xl border transition-all duration-300 overflow-hidden',
              isOpen
                ? 'bg-white/[0.03] border-neon-purple/20'
                : 'bg-white/[0.01] border-white/[0.06] hover:border-white/10'
            )}
          >
            <button
              onClick={() => toggle(item.id)}
              className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                {item.icon && (
                  <span className={cn('flex-shrink-0', isOpen ? 'text-neon-purple' : 'text-purple-300/50')}>
                    {item.icon}
                  </span>
                )}
                <span className={cn('text-sm font-semibold', isOpen ? 'text-white' : 'text-purple-200/80')}>
                  {item.title}
                </span>
              </div>
              <svg
                className={cn(
                  'w-4 h-4 flex-shrink-0 transition-transform duration-300 text-purple-300/40',
                  isOpen && 'rotate-180'
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div
              className={cn(
                'transition-all duration-300 ease-out overflow-hidden',
                isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              )}
            >
              <div className="px-5 pb-4 text-sm text-purple-200/60 leading-relaxed">
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
