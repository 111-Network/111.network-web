/**
 * Get the map app URL for linking to the map application
 * Can be configured via NEXT_PUBLIC_MAP_APP_URL environment variable
 * Defaults to https://map.111.network in production
 */
export function getMapAppUrl(): string {
  if (typeof window !== 'undefined') {
    // Client-side: use environment variable or default
    const mapUrl = process.env.NEXT_PUBLIC_MAP_APP_URL || 'https://map.111.network';
    return mapUrl;
  }
  // Server-side: use environment variable or default
  return process.env.NEXT_PUBLIC_MAP_APP_URL || 'https://map.111.network';
}
