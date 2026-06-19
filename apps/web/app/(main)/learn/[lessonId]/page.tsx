import fs from 'fs';
import path from 'path';
import LessonClient from './LessonClient';

export function generateStaticParams() {
  try {
    // During Next.js build, process.cwd() is the package root (apps/web)
    const lessonsDir = path.join(process.cwd(), 'public/data/lessons');
    if (!fs.existsSync(lessonsDir)) {
      console.warn(`[Build] Lessons directory not found at: ${lessonsDir}`);
      return [];
    }

    const files = fs.readdirSync(lessonsDir);
    const params: { lessonId: string }[] = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(lessonsDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(content);
        if (data.lessons && Array.isArray(data.lessons)) {
          for (const lesson of data.lessons) {
            if (lesson.lesson_id) {
              params.push({ lessonId: lesson.lesson_id });
            }
          }
        }
      }
    }

    console.log(`[Build] Generated static params for ${params.length} lessons.`);
    return params;
  } catch (error) {
    console.error('[Build] Failed to generate static params:', error);
    return [];
  }
}

interface PageProps {
  params: {
    lessonId: string;
  };
}

export default function Page({ params }: PageProps) {
  return <LessonClient lessonId={params.lessonId} />;
}
