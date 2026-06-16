import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const pythonRes = await fetch('http://localhost:8000/api/ai/explain', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grammar_id: body.grammar_id,
        structure: body.structure,
        title: body.title,
        explanation_en: body.explanation_en,
        explanation_hi: body.explanation_hi,
        lang: body.lang
      }),
    });

    if (!pythonRes.ok) {
      throw new Error(`Python AI service returned status ${pythonRes.status}`);
    }

    const data = await pythonRes.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[BFF Error] AI Explainer failed:', error.message);
    return NextResponse.json({
      explanation: "AI Tutor is currently offline. Core structure: [Base Structure] denotes a standard explanation.",
      fallback: true
    });
  }
}
