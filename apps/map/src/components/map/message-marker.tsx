'use client';

import { useState } from 'react';
import { Marker, Popup } from 'react-map-gl/maplibre';
import type { BroadcastMessage } from '@/hooks/use-map-bounds';

interface MessageMarkerProps {
  message: BroadcastMessage;
}

export function MessageMarker({ message }: MessageMarkerProps) {
  const [showPopup, setShowPopup] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <>
      <Marker
        longitude={message.longitude}
        latitude={message.latitude}
        anchor="bottom"
        onClick={(e) => {
          e.originalEvent.stopPropagation();
          setShowPopup(true);
        }}
      >
        <div className="cursor-pointer">
          <div
            className="w-6 h-6 bg-error rounded-full border-2 border-background shadow-lg flex items-center justify-center"
            style={{
              backgroundColor: 'hsl(var(--error))',
            }}
          >
            <div className="w-2 h-2 bg-background rounded-full" />
          </div>
        </div>
      </Marker>

      {showPopup && (
        <Popup
          longitude={message.longitude}
          latitude={message.latitude}
          anchor="bottom"
          onClose={() => setShowPopup(false)}
          closeButton={true}
          closeOnClick={false}
          className="max-w-xs"
        >
          <div className="p-2">
            <p className="text-sm text-foreground mb-2">{message.content}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{formatDate(message.created_at)}</span>
              <span>•</span>
              <span className="capitalize">{message.geo_precision}</span>
            </div>
          </div>
        </Popup>
      )}
    </>
  );
}
