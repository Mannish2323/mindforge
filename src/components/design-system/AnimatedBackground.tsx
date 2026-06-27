'use client';

import { useEffect, useState } from 'react';

interface Petal {
  id: number;
  left: number;
  duration: number;
  delay: number;
}

export function AnimatedBackground() {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    const newPetals = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: 8 + Math.random() * 4,
      delay: Math.random() * 2,
    }));
    setPetals(newPetals);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Main gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, rgb(9, 7, 26) 0%, rgb(14, 11, 34) 50%, rgb(19, 9, 48) 100%)',
        }}
      />

      {/* Animated petals */}
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="absolute animate-float"
          style={{
            left: `${petal.left}%`,
            top: '-20px',
            animation: `float ${petal.duration}s linear ${petal.delay}s infinite`,
            opacity: 0.3,
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-pink-500"
          >
            <path d="M12 2.69l3.66 7.41h8.15l-6.59 4.78 2.52 8.12L12 20.82l-6.74 4.18 2.52-8.12-6.59-4.78h8.15L12 2.69z" />
          </svg>
        </div>
      ))}

      {/* Glow orbs */}
      <div
        className="absolute top-20 -left-32 w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.3), transparent)',
        }}
      />
      <div
        className="absolute -bottom-40 right-0 w-80 h-80 rounded-full blur-3xl opacity-15"
        style={{
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.2), transparent)',
        }}
      />

      <style jsx>{`
        @keyframes float {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
