'use client';

import { useAuthContext } from '@/contexts/auth-context';

/**
 * Hook to access authentication state and methods
 * 
 * @example
 * ```tsx
 * const { user, role, login, logout, isLoading } = useAuth();
 * ```
 */
export function useAuth() {
  return useAuthContext();
}
