import { NextResponse } from 'next/server';
import { authenticateRequest } from '@/middleware/auth';
import { ProgressService } from '@/services/ProgressService';
import { handleApiError } from '@/middleware/errorHandler';

export async function GET(request: Request) {
  try {
    const { user, errorResponse } = await authenticateRequest(request);
    if (errorResponse) return errorResponse;

    const progress = await ProgressService.getUserProgress(user!.id);
    return NextResponse.json({ streak: progress.streak });
  } catch (error) {
    return handleApiError(error, 'Error in GET /api/streak');
  }
}

export async function POST(request: Request) {
  try {
    const { user, errorResponse } = await authenticateRequest(request);
    if (errorResponse) return errorResponse;

    const result = await ProgressService.updateStreak(user!.id);
    return NextResponse.json({ success: true, streak: result });
  } catch (error) {
    return handleApiError(error, 'Error in POST /api/streak');
  }
}
