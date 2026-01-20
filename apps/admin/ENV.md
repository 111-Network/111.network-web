# Environment Variables

Copy this file to `.env.local` in the `apps/admin` directory and fill in your values.

## Required Environment Variables

```bash
# Supabase Configuration
# Get these values from your Supabase project dashboard: https://app.supabase.com

# Public Supabase URL (safe to expose to client)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co

# Public anon/publishable key (safe to expose to client, respects RLS policies)
# Note: Supabase now uses publishable keys (format: sb_publishable_...)
# Legacy anon keys (JWT-based) are also supported
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-publishable-key-here
# OR for legacy setups:
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Service role key (NEVER expose to client - server-only)
# This key bypasses RLS and has full database access
# Only use in API routes and server-side code
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## Security Notes

- **NEXT_PUBLIC_SUPABASE_URL** and **NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY** are safe to expose to the client (they're prefixed with `NEXT_PUBLIC_`)
- **SUPABASE_SERVICE_ROLE_KEY** must NEVER be exposed to the client. It's only used in server-side code (API routes)
- The service role key bypasses Row Level Security (RLS) and has full database access
- Always use the service role client (`createServerClient()`) in API routes only

## Getting Your Supabase Keys

1. Go to https://app.supabase.com
2. Select your project
3. Go to Settings → API
4. Copy the "Project URL" → `NEXT_PUBLIC_SUPABASE_URL`
5. Copy the "publishable" key (or "anon public" for legacy) → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
6. Copy the "service_role" key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

## Admin App Specific Notes

- The admin app requires authentication for all API routes
- Users must be in either `core_team` or `community_contributors` tables to access admin features
- Core team members are manually added via Supabase dashboard
- Community contributors require approval from core team before they can access admin features
- All role checks happen server-side for security

## Role System

- **Core Team**: Full admin access, manually managed
- **Community Contributors**: Limited moderation access (levels 1-5), requires approval
- **No Role**: Authenticated users without a role cannot access admin features
