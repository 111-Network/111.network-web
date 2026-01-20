import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/supabase/auth';
import { UserRole } from '@/lib/auth/roles';

/**
 * GET /api/auth/me
 * 
 * Returns the current authenticated user's role and permissions.
 * 
 * Requires: Authentication (any role or no role)
 * 
 * Response:
 * - 200: User role information
 * - 401: Not authenticated
 */
export async function GET(request: NextRequest) {
  try {
    // Require authentication but no specific role (allows users with no role)
    const { user, role, level, status } = await requireAuth(request);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
      },
      role: role === UserRole.NONE ? null : role,
      level,
      status,
      permissions: {
        isCore: role === UserRole.CORE,
        isModerator: role === UserRole.MODERATOR,
        hasRole: role !== UserRole.NONE,
      },
    });
  } catch (error) {
    // requireAuth throws NextResponse for auth errors, re-throw it
    if (error instanceof NextResponse) {
      throw error;
    }

    // Unexpected error
    console.error('Error in /api/auth/me:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
