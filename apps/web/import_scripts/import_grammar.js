#!/usr/bin/env node
/**
 * import_grammar.js
 * =====================================================================
 * Learn with Velmorth — Grammar Rules Bulk Import Script
 * =====================================================================
 *
 * Usage:
 *   node import_grammar.js --file ./data/grammar_n5.csv
 *   node import_grammar.js --file ./data/grammar_all.json --dry-run
 *
 * CSV Column Order:
 *   jlpt_level, pattern, title, meaning_english, meaning_hindi,
 *   formation, example_japanese, example_english, example_hindi,
 *   notes, related_patterns, difficulty, tags
 *
 *   - related_patterns: pipe-separated
 *   - tags:             pipe-separated
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

if (!FILE) { console.error('❌  --file required'); process.exit(1); }

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌  Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY'); process.exit(1);
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
    jlpt_level:       raw.jlpt_level || null,
    pattern:          raw.pattern || '',
    title:            raw.title || raw.pattern || '',
    meaning_english:  raw.meaning_english || raw.meaning || '',
    meaning_hindi:    raw.meaning_hindi || null,
    formation:        raw.formation || null,
    example_japanese: raw.example_japanese || null,
    example_english:  raw.example_english || null,
    example_hindi:    raw.example_hindi || null,
    notes:            raw.notes || null,
    related_patterns: raw.related_patterns ? raw.related_patterns.split('|').map(s => s.trim()) : [],
    difficulty:       parseInt(raw.difficulty || '1', 10) || 1,
    tags:             raw.tags ? raw.tags.split('|').map(t => t.trim()) : [],
    is_active:        true,
  };
}

async function main() {
  const ext  = path.extname(FILE).toLowerCase();
  const text = fs.readFileSync(FILE, 'utf8');

  let rows;
  if (ext === '.json') {
    const parsed = JSON.parse(text);
    rows = Array.isArray(parsed) ? parsed : parsed.grammar || parsed.data || [];
  } else {
    rows = parseCSV(text);
  }

  const records = rows.map(normalizeRow).filter(r => r.pattern && r.meaning_english);
  console.log(`📄  File: ${FILE}  |  Valid: ${records.length} / ${rows.length}`);

  if (DRY_RUN) {
    console.log('🔍  DRY RUN — first 3:');
    console.dir(records.slice(0, 3), { depth: null });
    return;
  }

  let inserted = 0, failed = 0;
  for (let i = 0; i < records.length; i += BATCH) {
    const batch = records.slice(i, i + BATCH);
    const { error } = await supabase.from('grammar').insert(batch);
    if (error) { console.error(`❌  Batch error:`, error.message); failed += batch.length; }
    else { inserted += batch.length; console.log(`✔   ${inserted} / ${records.length}`); }
  }
  console.log(`\n🎉  Done — ${inserted} inserted, ${failed} failed`);
}

main().catch(e => { console.error(e); process.exit(1); });
