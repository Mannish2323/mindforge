import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const pyRes = await fetch('http://localhost:8000/api/ai/conversation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: body.session_id,
        topic: body.topic,
        difficulty: body.difficulty,
        messages: body.messages,
      }),
    });

    if (!pyRes.ok) {
      throw new Error(`Python service returned status ${pyRes.status}`);
    }

    const data = await pyRes.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[BFF Error] AI Conversation failed:', error.message);
    
    return NextResponse.json({
      message_id: `ai-fallback-${Date.now()}`,
      role: 'ai',
      content_ja: 'はじめまして！日本語を一緒に勉強しましょう。',
      content_romaji: 'Hajimemashite! Nihongo o issho ni benkyou shimashou.',
      content_en: 'Nice to meet you! Let\'s study Japanese together.',
      timestamp: new Date().toISOString(),
      score: 85,
      hint: 'Say "Konnichiwa" to greet the tutor.',
      fallback: true
    });
  }
}
