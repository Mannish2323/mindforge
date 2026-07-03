'use client';

import React, { useEffect, useState } from 'react';

interface Petal {
  id: number;
  left: string;
  delay: string;
  duration: string;
  size: string;
  opacity: number;
  rotation: string;
}

export function SakuraParticles() {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    // Check reduced motion preference
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setPetals([]);
      return;
    }

    // Detect mobile for reduced particle count, low-end for even fewer
    const isMobile = window.innerWidth < 768;
    const isLowEnd = navigator.hardwareConcurrency ? navigator.hardwareConcurrency <= 4 : false;
    const count = isLowEnd ? 8 : isMobile ? 12 : 18;

    const generated: Petal[] = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 10}s`,
      duration: `${12 + Math.random() * 10}s`,
      size: `${6 + Math.random() * 10}px`,
      opacity: 0.25 + Math.random() * 0.35,
      rotation: `${Math.random() * 360}deg`,
    }));
    setPetals(generated);
  }, []);

  if (petals.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {petals.map((petal) => (
        <span
          key={petal.id}
          className="absolute block bg-gradient-to-br from-sakura-medium to-sakura-dark animate-petal-fall rounded-[100%_0%_60%_40%_/_60%_0%_100%_40%] origin-center"
          style={{
            left: petal.left,
            animationDelay: petal.delay,
            animationDuration: petal.duration,
            width: petal.size,
            height: petal.size,
            opacity: petal.opacity,
            transform: `rotate(${petal.rotation})`,
            willChange: 'transform, opacity',
          }}
        />
      ))}
    </div>
  );
}
