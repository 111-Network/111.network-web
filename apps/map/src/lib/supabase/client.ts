'use client';

import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

/**
 * Browser/client Supabase client using anon key.
 * 
 * This client respects RLS policies and should only be used for read operations.
 * For write operations, use the API routes instead.
 */
export function createClientClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
  }

  if (!supabaseAnonKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey);
}
