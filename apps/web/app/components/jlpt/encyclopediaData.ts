// Structured static database for the Japanese Linguistics, Grammar, and JLPT Encyclopedia

export interface KanaItem {
  kana: string;
  romaji: string;
  type: 'basic' | 'dakuten' | 'handakuten' | 'yoon' | 'obsolete' | 'extended';
}

export interface KanjiItem {
  kanji: string;
  meaning: string;
  onyomi: string;
  kunyomi: string;
  strokes: number;
  radical: string;
  exampleCompound: string;
  exampleSentence: string;
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
}

export interface VocabItem {
  japanese: string;
  hiragana: string;
  romaji: string;
  english: string;
  exampleSentence: string;
  category: 'daily' | 'travel' | 'tech' | 'color' | 'kinship' | 'conversation' | 'keigo' | 'slang' | 'lexicon';
}

export interface CounterItem {
  category: string;
  suffix: string;
  qty1: string;
  qty2: string;
  qty3: string;
  qty4: string;
}

export interface BanknoteItem {
  denomination: string;
  portrait: string;
  backDesign: string;
  symbolism: string;
}

export interface CoinItem {
  denomination: string;
  composition: string;
  obverse: string;
  reverse: string;
}

export interface MonthItem {
  number: string;
  modern: string;
  traditional: string;
  traditionalRomaji: string;
  meaning: string;
}

export interface GrammarItem {
  level: string;
  point: string;
  meaning: string;
  example: string;
}

export interface ConjugationItem {
  formName: string;
  plain: string;
  polite: string;
  function: string;
}

export interface IndiaCenterItem {
  city: string;
  sponsor: string;
  description: string;
}

// 1. HIRAGANA DATA
export const hiraganaData: KanaItem[] = [
  // Basic
  { kana: 'あ', romaji: 'a', type: 'basic' },
  { kana: 'い', romaji: 'i', type: 'basic' },
  { kana: 'う', romaji: 'u', type: 'basic' },
  { kana: 'え', romaji: 'e', type: 'basic' },
  { kana: 'お', romaji: 'o', type: 'basic' },
  { kana: 'か', romaji: 'ka', type: 'basic' },
  { kana: 'き', romaji: 'ki', type: 'basic' },
  { kana: 'く', romaji: 'ku', type: 'basic' },
  { kana: 'け', romaji: 'ke', type: 'basic' },
  { kana: 'こ', romaji: 'ko', type: 'basic' },
  { kana: 'さ', romaji: 'sa', type: 'basic' },
  { kana: 'し', romaji: 'shi', type: 'basic' },
  { kana: 'す', romaji: 'su', type: 'basic' },
  { kana: 'せ', romaji: 'se', type: 'basic' },
  { kana: 'そ', romaji: 'so', type: 'basic' },
  { kana: 'た', romaji: 'ta', type: 'basic' },
  { kana: 'ち', romaji: 'chi', type: 'basic' },
  { kana: 'つ', romaji: 'tsu', type: 'basic' },
  { kana: 'て', romaji: 'te', type: 'basic' },
  { kana: 'と', romaji: 'to', type: 'basic' },
  { kana: 'な', romaji: 'na', type: 'basic' },
  { kana: 'に', romaji: 'ni', type: 'basic' },
  { kana: 'ぬ', romaji: 'nu', type: 'basic' },
  { kana: 'ね', romaji: 'ne', type: 'basic' },
  { kana: 'の', romaji: 'no', type: 'basic' },
  { kana: 'は', romaji: 'ha', type: 'basic' },
  { kana: 'ひ', romaji: 'hi', type: 'basic' },
  { kana: 'ふ', romaji: 'fu', type: 'basic' },
  { kana: 'へ', romaji: 'he', type: 'basic' },
  { kana: 'ほ', romaji: 'ho', type: 'basic' },
  { kana: 'ま', romaji: 'ma', type: 'basic' },
  { kana: 'み', romaji: 'mi', type: 'basic' },
  { kana: 'む', romaji: 'mu', type: 'basic' },
  { kana: 'め', romaji: 'me', type: 'basic' },
  { kana: 'も', romaji: 'mo', type: 'basic' },
  { kana: 'や', romaji: 'ya', type: 'basic' },
  { kana: 'ゆ', romaji: 'yu', type: 'basic' },
  { kana: 'よ', romaji: 'yo', type: 'basic' },
  { kana: 'ら', romaji: 'ra', type: 'basic' },
  { kana: 'り', romaji: 'ri', type: 'basic' },
  { kana: 'る', romaji: 'ru', type: 'basic' },
  { kana: 'れ', romaji: 're', type: 'basic' },
  { kana: 'ろ', romaji: 'ro', type: 'basic' },
  { kana: 'わ', romaji: 'wa', type: 'basic' },
  { kana: 'を', romaji: 'wo', type: 'basic' },
  { kana: 'ん', romaji: 'n', type: 'basic' },

  // Obsolete
  { kana: 'ゐ', romaji: 'wi', type: 'obsolete' },
  { kana: 'ゑ', romaji: 'we', type: 'obsolete' },

  // Dakuten
  { kana: 'が', romaji: 'ga', type: 'dakuten' },
  { kana: 'ぎ', romaji: 'gi', type: 'dakuten' },
  { kana: 'ぐ', romaji: 'gu', type: 'dakuten' },
  { kana: 'げ', romaji: 'ge', type: 'dakuten' },
  { kana: 'ご', romaji: 'go', type: 'dakuten' },
  { kana: 'ざ', romaji: 'za', type: 'dakuten' },
  { kana: 'じ', romaji: 'ji', type: 'dakuten' },
  { kana: 'ず', romaji: 'zu', type: 'dakuten' },
  { kana: 'ぜ', romaji: 'ze', type: 'dakuten' },
  { kana: 'ぞ', romaji: 'zo', type: 'dakuten' },
  { kana: 'だ', romaji: 'da', type: 'dakuten' },
  { kana: 'ぢ', romaji: 'ji', type: 'dakuten' },
  { kana: 'づ', romaji: 'zu', type: 'dakuten' },
  { kana: 'で', romaji: 'de', type: 'dakuten' },
  { kana: 'ど', romaji: 'do', type: 'dakuten' },
  { kana: 'ば', romaji: 'ba', type: 'dakuten' },
  { kana: 'び', romaji: 'bi', type: 'dakuten' },
  { kana: 'ぶ', romaji: 'bu', type: 'dakuten' },
  { kana: 'べ', romaji: 'be', type: 'dakuten' },
  { kana: 'ぼ', romaji: 'bo', type: 'dakuten' },

  // Handakuten
  { kana: 'ぱ', romaji: 'pa', type: 'handakuten' },
  { kana: 'ぴ', romaji: 'pi', type: 'handakuten' },
  { kana: 'ぷ', romaji: 'pu', type: 'handakuten' },
  { kana: 'ぺ', romaji: 'pe', type: 'handakuten' },
  { kana: 'ぽ', romaji: 'po', type: 'handakuten' },

  // Yoon
  { kana: 'きゃ', romaji: 'kya', type: 'yoon' },
  { kana: 'きゅ', romaji: 'kyu', type: 'yoon' },
  { kana: 'きょ', romaji: 'kyo', type: 'yoon' },
  { kana: 'しゃ', romaji: 'sha', type: 'yoon' },
  { kana: 'しゅ', romaji: 'shu', type: 'yoon' },
  { kana: 'しょ', romaji: 'sho', type: 'yoon' },
  { kana: 'ちゃ', romaji: 'cha', type: 'yoon' },
  { kana: 'ちゅ', romaji: 'chu', type: 'yoon' },
  { kana: 'ちょ', romaji: 'cho', type: 'yoon' },
  { kana: 'にゃ', romaji: 'nya', type: 'yoon' },
  { kana: 'にゅ', romaji: 'nyu', type: 'yoon' },
  { kana: 'にょ', romaji: 'nyo', type: 'yoon' },
  { kana: 'ひゃ', romaji: 'hya', type: 'yoon' },
  { kana: 'ひゅ', romaji: 'hyu', type: 'yoon' },
  { kana: 'ひょ', romaji: 'hyo', type: 'yoon' },
  { kana: 'みゃ', romaji: 'mya', type: 'yoon' },
  { kana: 'みゅ', romaji: 'myu', type: 'yoon' },
  { kana: 'みょ', romaji: 'myo', type: 'yoon' },
  { kana: 'りゃ', romaji: 'rya', type: 'yoon' },
  { kana: 'りゅ', romaji: 'ryu', type: 'yoon' },
  { kana: 'りょ', romaji: 'ryo', type: 'yoon' },
  { kana: 'ぎゃ', romaji: 'gya', type: 'yoon' },
  { kana: 'ぎゅ', romaji: 'gyu', type: 'yoon' },
  { kana: 'ぎょ', romaji: 'gyo', type: 'yoon' },
  { kana: 'じゃ', romaji: 'ja', type: 'yoon' },
  { kana: 'じゅ', romaji: 'ju', type: 'yoon' },
  { kana: 'じょ', romaji: 'jo', type: 'yoon' },
  { kana: 'びゃ', romaji: 'bya', type: 'yoon' },
  { kana: 'びゅ', romaji: 'byu', type: 'yoon' },
  { kana: 'びょ', romaji: 'byo', type: 'yoon' },
  { kana: 'ぴゃ', romaji: 'pya', type: 'yoon' },
  { kana: 'ぴゅ', romaji: 'pyu', type: 'yoon' },
  { kana: 'ぴょ', romaji: 'pyo', type: 'yoon' }
];

// 2. KATAKANA DATA
export const katakanaData: KanaItem[] = [
  // Basic
  { kana: 'ア', romaji: 'a', type: 'basic' },
  { kana: 'イ', romaji: 'i', type: 'basic' },
  { kana: 'ウ', romaji: 'u', type: 'basic' },
  { kana: 'エ', romaji: 'e', type: 'basic' },
  { kana: 'オ', romaji: 'o', type: 'basic' },
  { kana: 'カ', romaji: 'ka', type: 'basic' },
  { kana: 'キ', romaji: 'ki', type: 'basic' },
  { kana: 'ク', romaji: 'ku', type: 'basic' },
  { kana: 'ケ', romaji: 'ke', type: 'basic' },
  { kana: 'コ', romaji: 'ko', type: 'basic' },
  { kana: 'サ', romaji: 'sa', type: 'basic' },
  { kana: 'シ', romaji: 'shi', type: 'basic' },
  { kana: 'ス', romaji: 'su', type: 'basic' },
  { kana: 'セ', romaji: 'se', type: 'basic' },
  { kana: 'ソ', romaji: 'so', type: 'basic' },
  { kana: 'タ', romaji: 'ta', type: 'basic' },
  { kana: 'チ', romaji: 'chi', type: 'basic' },
  { kana: 'ツ', romaji: 'tsu', type: 'basic' },
  { kana: 'テ', romaji: 'te', type: 'basic' },
  { kana: 'ト', romaji: 'to', type: 'basic' },
  { kana: 'ナ', romaji: 'na', type: 'basic' },
  { kana: 'ニ', romaji: 'ni', type: 'basic' },
  { kana: 'ヌ', romaji: 'nu', type: 'basic' },
  { kana: 'ネ', romaji: 'ne', type: 'basic' },
  { kana: 'ノ', romaji: 'no', type: 'basic' },
  { kana: 'ハ', romaji: 'ha', type: 'basic' },
  { kana: 'ヒ', romaji: 'hi', type: 'basic' },
  { kana: 'フ', romaji: 'fu', type: 'basic' },
  { kana: 'ヘ', romaji: 'he', type: 'basic' },
  { kana: 'ホ', romaji: 'ho', type: 'basic' },
  { kana: 'マ', romaji: 'ma', type: 'basic' },
  { kana: 'ミ', romaji: 'mi', type: 'basic' },
  { kana: 'ム', romaji: 'mu', type: 'basic' },
  { kana: 'メ', romaji: 'me', type: 'basic' },
  { kana: 'モ', romaji: 'mo', type: 'basic' },
  { kana: 'ヤ', romaji: 'ya', type: 'basic' },
  { kana: 'ユ', romaji: 'yu', type: 'basic' },
  { kana: 'ヨ', romaji: 'yo', type: 'basic' },
  { kana: 'ラ', romaji: 'ra', type: 'basic' },
  { kana: 'リ', romaji: 'ri', type: 'basic' },
  { kana: 'ル', romaji: 'ru', type: 'basic' },
  { kana: 'レ', romaji: 're', type: 'basic' },
  { kana: 'ロ', romaji: 'ro', type: 'basic' },
  { kana: 'ワ', romaji: 'wa', type: 'basic' },
  { kana: 'ヲ', romaji: 'wo', type: 'basic' },
  { kana: 'ン', romaji: 'n', type: 'basic' },

  // Obsolete
  { kana: 'ヰ', romaji: 'wi', type: 'obsolete' },
  { kana: 'ヱ', romaji: 'we', type: 'obsolete' },

  // Dakuten
  { kana: 'ガ', romaji: 'ga', type: 'dakuten' },
  { kana: 'ギ', romaji: 'gi', type: 'dakuten' },
  { kana: 'グ', romaji: 'gu', type: 'dakuten' },
  { kana: 'ゲ', romaji: 'ge', type: 'dakuten' },
  { kana: 'ゴ', romaji: 'go', type: 'dakuten' },
  { kana: 'ザ', romaji: 'za', type: 'dakuten' },
  { kana: 'ジ', romaji: 'ji', type: 'dakuten' },
  { kana: 'ズ', romaji: 'zu', type: 'dakuten' },
  { kana: 'ゼ', romaji: 'ze', type: 'dakuten' },
  { kana: 'ゾ', romaji: 'zo', type: 'dakuten' },
  { kana: 'ダ', romaji: 'da', type: 'dakuten' },
  { kana: 'ヂ', romaji: 'ji', type: 'dakuten' },
  { kana: 'ヅ', romaji: 'zu', type: 'dakuten' },
  { kana: 'デ', romaji: 'de', type: 'dakuten' },
  { kana: 'ド', romaji: 'do', type: 'dakuten' },
  { kana: 'バ', romaji: 'ba', type: 'dakuten' },
  { kana: 'ビ', romaji: 'bi', type: 'dakuten' },
  { kana: 'ブ', romaji: 'bu', type: 'dakuten' },
  { kana: 'ベ', romaji: 'be', type: 'dakuten' },
  { kana: 'ボ', romaji: 'bo', type: 'dakuten' },

  // Handakuten
  { kana: 'パ', romaji: 'pa', type: 'handakuten' },
  { kana: 'ピ', romaji: 'pi', type: 'handakuten' },
  { kana: 'プ', romaji: 'pu', type: 'handakuten' },
  { kana: 'ペ', romaji: 'pe', type: 'handakuten' },
  { kana: 'ポ', romaji: 'po', type: 'handakuten' },

  // Yoon
  { kana: 'キャ', romaji: 'kya', type: 'yoon' },
  { kana: 'キュ', romaji: 'kyu', type: 'yoon' },
  { kana: 'キョ', romaji: 'kyo', type: 'yoon' },
  { kana: 'シャ', romaji: 'sha', type: 'yoon' },
  { kana: 'シュ', romaji: 'shu', type: 'yoon' },
  { kana: 'ショ', romaji: 'sho', type: 'yoon' },
  { kana: 'チャ', romaji: 'cha', type: 'yoon' },
  { kana: 'チュ', romaji: 'chu', type: 'yoon' },
  { kana: 'チョ', romaji: 'cho', type: 'yoon' },
  { kana: 'ニャ', romaji: 'nya', type: 'yoon' },
  { kana: 'ニュ', romaji: 'nyu', type: 'yoon' },
  { kana: 'ニョ', romaji: 'nyo', type: 'yoon' },
  { kana: 'ヒャ', romaji: 'hya', type: 'yoon' },
  { kana: 'ヒュ', romaji: 'hyu', type: 'yoon' },
  { kana: 'ヒョ', romaji: 'hyo', type: 'yoon' },
  { kana: 'ミャ', romaji: 'mya', type: 'yoon' },
  { kana: 'ミュ', romaji: 'myu', type: 'yoon' },
  { kana: 'ミョ', romaji: 'myo', type: 'yoon' },
  { kana: 'リャ', romaji: 'rya', type: 'yoon' },
  { kana: 'リュ', romaji: 'ryu', type: 'yoon' },
  { kana: 'リョ', romaji: 'ryo', type: 'yoon' },
  { kana: 'ギャ', romaji: 'gya', type: 'yoon' },
  { kana: 'ギュ', romaji: 'gyu', type: 'yoon' },
  { kana: 'ギョ', romaji: 'gyo', type: 'yoon' },
  { kana: 'ジャ', romaji: 'ja', type: 'yoon' },
  { kana: 'ジュ', romaji: 'ju', type: 'yoon' },
  { kana: 'ジョ', romaji: 'jo', type: 'yoon' },
  { kana: 'ビャ', romaji: 'bya', type: 'yoon' },
  { kana: 'ビュ', romaji: 'byu', type: 'yoon' },
  { kana: 'ビョ', romaji: 'byo', type: 'yoon' },
  { kana: 'ピャ', romaji: 'pya', type: 'yoon' },
  { kana: 'ピュ', romaji: 'pyu', type: 'yoon' },
  { kana: 'ピョ', romaji: 'pyo', type: 'yoon' },

  // Extended
  { kana: 'ヴァ', romaji: 'va', type: 'extended' },
  { kana: 'ヴィ', romaji: 'vi', type: 'extended' },
  { kana: 'ヴ', romaji: 'vu', type: 'extended' },
  { kana: 'ヴェ', romaji: 've', type: 'extended' },
  { kana: 'ヴォ', romaji: 'vo', type: 'extended' },
  { kana: 'ファ', romaji: 'fa', type: 'extended' },
  { kana: 'フィ', romaji: 'fi', type: 'extended' },
  { kana: 'フェ', romaji: 'fe', type: 'extended' },
  { kana: 'フォ', romaji: 'fo', type: 'extended' },
  { kana: 'ウィ', romaji: 'wi', type: 'extended' },
  { kana: 'ウェ', romaji: 'we', type: 'extended' },
  { kana: 'ウォ', romaji: 'wo', type: 'extended' },
  { kana: 'チェ', romaji: 'che', type: 'extended' },
  { kana: 'シェ', romaji: 'she', type: 'extended' },
  { kana: 'ジェ', romaji: 'je', type: 'extended' },
  { kana: 'ティ', romaji: 'ti', type: 'extended' },
  { kana: 'トゥ', romaji: 'tu', type: 'extended' },
  { kana: 'ディ', romaji: 'di', type: 'extended' },
  { kana: 'ドゥ', romaji: 'du', type: 'extended' }
];

// 3. KANJI PROGRESSION DATA
export const kanjiData: KanjiItem[] = [
  {
    kanji: '日',
    meaning: 'Sun, Day',
    onyomi: 'ニチ, ジツ',
    kunyomi: 'ひ, -び, か',
    strokes: 4,
    radical: '日 (sun)',
    exampleCompound: '日曜日 (Nichiyōbi - Sunday)',
    exampleSentence: '日曜日は休みです。(Sunday is a day off.)',
    level: 'N5'
  },
  {
    kanji: '一',
    meaning: 'One',
    onyomi: 'イチ, イツ',
    kunyomi: 'ひと, ひと.つ',
    strokes: 1,
    radical: '一 (one)',
    exampleCompound: '一日 (Tsuitachi - 1st of month)',
    exampleSentence: '一日は忙しい。(The 1st of the month is busy.)',
    level: 'N5'
  },
  {
    kanji: '国',
    meaning: 'Country',
    onyomi: 'コク',
    kunyomi: 'くに',
    strokes: 8,
    radical: '囗 (enclosure)',
    exampleCompound: '外国 (Gaikoku - Foreign country)',
    exampleSentence: '彼女は外国へ行った。(She went to a foreign country.)',
    level: 'N5'
  },
  {
    kanji: '人',
    meaning: 'Person',
    onyomi: 'ジン, ニン',
    kunyomi: 'ひと',
    strokes: 2,
    radical: '人 (human)',
    exampleCompound: '日本人 (Nihonjin - Japanese)',
    exampleSentence: '彼は日本人です。(He is Japanese.)',
    level: 'N5'
  },
  {
    kanji: '見',
    meaning: 'See',
    onyomi: 'ケン',
    kunyomi: 'み.る',
    strokes: 7,
    radical: '見 (see)',
    exampleCompound: '花見 (Hanami - Flower viewing)',
    exampleSentence: '桜を見に行く。(I am going to see cherry blossoms.)',
    level: 'N5'
  },
  {
    kanji: '水',
    meaning: 'Water',
    onyomi: 'スイ',
    kunyomi: 'みず',
    strokes: 4,
    radical: '水 (water)',
    exampleCompound: '水曜日 (Suiyōbi - Wednesday)',
    exampleSentence: '水を飲む。(To drink water.)',
    level: 'N5'
  },
  {
    kanji: '思',
    meaning: 'Think',
    onyomi: 'シ',
    kunyomi: 'おmo.u', // corrected Kunyomi spelling style
    strokes: 9,
    radical: '心 (heart)',
    exampleCompound: '思い出 (Omoide - Memory)',
    exampleSentence: '昔を思い出す。(I remember the past.)',
    level: 'N4'
  },
  {
    kanji: '買',
    meaning: 'Buy',
    onyomi: 'バイ',
    kunyomi: 'か.う',
    strokes: 12,
    radical: '貝 (shell)',
    exampleCompound: '買い物 (Kaimono - Shopping)',
    exampleSentence: '本を買いました。(I bought a book.)',
    level: 'N4'
  },
  {
    kanji: '家',
    meaning: 'House',
    onyomi: 'カ, ケ',
    kunyomi: 'いえ, うち',
    strokes: 10,
    radical: '宀 (roof)',
    exampleCompound: '家族 (Kazoku - Family)',
    exampleSentence: '家族は元気です。(My family is well.)',
    level: 'N4'
  },
  {
    kanji: '道',
    meaning: 'Road, Path',
    onyomi: 'ドウ',
    kunyomi: 'みち',
    strokes: 12,
    radical: '辶 (walk)',
    exampleCompound: '道路 (Dōro - Road)',
    exampleSentence: 'この道を行く。(Go down this road.)',
    level: 'N4'
  },
  {
    kanji: '言',
    meaning: 'Say, Word',
    onyomi: 'ゲン, ゴン',
    kunyomi: 'い.う, こと',
    strokes: 7,
    radical: '言 (word)',
    exampleCompound: '言葉 (Kotoba - Word/Language)',
    exampleSentence: '日本語の言葉。(Japanese words.)',
    level: 'N4'
  },
  {
    kanji: '経',
    meaning: 'Pass/Manage',
    onyomi: 'ケイ, キョウ',
    kunyomi: 'へ.る',
    strokes: 11,
    radical: '糸 (thread)',
    exampleCompound: '経済 (Keizai - Economy)',
    exampleSentence: '経済が成長する。(The economy grows.)',
    level: 'N3'
  },
  {
    kanji: '関',
    meaning: 'Connection',
    onyomi: 'カン',
    kunyomi: 'せき',
    strokes: 14,
    radical: '門 (gate)',
    exampleCompound: '関係 (Kankei - Relationship)',
    exampleSentence: '関係が深い。(The relationship is deep.)',
    level: 'N3'
  },
  {
    kanji: '決',
    meaning: 'Decide',
    onyomi: 'ケツ',
    kunyomi: 'き.める',
    strokes: 7,
    radical: '氵 (water)',
    exampleCompound: '決定 (Kettei - Decision)',
    exampleSentence: 'ルールを決める。(Decide the rules.)',
    level: 'N3'
  },
  {
    kanji: '取',
    meaning: 'Take',
    onyomi: 'シュ',
    kunyomi: 'と.る',
    strokes: 8,
    radical: '又 (again)',
    exampleCompound: '取引 (Torihiki - Transaction)',
    exampleSentence: '責任を取る。(Take responsibility.)',
    level: 'N3'
  },
  {
    kanji: '情',
    meaning: 'Emotion/Fact',
    onyomi: 'ジョウ',
    kunyomi: 'なさ.け',
    strokes: 11,
    radical: '忄 (heart)',
    exampleCompound: '情報 (Jōhō - Information)',
    exampleSentence: '情報を集める。(Collect information.)',
    level: 'N3'
  },
  {
    kanji: '構',
    meaning: 'Structure',
    onyomi: 'コウ',
    kunyomi: 'かま.える',
    strokes: 14,
    radical: '木 (tree)',
    exampleCompound: '構造 (Kōzō - Structure)',
    exampleSentence: 'ビルの構造。(Structure of the building.)',
    level: 'N2'
  },
  {
    kanji: '識',
    meaning: 'Discriminate',
    onyomi: 'シキ',
    kunyomi: '-',
    strokes: 19,
    radical: '言 (word)',
    exampleCompound: '意識 (Ishiki - Consciousness)',
    exampleSentence: '意識が高い。(High consciousness.)',
    level: 'N2'
  },
  {
    kanji: '額',
    meaning: 'Forehead/Sum',
    onyomi: 'ガク',
    kunyomi: 'ひたい',
    strokes: 18,
    radical: '頁 (page)',
    exampleCompound: '金額 (Kingaku - Amount of money)',
    exampleSentence: '金額を確認する。(Check the money amount.)',
    level: 'N2'
  },
  {
    kanji: '貿',
    meaning: 'Trade',
    onyomi: 'ボウ',
    kunyomi: '-',
    strokes: 12,
    radical: '貝 (shell)',
    exampleCompound: '貿易 (Bōeki - Int. Trade)',
    exampleSentence: '貿易会社で働く。(Work at a trading firm.)',
    level: 'N2'
  },
  {
    kanji: '輸',
    meaning: 'Transport',
    onyomi: 'ユ',
    kunyomi: '-',
    strokes: 16,
    radical: '車 (car)',
    exampleCompound: '輸出 (Yushutsu - Export)',
    exampleSentence: '車を輸出する。(Export cars.)',
    level: 'N2'
  },
  {
    kanji: '彙',
    meaning: 'Collection',
    onyomi: 'イ',
    kunyomi: '-',
    strokes: 13,
    radical: '彐 (snout)',
    exampleCompound: '語彙 (Goi - Vocabulary)',
    exampleSentence: '語彙力が豊富だ。(Rich vocabulary.)',
    level: 'N1'
  },
  {
    kanji: '鬱',
    meaning: 'Depression',
    onyomi: 'ウツ',
    kunyomi: 'うっ.する',
    strokes: 29,
    radical: '鬯 (herb)',
    exampleCompound: '憂鬱 (Yūutsu - Melancholy)',
    exampleSentence: '気分が憂鬱だ。(I feel melancholy.)',
    level: 'N1'
  },
  {
    kanji: '覇',
    meaning: 'Hegemony',
    onyomi: 'ハ',
    kunyomi: '-',
    strokes: 19,
    radical: '襾 (cover)',
    exampleCompound: '覇権 (Haken - Hegemony)',
    exampleSentence: '覇権を握る。(Seize hegemony.)',
    level: 'N1'
  },
  {
    kanji: '綻',
    meaning: 'Unravel',
    onyomi: 'タン',
    kunyomi: 'ほころ.びる',
    strokes: 14,
    radical: '糸 (thread)',
    exampleCompound: '破綻 (Hatan - Collapse/Ruin)',
    exampleSentence: '計画が破綻した。(The plan collapsed.)',
    level: 'N1'
  },
  {
    kanji: '遜',
    meaning: 'Humble',
    onyomi: 'ソン',
    kunyomi: 'へりくだ.る',
    strokes: 14,
    radical: '辶 (walk)',
    exampleCompound: '謙遜 (Kenson - Modesty)',
    exampleSentence: '彼は謙遜した。(He was modest.)',
    level: 'N1'
  }
];

// 4. GENERAL VOCABULARY & SLANG DATA
export const vocabData: VocabItem[] = [
  // Daily Life, Family, and Food
  {
    japanese: '挨拶',
    hiragana: 'あいさつ',
    romaji: 'Aisatsu',
    english: 'Greeting',
    exampleSentence: '毎朝の挨拶は大切です。(Daily morning greetings are important.)',
    category: 'daily'
  },
  {
    japanese: '準備',
    hiragana: 'じゅんび',
    romaji: 'Junbi',
    english: 'Preparation',
    exampleSentence: '会議の準備をします。(I will prepare for the meeting.)',
    category: 'daily'
  },
  {
    japanese: '掃除',
    hiragana: 'そうじ',
    romaji: 'Sōji',
    english: 'Cleaning',
    exampleSentence: '部屋の掃除をする。(I clean the room.)',
    category: 'daily'
  },
  {
    japanese: '両親',
    hiragana: 'りょうしん',
    romaji: 'Ryōshin',
    english: 'Parents',
    exampleSentence: '両親に電話をかける。(I call my parents.)',
    category: 'daily'
  },
  {
    japanese: '兄弟',
    hiragana: 'きょうだい',
    romaji: 'Kyōdai',
    english: 'Siblings',
    exampleSentence: '兄弟は三人います。(I have three siblings.)',
    category: 'daily'
  },
  {
    japanese: '朝食',
    hiragana: 'ちょうしょく',
    romaji: 'Chōshoku',
    english: 'Breakfast',
    exampleSentence: '朝食にパンを食べる。(I eat bread for breakfast.)',
    category: 'daily'
  },
  {
    japanese: '野菜',
    hiragana: 'やさい',
    romaji: 'Yasai',
    english: 'Vegetable',
    exampleSentence: '新鮮な野菜を買う。(Buy fresh vegetables.)',
    category: 'daily'
  },
  {
    japanese: '料理',
    hiragana: 'りょうり',
    romaji: 'Ryōri',
    english: 'Cooking/Cuisine',
    exampleSentence: '日本料理が好きです。(I like Japanese cuisine.)',
    category: 'daily'
  },

  // Travel, Transportation, and Health
  {
    japanese: '空港',
    hiragana: 'くうこう',
    romaji: 'Kūkō',
    english: 'Airport',
    exampleSentence: '空港で友達を待つ。(Wait for a friend at the airport.)',
    category: 'travel'
  },
  {
    japanese: '予約',
    hiragana: 'よやく',
    romaji: 'Yoyaku',
    english: 'Reservation',
    exampleSentence: 'ホテルの予約をする。(Make a hotel reservation.)',
    category: 'travel'
  },
  {
    japanese: '切符',
    hiragana: 'きっぷ',
    romaji: 'Kippu',
    english: 'Ticket',
    exampleSentence: '駅で切符を買う。(Buy a ticket at the station.)',
    category: 'travel'
  },
  {
    japanese: '運転',
    hiragana: 'うんてん',
    romaji: 'Unten',
    english: 'Driving',
    exampleSentence: '車の運転に気をつける。(Be careful driving a car.)',
    category: 'travel'
  },
  {
    japanese: '病院',
    hiragana: 'びょういん',
    romaji: 'Byōin',
    english: 'Hospital',
    exampleSentence: '病院で診察を受ける。(Receive a medical examination at the hospital.)',
    category: 'travel'
  },
  {
    japanese: '薬局',
    hiragana: 'やっきょく',
    romaji: 'Yakkyoku',
    english: 'Pharmacy',
    exampleSentence: '薬局で薬をもらう。(Get medicine at the pharmacy.)',
    category: 'travel'
  },
  {
    japanese: '症状',
    hiragana: 'しょうじょう',
    romaji: 'Shōjō',
    english: 'Symptom',
    exampleSentence: '風邪の症状が出た。(Symptoms of a cold appeared.)',
    category: 'travel'
  },
  {
    japanese: '手術',
    hiragana: 'しゅじゅつ',
    romaji: 'Shujutsu',
    english: 'Surgery',
    exampleSentence: '成功裏に手術を終えた。(The surgery finished successfully.)',
    category: 'travel'
  },

  // Technology, Business, and Finance
  {
    japanese: '宇宙',
    hiragana: 'うちゅう',
    romaji: 'Uchū',
    english: 'Space/Universe',
    exampleSentence: '宇宙開発が進む。(Space exploration advances.)',
    category: 'tech'
  },
  {
    japanese: '人工知能',
    hiragana: 'じんこうちのう',
    romaji: 'Jinkōchinō',
    english: 'Artificial Intelligence',
    exampleSentence: '人工知能が普及する。(AI becomes widespread.)',
    category: 'tech'
  },
  {
    japanese: '開発',
    hiragana: 'かいはつ',
    romaji: 'Kaihatsu',
    english: 'Development',
    exampleSentence: '新しいアプリを開発する。(Develop a new app.)',
    category: 'tech'
  },
  {
    japanese: '企業',
    hiragana: 'きぎょう',
    romaji: 'Kigyō',
    english: 'Corporation',
    exampleSentence: '大企業に就職する。(Get a job at a large corporation.)',
    category: 'tech'
  },
  {
    japanese: '投資',
    hiragana: 'とうし',
    romaji: 'Tōshi',
    english: 'Investment',
    exampleSentence: '株式に投資する。(Invest in stocks.)',
    category: 'tech'
  },
  {
    japanese: '利益',
    hiragana: 'りえき',
    romaji: 'Rieki',
    english: 'Profit',
    exampleSentence: '会社の利益が上がる。(The company\'s profit increases.)',
    category: 'tech'
  },
  {
    japanese: '契約',
    hiragana: 'けいやく',
    romaji: 'Keiyaku',
    english: 'Contract',
    exampleSentence: '契約書に署名する。(Sign the contract.)',
    category: 'tech'
  },
  {
    japanese: '経済',
    hiragana: 'けいざい',
    romaji: 'Keizai',
    english: 'Economy',
    exampleSentence: '経済成長を促進する。(Promote economic growth.)',
    category: 'tech'
  },

  // Chromatic Taxonomy - Colors
  {
    japanese: '赤',
    hiragana: 'あか',
    romaji: 'Aka',
    english: 'Red',
    exampleSentence: '赤いリンゴを食べる。(Eat a red apple.)',
    category: 'color'
  },
  {
    japanese: '青',
    hiragana: 'あお',
    romaji: 'Ao',
    english: 'Blue',
    exampleSentence: '空が青い。(The sky is blue.)',
    category: 'color'
  },
  {
    japanese: '黒',
    hiragana: 'くろ',
    romaji: 'Kuro',
    english: 'Black',
    exampleSentence: '黒い猫を見た。(I saw a black cat.)',
    category: 'color'
  },
  {
    japanese: '白',
    hiragana: 'しろ',
    romaji: 'Shiro',
    english: 'White',
    exampleSentence: '白いシャツを着る。(Wear a white shirt.)',
    category: 'color'
  },
  {
    japanese: '黄色',
    hiragana: 'きいろ',
    romaji: 'Kiiro',
    english: 'Yellow',
    exampleSentence: '黄色い花が咲く。(Yellow flowers bloom.)',
    category: 'color'
  },
  {
    japanese: '緑',
    hiragana: 'みどり',
    romaji: 'Midori',
    english: 'Green',
    exampleSentence: '緑の森を歩く。(Walk through a green forest.)',
    category: 'color'
  },
  {
    japanese: '茶色',
    hiragana: 'ちゃいろ',
    romaji: 'Chairo',
    english: 'Brown',
    exampleSentence: '茶色い靴を買う。(Buy brown shoes.)',
    category: 'color'
  },
  {
    japanese: 'ピンク',
    hiragana: 'ピンク',
    romaji: 'Pinku',
    english: 'Pink',
    exampleSentence: 'ピンクのドレス。(A pink dress.)',
    category: 'color'
  },

  // Kinship and Family (Humble/Respectful split will be displayed inside panel, baseline representations are mapped here)
  {
    japanese: '父 / お父さん',
    hiragana: 'ちち / おとうさん',
    romaji: 'Chichi / Otōsan',
    english: 'Father (Humble: 父, Respectful: お父さん)',
    exampleSentence: '私の父は医者です。/ お父さんはお元気ですか？ (My father is a doctor. / Is your father well?)',
    category: 'kinship'
  },
  {
    japanese: '母 / お母さん',
    hiragana: 'はは / おかあさん',
    romaji: 'Haha / Okāsan',
    english: 'Mother (Humble: 母, Respectful: お母さん)',
    exampleSentence: '母の料理は美味しい。/ お母さんによろしく。 (My mother\'s cooking is delicious. / Give my regards to your mother.)',
    category: 'kinship'
  },
  {
    japanese: '兄 / お兄さん',
    hiragana: 'あに / おにいさん',
    romaji: 'Ani / Onīsan',
    english: 'Older Brother (Humble: 兄, Respectful: お兄さん)',
    exampleSentence: '兄は大学生です。(My older brother is a college student.)',
    category: 'kinship'
  },
  {
    japanese: '姉 / お姉さん',
    hiragana: 'あね / おねえさん',
    romaji: 'Ane / Onēsan',
    english: 'Older Sister (Humble: 姉, Respectful: お姉さん)',
    exampleSentence: '姉は銀行で働いています。(My older sister works at a bank.)',
    category: 'kinship'
  },
  {
    japanese: '弟 / 弟さん',
    hiragana: 'おとうと / おとうとさん',
    romaji: 'Otōto / Otōtosan',
    english: 'Younger Brother',
    exampleSentence: '弟は高校生です。(My younger brother is a high schooler.)',
    category: 'kinship'
  },
  {
    japanese: '妹 / 妹さん',
    hiragana: 'いもうと / いもうとさん',
    romaji: 'Imōto / Imōtosan',
    english: 'Younger Sister',
    exampleSentence: '妹はピアノを弾きます。(My younger sister plays the piano.)',
    category: 'kinship'
  },

  // Pragmatic Dialogue - Daily Conversations
  {
    japanese: 'おはようございます。',
    hiragana: 'おはようございます。',
    romaji: 'Ohayō gozaimasu.',
    english: 'Good morning (formal).',
    exampleSentence: '先生、おはようございます。(Good morning, teacher.)',
    category: 'conversation'
  },
  {
    japanese: 'お疲れ様です。',
    hiragana: 'おつかれさまです。',
    romaji: 'Otsukaresama desu.',
    english: 'Thank you for your hard work (Workplace greeting).',
    exampleSentence: '皆さん、今日もお疲れ様でした。(Thank you for your hard work today, everyone.)',
    category: 'conversation'
  },
  {
    japanese: 'これをください。',
    hiragana: 'これをください。',
    romaji: 'Kore o kudasai.',
    english: 'I will take this please.',
    exampleSentence: 'このケーキを二つと、これをください。(Give me two of this cake and this one, please.)',
    category: 'conversation'
  },
  {
    japanese: 'クレジットカードは使えますか？',
    hiragana: 'クレジットカードはつかえますか？',
    romaji: 'Kurejitto kādo wa tsukaemasu ka?',
    english: 'Can I use a credit card?',
    exampleSentence: 'お会計でクレジットカードは使えますか？(Can I use a credit card for the bill?)',
    category: 'conversation'
  },
  {
    japanese: 'メニューをお願いします。',
    hiragana: 'メニューをおねがいします。',
    romaji: 'Menyū o onegaishimasu.',
    english: 'A menu, please.',
    exampleSentence: 'すみません、メニューをお願いします。(Excuse me, a menu, please.)',
    category: 'conversation'
  },
  {
    japanese: 'お会計をお願いします。',
    hiragana: 'おかいけいをおねがいします。',
    romaji: 'Okaikei o onegaishimasu.',
    english: 'The bill, please.',
    exampleSentence: 'ごちそうさまでした。お会計をお願いします。(Thank you for the meal. The bill, please.)',
    category: 'conversation'
  },
  {
    japanese: '駅はどこですか？',
    hiragana: 'えきはどこですか？',
    romaji: 'Eki wa doko desu ka?',
    english: 'Where is the station?',
    exampleSentence: 'すみません、一番近い駅はどこですか？(Excuse me, where is the nearest station?)',
    category: 'conversation'
  },
  {
    japanese: '切符を二枚ください。',
    hiragana: 'きっぷをにまいください。',
    romaji: 'Kippu o nimai kudasai.',
    english: 'Two tickets, please.',
    exampleSentence: '東京駅までの切符を二枚ください。(Two tickets to Tokyo Station, please.)',
    category: 'conversation'
  },
  {
    japanese: '助けてください！',
    hiragana: 'たすけてください！',
    romaji: 'Tasukete kudasai!',
    english: 'Please help me!',
    exampleSentence: '誰か、助けてください！(Someone, please help me!)',
    category: 'conversation'
  },
  {
    japanese: '救急車を呼んでください。',
    hiragana: 'きゅうきゅうしゃをよんでください。',
    romaji: 'Kyūkyūsha o yonde kudasai.',
    english: 'Please call an ambulance.',
    exampleSentence: '人が倒れました！救急車を呼んでください！(A person collapsed! Please call an ambulance!)',
    category: 'conversation'
  },

  // Keigo Business Phrases
  {
    japanese: 'いつもお世話になっております。',
    hiragana: 'いつもおせわになっております。',
    romaji: 'Itsumo osewa ni natte orimasu.',
    english: 'Thank you for your continuous support (Standard professional email/greeting opener).',
    exampleSentence: '○○株式会社の田中です。いつもお世話になっております。(I am Tanaka from XX Corporation. Thank you for your support.)',
    category: 'keigo'
  },
  {
    japanese: '承知いたしました。',
    hiragana: 'しょうちいたしました。',
    romaji: 'Shōchi itashimashita.',
    english: 'I understand / I will comply (Humble/Kenjōgo acceptance of an instruction).',
    exampleSentence: 'ご指摘の件、承知いたしました。修正いたします。(I understand the point raised. I will correct it.)',
    category: 'keigo'
  },
  {
    japanese: '申し訳ございません。',
    hiragana: 'もうしわけございません。',
    romaji: 'Mōshiwake gozaimasen.',
    english: 'I am deeply sorry (Formal corporate/business apology).',
    exampleSentence: 'ご迷惑をおかけし、誠に申し訳ございません。(We are extremely sorry for causing you trouble.)',
    category: 'keigo'
  },
  {
    japanese: 'おります。',
    hiragana: 'おります。',
    romaji: 'Orimasu.',
    english: 'I am here/present (Humble state of being, replacing います).',
    exampleSentence: '本日は夕方までオフィスにおります。(I will be present in the office until evening today.)',
    category: 'keigo'
  },

  // Subcultural Lexicon (Anime and Slang)
  {
    japanese: 'ヤバい',
    hiragana: 'やばい',
    romaji: 'Yabai',
    english: 'Dangerous / Amazing / Crazy / Awful (context-dependent intensifier).',
    exampleSentence: 'このラーメン、ヤバいぐらい美味しい！/ 明日のテストはヤバい。(This ramen is crazy good! / Tomorrow\'s test is going to be awful.)',
    category: 'slang'
  },
  {
    japanese: 'オタク',
    hiragana: 'オタク',
    romaji: 'Otaku',
    english: 'A person obsessively dedicated to a specific hobby (e.g., anime, trains). Derived from honorific "your house".',
    exampleSentence: '彼はアニメオタクだ。(He is an anime enthusiast.)',
    category: 'slang'
  },
  {
    japanese: 'ツンデレ',
    hiragana: 'ツンデレ',
    romaji: 'Tsundere',
    english: 'A character trope: aloof/hostile initially, but warm/affectionate later.',
    exampleSentence: '彼女は典型的なツンデレキャラだ。(She is a typical tsundere character.)',
    category: 'slang'
  },
  {
    japanese: 'フラグ',
    hiragana: 'フラグ',
    romaji: 'Furagu',
    english: 'Flag. Narrative flag triggering a predictable plot development (e.g., "Death flag").',
    exampleSentence: 'それ、完全に死亡フラグだよ。(That is completely a death flag.)',
    category: 'slang'
  },

  // Lexicographical Master Database
  {
    japanese: '永遠',
    hiragana: 'えいえん',
    romaji: 'Eien',
    english: 'Eternity / Perpetuity',
    exampleSentence: '愛は永遠ではない。(Love is not eternal.)',
    category: 'lexicon'
  },
  {
    japanese: '努力',
    hiragana: 'どりょく',
    romaji: 'Doryoku',
    english: 'Effort / Endeavor (verb with する)',
    exampleSentence: '努力を重ねる。(To pile up effort.)',
    category: 'lexicon'
  },
  {
    japanese: '複雑',
    hiragana: 'ふくざつ',
    romaji: 'Fukuzatsu',
    english: 'Complicated / Complex',
    exampleSentence: '複雑な問題だ。(It is a complex problem.)',
    category: 'lexicon'
  },
  {
    japanese: '諦める',
    hiragana: 'あきらめる',
    romaji: 'Akirameru',
    english: 'To give up / Abandon (Ru-verb)',
    exampleSentence: '夢を諦めない。(Do not give up on your dreams.)',
    category: 'lexicon'
  },
  {
    japanese: '偶然',
    hiragana: 'ぐうぜん',
    romaji: 'Gūzen',
    english: 'Coincidence / By chance (noun/adverb)',
    exampleSentence: '偶然彼に会った。(I met him by chance.)',
    category: 'lexicon'
  },
  {
    japanese: '素晴らしい',
    hiragana: 'すばらしい',
    romaji: 'Subarashii',
    english: 'Wonderful / Splendid (I-adjective)',
    exampleSentence: '素晴らしい景色だ。(It is a wonderful view.)',
    category: 'lexicon'
  },
  {
    japanese: '影響',
    hiragana: 'えいきょう',
    romaji: 'Eikyō',
    english: 'Influence / Effect (verb with する)',
    exampleSentence: '悪影響を与える。(To impart a bad influence.)',
    category: 'lexicon'
  },
  {
    japanese: '伝統',
    hiragana: 'でんとう',
    romaji: 'Dentō',
    english: 'Tradition',
    exampleSentence: '伝統を守る。(To protect tradition.)',
    category: 'lexicon'
  },
  {
    japanese: '翻訳',
    hiragana: 'ほんやく',
    romaji: 'Honyaku',
    english: 'Translation (verb with する)',
    exampleSentence: '英語から日本語に翻訳する。(Translate from English to Japanese.)',
    category: 'lexicon'
  },
  {
    japanese: '独特',
    hiragana: 'どくとく',
    romaji: 'Dokutoku',
    english: 'Unique / Peculiar (Na-adjective)',
    exampleSentence: '独特な風味がある。(It has a unique flavor.)',
    category: 'lexicon'
  }
];

// 5. NUMERICAL & COUNTERS
export const numeralData = [
  { val: '0', kango: '零 / ゼロ', kangoRomaji: 'Rei / Zero', wago: '--', wagoRomaji: '--' },
  { val: '1', kango: '一', kangoRomaji: 'Ichi', wago: '一つ', wagoRomaji: 'Hitotsu' },
  { val: '2', kango: '二', kangoRomaji: 'Ni', wago: '二つ', wagoRomaji: 'Futatsu' },
  { val: '3', kango: '三', kangoRomaji: 'San', wago: '三つ', wagoRomaji: 'Mittsu' },
  { val: '4', kango: '四', kangoRomaji: 'Shi / Yon', wago: '四つ', wagoRomaji: 'Yottsu' },
  { val: '5', kango: '五', kangoRomaji: 'Go', wago: '五つ', wagoRomaji: 'Itsutsu' },
  { val: '6', kango: '六', kangoRomaji: 'Roku', wago: '六つ', wagoRomaji: 'Muttsu' },
  { val: '7', kango: '七', kangoRomaji: 'Shichi / Nana', wago: '七つ', wagoRomaji: 'Nanatsu' },
  { val: '8', kango: '八', kangoRomaji: 'Hachi', wago: '八つ', wagoRomaji: 'Yattsu' },
  { val: '9', kango: '九', kangoRomaji: 'Kyū / Ku', wago: '九つ', wagoRomaji: 'Kokonotsu' },
  { val: '10', kango: '十', kangoRomaji: 'Jū', wago: '十', wagoRomaji: 'Tō' },
  { val: '100', kango: '百', kangoRomaji: 'Hyaku', wago: '--', wagoRomaji: '--' },
  { val: '1,000', kango: '千', kangoRomaji: 'Sen', wago: '--', wagoRomaji: '--' },
  { val: '10,000', kango: '万', kangoRomaji: 'Man', wago: '--', wagoRomaji: '--' },
  { val: '1,000,000', kango: '百万', kangoRomaji: 'Hyaku-man', wago: '--', wagoRomaji: '--' },
  { val: '10^8', kango: '億', kangoRomaji: 'Oku', wago: '--', wagoRomaji: '--' },
  { val: '10^12', kango: '兆', kangoRomaji: 'Chō', wago: '--', wagoRomaji: '--' }
];

export const counterData: CounterItem[] = [
  { category: 'People', suffix: '〜人 (-nin)', qty1: '一人 (Hitori)', qty2: '二人 (Futari)', qty3: '三人 (San-nin)', qty4: '四人 (Yo-nin)' },
  { category: 'Small Objects', suffix: '〜個 (-ko)', qty1: '一個 (Ikko)', qty2: '二個 (Niko)', qty3: '三個 (Sanko)', qty4: '四個 (Yonko)' },
  { category: 'Flat Objects', suffix: '〜枚 (-mai)', qty1: '一枚 (Ichimai)', qty2: '二枚 (Nimai)', qty3: '三枚 (Sanmai)', qty4: '四枚 (Yonmai)' },
  { category: 'Long Objects', suffix: '〜本 (-hon)', qty1: '一本 (Ippon)', qty2: '二本 (Nihon)', qty3: '三本 (Sanbon)', qty4: '四本 (Yonhon)' },
  { category: 'Machinery/Cars', suffix: '〜台 (-dai)', qty1: '一台 (Ichidai)', qty2: '二台 (Nidai)', qty3: '三台 (Sandai)', qty4: '四台 (Yondai)' },
  { category: 'Small Animals', suffix: '〜匹 (-hiki)', qty1: '一匹 (Ippiki)', qty2: '二匹 (Nihiki)', qty3: '三匹 (Sanbiki)', qty4: '四匹 (Yonhiki)' },
  { category: 'Large Animals', suffix: '〜頭 (-tō)', qty1: '一頭 (Ittō)', qty2: '二頭 (Nitō)', qty3: '三頭 (Santō)', qty4: '四頭 (Yontō)' },
  { category: 'Buildings', suffix: '〜軒 (-ken)', qty1: '一軒 (Ikken)', qty2: '二軒 (Niken)', qty3: '三軒 (Sanken)', qty4: '四軒 (Yonken)' },
  { category: 'Bound Books', suffix: '〜冊 (-satsu)', qty1: '一冊 (Issatsu)', qty2: '二冊 (Nisatsu)', qty3: '三冊 (Sansatsu)', qty4: '四冊 (Yonsatsu)' },
  { category: 'Liquids in Cups', suffix: '〜杯 (-hai)', qty1: '一杯 (Ippai)', qty2: '二杯 (Nihai)', qty3: '三杯 (Sanbai)', qty4: '四杯 (Yonhai)' }
];

// 6. YEN REDESIGN & ECONOMY
export const banknoteData: BanknoteItem[] = [
  {
    denomination: '¥10,000',
    portrait: 'Shibusawa Eiichi',
    backDesign: 'Tokyo Station (Marunouchi Side)',
    symbolism: 'Revered as the "father of modern Japanese capitalism" (founded 500+ firms), replacing Fukuzawa Yukichi. Backside represents infrastructural modernization.'
  },
  {
    denomination: '¥5,000',
    portrait: 'Tsuda Umeko',
    backDesign: 'Japanese Wisteria flowers',
    symbolism: 'Early pioneer of female higher education, replacing Higuchi Ichiyō. Wisteria reflect enduring elegance and dialogues regarding gender equality.'
  },
  {
    denomination: '¥1,000',
    portrait: 'Kitasato Shibasaburō',
    backDesign: 'The Great Wave off Kanagawa (Hokusai ukiyo-e)',
    symbolism: 'Eminent bacteriologist who combated tetanus, replacing Noguchi Hideyo. Backside represents standard Japanese national visual identity.'
  },
  {
    denomination: '¥2,000',
    portrait: 'Shureimon Gate',
    backDesign: 'Scene from The Tale of Genji',
    symbolism: 'Commemorative note issued in 2000. It is legal tender but experiences virtually zero active circulation.'
  }
];

export const coinData: CoinItem[] = [
  { denomination: '¥500', composition: 'Bicolor Clad (2021 redesigned)', obverse: 'Paulownia', reverse: 'Bamboo & Mandarin Orange' },
  { denomination: '¥100', composition: 'Cupro-Nickel', obverse: 'Cherry Blossoms', reverse: 'Face Value' },
  { denomination: '¥50', composition: 'Cupro-Nickel (Holed)', obverse: 'Chrysanthemum', reverse: 'Face Value' },
  { denomination: '¥10', composition: 'Bronze', obverse: 'Byōdō-in Phoenix Hall', reverse: 'Evergreen Tree' },
  { denomination: '¥5', composition: 'Brass (Holed)', obverse: 'Rice Ear, Water, Gear (Agriculture/Industry)', reverse: 'Sprouting Plant' },
  { denomination: '¥1', composition: 'Aluminum', obverse: 'Young Tree', reverse: 'Face Value' }
];

// 7. CALENDAR & TEMPORALITY
export const irregularDays = [
  { day: '1st', kanji: '一日', reading: 'Tsuitachi' },
  { day: '2nd', kanji: '二日', reading: 'Futsuka' },
  { day: '3rd', kanji: '三日', reading: 'Mikka' },
  { day: '4th', kanji: '四日', reading: 'Yokka' },
  { day: '5th', kanji: '五日', reading: 'Itsuka' },
  { day: '6th', kanji: '六日', reading: 'Muika' },
  { day: '7th', kanji: '七日', reading: 'Nanoka' },
  { day: '8th', kanji: '八日', reading: 'Yōka' },
  { day: '9th', kanji: '九日', reading: 'Kokonoka' },
  { day: '10th', kanji: '十日', reading: 'Tōka' },
  { day: '14th', kanji: '十四日', reading: 'Jūyokka' },
  { day: '20th', kanji: '二十日', reading: 'Hatsuka' },
  { day: '24th', kanji: '二十四日', reading: 'Nijūyokka' }
];

export const monthData: MonthItem[] = [
  { number: '1', modern: '一月 (Ichi-gatsu)', traditional: '睦月', traditionalRomaji: 'Mutsuki', meaning: 'Month of Harmony (families gathering for the New Year).' },
  { number: '2', modern: '二月 (Ni-gatsu)', traditional: '如月 / 衣更着', traditionalRomaji: 'Kisaragi', meaning: 'Changing/Layering Clothes (due to lingering winter cold).' },
  { number: '3', modern: '三月 (San-gatsu)', traditional: '弥生', traditionalRomaji: 'Yayoi', meaning: 'Month of New Growth (plants springing to life).' },
  { number: '4', modern: '四月 (Shi-gatsu)', traditional: '卯月', traditionalRomaji: 'Uzuki', meaning: 'Month of the U-no-hana (Deutzia flower blooming).' },
  { number: '5', modern: '五月 (Go-gatsu)', traditional: '皐月', traditionalRomaji: 'Satsuki', meaning: 'Month of Rice Planting (Sanae - young seedlings).' },
  { number: '6', modern: '六月 (Roku-gatsu)', traditional: '水無月', traditionalRomaji: 'Minazuki', meaning: 'Month of Water (fields flooded; "na" acts as possessive "of", not negation).' },
  { number: '7', modern: '七月 (Shichi-gatsu)', traditional: '文月', traditionalRomaji: 'Fumizuki', meaning: 'Month of Letters (exchanging Tanabata poems).' },
  { number: '8', modern: '八月 (Hachi-gatsu)', traditional: '葉月', traditionalRomaji: 'Hazuki', meaning: 'Month of Leaves (trees full before autumn).' },
  { number: '9', modern: '九月 (Ku-gatsu)', traditional: '長月', traditionalRomaji: 'Nagatsuki', meaning: 'Long Month (referencing the lengthening of autumn nights).' },
  { number: '10', modern: '十月 (Jū-gatsu)', traditional: '神無月', traditionalRomaji: 'Kannazuki', meaning: 'Month of No Gods (all gods travel to Izumo Taisha shrine).' },
  { number: '11', modern: '十一月 (Jūichi-gatsu)', traditional: '霜月', traditionalRomaji: 'Shimotsuki', meaning: 'Month of Frost.' },
  { number: '12', modern: '十二月 (Jūni-gatsu)', traditional: '師走', traditionalRomaji: 'Shiwasu', meaning: 'Priests/Teachers Running (busy with year-end Shinto preparations).' }
];

// 8. GRAMMAR PROGRESSION MATRIX
export const grammarData: GrammarItem[] = [
  { level: 'N5', point: '[Noun] は [Noun] です', meaning: 'Equivalence (A is B)', example: '私は学生です。(I am a student.)' },
  { level: 'N5', point: '[Verb-te] ください', meaning: 'Polite request', example: '本を読んでください。(Please read the book.)' },
  { level: 'N4', point: '[Verb-ta] ことがある', meaning: 'Expressing experience (Have done before)', example: '日本に行ったことがあります。(I have been to Japan.)' },
  { level: 'N4', point: '[Noun] に比べて', meaning: 'Comparison (Compared to~)', example: '昨年に比べて暑い。(It is hotter compared to last year.)' },
  { level: 'N3', point: '[Verb-dictionary] べきだ', meaning: 'Obligation (Should / Ought to)', example: '約束を守るべきだ。(You should keep your promises.)' },
  { level: 'N3', point: '[Verb-te] しまう', meaning: 'Completion or regret/accidental action', example: 'ケーキを食べてしまった。(I completely ate the cake / I regret eating the cake.)' },
  { level: 'N2', point: '[Noun] に基づいて', meaning: 'Based upon / Derived from', example: 'データに基づいて判断する。(Judge based on the data.)' },
  { level: 'N2', point: '[Verb-dictionary] ほかない', meaning: 'No choice but to do~', example: '歩いて帰るほかない。(I have no choice but to walk home.)' },
  { level: 'N1', point: '[Noun] にひきかえ', meaning: 'In stark contrast to~', example: '兄にひきかえ、弟は怠け者だ。(In stark contrast to the older brother, the younger is lazy.)' },
  { level: 'N1', point: '[Verb-nai] ずにはいられない', meaning: 'Cannot help but do~', example: '泣かずにはいられない。(I cannot help but cry.)' }
];

// 9. VERB CONJUGATION
export const conjugationData: ConjugationItem[] = [
  { formName: 'Present (Affirmative)', plain: '書く (kaku)', polite: '書きます (kakimasu)', function: 'Habitual action or future intent. ("I write" / "I will write".)' },
  { formName: 'Past (Affirmative)', plain: '書いた (kaita)', polite: '書きました (kakimashita)', function: 'Completed action. ("I wrote".)' },
  { formName: 'Present (Negative)', plain: '書かない (kakanai)', polite: '書きません (kakimasen)', function: 'Negative habitual / future negative. ("I do not write".)' },
  { formName: 'Past (Negative)', plain: '書かなかった (kakanakatta)', polite: '書きませんでした (kakimasen deshita)', function: 'Negative completed action. ("I did not write".)' },
  { formName: 'Te-form', plain: '書いて (kaite)', polite: '-', function: 'Participle connective. (Used for requests, continuing sentences, state of being.)' },
  { formName: 'Potential', plain: '書ける (kakeru)', polite: '書けます (kakemasu)', function: 'Capability. ("Can write" / "Able to write".)' },
  { formName: 'Passive', plain: '書かれる (kakareru)', polite: '書かれます (kakaremasu)', function: 'Action received. ("Is written by someone".)' },
  { formName: 'Causative', plain: '書かせる (kakaseru)', polite: '書かせます (kakasemasu)', function: 'Compulsion / Permission. ("Make or let someone write".)' },
  { formName: 'Causative-Passive', plain: '書かせられる (kakaserareru)', polite: '書かせられます (kakaseraremasu)', function: 'Coercion. ("Made to write against one\'s will".)' },
  { formName: 'Volitional', plain: '書こう (kakō)', polite: '書きましょう (kakimashō)', function: 'Suggestion or intent. ("Let\'s write" / "Shall we write?".)' },
  { formName: 'Conditional (Ba)', plain: '書けば (kakeba)', polite: '-', function: 'Hypothetical condition. ("If I write...".)' }
];

// 10. INDIA EXAM CENTERS
export const indiaCenterData: IndiaCenterItem[] = [
  { city: 'New Delhi', sponsor: 'MOSAI (Mombusho Scholars Association of India)', description: 'The primary exam authority for northern India.' },
  { city: 'Pune', sponsor: 'JALTAP (Japanese Language Teachers\' Association, Pune)', description: 'A highly vital hub heavily attended by Pune\'s extensive IT professional community.' },
  { city: 'Kolkata', sponsor: 'IJWCA (Indo-Japan Welfare and Cultural Association)', description: 'Serves the eastern region and promotes classical cultural dialogue.' },
  { city: 'Chennai', sponsor: 'ABK-AOTS DOSOKAI Tamil Nadu Centre', description: 'Serves as a major linguistic and technical bridge organization for southern automotive and engineering sectors.' },
  { city: 'Bengaluru', sponsor: 'BNK (Bangalore Nihongo Kyooshi-kai)', description: 'Conducts tests for India\'s silicon valley tech workers and researchers.' },
  { city: 'Mumbai', sponsor: 'TAJ (Teachers Association of Japanese)', description: 'Conducts examinations for the financial capital and western region.' },
  { city: 'Hyderabad', sponsor: 'ABK-AOTS DOSOKAI Andhra Pradesh & Telangana', description: 'A rapidly growing center driven by regional tech, pharmaceutical, and gaming expansions. Regional education supported by Brolly Academy and IEFL.' },
  { city: 'Santiniketan / Karur', sponsor: 'Visva-Bharati University / JALTRA', description: 'Authorized regional testing points for academic and central-south regions.' }
];
