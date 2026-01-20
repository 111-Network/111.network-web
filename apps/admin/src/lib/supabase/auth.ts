import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { User } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';
import { createServerClient } from './server';
import { getUserRole, UserRole } from '../auth/roles';

/**
 * Extract authenticated user from Next.js request headers.
 * 
 * Looks for Authorization header with Bearer token and verifies it with Supabase.
 * Returns null if no valid token is found.
 */
export async function getAuthenticatedUser(
  request: NextRequest
): Promise<{ user: User; supabase: SupabaseClient<Database> } | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Support both publishable key (new) and anon key (legacy)
  const supabaseAnonKey = 
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  // Extract Authorization header
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix

  // Create a Supabase client with the user's token
  const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  // Verify the token and get the user
  // getUser() without parameters uses the token from the Authorization header
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return { user, supabase };
}

/**
 * Require authentication for an API route.
 * 
 * Throws an error response if user is not authenticated.
 * Optionally checks for a specific role.
 * 
 * @param request - Next.js request object
 * @param requiredRole - Optional role requirement (CORE or MODERATOR)
 * @returns User, role, and level information
 * @throws NextResponse with 401 or 403 status if auth/role check fails
 */
export async function requireAuth(
  request: NextRequest,
  requiredRole?: UserRole
): Promise<{ user: User; role: UserRole; level: number | null; status: string | null }> {
  // Get authenticated user
  const authResult = await getAuthenticatedUser(request);
  
  if (!authResult) {
    throw NextResponse.json(
      { error: 'Unauthorized', message: 'Authentication required' },
      { status: 401 }
    );
  }

  const { user } = authResult;

  // Get user's role using service role client (bypasses RLS)
  const serverClient = createServerClient();
  const roleResult = await getUserRole(serverClient, user.id);
  
  if (!roleResult) {
    // This shouldn't happen with updated getUserRole, but handle it
    if (requiredRole) {
      throw NextResponse.json(
        { error: 'Forbidden', message: 'Insufficient permissions' },
        { status: 403 }
      );
    }
    return {
      user,
      role: UserRole.NONE,
      level: null,
      status: null,
    };
  }

  const { role, level, status } = roleResult;
  
  // If user has no role and a role is required
  if (role === UserRole.NONE && requiredRole) {
    throw NextResponse.json(
      { error: 'Forbidden', message: 'Insufficient permissions' },
      { status: 403 }
    );
  }

  // Check if required role is satisfied
  if (requiredRole) {
    if (requiredRole === UserRole.CORE && role !== UserRole.CORE) {
      throw NextResponse.json(
        { error: 'Forbidden', message: 'Core team access required' },
        { status: 403 }
      );
    }
    if (requiredRole === UserRole.MODERATOR && role === UserRole.NONE) {
      throw NextResponse.json(
        { error: 'Forbidden', message: 'Moderator access required' },
        { status: 403 }
      );
    }
  }

  return {
    user,
    role,
    level,
    status,
  };
}
