# Architecture Overview

## Current State

- **Monorepo**: Turborepo v2.7.5 configured and operational
- **Database**: Supabase initialized (local dev config ready)
- **Live App**: `apps/website` - Next.js 16 with App Router (deployed on Vercel)
- **Packages**: `packages/` for shared code (database, protocol, ui)
- **Security**: Audit complete, open source ready

## Structure

- **apps/website**: Main Next.js application
- **apps/map**: Map application (upcoming)
- **packages/database**: Database utilities (upcoming)
- **packages/protocol**: Protocol implementation (upcoming)
- **packages/ui**: Shared UI components and design system ✅

## Monorepo Principles

**IMPORTANT**: This is a monorepo with shared UI components.

- **Global UI**: `packages/ui/` - Shared components, styles, design tokens used by ALL apps
- **Local Apps**: `apps/website/`, `apps/map/` - Project-specific code only
- **Rule**: NEVER create duplicate UI components in apps. Always use `@111-network/ui` imports
- **Migration**: Components should be in `packages/ui/src/components/` and exported from `packages/ui/src/index.ts`

## Backend

- **Database**: Supabase (PostgreSQL) - See [ADR-0001](adr/0001-vercel-postgres-nextjs-api-routes.md) for context
- **Local Dev**: Supabase CLI configured in `supabase/` directory
- **API**: Next.js API Routes in `apps/website/app/api/` (when implemented)

## Principles

- Modular, reusable components
- Mobile-first responsive design
- Full TypeScript coverage
- WCAG 2.1 AA accessibility target
