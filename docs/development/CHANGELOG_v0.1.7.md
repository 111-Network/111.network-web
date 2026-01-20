# Changelog - v0.1.7

**Release Date**: 2026-01-20  
**Type**: Minor Release (New Feature)

## Summary

This release implements a complete backend role and access control system for the admin app. The system distinguishes between core team members and community contributors, with secure server-side role detection and permission enforcement.

## New Features

### Admin Role System

#### Database Schema
- **Core Team Table** (`core_team`): Manually managed table for core team members with full admin access
  - References `auth.users(id)` with cascade delete
  - Tracks creation metadata (created_by, created_at, updated_at)
  - Notes field for administrative purposes

- **Community Contributors Table** (`community_contributors`): Table for community moderators with limited access
  - Level system (1-5) for granular permission control
  - Status tracking (pending, approved, rejected, suspended)
  - Approval workflow (approved_by, approved_at)
  - All new contributors start as "pending" until core team approval

- **Role Detection Function** (`get_user_role()`): Efficient PostgreSQL function
  - Checks both tables in priority order (core_team first, then community_contributors)
  - Returns role type, level, core status, and approval status
  - Uses SECURITY DEFINER for secure role checks
  - Only returns approved community contributors

#### Backend Infrastructure

- **Server Supabase Client** (`apps/admin/src/lib/supabase/server.ts`)
  - Service role client for admin API routes
  - Bypasses RLS for role checks
  - Proper error handling for missing environment variables

- **Authentication Helpers** (`apps/admin/src/lib/supabase/auth.ts`)
  - `getAuthenticatedUser()`: Extracts and verifies user from request headers
  - `requireAuth()`: Enforces authentication and optional role requirements
  - Supports both publishable keys (new) and anon keys (legacy)
  - Returns 401 for unauthenticated, 403 for insufficient permissions

- **Role Utilities** (`apps/admin/src/lib/auth/roles.ts`)
  - `UserRole` enum: CORE, MODERATOR, NONE
  - `getUserRole()`: Fetches user role from database using service role client
  - `canPerformAction()`: Permission checking system (extensible for future actions)
  - `requireRole()`: Role requirement validation
  - `canModeratorLevelPerform()`: Level-based permission checks (future-ready)

- **TypeScript Types** (`apps/admin/src/lib/types/database.ts`)
  - Complete database types including role tables
  - Function signatures for `get_user_role()`
  - Type-safe role system

#### API Endpoints

- **GET `/api/auth/me`**: Returns current user's role and permissions
  - Requires authentication (any role or no role)
  - Returns user info, role, level, status, and permission flags
  - Used by frontend to determine UI access

### Security Features

- **Row Level Security (RLS)**: Enabled on all role tables
  - No public access to `core_team` table
  - No public access to `community_contributors` table
  - Service role required for all role table operations

- **Server-Side Role Verification**: All role checks happen server-side
  - Frontend can query role info but cannot modify it
  - Service role client only used in API routes
  - Authentication tokens verified on every request

- **Role-Based Access Control**: Enforced at API route level
  - Core team: Full admin access
  - Community contributors: Limited moderation access (levels 1-5)
  - No role: Cannot access admin features

### Documentation

- **Environment Variables** (`apps/admin/ENV.md`)
  - Complete documentation of required environment variables
  - Security notes and best practices
  - Instructions for obtaining Supabase keys
  - Admin app specific notes about role system

## Database Migration

### New Migration File
- `supabase/migrations/20260120144720_create_admin_role_tables.sql`
  - Creates `core_team` and `community_contributors` tables
  - Creates `get_user_role()` function
  - Sets up RLS policies
  - Adds indexes for performance
  - Includes comprehensive comments

## Dependencies

### Added
- `@supabase/supabase-js`: ^2.45.4 (admin app dependency)

## Files Changed

### New Files
- `supabase/migrations/20260120144720_create_admin_role_tables.sql` - Database schema for role system
- `apps/admin/src/lib/supabase/server.ts` - Server-side Supabase client
- `apps/admin/src/lib/supabase/auth.ts` - Authentication helpers
- `apps/admin/src/lib/auth/roles.ts` - Role detection and permission utilities
- `apps/admin/src/lib/types/database.ts` - TypeScript database types
- `apps/admin/src/app/api/auth/me/route.ts` - Role info API endpoint
- `apps/admin/ENV.md` - Environment variable documentation
- `docs/development/CHANGELOG_v0.1.7.md` - This changelog

### Modified Files
- `apps/admin/package.json` - Added @supabase/supabase-js dependency

## Breaking Changes

None - This is a new feature addition that does not affect existing functionality.

## Migration Notes

To apply the new role system:

1. **Run the migration**:
   ```bash
   pnpm supabase:migration:up
   ```

2. **Add core team members** (manually via Supabase dashboard):
   - Insert records into `core_team` table
   - Reference existing `auth.users` records

3. **Set up environment variables** (see `apps/admin/ENV.md`):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` (or `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - `SUPABASE_SERVICE_ROLE_KEY`

4. **Install dependencies**:
   ```bash
   pnpm install
   ```

## Testing

The role system has been designed with security in mind:
- ✅ RLS policies prevent unauthorized access
- ✅ Server-side role verification
- ✅ Type-safe role system
- ✅ Proper error handling (401/403 responses)
- ✅ No linter errors

## Future Enhancements

- Level-based permissions for community contributors (levels 1-5)
- Action-based permission system (e.g., 'delete_message', 'approve_user')
- Contributor application workflow (anonymous users applying to become contributors)
- Admin API routes for message moderation, user management, and settings

## Contributors

- AI Agent (Auto) - Backend role system implementation

---

**Next Version**: v0.1.8 (Future enhancements - TBD)
