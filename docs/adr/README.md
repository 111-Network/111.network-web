# Architecture Decision Records

This directory contains Architecture Decision Records (ADRs) documenting significant architectural decisions made during the development of the 111 Network website.

## What is an ADR?

An Architecture Decision Record is a document that captures an important architectural decision made along with its context and consequences. ADRs help:

- Understand why certain decisions were made
- Track the evolution of the architecture
- Onboard new developers
- Guide AI agents in understanding project constraints

## ADR Format

Each ADR follows this structure:

### Title
Short descriptive title (e.g., "ADR-0001: Use Next.js App Router")

### Status
- **Proposed** - Decision is being considered
- **Accepted** - Decision has been made and implemented
- **Deprecated** - Decision has been superseded
- **Superseded** - Replaced by another ADR

### Context
What is the issue we're addressing? What are the constraints and requirements?

### Decision
What decision was made? What are the key points?

### Consequences
What are the positive and negative consequences of this decision?

## Current ADRs

- [ADR-0001: Use Vercel Postgres + Next.js API Routes](0001-vercel-postgres-nextjs-api-routes.md) - **LOCKED** - Database and backend architecture decision

## Creating a New ADR

1. Number sequentially (0001, 0002, etc.)
2. Use descriptive filename: `0001-nextjs-app-router.md`
3. Follow the ADR format above
4. Update this README to list the new ADR

## Example ADRs to Create

- ADR-0001: Use Next.js App Router
- ADR-0002: Use shadcn/ui component library
- ADR-0003: Blog/content management approach
- ADR-0004: Map provider selection
- ADR-0005: Authentication strategy
- ADR-0006: Database choice
- ADR-0007: API design approach
