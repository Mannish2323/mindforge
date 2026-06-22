// =====================================================
// MODAL & TOAST UTILITIES
// =====================================================

import { Icons } from './icons.js';

// ===== TOAST =====
const toastContainer = () => document.getElementById('toast-container');

export function showToast(message, type = 'info', duration = 3000) {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icons = { success: Icons.check(), error: Icons.close(), info: Icons.logo() };
  toast.innerHTML = `<span style="font-size: 20px; display: inline-flex; align-items: center; justify-content: center;">${icons[type] || ''}</span><span>${message}</span>`;
  toastContainer().appendChild(toast);

  setTimeout(() => {
    toast.classList.add('out');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  }, duration);
}

// ===== MODAL =====
export function showModal(contentHTML, onClose) {
  const container = document.getElementById('modal-container');
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal-sheet" id="modal-sheet">
      <div class="modal-handle"></div>
      ${contentHTML}
    </div>
  `;

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal(overlay, onClose);
  });

  container.appendChild(overlay);
  return overlay;
}

export function closeModal(overlay, onClose) {
  overlay.style.animation = 'fadeIn 0.2s ease reverse';
  overlay.querySelector('.modal-sheet').style.animation = 'slideUp 0.2s ease reverse';
  setTimeout(() => {
    overlay.remove();
    onClose?.();
  }, 200);
}

// ===== LESSON COMPLETE MODAL =====
export function showLessonComplete(xpEarned, onContinue) {
  const overlay = showModal(`
    <div class="complete-modal">
      <div class="complete-icon" style="font-size: 64px; line-height: 1;">${Icons.trophy()}</div>
      <h2 class="complete-title">Lesson Complete!</h2>
      <p class="complete-sub">素晴らしい！ Great job — keep it up!</p>
      <div class="xp-earned" style="display: inline-flex; align-items: center; gap: 6px;">${Icons.xp()} +${xpEarned} XP</div>
      <div class="flex flex-col gap-3 w-full">
        <button class="btn btn-primary btn-full btn-lg" id="modal-continue">
          Continue
        </button>
        <button class="btn btn-ghost btn-full" id="modal-home">
          Back to Home
        </button>
      </div>
    </div>
  `);

  document.getElementById('modal-continue').addEventListener('click', () => {
    closeModal(overlay, onContinue);
  });

  document.getElementById('modal-home').addEventListener('click', () => {
    import('../main.js').then(({ navigate }) => navigate('home'));
    closeModal(overlay);
  });

  // Confetti!
  launchConfetti();
}

// ===== CONFETTI =====
export function launchConfetti() {
  const container = document.getElementById('confetti-container');
  const colors = ['#4ade80', '#fbbf24', '#60a5fa', '#f472b6', '#a78bfa', '#22d3ee'];

  for (let i = 0; i < 60; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.cssText = `
      left: ${Math.random() * 100}%;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      width: ${Math.random() * 8 + 6}px;
      height: ${Math.random() * 8 + 6}px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      --dur: ${Math.random() * 1.5 + 1.5}s;
      --delay: ${Math.random() * 0.5}s;
    `;
    container.appendChild(piece);
    setTimeout(() => piece.remove(), 3000);
  }
}
