/**
 * Script to check if database migrations have been applied.
 * Specifically checks if the check_and_increment_rate_limit function exists.
 * 
 * Run with: npx tsx scripts/check-migration.ts
 * 
 * Prerequisites:
 * - Set up .env.local with Supabase credentials
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load .env.local file manually (tsx doesn't auto-load it)
function loadEnvLocal() {
  try {
    const envPath = join(process.cwd(), '.env.local');
    const envFile = readFileSync(envPath, 'utf-8');
    const lines = envFile.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      // Skip comments and empty lines
      if (!trimmed || trimmed.startsWith('#')) continue;
      
      const match = trimmed.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, ''); // Remove quotes
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  } catch (error) {
    // .env.local might not exist, that's okay - user might be using system env vars
    console.warn('⚠️  Could not load .env.local file (this is okay if using system environment variables)');
  }
}

// Load environment variables from .env.local
loadEnvLocal();

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Diagnostic: Show what we found
const foundUrl = !!supabaseUrl;
const foundServiceKey = !!supabaseServiceRoleKey;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Missing environment variables');
  console.error('\n📋 Found variables:');
  console.error(`   NEXT_PUBLIC_SUPABASE_URL: ${foundUrl ? '✅ Found' : '❌ Missing'}`);
  console.error(`   SUPABASE_SERVICE_ROLE_KEY: ${foundServiceKey ? '✅ Found' : '❌ Missing'}`);
  console.error('\n📋 Required variables for this script:');
  console.error('   - NEXT_PUBLIC_SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  console.error('\n💡 Please set these in apps/map/.env.local');
  console.error('\n📝 Note:');
  console.error('   - If you have NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY, that\'s fine');
  console.error('     (it\'s a newer Supabase naming convention)');
  console.error('   - This script only needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  console.error('   - Make sure .env.local is in the apps/map/ directory');
  process.exit(1);
}

// Create service role client
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function checkFunctionExists() {
  console.log('\n🔍 Checking if check_and_increment_rate_limit function exists...\n');

  try {
    // Try to call the function with test parameters
    // If it doesn't exist, we'll get an error
    const { data, error } = await supabase.rpc(
      'check_and_increment_rate_limit',
      {
        p_device_id_hash: 'test-check',
        p_ip_hash: 'test-check',
        p_rate_limit: 20,
      }
    );

    if (error) {
      // Check if error indicates function doesn't exist
      const isFunctionNotFound = 
        error.message?.includes('function') && 
        (error.message?.includes('does not exist') || 
         error.message?.includes('not found') ||
         error.code === '42883' || // undefined_function
         error.code === 'P0001'); // procedure_exception

      if (isFunctionNotFound) {
        console.log('❌ Function does NOT exist in database');
        console.log(`   Error code: ${error.code}`);
        console.log(`   Error message: ${error.message}`);
        console.log('\n📋 Solution: Run database migrations');
        console.log('   Commands:');
        console.log('   1. cd supabase');
        console.log('   2. supabase db reset  (resets and applies all migrations)');
        console.log('   OR');
        console.log('   2. supabase migration up  (applies pending migrations)');
        return false;
      } else {
        console.log('⚠️  Function exists but returned an error:');
        console.log(`   Error code: ${error.code}`);
        console.log(`   Error message: ${error.message}`);
        console.log('   This might be a different issue (permissions, parameters, etc.)');
        return false;
      }
    }

    if (data && data.length > 0) {
      console.log('✅ Function EXISTS and is callable');
      console.log(`   Test result: ${JSON.stringify(data[0])}`);
      return true;
    } else {
      console.log('⚠️  Function exists but returned no data');
      return false;
    }
  } catch (err) {
    console.error('❌ Unexpected error checking function:', err);
    return false;
  }
}

async function checkTablesExist() {
  console.log('\n🔍 Checking if required tables exist...\n');

  const tables = ['anonymous_devices', 'broadcast_messages', 'profiles'];
  let allExist = true;

  for (const tableName of tables) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);

      if (error) {
        // Check if error is "relation does not exist"
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          console.log(`❌ Table '${tableName}' does NOT exist`);
          allExist = false;
        } else {
          console.log(`⚠️  Table '${tableName}' exists but query failed: ${error.message}`);
        }
      } else {
        console.log(`✅ Table '${tableName}' exists`);
      }
    } catch (err) {
      console.error(`❌ Error checking table '${tableName}':`, err);
      allExist = false;
    }
  }

  return allExist;
}

async function main() {
  console.log('🚀 Database Migration Check\n');
  console.log('='.repeat(50));

  const tablesExist = await checkTablesExist();
  const functionExists = await checkFunctionExists();

  console.log('\n' + '='.repeat(50));
  console.log('\n📊 Summary:');
  console.log(`   Tables exist: ${tablesExist ? '✅' : '❌'}`);
  console.log(`   Function exists: ${functionExists ? '✅' : '❌'}`);

  if (!tablesExist || !functionExists) {
    console.log('\n❌ Migrations appear to be missing or incomplete');
    console.log('\n📋 To fix:');
    console.log('   1. Make sure Supabase is running: supabase start');
    console.log('   2. Apply migrations:');
    console.log('      cd supabase');
    console.log('      supabase db reset  (recommended - resets and applies all)');
    console.log('      OR');
    console.log('      supabase migration up  (applies pending only)');
    process.exit(1);
  } else {
    console.log('\n✅ All migrations appear to be applied correctly!');
    process.exit(0);
  }
}

main();
