import { NextResponse } from 'next/server';
import { authenticateRequest } from '@/middleware/auth';
import { ProgressService } from '@/services/ProgressService';
import { handleApiError } from '@/middleware/errorHandler';

export async function GET(request: Request) {
  try {
    const { user, errorResponse } = await authenticateRequest(request);
    if (errorResponse) return errorResponse;

    const progress = await ProgressService.getUserProgress(user!.id);
    return NextResponse.json({ xp: progress.totalXp });
  } catch (error) {
    return handleApiError(error, 'Error in GET /api/xp');
  }
}

export async function POST(request: Request) {
  try {
    const { user, errorResponse } = await authenticateRequest(request);
    if (errorResponse) return errorResponse;

    const body = await request.json();
    const amount = body.amount || 10;
    const result = await ProgressService.addXp(user!.id, amount);

    return NextResponse.json({ success: true, addedXp: amount, result });
  } catch (error) {
    return handleApiError(error, 'Error in POST /api/xp');
  }
}
