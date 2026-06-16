import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  let body: any = {};
  try {
    body = await request.json();

    const rustRes = await fetch('http://localhost:8080/api/duel-score', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        challenger_score: body.challenger_score,
        opponent_score: body.opponent_score,
        xp_stake: body.xp_stake,
      }),
    });

    if (!rustRes.ok) {
      throw new Error(`Rust service returned status ${rustRes.status}`);
    }

    const data = await rustRes.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[BFF Error] Duel Score failed:', error.message);
    
    // Fallback logic
    const challengerWins = (body.challenger_score || 0) > (body.opponent_score || 0);
    return NextResponse.json({
      winner_id: challengerWins ? 'challenger' : 'opponent',
      xp_delta: challengerWins ? body.xp_stake : -body.xp_stake,
      message: challengerWins ? '🏆 You won the duel! (Fallback)' : '😤 Challenger wins this round. (Fallback)',
      fallback: true
    });
  }
}
