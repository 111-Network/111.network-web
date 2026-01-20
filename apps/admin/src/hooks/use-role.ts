'use client';

import { useAuth } from './use-auth';
import { UserRole, canPerformAction } from '@/lib/auth/roles';

/**
 * Hook for role-based checks and permissions
 * 
 * @example
 * ```tsx
 * const { isCore, isModerator, hasRole, canPerform } = useRole();
 * 
 * if (isCore) {
 *   // Show admin features
 * }
 * 
 * if (canPerform('delete_message')) {
 *   // Show delete button
 * }
 * ```
 */
export function useRole() {
  const { role, level, status } = useAuth();

  return {
    isCore: role === UserRole.CORE,
    isModerator: role === UserRole.MODERATOR,
    hasRole: role !== null && role !== UserRole.NONE,
    role,
    level,
    status,
    canPerform: (action: string) => {
      if (!role) {
        return false;
      }
      return canPerformAction(role, action);
    },
    isPending: status === 'pending',
    isApproved: status === 'approved',
    isSuspended: status === 'suspended',
    isRejected: status === 'rejected',
  };
}
