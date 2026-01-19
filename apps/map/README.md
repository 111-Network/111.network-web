# 111 Network - Map Application

Map application for displaying and creating broadcast messages on a global map.

## Status

**Backend MVP**: ✅ Complete  
**Frontend UI**: 🚧 Coming soon

## Features

- **Broadcast API**: Create and fetch anonymous broadcast messages
- **Rate Limiting**: 20 posts per 24 hours per device (configurable)
- **Geospatial Queries**: Bounding box filtering for map views
- **Security**: Row Level Security (RLS), input validation, IP hashing

## Tech Stack

- **Framework**: Next.js 16.1.3 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4

## Setup

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

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
│   │   └── api/
│   │       └── broadcast/
│   │           └── route.ts          # API endpoints
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── server.ts            # Server-only client (service role)
│   │   │   └── client.ts            # Browser client (anon key)
│   │   ├── types/
│   │   │   └── database.ts          # Database types
│   │   └── validation.ts           # Input validation utilities
│   └── scripts/
│       └── verify-backend.ts        # Backend verification script
├── ENV.md                           # Environment variables documentation
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

## Future Enhancements

- Frontend UI for map visualization
- User authentication (optional)
- Moderation workflow
- Advanced geospatial queries (PostGIS)
- Private messaging
