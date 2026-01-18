# ADR-0001: Use Vercel Postgres + Next.js API Routes

## Status
**LOCKED** - This decision is final and will not be changed.

## Context

The 111 Network website MVP requires:
- Simple form to broadcast messages
- Optional simple authentication
- Display broadcasted messages on a world map
- One message per day per user (rate limiting)
- Location data (latitude/longitude) for map pins
- Timestamps for sorting/filtering

The project is deployed on Vercel and uses Next.js 16 with the App Router. We need a backend solution that:
- Integrates seamlessly with Vercel's serverless architecture
- Supports geospatial queries for map functionality
- Provides a free tier suitable for MVP
- Scales with the platform
- Works well with TypeScript

## Decision

**LOCKED DECISION**: Use **Vercel Postgres** as the database and **Next.js API Routes** for the backend.

### Database: Vercel Postgres
- Native Vercel integration with built-in connection pooling
- PostgreSQL with PostGIS support for efficient geospatial queries
- Free tier: 256MB storage, 60 hours compute/month
- Serverless-friendly architecture
- Scales automatically with Vercel

### Backend: Next.js API Routes
- API routes in `app/api/` directory
- Serverless functions that scale automatically
- TypeScript support out of the box
- No additional infrastructure needed

### Database Schema (Planned)
```sql
-- Users (optional auth)
users (
  id UUID PRIMARY KEY,
  identifier TEXT UNIQUE, -- email/username (optional)
  created_at TIMESTAMP
)

-- Public broadcast messages
messages (
  id UUID PRIMARY KEY,
  content TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  user_id UUID REFERENCES users(id), -- nullable for anonymous
  created_at TIMESTAMP DEFAULT NOW()
)

-- Index for geospatial queries
CREATE INDEX idx_messages_location ON messages USING GIST(
  ST_MakePoint(longitude, latitude)
);
```

### API Endpoints (Planned)
- `POST /api/messages` - Submit broadcast message
- `GET /api/messages` - Fetch messages (with location bounds)
- `POST /api/auth` - Optional simple authentication

## Consequences

### Positive
- ✅ Native Vercel integration - no external services to manage
- ✅ PostGIS support for efficient location-based queries
- ✅ Serverless architecture scales automatically
- ✅ Free tier sufficient for MVP development
- ✅ TypeScript-friendly with ORM support (Prisma/Drizzle)
- ✅ No additional infrastructure setup required
- ✅ Built-in connection pooling and optimization

### Negative
- ⚠️ Vercel-specific solution (vendor lock-in)
- ⚠️ Free tier limitations may require upgrade for production scale
- ⚠️ Requires PostGIS extension setup (available in Vercel Postgres)

### Alternatives Considered
- Supabase (PostgreSQL + Auth) - External service, more setup
- PlanetScale (MySQL) - No native PostGIS support
- MongoDB Atlas - Less efficient geospatial queries
- Vercel KV + Blob - Not suitable for complex queries
- Turso (SQLite) - Limited geospatial support

## Implementation Notes

- Use Prisma or Drizzle ORM for database access
- Implement rate limiting using Vercel Edge Config or in-memory (serverless-friendly)
- Optional auth: NextAuth.js or simple JWT implementation
- Geospatial queries using PostGIS functions for map bounds filtering

## Date
2026-01-16

## Decision Maker
Project Lead
