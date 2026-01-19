'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@111-network/ui';
import { BroadcastForm } from './broadcast-form';

interface BroadcastPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLocation?: { lat: number; lng: number } | null;
  onLocationChange?: (location: { lat: number; lng: number } | null) => void;
  onSuccess?: (messageData?: {
    id: string;
    content: string;
    latitude: number;
    longitude: number;
    geo_precision: string;
    created_at: string;
  }) => void;
}

export function BroadcastPanel({
  isOpen,
  onClose,
  selectedLocation,
  onLocationChange,
  onSuccess,
}: BroadcastPanelProps) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when panel is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop - only show on mobile when open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Panel */}
      <div
        className={cn(
          'fixed z-50 bg-card/80 backdrop-blur-md border-r border-border shadow-xl',
          'transition-transform duration-300 ease-in-out',
          // Desktop: left side, vertically centered
          'md:left-0 md:top-1/2 md:w-[40%] md:max-w-md md:h-auto md:max-h-[80vh]',
          // Mobile: slide from bottom
          'bottom-0 left-0 right-0 h-[70vh] max-h-[600px] rounded-t-lg border-t border-r-0',
          // Transform based on open state
          isOpen 
            ? 'translate-x-0 translate-y-0 md:-translate-y-1/2' 
            : 'md:translate-x-[-100%] translate-y-full md:-translate-y-1/2'
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="broadcast-panel-title"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 id="broadcast-panel-title" className="text-lg font-semibold text-foreground">
              Broadcast Message
            </h2>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              className="p-2 rounded-md hover:bg-muted transition-colors"
              aria-label="Close panel"
              type="button"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <div className="flex-1 overflow-y-auto p-4">
            <BroadcastForm
              selectedLocation={selectedLocation}
              onLocationChange={onLocationChange}
              onSuccess={(messageData) => {
                if (onSuccess) {
                  onSuccess(messageData);
                } else {
                  onClose();
                }
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
