'use client';

export default function LessonPlayerPage({ params }: { params: { lesson_id: string } }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Lesson Player: {params.lesson_id}</h1>
    </div>
  );
}
