'use client';

import React from 'react';

interface PlanToggleProps {
  useYearly: boolean;
  onToggle: (val: boolean) => void;
}

export function PlanToggle({ useYearly, onToggle }: PlanToggleProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '24px' }}>
      <span style={{ fontSize: '13px', fontWeight: 600, color: useYearly ? 'var(--text-secondary, #b3b3b9)' : 'var(--text-primary, #fff)' }}>Monthly</span>
      <button
        onClick={() => onToggle(!useYearly)}
        style={{
          width: '48px', height: '26px', borderRadius: '13px',
          background: useYearly ? 'var(--primary, #ff9800)' : 'var(--surface-3, #3a3a42)',
          border: 'none', cursor: 'pointer', position: 'relative',
        }}
      >
        <span style={{
          position: 'absolute', top: '3px', left: useYearly ? '25px' : '3px',
          width: '20px', height: '20px', borderRadius: '50%', background: '#fff',
          transition: 'left 0.2s ease',
        }} />
      </button>
      <span style={{ fontSize: '13px', fontWeight: useYearly ? 800 : 600, color: useYearly ? 'var(--primary, #ff9800)' : 'var(--text-secondary, #b3b3b9)' }}>
        Yearly <span style={{ background: 'rgba(22, 163, 74, 0.15)', color: 'var(--primary, #ff9800)', borderRadius: '6px', padding: '2px 6px', marginLeft: '4px', fontSize: '10px' }}>Save 58%</span>
      </span>
    </div>
  );
}
