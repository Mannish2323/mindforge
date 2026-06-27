'use client';

import { useMemo } from 'react';

interface Petal {
  id: number;
  left: string;
  delay: string;
  duration: string;
  scale: number;
}

export function SakuraPetals() {
  const petals = useMemo<Petal[]>(() => {
    return Array.from({ length: 14 }).map((_, idx) => ({
      id: idx,
      left: `${5 + (idx * 6.5) + Math.random() * 4}%`, // evenly distributed across width to avoid cluster anomalies
      delay: `${Math.random() * 10}s`,
      duration: `${10 + Math.random() * 8}s`,
      scale: 0.5 + Math.random() * 0.7,
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {petals.map(p => (
        <div
          key={p.id}
          className="absolute top-[-5%] bg-gradient-to-tr from-pink-300 to-pink-200/80 animate-petal-fall"
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            width: `${12 * p.scale}px`,
            height: `${6 * p.scale}px`,
            opacity: 0.35,
            borderRadius: '50% 0 50% 50%',
          }}
        />
      ))}
    </div>
  );
}
