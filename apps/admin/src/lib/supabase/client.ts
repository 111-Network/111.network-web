'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '../types/database';

/**
 * Browser/client Supabase client using anon/publishable key.
 * 
 * Uses @supabase/ssr to properly handle cookies for Next.js middleware.
 * This client respects RLS policies and should be used for authentication
 * and client-side operations. For admin operations, use API routes instead.
 * 
 * Supports both publishable keys (new) and anon keys (legacy).
 */
export function createClientClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Support both publishable key (new) and anon key (legacy)
  const supabaseAnonKey = 
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
  }

  if (!supabaseAnonKey) {
    console.error('❌ Missing Supabase anon/publishable key');
    throw new Error(
      'Missing Supabase anon/publishable key. ' +
      'Set NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY'
    );
  }

  // Log configuration (safe - these are public keys)
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log('✅ Supabase client initialized:', {
      url: supabaseUrl,
      hasKey: !!supabaseAnonKey,
      keyType: supabaseAnonKey.startsWith('sb_publishable_') ? 'publishable' : 'anon',
    });
  }

  // Use createBrowserClient from @supabase/ssr to properly handle cookies
  // This ensures sessions are stored in cookies that middleware can read
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}
