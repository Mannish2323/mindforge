import { useState, useCallback, useEffect } from 'react';
import { LearningService, DBVocabulary, DBGrammar } from '../services/LearningService';
import { useProgress } from './useProgress';

export function useLearning() {
  const [courses, setCourses] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [activeLessonDetails, setActiveLessonDetails] = useState<any | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { completeLesson: submitCompletion, updateLessonProgress } = useProgress();

  /**
   * Loads all available JLPT courses
   */
  const loadCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await LearningService.getCourses();
      setCourses(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Loads modules for a course
   */
  const loadModules = useCallback(async (courseId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await LearningService.getModules(courseId);
      setModules(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load modules');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Loads lessons for a module
   */
  const loadLessons = useCallback(async (moduleId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await LearningService.getLessons(moduleId);
      setLessons(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load lessons');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Loads full details of a single lesson (vocab, grammar, audio, reading)
   */
  const loadLessonDetails = useCallback(async (lessonId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await LearningService.getLessonDetails(lessonId);
      setActiveLessonDetails(data);
      // Mark as visited in progress
      await updateLessonProgress({ lessonId, completionPercentage: 10 });
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to load lesson details');
      return null;
    } finally {
      setLoading(false);
    }
  }, [updateLessonProgress]);

  /**
   * Submits a lesson completion, awards XP, and updates progress records
   */
  const completeActiveLesson = useCallback(async (score: number, timeSeconds: number) => {
    if (!activeLessonDetails?.lesson) {
      throw new Error('No active lesson loaded to complete.');
    }
    
    const lesson = activeLessonDetails.lesson;
    const vocabCount = activeLessonDetails.vocabulary?.length || 0;
    
    // Complete lesson in DB and award XP
    const result = await submitCompletion({
      lessonId: lesson.id,
      score,
      xp: lesson.xp_reward || 10,
      timeSeconds,
      wordsLearnedCount: vocabCount,
    });

    return result;
  }, [activeLessonDetails, submitCompletion]);

  return {
    courses,
    modules,
    lessons,
    activeLessonDetails,
    loading,
    error,
    loadCourses,
    loadModules,
    loadLessons,
    loadLessonDetails,
    completeActiveLesson,
  };
}
