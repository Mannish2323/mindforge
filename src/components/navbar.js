// =====================================================
// BOTTOM NAVIGATION COMPONENT
// =====================================================

import { Icons } from './icons.js';

// navigate and currentRoute are set by main.js to avoid circular deps
let _navigate = () => {};
let _currentRoute = () => 'home';

export function setNavHandlers(navigateFn, currentRouteFn) {
  _navigate = navigateFn;
  _currentRoute = currentRouteFn;
}

const NAV_ITEMS = [
  { id: 'home',        icon: Icons.book(), label: 'Learn',     route: 'home' },
  { id: 'hiragana',   icon: Icons.kana(),  label: 'Kana',      route: 'hiragana' },
  { id: 'review',     icon: Icons.review(), label: 'Review',    route: 'review' },
  { id: 'leaderboard',icon: Icons.trophy(), label: 'League',    route: 'leaderboard' },
  { id: 'profile',    icon: Icons.user(),   label: 'Profile',   route: 'profile' },
];

export function renderNavbar() {
  const nav = document.getElementById('bottom-nav');
  nav.innerHTML = NAV_ITEMS.map(item => `
    <button class="nav-item ${_currentRoute() === item.route ? 'active' : ''}"
            id="nav-${item.id}"
            data-route="${item.route}"
            aria-label="${item.label}">
      <span class="nav-icon">${item.icon}</span>
      <span>${item.label}</span>
    </button>
  `).join('');

  nav.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      _navigate(btn.dataset.route);
    });
  });
}

export function updateNavbar(route) {
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.route === route);
  });
}
