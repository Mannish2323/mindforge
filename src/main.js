// =====================================================
// VELMORTH MAIN — Router + App Bootstrap
// =====================================================

import './style.css';
import { store } from './state/store.js';
import { renderTopbar } from './components/topbar.js';
import { renderNavbar, updateNavbar, setNavHandlers } from './components/navbar.js';

// =====================================================
// ROUTER
// =====================================================

let _currentRoute  = 'home';
let _routeParams   = {};
let _pageRenderers = {};

export function currentRoute() { return _currentRoute; }

export function navigate(route, params = {}) {
  _currentRoute = route;
  _routeParams  = params;
  updateNavbar(route);
  renderPage(route, params);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function renderPage(route, params) {
  const content = document.getElementById('page-content');
  if (!content) return;

  // Show loading state briefly
  content.style.opacity = '0.5';

  try {
    switch (route) {
      case 'home': {
        const { renderHome } = await import('./pages/home.js');
        content.style.opacity = '1';
        await renderHome(content);
        break;
      }
      case 'lesson': {
        const { renderLessonPlayer } = await import('./pages/lesson-player.js');
        content.style.opacity = '1';
        renderLessonPlayer(content, params);
        break;
      }
      case 'hiragana': {
        const { renderHiragana } = await import('./pages/hiragana.js');
        content.style.opacity = '1';
        renderHiragana(content);
        break;
      }
      case 'jlpt': {
        const { renderJLPT } = await import('./pages/jlpt-plan.js');
        content.style.opacity = '1';
        renderJLPT(content);
        break;
      }
      case 'phrases': {
        const { renderPhrases } = await import('./pages/phrases.js');
        content.style.opacity = '1';
        renderPhrases(content);
        break;
      }
      case 'review': {
        const { renderReview } = await import('./pages/review.js');
        content.style.opacity = '1';
        await renderReview(content);
        break;
      }
      case 'leaderboard': {
        const { renderLeaderboard } = await import('./pages/leaderboard.js');
        content.style.opacity = '1';
        renderLeaderboard(content);
        break;
      }
      case 'profile': {
        const { renderProfile } = await import('./pages/profile.js');
        content.style.opacity = '1';
        renderProfile(content);
        break;
      }
      case 'settings': {
        const { renderSettings } = await import('./pages/settings.js');
        content.style.opacity = '1';
        renderSettings(content);
        break;
      }
      default: {
        content.style.opacity = '1';
        content.innerHTML = `
          <div class="empty-state" style="padding-top: 100px;">
            <div class="empty-icon">🗺️</div>
            <h3>Page not found</h3>
            <p>Route: ${route}</p>
            <button class="btn btn-primary mt-5" id="go-home">Go Home</button>
          </div>
        `;
        document.getElementById('go-home')?.addEventListener('click', () => navigate('home'));
      }
    }
  } catch (err) {
    content.style.opacity = '1';
    console.error('Page render error:', err);
    content.innerHTML = `
      <div class="empty-state" style="padding-top: 100px;">
        <div class="empty-icon">❌</div>
        <h3>Something went wrong</h3>
        <p>${err.message}</p>
        <button class="btn btn-primary mt-5" id="err-home">Go Home</button>
      </div>
    `;
    document.getElementById('err-home')?.addEventListener('click', () => navigate('home'));
  }
}

// =====================================================
// APP BOOTSTRAP
// =====================================================

async function bootstrap() {
  // Apply saved theme immediately
  const savedTheme = store.get('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  // Wait for fonts + a tiny delay for splash animation
  await new Promise(resolve => setTimeout(resolve, 1800));

  // Fade out splash
  const splash = document.getElementById('splash-screen');
  splash?.classList.add('fade-out');

  await new Promise(resolve => setTimeout(resolve, 600));
  splash?.remove();

  // Show app shell
  const shell = document.getElementById('app-shell');
  shell?.classList.remove('hidden');

  // Render layout components
  renderTopbar();
  setNavHandlers(navigate, currentRoute);
  renderNavbar();

  // Initialize page-specific navigate handlers
  import('./pages/home.js').then(({ setHomeNavigate }) => setHomeNavigate(navigate));
  import('./pages/lesson-player.js').then(({ setLessonNavigate }) => setLessonNavigate(navigate));
  import('./pages/profile.js').then(({ setProfileNavigate }) => setProfileNavigate(navigate));
  import('./pages/settings.js').then(({ setSettingsNavigate }) => setSettingsNavigate(navigate));



  // Handle hash routing (e.g. #hiragana, #jlpt, #phrases)
  const hash = window.location.hash.replace('#', '');
  const validRoutes = ['home', 'hiragana', 'jlpt', 'phrases', 'review', 'leaderboard', 'profile', 'settings'];
  const startRoute = validRoutes.includes(hash) ? hash : 'home';

  // Navigate to start page
  navigate(startRoute);

  // Update hash on navigation
  const origNavigate = navigate;

  // Register service worker for PWA
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('/service-worker.js');
    } catch (e) {
      // SW registration failed silently — app still works
    }
  }

  // Preload voices for TTS
  if (window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
    window.speechSynthesis.getVoices();
  }
}

// =====================================================
// START
// =====================================================

document.addEventListener('DOMContentLoaded', bootstrap);
