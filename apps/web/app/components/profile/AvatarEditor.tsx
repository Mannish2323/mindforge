'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '@evlo/ui';

interface AvatarEditorProps {
  currentAvatar: string;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (avatar: string) => void;
}

const AVATARS = ['🐼', '🦊', '🐸', '🐺', '🦁', '🐻', '🐯', '🦉', '🐨', '🐱', '🦅', '🦋'];

export function AvatarEditor({ currentAvatar, isOpen, onClose, onSelect }: AvatarEditorProps) {
  const [selected, setSelected] = React.useState(currentAvatar);

  if (!isOpen) return null;

  return (
    <>
      <div 
        onClick={onClose} 
        style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
        }}
      />
      <div style={{
        position: 'fixed',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1001,
        background: 'var(--surface-2, #2d2d34)',
        border: '1px solid var(--border-strong, #2d2d34)',
        borderRadius: '16px',
        padding: '20px',
        width: 'min(300px, 90vw)',
      }}>
        <h4 style={{ margin: '0 0 16px 0', textAlign: 'center', fontWeight: 900 }}>Select New Avatar</h4>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '16px'
        }}>
          {AVATARS.map(av => {
            const active = selected === av;
            return (
              <button
                key={av}
                onClick={() => setSelected(av)}
                style={{
                  fontSize: '28px',
                  aspectRatio: '1',
                  borderRadius: '8px',
                  border: active ? '2px solid var(--primary, #ff9800)' : '1px solid var(--border-strong, #2d2d34)',
                  background: active ? 'rgba(255, 152, 0, 0.12)' : 'var(--surface-3, #3a3a42)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {av}
              </button>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="ghost" onClick={onClose} style={{ flex: 1 }}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={() => {
              onSelect(selected);
              onClose();
            }} 
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
          >
            <Check size={14} /> Save
          </Button>
        </div>
      </div>
    </>
  );
}
