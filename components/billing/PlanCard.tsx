'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PlanFeature } from './PlanFeature';

interface PlanDef {
  id: string;
  name: string;
  price: string;
  yearlyPrice: string;
  sub: string;
  badge?: string;
  color: string;
  emoji: string;
  features: { text: string; ok: boolean }[];
}

interface PlanCardProps {
  plan: PlanDef;
  index: number;
  isSelected: boolean;
  useYearly: boolean;
  onSelect: () => void;
}

export function PlanCard({ plan, index, isSelected, useYearly, onSelect }: PlanCardProps) {
  const price = useYearly ? plan.yearlyPrice : plan.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={
        plan.id === 'pro'
          ? {
              y: 0,
              opacity: 1,
              boxShadow: [
                '0px 0px 8px 1px rgba(234, 179, 8, 0.15)',
                '0px 0px 16px 4px rgba(234, 179, 8, 0.4)',
                '0px 0px 8px 1px rgba(234, 179, 8, 0.15)'
              ],
            }
          : { opacity: 1, y: 0 }
      }
      transition={
        plan.id === 'pro'
          ? {
              boxShadow: {
                repeat: Infinity,
                duration: 2.4,
                ease: 'easeInOut'
              },
              opacity: { duration: 0.3, delay: index * 0.05 },
              y: { duration: 0.3, delay: index * 0.05 }
            }
          : { duration: 0.3, delay: index * 0.05 }
      }
      whileHover={plan.id !== 'free' ? { y: -2 } : {}}
      onClick={onSelect}
      style={{
        background: 'var(--surface-2, #2d2d34)',
        border: isSelected ? `2px solid ${plan.color}` : '1px solid var(--border-strong, #2d2d34)',
        borderRadius: '20px',
        padding: '20px',
        cursor: plan.id === 'free' ? 'default' : 'pointer',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {plan.badge && (
        <div style={{
          position: 'absolute', top: '12px', right: '12px',
          background: 'rgba(234, 179, 8, 0.15)', color: '#eab308',
          fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '8px',
          textTransform: 'uppercase', letterSpacing: '0.05em'
        }}>
          {plan.badge}
        </div>
      )}

      <div style={{ fontSize: '24px' }}>{plan.emoji}</div>
      <h3 style={{ margin: '8px 0 4px 0', fontSize: '18px', fontWeight: 900, color: plan.color }}>
        {plan.name}
      </h3>
      
      {/* Animated price transition wrapper */}
      <motion.div 
        key={price}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        style={{ fontSize: '22px', fontWeight: 900, color: 'var(--text-primary, #fff)' }}
      >
        {price}
        <span style={{ fontSize: '13px', color: 'var(--text-secondary, #b3b3b9)', fontWeight: 500 }}>
          {plan.sub}
        </span>
      </motion.div>

      <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0 0 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {plan.features.map((f, fIdx) => (
          <PlanFeature key={fIdx} text={f.text} ok={f.ok} color={plan.color} />
        ))}
      </ul>

      {plan.id !== 'free' && (
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          style={{
            width: '100%',
            marginTop: '16px',
            background: isSelected ? plan.color : 'var(--surface-3, #3a3a42)',
            color: isSelected ? '#000' : 'var(--text-primary, #fff)',
            border: 'none',
            padding: '10px',
            borderRadius: '12px',
            fontWeight: 800,
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          {isSelected ? 'Selected' : 'Select'}
        </motion.button>
      )}
    </motion.div>
  );
}
