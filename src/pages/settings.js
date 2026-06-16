// =====================================================
// SETTINGS PAGE
// =====================================================

import { store } from '../state/store.js';
import { showToast } from '../components/modal.js';

let _navigate = () => {};
export function setSettingsNavigate(fn) { _navigate = fn; }

export function renderSettings(container) {
  const state = store.get();

  container.innerHTML = `
    <div class="page-settings page-enter">
      <div style="padding: var(--space-5) 0 var(--space-3);">
        <h2 style="font-size: var(--text-xl); font-weight: 800;">Settings</h2>
        <p style="color: var(--text-muted); font-size: var(--text-sm); margin-top: 4px;">Customize your Velmorth experience</p>
      </div>

      <!-- Appearance -->
      <div class="settings-section">
        <h3>Appearance</h3>
        <div class="setting-row" id="theme-row">
          <div class="setting-icon">🌙</div>
          <div class="setting-text">
            <div class="s-title">Dark Mode</div>
            <div class="s-sub">Switch between dark and light theme</div>
          </div>
          <div class="toggle ${state.theme === 'dark' ? 'on' : ''}" id="theme-toggle"></div>
        </div>
      </div>

      <!-- Learning -->
      <div class="settings-section">
        <h3>Learning</h3>
        <div class="setting-row" id="tts-row">
          <div class="setting-icon">🔊</div>
          <div class="setting-text">
            <div class="s-title">Text-to-Speech</div>
            <div class="s-sub">Auto-speak Japanese after correct answers</div>
          </div>
          <div class="toggle ${state.ttsEnabled ? 'on' : ''}" id="tts-toggle"></div>
        </div>
        <div class="setting-row" id="lang-row">
          <div class="setting-icon">🌐</div>
          <div class="setting-text">
            <div class="s-title">UI Language</div>
            <div class="s-sub">${state.uiLang === 'en' ? 'English' : 'हिंदी'}</div>
          </div>
          <div style="font-size: var(--text-sm); color: var(--text-muted);">›</div>
        </div>
      </div>

      <!-- Account -->
      <div class="settings-section">
        <h3>Account</h3>
        <div class="setting-row" id="refill-row">
          <div class="setting-icon">❤️</div>
          <div class="setting-text">
            <div class="s-title">Refill Hearts</div>
            <div class="s-sub">Costs 50 💎 gems — You have ${state.gems} gems</div>
          </div>
          <div class="badge badge-red">50💎</div>
        </div>
        <div class="setting-row" id="reset-row">
          <div class="setting-icon">🔄</div>
          <div class="setting-text">
            <div class="s-title">Reset Progress</div>
            <div class="s-sub">Clear all lesson progress and XP</div>
          </div>
          <div style="font-size: var(--text-sm); color: var(--red);">›</div>
        </div>
      </div>

      <!-- About -->
      <div class="settings-section">
        <h3>About</h3>
        <div class="setting-row">
          <div class="setting-icon">🌿</div>
          <div class="setting-text">
            <div class="s-title">Velmorth</div>
            <div class="s-sub">Version 2.0 — Web Edition</div>
          </div>
        </div>
        <div class="setting-row">
          <div class="setting-icon">📊</div>
          <div class="setting-text">
            <div class="s-title">JLPT Study Plan</div>
            <div class="s-sub">View your N5 study roadmap</div>
          </div>
          <div style="font-size: var(--text-sm); color: var(--text-muted);">›</div>
        </div>
        <div class="setting-row">
          <div class="setting-icon">💬</div>
          <div class="setting-text">
            <div class="s-title">Basic Phrases</div>
            <div class="s-sub">Quick reference for common phrases</div>
          </div>
          <div style="font-size: var(--text-sm); color: var(--text-muted);">›</div>
        </div>
      </div>

      <div style="text-align: center; padding: var(--space-6) 0; color: var(--text-muted); font-size: var(--text-xs);">
        Made with ❤️ for Japanese learners
        <br/>日本語を一緒に学ぼう！
      </div>
    </div>
  `;

  // Dark mode toggle
  document.getElementById('theme-row').addEventListener('click', () => {
    const newTheme = state.theme === 'dark' ? 'light' : 'dark';
    store.setTheme(newTheme);
    state.theme = newTheme;
    const toggle = document.getElementById('theme-toggle');
    toggle?.classList.toggle('on', newTheme === 'dark');
    showToast(`${newTheme === 'dark' ? '🌙 Dark' : '☀️ Light'} mode enabled`, 'info');
  });

  // TTS toggle
  document.getElementById('tts-row').addEventListener('click', () => {
    const enabled = store.toggleTTS();
    document.getElementById('tts-toggle')?.classList.toggle('on', enabled);
    showToast(`TTS ${enabled ? 'enabled 🔊' : 'disabled 🔇'}`, 'info');
  });

  // Language toggle
  document.getElementById('lang-row').addEventListener('click', () => {
    const newLang = state.uiLang === 'en' ? 'hi' : 'en';
    store.setUILang(newLang);
    showToast(`Language: ${newLang === 'en' ? 'English' : 'हिंदी'}`, 'info');
    renderSettings(container);
  });

  // Refill hearts
  document.getElementById('refill-row').addEventListener('click', () => {
    const s = store.get();
    if (s.hearts >= s.maxHearts) {
      showToast('Hearts are already full! ❤️', 'info');
    } else if (store.spendGems(50)) {
      store.refillHearts();
      showToast('Hearts refilled! ❤️❤️❤️❤️❤️', 'success');
      renderSettings(container);
    } else {
      showToast('Not enough gems! Earn more by completing lessons.', 'error');
    }
  });

  // Reset progress
  document.getElementById('reset-row').addEventListener('click', () => {
    if (confirm('⚠️ This will delete ALL your progress. Are you sure?')) {
      localStorage.clear();
      showToast('Progress reset. Starting fresh!', 'info');
      setTimeout(() => window.location.reload(), 1000);
    }
  });

  // JLPT link
  container.querySelectorAll('.setting-row').forEach(row => {
    const title = row.querySelector('.s-title')?.textContent;
    if (title === 'JLPT Study Plan') row.addEventListener('click', () => _navigate('jlpt'));
    if (title === 'Basic Phrases')    row.addEventListener('click', () => _navigate('phrases'));
  });
}
