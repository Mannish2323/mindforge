'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PenLine, Mic, RotateCcw, Medal } from 'lucide-react';
import Link from 'next/link';

export function QuickActions() {
  const actions = [
    { label: 'Script Lab', path: '/script', icon: PenLine, color: 'var(--primary, #ff9800)', bg: 'rgba(255, 152, 0, 0.08)' },
    { label: 'Speak Mode', path: '/speak', icon: Mic, color: 'var(--accent-ai, #00acc1)', bg: 'rgba(0, 172, 193, 0.08)' },
    { label: 'Review Cards', path: '/review', icon: RotateCcw, color: 'var(--gem, #9c27b0)', bg: 'rgba(156, 39, 176, 0.08)' },
    { label: 'JLPT Path', path: '/jlpt', icon: Medal, color: 'var(--xp-gold, #ffc107)', bg: 'rgba(255, 193, 7, 0.08)' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <h3 style={{
        fontSize: '11px',
        fontWeight: 800,
        color: 'var(--text-secondary, #b3b3b9)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        margin: 0
      }}>Quick Actions</h3>
      <div className="quick-actions-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
        {actions.map((item, idx) => {
          const Icon = item.icon;

          return (
            <Link key={item.label} href={item.path} style={{ textDecoration: 'none' }}>
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35 + idx * 0.04 }}
                whileHover={{ y: -4, transition: { duration: 0.15 } }}
                whileTap={{ scale: 0.95 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 6px',
                  borderRadius: '16px',
                  background: item.bg,
                  border: '1px solid var(--border-strong, #2d2d34)',
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '12px',
                  background: 'var(--surface-3, #3a3a42)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: item.color,
                }}>
                  <Icon size={18} />
                </div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary, #fff)' }}>{item.label}</span>
              </motion.button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
