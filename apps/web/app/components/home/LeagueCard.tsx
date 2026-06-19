'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface LeagueCardProps {
  leagueTier: string;
  weeklyXP: number;
}

export function LeagueCard({ leagueTier, weeklyXP }: LeagueCardProps) {
  return (
    <Link href="/leaderboard" style={{ textDecoration: 'none' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        whileTap={{ scale: 0.97 }}
        style={{
          background: 'var(--surface-2, #2d2d34)',
          border: '1px solid var(--border-strong, #2d2d34)',
          borderRadius: '16px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'rgba(255, 193, 7, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--xp-gold, #ffc107)'
          }}>
            <Trophy size={20} />
          </div>
          <div>
            <span style={{
              fontSize: '11px',
              color: 'var(--text-secondary, #b3b3b9)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              display: 'block'
            }}>League Status</span>
            <p style={{ fontWeight: 800, fontSize: '14px', margin: '4px 0 0 0', color: 'var(--text-primary, #fff)' }}>
              {leagueTier ? leagueTier.toUpperCase() : 'BRONZE'} LEAGUE · <span style={{ color: 'var(--xp-gold, #ffc107)' }}>{weeklyXP} XP</span> this week
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary, #ff9800)', fontSize: '13px', fontWeight: 600 }}>
          View Board <ChevronRight size={14} />
        </div>
      </motion.div>
    </Link>
  );
}
