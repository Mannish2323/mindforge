// =====================================================
// JLPT PLAN PAGE — N5 2-month study plan + N5→N1 levels
// =====================================================

const JLPT_LEVELS = [
  {
    id: 'n5',
    level: 'N5',
    name: 'Beginner',
    kanji: 100,
    vocab: 800,
    grammar: 80,
    desc: 'Basic Japanese — greetings, numbers, simple sentences',
    color: 'var(--green-400)',
    examDates: ['July 2025', 'December 2025'],
    icon: '🌱',
  },
  {
    id: 'n4',
    level: 'N4',
    name: 'Elementary',
    kanji: 300,
    vocab: 1500,
    grammar: 120,
    desc: 'Elementary conversations, simple reading',
    color: 'var(--blue)',
    examDates: ['July 2025', 'December 2025'],
    icon: '🌿',
  },
  {
    id: 'n3',
    level: 'N3',
    name: 'Intermediate',
    kanji: 650,
    vocab: 3750,
    grammar: 180,
    desc: 'Everyday topics, news, intermediate kanji',
    color: 'var(--purple)',
    examDates: ['July 2025', 'December 2025'],
    icon: '🌳',
  },
  {
    id: 'n2',
    level: 'N2',
    name: 'Upper-Intermediate',
    kanji: 1000,
    vocab: 6000,
    grammar: 240,
    desc: 'Newspapers, business Japanese, complex kanji',
    color: 'var(--amber)',
    examDates: ['July 2025', 'December 2025'],
    icon: '🏔️',
  },
  {
    id: 'n1',
    level: 'N1',
    name: 'Advanced',
    kanji: 2000,
    vocab: 10000,
    grammar: 400,
    desc: 'Native-level — literature, academic, specialized',
    color: 'var(--red)',
    examDates: ['July 2025', 'December 2025'],
    icon: '👑',
  },
];

const N5_PLAN = [
  {
    month: 1,
    title: 'Month 1 — Foundation',
    weeks: [
      {
        week: 1,
        tasks: [
          'Learn Hiragana (あ→な rows) — 25 characters',
          'Greetings: おはようございます、こんにちは、こんばんは',
          'Numbers 1–10',
          'Practice: 15 minutes daily listening',
        ],
      },
      {
        week: 2,
        tasks: [
          'Complete Hiragana (は→ん rows) — remaining 21 chars',
          'Voiced sounds: が、ざ、だ、ば、ぱ rows',
          'Self-introduction: わたしは〜です',
          'Vocab: Family members (父、母、兄、姉...)',
        ],
      },
      {
        week: 3,
        tasks: [
          'Start Katakana (ア→ノ rows)',
          'Numbers 11–100 + counters',
          'Grammar: は Particle (topic marker)',
          'Grammar: の Particle (possession)',
          'Vocab: Colors (赤、青、白、黒...)',
        ],
      },
      {
        week: 4,
        tasks: [
          'Complete Katakana',
          'Grammar: を Particle (object marker)',
          'Grammar: に/へ (direction/time)',
          'Basic verbs: 食べます、飲みます、行きます',
          'Review Week 1–3 with flashcards',
        ],
      },
    ],
  },
  {
    month: 2,
    title: 'Month 2 — Building Up',
    weeks: [
      {
        week: 1,
        tasks: [
          'N5 Kanji batch 1: 日、月、火、水、木、金、土 (Days)',
          'Grammar: ～ます form (polite verb conjugation)',
          'Telling time: 何時ですか？',
          'Shopping phrases: いくらですか？',
        ],
      },
      {
        week: 2,
        tasks: [
          'N5 Kanji batch 2: 山、川、田、人、口、手、目',
          'Grammar: ～ません (negative polite)',
          'Grammar: ～ましたか (past tense question)',
          'Locations: 学校、駅、病院、コンビニ',
        ],
      },
      {
        week: 3,
        tasks: [
          'N5 Kanji batch 3: 大、小、上、下、中、右、左',
          'Grammar: ～たい (want to do)',
          'Grammar: ～てください (please do)',
          'Giving directions: まっすぐ、右に曲がる',
        ],
      },
      {
        week: 4,
        tasks: [
          'Full N5 mock test practice',
          'Weak area review — SRS flashcard session',
          'Listening practice: JLPT N5 sample audio',
          'Reading practice: Simple N5 texts',
          '🎯 You are ready for JLPT N5!',
        ],
      },
    ],
  },
];

// =====================================================
// RENDER
// =====================================================

import { Icons } from '../components/icons.js';

export function renderJLPT(container) {
  const levelIcons = {
    '🌱': Icons.level1(),
    '🌿': Icons.level2(),
    '🌳': Icons.level3(),
    '🏔️': Icons.level4(),
    '👑': Icons.level5()
  };

  const tipIcons = {
    '⏰': Icons.time(),
    '🔊': Icons.speaker(),
    '🃏': Icons.review(),
    '📺': Icons.book(),
    '✍️': Icons.kana()
  };

  container.innerHTML = `
    <div class="page-jlpt page-enter">
      <!-- Hero -->
      <div class="jlpt-hero">
        <div style="font-size: var(--text-sm); color: var(--text-muted); margin-bottom: var(--space-2); font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
          Japanese Language Proficiency Test
        </div>
        <h2>JLPT N5 → N1</h2>
        <p>Your complete roadmap to Japanese fluency</p>
        <div style="margin-top: var(--space-5); display: flex; gap: var(--space-3); justify-content: center; flex-wrap: wrap; align-items: center;">
          <div class="badge badge-green" style="display: inline-flex; align-items: center; gap: 4px;">${Icons.time()} Exams: July & December</div>
          <div class="badge badge-amber" style="display: inline-flex; align-items: center; gap: 4px;">${Icons.xp()} Your Goal: N5</div>
        </div>
      </div>

      <!-- Level Cards (horizontal scroll) -->
      <div class="section-title">All JLPT Levels</div>
      <div class="jlpt-levels-row">
        ${JLPT_LEVELS.map(lv => `
          <div class="jlpt-level-card ${lv.id}">
            <div style="font-size: 32px; margin-bottom: var(--space-2); display: inline-flex; align-items: center; justify-content: center;">${levelIcons[lv.icon] || Icons.level1()}</div>
            <div class="jlpt-level-badge" style="color: ${lv.color};">${lv.level}</div>
            <div class="jlpt-level-name">${lv.name}</div>
            <div class="jlpt-level-words" style="margin-top: 4px;">
              ${lv.vocab.toLocaleString()} vocab · ${lv.kanji} kanji
            </div>
            <div style="font-size: var(--text-xs); color: var(--text-secondary); margin-top: var(--space-3); line-height: 1.5;">
              ${lv.desc}
            </div>
            <div class="jlpt-level-date" style="display: flex; align-items: center; gap: 4px; justify-content: center;">
              ${Icons.time()} ${lv.examDates.join(' · ')}
            </div>
          </div>
        `).join('')}
      </div>

      <!-- N5 2-Month Study Plan -->
      <div class="study-plan-section">
        <h3>📅 N5 in 2 Months — Study Plan</h3>
        <div style="color: var(--text-secondary); font-size: var(--text-sm); margin-bottom: var(--space-5);">
          15–20 min/day. Tap a month to expand the week-by-week plan.
        </div>
        ${N5_PLAN.map(month => `
          <div class="month-block">
            <div class="month-header" data-month="${month.month}">
              <div class="month-num">${month.month}</div>
              <div class="month-title">${month.title}</div>
              <div class="month-toggle" id="toggle-${month.month}">▼</div>
            </div>
            <div class="month-body" id="month-body-${month.month}">
              ${month.weeks.map(w => `
                <div class="week-row">
                  <div class="week-num">W${w.week}</div>
                  <div class="week-tasks">
                    ${w.tasks.map(t => `<div class="task-item">${t}</div>`).join('')}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Quick Tips -->
      <div style="margin-top: var(--space-6);">
        <div class="section-title">💡 Study Tips</div>
        <div class="card">
          <div style="display: flex; flex-direction: column; gap: var(--space-3);">
            ${[
              { icon: '⏰', tip: 'Study daily — 15 min is better than 2 hrs once a week' },
              { icon: '🔊', tip: 'Always listen to pronunciation — use the Hiragana chart TTS' },
              { icon: '🃏', tip: 'Use spaced repetition (Review tab) for vocabulary retention' },
              { icon: '📺', tip: 'Watch anime or J-dramas with Japanese subtitles' },
              { icon: '✍️', tip: 'Write Hiragana by hand — muscle memory helps a lot' },
            ].map(s => `
              <div style="display: flex; gap: var(--space-3); align-items: flex-start;">
                <span style="font-size: 20px; flex-shrink: 0; display: inline-flex;">${tipIcons[s.icon] || Icons.tips()}</span>
                <span style="font-size: var(--text-sm); color: var(--text-secondary); line-height: 1.6;">${s.tip}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  // Toggle month accordion
  container.querySelectorAll('.month-header').forEach(header => {
    const monthNum = header.dataset.month;
    const body    = document.getElementById(`month-body-${monthNum}`);
    const toggle  = document.getElementById(`toggle-${monthNum}`);
    let open = true;
 
    header.addEventListener('click', () => {
      open = !open;
      body.style.display = open ? 'block' : 'none';
      toggle.classList.toggle('open', open);
    });
  });
}
