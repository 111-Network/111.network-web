'use client';

import { useState } from 'react';
import { Marker, Popup } from 'react-map-gl/maplibre';
import { X } from 'lucide-react';
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
            className="w-4 h-4 bg-error rounded-full border-2 border-background shadow-lg flex items-center justify-center"
            style={{
              backgroundColor: 'hsl(var(--error))',
            }}
          >
            <div className="w-1.5 h-1.5 bg-background rounded-full" />
          </div>
        </div>
      </Marker>

      {showPopup && (
        <Popup
          longitude={message.longitude}
          latitude={message.latitude}
          anchor="bottom"
          onClose={() => setShowPopup(false)}
          closeButton={false}
          closeOnClick={false}
          className="max-w-xs"
        >
          <div 
            className="p-3 bg-background border border-border rounded-md shadow-lg"
            style={{
              backgroundColor: 'hsl(var(--background))',
              color: 'hsl(var(--foreground))',
            }}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <p 
                className="text-sm flex-1"
                style={{
                  color: 'hsl(var(--foreground))',
                }}
              >
                {message.content}
              </p>
              <button
                onClick={() => setShowPopup(false)}
                className="flex-shrink-0 p-1 rounded hover:bg-muted transition-colors"
                aria-label="Close"
                style={{
                  color: 'hsl(var(--muted-foreground))',
                }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div 
              className="flex items-center gap-2 text-xs"
              style={{
                color: 'hsl(var(--muted-foreground))',
              }}
            >
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
