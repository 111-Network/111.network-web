# Architecture Overview

## System Architecture

The 111 Network website is a frontend-focused application built with Next.js, designed to be clean, modular, and maintainable.

## High-Level Structure

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│  (Next.js Pages, React Components)  │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         Application Layer            │
│  (Business Logic, State Management)  │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│          Data Layer                  │
│  (API Clients, Data Fetching)       │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      External Services               │
│  (Maps, Auth, Database - TBD)       │
└─────────────────────────────────────┘
```

## Key Principles

1. **Modular Components**: Reusable, composable React components
2. **Responsive Design**: Mobile-first approach with Tailwind CSS
3. **Accessibility**: WCAG 2.1 AA compliance target
4. **Performance**: Optimized loading, code splitting, and image optimization
5. **Type Safety**: Full TypeScript coverage

## MVP Features

### Home Page
- Simple "Coming Soon" landing page
- Project vision and mission
- Key features overview
- Call-to-action for contributors

### Contribute Page
- How to get involved
- Development setup guide
- Contribution opportunities
- Links to GitHub and discussions

### Blog
- Content management for updates
- Markdown-based posts (implementation TBD)
- Admin interface for content (lightweight, implementation TBD)

### Public Documentation
- Public-facing documentation
- API documentation (when ready)
- Protocol specifications (when ready)

## Backend Architecture

**LOCKED DECISION**: Vercel Postgres + Next.js API Routes

- **Database**: Vercel Postgres (PostgreSQL with PostGIS)
- **Backend**: Next.js API Routes in `app/api/`
- See [ADR-0001](adr/0001-vercel-postgres-nextjs-api-routes.md) for full details

## Future Integration Points

As the project evolves, this website will integrate with:
- Core protocol implementation (separate repository)
- Shared types (separate repository)
- Map services for world map feature
- Authentication system (TBD - optional for MVP)
- Message storage and retrieval via Vercel Postgres

All integration decisions will be documented in Architecture Decision Records (ADRs) in `docs/adr/`.
