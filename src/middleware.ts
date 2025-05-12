import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();  // This ensures Clerk middleware is applied

export const config = {
  matcher: [
    // This skips Next.js internals and static files, unless they're part of the search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    
    // Always run for API routes, ensuring Clerk is applied to them
    '/(api|trpc)(.*)', 
  ],
};
