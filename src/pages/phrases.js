// =====================================================
// BASIC PHRASES PAGE — Searchable table with TTS
// =====================================================

import { speakJapanese } from './hiragana.js';

const PHRASES = [
  // Greetings
  { category: '👋 Greetings', ja: 'こんにちは', romaji: 'Konnichiwa', en: 'Hello / Good afternoon' },
  { category: '👋 Greetings', ja: 'おはようございます', romaji: 'Ohayou gozaimasu', en: 'Good morning (polite)' },
  { category: '👋 Greetings', ja: 'こんばんは', romaji: 'Konbanwa', en: 'Good evening' },
  { category: '👋 Greetings', ja: 'おやすみなさい', romaji: 'Oyasuminasai', en: 'Good night (polite)' },
  { category: '👋 Greetings', ja: 'さようなら', romaji: 'Sayounara', en: 'Goodbye (formal)' },
  { category: '👋 Greetings', ja: 'またね', romaji: 'Matane', en: 'See you later (casual)' },
  { category: '👋 Greetings', ja: 'はじめまして', romaji: 'Hajimemashite', en: 'Nice to meet you' },
  { category: '👋 Greetings', ja: 'よろしくお願いします', romaji: 'Yoroshiku onegaishimasu', en: 'Please treat me well / Best regards' },

  // Basics
  { category: '💬 Basics', ja: 'はい', romaji: 'Hai', en: 'Yes' },
  { category: '💬 Basics', ja: 'いいえ', romaji: 'Iie', en: 'No' },
  { category: '💬 Basics', ja: 'ありがとうございます', romaji: 'Arigatou gozaimasu', en: 'Thank you very much' },
  { category: '💬 Basics', ja: 'どういたしまして', romaji: 'Dou itashimashite', en: "You're welcome" },
  { category: '💬 Basics', ja: 'すみません', romaji: 'Sumimasen', en: 'Excuse me / Sorry' },
  { category: '💬 Basics', ja: 'ごめんなさい', romaji: 'Gomen nasai', en: 'I am sorry' },
  { category: '💬 Basics', ja: 'わかりません', romaji: 'Wakarimasen', en: "I don't understand" },
  { category: '💬 Basics', ja: 'わかりました', romaji: 'Wakarimashita', en: 'I understood' },
  { category: '💬 Basics', ja: 'もう一度おねがいします', romaji: 'Mou ichido onegaishimasu', en: 'Please say it again' },
  { category: '💬 Basics', ja: 'ゆっくり話してください', romaji: 'Yukkuri hanashite kudasai', en: 'Please speak slowly' },

  // Introductions
  { category: '👤 Introductions', ja: 'わたしは〜です', romaji: 'Watashi wa ~ desu', en: 'I am ~' },
  { category: '👤 Introductions', ja: 'お名前は何ですか？', romaji: 'Onamae wa nan desu ka?', en: 'What is your name?' },
  { category: '👤 Introductions', ja: 'どこから来ましたか？', romaji: 'Doko kara kimashita ka?', en: 'Where are you from?' },
  { category: '👤 Introductions', ja: 'インドから来ました', romaji: 'Indo kara kimashita', en: 'I am from India' },
  { category: '👤 Introductions', ja: '何歳ですか？', romaji: 'Nansai desu ka?', en: 'How old are you?' },

  // Food & Shopping
  { category: '🍜 Food & Shopping', ja: 'これをください', romaji: 'Kore wo kudasai', en: 'Please give me this' },
  { category: '🍜 Food & Shopping', ja: 'いくらですか？', romaji: 'Ikura desu ka?', en: 'How much is it?' },
  { category: '🍜 Food & Shopping', ja: 'おいしい！', romaji: 'Oishii!', en: 'Delicious!' },
  { category: '🍜 Food & Shopping', ja: 'お水をください', romaji: 'Omizu wo kudasai', en: 'Water please' },
  { category: '🍜 Food & Shopping', ja: 'お会計をお願いします', romaji: 'Okaikei wo onegaishimasu', en: 'Check please' },

  // Directions
  { category: '📍 Directions', ja: '〜はどこですか？', romaji: '~ wa doko desu ka?', en: 'Where is ~?' },
  { category: '📍 Directions', ja: 'まっすぐ', romaji: 'Massugu', en: 'Straight ahead' },
  { category: '📍 Directions', ja: '右に曲がってください', romaji: 'Migi ni magatte kudasai', en: 'Please turn right' },
  { category: '📍 Directions', ja: '左に曲がってください', romaji: 'Hidari ni magatte kudasai', en: 'Please turn left' },
  { category: '📍 Directions', ja: '駅はどこですか？', romaji: 'Eki wa doko desu ka?', en: 'Where is the station?' },

  // Emergency
  { category: '🆘 Emergency', ja: '助けてください！', romaji: 'Tasukete kudasai!', en: 'Help me please!' },
  { category: '🆘 Emergency', ja: '病院に連れて行ってください', romaji: 'Byouin ni tsurete itte kudasai', en: 'Please take me to a hospital' },
  { category: '🆘 Emergency', ja: '警察を呼んでください', romaji: 'Keisatsu wo yonde kudasai', en: 'Please call the police' },
];

import { Icons } from '../components/icons.js';

export function renderPhrases(container) {
  const categories = [...new Set(PHRASES.map(p => p.category))];

  const catIcons = {
    '👋 Greetings': Icons.greetings(),
    '💬 Basics': Icons.logo(),
    '👤 Introductions': Icons.user(),
    '🍜 Food & Shopping': Icons.food(),
    '📍 Directions': Icons.location(),
    '🆘 Emergency': Icons.alert(),
  };

  container.innerHTML = `
    <div class="page-phrases page-enter">
      <div class="hiragana-header">
        <h2>Basic Phrases</h2>
        <p>${PHRASES.length} essential Japanese phrases</p>
      </div>

      <!-- Search -->
      <div class="phrases-search-wrap" style="position: relative; display: flex; align-items: center;">
        <span class="search-icon" style="position: absolute; left: 12px; display: inline-flex; align-items: center; justify-content: center; pointer-events: none; color: var(--text-muted);">
          <svg viewBox="0 0 24 24" style="width:1em; height:1em; fill:none; stroke:currentColor; stroke-width:2;" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </span>
        <input type="text" class="phrases-search" id="phrase-search"
               placeholder="Search phrases, romaji, or English…"
               autocomplete="off" spellcheck="false" style="padding-left: 36px; width: 100%;" />
      </div>

      <!-- Category filter chips -->
      <div style="display: flex; gap: var(--space-2); overflow-x: auto; padding-bottom: var(--space-3); scrollbar-width: none; margin-bottom: var(--space-4); align-items: center;">
        <button class="btn btn-sm btn-primary" data-cat="all" id="cat-all">All</button>
        ${categories.map(cat => `
          <button class="btn btn-sm btn-ghost" data-cat="${cat}" style="white-space: nowrap; display: inline-flex; align-items: center; gap: 4px;">
            ${catIcons[cat] || ''} <span>${cat.replace(/[^\w\s&]/g, '').trim()}</span>
          </button>
        `).join('')}
      </div>

      <!-- Phrases list -->
      <div id="phrases-list">
        ${renderPhraseList(PHRASES)}
      </div>
    </div>
  `;

  // Search
  let activeCategory = 'all';
  const searchInput = document.getElementById('phrase-search');
  const list = document.getElementById('phrases-list');

  function updateList() {
    const q = searchInput.value.toLowerCase().trim();
    const filtered = PHRASES.filter(p => {
      const matchCat  = activeCategory === 'all' || p.category === activeCategory;
      const matchText = !q || p.ja.includes(q) || p.romaji.toLowerCase().includes(q) || p.en.toLowerCase().includes(q);
      return matchCat && matchText;
    });
    list.innerHTML = filtered.length > 0
      ? renderPhraseList(filtered)
      : `<div class="empty-state"><div class="empty-icon" style="font-size: 40px; color: var(--text-muted);">${Icons.close()}</div><h3>No phrases found</h3></div>`;

    // Re-attach speak handlers
    list.querySelectorAll('.phrase-speak').forEach(btn => {
      btn.addEventListener('click', () => speakPhrase(btn, btn.dataset.ja));
    });
  }

  searchInput.addEventListener('input', updateList);

  // Category filter
  container.querySelectorAll('[data-cat]').forEach(btn => {
    btn.addEventListener('click', () => {
      activeCategory = btn.dataset.cat;
      container.querySelectorAll('[data-cat]').forEach(b => {
        const isSelected = b.dataset.cat === activeCategory;
        b.className = isSelected ? 'btn btn-sm btn-primary' : 'btn btn-sm btn-ghost';
        b.style.whiteSpace = 'nowrap';
      });
      updateList();
    });
  });

  // Initial speak handlers
  list.querySelectorAll('.phrase-speak').forEach(btn => {
    btn.addEventListener('click', () => speakPhrase(btn, btn.dataset.ja));
  });
}

function renderPhraseList(phrases) {
  const catIcons = {
    '👋 Greetings': Icons.greetings(),
    '💬 Basics': Icons.logo(),
    '👤 Introductions': Icons.user(),
    '🍜 Food & Shopping': Icons.food(),
    '📍 Directions': Icons.location(),
    '🆘 Emergency': Icons.alert(),
  };

  // Group by category
  const byCategory = {};
  phrases.forEach(p => {
    if (!byCategory[p.category]) byCategory[p.category] = [];
    byCategory[p.category].push(p);
  });

  return Object.entries(byCategory).map(([cat, items]) => `
    <div style="margin-bottom: var(--space-5);">
      <div class="section-title" style="margin-bottom: var(--space-3); display: inline-flex; align-items: center; gap: 6px;">
        ${catIcons[cat] || Icons.book()} <span>${cat.replace(/[^\w\s&]/g, '').trim()}</span>
      </div>
      ${items.map((p, i) => `
        <div class="phrase-row" data-idx="${i}">
          <div style="flex: 1;">
            <div class="phrase-ja">${p.ja}</div>
            <div class="phrase-romaji">${p.romaji}</div>
          </div>
          <div class="phrase-right">
            <div class="phrase-en">${p.en}</div>
          </div>
          <button class="phrase-speak" data-ja="${p.ja}" aria-label="Listen to ${p.en}" title="Listen" style="display: inline-flex; align-items: center; justify-content: center; font-size: 16px;">
            ${Icons.speaker()}
          </button>
        </div>
      `).join('')}
    </div>
  `).join('');
}

function speakPhrase(btn, text) {
  speakJapanese(text);
  btn.classList.add('speaking');
  setTimeout(() => btn.classList.remove('speaking'), 1200);
}
