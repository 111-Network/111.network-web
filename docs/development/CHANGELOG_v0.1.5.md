# Changelog - v0.1.5

**Release Date**: 2026-01-19  
**Type**: Minor Release (New Feature)

## Summary

Map UI MVP implementation for the 111 Network broadcast system. This release adds the complete frontend interface with interactive MapLibre map, broadcast panel, message markers, and full user experience for viewing and creating broadcast messages.

## New Features

### Map Interface

- **Interactive MapLibre GL Map**: Full-screen interactive map with dark/light mode support
  - Dark mode default (CartoCDN dark style)
  - Light mode via theme toggle (CartoCDN light style)
  - Click to set location for broadcasts
  - Pan and zoom controls
  - Responsive design

- **Message Markers**: Red markers on map showing broadcast locations
  - Click markers to view message details in popup
  - Shows message content, timestamp, and geo precision
  - Visual feedback with animations

- **Broadcast Panel**: Slide-out panel for creating messages
  - Desktop: Slides from right (40% width)
  - Mobile: Slides from bottom (70% height)
  - Glassmorphism effect with backdrop blur
  - URL hash sync (`#broadcast`)
  - Keyboard support (Escape to close)
  - Smooth animations

- **Broadcast Form**: Complete form with validation
  - Message textarea (240 character limit with counter)
  - Location inputs (latitude/longitude with validation)
  - Map click to set location
  - Geo precision selector (region only, others locked)
  - Character counter with warning at 20 chars remaining
  - Submit button with loading state
  - Error/success message display
  - Rate limit display (remaining posts)

### Navigation & Layout

- **Header**: Navigation matching website app
  - Logo with GlitchText effect
  - Menu items (Home, Network, About, Resources)
  - Broadcast button (highlighted with pulse animation)
  - Get Involved button

- **Footer**: Footer matching website app
  - Copyright notice
  - Terms link
  - Theme toggle
  - Status indicator

### Hooks & State Management

- **use-device-id**: Device ID generation and storage
  - Web Crypto API for secure generation
  - localStorage with sessionStorage fallback
  - Persistent across sessions

- **use-broadcast**: API integration hook
  - POST /api/broadcast integration
  - Error handling (rate limits, validation)
  - Loading states
  - Success callbacks

- **use-map-bounds**: Map viewport tracking
  - Debounced bounds updates (500ms)
  - Automatic message fetching on bounds change
  - GET /api/broadcast integration

- **use-broadcast-panel**: Panel state management
  - URL hash synchronization
  - Open/close state
  - Mobile/desktop detection

### Testing Infrastructure

- **Jest Configuration**: Complete test setup
  - Next.js Jest preset
  - React Testing Library integration
  - Module path mapping
  - Test scripts (test, test:watch, test:coverage)

- **Test Files**:
  - `use-device-id.test.ts` - Device ID generation tests
  - `map-config.test.ts` - Map configuration tests
  - `broadcast-form.test.tsx` - Form validation tests

### Deployment

- **Vercel Configuration**: `vercel.json` added
  - Build settings configured
  - Framework detection
  - Region settings

## Dependencies

### Added
- `maplibre-gl`: ^3.6.2 (MapLibre GL JS)
- `react-map-gl`: ^7.1.7 (React wrapper for MapLibre)
- `lucide-react`: ^0.469.0 (Icons)
- `next-themes`: ^0.4.4 (Theme management)
- `@testing-library/react`: ^16.0.1 (Component testing)
- `@testing-library/jest-dom`: ^6.1.5 (DOM matchers)
- `@testing-library/user-event`: ^14.5.1 (User interaction simulation)
- `@testing-library/dom`: ^10.4.0 (DOM utilities)
- `jest`: ^29.7.0 (Test runner)
- `jest-environment-jsdom`: ^29.7.0 (DOM environment)
- `@types/maplibre-gl`: ^1.14.0 (TypeScript types)
- `@types/jest`: ^29.5.11 (Jest types)

## Documentation

### New Documentation
- `apps/map/README.md` - Complete map app documentation
- `apps/map/INSTALLATION.md` - Installation instructions
- `apps/map/IMPLEMENTATION_SUMMARY.md` - Implementation overview
- `docs/specs/map-ui.md` - Map UI/UX specification

### Updated Documentation
- `docs/architecture.md` - Added frontend section
- `docs/development/testing.md` - Added test setup instructions
- `docs/README.md` - Updated status
- `docs/development/README.md` - Updated version

## Files Changed

### New Files
- `apps/map/src/app/page.tsx` - Main map page
- `apps/map/src/components/map/map-view.tsx` - MapLibre map component
- `apps/map/src/components/map/message-marker.tsx` - Message marker component
- `apps/map/src/components/broadcast/broadcast-panel.tsx` - Slide-out panel
- `apps/map/src/components/broadcast/broadcast-form.tsx` - Broadcast form
- `apps/map/src/hooks/use-device-id.ts` - Device ID hook
- `apps/map/src/hooks/use-broadcast.ts` - API integration hook
- `apps/map/src/hooks/use-map-bounds.ts` - Map bounds hook
- `apps/map/src/hooks/use-broadcast-panel.ts` - Panel state hook
- `apps/map/src/lib/map-config.ts` - MapLibre configuration
- `apps/map/jest.config.js` - Jest configuration
- `apps/map/jest.setup.js` - Test setup
- `apps/map/vercel.json` - Vercel deployment config
- `apps/map/src/hooks/__tests__/use-device-id.test.ts` - Device ID tests
- `apps/map/src/lib/__tests__/map-config.test.ts` - Map config tests
- `apps/map/src/components/broadcast/__tests__/broadcast-form.test.tsx` - Form tests

### Modified Files
- `apps/map/src/app/layout.tsx` - Added ThemeProvider, updated metadata
- `apps/map/package.json` - Added dependencies and test scripts
- `apps/map/next.config.ts` - Added webpack config for MapLibre
- `apps/map/src/lib/types/database.ts` - Added GeoPrecision type export

### Deleted Files
- `apps/map/public/next.svg`
- `apps/map/public/vercel.svg`
- `apps/map/public/file.svg`
- `apps/map/public/globe.svg`
- `apps/map/public/window.svg`

## Breaking Changes

None - This is a new feature addition.

## Known Limitations

- Only "region" geo precision available (exact/approx locked)
- No location autocomplete/suggestions
- No marker clustering (future enhancement)
- No real-time updates (polling-based)

## Future Enhancements

- Location autocomplete/suggestions
- Marker clustering for dense areas
- Swipe to close panel on mobile
- Real-time updates (WebSocket)
- Advanced geospatial queries (PostGIS)
- Custom map styles
- User authentication (optional)
- Moderation workflow

## Testing

Run tests with:
```bash
cd apps/map
pnpm test              # Run all tests
pnpm test:watch        # Watch mode
pnpm test:coverage     # Coverage report
```

## Installation

**Important**: Install dependencies from monorepo root:
```bash
cd /path/to/111-network-web
pnpm install
```

## Contributors

- AI Agent (Auto) - Map UI implementation and documentation

---

**Next Version**: v0.1.6 (Future enhancements - TBD)
