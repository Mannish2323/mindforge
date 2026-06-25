'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface Badge {
  badge_id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
}

interface BadgesPreviewProps {
  badges: any[];
}

export function BadgesPreview({ badges }: BadgesPreviewProps) {
  const unlockedBadges = React.useMemo(() => {
    return (badges || []).filter((b) => b.unlockedAt !== null);
  }, [badges]);

  if (unlockedBadges.length === 0) return null;

  return (
    <Link href="/profile?tab=profile" style={{ textDecoration: 'none' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
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
        <div>
          <span style={{
            fontSize: '11px',
            color: 'var(--text-secondary, #b3b3b9)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            display: 'block'
          }}>Recent Badges</span>
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            {unlockedBadges.slice(-4).map((b) => (
              <motion.span
                key={b.badge_id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.45 }}
                style={{ fontSize: '24px' }}
                title={b.name}
              >
                {b.icon}
              </motion.span>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary, #ff9800)', fontSize: '13px', fontWeight: 600 }}>
          View Badges <ChevronRight size={14} />
        </div>
      </motion.div>
    </Link>
  );
}
