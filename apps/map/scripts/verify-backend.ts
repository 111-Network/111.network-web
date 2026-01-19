/**
 * Verification script to test RLS policies and API functionality.
 * 
 * Run with: npx tsx scripts/verify-backend.ts
 * 
 * Prerequisites:
 * - Set up .env.local with Supabase credentials
 * - Run migrations: supabase migration up
 */

import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
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
// Support both NEXT_PUBLIC_SUPABASE_ANON_KEY and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
  console.error('❌ Missing environment variables');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Create clients
const anonClient = createClient(supabaseUrl, supabaseAnonKey);
const serviceClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function testRLSPolicies() {
  console.log('\n🧪 Testing RLS Policies...\n');

  // Test 1: Anonymous client cannot insert into broadcast_messages
  console.log('Test 1: Anonymous client cannot insert into broadcast_messages');
  const { error: anonInsertError } = await anonClient
    .from('broadcast_messages')
    .insert({
      content: 'Test message',
      latitude: 0,
      longitude: 0,
      device_id: '00000000-0000-0000-0000-000000000000',
    });

  if (anonInsertError) {
    console.log('✅ PASS: Anonymous insert blocked (expected)');
  } else {
    console.log('❌ FAIL: Anonymous insert should be blocked');
  }

  // Test 2: Anonymous client can read published messages
  console.log('\nTest 2: Anonymous client can read published messages');
  const { data: publishedMessages, error: readError } = await anonClient
    .from('broadcast_messages')
    .select('*')
    .eq('status', 'published')
    .limit(1);

  if (!readError && publishedMessages !== null) {
    console.log('✅ PASS: Anonymous can read published messages');
  } else {
    console.log('❌ FAIL: Anonymous should be able to read published messages');
    console.log('Error:', readError);
  }

  // Test 3: Anonymous client cannot read pending messages
  console.log('\nTest 3: Anonymous client cannot read pending messages');
  const { data: pendingMessages } = await anonClient
    .from('broadcast_messages')
    .select('*')
    .eq('status', 'pending')
    .limit(1);

  if (!pendingMessages || pendingMessages.length === 0) {
    console.log('✅ PASS: Anonymous cannot read pending messages (expected)');
  } else {
    console.log('❌ FAIL: Anonymous should not be able to read pending messages');
  }

  // Test 4: Anonymous client cannot access anonymous_devices
  console.log('\nTest 4: Anonymous client cannot access anonymous_devices');
  const { error: devicesError } = await anonClient
    .from('anonymous_devices')
    .select('*')
    .limit(1);

  if (devicesError) {
    console.log('✅ PASS: Anonymous cannot access anonymous_devices (expected)');
  } else {
    console.log('❌ FAIL: Anonymous should not be able to access anonymous_devices');
  }

  // Test 5: Service role can insert messages
  console.log('\nTest 5: Service role can insert messages');
  const { data: device, error: deviceError } = await serviceClient
    .from('anonymous_devices')
    .insert({
      device_id_hash: `test-${Date.now()}`,
      ip_hash: 'test-ip-hash',
    })
    .select()
    .single();

  if (device && !deviceError) {
    const { data: message, error: messageError } = await serviceClient
      .from('broadcast_messages')
      .insert({
        content: 'Test message from service role',
        latitude: 37.7749,
        longitude: -122.4194,
        device_id: device.id,
        status: 'published',
      })
      .select()
      .single();

    if (message && !messageError) {
      console.log('✅ PASS: Service role can insert messages');
      
      // Cleanup
      await serviceClient
        .from('broadcast_messages')
        .delete()
        .eq('id', message.id);
      await serviceClient
        .from('anonymous_devices')
        .delete()
        .eq('id', device.id);
    } else {
      console.log('❌ FAIL: Service role should be able to insert messages');
      console.log('Error:', messageError);
    }
  } else {
    console.log('❌ FAIL: Could not create test device');
    console.log('Error:', deviceError);
  }
}

async function testRateLimiting() {
  console.log('\n🧪 Testing Rate Limiting...\n');

  const testDeviceHash = `test-device-${Date.now()}`;
  const testIpHash = `test-ip-${Date.now()}`;
  const rateLimit = 20;

  // Create a test device
  const { data: device, error: deviceError } = await serviceClient
    .from('anonymous_devices')
    .insert({
      device_id_hash: testDeviceHash,
      ip_hash: testIpHash,
      post_count_24h: 0,
      post_count_reset_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    })
    .select()
    .single();

  if (!device || deviceError) {
    console.log('❌ FAIL: Could not create test device for rate limiting');
    console.log('Error:', deviceError);
    return;
  }

  // Test rate limit function
  console.log('Test: Rate limit function allows posts within limit');
  const { data: rateLimitResult, error: rateError } = await serviceClient.rpc(
    'check_and_increment_rate_limit',
    {
      p_device_id_hash: testDeviceHash,
      p_ip_hash: testIpHash,
      p_rate_limit: rateLimit,
    }
  );

  if (!rateError && rateLimitResult && rateLimitResult.length > 0) {
    const { allowed, remaining } = rateLimitResult[0];
    if (allowed && remaining >= 0) {
      console.log(`✅ PASS: Rate limit check passed (remaining: ${remaining})`);
    } else {
      console.log('❌ FAIL: Rate limit check failed unexpectedly');
    }
  } else {
    console.log('❌ FAIL: Rate limit function error');
    console.log('Error:', rateError);
  }

  // Cleanup
  await serviceClient
    .from('anonymous_devices')
    .delete()
    .eq('id', device.id);
}

async function testBoundingBoxQuery() {
  console.log('\n🧪 Testing Bounding Box Query...\n');

  // Create a test message in San Francisco
  const testDeviceHash = `test-device-bbox-${Date.now()}`;
  const testIpHash = `test-ip-bbox-${Date.now()}`;

  const { data: device, error: deviceError } = await serviceClient
    .from('anonymous_devices')
    .insert({
      device_id_hash: testDeviceHash,
      ip_hash: testIpHash,
    })
    .select()
    .single();

  if (!device || deviceError) {
    console.log('❌ FAIL: Could not create test device');
    return;
  }

  const { data: message, error: messageError } = await serviceClient
    .from('broadcast_messages')
    .insert({
      content: 'Test message in San Francisco',
      latitude: 37.7749,
      longitude: -122.4194,
      device_id: device.id,
      status: 'published',
    })
    .select()
    .single();

  if (!message || messageError) {
    console.log('❌ FAIL: Could not create test message');
    console.log('Error:', messageError);
    await serviceClient.from('anonymous_devices').delete().eq('id', device.id);
    return;
  }

  // Test bounding box query
  console.log('Test: Bounding box query returns messages in range');
  const { data: messages, error: queryError } = await serviceClient
    .from('broadcast_messages')
    .select('*')
    .eq('status', 'published')
    .gte('latitude', 37.0)
    .lte('latitude', 38.0)
    .gte('longitude', -123.0)
    .lte('longitude', -122.0)
    .order('created_at', { ascending: false })
    .limit(10);

  if (!queryError && messages && messages.length > 0) {
    const found = messages.some((m) => m.id === message.id);
    if (found) {
      console.log('✅ PASS: Bounding box query works correctly');
    } else {
      console.log('❌ FAIL: Test message not found in bounding box query');
    }
  } else {
    console.log('❌ FAIL: Bounding box query error');
    console.log('Error:', queryError);
  }

  // Cleanup
  await serviceClient.from('broadcast_messages').delete().eq('id', message.id);
  await serviceClient.from('anonymous_devices').delete().eq('id', device.id);
}

async function main() {
  console.log('🚀 Starting Backend Verification Tests\n');
  console.log('=' .repeat(50));

  try {
    await testRLSPolicies();
    await testRateLimiting();
    await testBoundingBoxQuery();

    console.log('\n' + '='.repeat(50));
    console.log('✅ Verification tests completed!');
  } catch (error) {
    console.error('\n❌ Verification tests failed:', error);
    process.exit(1);
  }
}

main();
