import { clerkMiddleware, ClerkMiddlewareAuth, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { rateLimitMiddleware } from "./app/lib/middleware/rateLimit";

// Define protected routes using createRouteMatcher
const protectedRoutes = createRouteMatcher([
  "/dashboard(.*)",
  "/events(.*)",
  "/settings(.*)",
  "/api/events(.*)"
]);

export default clerkMiddleware( async (auth, req) => {  
    // Apply rate limiting before authentication  
    if (protectedRoutes(req)) await auth.protect() 
});

export const config = {
    matcher: [
      // Skip Next.js internals and all static files, unless found in search params
      '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
      // Always run for API routes
      '/(api|trpc)(.*)',
    ],
}

function afterAuth(auth: ClerkMiddlewareAuth, req: NextRequest) {
  throw new Error("Function not implemented.");
}
