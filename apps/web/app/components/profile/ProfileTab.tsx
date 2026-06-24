'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X, PenLine } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useStoreContext } from '../../context/StoreContext';
import { Button } from '@evlo/ui';
import { StatsRow } from './StatsRow';
import { BadgesRow } from './BadgesRow';
import { ActivityList } from './ActivityList';
import { AvatarEditor } from './AvatarEditor';

interface ProfileTabProps {
  onNavigateToBilling?: () => void; // kept for API compat but internal router is used
}

const AVATARS = ['🐼', '🦊', '🐸', '🐺', '🦁', '🐻', '🐯', '🦉', '🐨', '🐱', '🦅', '🦋'];

export function ProfileTab({ onNavigateToBilling }: ProfileTabProps) {
  const router = useRouter();
  const { state } = useStoreContext();
  const { user, profile, updateProfileDetails } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('🦊');
  const [saving, setSaving] = useState(false);

  const completedLessons = React.useMemo(() => {
    return Object.values(state?.lessonProgress || {}).filter((l: any) => l.completed).length;
  }, [state?.lessonProgress]);

  const wordsLearned = React.useMemo(() => {
    return Object.keys(state?.srsData || {}).length;
  }, [state?.srsData]);

  const speakSessions = state?.storiesCompleted || 0;

  const unlockedBadges = React.useMemo(() => {
    return (state?.badges || []).filter((b: any) => b.unlockedAt !== null);
  }, [state?.badges]);

  const completionItems = [
    !!profile?.avatarUrl,
    !!(profile?.name && profile?.name !== 'Learner'),
    !!profile?.bio,
    !!profile?.jlpt_target,
    completedLessons > 0
  ];
  const completionPct = Math.round((completionItems.filter(Boolean).length / completionItems.length) * 100);

  // Heatmap data prep
  const activityData = React.useMemo(() => {
    const data: Record<string, { sessions: number; xp: number }> = {};
    const log = state?.activityLog || {};
    const lprog = state?.lessonProgress || {};
    
    Object.entries(log).forEach(([date, sessions]) => {
      data[date] = { sessions: sessions as number, xp: 0 };
    });
    
    Object.values(lprog).forEach((l: any) => {
      if (l.completedAt) {
        const d = l.completedAt.split('T')[0];
        if (data[d]) {
          data[d].xp += (l.xp || 0);
        } else {
          data[d] = { sessions: 1, xp: l.xp || 0 };
        }
      }
    });
    return data;
  }, [state?.activityLog, state?.lessonProgress]);

  const hasAnyActivity = Object.keys(activityData).length > 0;

  const handleStartEdit = () => {
    setEditName(profile?.name || '');
    setEditBio(profile?.bio || '');
    setIsEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfileDetails(editName, editBio, profile?.avatarUrl || '🦊');
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarSelect = async (av: string) => {
    try {
      await updateProfileDetails(profile?.name || 'Learner', profile?.bio || '', av);
      setShowAvatarPicker(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (!profile) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '24px' }}>
      
      {/* 1. Avatar with progress ring + pencil edit */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
        <div style={{ position: 'relative', width: '100px', height: '100px' }}>
          <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
            <circle cx="50" cy="50" r="44" fill="none"
              stroke="#ff9800" strokeWidth="4"
              strokeDasharray="276.5"
              strokeDashoffset={276.5 - (completionPct / 100) * 276.5}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
            />
          </svg>
          <div
            onClick={() => {
              setSelectedAvatar(profile.avatarUrl || '🦊');
              setShowAvatarPicker(true);
            }}
            style={{
              position: 'absolute', inset: '8px',
              borderRadius: '50%',
              background: 'var(--surface-3, #3a3a42)',
              border: '2px solid rgba(255,255,255,0.1)',
              display: 'grid', placeItems: 'center',
              fontSize: '42px', cursor: 'pointer',
            }}
          >
            {profile.avatarUrl || '🦊'}
          </div>
          {/* Pencil edit button */}
          <div 
            onClick={() => {
              setSelectedAvatar(profile.avatarUrl || '🦊');
              setShowAvatarPicker(true);
            }}
            style={{
              position: 'absolute', bottom: '6px', right: '6px',
              width: '24px', height: '24px', borderRadius: '50%',
              background: 'var(--primary, #ff9800)', border: '2px solid var(--bg-root, #121216)',
              display: 'grid', placeItems: 'center', fontSize: '10px',
              cursor: 'pointer',
            }}
          >
            ✏️
          </div>
        </div>
      </div>

      {/* 2 & 3. Display name (large) + Username (small, muted) */}
      <div style={{ textAlign: 'center' }}>
        {isEditing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '300px', margin: '0 auto' }}>
            <input
              type="text"
              value={editName}
              onChange={e => setEditName(e.target.value)}
              placeholder="Display Name"
              style={{ textAlign: 'center', background: 'var(--surface-2, #2d2d34)', color: '#fff', border: '1px solid var(--border-strong, #2d2d34)' }}
            />
            <textarea
              value={editBio}
              onChange={e => setEditBio(e.target.value)}
              placeholder="Bio"
              style={{ textAlign: 'center', height: '60px', background: 'var(--surface-2, #2d2d34)', color: '#fff', border: '1px solid var(--border-strong, #2d2d34)', resize: 'none' }}
            />
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <Button variant="ghost" onClick={() => setIsEditing(false)} style={{ height: '32px', padding: '0 12px' }}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSave} disabled={saving} style={{ height: '32px', padding: '0 12px' }}>
                Save
              </Button>
            </div>
          </div>
        ) : (
          <>
            <h1 style={{ fontSize: '24px', fontWeight: 900, margin: 0, color: 'var(--text-primary, #fff)' }}>
              {profile.name || 'Learner'}
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary, #b3b3b9)', margin: '4px 0 0 0' }}>
              @{profile.username || 'learner'}
            </p>
          </>
        )}
      </div>

      {/* 4. Bio (optional, tap to edit) */}
      {!isEditing && (
        <div 
          onClick={handleStartEdit}
          style={{
            textAlign: 'center',
            fontSize: '14px',
            color: 'var(--text-secondary, #b3b3b9)',
            maxWidth: '320px',
            margin: '0 auto',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '8px',
            background: 'rgba(255,255,255,0.02)',
          }}
        >
          {profile.bio || '💡 Tap to add a custom bio!'}
        </div>
      )}

      {/* 5. Stats row: XP | Streak | Lessons | Words */}
      <StatsRow
        xp={profile.xp || 0}
        streak={profile.streak || 0}
        completedLessons={completedLessons}
        wordsLearned={wordsLearned}
      />

      {/* 6. Badges heading + horizontal scroll badge row */}
      <BadgesRow unlockedBadges={unlockedBadges} />

      {/* 7. Recent activity heading + list */}
      <ActivityList activityData={hasAnyActivity ? activityData : null} hasAnyActivity={hasAnyActivity} />

      {/* 8. Edit Profile button at bottom */}
      {!isEditing && (
        <Button 
          variant="ghost" 
          onClick={handleStartEdit} 
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          <PenLine size={16} /> Edit Display Name & Bio
        </Button>
      )}

      {/* Avatar Picker Modal */}
      <AvatarEditor
        currentAvatar={profile.avatarUrl || '🦊'}
        isOpen={showAvatarPicker}
        onClose={() => setShowAvatarPicker(false)}
        onSelect={handleAvatarSelect}
      />
    </div>
  );
}

