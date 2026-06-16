// =====================================================
// HIRAGANA PAGE — Interactive chart with TTS
// Full あいうえお chart (all 46 base chars)
// =====================================================

// ===== WEB SPEECH TTS =====
export function speakJapanese(text) {
  if (!text || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = 'ja-JP';
  utt.rate = 0.85;
  utt.pitch = 1.1;

  // Try to find a Japanese voice
  const voices = window.speechSynthesis.getVoices();
  const jaVoice = voices.find(v => v.lang.startsWith('ja'));
  if (jaVoice) utt.voice = jaVoice;

  window.speechSynthesis.speak(utt);
}

// ===== HIRAGANA DATA =====
const HIRAGANA_ROWS = [
  {
    label: 'あ Row (Vowels)',
    chars: [
      { kana: 'あ', romaji: 'a' },
      { kana: 'い', romaji: 'i' },
      { kana: 'う', romaji: 'u' },
      { kana: 'え', romaji: 'e' },
      { kana: 'お', romaji: 'o' },
    ],
  },
  {
    label: 'か Row (K-)',
    chars: [
      { kana: 'か', romaji: 'ka' },
      { kana: 'き', romaji: 'ki' },
      { kana: 'く', romaji: 'ku' },
      { kana: 'け', romaji: 'ke' },
      { kana: 'こ', romaji: 'ko' },
    ],
  },
  {
    label: 'さ Row (S-)',
    chars: [
      { kana: 'さ', romaji: 'sa' },
      { kana: 'し', romaji: 'shi' },
      { kana: 'す', romaji: 'su' },
      { kana: 'せ', romaji: 'se' },
      { kana: 'そ', romaji: 'so' },
    ],
  },
  {
    label: 'た Row (T-)',
    chars: [
      { kana: 'た', romaji: 'ta' },
      { kana: 'ち', romaji: 'chi' },
      { kana: 'つ', romaji: 'tsu' },
      { kana: 'て', romaji: 'te' },
      { kana: 'と', romaji: 'to' },
    ],
  },
  {
    label: 'な Row (N-)',
    chars: [
      { kana: 'な', romaji: 'na' },
      { kana: 'に', romaji: 'ni' },
      { kana: 'ぬ', romaji: 'nu' },
      { kana: 'ね', romaji: 'ne' },
      { kana: 'の', romaji: 'no' },
    ],
  },
  {
    label: 'は Row (H-)',
    chars: [
      { kana: 'は', romaji: 'ha' },
      { kana: 'ひ', romaji: 'hi' },
      { kana: 'ふ', romaji: 'fu' },
      { kana: 'へ', romaji: 'he' },
      { kana: 'ほ', romaji: 'ho' },
    ],
  },
  {
    label: 'ま Row (M-)',
    chars: [
      { kana: 'ま', romaji: 'ma' },
      { kana: 'み', romaji: 'mi' },
      { kana: 'む', romaji: 'mu' },
      { kana: 'め', romaji: 'me' },
      { kana: 'も', romaji: 'mo' },
    ],
  },
  {
    label: 'や Row (Y-)',
    chars: [
      { kana: 'や', romaji: 'ya' },
      { kana: null, romaji: null },
      { kana: 'ゆ', romaji: 'yu' },
      { kana: null, romaji: null },
      { kana: 'よ', romaji: 'yo' },
    ],
  },
  {
    label: 'ら Row (R-)',
    chars: [
      { kana: 'ら', romaji: 'ra' },
      { kana: 'り', romaji: 'ri' },
      { kana: 'る', romaji: 'ru' },
      { kana: 'れ', romaji: 're' },
      { kana: 'ろ', romaji: 'ro' },
    ],
  },
  {
    label: 'わ Row (W-) & ん',
    chars: [
      { kana: 'わ', romaji: 'wa' },
      { kana: null, romaji: null },
      { kana: null, romaji: null },
      { kana: null, romaji: null },
      { kana: 'を', romaji: 'wo' },
    ],
  },
  {
    label: '— ん',
    chars: [
      { kana: 'ん', romaji: 'n' },
      { kana: null, romaji: null },
      { kana: null, romaji: null },
      { kana: null, romaji: null },
      { kana: null, romaji: null },
    ],
  },
];

const DAKUTEN_ROWS = [
  {
    label: 'が Row (G-)',
    chars: [
      { kana: 'が', romaji: 'ga' }, { kana: 'ぎ', romaji: 'gi' },
      { kana: 'ぐ', romaji: 'gu' }, { kana: 'げ', romaji: 'ge' },
      { kana: 'ご', romaji: 'go' },
    ],
  },
  {
    label: 'ざ Row (Z-)',
    chars: [
      { kana: 'ざ', romaji: 'za' }, { kana: 'じ', romaji: 'ji' },
      { kana: 'ず', romaji: 'zu' }, { kana: 'ぜ', romaji: 'ze' },
      { kana: 'ぞ', romaji: 'zo' },
    ],
  },
  {
    label: 'だ Row (D-)',
    chars: [
      { kana: 'だ', romaji: 'da' }, { kana: 'ぢ', romaji: 'ji' },
      { kana: 'づ', romaji: 'zu' }, { kana: 'で', romaji: 'de' },
      { kana: 'ど', romaji: 'do' },
    ],
  },
  {
    label: 'ば Row (B-)',
    chars: [
      { kana: 'ば', romaji: 'ba' }, { kana: 'び', romaji: 'bi' },
      { kana: 'ぶ', romaji: 'bu' }, { kana: 'べ', romaji: 'be' },
      { kana: 'ぼ', romaji: 'bo' },
    ],
  },
  {
    label: 'ぱ Row (P-)',
    chars: [
      { kana: 'ぱ', romaji: 'pa' }, { kana: 'ぴ', romaji: 'pi' },
      { kana: 'ぷ', romaji: 'pu' }, { kana: 'ぺ', romaji: 'pe' },
      { kana: 'ぽ', romaji: 'po' },
    ],
  },
];

// ===== RENDER =====
export function renderHiragana(container) {
  // Trigger voice list load
  if (window.speechSynthesis) {
    window.speechSynthesis.getVoices();
  }

  container.innerHTML = `
    <div class="page-hiragana page-enter">
      <div class="hiragana-header">
        <h2>ひらがな Chart</h2>
        <p>Tap any character to hear it spoken 🔊</p>
      </div>

      <div class="hiragana-section">
        <h3>Basic Hiragana (清音)</h3>
        ${HIRAGANA_ROWS.map(row => `
          <div style="margin-bottom: var(--space-3);">
            <div style="font-size: var(--text-xs); color: var(--text-muted); margin-bottom: var(--space-2); font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
              ${row.label}
            </div>
            <div class="hiragana-grid">
              ${row.chars.map(c => c.kana ? `
                <div class="hira-cell" data-kana="${c.kana}" tabindex="0" role="button"
                     aria-label="${c.kana} — ${c.romaji}">
                  <span class="hira-kana">${c.kana}</span>
                  <span class="hira-romaji">${c.romaji}</span>
                </div>
              ` : `<div class="hira-cell empty"></div>`).join('')}
            </div>
          </div>
        `).join('')}
      </div>

      <div class="hiragana-section">
        <h3>Voiced Hiragana (濁音・半濁音)</h3>
        ${DAKUTEN_ROWS.map(row => `
          <div style="margin-bottom: var(--space-3);">
            <div style="font-size: var(--text-xs); color: var(--text-muted); margin-bottom: var(--space-2); font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
              ${row.label}
            </div>
            <div class="hiragana-grid">
              ${row.chars.map(c => `
                <div class="hira-cell" data-kana="${c.kana}" tabindex="0" role="button"
                     aria-label="${c.kana} — ${c.romaji}">
                  <span class="hira-kana">${c.kana}</span>
                  <span class="hira-romaji">${c.romaji}</span>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>

      <div class="hiragana-section">
        <h3>Tips for Pronunciation 📢</h3>
        <div class="card" style="margin-bottom: var(--space-3);">
          <p style="font-size: var(--text-sm); color: var(--text-secondary); line-height: 1.7;">
            🔵 Each kana = one beat. Say <strong>ko-n-ni-chi-wa</strong> with even rhythm.<br/>
            🔴 Vowels: a=आ, i=ई, u=उ, e=ए, o=ओ — always short and pure.<br/>
            🟡 The 'r' sound is a light flap — between R and L. Like in <em>arigatou</em>.<br/>
            🟢 Long vowels (aa, ii) = hold the sound for 2 beats.
          </p>
        </div>
      </div>
    </div>
  `;

  // Attach click handlers for TTS
  container.querySelectorAll('.hira-cell[data-kana]').forEach(cell => {
    const handler = () => {
      speakJapanese(cell.dataset.kana);
      cell.classList.add('speaking');
      setTimeout(() => cell.classList.remove('speaking'), 700);
    };
    cell.addEventListener('click', handler);
    cell.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') handler(); });
  });
}
