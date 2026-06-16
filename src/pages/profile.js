// =====================================================
// PROFILE PAGE — Stats, Heatmap, Achievements
// =====================================================

import { store } from '../state/store.js';

let _navigate = () => {};
export function setProfileNavigate(fn) { _navigate = fn; }

export function renderProfile(container) {
  const stats    = store.getStats();
  const heatmap  = store.getHeatmapData(13); // 13 weeks
  const state    = store.get();

  // Achievements
  const achievements = getAchievements(stats);
  const earned = achievements.filter(a => a.earned);

  container.innerHTML = `
    <div class="page-profile page-enter">

      <!-- Profile Hero -->
      <div class="profile-hero">
        <div class="profile-avatar">${state.avatar}</div>
        <div class="profile-name">${state.username}</div>
        <div class="profile-sub">Japanese Learner · Silver League</div>
        <div style="margin-top: var(--space-3);">
          <div class="badge badge-green">🌿 Velmorth Member</div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="s-val" style="color: var(--amber);">${stats.totalXP.toLocaleString()}</div>
          <div class="s-label">Total XP</div>
        </div>
        <div class="stat-card">
          <div class="s-val" style="color: var(--orange);">${stats.streak}🔥</div>
          <div class="s-label">Day Streak</div>
        </div>
        <div class="stat-card">
          <div class="s-val" style="color: var(--green-400);">${stats.lessonsCompleted}</div>
          <div class="s-label">Lessons Done</div>
        </div>
        <div class="stat-card">
          <div class="s-val" style="color: var(--blue);">${stats.wordsLearned}</div>
          <div class="s-label">Words Learned</div>
        </div>
        <div class="stat-card">
          <div class="s-val" style="color: var(--cyan);">${stats.gems}</div>
          <div class="s-label">💎 Gems</div>
        </div>
        <div class="stat-card">
          <div class="s-val" style="color: var(--red);">${stats.hearts}❤️</div>
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
        <h3 style="font-size: var(--text-base); font-weight: 700; margin-bottom: var(--space-4);">
          🏅 Achievements (${earned.length}/${achievements.length})
        </h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3);">
          ${achievements.map(a => `
            <div class="card" style="${!a.earned ? 'opacity: 0.4; filter: grayscale(1);' : ''}">
              <div style="font-size: 28px; margin-bottom: var(--space-2);">${a.icon}</div>
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
          <button class="btn btn-primary btn-full" onclick="window._navigate('home')">
            📖 Continue Learning
          </button>
          <button class="btn btn-secondary btn-full" onclick="window._navigate('review')">
            🔁 Start Review Session
          </button>
          <button class="btn btn-ghost btn-full" onclick="window._navigate('settings')">
            ⚙️ Settings
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
