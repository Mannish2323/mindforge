// ================================================================
// Learn with Velmorth — Japanese Writing Practice Stroke Data
// ================================================================

export interface ExampleWord {
  japanese: string;
  romaji: string;
  meaning: string;
}

export interface CharacterMeta {
  char: string;
  romaji: string;
  meaning: string; // Meaning (e.g., romaji sound for kana, english meaning for kanji)
  type: 'hiragana' | 'katakana' | 'kanji';
  level: 'basic' | 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  strokesCount: number;
  hints: string;
  examples: ExampleWord[];
  prebundledPaths?: string[]; // Statically bundled paths for offline access
}

/**
 * Pre-bundled SVG stroke paths for core Hiragana and Katakana (A, I, U, E, O)
 * and basic N5 Kanji (One, Two, Three) to support out-of-the-box offline learning.
 */
export const CORE_OFFLINE_DATA: Record<string, string[]> = {
  // あ (Hiragana A)
  'あ': [
    'M20,38.5c2.3,0.8,4.7,0.7,7,0.4c11.5-1.5,35-4.5,45-5c2.3-0.1,4.7-0.1,7,0.4',
    'M48.5,14.5c1.2,1.2,1.7,3.1,1.7,5c0,11.5,0.2,46-0.2,56.5c-0.1,2.8-0.1,5,0.2,6.5',
    'M33,63.5c1.5,1.5,3.2,1.7,5.5,0.7c8.5-3.5,23.5-10.2,29.5-12.2c5.5-1.8,7.5,1.2,5,5.5C65.5,70,50,86.5,39,91c-3.5,1.5-6.5,0.5-8-3c-3-7,0.5-22.5,12.5-31c8.5-6,19-8.5,27.5-8.5c12,0,19.5,6,19.5,15.5c0,17.5-14.5,29-27.5,31'
  ],
  // い (Hiragana I)
  'い': [
    'M25.5,22c2.25,1.5,3,3.75,3,6.25c0,10.25-1,28-5.5,42.5c-1.5,4.75-4.25,9.25-7,12.25c-2.75,3-4.5,0.75-5.5-1.75c-1-2.5-1.75-6.25-1-10c2.5-12.5,6.5-32.25,8-43.25',
    'M73,28.5c1.25,1.25,1.5,3,1.5,4.75c0,8.25-0.75,22.25-2.25,32.25c-0.5,3.25-1.75,6.75-3.25,9.75c-1.5,3-3.25,1.75-4-0.75c-1-3.25-1.5-7.75-0.5-12c2-8.5,5-24.5,6.5-31.5'
  ],
  // う (Hiragana U)
  'う': [
    'M32.5,17c2.75,1.5,6.75,1.25,9.75,0.75c7.25-1.25,18.5-3.75,25-5.25c2.75-0.62,5.25-0.62,7.75,0c2.25,0.56,4,2.25,3,5.06c-1.5,4.22-3,8.44-5.5,13.22',
    'M28.5,45.5c3.25,1.75,6.75,1.5,10,0.5c12-3.75,27.5-8,36.5-9c5.25-0.58,7.5,2.03,5.5,6.34C73,58,56.5,82.5,34.5,91.5c-3.25,1.33-6.25,0.06-7.75-3.25C24.25,82,21.5,69.5,26.5,57.5'
  ],
  // え (Hiragana E)
  'え': [
    'M36,17.25c2.5,1.5,5.5,1.5,8.5,1c6.5-1,14.5-3,20.5-4c2.5-0.42,5-0.42,7.5,0c2.25,0.38,3.5,1.88,2.5,4.12c-1.5,3.38-3,6.75-5.5,11.12',
    'M21.5,47.25c3,1.75,6.5,1.25,9.5,0.75c16.5-2.75,37.5-6.25,50-8.25c5.25-0.84,7,1.88,3.5,5.88c-7.5,8.5-20.5,23.25-27.5,30.75C51,83,49.5,84,52,84.5c9.5,1.88,18.5,4.62,24,7.88c4.5,2.67,6,5,4.5,8.12c-1.5,3.12-6.5,0.88-10.5-2c-7.5-5.38-16.5-11.25-24.5-16.75c-4-2.75-5.5-0.38-3,3c5,6.75,9.5,13.5,10,21.25'
  ],
  // お (Hiragana O)
  'お': [
    'M20.5,38.25c2.25,0.75,4.75,0.5,7.25,0.25c11.5-1.12,35.5-3.75,45-4.25c2.25-0.12,4.75-0.12,7,0.25',
    'M49,15c1.25,1.25,1.75,3,1.75,5c0,16.5,0.25,48.5-0.25,58.75c-0.5,10.25-6.5,19.25-15.5,21c-5.25,1-8.5-2.5-9.75-5.75c-2-5.25,0.5-12.75,8.5-17.75c6.5-4,17.5-8.25,27.5-8.25c14.5,0,21.5,8.25,21.5,19.25c0,16.5-15.5,25.5-27.5,27.5',
    'M73.5,16.25c3,1.5,6,4.5,8,7.5c1.5,2.25,1,4-1,6.25c-3,3.38-6,6.75-8.5,9.25'
  ],

  // ア (Katakana A)
  'ア': [
    'M22,23.5c2.5,1,5.5,0.75,8,0.5c18.5-1.88,38.5-4.5,47.5-5.5c5.5-0.62,8.25,1.88,5,6.25c-5,6.75-15.5,20.25-22.5,28.25',
    'M54,49.25c1.25,1.5,1.5,3.5,1.5,5.75c0,11.25-0.5,26.5-9,38c-3.25,4.38-6.25,0.75-8-1.5'
  ],
  // イ (Katakana I)
  'イ': [
    'M62,15.5c0.12,1.25-0.25,3.25-1,4.75C51,39.5,36,62,17.5,76.5',
    'M48.5,38.25c1.25,1.25,1.75,3,1.75,5.25c0,12.5,0.25,35-0.25,47c0,2.75-0.12,5.25,0.25,7.25'
  ],
  // ウ (Katakana U)
  'ウ': [
    'M49.5,13.5c1.25,1.25,1.5,3,1.5,4.75c0,4.25-0.25,8.5-0.25,12.75',
    'M24.5,32.25c2,1,4.5,1,6.5,0.75c9.5-1.25,16.5-2.5,23-3.75c2-0.38,4-0.38,6,0',
    'M21.5,35.25c2.5,1,5.25,0.75,7.75,0.5C48,33.5,68,30.5,79.5,29c5.25-0.68,7.5,1.88,5,6.12c-7,11.88-21,34.88-34,48.88c-3,3.25-6.25,0.5-8-2.25'
  ],
  // エ (Katakana E)
  'エ': [
    'M25.5,24.5c2.5,0.75,5.5,0.5,8,0.25c12.5-1.12,27.5-2.75,37.5-3.5c2.5-0.18,5-0.18,7.5,0.25',
    'M51.5,25.25c1.25,1.25,1.75,2.75,1.75,4.5c0,11.5,0.25,27.5-0.25,37.75',
    'M16.5,71.25c3,1,6.5,0.75,9.5,0.5c20.5-1.88,43.5-3.75,57-4.5c3-0.17,6-0.17,9,0.5'
  ],
  // オ (Katakana O)
  'オ': [
    'M19.5,38.25c2.5,0.75,5.25,0.5,7.75,0.25c18.5-1.88,40.5-4.25,54.5-5.25c2.5-0.18,5-0.18,7.5,0.25',
    'M53.5,16.25c1.25,1.25,1.75,3,1.75,5.25c0,19.5,0.25,48.5-0.25,61.75c-0.5,13.25-7.5,18.25-17.5,10c-3.25-2.67-6.25-6.75-8-9.25',
    'M48.5,42.25c0.12,1.25-0.25,3.25-1,4.75C39.5,60.5,28.5,75.5,15.5,85.5'
  ],

  // 一 (Kanji One)
  '一': [
    'M15,51.5c3.2,0.8,6.4,0.7,9.6,0.3c15.4-1.8,40.4-4.8,55.4-5.8c3.2-0.2,6.4-0.2,9.6,0.3'
  ],
  // 二 (Kanji Two)
  '二': [
    'M28.5,29.5c2.5,0.7,5,0.6,7.5,0.3c10-1.2,22.5-2.7,31.5-3.3c2.5-0.16,5-0.16,7.5,0.3',
    'M18,72.5c3.2,0.8,6.4,0.7,9.6,0.3c16.4-1.8,42.4-4.3,55.4-5.3c3.2-0.2,6.4-0.2,9.6,0.3'
  ],
  // 三 (Kanji Three)
  '三': [
    'M25,26c2.5,0.7,5,0.6,7.5,0.3c9.5-1.1,23-2.6,32.5-3.2c2.5-0.16,5-0.16,7.5,0.3',
    'M32.5,49.5c2.2,0.6,4.4,0.5,6.6,0.2c7.4-0.9,18.4-2.2,25.4-2.7c2.2-0.16,4.4-0.16,6.6,0.2',
    'M15,79c3.2,0.8,6.4,0.7,9.6,0.3c18.4-1.8,47.4-4.8,61.4-5.8c3.2-0.2,6.4-0.2,9.6,0.3'
  ]
};

/**
 * Generate full metadata for Japanese Hiragana and Katakana alphabets
 * and basic N5 Kanji characters to facilitate learning flow and statistics tracking.
 */
export const HIRAGANA_META: CharacterMeta[] = [
  {
    char: 'あ', romaji: 'a', meaning: 'a', type: 'hiragana', level: 'basic', strokesCount: 3,
    hints: 'Looks like an apple with a stem.',
    examples: [
      { japanese: 'あめ', romaji: 'ame', meaning: 'Rain / Candy' },
      { japanese: 'あおい', romaji: 'aoi', meaning: 'Blue' }
    ]
  },
  {
    char: 'い', romaji: 'i', meaning: 'i', type: 'hiragana', level: 'basic', strokesCount: 2,
    hints: 'Two vertical strokes, resembling two vertical eels.',
    examples: [
      { japanese: 'いぬ', romaji: 'inu', meaning: 'Dog' },
      { japanese: 'いち', romaji: 'ichi', meaning: 'One' }
    ]
  },
  {
    char: 'う', romaji: 'u', meaning: 'u', type: 'hiragana', level: 'basic', strokesCount: 2,
    hints: 'Looks like a person bending over carrying a heavy load.',
    examples: [
      { japanese: 'うみ', romaji: 'umi', meaning: 'Sea / Ocean' },
      { japanese: 'うた', romaji: 'uta', meaning: 'Song' }
    ]
  },
  {
    char: 'え', romaji: 'e', meaning: 'e', type: 'hiragana', level: 'basic', strokesCount: 2,
    hints: 'Looks like an exotic bird or a running man.',
    examples: [
      { japanese: 'えき', romaji: 'eki', meaning: 'Station' },
      { japanese: 'えんぴつ', romaji: 'enpitsu', meaning: 'Pencil' }
    ]
  },
  {
    char: 'お', romaji: 'o', meaning: 'o', type: 'hiragana', level: 'basic', strokesCount: 3,
    hints: 'Looks like a person golfing (ball flying to the right).',
    examples: [
      { japanese: 'おいしい', romaji: 'oishii', meaning: 'Delicious' },
      { japanese: 'おちゃ', romaji: 'ocha', meaning: 'Green tea' }
    ]
  },
  {
    char: 'か', romaji: 'ka', meaning: 'ka', type: 'hiragana', level: 'basic', strokesCount: 3,
    hints: 'Looks like a kangaroo kicking its legs.',
    examples: [
      { japanese: 'かさ', romaji: 'kasa', meaning: 'Umbrella' },
      { japanese: 'かばん', romaji: 'kaban', meaning: 'Bag' }
    ]
  },
  {
    char: 'き', romaji: 'ki', meaning: 'ki', type: 'hiragana', level: 'basic', strokesCount: 4,
    hints: 'Looks like a key.',
    examples: [
      { japanese: 'きっぷ', romaji: 'kippu', meaning: 'Ticket' },
      { japanese: 'きのう', romaji: 'kinou', meaning: 'Yesterday' }
    ]
  },
  {
    char: 'く', romaji: 'ku', meaning: 'ku', type: 'hiragana', level: 'basic', strokesCount: 1,
    hints: 'Looks like a bird beak crying "kookoo".',
    examples: [
      { japanese: 'くるま', romaji: 'kuruma', meaning: 'Car' },
      { japanese: 'くつ', romaji: 'kutsu', meaning: 'Shoes' }
    ]
  },
  {
    char: 'け', romaji: 'ke', meaning: 'ke', type: 'hiragana', level: 'basic', strokesCount: 3,
    hints: 'Looks like a keg of beer with a tap on the left.',
    examples: [
      { japanese: 'けいたい', romaji: 'keitai', meaning: 'Mobile phone' },
      { japanese: 'けっこん', romaji: 'kekkon', meaning: 'Marriage' }
    ]
  },
  {
    char: 'こ', romaji: 'ko', meaning: 'ko', type: 'hiragana', level: 'basic', strokesCount: 2,
    hints: 'Two parallel lines like two corners of a box.',
    examples: [
      { japanese: 'こども', romaji: 'kodomo', meaning: 'Child' },
      { japanese: 'こころ', romaji: 'kokoro', meaning: 'Heart / Spirit' }
    ]
  }
];

export const KATAKANA_META: CharacterMeta[] = [
  {
    char: 'ア', romaji: 'a', meaning: 'a', type: 'katakana', level: 'basic', strokesCount: 2,
    hints: 'Looks like a cliff corner or an arrow point.',
    examples: [
      { japanese: 'アメリカ', romaji: 'amerika', meaning: 'America' },
      { japanese: 'アイス', romaji: 'aisu', meaning: 'Ice cream' }
    ]
  },
  {
    char: 'イ', romaji: 'i', meaning: 'i', type: 'katakana', level: 'basic', strokesCount: 2,
    hints: 'Looks like an easel or a person standing.',
    examples: [
      { japanese: 'イギリス', romaji: 'igirisu', meaning: 'United Kingdom' },
      { japanese: 'インク', romaji: 'inku', meaning: 'Ink' }
    ]
  },
  {
    char: 'ウ', romaji: 'u', meaning: 'u', type: 'katakana', level: 'basic', strokesCount: 3,
    hints: 'Looks like a cook under an umbrella.',
    examples: [
      { japanese: 'ウサギ', romaji: 'usagi', meaning: 'Rabbit' },
      { japanese: 'ウイスキー', romaji: 'uisukii', meaning: 'Whiskey' }
    ]
  },
  {
    char: 'エ', romaji: 'e', meaning: 'e', type: 'katakana', level: 'basic', strokesCount: 3,
    hints: 'Looks like an engineer\'s steel girder or capital letter I.',
    examples: [
      { japanese: 'エアコン', romaji: 'eakon', meaning: 'Air conditioner' },
      { japanese: 'エレベーター', romaji: 'erebeetaa', meaning: 'Elevator' }
    ]
  },
  {
    char: 'オ', romaji: 'o', meaning: 'o', type: 'katakana', level: 'basic', strokesCount: 3,
    hints: 'Looks like a person running with their arms outstretched.',
    examples: [
      { japanese: 'オレンジ', romaji: 'orenji', meaning: 'Orange' },
      { japanese: 'オーケストラ', romaji: 'ookesutora', meaning: 'Orchestra' }
    ]
  }
];

export const KANJI_META: CharacterMeta[] = [
  {
    char: '一', romaji: 'ichi', meaning: 'One', type: 'kanji', level: 'N5', strokesCount: 1,
    hints: 'A single horizontal line representing one.',
    examples: [
      { japanese: '一つ', romaji: 'hitotsu', meaning: 'One item' },
      { japanese: '一人', romaji: 'hitori', meaning: 'One person' }
    ]
  },
  {
    char: '二', romaji: 'ni', meaning: 'Two', type: 'kanji', level: 'N5', strokesCount: 2,
    hints: 'Two horizontal lines representing two.',
    examples: [
      { japanese: '二つ', romaji: 'futatsu', meaning: 'Two items' },
      { japanese: '二人', romaji: 'futari', meaning: 'Two people' }
    ]
  },
  {
    char: '三', romaji: 'san', meaning: 'Three', type: 'kanji', level: 'N5', strokesCount: 3,
    hints: 'Three horizontal lines representing three.',
    examples: [
      { japanese: '三つ', romaji: 'mitsu', meaning: 'Three items' },
      { japanese: '三人', romaji: 'sannin', meaning: 'Three people' }
    ]
  },
  {
    char: '四', romaji: 'yon', meaning: 'Four', type: 'kanji', level: 'N5', strokesCount: 5,
    hints: 'A box enclosing two legs (representing four corners).',
    examples: [
      { japanese: '四つ', romaji: 'yotsu', meaning: 'Four items' },
      { japanese: '四月', romaji: 'shigatsu', meaning: 'April' }
    ]
  },
  {
    char: '五', romaji: 'go', meaning: 'Five', type: 'kanji', level: 'N5', strokesCount: 4,
    hints: 'Looks like a stylized number 5.',
    examples: [
      { japanese: '五つ', romaji: 'itsutsu', meaning: 'Five items' },
      { japanese: '五月', romaji: 'gogatsu', meaning: 'May' }
    ]
  },
  {
    char: '日', romaji: 'hi / nichi', meaning: 'Day / Sun', type: 'kanji', level: 'N5', strokesCount: 4,
    hints: 'A box representing the sun with a dividing ray in the middle.',
    examples: [
      { japanese: '日本', romaji: 'nihon', meaning: 'Japan' },
      { japanese: '日曜日', romaji: 'nichiyoubi', meaning: 'Sunday' }
    ]
  },
  {
    char: '本', romaji: 'hon', meaning: 'Book / Origin', type: 'kanji', level: 'N5', strokesCount: 5,
    hints: 'A tree symbol with a horizontal slice indicating the book source or origin.',
    examples: [
      { japanese: '日本語', romaji: 'nihongo', meaning: 'Japanese Language' },
      { japanese: '本棚', romaji: 'hondana', meaning: 'Bookshelf' }
    ]
  },
  {
    char: '人', romaji: 'hito / jin', meaning: 'Person', type: 'kanji', level: 'N5', strokesCount: 2,
    hints: 'Two strokes forming a person standing on two legs.',
    examples: [
      { japanese: '日本人', romaji: 'nihonjin', meaning: 'Japanese Person' },
      { japanese: '大人', romaji: 'otona', meaning: 'Adult' }
    ]
  }
];

/**
 * Returns the Unicode hex representation for a given character.
 */
export function getUnicodeHex(char: string): string {
  const code = char.charCodeAt(0).toString(16).toLowerCase();
  return code.padStart(5, '0');
}

/**
 * Fetch stroke paths from KanjiVG CDN dynamically and parse them.
 * Automatically falls back to pre-bundled data if available or if offline.
 */
export async function getStrokePaths(char: string): Promise<string[]> {
  // Check static bundle first
  if (CORE_OFFLINE_DATA[char]) {
    return CORE_OFFLINE_DATA[char];
  }

  // Check LocalStorage cache
  const cacheKey = `velmorth_stroke_paths_${char}`;
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (_) {
        // Corrupted cache, continue
      }
    }
  }

  // Load from KanjiVG CDN
  try {
    const hex = getUnicodeHex(char);
    const url = `https://cdn.jsdelivr.net/gh/kanjivg/kanjivg@master/kanji/${hex}.svg`;
    
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch SVG for character: ${char} (${hex})`);
    }

    const svgText = await res.text();
    
    // Parse SVG in the browser
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(svgText, 'image/svg+xml');
    const paths = xmlDoc.getElementsByTagName('path');
    
    const strokePaths: string[] = [];
    for (let i = 0; i < paths.length; i++) {
      const d = paths[i].getAttribute('d');
      // Filter out any background or guideline tags that are not the stroke paths
      const id = paths[i].getAttribute('id');
      if (d && (!id || id.includes('-s'))) {
        strokePaths.push(d);
      }
    }

    if (strokePaths.length === 0) {
      throw new Error('No paths found in character SVG');
    }

    // Cache the paths
    if (typeof window !== 'undefined') {
      localStorage.setItem(cacheKey, JSON.stringify(strokePaths));
    }

    return strokePaths;
  } catch (error) {
    console.error(`Error loading stroke paths for '${char}':`, error);
    // If dynamic fetch fails, return a basic fallback vector representation
    return CORE_OFFLINE_DATA['一'] || [];
  }
}
