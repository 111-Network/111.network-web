# Build Error Patterns & Solutions

This document tracks common build errors and their solutions for future reference.

## Pattern: "Server Actions must be async functions"

### Error Message
```
Error: × Server Actions must be async functions.
    ╭─[path/to/file.ts:12:1]
  12 │ export function myFunction() {
     ·                 ────────────
```

### Root Cause
- The file has `'use server'` directive at the top
- Next.js treats all exported functions in files with `'use server'` as Server Actions
- Server Actions must be async functions
- The function in question is a synchronous utility function, not a Server Action

### Solution
**Remove the `'use server'` directive** if the file contains utility functions that are:
- Not meant to be called from the client
- Only used in API routes or server components
- Synchronous functions that create clients or return data

### When to Use `'use server'`
- Only use `'use server'` for actual Server Actions (functions that can be called from client components)
- Server Actions must be async functions
- They're used for form submissions, mutations, etc. that need to run on the server

### When NOT to Use `'use server'`
- Utility functions that create database clients
- Helper functions used only in API routes
- Synchronous functions that return configuration or clients
- Functions that are already server-only by context (API routes, server components)

### Example Fix

**Before (❌ Wrong):**
```typescript
'use server';

export function createServerClient() {
  // This is NOT a Server Action, but Next.js treats it as one
  return createClient(url, key);
}
```

**After (✅ Correct):**
```typescript
// No 'use server' directive - this is just a utility function
// It's already server-only because it's only imported in API routes

export function createServerClient() {
  // This is a utility function, not a Server Action
  return createClient(url, key);
}
```

### Related Files
- `apps/map/src/lib/supabase/server.ts` - Fixed in v0.1.5

### Pattern Recognition
If you see this error:
1. Check if the file has `'use server'` directive
2. Check if exported functions are async (Server Actions must be async)
3. If functions are synchronous utilities, remove `'use server'`
4. Add a comment explaining why `'use server'` is not needed

---

## Pattern: Turbopack/Webpack Conflict

### Error Message
```
⨯ ERROR: This build is using Turbopack, with a `webpack` config and no `turbopack` config.
   This may be a mistake.
```

### Root Cause
- Next.js 16 uses Turbopack by default
- Some libraries (like MapLibre GL) require webpack configuration
- Having webpack config without turbopack config causes conflict

### Solution
**Add `--webpack` flag to both `dev` and `build` scripts** in `package.json`:
```json
{
  "scripts": {
    "dev": "next dev --webpack",
    "build": "next build --webpack"
  }
}
```

### Related Files
- `apps/map/package.json` - Fixed in v0.1.5

---

## Pattern: Multiple Lockfiles Warning

### Error Message
```
⚠ Warning: Next.js inferred your workspace root, but it may not be correct.
  We detected multiple lockfiles and selected the directory of /path/to/pnpm-lock.yaml as the root directory.
  Detected additional lockfiles:
    * /path/to/app/package-lock.json
```

### Root Cause
- In a pnpm monorepo, only the root `pnpm-lock.yaml` is needed
- `package-lock.json` files in app directories are unnecessary and cause warnings

### Solution
**Delete `package-lock.json` files** from app directories:
- They're already in `.gitignore`
- Only keep the root `pnpm-lock.yaml`

### Related Files
- `apps/map/package-lock.json` - Deleted in v0.1.5
- `apps/website/package-lock.json` - Deleted in v0.1.5

---

## Summary

When encountering build errors:
1. **Check for `'use server'` misuse** - Remove if not actual Server Actions
2. **Check for Turbopack/Webpack conflicts** - Use `--webpack` flag if needed
3. **Check for lockfile conflicts** - Remove unnecessary lockfiles in monorepo
4. **Read error messages carefully** - They often point to the exact issue
