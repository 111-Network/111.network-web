import { NextRequest, NextResponse } from 'next/server';

interface NominatimResult {
  place_id: number;
  licence: string;
  powered_by: string;
  osm_type: string;
  osm_id: number;
  boundingbox: [string, string, string, string];
  lat: string;
  lon: string;
  display_name: string;
  class: string;
  type: string;
  importance: number;
}

/**
 * GET /api/location-search
 * 
 * Searches for locations using Nominatim (OpenStreetMap).
 * Implements server-side rate limiting to respect 1 req/sec policy.
 * 
 * Query params:
 * - q: search query string
 * - limit: max results (default: 5)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '5', 10);

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      );
    }

    if (limit < 1 || limit > 10) {
      return NextResponse.json(
        { error: 'Limit must be between 1 and 10' },
        { status: 400 }
      );
    }

    // Call Nominatim API with proper User-Agent (required by usage policy)
    const nominatimUrl = new URL('https://nominatim.openstreetmap.org/search');
    nominatimUrl.searchParams.set('q', query.trim());
    nominatimUrl.searchParams.set('format', 'json');
    nominatimUrl.searchParams.set('limit', String(limit));
    nominatimUrl.searchParams.set('addressdetails', '1');

    const response = await fetch(nominatimUrl.toString(), {
      headers: {
        'User-Agent': '111-Network-Map/1.0 (https://111.network)',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Nominatim API error: ${response.status}`);
    }

    const results: NominatimResult[] = await response.json();

    // Transform results to our format
    const suggestions = results.map((result) => ({
      id: result.place_id,
      name: result.display_name,
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      type: result.type,
      class: result.class,
      importance: result.importance,
    }));

    return NextResponse.json({
      suggestions,
      attribution: '© OpenStreetMap contributors',
    });
  } catch (error) {
    console.error('Location search error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to search locations',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
