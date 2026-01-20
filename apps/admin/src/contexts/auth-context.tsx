'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User } from '@supabase/supabase-js';
import { UserRole, canPerformAction } from '@/lib/auth/roles';

/**
 * Auth context type
 */
export interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  level: number | null;
  status: string | null;
  isLoading: boolean;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshRole: () => Promise<void>;
  canPerform: (action: string) => boolean;
}

/**
 * Auth context
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Auth context provider props
 */
interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * AuthProvider component
 * 
 * Manages authentication state and provides auth methods to children.
 * Fetches role information from the backend API.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [level, setLevel] = useState<number | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  /**
   * Fetch role information from backend API
   */
  const fetchRole = useCallback(async (accessToken: string) => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Not authenticated or invalid token
          setUser(null);
          setRole(null);
          setLevel(null);
          setStatus(null);
          return;
        }
        throw new Error(`Failed to fetch role: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Role data received:', data);
      
      setRole(data.role ? (data.role as UserRole) : UserRole.NONE);
      setLevel(data.level ?? null);
      setStatus(data.status ?? null);
      
      console.log('Role set:', data.role || 'NONE', 'Level:', data.level, 'Status:', data.status);
    } catch (error) {
      console.error('Error fetching role:', error);
      setRole(null);
      setLevel(null);
      setStatus(null);
    }
  }, []);

  /**
   * Initialize auth state from Supabase session
   */
  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      try {
        // Dynamic import to avoid SSR issues
        const { createClientClient } = await import('@/lib/supabase/client');
        const supabase = createClientClient();

        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Error getting session:', error);
          if (mounted) {
            setIsLoading(false);
            setIsInitialized(true);
          }
          return;
        }

        if (session?.user && session?.access_token) {
          if (mounted) {
            setUser(session.user);
            await fetchRole(session.access_token);
          }
        } else {
          if (mounted) {
            setUser(null);
            setRole(null);
            setLevel(null);
            setStatus(null);
          }
        }

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (!mounted) return;

            if (event === 'SIGNED_IN' && session?.user && session?.access_token) {
              setUser(session.user);
              await fetchRole(session.access_token);
            } else if (event === 'SIGNED_OUT') {
              setUser(null);
              setRole(null);
              setLevel(null);
              setStatus(null);
            } else if (event === 'TOKEN_REFRESHED' && session?.access_token) {
              await fetchRole(session.access_token);
            }
          }
        );

        if (mounted) {
          setIsLoading(false);
          setIsInitialized(true);
        }

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setIsLoading(false);
          setIsInitialized(true);
        }
      }
    }

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, [fetchRole]);

  /**
   * Login with email and password
   */
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { createClientClient } = await import('@/lib/supabase/client');
      const supabase = createClientClient();

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Supabase login error:', error);
        // Throw error with more details
        const errorWithDetails = new Error(error.message || 'Login failed');
        (errorWithDetails as any).error = error;
        throw errorWithDetails;
      }

      if (data.user && data.session?.access_token) {
        console.log('Login successful, user:', data.user.email);
        setUser(data.user);
        
        // Wait a moment for session cookie to be set
        await new Promise(resolve => setTimeout(resolve, 200));
        
        console.log('Fetching role...');
        await fetchRole(data.session.access_token);
        console.log('Role fetch completed');
      } else {
        console.error('Login failed: No session returned', data);
        throw new Error('Login failed: No session returned');
      }
    } catch (error) {
      console.error('Login error in auth context:', error);
      setUser(null);
      setRole(null);
      setLevel(null);
      setStatus(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [fetchRole]);

  /**
   * Logout
   */
  const logout = useCallback(async () => {
    try {
      const { createClientClient } = await import('@/lib/supabase/client');
      const supabase = createClientClient();

      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      setUser(null);
      setRole(null);
      setLevel(null);
      setStatus(null);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  }, []);

  /**
   * Refresh role information
   */
  const refreshRole = useCallback(async () => {
    if (!user) {
      return;
    }

    try {
      const { createClientClient } = await import('@/lib/supabase/client');
      const supabase = createClientClient();

      const { data: { session } } = await supabase.auth.getSession();

      if (session?.access_token) {
        await fetchRole(session.access_token);
      }
    } catch (error) {
      console.error('Error refreshing role:', error);
    }
  }, [user, fetchRole]);

  /**
   * Check if user can perform an action
   */
  const canPerform = useCallback((action: string) => {
    if (!role) {
      return false;
    }
    return canPerformAction(role, action);
  }, [role]);

  const value: AuthContextType = {
    user,
    role,
    level,
    status,
    isLoading,
    isInitialized,
    login,
    logout,
    refreshRole,
    canPerform,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access auth context
 */
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
