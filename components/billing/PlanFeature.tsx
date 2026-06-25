'use client';

import React from 'react';
import { Check, X } from 'lucide-react';

interface PlanFeatureProps {
  text: string;
  ok: boolean;
  color: string;
}

export function PlanFeature({ text, ok, color }: PlanFeatureProps) {
  return (
    <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
      {ok ? (
        <Check size={14} style={{ color }} />
      ) : (
        <X size={14} style={{ color: 'var(--text-secondary, #b3b3b9)' }} />
      )}
      <span style={{ color: ok ? 'var(--text-primary, #fff)' : 'var(--text-secondary, #b3b3b9)' }}>
        {text}
      </span>
    </li>
  );
}
