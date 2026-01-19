'use client';

import { useCallback, useMemo, useEffect, useRef } from 'react';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const mapLoadedRef = useRef(false);
  
  const mapStyle = useMemo(
    () => (theme === 'light' ? MAP_CONFIG.styles.light : MAP_CONFIG.styles.dark),
    [theme]
  );

  // #region agent log
  useEffect(() => {
    if (typeof window !== 'undefined' && containerRef.current) {
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      fetch('http://127.0.0.1:7252/ingest/eeb893fd-bd95-466c-90c9-11814a44ceb9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'map-view.tsx:container-check',message:'Map container dimensions',data:{width:rect.width,height:rect.height,visible:rect.width>0&&rect.height>0},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    }
  }, []);
  // #endregion

  // #region agent log
  useEffect(() => {
    if (typeof window !== 'undefined') {
      fetch('http://127.0.0.1:7252/ingest/eeb893fd-bd95-466c-90c9-11814a44ceb9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'map-view.tsx:map-style',message:'Map style URL',data:{style:mapStyle,theme},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    }
  }, [mapStyle, theme]);
  // #endregion

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
    <div ref={containerRef} className="h-full w-full relative">
      <Map
        mapStyle={mapStyle}
        initialViewState={MAP_CONFIG.initialViewState}
        minZoom={MAP_CONFIG.minZoom}
        maxZoom={MAP_CONFIG.maxZoom}
        onMoveEnd={handleMoveEnd}
        onLoad={(event) => {
          // #region agent log
          if (typeof window !== 'undefined') {
            fetch('http://127.0.0.1:7252/ingest/eeb893fd-bd95-466c-90c9-11814a44ceb9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'map-view.tsx:onLoad',message:'Map loaded successfully',data:{target:!!event.target,hasBounds:!!event.target?.getBounds()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
            mapLoadedRef.current = true;
          }
          // #endregion
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
        onError={(error) => {
          // #region agent log
          if (typeof window !== 'undefined') {
            fetch('http://127.0.0.1:7252/ingest/eeb893fd-bd95-466c-90c9-11814a44ceb9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'map-view.tsx:onError',message:'Map error',data:{error:error?.error?.message||String(error)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
          }
          // #endregion
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
