'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { useStore } from '@/hooks/useStore';
import { CheckCircle2, Lock, ChevronRight, Loader2 } from 'lucide-react';

interface Lesson {
  lesson_id: string;
  lesson_title: string;
  difficulty: string;
  xp_reward: number;
  is_premium?: boolean;
}
interface Unit {
  unit_id: string;
  unit_title: string;
  unit_icon?: string;
  lessons: Lesson[];
}

export default function PathPage() {
  const router = useRouter();
  const { profile } = useAuth();
  const { state } = useStore();
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/config/units_index.json')
      .then(r => r.json())
      .then(async (index: { units: { unit_id: string; file: string }[] }) => {
        const loaded: Unit[] = await Promise.all(
          index.units.map(async u => {
            const data = await fetch(`/data/lessons/${u.file}`).then(r => r.json()).catch(() => ({ unit_id: u.unit_id, unit_title: u.unit_id, lessons: [] }));
            return data as Unit;
          })
        );
        setUnits(loaded);
      })
      .catch(() => setUnits([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Learn Path</h1>
      {units.length === 0 && (
        <div className="bg-purple-950/40 border border-purple-800/30 rounded-2xl p-8 text-center text-purple-300/50">
          No lessons found.
        </div>
      )}
      {units.map((unit) => (
        <div key={unit.unit_id} className="bg-purple-950/40 border border-purple-800/30 rounded-2xl p-5">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>{unit.unit_icon || '📚'}</span> {unit.unit_title}
          </h2>
          <div className="space-y-2">
            {unit.lessons?.map((lesson) => {
              const prog = (state?.lessonProgress as Record<string, { completed: boolean }>)?.[lesson.lesson_id];
              const done = prog?.completed;
              const locked = lesson.is_premium && !profile?.isPremium;
              return (
                <button
                  key={lesson.lesson_id}
                  disabled={!!locked}
                  onClick={() => router.push(`/path/${lesson.lesson_id}`)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all text-left ${
                    done
                      ? 'bg-green-500/10 border border-green-500/20 text-green-300'
                      : locked
                      ? 'bg-purple-950/30 border border-purple-800/20 text-purple-600 cursor-not-allowed'
                      : 'bg-purple-900/30 border border-purple-800/30 text-white hover:border-purple-600/50'
                  }`}
                >
                  <div>
                    <div className="text-sm font-semibold">{lesson.lesson_title}</div>
                    <div className="text-xs opacity-50 mt-0.5">{lesson.xp_reward} XP · {lesson.difficulty}</div>
                  </div>
                  {done
                    ? <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                    : locked
                    ? <Lock className="w-4 h-4 flex-shrink-0" />
                    : <ChevronRight className="w-4 h-4 flex-shrink-0 text-purple-400" />}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
