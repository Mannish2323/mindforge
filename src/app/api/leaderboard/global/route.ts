import { NextResponse } from 'next/server';
import { authenticateRequest } from '@/middleware/auth';
import { handleApiError } from '@/middleware/errorHandler';

export async function GET(request: Request) {
  try {
    const { errorResponse } = await authenticateRequest(request);
    if (errorResponse) return errorResponse;

    const leaderboard = [
      { rank: 1, name: 'Ren Tanaka', xp: 2450, level: 'N3', avatar: 'RT' },
      { rank: 2, name: 'Aarav Sharma', xp: 2100, level: 'N4', avatar: 'AS' },
      { rank: 3, name: 'Sakura AI Learner', xp: 1850, level: 'N5', avatar: 'SL' },
      { rank: 4, name: 'Yuki Sato', xp: 1600, level: 'N2', avatar: 'YS' },
      { rank: 5, name: 'Priya Patel', xp: 1420, level: 'N4', avatar: 'PP' },
    ];

    return NextResponse.json({ leaderboard });
  } catch (error) {
    return handleApiError(error, 'Error in GET /api/leaderboard/global');
  }
}
