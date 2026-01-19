/**
 * MapLibre configuration for dark and light themes
 */

export const MAP_CONFIG = {
  // Initial view
  initialViewState: {
    latitude: 0,
    longitude: 0,
    zoom: 2,
  },
  // Zoom limits
  minZoom: 1,
  maxZoom: 18,
  // Map styles
  // Using free OpenFreeMap styles (no API key required, no CARTO branding)
  styles: {
    dark: 'https://tiles.openfreemap.org/styles/dark',
    light: 'https://tiles.openfreemap.org/styles/liberty',
  },
} as const;

export type MapStyle = 'dark' | 'light';
