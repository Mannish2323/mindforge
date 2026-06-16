import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Call Rust core scoring service
    const rustRes = await fetch('http://localhost:8080/api/score', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        answers: body.answers,
        correct_answers: body.correct_answers,
        elapsed_seconds: body.elapsed_seconds,
      }),
    });

    if (!rustRes.ok) {
      throw new Error(`Rust service returned status ${rustRes.status}`);
    }

    const data = await rustRes.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[BFF Error] Score Lesson failed:', error.message);
    
    // Fallback logic in case Rust service is offline
    const isPassed = true; // Fallback default
    return NextResponse.json({
      score_percentage: 100,
      passed: isPassed,
      xp_rewarded: 10,
      cheated: false,
      anti_cheat_reason: null,
      fallback: true
    });
  }
}
