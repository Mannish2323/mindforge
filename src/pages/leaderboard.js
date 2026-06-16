// =====================================================
// LEADERBOARD PAGE — Silver League
// =====================================================

import { store } from '../state/store.js';

export function renderLeaderboard(container) {
  const board = store.getLeaderboard();
  const myRank = board.find(p => p.isYou)?.rank ?? '?';

  const getRankDisplay = (rank) => {
    if (rank === 1) return { display: '🥇', class: 'gold' };
    if (rank === 2) return { display: '🥈', class: 'silver' };
    if (rank === 3) return { display: '🥉', class: 'bronze' };
    return { display: rank, class: '' };
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
      <div class="league-header">
        <div class="league-icon">🥈</div>
        <div class="league-name">Silver League</div>
        <div class="league-sub">Top ${board.length} learners this week</div>
        <div style="margin-top: var(--space-4);">
          <div class="badge badge-amber" style="margin: 0 auto; display: inline-flex;">
            Your Rank: #${myRank}
          </div>
        </div>
      </div>

      <!-- Promotion info -->
      <div class="card" style="margin-bottom: var(--space-5); text-align: center; background: rgba(74,222,128,0.06); border-color: rgba(74,222,128,0.25);">
        <div style="font-size: var(--text-sm); color: var(--text-secondary);">
          🏆 Top 3 promote to <strong style="color: var(--amber);">Gold League</strong>
          <br/><span style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px; display: block;">League resets every Sunday at midnight</span>
        </div>
      </div>

      <!-- Leaderboard list -->
      <div class="leaderboard-list">
        ${board.map(player => {
          const { display, class: rankClass } = getRankDisplay(player.rank);
          return `
            <div class="lb-row ${player.isYou ? 'you' : ''}"
                 style="${player.rank <= 3 ? 'border-top: 2px solid ' + (player.rank === 1 ? 'rgba(251,191,36,0.5)' : player.rank === 2 ? 'rgba(148,163,184,0.5)' : 'rgba(205,124,54,0.5)') + ';' : ''}">
              <div class="lb-rank ${rankClass}">${display}</div>
              <div class="lb-avatar">${player.avatar}</div>
              <div style="flex: 1;">
                <div class="lb-name">
                  ${player.name}
                  ${player.isYou ? '<span class="badge badge-green" style="margin-left: 6px; font-size: 10px;">YOU</span>' : ''}
                </div>
                ${getXPBar(player.xp, maxXP)}
              </div>
              <div class="lb-xp">⭐ ${player.xp.toLocaleString()}</div>
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
