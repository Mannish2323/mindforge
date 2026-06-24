#!/usr/bin/env node
/**
 * import_sentences.js
 * =====================================================================
 * Learn with Velmorth — Sentences Bulk Import Script
 * =====================================================================
 *
 * Reads a CSV or JSON file and bulk-upserts rows into the `sentences`
 * table.  Designed for 100,000+ sentence imports from Tatoeba / NHK /
 * custom datasets.
 *
 * Usage:
 *   node import_sentences.js --file ./data/sentences_n5.csv
 *   node import_sentences.js --file ./data/tatoeba_ja.json --jlpt N3
 *   node import_sentences.js --file ./data/tatoeba_ja.csv --batch 1000 --dry-run
 *
 * CSV Column Order (header required):
 *   jlpt_level, japanese, hiragana, romaji, english, hindi,
 *   audio_url, grammar_id, difficulty, tags, source
 *
 * JSON: array of objects with same field names.
 * =====================================================================
 */

const { createClient } = require('@supabase/supabase-js');
const fs   = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const getArg = (f) => { const i = args.indexOf(f); return i !== -1 ? args[i+1] : null; };
const hasFlag = (f) => args.includes(f);

const FILE    = getArg('--file');
const JLPT    = getArg('--jlpt');
const DRY_RUN = hasFlag('--dry-run');
const BATCH   = parseInt(getArg('--batch') || '1000', 10);

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

function normalizeRow(raw) {
  return {
    jlpt_level:  JLPT || raw.jlpt_level || null,
    japanese:    raw.japanese || raw.ja || '',
    hiragana:    raw.hiragana || null,
    romaji:      raw.romaji || null,
    english:     raw.english || raw.en || '',
    hindi:       raw.hindi || null,
    audio_url:   raw.audio_url || null,
    grammar_id:  raw.grammar_id ? parseInt(raw.grammar_id, 10) : null,
    difficulty:  parseInt(raw.difficulty || '1', 10) || 1,
    tags:        raw.tags ? raw.tags.split('|').map(t => t.trim()) : [],
    source:      raw.source || 'manual',
    is_active:   true,
  };
}

async function main() {
  const ext  = path.extname(FILE).toLowerCase();
  const text = fs.readFileSync(FILE, 'utf8');

  let rows;
  if (ext === '.json') {
    const parsed = JSON.parse(text);
    rows = Array.isArray(parsed) ? parsed : parsed.sentences || parsed.data || [];
  } else {
    rows = parseCSV(text);
  }

  const records = rows.map(normalizeRow).filter(r => r.japanese && r.english);

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
      .from('sentences')
      .insert(batch);  // insert (not upsert) — sentences don't have unique constraint

    if (error) {
      console.error(`❌  Batch ${Math.floor(i/BATCH)+1} error:`, error.message);
      failed += batch.length;
    } else {
      inserted += batch.length;
      process.stdout.write(`\r✔   ${inserted} / ${records.length} inserted`);
    }
  }

  console.log(`\n🎉  Done — ${inserted} inserted, ${failed} failed`);
}

main().catch(e => { console.error(e); process.exit(1); });
