import { NextResponse } from 'next/server';
import { authenticateRequest } from '@/middleware/auth';
import { ProgressService } from '@/services/ProgressService';
import { handleApiError } from '@/middleware/errorHandler';

export async function GET(request: Request) {
  try {
    const { user, errorResponse } = await authenticateRequest(request);
    if (errorResponse) return errorResponse;

    const progress = await ProgressService.getUserProgress(user!.id);

    return NextResponse.json({
      greeting: 'Konnichiwa! Welcome back to Learn with Velmorth.',
      progress,
      recommendations: [
        { id: 'lesson-1', title: 'Hiragana Basics & Greetings', type: 'lesson' },
        { id: 'kanji-1', title: 'N5 Essential Kanji: Numbers & Days', type: 'kanji' },
      ],
      dailyGoal: { targetXp: 50, currentXp: 20 },
    });
  } catch (error) {
    return handleApiError(error, 'Error in GET /api/dashboard');
  }
}
