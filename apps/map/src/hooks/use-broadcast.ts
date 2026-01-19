'use client';

import { useState } from 'react';

export interface BroadcastMessage {
  content: string;
  latitude: number;
  longitude: number;
  geo_precision: 'exact' | 'approx' | 'region';
  device_id_hash?: string;
  device_public_key?: string;
}

export interface BroadcastResponse {
  id: string;
  content: string;
  latitude: number;
  longitude: number;
  geo_precision: string;
  created_at: string;
  remaining: number;
}

export interface BroadcastError {
  error: string;
  message?: string;
  remaining?: number;
}

/**
 * Hook for posting broadcast messages
 */
export function useBroadcast() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);

  const postBroadcast = async (
    message: BroadcastMessage
  ): Promise<{ success: boolean; data?: BroadcastResponse; error?: BroadcastError }> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/broadcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorData = data as BroadcastError;
        setError(errorData.message || errorData.error || 'Failed to post message');
        setRemaining(errorData.remaining ?? null);
        return { success: false, error: errorData };
      }

      const successData = data as BroadcastResponse;
      setRemaining(successData.remaining);
      return { success: true, data: successData };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Network error';
      setError(errorMessage);
      return { success: false, error: { error: errorMessage } };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    postBroadcast,
    isLoading,
    error,
    remaining,
  };
}
