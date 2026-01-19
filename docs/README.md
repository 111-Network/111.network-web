# 111 Network Web - Documentation

**Version**: v0.1.6 (Pre-MVP)  
**Status**: Map UI MVP complete - Interactive MapLibre map with broadcast panel and full frontend

## Current State

- **Monorepo Structure**: Turborepo v2.7.5 configured and operational
- **Live App**: `apps/website` - Next.js 16 application (deployed on Vercel)
- **Packages**: `packages/` directory structure in place (database, protocol, ui)
- **Database**: Supabase with migrations, RLS policies, and broadcast API ✅
- **Map App**: Interactive MapLibre map with broadcast panel ✅
- **Build System**: Turborepo configured with pnpm workspaces
- **Security**: Audit complete, ready for public open source
- **Node**: v24.13.0

## Structure

```
111-network-web/
├── apps/
│   └── website/          # Main Next.js application (live)
├── packages/
│   ├── database/         # Database utilities (upcoming)
│   ├── protocol/         # Protocol implementation (upcoming)
│   └── ui/               # Shared UI components ✅
└── docs/                  # Documentation
```

## Documentation

- **Development**: Setup, contributing, testing guides
- **Specs**: Feature specifications (spec-driven development)
- **ADR**: Architecture Decision Records
- **Architecture**: High-level system architecture

## Important Notes

- Main `README.md` in root should not be modified by AI agents
- All development docs are in `docs/`
- Version is tracked in root `package.json`
