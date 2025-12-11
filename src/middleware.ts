import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/forgot-password"];
  const isPublicRoute = publicRoutes.some((route) => path.startsWith(route));
  
  // Admin routes - allow through (they have their own protection)
  const isAdminRoute = path.startsWith("/admin");
  
  // Static assets and API routes - allow through
  if (
    path.startsWith("/_next") ||
    path.startsWith("/api") ||
    path.includes(".")
  ) {
    return NextResponse.next();
  }
  
  // For protected routes, the ProtectedRoute component will handle redirects
  // This middleware just ensures login page is accessible
  return NextResponse.next();
}

export const config = {
  matcher: [
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

