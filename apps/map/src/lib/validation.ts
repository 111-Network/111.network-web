import { createHash } from 'crypto';

/**
 * Maximum content length for broadcast messages (240 characters)
 */
export const MAX_CONTENT_LENGTH = 240;

/**
 * Rate limit: 20 posts per 24 hours per device
 * This can be configured via environment variable and later moved to admin panel
 */
export const DEFAULT_RATE_LIMIT_PER_24H = 20;

/**
 * Validates and sanitizes message content
 */
export function validateAndSanitizeContent(content: unknown): string {
  if (typeof content !== 'string') {
    throw new Error('Content must be a string');
  }

  // Trim whitespace
  let sanitized = content.trim();

  // Strip HTML tags (simple regex - for production, consider using DOMPurify)
  sanitized = sanitized.replace(/<[^>]*>/g, '');

  // Check if empty after sanitization
  if (sanitized.length === 0) {
    throw new Error('Content cannot be empty');
  }

  // Check length (UTF-8 aware)
  if (new TextEncoder().encode(sanitized).length > MAX_CONTENT_LENGTH) {
    throw new Error(`Content exceeds maximum length of ${MAX_CONTENT_LENGTH} characters`);
  }

  return sanitized;
}

/**
 * Validates latitude (-90 to 90)
 */
export function validateLatitude(lat: unknown): number {
  if (typeof lat !== 'number' && typeof lat !== 'string') {
    throw new Error('Latitude must be a number');
  }

  const num = typeof lat === 'string' ? parseFloat(lat) : lat;

  if (isNaN(num) || !isFinite(num)) {
    throw new Error('Latitude must be a valid number');
  }

  if (num < -90 || num > 90) {
    throw new Error('Latitude must be between -90 and 90');
  }

  return num;
}

/**
 * Validates longitude (-180 to 180)
 */
export function validateLongitude(lng: unknown): number {
  if (typeof lng !== 'number' && typeof lng !== 'string') {
    throw new Error('Longitude must be a number');
  }

  const num = typeof lng === 'string' ? parseFloat(lng) : lng;

  if (isNaN(num) || !isFinite(num)) {
    throw new Error('Longitude must be a valid number');
  }

  if (num < -180 || num > 180) {
    throw new Error('Longitude must be between -180 and 180');
  }

  return num;
}

/**
 * Validates geo precision value
 */
export function validateGeoPrecision(
  precision: unknown
): 'exact' | 'approx' | 'region' {
  if (typeof precision !== 'string') {
    return 'approx'; // Default
  }

  if (precision === 'exact' || precision === 'approx' || precision === 'region') {
    return precision;
  }

  return 'approx'; // Default for invalid values
}

/**
 * Hashes a string using SHA-256
 */
export function hashString(input: string): string {
  return createHash('sha256').update(input).digest('hex');
}

/**
 * Extracts and hashes IP address from request headers
 */
export function extractAndHashIP(headers: Headers): string {
  // Try various headers that might contain the real IP
  // In production behind a proxy, use X-Forwarded-For or similar
  const forwardedFor = headers.get('x-forwarded-for');
  const realIP = headers.get('x-real-ip');
  const cfConnectingIP = headers.get('cf-connecting-ip'); // Cloudflare

  let ip = forwardedFor?.split(',')[0]?.trim() || 
           realIP || 
           cfConnectingIP || 
           'unknown';

  // Hash the IP address for privacy
  return hashString(ip);
}

/**
 * Validates device identifier (either device_id_hash or device_public_key)
 */
export function validateDeviceIdentifier(
  deviceIdHash?: string,
  devicePublicKey?: string
): { deviceIdHash: string } {
  if (deviceIdHash) {
    // If device_id_hash is provided, use it directly (assume it's already hashed)
    // In production, you might want to validate the format
    if (typeof deviceIdHash !== 'string' || deviceIdHash.length === 0) {
      throw new Error('Invalid device_id_hash');
    }
    return { deviceIdHash };
  }

  if (devicePublicKey) {
    // If device_public_key is provided, hash it to get device_id_hash
    if (typeof devicePublicKey !== 'string' || devicePublicKey.length === 0) {
      throw new Error('Invalid device_public_key');
    }
    return { deviceIdHash: hashString(devicePublicKey) };
  }

  throw new Error('Either device_id_hash or device_public_key must be provided');
}

/**
 * Validates bounding box parameters
 * Handles longitude wrapping (e.g., -183 to 174 wraps around the date line)
 */
export function validateBoundingBox(bbox: string): {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
} {
  const parts = bbox.split(',');
  if (parts.length !== 4) {
    throw new Error('Bounding box must be in format: minLat,maxLat,minLng,maxLng');
  }

  const [minLat, maxLat, minLng, maxLng] = parts.map((p) => parseFloat(p.trim()));

  if (
    isNaN(minLat) ||
    isNaN(maxLat) ||
    isNaN(minLng) ||
    isNaN(maxLng)
  ) {
    throw new Error('All bounding box values must be valid numbers');
  }

  // Validate ranges
  validateLatitude(minLat);
  validateLatitude(maxLat);
  
  // For longitude, allow values outside -180/180 for wrapping
  // We'll handle wrapping in the query, so just check they're finite numbers
  if (!isFinite(minLng) || !isFinite(maxLng)) {
    throw new Error('Longitude values must be finite numbers');
  }

  // Validate that min < max for latitude
  if (minLat >= maxLat) {
    throw new Error('minLat must be less than maxLat');
  }

  // For longitude, if minLng > maxLng, it means it wraps around the date line
  // This is valid (e.g., 170 to -170 wraps across the Pacific)
  // We'll handle this in the query with OR logic
  
  return { minLat, maxLat, minLng, maxLng };
}

/**
 * Validates location string
 * Location string should be non-empty and reasonable length
 */
export function validateLocationString(location: unknown): string {
  if (typeof location !== 'string') {
    throw new Error('Location must be a string');
  }

  const trimmed = location.trim();

  if (trimmed.length === 0) {
    throw new Error('Location cannot be empty');
  }

  if (trimmed.length > 200) {
    throw new Error('Location string is too long (max 200 characters)');
  }

  // Basic sanitization - remove HTML tags
  const sanitized = trimmed.replace(/<[^>]*>/g, '');

  if (sanitized.length === 0) {
    throw new Error('Location cannot be empty after sanitization');
  }

  return sanitized;
}

/**
 * Extracts coordinates from a location string
 * This is used when a location string is provided but coordinates are needed
 * The location string should be in a format that can be geocoded
 * 
 * Note: This function doesn't actually geocode - it's a placeholder for when
 * coordinates are already known (e.g., from autocomplete selection).
 * For actual geocoding, use the location search API.
 */
export function extractCoordinatesFromLocation(
  location: string,
  latitude?: number,
  longitude?: number
): { latitude: number; longitude: number } {
  // If coordinates are provided, validate and use them
  if (latitude !== undefined && longitude !== undefined) {
    const lat = validateLatitude(latitude);
    const lng = validateLongitude(longitude);
    return { latitude: lat, longitude: lng };
  }

  // If no coordinates provided, we need to geocode
  // This should be handled by the API/component that has access to geocoding
  throw new Error('Coordinates must be provided with location string');
}
