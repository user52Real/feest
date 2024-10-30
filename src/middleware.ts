import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextFetchEvent, NextRequest } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = createRouteMatcher([
  '/',
  '/sign-in',
  '/sign-up',
  '/api/invitations/(.*)',
  '/invite/(.*)',
  '/_next/static/(.*)',
  '/favicon.ico',
  '/api/webhook/(.*)'
]);

export default function middleware(req: NextRequest, event: NextFetchEvent) {
  // Handle CORS
  const origin = req.headers.get('origin') || '';
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_APP_URL,
    '*'
  ];

  if (!allowedOrigins.includes(origin)) {
    return new NextResponse(null, {
      status: 403,
      statusText: 'Forbidden',
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }

  // Skip auth for public routes
  if (publicRoutes(req)) {
    return NextResponse.next();
  }

  // Apply Clerk middleware
  return clerkMiddleware()(req, event);
}
// Configure the middleware
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};