# Development Documentation

This directory contains guides and documentation for developers working on the 111 Network web monorepo.

**Version**: v0.1.4 (Pre-MVP)  
**Monorepo**: Turborepo v2.7.5 configured, Backend MVP complete with broadcast API

## Available Guides

- `setup.md` - Local development environment setup
- `contributing.md` - Development workflow and contribution guidelines
- `testing.md` - Testing strategy and guidelines

## Quick Start

1. Read `setup.md` for environment setup
2. Read `contributing.md` for development workflow
3. Review `../specs/` for feature specifications
4. Check `../adr/` for architectural decisions

## Troubleshooting

### Globe Component Not Rendering
**Issue**: Globe component showed CSS rings instead of 3D globe with red dots.  
**Fix**: Replaced CSS-based implementation with `cobe` WebGL library. The Globe component now uses `createGlobe()` from `cobe` package to render a 3D rotating globe with markers. Ensure `cobe` is installed and the component has proper container dimensions.

### Animation Classes Not Working (Tailwind v4)
**Issue**: Custom animation classes (`animate-spin-slow`, `animate-spin-reverse`, `animate-pulse`) defined in `@layer base` were not applying.  
**Fix**: Moved animation classes to `@layer utilities` for proper specificity in Tailwind v4. Custom keyframes must be defined in `@layer base`, but the animation utility classes should be in `@layer utilities`.

### Meteor Animation Keyframes Missing
**Issue**: `meteor-fall` animation not working with inline styles.  
**Fix**: Added `@keyframes meteor-fall` to `@layer base` in `globals.css`. In Tailwind v4, keyframes used in inline styles must be defined in CSS, not just in `tailwind.config.ts`.

## Security Overview

### Core Security Principles
- **No secrets in code**: All sensitive data via environment variables
- **Public code assumption**: Assume all code is visible - design accordingly
- **Secure defaults**: Use secure configurations by default
- **Dependency security**: Regular audits and updates
- **Input validation**: Always validate and sanitize inputs

### Safe Development Practices
- Review dependencies before adding
- Use lock files (`package-lock.json`) for reproducible builds
- Regular security audits (`npm audit`)
- Security-focused code reviews
- Document security considerations in code