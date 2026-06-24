# Learn with Velmorth — Import Scripts

Bulk data import pipeline for populating the Supabase database with large-scale content:
50,000+ vocabulary words, 2,136+ Kanji, 100,000+ sentences, 1,500+ grammar rules.

---

## Prerequisites

```bash
# Install the Supabase JS client if not already available
npm install @supabase/supabase-js
```

Set environment variables (you can use a `.env` file or export them):

```bash
export SUPABASE_URL=https://your-project.supabase.co
export SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

> ⚠️ **Use the SERVICE ROLE key** (not the anon key). This bypasses RLS and allows bulk writes.  
> Never commit this key to git. Keep it in `.env.local` (already gitignored).

---

## Scripts

| Script | Table | Batch Size | Notes |
|--------|-------|-----------|-------|
| `import_vocabulary.js` | `vocabulary` | 500 | Upsert by `word_japanese + jlpt_level` |
| `import_kanji.js` | `kanji` | 200 | Upsert by `character` |
| `import_sentences.js` | `sentences` | 1000 | Insert (no unique key) |
| `import_grammar.js` | `grammar` | 200 | Insert |

---

## Usage

### 1. Vocabulary

```bash
# Dry run (preview first 3 records — no DB writes)
node import_scripts/import_vocabulary.js --file import_scripts/data_samples/vocab_n5_sample.csv --dry-run

# Import N5 vocabulary
node import_scripts/import_vocabulary.js --file ./data/vocab_n5.csv --jlpt N5

# Import all JLPT levels from JSON
node import_scripts/import_vocabulary.js --file ./data/vocab_all.json
```

### 2. Kanji

```bash
# Dry run
node import_scripts/import_kanji.js --file import_scripts/data_samples/kanji_n5_sample.csv --dry-run

# Import all Joyo kanji
node import_scripts/import_kanji.js --file ./data/joyo_kanji.csv --batch 500
```

### 3. Sentences (100k+)

```bash
# Large-scale import with batch size 2000
node import_scripts/import_sentences.js --file ./data/tatoeba_ja.csv --jlpt N5 --batch 2000
```

### 4. Grammar Rules

```bash
node import_scripts/import_grammar.js --file ./data/grammar_n5.csv
node import_scripts/import_grammar.js --file ./data/grammar_all.json
```

---

## CSV Column Reference

### `vocabulary`
```
jlpt_level, word_japanese, hiragana, katakana, romaji,
english, hindi, meaning, part_of_speech,
example_japanese, example_english, example_hindi,
audio_url, difficulty, tags, frequency_rank
```
- `tags`: pipe-separated `food|verb|n5`
- `difficulty`: 1–5

### `kanji`
```
character, jlpt_level, grade, stroke_count,
onyomi, kunyomi, meaning_english, meaning_hindi,
radical, radical_meaning, mnemonic, kanjivg_id,
audio_url, frequency_rank, tags, example_words
```
- `onyomi` / `kunyomi`: pipe-separated `ショク|ジキ`
- `example_words`: JSON string `[{"word":"食べる","reading":"たべる","meaning":"to eat"}]`

### `sentences`
```
jlpt_level, japanese, hiragana, romaji, english, hindi,
audio_url, grammar_id, difficulty, tags, source
```
- `source`: `tatoeba`, `nhk`, `manual`, etc.

### `grammar`
```
jlpt_level, pattern, title, meaning_english, meaning_hindi,
formation, example_japanese, example_english, example_hindi,
notes, related_patterns, difficulty, tags
```

---

## Data Sources (Recommended)

| Dataset | Format | Size | URL |
|---------|--------|------|-----|
| Tatoeba Japanese sentences | CSV/TSV | 200k+ | https://tatoeba.org/downloads |
| JLPT Sensei vocabulary | CSV | 8,000+ | https://jlptsensei.com |
| WaniKani kanji | JSON API | 2,000+ | https://api.wanikani.com |
| KanjiVG stroke data | SVG/XML | 13,000+ | https://kanjivg.tagaini.net |
| Jisho dictionary | JSON API | 170,000+ | https://jisho.org/api |

---

## Run the Migration First!

Before running any import scripts, apply the migration to your Supabase database:

1. Go to **Supabase Dashboard → SQL Editor**
2. Open and run: `apps/web/supabase/migrations/20260625_content_scale_architecture.sql`
3. Verify tables were created: run `SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;`

---

## Sample Data

The `data_samples/` directory contains minimal CSV files for testing:
- `vocab_n5_sample.csv` — 15 N5 vocabulary words
- `kanji_n5_sample.csv` — 10 N5/Grade-1 Kanji
