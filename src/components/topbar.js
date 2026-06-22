// =====================================================
// TOPBAR COMPONENT
// XP | Streak 🔥 | Hearts ❤️ | Gems 💎
// =====================================================

import { store } from '../state/store.js';
import { Icons } from './icons.js';

let topbarEl = null;

export function renderTopbar() {
  topbarEl = document.getElementById('topbar');
  update();

  // Subscribe to state changes
  store.subscribe((changed) => {
    if (['xp', 'streak', 'hearts', 'gems'].includes(changed)) {
      update();
      bumpStat(changed);
    }
  });
}

function update() {
  const state = store.get();
  const { xp, streak, hearts, gems } = state;

  topbarEl.innerHTML = `
    <div class="topbar-logo">${Icons.logo()} Velmorth</div>
    <div class="topbar-stats">
      <div class="stat-pill xp" id="stat-xp" title="Total XP">
        <span class="icon">${Icons.xp()}</span>
        <span id="xp-val">${formatNum(xp)}</span>
      </div>
      <div class="stat-pill streak" id="stat-streak" title="Day Streak">
        <span class="icon">${Icons.streak()}</span>
        <span id="streak-val">${streak}</span>
      </div>
      <div class="stat-pill hearts" id="stat-hearts" title="Hearts">
        <span class="icon">${Icons.hearts()}</span>
        <span id="hearts-val">${hearts}</span>
      </div>
      <div class="stat-pill gems" id="stat-gems" title="Gems">
        <span class="icon">${Icons.gems()}</span>
        <span id="gems-val">${formatNum(gems)}</span>
      </div>
    </div>
  `;
}

function bumpStat(stat) {
  const idMap = { xp: 'stat-xp', streak: 'stat-streak', hearts: 'stat-hearts', gems: 'stat-gems' };
  const el = document.getElementById(idMap[stat]);
  if (el) {
    el.classList.remove('bump');
    void el.offsetWidth; // reflow
    el.classList.add('bump');
    el.addEventListener('animationend', () => el.classList.remove('bump'), { once: true });
  }
}

function formatNum(n) {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return n;
}
