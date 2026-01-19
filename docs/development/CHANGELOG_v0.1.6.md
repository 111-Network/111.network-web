# Changelog - v0.1.6

**Release Date**: 2026-01-19  
**Type**: Patch Release (Bug Fixes & Improvements)

## Summary

Bug fixes and improvements for the 111 Network map application. This release fixes critical issues with rate limiting, message display, and build errors, while adding developer tools and infrastructure improvements.

## Bug Fixes

### Rate Limiting
- **Fixed "Failed to check rate limit" error**: Resolved database migration issue where `check_and_increment_rate_limit` function was not accessible
  - Added migration verification script (`apps/map/scripts/check-migration.ts`)
  - Improved error messages with migration hints
  - Enhanced API route error handling

### Message Display
- **Fixed message markers disappearing/reappearing**: Resolved UI flicker when panning/zooming map
  - Changed `updateBounds` to use `keepExisting=true` for message merging
  - Messages now merge instead of being replaced, preventing flicker
  - Added `onLoad` handler to map for initial message fetch
  - Optimistic message updates for immediate UI feedback

### Build Errors
- **Fixed TypeScript compilation errors**: Removed `request.ip` property usage (not available in Next.js 16)
  - Updated `apps/map/src/app/api/broadcast/route.ts`
  - Updated `apps/map/src/app/api/geolocation/route.ts`
  - IP extraction now uses only headers (`x-forwarded-for`, `x-real-ip`, `cf-connecting-ip`)

### Bounds Validation
- **Fixed longitude wrapping errors**: Added support for bounds that wrap around the date line
  - Updated `validateBoundingBox()` to allow longitude values outside -180/180
  - Added longitude wrapping support in API query
  - Prevents 400 Bad Request errors when panning across date line

## Improvements

### Developer Tools
- **Added Supabase CLI to project**: Added as dev dependency for version control
  - Version: `^2.72.7` (latest)
  - Added npm scripts: `supabase:start`, `supabase:stop`, `supabase:status`, `supabase:reset`, `supabase:migration:up`
  - No global installation required

- **Created migration check script**: `apps/map/scripts/check-migration.ts`
  - Verifies database migrations are applied
  - Checks if required tables and functions exist
  - Provides clear error messages and fix instructions
  - Automatically loads `.env.local` file

### Infrastructure
- **Updated Supabase config for CLI v2**: Fixed compatibility issues
  - Changed `major_version` from 17 to 15 (PostgreSQL 15 supported)
  - Commented out deprecated config sections
  - Updated for Supabase CLI v2.72.7 compatibility

### Code Quality
- **Improved error handling**: Better error messages with actionable hints
- **Enhanced logging**: More detailed error information for debugging
- **Code cleanup**: Removed debug instrumentation after verification

## Dependencies

### Added
- `supabase`: ^2.72.7 (Supabase CLI - dev dependency)

### Updated
- None

## Documentation

### New Documentation
- `apps/map/scripts/check-migration.ts` - Migration verification script
- `docs/development/CHANGELOG_v0.1.6.md` - This changelog

### Updated Documentation
- `apps/map/README.md` - Added migration troubleshooting
- `package.json` - Added Supabase CLI scripts

## Files Changed

### New Files
- `apps/map/scripts/check-migration.ts` - Migration verification script
- `docs/development/CHANGELOG_v0.1.6.md` - Changelog

### Modified Files
- `apps/map/src/hooks/use-map-bounds.ts` - Fixed message merging logic
- `apps/map/src/components/map/map-view.tsx` - Added onLoad handler
- `apps/map/src/app/api/broadcast/route.ts` - Fixed TypeScript errors, improved error handling
- `apps/map/src/app/api/geolocation/route.ts` - Fixed TypeScript errors
- `apps/map/src/lib/validation.ts` - Added longitude wrapping support
- `package.json` - Added Supabase CLI and scripts
- `supabase/config.toml` - Updated for CLI v2 compatibility

### Moved Files
- `CHANGELOG_v0.1.4.md` → `docs/development/CHANGELOG_v0.1.4.md`
- `CHANGELOG_v0.1.5.md` → `docs/development/CHANGELOG_v0.1.5.md`
- `RELEASE_v0.1.4.md` → `docs/development/RELEASE_v0.1.4.md`
- `RELEASE_v0.1.5.md` → `docs/development/RELEASE_v0.1.5.md`
- `DOCUMENTATION_CHECK_v0.1.5.md` → `docs/development/DOCUMENTATION_CHECK_v0.1.5.md`

## Breaking Changes

None - All changes are backwards compatible.

## Migration Notes

If you encounter "Failed to check rate limit" errors:
1. Run `cd apps/map && npx tsx scripts/check-migration.ts` to verify migrations
2. Apply migrations: `pnpm supabase:reset` or `pnpm supabase:migration:up`

## Testing

All fixes have been tested and verified:
- ✅ Rate limiting works correctly after migrations
- ✅ Messages display without flicker
- ✅ Build succeeds without TypeScript errors
- ✅ Map panning/zooming works smoothly

## Contributors

- AI Agent (Auto) - Bug fixes and improvements

---

**Next Version**: v0.1.7 (Future enhancements - TBD)
