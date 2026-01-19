# 111 Network - Map Application

Map application for displaying and creating broadcast messages on a global map.

## Status

**Backend MVP**: ✅ Complete  
**Frontend UI**: ✅ Complete

## Features

- **Interactive Map**: MapLibre GL map with dark/light mode support
- **Broadcast Panel**: Slide-out panel for creating messages
- **Message Markers**: Red markers showing broadcast locations
- **Broadcast API**: Create and fetch anonymous broadcast messages
- **Rate Limiting**: 20 posts per 24 hours per device (configurable)
- **Geospatial Queries**: Bounding box filtering for map views
- **Security**: Row Level Security (RLS), input validation, IP hashing
- **Responsive Design**: Mobile-friendly with bottom sheet panel

## Tech Stack

- **Framework**: Next.js 16.1.3 (App Router)
- **Map Library**: MapLibre GL JS with react-map-gl
- **Database**: Supabase (PostgreSQL)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Testing**: Jest + React Testing Library

## Setup

1. **Install dependencies** (from project root):
   ```bash
   # From monorepo root
   pnpm install
   ```
   
   **Important**: Run `pnpm install` from the monorepo root (`111-network-web/`) to install all dependencies including MapLibre GL and testing libraries. This ensures workspace dependencies are properly linked.

2. **Set up environment variables**:
   - Copy `ENV.md` to `.env.local`
   - Fill in your Supabase credentials (see `ENV.md` for details)

3. **Run database migrations**:
   ```bash
   supabase migration up
   ```

4. **Start development server**:
   ```bash
   pnpm dev
   ```

## API Endpoints

See [API Endpoints Documentation](../../docs/specs/api-endpoints.md) for complete API documentation.

### Quick Examples

**Create a message**:
```bash
curl -X POST http://localhost:3000/api/broadcast \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Hello from San Francisco!",
    "latitude": 37.7749,
    "longitude": -122.4194,
    "device_public_key": "device-key-123"
  }'
```

**Fetch messages**:
```bash
curl "http://localhost:3000/api/broadcast?bbox=37.0,38.0,-123.0,-122.0"
```

## Project Structure

```
apps/map/
├── src/
│   ├── app/
│   │   ├── layout.tsx               # Root layout with ThemeProvider
│   │   ├── page.tsx                 # Main map page
│   │   └── api/
│   │       └── broadcast/
│   │           └── route.ts         # API endpoints
│   ├── components/
│   │   ├── map/
│   │   │   ├── map-view.tsx         # Main MapLibre map component
│   │   │   └── message-marker.tsx   # Message marker component
│   │   └── broadcast/
│   │       ├── broadcast-panel.tsx  # Slide-out panel
│   │       └── broadcast-form.tsx   # Broadcast form
│   ├── hooks/
│   │   ├── use-broadcast.ts         # API integration hook
│   │   ├── use-map-bounds.ts        # Map bounds tracking
│   │   ├── use-device-id.ts         # Device ID management
│   │   └── use-broadcast-panel.ts   # Panel state management
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── server.ts            # Server-only client (service role)
│   │   │   └── client.ts            # Browser client (anon key)
│   │   ├── types/
│   │   │   └── database.ts          # Database types
│   │   ├── validation.ts           # Input validation utilities
│   │   └── map-config.ts           # MapLibre configuration
│   └── scripts/
│       └── verify-backend.ts        # Backend verification script
├── ENV.md                           # Environment variables documentation
├── vercel.json                      # Vercel deployment config
├── jest.config.js                   # Jest configuration
└── package.json
```

## Verification

Run the verification script to test RLS policies and API functionality:

```bash
pnpm verify-backend
```

## Environment Variables

See `ENV.md` for required environment variables and security notes.

**Important**: Never commit `.env.local` or expose `SUPABASE_SERVICE_ROLE_KEY` to the client.

## Database Schema

The database schema is defined in Supabase migrations:
- `supabase/migrations/20260119154740_create_broadcast_tables.sql`

Key tables:
- `broadcast_messages`: Public broadcast messages
- `anonymous_devices`: Device tracking for rate limiting
- `profiles`: User profiles (optional, for future auth)

## Security

- ✅ Row Level Security (RLS) policies enabled
- ✅ Input validation and sanitization
- ✅ IP address hashing for privacy
- ✅ Device identifier hashing
- ✅ Service role key never exposed to client
- ✅ Rate limiting per device and IP

## Development

- **Linting**: `pnpm lint`
- **Build**: `pnpm build`
- **Start**: `pnpm start`
- **Testing**: `pnpm test` or `pnpm test:watch`

## Usage

1. **View Map**: Open the app to see broadcast messages on the map
2. **Create Message**: Click "Broadcast" button or click on the map
3. **Set Location**: Click on the map to set location, or enter coordinates manually
4. **Submit**: Fill in message (max 240 chars) and click "Broadcast Now"

## Testing

Run tests with:
```bash
pnpm test              # Run all tests
pnpm test:watch        # Watch mode
pnpm test:coverage     # Coverage report
```

## Deployment

The app is configured for Vercel deployment. See `vercel.json` for configuration.

**Required Environment Variables** (set in Vercel dashboard):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `BROADCAST_RATE_LIMIT_PER_24H` (optional, default: 20)

## Future Enhancements

- User authentication (optional)
- Moderation workflow
- Advanced geospatial queries (PostGIS)
- Marker clustering for dense areas
- Private messaging
