# Changelog - v0.1.4

**Release Date**: 2026-01-19  
**Type**: Minor Release (New Feature)

## Summary

Backend MVP implementation for the 111 Network broadcast system. This release adds the complete backend infrastructure for posting and fetching broadcast messages with rate limiting, security policies, and geospatial queries.

## New Features

### Backend API

- **POST `/api/broadcast`**: Create broadcast messages with validation and rate limiting
  - Content validation (max 240 chars, HTML stripping)
  - Coordinate validation (lat/lng ranges)
  - Device identifier validation
  - Rate limiting: 20 posts per 24 hours per device (configurable)
  - IP address hashing for privacy

- **GET `/api/broadcast`**: Fetch published messages with bounding box filtering
  - Bounding box query support
  - Optional timestamp filtering (`since` parameter)
  - Configurable result limit (default: 200, max: 500)

### Database Schema

- **New Tables**:
  - `broadcast_messages`: Public broadcast messages
  - `anonymous_devices`: Device tracking for rate limiting
  - `profiles`: User profiles (minimal, for future auth)

- **Security**:
  - Row Level Security (RLS) policies on all tables
  - Public can only read published messages
  - No direct client inserts/updates/deletes
  - Service role required for writes

- **Indexes**: Optimized for time-based and geospatial queries

### Developer Tools

- **Supabase Client Utilities**:
  - Server-only client (`src/lib/supabase/server.ts`)
  - Browser client (`src/lib/supabase/client.ts`)
  - TypeScript database types

- **Validation Utilities** (`src/lib/validation.ts`):
  - Content sanitization
  - Coordinate validation
  - Device identifier validation
  - IP address hashing
  - Bounding box validation

- **Verification Script** (`scripts/verify-backend.ts`):
  - Tests RLS policies
  - Tests rate limiting
  - Tests bounding box queries

## Documentation

- **API Documentation**: Complete API endpoint documentation (`docs/specs/api-endpoints.md`)
- **Environment Variables**: Setup guide (`apps/map/ENV.md`)
- **Map App README**: Project structure and setup (`apps/map/README.md`)
- **Security Review**: Comprehensive security audit (`docs/development/SECURITY_REVIEW_v0.1.4.md`)
- **Architecture Updates**: Updated architecture docs with backend details

## Dependencies

### Added
- `@supabase/supabase-js`: ^2.45.4 (Supabase client library)
- `tsx`: ^4.19.2 (TypeScript execution for scripts)

## Security

- ✅ No secrets in code
- ✅ Input validation and sanitization
- ✅ IP and device identifier hashing
- ✅ Row Level Security (RLS) policies
- ✅ Service role key never exposed to client
- ✅ Rate limiting per device and IP

## Migration Required

Run the following migration to set up the database schema:

```bash
supabase migration up
```

Migration file: `supabase/migrations/20260119154740_create_broadcast_tables.sql`

## Environment Variables

New environment variables required (see `apps/map/ENV.md`):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only, never expose)
- `BROADCAST_RATE_LIMIT_PER_24H` (optional, default: 20)

## Breaking Changes

None - This is a new feature addition.

## Known Limitations

- HTML sanitization uses simple regex (consider DOMPurify for production)
- Rate limiting can be bypassed with multiple devices/IPs (acceptable for MVP)
- Moderation workflow not yet implemented (all messages published immediately)

## Future Enhancements

- Frontend UI for map visualization
- User authentication (optional login)
- Moderation workflow (pending → published)
- Advanced geospatial queries (PostGIS)
- Admin panel for rate limit configuration
- Private messaging

## Files Changed

### New Files
- `supabase/migrations/20260119154740_create_broadcast_tables.sql`
- `apps/map/src/app/api/broadcast/route.ts`
- `apps/map/src/lib/supabase/server.ts`
- `apps/map/src/lib/supabase/client.ts`
- `apps/map/src/lib/types/database.ts`
- `apps/map/src/lib/validation.ts`
- `apps/map/scripts/verify-backend.ts`
- `apps/map/ENV.md`
- `apps/map/README.md`
- `docs/specs/api-endpoints.md`
- `docs/development/SECURITY_REVIEW_v0.1.4.md`

### Modified Files
- `apps/map/package.json` (dependencies and scripts)
- `package.json` (version bump)
- `docs/architecture.md`
- `docs/README.md`
- `docs/development/README.md`
- `docs/development/versioning.md`
- `docs/specs/api-endpoints.md` (updated from placeholder)

## Testing

Run the verification script to test the backend:

```bash
cd apps/map
pnpm verify-backend
```

## Contributors

- AI Agent (Auto) - Backend implementation and documentation

---

**Next Version**: v0.1.5 (Frontend UI for map visualization - planned)
