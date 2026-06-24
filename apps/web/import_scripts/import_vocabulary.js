#!/usr/bin/env node
/**
 * import_vocabulary.js
 * =====================================================================
 * Learn with Velmorth — Vocabulary Bulk Import Script
 * =====================================================================
 *
 * Reads a CSV or JSON file and bulk-upserts rows into the `vocabulary`
 * table in Supabase using the Supabase JS client (service-role key).
 *
 * Usage:
 *   node import_vocabulary.js --file ./data/vocab_n5.csv
 *   node import_vocabulary.js --file ./data/vocab_all.json
 *   node import_vocabulary.js --file ./data/vocab_n5.csv --jlpt N5 --dry-run
 *
 * CSV Column Order (header required):
 *   jlpt_level, word_japanese, hiragana, katakana, romaji,
 *   english, hindi, meaning, part_of_speech,
 *   example_japanese, example_english, example_hindi,
 *   audio_url, difficulty, tags, frequency_rank
 *
 * JSON format: array of objects with the same field names.
 * =====================================================================
 */

const { createClient } = require('@supabase/supabase-js');
const fs   = require('fs');
const path = require('path');

// ── CLI args ──────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const getArg = (flag) => {
  const i = args.indexOf(flag);
  return i !== -1 ? args[i + 1] : null;
};
const hasFlag = (flag) => args.includes(flag);

const FILE    = getArg('--file');
const JLPT    = getArg('--jlpt');   // filter override
const DRY_RUN = hasFlag('--dry-run');
const BATCH   = parseInt(getArg('--batch') || '500', 10);

if (!FILE) {
  console.error('❌  --file <path> is required');
  process.exit(1);
}

// ── Supabase client (service role for bulk writes) ───────────────────
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
  || process.env.SUPABASE_URL;
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌  Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars');
  console.error('   You can use a .env.local file or export them in your shell');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ── Parsers ───────────────────────────────────────────────────────────
function parseCSV(text) {
  const lines  = text.trim().split(/\r?\n/);
  const header = lines[0].split(',').map(h => h.trim());
  return lines.slice(1).map(line => {
    // naive CSV split — handles quoted fields with internal commas
    const cols = [];
    let cur = '', inQ = false;
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

function normalizeRow(raw) {
  // Convert raw fields to Supabase column types
  return {
    jlpt_level:       JLPT || raw.jlpt_level || null,
    word_japanese:    raw.word_japanese || raw.japanese || '',
    hiragana:         raw.hiragana || null,
    katakana:         raw.katakana || null,
    romaji:           raw.romaji || null,
    english:          raw.english || raw.meaning_english || '',
    hindi:            raw.hindi || raw.meaning_hindi || null,
    meaning:          raw.meaning || null,
    part_of_speech:   raw.part_of_speech || raw.pos || null,
    example_japanese: raw.example_japanese || null,
    example_english:  raw.example_english || null,
    example_hindi:    raw.example_hindi || null,
    audio_url:        raw.audio_url || null,
    difficulty:       parseInt(raw.difficulty || '1', 10) || 1,
    tags:             raw.tags ? raw.tags.split('|').map(t => t.trim()) : [],
    frequency_rank:   raw.frequency_rank ? parseInt(raw.frequency_rank, 10) : null,
    is_active:        true,
  };
}

// ── Main ──────────────────────────────────────────────────────────────
async function main() {
  const ext  = path.extname(FILE).toLowerCase();
  const text = fs.readFileSync(FILE, 'utf8');

  let rows;
  if (ext === '.json') {
    const parsed = JSON.parse(text);
    rows = Array.isArray(parsed) ? parsed : parsed.vocabulary || parsed.data || [];
  } else {
    rows = parseCSV(text);
  }

  const records = rows
    .map(normalizeRow)
    .filter(r => r.word_japanese && r.english);

  console.log(`📄  File: ${FILE}`);
  console.log(`📊  Total rows parsed: ${rows.length}`);
  console.log(`✅  Valid records: ${records.length}`);
  if (DRY_RUN) {
    console.log('🔍  DRY RUN — first 3 records preview:');
    console.dir(records.slice(0, 3), { depth: null });
    return;
  }

  // Batch upsert
  let inserted = 0, failed = 0;
  for (let i = 0; i < records.length; i += BATCH) {
    const batch = records.slice(i, i + BATCH);
    const { error } = await supabase
      .from('vocabulary')
      .upsert(batch, { onConflict: 'word_japanese,jlpt_level', ignoreDuplicates: false });

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
