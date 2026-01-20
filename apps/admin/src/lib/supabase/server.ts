import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

/**
 * Server-only Supabase client using service role key.
 * 
 * WARNING: This client has full database access and bypasses RLS.
 * Only use in API routes and server-side code. Never expose to client.
 * 
 * Note: This is NOT a Server Action - it's a utility function for API routes.
 * Do not add 'use server' directive here.
 */
export function createServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
  }

  if (!supabaseServiceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
  }

  return createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
