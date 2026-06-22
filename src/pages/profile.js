// =====================================================
// PROFILE PAGE — Stats, Heatmap, Achievements
// =====================================================

import { store } from '../state/store.js';
import { Icons } from '../components/icons.js';

let _navigate = () => {};
export function setProfileNavigate(fn) { _navigate = fn; }

export function renderProfile(container) {
  const stats    = store.getStats();
  const heatmap  = store.getHeatmapData(13); // 13 weeks
  const state    = store.get();

  // Achievements
  const achievements = getAchievements(stats);
  const earned = achievements.filter(a => a.earned);

  const achIcons = {
    '🌱': Icons.level1(),
    '🔥': Icons.streak(),
    '📚': Icons.book(),
    '⭐': Icons.xp(),
    '🃏': Icons.review(),
    '🏆': Icons.trophy(),
    '💎': Icons.gems(),
    '🗓️': Icons.time(),
  };

  container.innerHTML = `
    <div class="page-profile page-enter">

      <!-- Profile Hero -->
      <div class="profile-hero">
        <div class="profile-avatar" style="font-size: 56px; display: inline-flex; align-items: center; justify-content: center; width: 80px; height: 80px; border-radius: 50%; background: var(--bg-card); margin-bottom: var(--space-3); border: 2px solid var(--border);">${state.avatar}</div>
        <div class="profile-name">${state.username}</div>
        <div class="profile-sub">Japanese Learner · Silver League</div>
        <div style="margin-top: var(--space-3);">
          <div class="badge badge-green" style="display: inline-flex; align-items: center; gap: 4px;">${Icons.logo()} Velmorth Member</div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="s-val" style="color: var(--amber); display: inline-flex; align-items: center; gap: 4px; justify-content: center;">${Icons.xp()} ${stats.totalXP.toLocaleString()}</div>
          <div class="s-label">Total XP</div>
        </div>
        <div class="stat-card">
          <div class="s-val" style="color: var(--orange); display: inline-flex; align-items: center; gap: 4px; justify-content: center;">${Icons.streak()} ${stats.streak}</div>
          <div class="s-label">Day Streak</div>
        </div>
        <div class="stat-card">
          <div class="s-val" style="color: var(--green-400); display: inline-flex; align-items: center; gap: 4px; justify-content: center;">${Icons.book()} ${stats.lessonsCompleted}</div>
          <div class="s-label">Lessons Done</div>
        </div>
        <div class="stat-card">
          <div class="s-val" style="color: var(--blue); display: inline-flex; align-items: center; gap: 4px; justify-content: center;">${Icons.kana()} ${stats.wordsLearned}</div>
          <div class="s-label">Words Learned</div>
        </div>
        <div class="stat-card">
          <div class="s-val" style="color: var(--cyan); display: inline-flex; align-items: center; gap: 4px; justify-content: center;">${Icons.gems()} ${stats.gems}</div>
          <div class="s-label">Gems</div>
        </div>
        <div class="stat-card">
          <div class="s-val" style="color: var(--red); display: inline-flex; align-items: center; gap: 4px; justify-content: center;">${Icons.hearts()} ${stats.hearts}</div>
          <div class="s-label">Hearts</div>
        </div>
      </div>

      <!-- Activity Heatmap -->
      <div class="heatmap-section">
        <h3>📅 Activity (Last 13 Weeks)</h3>
        <div class="heatmap-grid" id="heatmap-grid">
          ${heatmap.map(cell => `
            <div class="heatmap-cell"
                 data-level="${cell.level}"
                 data-date="${cell.date}"
                 title="${cell.date}: ${cell.sessions} session${cell.sessions !== 1 ? 's' : ''}">
            </div>
          `).join('')}
        </div>
        <div style="display: flex; align-items: center; gap: var(--space-2); margin-top: var(--space-3); font-size: var(--text-xs); color: var(--text-muted);">
          <span>Less</span>
          ${[0,1,2,3,4].map(l => `<div class="heatmap-cell" data-level="${l}" style="width:12px; height:12px; display:inline-block; border-radius:2px;"></div>`).join('')}
          <span>More</span>
        </div>
      </div>

      <!-- Achievements -->
      <div style="margin-bottom: var(--space-6);">
        <h3 style="font-size: var(--text-base); font-weight: 700; margin-bottom: var(--space-4); display: flex; align-items: center; gap: 6px;">
          ${Icons.trophy()} Achievements (${earned.length}/${achievements.length})
        </h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3);">
          ${achievements.map(a => `
            <div class="card" style="${!a.earned ? 'opacity: 0.4; filter: grayscale(1);' : ''}">
              <div style="font-size: 32px; margin-bottom: var(--space-2); display: inline-flex;">${achIcons[a.icon] || Icons.trophy()}</div>
              <div style="font-size: var(--text-sm); font-weight: 700;">${a.name}</div>
              <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 3px;">${a.desc}</div>
              ${a.earned ? '<div class="badge badge-green" style="margin-top: var(--space-2);">Earned ✓</div>' : ''}
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Quick Actions -->
      <div style="margin-bottom: var(--space-6);">
        <div class="section-title">Quick Actions</div>
        <div style="display: flex; flex-direction: column; gap: var(--space-3);">
          <button class="btn btn-primary btn-full" style="display: inline-flex; align-items: center; justify-content: center; gap: 6px;" onclick="window._navigate('home')">
            ${Icons.book()} Continue Learning
          </button>
          <button class="btn btn-secondary btn-full" style="display: inline-flex; align-items: center; justify-content: center; gap: 6px;" onclick="window._navigate('review')">
            ${Icons.review()} Start Review Session
          </button>
          <button class="btn btn-ghost btn-full" style="display: inline-flex; align-items: center; justify-content: center; gap: 6px;" onclick="window._navigate('settings')">
            <svg viewBox="0 0 24 24" style="width:1.2em; height:1.2em; fill:none; stroke:currentColor; stroke-width:2;" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> Settings
          </button>
        </div>
      </div>
    </div>
  `;

  // Store navigate globally for inline onclick use
  window._navigate = (route) => _navigate(route);
}

function getAchievements(stats) {
  return [
    {
      icon: '🌱',
      name: 'First Step',
      desc: 'Complete your first lesson',
      earned: stats.lessonsCompleted >= 1,
    },
    {
      icon: '🔥',
      name: 'On Fire',
      desc: 'Maintain a 3-day streak',
      earned: stats.streak >= 3,
    },
    {
      icon: '📚',
      name: 'Scholar',
      desc: 'Complete 5 lessons',
      earned: stats.lessonsCompleted >= 5,
    },
    {
      icon: '⭐',
      name: 'Star Learner',
      desc: 'Earn 100 XP',
      earned: stats.totalXP >= 100,
    },
    {
      icon: '🃏',
      name: 'Card Collector',
      desc: 'Learn 10 vocabulary words',
      earned: stats.wordsLearned >= 10,
    },
    {
      icon: '🏆',
      name: 'Champion',
      desc: 'Earn 500 XP',
      earned: stats.totalXP >= 500,
    },
    {
      icon: '💎',
      name: 'Gem Hoarder',
      desc: 'Collect 100 gems',
      earned: stats.gems >= 100,
    },
    {
      icon: '🗓️',
      name: 'Week Warrior',
      desc: 'Maintain a 7-day streak',
      earned: stats.streak >= 7,
    },
  ];
}
