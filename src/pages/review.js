// =====================================================
// SPACED REPETITION REVIEW — Flashcard flip
// Uses SM-2 algorithm via store
// =====================================================

import { store } from '../state/store.js';
import { speakJapanese } from './hiragana.js';
import { showToast } from '../components/modal.js';
import { Icons } from '../components/icons.js';

let allVocab     = {};
let reviewQueue  = [];
let currentIdx   = 0;
let isFlipped    = false;
let sessionStats = { done: 0, easy: 0, ok: 0, hard: 0 };

export async function renderReview(container) {
  container.innerHTML = `
    <div class="page-review page-enter">
      <div class="empty-state" style="padding-top: 60px;">
        <div class="empty-icon" style="font-size: 40px;">${Icons.loading()}</div>
        <h3>Loading review cards…</h3>
      </div>
    </div>
  `;

  // Load all vocabulary from lessons
  await loadAllVocab();

  const dueIds = store.getDueCards();
  const dueVocab = dueIds.map(id => allVocab[id]).filter(Boolean);

  // If no due cards, pick random ones for practice
  let queue = dueVocab;
  if (queue.length === 0) {
    const allIds = Object.keys(allVocab);
    queue = allIds.slice(0, 15).map(id => allVocab[id]);
  }

  reviewQueue  = queue;
  currentIdx   = 0;
  sessionStats = { done: 0, easy: 0, ok: 0, hard: 0 };

  if (reviewQueue.length === 0) {
    renderEmptyReview(container);
    return;
  }

  renderCard(container);
}

async function loadAllVocab() {
  if (Object.keys(allVocab).length > 0) return;

  const units = [
    'ja_u01_greetings', 'ja_u02_numbers', 'ja_u03_self_intro',
    'ja_u04_objects', 'ja_u05_time', 'ja_u06_family',
    'ja_u07_food', 'ja_u08_colors', 'ja_u09_locations', 'ja_u10_verbs',
  ];

  await Promise.allSettled(units.map(async unitId => {
    try {
      const res  = await fetch(`/data/lessons/${unitId}.json`);
      const data = await res.json();
      data.lessons.forEach(lesson => {
        lesson.vocabulary?.forEach(v => {
          allVocab[v.vocab_id] = v;
        });
      });
    } catch (e) {}
  }));
}

function renderCard(container) {
  if (currentIdx >= reviewQueue.length) {
    renderSessionComplete(container);
    return;
  }

  isFlipped = false;
  const vocab = reviewQueue[currentIdx];
  const progress = ((currentIdx) / reviewQueue.length) * 100;

  container.innerHTML = `
    <div class="page-review page-enter">
      <div class="review-header">
        <div style="font-size: var(--text-sm); font-weight: 700; color: var(--text-muted);">
          Spaced Repetition Review
        </div>
        <div class="review-counter">${currentIdx + 1} / ${reviewQueue.length}</div>
      </div>

      <!-- Progress bar -->
      <div style="height: 4px; background: var(--bg-surface); border-radius: var(--radius-full); margin-bottom: var(--space-5); overflow: hidden;">
        <div style="height: 100%; width: ${progress}%; background: var(--grad-primary); border-radius: var(--radius-full); transition: width 0.5s ease;"></div>
      </div>

      <!-- Flashcard -->
      <div class="flashcard-scene">
        <div class="flashcard" id="flashcard" role="button" tabindex="0"
             aria-label="Flashcard — tap to flip">
          <!-- Front -->
          <div class="flashcard-face flashcard-front">
            <div class="flashcard-kana">${vocab.kanji}</div>
            <div class="flashcard-hint">Tap to see meaning →</div>
            <button style="margin-top: var(--space-4); background: var(--bg-surface); border: 1px solid var(--border); padding: 8px 16px; border-radius: var(--radius-full); color: var(--text-secondary); font-size: var(--text-sm); cursor: pointer; display: inline-flex; align-items: center; gap: 6px;"
                    id="listen-btn">${Icons.speaker()} Listen</button>
          </div>
          <!-- Back -->
          <div class="flashcard-face flashcard-back">
            <div class="flashcard-meaning">${vocab.meaning_en}</div>
            <div class="flashcard-romaji">${vocab.romaji}</div>
            ${vocab.meaning_hi ? `<div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: var(--space-2);">${vocab.meaning_hi}</div>` : ''}
          </div>
        </div>
      </div>

      <!-- Session stats mini -->
      <div style="display: flex; gap: var(--space-3); justify-content: center; margin-bottom: var(--space-4); align-items: center;">
        <span style="font-size: var(--text-xs); color: var(--red); display: inline-flex; align-items: center; gap: 4px;">${Icons.hard()} ${sessionStats.hard}</span>
        <span style="font-size: var(--text-xs); color: var(--amber); display: inline-flex; align-items: center; gap: 4px;">${Icons.ok()} ${sessionStats.ok}</span>
        <span style="font-size: var(--text-xs); color: var(--green-400); display: inline-flex; align-items: center; gap: 4px;">${Icons.easy()} ${sessionStats.easy}</span>
      </div>

      <!-- Review actions (hidden until flipped) -->
      <div class="review-actions" id="review-actions" style="opacity: 0; pointer-events: none; transition: opacity 0.3s ease;">
        <button class="review-btn hard" id="btn-hard">
          <span class="r-icon" style="display: inline-flex; font-size: 20px;">${Icons.hard()}</span>
          <span>Hard</span>
          <span style="font-size: 9px; color: inherit; opacity: 0.7;">1 day</span>
        </button>
        <button class="review-btn ok" id="btn-ok">
          <span class="r-icon" style="display: inline-flex; font-size: 20px;">${Icons.ok()}</span>
          <span>Ok</span>
          <span style="font-size: 9px; color: inherit; opacity: 0.7;">3 days</span>
        </button>
        <button class="review-btn easy" id="btn-easy">
          <span class="r-icon" style="display: inline-flex; font-size: 20px;">${Icons.easy()}</span>
          <span>Easy</span>
          <span style="font-size: 9px; color: inherit; opacity: 0.7;">7 days</span>
        </button>
      </div>

      <!-- Flip hint -->
      <div id="flip-hint" style="text-align: center; color: var(--text-muted); font-size: var(--text-sm); margin-top: var(--space-4);">
        Tap the card to reveal the answer
      </div>
    </div>
  `;

  // Flip card
  const card = document.getElementById('flashcard');
  const actions = document.getElementById('review-actions');
  const hint = document.getElementById('flip-hint');

  const flipCard = () => {
    isFlipped = !isFlipped;
    card.classList.toggle('flipped', isFlipped);
    if (isFlipped) {
      actions.style.opacity = '1';
      actions.style.pointerEvents = 'all';
      hint.style.display = 'none';
      speakJapanese(vocab.kanji);
    }
  };

  card.addEventListener('click', flipCard);
  card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') flipCard(); });

  // Listen button
  document.getElementById('listen-btn').addEventListener('click', e => {
    e.stopPropagation();
    speakJapanese(vocab.kanji);
  });

  // Review buttons
  document.getElementById('btn-hard').addEventListener('click', () => submitReview(0, container));
  document.getElementById('btn-ok').addEventListener('click',   () => submitReview(1, container));
  document.getElementById('btn-easy').addEventListener('click', () => submitReview(2, container));
}

function submitReview(quality, container) {
  if (!isFlipped) return;
  const vocab = reviewQueue[currentIdx];
  store.updateSRSCard(vocab.vocab_id, quality);

  const labels = ['hard', 'ok', 'easy'];
  sessionStats[labels[quality]]++;
  sessionStats.done++;

  const xpMap = [0, 2, 5];
  if (xpMap[quality] > 0) store.addXP(xpMap[quality]);

  currentIdx++;
  renderCard(container);
}

function renderEmptyReview(container) {
  container.innerHTML = `
    <div class="page-review page-enter">
      <div class="empty-state" style="padding-top: 80px;">
        <div class="empty-icon" style="font-size: 48px;">${Icons.check()}</div>
        <h3>All caught up!</h3>
        <p>Complete more lessons to get words to review.</p>
        <button class="btn btn-primary mt-5" onclick="window.navigate?.('home')">
          Go to Lessons
        </button>
      </div>
    </div>
  `;
}

function renderSessionComplete(container) {
  const accuracy = reviewQueue.length > 0
    ? Math.round((sessionStats.easy + sessionStats.ok) / reviewQueue.length * 100)
    : 0;

  container.innerHTML = `
    <div class="page-review page-enter">
      <div style="text-align: center; padding: var(--space-10) var(--space-5);">
        <div style="font-size: 64px; margin-bottom: var(--space-5); display: inline-flex; align-items: center; justify-content: center;">${Icons.trophy()}</div>
        <h2 style="font-size: var(--text-2xl); font-weight: 800; margin-bottom: var(--space-3);">Session Complete!</h2>
        <p style="color: var(--text-secondary); margin-bottom: var(--space-6);">Great work on your review session!</p>

        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: var(--space-3); margin-bottom: var(--space-6);">
          <div class="stat-card">
            <div class="s-val">${reviewQueue.length}</div>
            <div class="s-label">Cards</div>
          </div>
          <div class="stat-card">
            <div class="s-val" style="color: var(--green-400);">${accuracy}%</div>
            <div class="s-label">Accuracy</div>
          </div>
          <div class="stat-card">
            <div class="s-val" style="color: var(--amber);">+${sessionStats.easy * 5 + sessionStats.ok * 2} XP</div>
            <div class="s-label">Earned</div>
          </div>
        </div>

        <div style="display: flex; gap: var(--space-3); flex-direction: column;">
          <button class="btn btn-primary btn-full btn-lg" id="review-again">Review Again</button>
          <button class="btn btn-ghost btn-full" id="go-home-btn">Back to Home</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('review-again').addEventListener('click', () => {
    currentIdx = 0;
    sessionStats = { done: 0, easy: 0, ok: 0, hard: 0 };
    renderCard(container);
  });

  document.getElementById('go-home-btn').addEventListener('click', () => {
    import('../main.js').then(({ navigate }) => navigate('home'));
  });
}
