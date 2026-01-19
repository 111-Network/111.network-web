# Environment Variables

Copy this file to `.env.local` in the `apps/map` directory and fill in your values.

## Required Environment Variables

```bash
# Supabase Configuration
# Get these values from your Supabase project dashboard: https://app.supabase.com

# Public Supabase URL (safe to expose to client)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co

# Public anon key (safe to expose to client, respects RLS policies)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Service role key (NEVER expose to client - server-only)
# This key bypasses RLS and has full database access
# Only use in API routes and server-side code
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Rate Limiting Configuration
# Number of posts allowed per device per 24 hours
# Default: 20 (can be changed via admin panel later)
BROADCAST_RATE_LIMIT_PER_24H=20
```

## Security Notes

- **NEXT_PUBLIC_SUPABASE_URL** and **NEXT_PUBLIC_SUPABASE_ANON_KEY** are safe to expose to the client (they're prefixed with `NEXT_PUBLIC_`)
- **SUPABASE_SERVICE_ROLE_KEY** must NEVER be exposed to the client. It's only used in server-side code (API routes)
- The service role key bypasses Row Level Security (RLS) and has full database access
- Always use the service role client (`createServerClient()`) in API routes only

## Getting Your Supabase Keys

1. Go to https://app.supabase.com
2. Select your project
3. Go to Settings → API
4. Copy the "Project URL" → `NEXT_PUBLIC_SUPABASE_URL`
5. Copy the "anon public" key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Copy the "service_role" key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)
