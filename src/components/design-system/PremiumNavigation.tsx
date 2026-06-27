'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface NavItem {
  icon: ReactNode;
  label: string;
  href: string;
  badge?: string | number;
  active?: boolean;
}

interface PremiumNavigationProps {
  items: NavItem[];
  onSelect?: (href: string) => void;
  variant?: 'sidebar' | 'topbar';
}

export function PremiumNavigation({
  items,
  onSelect,
  variant = 'sidebar',
}: PremiumNavigationProps) {
  if (variant === 'topbar') {
    return (
      <div
        className="flex items-center gap-1 overflow-x-auto scrollbar-none"
        style={{
          background: 'rgba(17, 12, 30, 0.4)',
          borderBottom: '1px solid rgba(139, 92, 246, 0.1)',
        }}
      >
        {items.map((item) => (
          <motion.button
            key={item.href}
            onClick={() => onSelect?.(item.href)}
            className="relative px-4 py-3 text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2"
            style={{
              color: item.active ? '#fff' : 'rgba(160, 150, 220, 0.6)',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {item.icon}
            {item.label}
            {item.badge && (
              <span
                className="text-xs font-black px-1.5 py-0.5 rounded-full"
                style={{
                  background: 'rgba(236, 72, 153, 0.2)',
                  color: '#ff69b4',
                }}
              >
                {item.badge}
              </span>
            )}
            {item.active && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-1 rounded-t-full"
                style={{
                  background: 'linear-gradient(90deg, #7c3aed, #ec4899)',
                }}
                layoutId="activeIndicator"
              />
            )}
          </motion.button>
        ))}
      </div>
    );
  }

  // Sidebar variant
  return (
    <div
      className="space-y-1"
      style={{
        background: 'rgba(17, 12, 30, 0.2)',
      }}
    >
      {items.map((item, i) => (
        <motion.button
          key={item.href}
          onClick={() => onSelect?.(item.href)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative group text-left"
          style={{
            background: item.active
              ? 'rgba(124, 58, 237, 0.15)'
              : 'transparent',
            borderLeft: item.active
              ? '3px solid #7c3aed'
              : '3px solid transparent',
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all"
            style={{
              background: item.active
                ? 'rgba(236, 72, 153, 0.2)'
                : 'rgba(139, 92, 246, 0.1)',
              color: item.active ? '#ec4899' : 'rgba(160, 150, 220, 0.6)',
            }}
          >
            {item.icon}
          </div>

          <div className="flex-1 min-w-0">
            <div
              className="text-sm font-bold truncate"
              style={{ color: item.active ? '#fff' : 'rgba(160, 150, 220, 0.7)' }}
            >
              {item.label}
            </div>
          </div>

          {item.badge && (
            <div
              className="text-xs font-black px-2 py-1 rounded-full flex-shrink-0"
              style={{
                background: 'rgba(236, 72, 153, 0.15)',
                color: '#ff69b4',
              }}
            >
              {item.badge}
            </div>
          )}

          {item.active && (
            <ChevronRight className="w-4 h-4 flex-shrink-0 text-purple-400" />
          )}

          {/* Glow effect on hover */}
          <div
            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-40 transition-opacity pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(124, 58, 237, 0.2), transparent)',
            }}
          />
        </motion.button>
      ))}
    </div>
  );
}
