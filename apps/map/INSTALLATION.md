# Installation Instructions

## Quick Start

### 1. Install Dependencies

**Important**: Run from the **monorepo root** (`111-network-web/`), not from `apps/map/`:

```bash
cd /path/to/111-network-web
pnpm install
```

This installs all dependencies including:
- MapLibre GL JS (`maplibre-gl`)
- React Map GL (`react-map-gl`)
- Testing libraries (Jest, React Testing Library)
- Shared UI package (`@111-network/ui`)

### 2. Set Up Environment Variables

Copy the environment template and fill in your Supabase credentials:

```bash
cd apps/map
# Copy ENV.md content to .env.local
# Or manually create .env.local with the variables from ENV.md
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `BROADCAST_RATE_LIMIT_PER_24H` (optional, default: 20)

### 3. Run Database Migrations

From the monorepo root:

```bash
supabase migration up
```

Or if using Supabase CLI locally:

```bash
supabase db push
```

### 4. Start Development Server

From `apps/map/` directory:

```bash
cd apps/map
pnpm dev
```

Or from monorepo root (runs all apps):

```bash
pnpm dev
```

The app will be available at `http://localhost:3000` (or next available port).

## Troubleshooting

### Map Not Loading

- Ensure MapLibre CSS is imported (already in `map-view.tsx`)
- Check browser console for errors
- Verify MapLibre styles are accessible (CartoCDN styles are used)

### API Errors

- Verify environment variables are set correctly
- Check Supabase connection
- Run `pnpm verify-backend` to test API endpoints

### Build Errors

- Run `pnpm install` from monorepo root
- Clear `.next` cache: `rm -rf apps/map/.next`
- Rebuild: `pnpm build`

## Testing

Run tests from `apps/map/`:

```bash
cd apps/map
pnpm test              # Run all tests
pnpm test:watch        # Watch mode
pnpm test:coverage     # Coverage report
```
