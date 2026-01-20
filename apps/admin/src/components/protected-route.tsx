'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useRole } from '@/hooks/use-role';
import { UserRole } from '@/lib/auth/roles';

/**
 * Protected route component props
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

/**
 * ProtectedRoute component
 * 
 * Wraps content that requires authentication and optionally a specific role.
 * Redirects to login if not authenticated, or shows fallback if role insufficient.
 * 
 * @example
 * ```tsx
 * <ProtectedRoute requiredRole={UserRole.MODERATOR}>
 *   <ModeratorContent />
 * </ProtectedRoute>
 * ```
 */
export function ProtectedRoute({
  children,
  requiredRole,
  fallback,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, isLoading, isInitialized } = useAuth();
  const { hasRole, isPending } = useRole();

  useEffect(() => {
    // Wait for auth to initialize
    if (!isInitialized || isLoading) {
      return;
    }

    // Check authentication
    if (!user) {
      router.push(redirectTo);
      return;
    }

    // Check role requirement
    if (requiredRole) {
      if (!hasRole) {
        // User is authenticated but has no role
        if (fallback) {
          return;
        }
        // Default: redirect to login with message
        router.push(`${redirectTo}?error=no_role`);
        return;
      }

      if (isPending) {
        // User is pending approval
        if (fallback) {
          return;
        }
        router.push(`${redirectTo}?error=pending`);
        return;
      }
    }
  }, [user, isLoading, isInitialized, hasRole, isPending, requiredRole, router, redirectTo, fallback]);

  // Show loading state while checking auth
  if (!isInitialized || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
          <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return null; // Will redirect in useEffect
  }

  // Check role requirement
  // If requiredRole is specified, check for that specific role
  // If requiredRole is undefined, still require SOME role (core or moderator)
  if (requiredRole) {
    // Specific role required
    if (!hasRole) {
      return fallback || (
        <div className="flex min-h-screen items-center justify-center p-6">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">
              You don't have the required permissions to access this page.
            </p>
          </div>
        </div>
      );
    }

    if (isPending) {
      return fallback || (
        <div className="flex min-h-screen items-center justify-center p-6">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-semibold mb-2">Account Pending</h2>
            <p className="text-muted-foreground">
              Your account is pending approval. You will be able to access the dashboard once approved by a core team member.
            </p>
          </div>
        </div>
      );
    }
  } else {
    // No specific role required, but user must have SOME role (core or moderator)
    if (!hasRole) {
      return fallback || (
        <div className="flex min-h-screen items-center justify-center p-6">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-4">
              Your account does not have admin access. Please contact a core team member to be added to the core team.
            </p>
            <a
              href="/login"
              className="text-sm text-primary hover:underline"
            >
              Return to login
            </a>
          </div>
        </div>
      );
    }

    if (isPending) {
      return fallback || (
        <div className="flex min-h-screen items-center justify-center p-6">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-semibold mb-2">Account Pending</h2>
            <p className="text-muted-foreground">
              Your account is pending approval. You will be able to access the dashboard once approved by a core team member.
            </p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}
