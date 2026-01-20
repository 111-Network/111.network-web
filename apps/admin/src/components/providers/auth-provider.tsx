'use client';

import * as React from 'react';
import { AuthProvider as BaseAuthProvider } from '@/contexts/auth-context';

/**
 * AuthProvider component wrapper
 * 
 * This is a convenience wrapper that exports the AuthProvider
 * from the contexts directory for easier imports.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <BaseAuthProvider>{children}</BaseAuthProvider>;
}
