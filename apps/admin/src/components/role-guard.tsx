'use client';

import { useRole } from '@/hooks/use-role';
import { UserRole } from '@/lib/auth/roles';

/**
 * Role guard component props
 */
interface RoleGuardProps {
  children: React.ReactNode;
  requiredRole: UserRole;
  fallback?: React.ReactNode;
}

/**
 * RoleGuard component
 * 
 * Conditionally renders children based on user role.
 * Core team members can access anything.
 * 
 * @example
 * ```tsx
 * <RoleGuard requiredRole={UserRole.CORE}>
 *   <AdminOnlyContent />
 * </RoleGuard>
 * ```
 */
export function RoleGuard({
  children,
  requiredRole,
  fallback = null,
}: RoleGuardProps) {
  const { isCore, isModerator, hasRole, role } = useRole();

  // Core team can access everything
  if (isCore) {
    return <>{children}</>;
  }

  // Check specific role requirement
  if (requiredRole === UserRole.CORE) {
    // Only core can access
    return <>{fallback}</>;
  }

  if (requiredRole === UserRole.MODERATOR) {
    // Moderators and core can access
    if (isModerator || isCore) {
      return <>{children}</>;
    }
    return <>{fallback}</>;
  }

  // If no role or role doesn't match
  if (!hasRole || role !== requiredRole) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
