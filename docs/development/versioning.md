# Versioning Strategy

## Current Version

**v0.1.6** (Pre-MVP)

## Version Format

Follows [Semantic Versioning](https://semver.org/): `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes
- **MINOR**: New features, backwards compatible
- **PATCH**: Bug fixes, backwards compatible

## Pre-MVP Phase

Currently in **Pre-MVP** phase:
- Version range: `0.1.x` - `0.9.x`
- Focus: Infrastructure setup, architecture decisions
- Status: Foundation complete (Turborepo, Supabase, security)

## Version Tracking

- **Root `package.json`**: Source of truth for repository version
- **Apps**: May have independent versions in their `package.json` files
- **Documentation**: Updated in `docs/README.md` and `docs/development/README.md`

## Version History

- **v0.1.6** (2026-01-19): Bug fixes - Fixed rate limiting errors, message flicker, TypeScript build errors, added Supabase CLI
- **v0.1.5** (2026-01-19): Map UI MVP - Interactive MapLibre map, broadcast panel, message markers, full frontend implementation
- **v0.1.4** (2026-01-19): Backend MVP - Broadcast API with rate limiting, database schema, RLS policies
- **v0.1.3** (2026-01-16): UI migration complete, header/footer fixes, documentation cleanup
- **v0.1.2** (2026-01-16): Turborepo configured, Supabase initialized, security audit complete
- **v0.1.1** (2026-01-16): Turborepo monorepo setup with pnpm workspaces
- **v0.1.0** (2026-01-16): Initial versioning, monorepo structure, documentation refactor

## Bumping Versions

1. Update root `package.json` version
2. Update `docs/README.md` version reference
3. Update `docs/development/README.md` version reference
4. Update this file's version history
5. Commit with version bump message

## MVP Phase

When MVP is reached:
- Version: `1.0.0`
- Stable API surface
- Production-ready features
- Full documentation
