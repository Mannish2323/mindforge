/**
 * Rate Limiter Middleware
 * Sliding window rate limiting per user/IP
 */

const rateLimitMap = new Map<string, number[]>();

export function checkRateLimit(
  identifier: string,
  maxRequests = 30,
  windowMs = 60_000
): { isLimited: boolean; remaining: number; errorResponse?: Response } {
  const now = Date.now();
  const timestamps = (rateLimitMap.get(identifier) ?? []).filter((ts) => now - ts < windowMs);

  if (timestamps.length >= maxRequests) {
    return {
      isLimited: true,
      remaining: 0,
      errorResponse: new Response(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      ),
    };
  }

  timestamps.push(now);
  rateLimitMap.set(identifier, timestamps);

  return {
    isLimited: false,
    remaining: maxRequests - timestamps.length,
  };
}
