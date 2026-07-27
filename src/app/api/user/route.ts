import { NextResponse } from 'next/server';
import { authenticateRequest } from '@/middleware/auth';
import { UserService } from '@/services/UserService';
import { handleApiError } from '@/middleware/errorHandler';

export async function GET(request: Request) {
  try {
    const { user, errorResponse } = await authenticateRequest(request);
    if (errorResponse) return errorResponse;

    const profile = await UserService.getUserProfile(user!.id);
    return NextResponse.json({ user, profile });
  } catch (error) {
    return handleApiError(error, 'Error in GET /api/user');
  }
}

export async function PATCH(request: Request) {
  try {
    const { user, errorResponse } = await authenticateRequest(request);
    if (errorResponse) return errorResponse;

    const body = await request.json();
    const updated = await UserService.updateUserPreferences(user!.id, body);
    return NextResponse.json({ success: true, updated });
  } catch (error) {
    return handleApiError(error, 'Error in PATCH /api/user');
  }
}
