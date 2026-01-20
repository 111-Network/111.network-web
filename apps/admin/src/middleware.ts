import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import type { Database } from './lib/types/database';

/**
 * Middleware for route protection
 * 
 * Protects admin routes and redirects unauthenticated users to login.
 * Uses Supabase SSR utilities to properly detect and validate sessions.
 * 
 * Note: This is a lightweight check. Full authentication and role verification
 * happens in ProtectedRoute components and API routes.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public access to login page
  if (pathname === '/login') {
    return NextResponse.next();
  }

  // Allow public access to API routes (they handle their own auth)
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Protect dashboard and all admin routes
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
    // Create a response object to modify cookies
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    // Create Supabase client for middleware (handles cookies properly)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = 
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      // If env vars are missing, allow through (will fail in ProtectedRoute)
      return response;
    }

    const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    });

    // Check if user is authenticated
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      // No valid session - redirect to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // User is authenticated - allow through
    return response;
  }

  return NextResponse.next();
}

/**
 * Configure which routes the middleware should run on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
