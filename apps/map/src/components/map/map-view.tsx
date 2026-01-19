'use client';

import { useCallback, useMemo } from 'react';
import Map, { Marker, AttributionControl, ViewStateChangeEvent } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useTheme } from 'next-themes';
import { MAP_CONFIG } from '@/lib/map-config';
import type { BroadcastMessage } from '@/hooks/use-map-bounds';
import { MessageMarker } from './message-marker';

interface MapViewProps {
  messages: BroadcastMessage[];
  onBoundsChange?: (bounds: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  }) => void;
  selectedLocation?: { lat: number; lng: number } | null;
}

export function MapView({
  messages,
  onBoundsChange,
  selectedLocation,
}: MapViewProps) {
  const { theme } = useTheme();
  const mapStyle = useMemo(
    () => (theme === 'light' ? MAP_CONFIG.styles.light : MAP_CONFIG.styles.dark),
    [theme]
  );

  // Map click disabled - removed handleMapClick

  const handleMoveEnd = useCallback(
    (event: ViewStateChangeEvent) => {
      if (onBoundsChange) {
        const bounds = event.target.getBounds();
        onBoundsChange({
          minLat: bounds.getSouth(),
          maxLat: bounds.getNorth(),
          minLng: bounds.getWest(),
          maxLng: bounds.getEast(),
        });
      }
    },
    [onBoundsChange]
  );

  return (
    <div className="h-full w-full relative">
      <Map
        mapStyle={mapStyle}
        initialViewState={MAP_CONFIG.initialViewState}
        minZoom={MAP_CONFIG.minZoom}
        maxZoom={MAP_CONFIG.maxZoom}
        onMoveEnd={handleMoveEnd}
        onLoad={(event) => {
          // Trigger bounds change on initial load to fetch messages
          if (onBoundsChange) {
            const bounds = event.target.getBounds();
            onBoundsChange({
              minLat: bounds.getSouth(),
              maxLat: bounds.getNorth(),
              minLng: bounds.getWest(),
              maxLng: bounds.getEast(),
            });
          }
        }}
        style={{ width: '100%', height: '100%' }}
        cursor="default"
        attributionControl={false}
      >
        {/* Attribution control with collapsed "i" button */}
        <AttributionControl
          compact={true}
          position="bottom-left"
        />

        {/* Selected location marker (temporary) */}
        {selectedLocation && (
          <Marker
            longitude={selectedLocation.lng}
            latitude={selectedLocation.lat}
            anchor="center"
          >
            <div className="w-4 h-4 bg-primary rounded-full border-2 border-background shadow-lg animate-pulse" />
          </Marker>
        )}

        {/* Message markers */}
        {messages.map((message) => (
          <MessageMarker key={message.id} message={message} />
        ))}
      </Map>
    </div>
  );
}
