# UI Migration to Global Design System

## Summary

Successfully migrated shared UI components from `apps/website` to `packages/ui` for reuse across all apps in the monorepo.

## Migration Status: ✅ Complete

All shared components have been migrated:
- ✅ ThemeProvider, Container, Button, ThemeToggle
- ✅ Navigation, Footer
- ✅ Design tokens, Tailwind preset, utilities

## Key Principles

- **Global UI**: `packages/ui/` - Shared components used by ALL apps
- **Local Apps**: `apps/website/`, `apps/map/` - Project-specific code only
- **Rule**: NEVER create duplicate UI components in apps. Always use `@111-network/ui` imports
- **Migration Strategy**: Copy first, switch imports, verify, then delete

## Current Structure

```
packages/ui/
├── src/
│   ├── components/
│   │   ├── ui/          # shadcn/ui components
│   │   └── layout/      # Navigation, Footer, Container, etc.
│   ├── lib/utils.ts     # Utilities (cn function)
│   └── styles/          # Design tokens & base styles
└── tailwind-preset.ts   # Shared Tailwind config
```

## Usage

```tsx
import { Navigation, Footer, Container, Button } from "@111-network/ui";
```

## App-Specific Components

These remain in `apps/website/components/`:
- `glitch-text.tsx`, `animated-section.tsx`, `typewriter-text.tsx`
- `section.tsx`, `terms-banner.tsx`
- `magicui/*` components

See `packages/ui/README.md` for detailed component documentation.
