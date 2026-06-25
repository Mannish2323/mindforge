'use client';

import React from 'react';
import { StudyActivityHeatmap } from '../StudyActivityHeatmap';

interface ActivityListProps {
  activityData: Record<string, { sessions: number; xp: number }> | null;
  hasAnyActivity: boolean;
}

export function ActivityList({ activityData, hasAnyActivity }: ActivityListProps) {
  return (
    <div>
      <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary, #fff)', margin: '0 0 8px 0' }}>📜 Recent Activity</h3>
      <div className="card" style={{ padding: '8px', overflow: 'hidden', background: 'var(--surface-2, #2d2d34)' }}>
        <StudyActivityHeatmap activityData={hasAnyActivity ? activityData : null} realDataOnly={true} />
      </div>
    </div>
  );
}
