# Architecture Overview

## Current State

- **Monorepo**: Turborepo v2.7.5 configured and operational
- **Database**: Supabase initialized (local dev config ready)
- **Live App**: `apps/website` - Next.js 16 with App Router (deployed on Vercel)
- **Packages**: `packages/` for shared code (database, protocol, ui)
- **Security**: Audit complete, open source ready

## Structure

- **apps/website**: Main Next.js application
- **apps/map**: Map application with interactive MapLibre map and broadcast panel ✅
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
- **API**: Next.js API Routes in `apps/map/src/app/api/broadcast/` ✅
  - POST `/api/broadcast` - Create broadcast messages with rate limiting
  - GET `/api/broadcast` - Fetch messages with bounding box filtering
- **Migrations**: Supabase migrations in `supabase/migrations/` ✅
- **Rate Limiting**: 20 posts per 24h per device (configurable)
- **Security**: RLS policies, input validation, IP hashing

## Frontend (Map App)

- **Map Library**: MapLibre GL JS with react-map-gl ✅
- **UI Components**: Shared components from `@111-network/ui` package ✅
- **Broadcast Panel**: Slide-out panel with glassmorphism effect ✅
- **Message Markers**: Red markers on map showing broadcast locations ✅
- **Theme Support**: Dark mode default, light mode toggle ✅
- **Responsive Design**: Mobile-friendly with bottom sheet on mobile ✅
- **Testing**: Jest + React Testing Library setup ✅

## Principles

- Modular, reusable components
- Mobile-first responsive design
- Full TypeScript coverage
- WCAG 2.1 AA accessibility target
