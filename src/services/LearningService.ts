import { supabase } from '../lib/supabaseClient';

export interface DBVocabulary {
  id: number;
  word_japanese: string;
  hiragana?: string;
  katakana?: string;
  romaji?: string;
  english: string;
  hindi?: string;
  meaning?: string;
  part_of_speech?: string;
  example_japanese?: string;
  example_english?: string;
  example_hindi?: string;
  audio_url?: string;
}

export interface DBGrammar {
  id: number;
  pattern: string;
  title: string;
  meaning_english: string;
  meaning_hindi?: string;
  formation?: string;
  notes?: string;
  example_japanese?: string;
  example_english?: string;
  example_hindi?: string;
}

export class LearningService {
  /**
   * Fetch all active courses
   */
  static async getCourses() {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('[LearningService] getCourses error:', error.message);
      throw error;
    }
    return data;
  }

  /**
   * Fetch all active modules for a course
   */
  static async getModules(courseId: string) {
    const { data, error } = await supabase
      .from('modules')
      .select('*')
      .eq('course_id', courseId)
      .eq('is_published', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('[LearningService] getModules error:', error.message);
      throw error;
    }
    return data;
  }

  /**
   * Fetch all active lessons for a module
   */
  static async getLessons(moduleId: string) {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('module_id', moduleId)
      .eq('is_published', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('[LearningService] getLessons error:', error.message);
      throw error;
    }
    return data;
  }

  /**
   * Fetch complete details of a single lesson (vocabulary, grammar points, reading, and listening sections)
   */
  static async getLessonDetails(lessonId: string) {
    // 1. Fetch lesson
    const { data: lesson, error: lessonErr } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', lessonId)
      .single();

    if (lessonErr) {
      console.error('[LearningService] getLessonDetails lesson error:', lessonErr.message);
      throw lessonErr;
    }

    // 2. Fetch vocabulary
    const { data: vocabulary, error: vocabErr } = await supabase
      .from('vocabulary')
      .select('*')
      .eq('lesson_id', lessonId)
      .eq('is_active', true);

    if (vocabErr) {
      console.warn('[LearningService] Failed to load vocab for lesson:', vocabErr.message);
    }

    // 3. Fetch grammar
    const { data: grammar, error: gramErr } = await supabase
      .from('grammar')
      .select('*')
      .eq('lesson_id', lessonId)
      .eq('is_active', true);

    if (gramErr) {
      console.warn('[LearningService] Failed to load grammar for lesson:', gramErr.message);
    }

    // 4. Fetch reading passages
    const { data: reading, error: readErr } = await supabase
      .from('reading_lessons')
      .select('*')
      .eq('lesson_id', lessonId);

    if (readErr) {
      console.warn('[LearningService] Failed to load reading lessons:', readErr.message);
    }

    // 5. Fetch listening passages
    const { data: listening, error: listErr } = await supabase
      .from('listening_lessons')
      .select('*')
      .eq('lesson_id', lessonId);

    if (listErr) {
      console.warn('[LearningService] Failed to load listening lessons:', listErr.message);
    }

    return {
      lesson,
      vocabulary: (vocabulary as DBVocabulary[]) || [],
      grammar: (grammar as DBGrammar[]) || [],
      reading: reading || [],
      listening: listening || [],
    };
  }
}
