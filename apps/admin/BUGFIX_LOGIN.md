# Bug Fix: Admin Login Redirect Issue

## Problem
After successful login, users were stuck on the login page instead of being redirected to the dashboard. The middleware was redirecting authenticated users back to login.

## Root Cause
**Session storage mismatch between client and middleware:**
- Client used `@supabase/supabase-js` `createClient()` → stored sessions in **localStorage**
- Middleware used `@supabase/ssr` `createServerClient()` → reads sessions from **cookies**
- Result: Middleware couldn't see the session, causing redirect loop

## Solution
Changed client-side Supabase client from `@supabase/supabase-js` to `@supabase/ssr`:
- **Before:** `createClient()` from `@supabase/supabase-js` (localStorage)
- **After:** `createBrowserClient()` from `@supabase/ssr` (cookies)

This ensures both client and middleware use the same cookie-based session storage, allowing middleware to properly detect authenticated users.

## Files Changed
- `apps/admin/src/lib/supabase/client.ts` - Switched to `createBrowserClient` from `@supabase/ssr`
- `apps/admin/src/components/login-form.tsx` - Changed redirect to use `window.location.href` for full page reload
- Removed debug instrumentation logs

## Testing
✅ Login works correctly
✅ Redirect to dashboard after login
✅ Middleware properly detects authenticated sessions
✅ No redirect loops
