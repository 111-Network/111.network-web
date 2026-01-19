# API Endpoints Specification

## Status

**v0.1.4** - Backend MVP implemented for broadcast messages

## Overview

The backend API is implemented in `apps/map/src/app/api/broadcast/` using Next.js App Router API routes. All endpoints use Supabase PostgreSQL with Row Level Security (RLS) policies.

## Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: `https://your-domain.com/api`

## Authentication

Currently, the API supports anonymous access with device-based rate limiting. User authentication is optional and will be added in a future version.

## Endpoints

### POST /api/broadcast

Creates a new broadcast message with rate limiting.

**Rate Limit**: 20 posts per 24 hours per device (configurable via `BROADCAST_RATE_LIMIT_PER_24H`)

**Request Body**:
```json
{
  "content": "Your message here (max 240 characters)",
  "latitude": 37.7749,
  "longitude": -122.4194,
  "geo_precision": "approx",
  "device_id_hash": "optional-hashed-device-id",
  "device_public_key": "optional-public-key"
}
```

**Parameters**:
- `content` (required, string): Message content, max 240 characters. HTML is stripped automatically.
- `latitude` (required, number): Latitude between -90 and 90
- `longitude` (required, number): Longitude between -180 and 180
- `geo_precision` (optional, string): One of `'exact'`, `'approx'`, `'region'`. Default: `'approx'`
- `device_id_hash` (optional, string): Pre-hashed device identifier
- `device_public_key` (optional, string): Device public key (will be hashed). Either `device_id_hash` or `device_public_key` must be provided.

**Response** (201 Created):
```json
{
  "id": "uuid",
  "content": "Your message here",
  "latitude": 37.7749,
  "longitude": -122.4194,
  "geo_precision": "approx",
  "created_at": "2026-01-19T15:47:40.000Z",
  "remaining": 19
}
```

**Error Responses**:
- `400 Bad Request`: Invalid input (validation errors)
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

**Example**:
```bash
curl -X POST http://localhost:3000/api/broadcast \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Hello from San Francisco!",
    "latitude": 37.7749,
    "longitude": -122.4194,
    "geo_precision": "approx",
    "device_public_key": "device-key-123"
  }'
```

### GET /api/broadcast

Fetches published broadcast messages within a bounding box.

**Query Parameters**:
- `bbox` (required, string): Bounding box in format `minLat,maxLat,minLng,maxLng`
- `since` (optional, string): ISO timestamp to fetch messages created after this time
- `limit` (optional, number): Maximum number of messages to return (default: 200, max: 500)

**Response** (200 OK):
```json
{
  "messages": [
    {
      "id": "uuid",
      "content": "Message content",
      "latitude": 37.7749,
      "longitude": -122.4194,
      "geo_precision": "approx",
      "created_at": "2026-01-19T15:47:40.000Z"
    }
  ],
  "count": 1
}
```

**Error Responses**:
- `400 Bad Request`: Invalid bounding box or parameters
- `500 Internal Server Error`: Server error

**Example**:
```bash
curl "http://localhost:3000/api/broadcast?bbox=37.0,38.0,-123.0,-122.0&limit=50"
```

## Rate Limiting

- **Limit**: 20 posts per 24 hours per device (configurable)
- **Tracking**: Based on device identifier hash and IP address hash
- **Response**: When rate limit is exceeded, returns `429 Too Many Requests` with remaining count

## Security

- All messages are validated and sanitized (HTML stripped, length checked)
- IP addresses are hashed (SHA-256) for privacy
- Device identifiers are hashed before storage
- Row Level Security (RLS) policies prevent direct client access to sensitive tables
- Service role key is never exposed to clients (server-only)

## Database Schema

See `supabase/migrations/` for the complete database schema. Key tables:
- `broadcast_messages`: Public messages
- `anonymous_devices`: Device tracking for rate limiting
- `profiles`: User profiles (optional, for future authentication)

## Future Enhancements

- User authentication (optional login)
- Moderation workflow (pending → published)
- Advanced geospatial queries (PostGIS)
- Private messaging (coming soon)
- Admin panel for rate limit configuration
