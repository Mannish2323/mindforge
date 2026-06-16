// =====================================================
// HOME PAGE — Unit Map / Learn Path
// =====================================================

import { store } from '../state/store.js';

let _navigate = () => {};
export function setHomeNavigate(fn) { _navigate = fn; }

let unitsIndex = null;
let lessonsCache = {};

export async function renderHome(container) {
  container.innerHTML = `
    <div class="page-home page-enter">
      <div class="home-header">
        <h2>日本語を学ぼう</h2>
        <p>Learn Japanese — All Units</p>
      </div>
      <div id="units-list">
        <div class="empty-state">
          <div class="empty-icon">⌛</div>
          <h3>Loading lessons…</h3>
        </div>
      </div>
    </div>
  `;

  try {
    if (!unitsIndex) {
      const res = await fetch('/data/config/units_index.json');
      unitsIndex = await res.json();
    }
    renderUnits();
  } catch (e) {
    document.getElementById('units-list').innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">❌</div>
        <h3>Failed to load</h3>
        <p>Please refresh the page</p>
      </div>
    `;
  }
}

function renderUnits() {
  const list = document.getElementById('units-list');
  if (!list) return;

  list.innerHTML = unitsIndex.units.map((unit, unitIdx) => {
    const lessons = getLessonIds(unit);
    const prog = store.getLessonProgress(lessons);
    const pct  = prog.pct * 100;
    const r    = 20;
    const circ = 2 * Math.PI * r;
    const offset = circ * (1 - prog.pct);

    return `
      <div class="unit-section">
        <div class="unit-header">
          <div class="unit-icon">${unit.icon}</div>
          <div class="unit-meta">
            <h3>Unit ${unitIdx + 1}: ${unit.unit_title}</h3>
            <p>${prog.completed}/${prog.total} lessons · ${Math.round(pct)}% complete</p>
          </div>
          <div class="unit-progress">
            <svg width="48" height="48" viewBox="0 0 48 48">
              <circle class="bg"   cx="24" cy="24" r="${r}" />
              <circle class="fill" cx="24" cy="24" r="${r}"
                stroke-dasharray="${circ}"
                stroke-dashoffset="${offset}" />
            </svg>
          </div>
        </div>
        <div class="lessons-grid" id="unit-${unit.unit_id}">
          ${renderLessonSkeleton(unit.total_lessons)}
        </div>
      </div>
    `;
  }).join('');

  // Load lesson details for each unit
  unitsIndex.units.forEach(unit => loadUnitLessons(unit));
}

function getLessonIds(unit) {
  // Generate pseudo lesson IDs based on unit structure
  return Array.from({ length: unit.total_lessons }, (_, i) =>
    `${unit.unit_id}_l0${i + 1}`
  );
}

function renderLessonSkeleton(count) {
  return Array.from({ length: count }, (_, i) => `
    <div class="lesson-card" style="opacity: 0.4;">
      <div class="lesson-icon">📝</div>
      <div class="lesson-info">
        <h4>Lesson ${i + 1}</h4>
        <p>Loading…</p>
      </div>
    </div>
  `).join('');
}

async function loadUnitLessons(unit) {
  const container = document.getElementById(`unit-${unit.unit_id}`);
  if (!container) return;

  try {
    if (!lessonsCache[unit.unit_id]) {
      const res = await fetch(`/data/lessons/${unit.unit_id}.json`);
      lessonsCache[unit.unit_id] = await res.json();
    }

    const data = lessonsCache[unit.unit_id];
    container.innerHTML = data.lessons.map((lesson, idx) => {
      const isCompleted = store.isLessonCompleted(lesson.lesson_id);
      const prevLesson  = idx > 0 ? data.lessons[idx - 1] : null;
      const isLocked    = !isCompleted && prevLesson && !store.isLessonCompleted(prevLesson.lesson_id) && idx > 0;

      return `
        <div class="lesson-card ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''}"
             data-lesson="${lesson.lesson_id}"
             data-unit="${unit.unit_id}"
             ${!isLocked ? 'tabindex="0"' : ''}>
          <div class="lesson-icon">
            ${isCompleted ? '✅' : isLocked ? '🔒' : getLessonIcon(lesson.lesson_title)}
          </div>
          <div class="lesson-info">
            <h4>${lesson.lesson_title}</h4>
            <p>${lesson.vocabulary?.length ?? 0} words · ${lesson.difficulty}</p>
          </div>
          <div class="lesson-xp">+${lesson.xp_reward} XP</div>
        </div>
      `;
    }).join('');

    // Click handlers
    container.querySelectorAll('.lesson-card:not(.locked)').forEach(card => {
      card.addEventListener('click', () => {
        _navigate('lesson', {
          unitId: card.dataset.unit,
          lessonId: card.dataset.lesson,
          unitData: lessonsCache[unit.unit_id],
        });
      });
    });

  } catch (e) {
    console.warn('Failed to load unit', unit.unit_id, e);
  }
}

function getLessonIcon(title) {
  const t = title.toLowerCase();
  if (t.includes('hello') || t.includes('greeting')) return '👋';
  if (t.includes('number')) return '🔢';
  if (t.includes('food') || t.includes('eat')) return '🍜';
  if (t.includes('color')) return '🎨';
  if (t.includes('family')) return '👨‍👩‍👧';
  if (t.includes('time') || t.includes('day')) return '🕐';
  if (t.includes('location') || t.includes('place')) return '📍';
  if (t.includes('verb') || t.includes('action')) return '🏃';
  if (t.includes('intro')) return '👤';
  return '📝';
}
