import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// 1. Load env variables from .env file manually
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const index = trimmed.indexOf('=');
      if (index !== -1) {
        const key = trimmed.substring(0, index).trim();
        const val = trimmed.substring(index + 1).trim().replace(/^['"]|['"]$/g, '');
        process.env[key] = val;
      }
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env');
  process.exit(1);
}

// 2. Initialize Supabase Client with Service Role (RLS bypass)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seed() {
  console.log('--- Starting Database Seeding ---');

  // Verify connection/authenticity
  const { data: testData, error: testError } = await supabase.from('courses').select('id').limit(1);
  if (testError) {
    console.error('Database connection test failed:', testError.message);
    process.exit(1);
  }
  console.log('Successfully connected to Supabase.');

  // A. Seed N5 Course (if not present)
  console.log('Seeding Course: jlpt-n5...');
  const { error: courseErr } = await supabase
    .from('courses')
    .upsert({
      id: 'jlpt-n5',
      title: 'JLPT N5 — Beginner',
      description: 'Master the basics: Hiragana, Katakana, 800 words, 103 Kanji',
      language: 'ja',
      jlpt_level: 'N5',
      difficulty: 1,
      is_published: true,
      sort_order: 1
    });

  if (courseErr) {
    console.error('Error seeding N5 course:', courseErr.message);
  }

  // B. Seed Modules & Lessons
  const unitsIndexPath = path.resolve(process.cwd(), 'public/data/config/units_index.json');
  if (!fs.existsSync(unitsIndexPath)) {
    console.error('Error: units_index.json not found at:', unitsIndexPath);
    return;
  }

  const indexData = JSON.parse(fs.readFileSync(unitsIndexPath, 'utf8'));
  const unitsList = indexData.units || [];

  for (let i = 0; i < unitsList.length; i++) {
    const unitConf = unitsList[i];
    const unitPath = path.resolve(process.cwd(), `public/data/lessons/${unitConf.file}`);
    
    if (!fs.existsSync(unitPath)) {
      console.warn(`Lesson file not found: ${unitConf.file}, skipping...`);
      continue;
    }

    const unitData = JSON.parse(fs.readFileSync(unitPath, 'utf8'));
    console.log(`Seeding Unit/Module: ${unitData.unit_title} (${unitData.unit_id})...`);

    // Upsert Module
    const { error: modErr } = await supabase
      .from('modules')
      .upsert({
        id: unitData.unit_id,
        course_id: 'jlpt-n5',
        title: unitData.unit_title,
        description: `Vocabulary and grammar for ${unitData.unit_title}`,
        sort_order: i + 1,
        is_published: true
      });

    if (modErr) {
      console.error(`Error inserting module ${unitData.unit_id}:`, modErr.message);
      continue;
    }

    // Process Lessons
    const lessonsList = unitData.lessons || [];
    for (let j = 0; j < lessonsList.length; j++) {
      const lesson = lessonsList[j];
      console.log(`  -> Seeding Lesson: ${lesson.lesson_title} (${lesson.lesson_id})...`);

      // Upsert Lesson
      const { error: lesErr } = await supabase
        .from('lessons')
        .upsert({
          id: lesson.lesson_id,
          module_id: unitData.unit_id,
          title: lesson.lesson_title,
          description: lesson.lesson_goal,
          lesson_type: 'vocabulary',
          xp_reward: lesson.xp_reward || 10,
          sort_order: j + 1,
          is_published: true,
          content: {
            pronunciation: lesson.pronunciation || {},
            examples: lesson.examples || []
          }
        });

      if (lesErr) {
        console.error(`  Error inserting lesson ${lesson.lesson_id}:`, lesErr.message);
        continue;
      }

      // Clear existing vocabulary & grammar linked to this lesson to prevent duplicates
      await supabase.from('vocabulary').delete().eq('lesson_id', lesson.lesson_id);
      await supabase.from('grammar').delete().eq('lesson_id', lesson.lesson_id);

      // Insert Lesson Vocabulary
      const vocabList = lesson.vocabulary || [];
      if (vocabList.length > 0) {
        const vocabPayload = vocabList.map((v: any) => ({
          word_japanese: v.kanji,
          hiragana: v.kana,
          romaji: v.romaji,
          english: v.meaning_en,
          hindi: v.meaning_hi,
          part_of_speech: v.part_of_speech || 'noun',
          frequency_rank: v.frequency || 5,
          lesson_id: lesson.lesson_id,
          jlpt_level: 'N5',
          is_active: true,
          meaning: v.notes || ''
        }));

        const { error: insVocabErr } = await supabase.from('vocabulary').insert(vocabPayload);
        if (insVocabErr) {
          console.error(`    Error inserting vocabulary for lesson ${lesson.lesson_id}:`, insVocabErr.message);
        } else {
          console.log(`    Inserted ${vocabList.length} vocabulary words.`);
        }
      }

      // Insert Lesson Grammar Point
      if (lesson.grammar_point && lesson.grammar_point.grammar_id) {
        const gp = lesson.grammar_point;
        const { error: insGramErr } = await supabase
          .from('grammar')
          .insert({
            pattern: gp.structure || '',
            title: gp.title || '',
            meaning_english: gp.short_explanation_en || '',
            meaning_hindi: gp.short_explanation_hi || '',
            formation: gp.romaji_structure || '',
            notes: gp.notes || '',
            example_japanese: gp.focus_examples?.[0] || '',
            example_english: gp.focus_examples_romaji?.[0] || '',
            lesson_id: lesson.lesson_id,
            jlpt_level: 'N5',
            is_active: true
          });

        if (insGramErr) {
          console.error(`    Error inserting grammar point ${gp.grammar_id}:`, insGramErr.message);
        } else {
          console.log(`    Inserted grammar point: ${gp.title}.`);
        }
      }
    }
  }

  // C. Seed General N5 Dictionary (from public/data/vocab/jlpt_n5.json)
  const n5DictPath = path.resolve(process.cwd(), 'public/data/vocab/jlpt_n5.json');
  if (fs.existsSync(n5DictPath)) {
    console.log('Seeding General N5 Dictionary...');
    const n5Dict = JSON.parse(fs.readFileSync(n5DictPath, 'utf8'));
    
    // Fetch currently active general vocabulary list to avoid duplicate inserts
    const { data: existingVocab } = await supabase
      .from('vocabulary')
      .select('word_japanese')
      .is('lesson_id', null);

    const existingWordsSet = new Set(existingVocab?.map(v => v.word_japanese) || []);

    const newVocabList = n5Dict.filter((v: any) => v.japanese && !existingWordsSet.has(v.japanese));

    if (newVocabList.length > 0) {
      // Chunk inserts due to Supabase payload size limits (chunk size: 100)
      const chunkSize = 100;
      for (let offset = 0; offset < newVocabList.length; offset += chunkSize) {
        const chunk = newVocabList.slice(offset, offset + chunkSize);
        const payload = chunk.map((v: any) => ({
          word_japanese: v.japanese,
          hiragana: v.kana,
          romaji: v.romaji,
          english: v.english_meaning,
          hindi: v.hindi_meaning,
          part_of_speech: v.part_of_speech || 'noun',
          jlpt_level: 'N5',
          is_active: true,
          example_japanese: v.example_sentence_japanese || '',
          example_english: v.example_sentence_english || ''
        }));

        const { error: dictErr } = await supabase.from('vocabulary').insert(payload);
        if (dictErr) {
          console.error(`  Error inserting dictionary chunk starting at index ${offset}:`, dictErr.message);
        }
      }
      console.log(`Inserted ${newVocabList.length} new words into the general vocabulary dictionary.`);
    } else {
      console.log('General N5 Dictionary already fully seeded.');
    }
  }

  console.log('--- Seeding Completed Successfully ---');
}

seed().catch(err => {
  console.error('Seeding process encountered an error:', err);
  process.exit(1);
});
