// =====================================================
// HOME PAGE — Unit Map / Learn Path
// =====================================================

import { store } from '../state/store.js';
import { Icons } from '../components/icons.js';

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
          <div class="empty-icon" style="font-size: 40px;">${Icons.loading()}</div>
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
        <div class="empty-icon" style="font-size: 40px; color: var(--red);">${Icons.close()}</div>
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
        <div class="unit-header" style="align-items: center;">
          <div class="unit-icon" style="display: inline-flex; align-items: center; justify-content: center; font-size: 32px; width: 44px; height: 44px; background: var(--bg-surface); border-radius: var(--radius-md);">${getUnitIcon(unit.unit_id)}</div>
          <div class="unit-meta" style="margin-left: 8px;">
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
      <div class="lesson-icon" style="display: inline-flex; align-items: center; justify-content: center;">${Icons.book()}</div>
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
          <div class="lesson-icon" style="display: inline-flex; align-items: center; justify-content: center; font-size: 20px;">
            ${isCompleted ? Icons.check() : isLocked ? Icons.lock() : getLessonIcon(lesson.lesson_title)}
          </div>
          <div class="lesson-info">
            <h4>${lesson.lesson_title}</h4>
            <p>${lesson.vocabulary?.length ?? 0} words · ${lesson.difficulty}</p>
          </div>
          <div class="lesson-xp" style="display: inline-flex; align-items: center; gap: 4px;">+${lesson.xp_reward} XP</div>
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

function getUnitIcon(unitId) {
  if (unitId.includes('greetings')) return Icons.greetings();
  if (unitId.includes('numbers')) return Icons.numbers();
  if (unitId.includes('self_intro')) return Icons.user();
  if (unitId.includes('objects')) return Icons.book();
  if (unitId.includes('time')) return Icons.time();
  if (unitId.includes('family')) return Icons.family();
  if (unitId.includes('food')) return Icons.food();
  if (unitId.includes('colors')) return Icons.art();
  if (unitId.includes('locations')) return Icons.location();
  if (unitId.includes('verbs')) return Icons.verb();
  return Icons.book();
}

function getLessonIcon(title) {
  const t = title.toLowerCase();
  if (t.includes('hello') || t.includes('greeting')) return Icons.greetings();
  if (t.includes('number')) return Icons.numbers();
  if (t.includes('food') || t.includes('eat')) return Icons.food();
  if (t.includes('color')) return Icons.art();
  if (t.includes('family')) return Icons.family();
  if (t.includes('time') || t.includes('day')) return Icons.time();
  if (t.includes('location') || t.includes('place')) return Icons.location();
  if (t.includes('verb') || t.includes('action')) return Icons.verb();
  if (t.includes('intro')) return Icons.user();
  return Icons.book();
}
