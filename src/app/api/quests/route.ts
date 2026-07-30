import { NextResponse } from 'next/server';

export async function GET() {
  const quests = [
    { id: 'quest-1', title: 'Complete 1 Japanese Lesson', xp: 50, done: false },
    { id: 'quest-2', title: 'Review 10 Spaced Repetition Cards', xp: 30, done: false },
    { id: 'quest-[#', title: 'Practice Japanese Speaking Session', xp: 40, done: false },
  ];
  return NextResponse.json({ quests });
}
