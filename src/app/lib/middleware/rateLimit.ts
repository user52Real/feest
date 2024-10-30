import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const rateLimiter = new Map();

export function rateLimitMiddleware(request: NextRequest) {
  // Get IP address from various headers
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] || realIp || '127.0.0.1';

  const now = Date.now();
  const windowStart = now - 60000; // 1 minute window

  const requestTimestamps = rateLimiter.get(ip) || [];
  const requestsInWindow = requestTimestamps.filter((timestamp: number) => timestamp > windowStart);

  if (requestsInWindow.length >= 100) { // 100 requests per minute
    return NextResponse.json(
      { error: 'Too many requests, please try again later.' },
      { status: 429 }
    );
  }

  requestTimestamps.push(now);
  rateLimiter.set(ip, requestTimestamps);

  return NextResponse.next();
}