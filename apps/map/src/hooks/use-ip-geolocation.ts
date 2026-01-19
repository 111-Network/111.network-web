'use client';

import { useState, useEffect } from 'react';

export interface IPGeolocationResult {
  location: string;
  latitude: number;
  longitude: number;
  city: string | null;
  region: string | null;
  country: string | null;
}

/**
 * Hook for IP-based geolocation
 * Fetches location on mount
 */
export function useIPGeolocation() {
  const [location, setLocation] = useState<IPGeolocationResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchLocation = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/geolocation');

        if (!response.ok) {
          const errorData = await response.json();
          // Don't throw for reserved range errors - just silently fail
          // User can still enter location manually
          if (errorData.details?.includes('reserved') || errorData.details?.includes('private')) {
            if (!cancelled) {
              setIsLoading(false);
            }
            return;
          }
          throw new Error(errorData.details || errorData.error || 'Failed to get location');
        }

        const data: IPGeolocationResult = await response.json();

        // Only set location if we have valid coordinates (not 0,0)
        if (!cancelled) {
          if (data.latitude !== 0 || data.longitude !== 0) {
            setLocation(data);
          }
          // If coordinates are 0,0 (reserved range), just don't set location
          // User can enter location manually
        }
      } catch (err) {
        if (!cancelled) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to get location';
          setError(errorMessage);
          console.error('IP geolocation error:', err);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchLocation();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    location,
    isLoading,
    error,
  };
}
