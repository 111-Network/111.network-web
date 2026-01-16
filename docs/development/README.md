# Development Documentation

This directory contains guides and documentation for developers working on the 111 Network website.

## Available Guides

- `setup.md` - Local development environment setup
- `contributing.md` - Development workflow and contribution guidelines
- `testing.md` - Testing strategy and guidelines

## Quick Start

1. Read `setup.md` for environment setup
2. Read `contributing.md` for development workflow
3. Review `../specs/` for feature specifications
4. Check `../adr/` for architectural decisions

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