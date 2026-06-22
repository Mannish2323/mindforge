// =====================================================
// LEADERBOARD PAGE — Silver League
// =====================================================

import { store } from '../state/store.js';
import { Icons } from '../components/icons.js';

export function renderLeaderboard(container) {
  const board = store.getLeaderboard();
  const myRank = board.find(p => p.isYou)?.rank ?? '?';

  const getRankDisplay = (rank) => {
    if (rank === 1) return { display: Icons.crown(), class: 'gold' };
    if (rank === 2) return { display: Icons.trophy(), class: 'silver' };
    if (rank === 3) return { display: Icons.xp(), class: 'bronze' };
    return { display: `<span class="rank-num">${rank}</span>`, class: '' };
  };

  const getXPBar = (xp, maxXP) => {
    const pct = Math.min(100, (xp / maxXP) * 100);
    return `
      <div style="height: 3px; background: var(--bg-surface); border-radius: var(--radius-full); margin-top: 4px; overflow: hidden;">
        <div style="height: 100%; width: ${pct}%; background: var(--grad-gold); border-radius: var(--radius-full);"></div>
      </div>
    `;
  };

  const maxXP = Math.max(...board.map(p => p.xp), 1);

  container.innerHTML = `
    <div class="page-leaderboard page-enter">

      <!-- League Header -->
      <div class="league-header" style="text-align: center; padding: var(--space-5) 0;">
        <div class="league-icon" style="font-size: 56px; line-height: 1; display: inline-flex; align-items: center; justify-content: center; margin-bottom: var(--space-2);">${Icons.trophy()}</div>
        <div class="league-name" style="font-size: var(--text-xl); font-weight: 800;">Silver League</div>
        <div class="league-sub" style="font-size: var(--text-xs); color: var(--text-muted);">Top ${board.length} learners this week</div>
        <div style="margin-top: var(--space-4);">
          <div class="badge badge-amber" style="margin: 0 auto; display: inline-flex;">
            Your Rank: #${myRank}
          </div>
        </div>
      </div>

      <!-- Promotion info -->
      <div class="card" style="margin-bottom: var(--space-5); text-align: center; background: rgba(74,222,128,0.06); border-color: rgba(74,222,128,0.25);">
        <div style="font-size: var(--text-sm); color: var(--text-secondary); display: flex; flex-direction: column; align-items: center; gap: 4px; justify-content: center;">
          <div style="display: flex; align-items: center; gap: 6px; font-weight: bold;">
            <span style="display: inline-flex; font-size: 18px;">${Icons.crown()}</span> Top 3 promote to <strong style="color: var(--amber);">Gold League</strong>
          </div>
          <span style="font-size: var(--text-xs); color: var(--text-muted);">League resets every Sunday at midnight</span>
        </div>
      </div>

      <!-- Leaderboard list -->
      <div class="leaderboard-list">
        ${board.map(player => {
          const { display, class: rankClass } = getRankDisplay(player.rank);
          return `
            <div class="lb-row ${player.isYou ? 'you' : ''}"
                 style="${player.rank <= 3 ? 'border-top: 2px solid ' + (player.rank === 1 ? 'rgba(251,191,36,0.5)' : player.rank === 2 ? 'rgba(148,163,184,0.5)' : 'rgba(205,124,54,0.5)') + ';' : ''}">
              <div class="lb-rank ${rankClass}" style="display: inline-flex; align-items: center; justify-content: center; font-size: 20px; width: 28px;">${display}</div>
              <div class="lb-avatar" style="font-size: 22px; display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 50%; background: var(--bg-surface);">${player.avatar}</div>
              <div style="flex: 1; margin-left: 8px;">
                <div class="lb-name">
                  ${player.name}
                  ${player.isYou ? '<span class="badge badge-green" style="margin-left: 6px; font-size: 10px;">YOU</span>' : ''}
                </div>
                ${getXPBar(player.xp, maxXP)}
              </div>
              <div class="lb-xp" style="display: inline-flex; align-items: center; gap: 4px; font-weight: 700; color: var(--amber);">${Icons.xp()} ${player.xp.toLocaleString()}</div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Bottom tip -->
      <div style="text-align: center; padding: var(--space-6) 0; color: var(--text-muted); font-size: var(--text-sm);">
        Complete lessons to earn XP and climb the ranks!<br/>
        <span style="font-size: var(--text-xs);">Leaderboard updates in real-time</span>
      </div>
    </div>
  `;
}
