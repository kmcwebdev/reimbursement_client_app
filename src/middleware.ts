import { authMiddleware } from "@propelauth/nextjs/server/app-router";

// This function can be marked `async` if using `await` inside
export const middleware = authMiddleware;

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    // REQUIRED: Match all request paths that start with /api/auth/

    "/api/auth/(.*)",

    /*

     * Match all request paths except for the ones starting with:

     * - api (API routes)

     * - _next/static (static files)

     * - _next/image (image optimization files)

     * - favicon.ico (favicon file)

     */

    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
