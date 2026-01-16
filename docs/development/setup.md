# Development Setup

## Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Git
- Code editor (VS Code recommended, Cursor supported)

## Initial Setup

1. Clone the repository (if not already cloned)
2. Navigate to the repository directory
3. Install dependencies: `npm install` (or `yarn install` / `pnpm install`)
4. Copy environment variables template (if provided)
5. Run development server: `npm run dev`

## Environment Variables

Environment variables will be documented here once they are defined. Common variables may include:
- API endpoints
- Map provider API keys
- Database connection strings
- Authentication secrets

**Security**: Never commit `.env` files. Use `.env.local` for local development (already in `.gitignore`).

## Development Server

The development server runs on `http://localhost:3000` by default.

## Multi-Repository Workspace (Cursor)

If working with multiple repositories in Cursor:

1. Open the parent folder (`~/dev/111-network/`) in Cursor
2. Cursor will detect all subfolders as separate repositories
3. Each repository maintains its own dependencies and configuration
4. Be aware of which repository you're working in (check the file path)

## Common Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run linter
- `npm run type-check` - Run TypeScript type checking

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
