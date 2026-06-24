#!/usr/bin/env node
/**
 * import_kanji.js
 * =====================================================================
 * Learn with Velmorth — Kanji Bulk Import Script
 * =====================================================================
 *
 * Reads a CSV or JSON file and bulk-upserts rows into the `kanji`
 * table in Supabase using the service-role key.
 *
 * Usage:
 *   node import_kanji.js --file ./data/kanji_n5.csv
 *   node import_kanji.js --file ./data/joyo_kanji.json --dry-run
 *
 * CSV Column Order (header required):
 *   character, jlpt_level, grade, stroke_count,
 *   onyomi, kunyomi, meaning_english, meaning_hindi,
 *   radical, radical_meaning, mnemonic, kanjivg_id,
 *   audio_url, frequency_rank, tags
 *
 *   - onyomi / kunyomi: pipe-separated  e.g.  ショク|ジキ
 *   - tags:             pipe-separated
 *   - example_words:    JSON string    e.g.  [{"word":"食べる","reading":"たべる","meaning":"to eat"}]
 *
 * JSON format: array of objects with the same field names.
 * =====================================================================
 */

const { createClient } = require('@supabase/supabase-js');
const fs   = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const getArg = (f) => { const i = args.indexOf(f); return i !== -1 ? args[i+1] : null; };
const hasFlag = (f) => args.includes(f);

const FILE    = getArg('--file');
const DRY_RUN = hasFlag('--dry-run');
const BATCH   = parseInt(getArg('--batch') || '200', 10);

if (!FILE) { console.error('❌  --file <path> required'); process.exit(1); }

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌  Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  const header = lines[0].split(',').map(h => h.trim());
  return lines.slice(1).map(line => {
    const cols = []; let cur = '', inQ = false;
    for (const ch of line) {
      if (ch === '"') { inQ = !inQ; }
      else if (ch === ',' && !inQ) { cols.push(cur); cur = ''; }
      else { cur += ch; }
    }
    cols.push(cur);
    const row = {};
    header.forEach((h, i) => { row[h] = (cols[i] || '').trim(); });
    return row;
  });
}

function parsePipeArray(val) {
  if (!val || val === '') return [];
  return val.split('|').map(s => s.trim()).filter(Boolean);
}

function normalizeKanji(raw) {
  let exampleWords = [];
  try {
    if (raw.example_words) exampleWords = JSON.parse(raw.example_words);
  } catch { /* keep empty */ }

  return {
    character:       raw.character || '',
    jlpt_level:      raw.jlpt_level || null,
    grade:           raw.grade ? parseInt(raw.grade, 10) : null,
    stroke_count:    raw.stroke_count ? parseInt(raw.stroke_count, 10) : null,
    onyomi:          parsePipeArray(raw.onyomi),
    kunyomi:         parsePipeArray(raw.kunyomi),
    meaning_english: raw.meaning_english || raw.meaning || '',
    meaning_hindi:   raw.meaning_hindi || null,
    radical:         raw.radical || null,
    radical_meaning: raw.radical_meaning || null,
    example_words:   exampleWords,
    mnemonic:        raw.mnemonic || null,
    kanjivg_id:      raw.kanjivg_id || null,
    audio_url:       raw.audio_url || null,
    frequency_rank:  raw.frequency_rank ? parseInt(raw.frequency_rank, 10) : null,
    tags:            parsePipeArray(raw.tags),
    is_active:       true,
  };
}

async function main() {
  const ext  = path.extname(FILE).toLowerCase();
  const text = fs.readFileSync(FILE, 'utf8');

  let rows;
  if (ext === '.json') {
    const parsed = JSON.parse(text);
    rows = Array.isArray(parsed) ? parsed : parsed.kanji || parsed.data || [];
  } else {
    rows = parseCSV(text);
  }

  const records = rows.map(normalizeKanji).filter(r => r.character && r.meaning_english);

  console.log(`📄  File: ${FILE}`);
  console.log(`📊  Total rows: ${rows.length}  |  Valid: ${records.length}`);

  if (DRY_RUN) {
    console.log('🔍  DRY RUN — first 3 records:');
    console.dir(records.slice(0, 3), { depth: null });
    return;
  }

  let inserted = 0, failed = 0;
  for (let i = 0; i < records.length; i += BATCH) {
    const batch = records.slice(i, i + BATCH);
    const { error } = await supabase
      .from('kanji')
      .upsert(batch, { onConflict: 'character', ignoreDuplicates: false });

    if (error) {
      console.error(`❌  Batch ${Math.floor(i/BATCH)+1} error:`, error.message);
      failed += batch.length;
    } else {
      inserted += batch.length;
      console.log(`✔   Batch ${Math.floor(i/BATCH)+1}: ${inserted} / ${records.length} inserted`);
    }
  }

  console.log(`\n🎉  Done — ${inserted} inserted, ${failed} failed`);
}

main().catch(e => { console.error(e); process.exit(1); });
