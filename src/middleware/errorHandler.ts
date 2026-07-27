/**
 * Centralized Error Handler Middleware Response Formatter
 */

import { logger } from '@/config/logger';

export function handleApiError(error: any, contextMessage = 'API Error'): Response {
  logger.error(contextMessage, error);

  const statusCode = error.status || error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  return new Response(
    JSON.stringify({
      error: message,
      timestamp: new Date().toISOString(),
    }),
    {
      status: statusCode,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
