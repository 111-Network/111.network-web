# Map UI/UX Specification

## Overview

The map application (`apps/map`) provides an interactive interface for viewing and creating broadcast messages on a global map using MapLibre GL.

## User Interface

### Layout

- **Header**: Navigation bar with logo, menu items, and CTA buttons (matches website app)
- **Map View**: Full-screen interactive map (MapLibre GL)
- **Broadcast Panel**: Slide-out panel for creating messages
- **Footer**: Copyright, links, and theme toggle (matches website app)

### Map Component

- **Library**: MapLibre GL JS with react-map-gl wrapper
- **Default Style**: Dark mode (matches project default)
- **Light Mode**: Available via theme toggle
- **Initial View**: World view (lat: 0, lng: 0, zoom: 2)
- **Zoom Limits**: Min 1, Max 18
- **Interactions**: Click to set location, drag to pan, scroll to zoom

### Message Markers

- **Color**: Red (error color from design tokens)
- **Style**: Circular marker with white border
- **Behavior**: Click to show popup with message content
- **Popup Content**: Message text, timestamp, geo precision

### Broadcast Panel

**Desktop**:
- Slides from right side
- Width: 40% of viewport (max 400px)
- Glassmorphism effect (backdrop blur, semi-transparent)
- Border on left side

**Mobile**:
- Slides from bottom
- Height: 70% of viewport (max 600px)
- Full width
- Rounded top corners
- Backdrop overlay

**Features**:
- URL hash sync (`#broadcast` opens panel)
- Keyboard support (Escape to close)
- Smooth animations (300ms)
- Prevents body scroll when open

### Broadcast Form

**Fields**:
1. **Message** (required)
   - Textarea, max 240 characters
   - Character counter
   - Real-time validation

2. **Location** (required)
   - Latitude input (-90 to 90)
   - Longitude input (-180 to 180)
   - Can be set by clicking map or entering manually
   - Visual feedback on map (pulsing marker)

3. **Geo Precision** (required)
   - Options: exact, approx, region
   - Currently only "region" is available
   - Other options greyed out with lock icon
   - Default: "region"

**Submit Button**:
- Text: "Broadcast Now"
- Loading state: "Broadcasting..."
- Disabled when form invalid or loading

**Error Handling**:
- Validation errors shown inline
- Rate limit errors with remaining count
- Network errors with retry option
- Success message with remaining posts

## User Flows

### Creating a Message

1. User clicks "Broadcast" button in header
2. Panel slides in (or navigates to `#broadcast`)
3. User clicks on map to set location (optional)
4. User types message (max 240 chars)
5. User selects geo precision (default: region)
6. User clicks "Broadcast Now"
7. On success: Panel closes, map refreshes, success message shown
8. On error: Error message displayed, form remains open

### Viewing Messages

1. Map loads with initial view
2. Messages fetched for visible bounds
3. Markers displayed on map
4. User can click markers to see message details
5. User can pan/zoom to see different areas
6. Messages auto-refresh when bounds change (debounced 500ms)

## Responsive Design

### Desktop (>768px)
- Panel slides from right
- Map takes full viewport height
- Header and footer visible

### Mobile (<768px)
- Panel slides from bottom
- Map takes full viewport height
- Touch-friendly controls
- Swipe gestures (future enhancement)

## Accessibility

- Keyboard navigation support
- ARIA labels on interactive elements
- Focus management when panel opens/closes
- Screen reader support for markers
- High contrast mode support

## Performance

- Map bounds updates debounced (500ms)
- Message markers limited to 200 visible
- Lazy loading for map component
- Device ID cached in localStorage
- API calls debounced on map movement

## Future Enhancements

- Marker clustering for dense areas
- Location autocomplete/suggestions
- Swipe to close panel on mobile
- Real-time updates (WebSocket)
- Advanced geospatial queries (PostGIS)
- Custom map styles
