// =====================================================
// LESSON PLAYER — Full MCQ Quiz Engine
// 4 question types: translate, pick-kana, pick-meaning, tap-arrange
// =====================================================

import { store } from '../state/store.js';
import { showLessonComplete, showToast } from '../components/modal.js';
import { speakJapanese } from './hiragana.js';

let _navigate = (r) => {};
export function setLessonNavigate(fn) { _navigate = fn; }

let lessonData   = null;
let currentQIdx  = 0;
let questions    = [];
let correctCount = 0;
let selectedAns  = null;
let answered     = false;

export function renderLessonPlayer(container, params) {
  lessonData = params.unitData.lessons.find(l => l.lesson_id === params.lessonId);
  if (!lessonData) {
    container.innerHTML = `<div class="empty-state"><div class="empty-icon">❌</div><h3>Lesson not found</h3></div>`;
    return;
  }

  questions    = buildQuestions(lessonData);
  currentQIdx  = 0;
  correctCount = 0;
  selectedAns  = null;
  answered     = false;

  renderQuestion(container);
}

// =====================================================
// BUILD QUESTIONS
// =====================================================

function buildQuestions(lesson) {
  const vocab = lesson.vocabulary || [];
  const qs = [];

  vocab.forEach((v, i) => {
    // Q1: What does this Japanese mean?
    qs.push({
      type: 'mcq-meaning',
      prompt: 'What does this mean?',
      japanese: v.kanji,
      romaji: v.romaji,
      correct: v.meaning_en,
      options: buildOptions(vocab, i, 'meaning_en'),
    });

    // Q2: How do you say this in Japanese?
    qs.push({
      type: 'mcq-japanese',
      prompt: 'How do you say this in Japanese?',
      english: v.meaning_en,
      correct: v.kanji,
      correctRomaji: v.romaji,
      options: buildOptions(vocab, i, 'kanji'),
      optionsRomaji: vocab.map(x => x.romaji),
    });
  });

  // Grammar example question if available
  if (lesson.grammar_point && lesson.examples?.length > 0) {
    const ex = lesson.examples[0];
    qs.push({
      type: 'translate',
      prompt: 'Translate this sentence:',
      japanese: ex.japanese,
      romaji: ex.romaji,
      correct: ex.translation_en,
      options: buildTranslateOptions(ex.translation_en),
    });
  }

  // Shuffle and limit to 8 questions
  return shuffle(qs).slice(0, 8);
}

function buildOptions(vocab, correctIdx, field) {
  const correct  = vocab[correctIdx][field];
  const others   = vocab
    .filter((_, i) => i !== correctIdx)
    .map(v => v[field])
    .filter(Boolean);
  const distractors = shuffle(others).slice(0, 3);
  return shuffle([correct, ...distractors]);
}

function buildTranslateOptions(correct) {
  const fakes = [
    'Nice to meet you.',
    'Good evening.',
    'Thank you very much.',
    'Excuse me.',
    'See you later.',
    'Good morning.',
    'I am sorry.',
    'How are you?',
  ].filter(s => s !== correct);
  return shuffle([correct, ...shuffle(fakes).slice(0, 3)]);
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

// =====================================================
// RENDER QUESTION
// =====================================================

function renderQuestion(container) {
  if (currentQIdx >= questions.length) {
    finishLesson(container);
    return;
  }

  const q    = questions[currentQIdx];
  const prog = ((currentQIdx) / questions.length) * 100;
  const hearts = store.get('hearts');
  const heartsHTML = Array.from({ length: 5 }, (_, i) =>
    `<span class="heart-icon ${i >= hearts ? 'lost' : ''}">❤️</span>`
  ).join('');

  container.innerHTML = `
    <div class="page-lesson page-enter">
      <!-- Progress Bar -->
      <div class="lesson-progress-bar-wrap">
        <button class="lesson-close-btn" id="lesson-close">✕</button>
        <div class="lesson-prog-bar">
          <div class="lesson-prog-fill" style="width: ${prog}%"></div>
        </div>
        <div class="lesson-hearts">${heartsHTML}</div>
      </div>

      <!-- Question Area -->
      <div class="question-area" id="question-area">
        ${renderQuestionContent(q)}
      </div>

      <!-- Answer Footer -->
      <div class="answer-footer" id="answer-footer">
        <button class="btn btn-primary btn-full btn-lg" id="check-btn" disabled>
          Check Answer
        </button>
      </div>
    </div>
  `;

  // Close button
  document.getElementById('lesson-close').addEventListener('click', () => {
    if (confirm('Leave this lesson?')) navigate('home');
  });

  // MCQ buttons
  container.querySelectorAll('.mcq-btn').forEach(btn => {
    btn.addEventListener('click', () => selectAnswer(btn, container));
  });

  // Tap exercise buttons
  container.querySelectorAll('.tap-btn').forEach(btn => {
    btn.addEventListener('click', () => selectTap(btn, container));
  });

  // Speak buttons
  container.querySelectorAll('[data-speak]').forEach(btn => {
    btn.addEventListener('click', () => {
      speakJapanese(btn.dataset.speak);
    });
  });

  // Check button
  document.getElementById('check-btn').addEventListener('click', () => {
    if (!answered) checkAnswer(container);
    else nextQuestion(container);
  });
}

function renderQuestionContent(q) {
  switch (q.type) {
    case 'mcq-meaning':
      return `
        <div class="question-type-label">🔤 Translate</div>
        <div class="question-japanese">${q.japanese}</div>
        <div class="question-romaji">${q.romaji}</div>
        <button class="btn btn-ghost btn-sm" style="margin: 0 auto var(--space-4); display:flex; gap:6px;"
                data-speak="${q.japanese}">🔊 Listen</button>
        <div class="mcq-options">
          ${q.options.map(opt => `
            <button class="mcq-btn" data-value="${opt}">${opt}</button>
          `).join('')}
        </div>
      `;

    case 'mcq-japanese':
      return `
        <div class="question-type-label">🇯🇵 Pick Japanese</div>
        <div class="question-prompt">${q.english}</div>
        <div class="mcq-options">
          ${q.options.map((opt, i) => `
            <button class="mcq-btn" data-value="${opt}">
              <span class="ja-text">${opt}</span>
              <span class="en-text">${q.optionsRomaji?.[i] || ''}</span>
            </button>
          `).join('')}
        </div>
      `;

    case 'translate':
      return `
        <div class="question-type-label">📝 Translate the sentence</div>
        <div class="question-japanese" style="font-size: var(--text-ja-md);">${q.japanese}</div>
        <div class="question-romaji">${q.romaji}</div>
        <button class="btn btn-ghost btn-sm" style="margin: 0 auto var(--space-4); display:flex; gap:6px;"
                data-speak="${q.japanese}">🔊 Listen</button>
        <div class="mcq-options" style="grid-template-columns: 1fr;">
          ${q.options.map(opt => `
            <button class="mcq-btn" data-value="${opt}" style="text-align:left;">${opt}</button>
          `).join('')}
        </div>
      `;

    default:
      return '';
  }
}

// =====================================================
// INTERACTION
// =====================================================

function selectAnswer(btn, container) {
  if (answered) return;
  selectedAns = btn.dataset.value;
  container.querySelectorAll('.mcq-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  const checkBtn = document.getElementById('check-btn');
  if (checkBtn) {
    checkBtn.disabled = false;
    checkBtn.style.opacity = '1';
  }
}

function selectTap(btn, container) {
  if (answered) return;
  btn.classList.toggle('selected');
}

function checkAnswer(container) {
  answered = true;
  const q = questions[currentQIdx];
  const isCorrect = selectedAns === q.correct;

  const footer = document.getElementById('answer-footer');
  const checkBtn = document.getElementById('check-btn');

  // Mark option buttons
  container.querySelectorAll('.mcq-btn').forEach(btn => {
    if (btn.dataset.value === q.correct) btn.classList.add('correct');
    else if (btn.dataset.value === selectedAns && !isCorrect) btn.classList.add('wrong');
  });

  if (isCorrect) {
    correctCount++;
    footer.className = 'answer-footer correct-state';
    footer.innerHTML = `
      <div class="answer-result correct">✅ Correct! よくできました！</div>
      <button class="btn btn-primary btn-full btn-lg" id="check-btn">Continue</button>
    `;
    speakJapanese(q.japanese || '');
  } else {
    store.loseHeart();
    footer.className = 'answer-footer wrong-state';
    footer.innerHTML = `
      <div class="answer-result wrong">❌ Not quite — Correct: <strong>${q.correct}</strong></div>
      <button class="btn btn-danger btn-full btn-lg" id="check-btn">Got it</button>
    `;
  }

  document.getElementById('check-btn').addEventListener('click', () => nextQuestion(container));
}

function nextQuestion(container) {
  answered = false;
  selectedAns = null;
  currentQIdx++;
  renderQuestion(container);
}

function finishLesson(container) {
  const xp = lessonData.xp_reward;
  store.completeLesson(lessonData.lesson_id, xp);

  // Add vocab to SRS
  lessonData.vocabulary?.forEach(v => {
    if (!store.getSRSCard(v.vocab_id)) {
      store.updateSRSCard(v.vocab_id, 1);
    }
  });

  showToast(`+${xp} XP earned! 🎉`, 'success');
  showLessonComplete(xp, () => navigate('home'));

  container.innerHTML = `
    <div class="page-lesson">
      <div class="empty-state" style="padding-top: 60px;">
        <div class="empty-icon">🎉</div>
        <h3>Lesson Complete!</h3>
        <p>${correctCount}/${questions.length} correct</p>
      </div>
    </div>
  `;
}
