'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Sparkles } from 'lucide-react';
import { Button } from '@evlo/ui';

interface StreakCardProps {
  streak: number;
  todayStudied: boolean;
  onStudyNow: () => void;
}

export function StreakCard({ streak, todayStudied, onStudyNow }: StreakCardProps) {
  const [particles, setParticles] = React.useState<{ id: number; x: number; y: number }[]>([]);
  
  // Embers/sparks generator
  React.useEffect(() => {
    if (streak === 0) return;
    const interval = setInterval(() => {
      setParticles(prev => [
        ...prev.slice(-10),
        {
          id: Math.random(),
          x: (Math.random() - 0.5) * 24,
          y: -5
        }
      ]);
    }, 500);
    return () => clearInterval(interval);
  }, [streak]);

  // Dynamic day checklist calculation
  const today = new Date();
  const currentDayIndex = (today.getDay() + 6) % 7; // Monday = 0, Sunday = 6
  
  const weeklyDays = Array.from({ length: 7 }, (_, i) => {
    const dayDate = new Date();
    dayDate.setDate(today.getDate() - (currentDayIndex - i));
    const dayLabel = dayDate.toLocaleDateString('en-US', { weekday: 'short' });
    
    let isCompleted = false;
    if (i === currentDayIndex) {
      isCompleted = todayStudied;
    } else if (i < currentDayIndex) {
      const diff = currentDayIndex - i;
      isCompleted = streak > diff || (streak === diff && todayStudied);
    }
    
    return {
      label: dayLabel[0], // 'M', 'T', 'W' etc.
      isToday: i === currentDayIndex,
      isCompleted,
      isFuture: i > currentDayIndex
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      style={{
        background: 'var(--surface-2, #122A1A)',
        border: streak > 0 ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid var(--border, rgba(255,255,255,0.06))',
        borderRadius: '20px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: streak > 0 ? '0 8px 30px rgba(245, 158, 11, 0.08)' : 'none',
      }}
    >
      {/* Background glow behind the flame */}
      {streak > 0 && (
        <div style={{
          position: 'absolute',
          top: '-20px',
          left: '20px',
          width: '120px',
          height: '120px',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0) 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }} />
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          
          {/* Animated Flame Container */}
          <div style={{ position: 'relative', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AnimatePresence>
              {particles.map(p => (
                <motion.span
                  key={p.id}
                  initial={{ x: p.x, y: p.y, scale: 1.2, opacity: 0.8 }}
                  animate={{ x: p.x + (Math.random() - 0.5) * 16, y: p.y - 48, scale: 0.3, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.0, ease: "easeOut" }}
                  style={{
                    position: 'absolute',
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, #FFA500 0%, #FF3E3E 100%)',
                    boxShadow: '0 0 6px #FF8C00',
                    pointerEvents: 'none',
                    zIndex: 1
                  }}
                />
              ))}
            </AnimatePresence>

            <motion.div
              animate={streak > 0 ? {
                scale: [1, 1.08, 0.98, 1.05, 1],
                y: [0, -2, 1, -1, 0],
              } : {}}
              transition={{
                repeat: Infinity,
                duration: 2.5,
                ease: 'easeInOut'
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: streak > 0 
                  ? 'radial-gradient(circle, rgba(255, 165, 0, 0.2) 0%, rgba(255, 69, 0, 0.05) 100%)' 
                  : 'rgba(255,255,255,0.03)',
                border: streak > 0 ? '1px solid rgba(255,165,0,0.2)' : '1px solid rgba(255,255,255,0.05)'
              }}
            >
              <Flame 
                size={26} 
                color={streak > 0 ? "#FF8C00" : "#6B7280"} 
                fill={streak > 0 ? "#FF8C00" : "transparent"} 
                style={{
                  filter: streak > 0 ? 'drop-shadow(0 0 8px rgba(255, 140, 0, 0.6))' : 'none'
                }}
              />
            </motion.div>
          </div>

          <div>
            <h3 style={{
              fontWeight: 900,
              fontSize: '18px',
              margin: 0,
              color: streak > 0 ? '#FFA500' : 'var(--text-primary, #fff)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              {streak > 0 ? `${streak} Day Streak!` : 'Start Your Journey'}
              {streak >= 7 && <Sparkles size={16} color="#FFD700" className="animate-pulse" />}
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary, #b3b3b9)', margin: '4px 0 0 0' }}>
              {todayStudied
                ? '✅ Study complete for today!'
                : streak > 0
                ? '🔥 Keep the fire burning - study today!'
                : 'Complete a lesson to establish your daily streak.'}
            </p>
          </div>
        </div>

        {!todayStudied ? (
          <Button
            variant="primary"
            onClick={onStudyNow}
            style={{ 
              whiteSpace: 'nowrap', 
              padding: '8px 16px', 
              fontSize: '12px', 
              height: '36px',
              boxShadow: '0 4px 12px rgba(25, 135, 84, 0.25)',
              zIndex: 2
            }}
          >
            Study Now
          </Button>
        ) : (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(25, 135, 84, 0.15)',
              border: '1px solid rgba(25, 135, 84, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--success, #198754)',
              fontWeight: 'bold',
              fontSize: '14px',
              zIndex: 2
            }}
          >
            ✓
          </motion.div>
        )}
      </div>

      {/* Week Day Checker Grid */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(0,0,0,0.12)',
        borderRadius: '12px',
        padding: '10px 14px',
        marginTop: '4px',
        zIndex: 1,
        border: '1px solid rgba(255,255,255,0.02)'
      }}>
        {weeklyDays.map((wd, idx) => (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <span style={{ 
              fontSize: '10px', 
              fontWeight: 'bold', 
              color: wd.isToday ? '#FFA500' : (wd.isFuture ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.4)')
            }}>
              {wd.label}
            </span>
            
            {wd.isCompleted ? (
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 10 }}
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #FFB03A 0%, #FF3E3E 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '9px',
                  boxShadow: '0 2px 6px rgba(255, 69, 0, 0.4)'
                }}
              >
                🔥
              </motion.div>
            ) : wd.isToday ? (
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  borderColor: ['rgba(255,165,0,0.3)', 'rgba(255,165,0,0.8)', 'rgba(255,165,0,0.3)']
                }}
                transition={{ repeat: Infinity, duration: 1.8 }}
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  border: '1.5px double #FFA500',
                  background: 'transparent'
                }}
              />
            ) : (
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                border: wd.isFuture ? '1px dashed rgba(255,255,255,0.12)' : '1px solid rgba(255,255,255,0.2)',
                background: 'transparent'
              }} />
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
