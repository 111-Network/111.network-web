# Development Setup

## Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Git
- Code editor (VS Code recommended, Cursor supported)

## Initial Setup

1. Clone the repository (if not already cloned)
2. Navigate to the repository directory
3. Install dependencies: `npm install` (or `yarn install` / `pnpm install`) from root
4. Navigate to `apps/website` for the main application
5. Copy environment variables template (if provided) to `apps/website/.env.local`
6. Run development server: `npm run dev` from `apps/website/` or root (when Turborepo is configured)

## Environment Variables

Environment variables will be documented here once they are defined. Common variables may include:
- API endpoints
- Map provider API keys
- Database connection strings
- Authentication secrets

**Security**: Never commit `.env` files. Use `.env.local` for local development (already in `.gitignore`).

## Development Server

The development server runs on `http://localhost:3000` by default.

## Monorepo Structure

This is a Turborepo monorepo (setup upcoming):

- **apps/website**: Main Next.js application (currently live)
- **packages/**: Shared packages (database, protocol, ui)
- Root `package.json`: Monorepo configuration and versioning (v0.1.3)

## Common Commands

From `apps/website/`:
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run linter

From root:
- `pnpm dev` - Run dev for all apps
- `pnpm build` - Build all apps
- `pnpm lockfile:check` - Verify lockfile is in sync (use before committing)
- `pnpm lockfile:fix` - Regenerate lockfile if out of sync

## Troubleshooting

Common issues and solutions will be documented here as they arise.

## Security & Safety

### Environment Security
- **Never commit secrets**: `.env.local` is gitignored - never commit environment files
- **Use secure defaults**: All configurations should use secure defaults
- **Dependency security**: Run `npm audit` regularly, update dependencies promptly
- **Secrets management**: Use environment variables for all sensitive data

### Development Safety
- **Public code assumption**: All code is public - no secrets, credentials, or API keys in code
- **Input validation**: Validate all external inputs and user data
- **Secure practices**: Follow secure coding practices and review security considerations
