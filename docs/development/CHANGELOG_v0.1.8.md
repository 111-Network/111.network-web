# Changelog - v0.1.8

**Release Date**: 2026-01-20  
**Type**: Minor Release (New Feature)

## Summary

This release implements complete client-side authentication integration for the admin app, connecting the login UI to the backend role system with route protection, session management, and role-based UI rendering.

## New Features

### Client-Side Authentication

- **Supabase Client** (`apps/admin/src/lib/supabase/client.ts`): Browser-side client with session persistence
- **Auth Context** (`apps/admin/src/contexts/auth-context.tsx`): React context managing auth state, roles, and session
- **Auth Hooks** (`apps/admin/src/hooks/use-auth.ts`, `use-role.ts`): Custom hooks for accessing auth state and role checks

### Login Integration

- **Login Form** (`apps/admin/src/components/login-form.tsx`): Integrated with Supabase auth
  - React Hook Form + Zod validation
  - Error handling and loading states
  - Password visibility toggle
  - Pending account status display

### Route Protection

- **Middleware** (`apps/admin/src/middleware.ts`): Next.js middleware protecting dashboard routes
- **ProtectedRoute Component** (`apps/admin/src/components/protected-route.tsx`): Client-side route protection with role checks
- **RoleGuard Component** (`apps/admin/src/components/role-guard.tsx`): Conditional rendering based on role

### Role-Based UI

- **Sidebar** (`apps/admin/src/components/app-sidebar.tsx`): Role-based menu items, core-only sections
- **NavUser** (`apps/admin/src/components/nav-user.tsx`): Real user data, role badges, logout functionality
- **SiteHeader** (`apps/admin/src/components/site-header.tsx`): Role indicator badges

### Session Management

- Auto-refresh tokens before expiry
- Session persistence via Supabase client
- Logout clears all session data
- Auth state synchronization across app

## Dependencies

### Added
- `react-hook-form`: ^7.54.2
- `zod`: ^3.24.1
- `@hookform/resolvers`: ^3.9.1
- `@testing-library/jest-dom`: ^6.1.5
- `@testing-library/react`: ^16.0.1
- `@testing-library/user-event`: ^14.5.1
- `jest`: ^29.7.0
- `jest-environment-jsdom`: ^29.7.0

## Files Changed

### New Files
- `apps/admin/src/lib/supabase/client.ts` - Client Supabase client
- `apps/admin/src/contexts/auth-context.tsx` - Auth context
- `apps/admin/src/components/providers/auth-provider.tsx` - AuthProvider wrapper
- `apps/admin/src/hooks/use-auth.ts` - useAuth hook
- `apps/admin/src/hooks/use-role.ts` - useRole hook
- `apps/admin/src/components/protected-route.tsx` - Protected route component
- `apps/admin/src/components/role-guard.tsx` - Role guard component
- `apps/admin/src/middleware.ts` - Route protection middleware
- `apps/admin/jest.config.js` - Jest configuration
- `apps/admin/jest.setup.js` - Test setup
- `apps/admin/src/lib/auth/__tests__/roles.test.ts` - Role utility tests
- `apps/admin/src/hooks/__tests__/use-role.test.ts` - Hook tests
- `apps/admin/SECURITY_REVIEW.md` - Security audit

### Modified Files
- `apps/admin/src/components/login-form.tsx` - Integrated with Supabase auth
- `apps/admin/src/components/app-sidebar.tsx` - Role-based menu items
- `apps/admin/src/components/nav-user.tsx` - Real user data and logout
- `apps/admin/src/components/site-header.tsx` - Role badges
- `apps/admin/src/app/login/page.tsx` - Error message handling
- `apps/admin/src/app/dashboard/page.tsx` - Protected route wrapper
- `apps/admin/src/app/page.tsx` - Redirects to dashboard
- `apps/admin/src/app/layout.tsx` - Added AuthProvider
- `apps/admin/next.config.ts` - Added transpilePackages
- `apps/admin/package.json` - Added dependencies and test scripts

## Security

- Server-side role verification (all security checks server-side)
- Service role key never exposed to client
- RLS policies enforced
- Input validation (client and server)
- Generic error messages (no user enumeration)
- Defense in depth (middleware + ProtectedRoute)

See `apps/admin/SECURITY_REVIEW.md` for complete security audit.

## Testing

- Unit tests for role utilities
- Hook tests for useRole
- Jest configuration and setup
- Test scripts added to package.json

## Breaking Changes

None - This is a new feature addition.

## Migration Notes

1. Install dependencies: `pnpm install`
2. Set environment variables (see `apps/admin/ENV.md`)
3. Run migration: `pnpm supabase:migration:up`
4. Add core team members via Supabase dashboard

---

**Next Version**: v0.1.9 (Future enhancements - TBD)
