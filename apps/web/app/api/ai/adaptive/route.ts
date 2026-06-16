import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const pyRes = await fetch('http://localhost:8000/api/ai/adaptive-difficulty', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accuracy_history: body.accuracy_history,
        completed_count: body.completed_count,
      }),
    });

    if (!pyRes.ok) {
      throw new Error(`Python service returned status ${pyRes.status}`);
    }

    const data = await pyRes.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[BFF Error] AI Adaptive Difficulty failed:', error.message);
    
    return NextResponse.json({
      recommended_level: 'beginner',
      accuracy_7day: 75,
      weak_areas: ['vocabulary'],
      strong_areas: ['greetings'],
      next_lesson_id: 'ja_u01_l01_hello_basic',
      confidence_score: 80,
      fallback: true
    });
  }
}
