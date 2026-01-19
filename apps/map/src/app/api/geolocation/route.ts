import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/geolocation
 * 
 * Gets user location based on IP address.
 * Returns location string and coordinates.
 */
export async function GET(request: NextRequest) {
  try {
    // Extract IP address from headers
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const cfConnectingIP = request.headers.get('cf-connecting-ip');
    
    const ip = forwardedFor?.split(',')[0]?.trim() || 
               realIP || 
               cfConnectingIP || 
               'unknown';

    // Use free IP geolocation service (ip-api.com - no key required for basic usage)
    // Free tier: 45 requests/minute, no API key needed
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,regionName,city,lat,lon`, {
      headers: {
        'User-Agent': '111-Network-Map/1.0',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch geolocation');
    }

    const data = await response.json();

    if (data.status === 'fail') {
      // Handle reserved/private IP ranges gracefully (common in local development)
      // Return a default location instead of an error
      if (data.message === 'reserved range' || data.message?.includes('reserved') || data.message?.includes('private')) {
        return NextResponse.json({
          location: 'Unknown Location',
          latitude: 0,
          longitude: 0,
          city: null,
          region: null,
          country: null,
        });
      }
      
      // For other failures, return error
      return NextResponse.json(
        { error: 'Geolocation failed', details: data.message },
        { status: 400 }
      );
    }

    // Format location string: "City, Region, Country"
    const locationParts = [];
    if (data.city) locationParts.push(data.city);
    if (data.regionName) locationParts.push(data.regionName);
    if (data.country) locationParts.push(data.country);

    const locationString = locationParts.length > 0 
      ? locationParts.join(', ')
      : 'Unknown Location';

    return NextResponse.json({
      location: locationString,
      latitude: data.lat || 0,
      longitude: data.lon || 0,
      city: data.city || null,
      region: data.regionName || null,
      country: data.country || null,
    });
  } catch (error) {
    console.error('Geolocation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get location',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
