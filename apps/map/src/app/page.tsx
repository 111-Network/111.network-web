'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { Navigation, Footer, GlitchText } from '@111-network/ui';
import { MapView } from '@/components/map/map-view';
import { BroadcastPanel } from '@/components/broadcast/broadcast-panel';
import { useBroadcastPanel } from '@/hooks/use-broadcast-panel';
import { useMapBounds } from '@/hooks/use-map-bounds';

export default function MapPage() {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const { isOpen, openPanel, closePanel } = useBroadcastPanel();
  const { messages, updateBounds, refresh, addMessage } = useMapBounds();

  // Map click disabled - only use broadcast button in header
  // Removed handleMapClick callback

  const handleBoundsChange = useCallback(
    (bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number }) => {
      updateBounds(bounds);
    },
    [updateBounds]
  );

  const handleBroadcastSuccess = useCallback((messageData?: {
    id: string;
    content: string;
    latitude: number;
    longitude: number;
    geo_precision: string;
    created_at: string;
  }) => {
    closePanel();
    setSelectedLocation(null);
    
    // Optimistically add the new message immediately (prevents flicker)
    if (messageData) {
      addMessage({
        id: messageData.id,
        content: messageData.content,
        latitude: messageData.latitude,
        longitude: messageData.longitude,
        geo_precision: messageData.geo_precision as 'exact' | 'approx' | 'region',
        created_at: messageData.created_at,
      });
    }
    
    // Refresh in background to get updated list (with keepExisting=true, won't cause flicker)
    refresh();
  }, [closePanel, refresh, addMessage]);

  return (
    <>
      <Navigation
        logo={
          <Link href="/" className="block font-mono">
            <GlitchText
              className="text-xl font-semibold"
              intensity="medium"
              randomTiming={true}
            >
              111 Network
            </GlitchText>
          </Link>
        }
        items={[
          { label: 'Home', href: 'https://111.network', external: true },
          { label: 'Network', href: 'https://111.network/network', external: true },
          { label: 'About', href: 'https://111.network/about', external: true },
          { label: 'Resources', href: 'https://111.network/resources', external: true },
        ]}
        ctaItems={
          <>
            <button
              onClick={openPanel}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              style={{ minHeight: '2.5rem' }}
            >
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-error pulse-glow flex-shrink-0"></span>
              <span>Broadcast</span>
            </button>
            <a
              href="https://github.com/111-Network"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <GlitchText intensity="low">Get Involved</GlitchText>
            </a>
          </>
        }
      />
      <main className="relative h-screen w-full" style={{ height: 'calc(100vh - 8rem)' }}>
        <MapView
          messages={messages}
          onBoundsChange={handleBoundsChange}
          selectedLocation={selectedLocation}
        />
        <BroadcastPanel
          isOpen={isOpen}
          onClose={closePanel}
          selectedLocation={selectedLocation}
          onLocationChange={setSelectedLocation}
          onSuccess={handleBroadcastSuccess}
        />
      </main>
      <Footer
        copyright={`© ${new Date().getFullYear()} 111 Network. Open Source.`}
        links={[
          { label: 'Terms', href: 'https://111.network/terms', external: true },
        ]}
        showThemeToggle={true}
      >
        <p className="text-sm text-muted-foreground">
          Status: <span className="font-mono text-warning">In Development</span>
        </p>
      </Footer>
    </>
  );
}
