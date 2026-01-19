'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export interface LocationSuggestion {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  type: string;
  class: string;
  importance: number;
}

interface LocationSearchResponse {
  suggestions: LocationSuggestion[];
  attribution: string;
}

/**
 * Hook for location autocomplete search
 * Debounces requests to respect rate limits
 */
export function useLocationSearch() {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attribution, setAttribution] = useState<string | null>(null);

  const search = useCallback(async (query: string) => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/location-search?q=${encodeURIComponent(query.trim())}&limit=5`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Search failed');
      }

      const data: LocationSearchResponse = await response.json();
      setSuggestions(data.suggestions || []);
      setAttribution(data.attribution || null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search locations';
      setError(errorMessage);
      setSuggestions([]);
      console.error('Location search error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setSuggestions([]);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    suggestions,
    isLoading,
    error,
    attribution,
    search,
    clear,
  };
}

/**
 * Debounced version of useLocationSearch
 * Waits for user to stop typing before searching
 */
export function useDebouncedLocationSearch(delay: number = 500) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const locationSearch = useLocationSearch();
  
  // Use refs to store stable function references
  const searchRef = useRef(locationSearch.search);
  const clearRef = useRef(locationSearch.clear);
  
  // Update refs when functions change (they shouldn't, but just in case)
  searchRef.current = locationSearch.search;
  clearRef.current = locationSearch.clear;

  // Debounce the query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);

    return () => clearTimeout(timer);
  }, [query, delay]);

  // Search when debounced query changes
  // Use refs to avoid dependency array issues
  useEffect(() => {
    if (debouncedQuery) {
      searchRef.current(debouncedQuery);
    } else {
      clearRef.current();
    }
  }, [debouncedQuery]); // Only depend on debouncedQuery

  return {
    ...locationSearch,
    query,
    setQuery,
  };
}
