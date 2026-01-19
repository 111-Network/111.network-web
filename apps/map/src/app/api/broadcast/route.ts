import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import {
  validateAndSanitizeContent,
  validateLatitude,
  validateLongitude,
  validateGeoPrecision,
  validateDeviceIdentifier,
  validateBoundingBox,
  extractAndHashIP,
  DEFAULT_RATE_LIMIT_PER_24H,
} from '@/lib/validation';

/**
 * POST /api/broadcast
 * 
 * Creates a new broadcast message with rate limiting and captcha verification.
 * 
 * Body:
 * - content: string (max 240 chars)
 * - latitude: number (-90 to 90)
 * - longitude: number (-180 to 180)
 * - geo_precision?: 'exact' | 'approx' | 'region' (default: 'approx')
 * - device_id_hash?: string (or device_public_key)
 * - device_public_key?: string (or device_id_hash)
 * - captcha_token?: string (Turnstile captcha token)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Verify captcha token if provided
    const captchaToken = body.captcha_token;
    if (captchaToken) {
      const captchaSecret = process.env.TURNSTILE_SECRET_KEY;
      if (captchaSecret) {
        try {
          const captchaResponse = await fetch(
            'https://challenges.cloudflare.com/turnstile/v0/siteverify',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                secret: captchaSecret,
                response: captchaToken,
                remoteip: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                          request.headers.get('x-real-ip') ||
                          undefined,
              }),
            }
          );

          const captchaResult = await captchaResponse.json();
          
          if (!captchaResult.success) {
            return NextResponse.json(
              {
                error: 'Captcha verification failed',
                details: captchaResult['error-codes'] || ['Unknown error'],
              },
              { status: 400 }
            );
          }
        } catch (captchaError) {
          console.error('Captcha verification error:', captchaError);
          // Don't block the request if captcha verification fails due to network issues
          // In production, you might want to be stricter
        }
      }
    } else {
      // If captcha is enabled but no token provided, warn but don't block
      // In production, you might want to require captcha
      const captchaSecret = process.env.TURNSTILE_SECRET_KEY;
      if (captchaSecret) {
        console.warn('Broadcast request received without captcha token');
      }
    }

    // Validate and sanitize content
    const content = validateAndSanitizeContent(body.content);

    // Validate coordinates
    const latitude = validateLatitude(body.latitude);
    const longitude = validateLongitude(body.longitude);
    const geoPrecision = validateGeoPrecision(body.geo_precision);

    // Validate device identifier
    const { deviceIdHash } = validateDeviceIdentifier(
      body.device_id_hash,
      body.device_public_key
    );

    // Extract and hash IP address
    const ipHash = extractAndHashIP(request.headers);

    // Get rate limit from environment or use default
    const rateLimit = parseInt(
      process.env.BROADCAST_RATE_LIMIT_PER_24H || String(DEFAULT_RATE_LIMIT_PER_24H),
      10
    );

    // Create Supabase client (service role)
    const supabase = createServerClient();

    // Check rate limit using database function
    const { data: rateLimitResult, error: rateLimitError } = await supabase.rpc(
      'check_and_increment_rate_limit',
      {
        p_device_id_hash: deviceIdHash,
        p_ip_hash: ipHash,
        p_rate_limit: rateLimit,
      }
    );

    if (rateLimitError) {
      console.error('Rate limit check error:', rateLimitError);
      return NextResponse.json(
        { 
          error: 'Failed to check rate limit', 
          details: rateLimitError.message,
          code: rateLimitError.code,
        },
        { status: 500 }
      );
    }

    if (!rateLimitResult || rateLimitResult.length === 0) {
      return NextResponse.json(
        { error: 'Failed to check rate limit', details: 'Function returned no results' },
        { status: 500 }
      );
    }

    const { device_id, allowed, remaining } = rateLimitResult[0];

    if (!allowed) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: `Maximum ${rateLimit} posts per 24 hours allowed`,
          remaining: 0,
        },
        { status: 429 }
      );
    }

    // Insert the message
    const { data: message, error: insertError } = await supabase
      .from('broadcast_messages')
      .insert({
        content,
        latitude,
        longitude,
        geo_precision: geoPrecision,
        status: 'published', // Moderation disabled for now
        device_id,
        profile_id: null, // Anonymous posts for now
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json(
        { error: 'Failed to create message', details: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        id: message.id,
        content: message.content,
        latitude: message.latitude,
        longitude: message.longitude,
        geo_precision: message.geo_precision,
        created_at: message.created_at,
        remaining,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/broadcast
 * 
 * Fetches published broadcast messages within a bounding box.
 * 
 * Query params:
 * - bbox: string (minLat,maxLat,minLng,maxLng)
 * - since?: string (ISO timestamp, optional)
 * - limit?: number (default: 200, max: 500)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const bboxParam = searchParams.get('bbox');
    const sinceParam = searchParams.get('since');
    const limitParam = searchParams.get('limit');

    if (!bboxParam) {
      return NextResponse.json(
        { error: 'Missing required parameter: bbox' },
        { status: 400 }
      );
    }

    // Validate bounding box
    const { minLat, maxLat, minLng, maxLng } = validateBoundingBox(bboxParam);

    // Parse limit (default 200, max 500)
    let limit = 200;
    if (limitParam) {
      const parsedLimit = parseInt(limitParam, 10);
      if (!isNaN(parsedLimit) && parsedLimit > 0) {
        limit = Math.min(parsedLimit, 500); // Cap at 500
      }
    }

    // Parse since timestamp (optional)
    let sinceDate: Date | null = null;
    if (sinceParam) {
      sinceDate = new Date(sinceParam);
      if (isNaN(sinceDate.getTime())) {
        return NextResponse.json(
          { error: 'Invalid since parameter: must be a valid ISO timestamp' },
          { status: 400 }
        );
      }
    }

    // Create Supabase client (service role for now, but could use anon client)
    const supabase = createServerClient();

    // Build query
    // Handle longitude wrapping (when minLng > maxLng, bounds wrap around date line)
    const longitudeWraps = minLng > maxLng;
    
    let query = supabase
      .from('broadcast_messages')
      .select('id, content, latitude, longitude, geo_precision, created_at')
      .eq('status', 'published')
      .gte('latitude', minLat)
      .lte('latitude', maxLat)
      .order('created_at', { ascending: false })
      .limit(limit * 2); // Get more results when wrapping, we'll filter in memory

    // Handle longitude filtering (with wrapping support)
    if (longitudeWraps) {
      // Bounds wrap around date line: longitude >= minLng OR longitude <= maxLng
      // Supabase PostgREST supports OR with: .or('col1.gte.value1,col2.lte.value2')
      // But for same column OR, we need to filter in memory or use raw SQL
      // For now, fetch all and filter in memory (acceptable for small datasets)
      // In production, consider using PostGIS ST_MakeEnvelope with proper wrapping
    } else {
      // Normal case: minLng <= longitude <= maxLng
      query = query.gte('longitude', minLng).lte('longitude', maxLng);
    }

    // Add since filter if provided
    if (sinceDate) {
      query = query.gte('created_at', sinceDate.toISOString());
    }

    const { data: messages, error } = await query;

    if (error) {
      console.error('Query error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch messages', details: error.message },
        { status: 500 }
      );
    }

    // Filter by longitude if bounds wrap around date line
    let filteredMessages = messages || [];
    if (longitudeWraps) {
      filteredMessages = filteredMessages.filter(
        (msg) => msg.longitude >= minLng || msg.longitude <= maxLng
      );
      // Limit after filtering
      filteredMessages = filteredMessages.slice(0, limit);
    }

    return NextResponse.json(
      {
        messages: filteredMessages,
        count: filteredMessages.length,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
