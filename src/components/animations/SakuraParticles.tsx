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
    // Generate static petals on mount to avoid hydration mismatch
    const generated: Petal[] = Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 10}s`,
      duration: `${8 + Math.random() * 8}s`,
      size: `${6 + Math.random() * 12}px`,
      opacity: 0.4 + Math.random() * 0.5,
      rotation: `${Math.random() * 360}deg`,
    }));
    setPetals(generated);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {petals.map((petal) => (
        <span
          key={petal.id}
          className="absolute block bg-gradient-to-br from-sakura-medium to-sakura-dark animate-petal-fall rounded-[100%_0%_60%_40%/_60%_0%_100%_40%] origin-center"
          style={{
            left: petal.left,
            animationDelay: petal.delay,
            animationDuration: petal.duration,
            width: petal.size,
            height: petal.size,
            opacity: petal.opacity,
            transform: `rotate(${petal.rotation})`,
          }}
        />
      ))}
    </div>
  );
}
