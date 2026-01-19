'use client';

import { useState, useCallback, useRef } from 'react';

export interface MapBounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

export interface BroadcastMessage {
  id: string;
  content: string;
  latitude: number;
  longitude: number;
  geo_precision: 'exact' | 'approx' | 'region';
  created_at: string;
}

/**
 * Hook to track map bounds and fetch messages
 */
export function useMapBounds() {
  const [bounds, setBounds] = useState<MapBounds | null>(null);
  const [messages, setMessages] = useState<BroadcastMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch messages function
  const fetchMessages = useCallback(async (bbox: MapBounds, keepExisting = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const bboxString = `${bbox.minLat},${bbox.maxLat},${bbox.minLng},${bbox.maxLng}`;
      const response = await fetch(`/api/broadcast?bbox=${bboxString}&limit=200`);

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      // If keepExisting is true, merge with existing messages to prevent flicker
      if (keepExisting) {
        setMessages((prev) => {
          const newMessages = data.messages || [];
          // Merge: keep existing messages, update/add new ones
          const messageMap = new Map(prev.map((msg) => [msg.id, msg]));
          newMessages.forEach((msg: BroadcastMessage) => {
            messageMap.set(msg.id, msg);
          });
          return Array.from(messageMap.values());
        });
      } else {
        setMessages(data.messages || []);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch messages';
      setError(errorMessage);
      // Only clear messages if not keeping existing
      if (!keepExisting) {
        setMessages([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update bounds and trigger fetch (debounced)
  const updateBounds = useCallback(
    (newBounds: MapBounds) => {
      setBounds(newBounds);

      // Clear existing timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      // Set new timeout
      debounceTimeoutRef.current = setTimeout(() => {
        // Use keepExisting=true to prevent clearing messages when bounds change
        // This prevents flicker when panning/zooming
        fetchMessages(newBounds, true);
      }, 500);
    },
    [fetchMessages]
  );

  // Refresh function that keeps existing messages visible (prevents flicker)
  const refresh = useCallback(() => {
    if (bounds) {
      // Keep existing messages during refresh to prevent flicker
      fetchMessages(bounds, true);
    }
  }, [bounds, fetchMessages]);

  // Add message optimistically (for immediate UI update)
  const addMessage = useCallback((message: BroadcastMessage) => {
    setMessages((prev) => {
      // Check if message already exists
      if (prev.some((msg) => msg.id === message.id)) {
        return prev;
      }
      // Add new message at the beginning (most recent first)
      return [message, ...prev];
    });
  }, []);

  return {
    bounds,
    messages,
    isLoading,
    error,
    updateBounds,
    refresh,
    addMessage,
  };
}
