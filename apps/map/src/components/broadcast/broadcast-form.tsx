'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Lock, MapPin } from 'lucide-react';
import { Button } from '@111-network/ui';
import { useBroadcast } from '@/hooks/use-broadcast';
import { useDeviceId } from '@/hooks/use-device-id';
import { useIPGeolocation } from '@/hooks/use-ip-geolocation';
import { useDebouncedLocationSearch, type LocationSuggestion } from '@/hooks/use-location-search';
import { validateLocationString, extractCoordinatesFromLocation } from '@/lib/validation';
import type { GeoPrecision } from '@/lib/types/database';

interface BroadcastFormProps {
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

const MAX_CONTENT_LENGTH = 240;

export function BroadcastForm({
  selectedLocation,
  onLocationChange,
  onSuccess,
}: BroadcastFormProps) {
  const [content, setContent] = useState('');
  const [locationString, setLocationString] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [geoPrecision, setGeoPrecision] = useState<GeoPrecision>('region');
  const [locationError, setLocationError] = useState<string | null>(null);
  const [contentError, setContentError] = useState<string | null>(null);
  const [selectedSuggestion, setSelectedSuggestion] = useState<LocationSuggestion | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const locationInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const { postBroadcast, isLoading, error, remaining } = useBroadcast();
  const { deviceIdHash, isLoading: deviceLoading } = useDeviceId();
  const { location: ipLocation, isLoading: ipLoading } = useIPGeolocation();
  const { suggestions, isLoading: searchLoading, attribution, setQuery, clear } = useDebouncedLocationSearch(500);

  // Auto-fill location from IP on mount
  useEffect(() => {
    if (ipLocation && !locationString) {
      // Only auto-fill if we have valid location data (not "Unknown Location" or 0,0)
      if (
        ipLocation.location !== 'Unknown Location' &&
        ipLocation.latitude !== 0 &&
        ipLocation.longitude !== 0
      ) {
        setLocationString(ipLocation.location);
        setLatitude(ipLocation.latitude);
        setLongitude(ipLocation.longitude);
        
        // Update map marker if callback provided
        if (onLocationChange) {
          onLocationChange({
            lat: ipLocation.latitude,
            lng: ipLocation.longitude,
          });
        }
      }
    }
  }, [ipLocation, locationString, onLocationChange]);

  // Sync selected location from map to form
  useEffect(() => {
    if (selectedLocation && selectedLocation.lat !== latitude && selectedLocation.lng !== longitude) {
      // If coordinates are set from map, we need to reverse geocode to get location string
      // For now, just update coordinates - location string can be manually edited
      setLatitude(selectedLocation.lat);
      setLongitude(selectedLocation.lng);
    }
  }, [selectedLocation, latitude, longitude]);

  // Update coordinates when suggestion is selected
  const handleSelectSuggestion = useCallback((suggestion: LocationSuggestion) => {
    setLocationString(suggestion.name);
    setLatitude(suggestion.latitude);
    setLongitude(suggestion.longitude);
    setSelectedSuggestion(suggestion);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
    clear();

    // Update map marker
    if (onLocationChange) {
      onLocationChange({
        lat: suggestion.latitude,
        lng: suggestion.longitude,
      });
    }
  }, [onLocationChange, clear]);

  // Handle location input change
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocationString(value);
    setLocationError(null);
    setSelectedSuggestion(null);
    
    if (value.trim().length >= 2) {
      setQuery(value);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      clear();
    }
  };

  // Handle location input blur
  const handleLocationBlur = () => {
    // Delay to allow click on suggestion
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  // Handle keyboard navigation
  const handleLocationKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      handleSelectSuggestion(suggestions[highlightedIndex]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setHighlightedIndex(-1);
    }
  };

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        locationInputRef.current &&
        !locationInputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    if (showSuggestions) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showSuggestions]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_CONTENT_LENGTH) {
      setContent(value);
      setContentError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContentError(null);
    setLocationError(null);

    // Validate content
    const trimmedContent = content.trim();
    if (!trimmedContent) {
      setContentError('Message cannot be empty');
      return;
    }

    if (trimmedContent.length > MAX_CONTENT_LENGTH) {
      setContentError(`Message cannot exceed ${MAX_CONTENT_LENGTH} characters`);
      return;
    }

    // Validate location
    try {
      validateLocationString(locationString);
    } catch (err) {
      setLocationError(err instanceof Error ? err.message : 'Invalid location');
      return;
    }

    // Validate coordinates
    if (latitude === null || longitude === null) {
      setLocationError('Please select a location from the suggestions or enter coordinates');
      return;
    }

    const { latitude: lat, longitude: lng } = extractCoordinatesFromLocation(
      locationString,
      latitude,
      longitude
    );

    if (deviceLoading || !deviceIdHash) {
      setLocationError('Device ID not ready. Please wait...');
      return;
    }

    // Submit
    const result = await postBroadcast({
      content: trimmedContent,
      latitude: lat,
      longitude: lng,
      geo_precision: geoPrecision,
      device_id_hash: deviceIdHash,
    });

    if (result.success && result.data) {
      // Reset form
      setContent('');
      setLocationString('');
      setLatitude(null);
      setLongitude(null);
      setGeoPrecision('region');
      setSelectedSuggestion(null);
      if (onSuccess) {
        // Pass message data to success callback for optimistic update
        onSuccess({
          id: result.data.id,
          content: result.data.content,
          latitude: result.data.latitude,
          longitude: result.data.longitude,
          geo_precision: result.data.geo_precision,
          created_at: result.data.created_at,
        });
      }
    }
  };

  const charactersRemaining = MAX_CONTENT_LENGTH - content.length;
  const isButtonDisabled = isLoading || deviceLoading || !content.trim() || !locationString.trim() || latitude === null || longitude === null;

  return (
    <form 
      onSubmit={handleSubmit} 
      className="space-y-6"
      noValidate
    >
      {/* Message Input */}
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-foreground mb-2">
          Message
        </label>
        <textarea
          id="content"
          value={content}
          onChange={handleContentChange}
          placeholder="What's happening?"
          rows={4}
          className="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none"
          required
        />
        <div className="flex items-center justify-between mt-2">
          {contentError && (
            <p className="text-sm text-error">{contentError}</p>
          )}
          <p
            className={`text-xs ml-auto ${
              charactersRemaining < 20 ? 'text-warning' : 'text-muted-foreground'
            }`}
          >
            {charactersRemaining} characters remaining
          </p>
        </div>
      </div>

      {/* Location Input with Autocomplete */}
      <div className="relative">
        <label htmlFor="location" className="block text-sm font-medium text-foreground mb-2">
          <MapPin className="w-4 h-4 inline mr-1" />
          Your Location
        </label>
        <div className="relative">
          <input
            ref={locationInputRef}
            id="location"
            type="text"
            value={locationString}
            onChange={handleLocationChange}
            onBlur={handleLocationBlur}
            onFocus={() => {
              if (suggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
            onKeyDown={handleLocationKeyDown}
            placeholder={ipLoading ? "Detecting your location..." : "Enter your location"}
            className="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            required
            disabled={ipLoading}
          />
          
          {/* Autocomplete Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div
              ref={suggestionsRef}
              className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-auto"
              style={{ backgroundColor: 'hsl(var(--background))' }}
            >
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion.id}
                  type="button"
                  onClick={() => handleSelectSuggestion(suggestion)}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                    index === highlightedIndex
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background text-foreground hover:bg-muted'
                  }`}
                  style={
                    index === highlightedIndex
                      ? undefined
                      : { backgroundColor: 'hsl(var(--background))' }
                  }
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  <div className="font-medium">{suggestion.name}</div>
                  <div className={`text-xs mt-0.5 capitalize ${
                    index === highlightedIndex
                      ? 'text-primary-foreground/80'
                      : 'text-muted-foreground'
                  }`}>
                    {suggestion.type} • {suggestion.class}
                  </div>
                </button>
              ))}
              {attribution && (
                <div className="px-3 py-2 text-xs text-muted-foreground border-t border-border bg-background" style={{ backgroundColor: 'hsl(var(--background))' }}>
                  {attribution}
                </div>
              )}
            </div>
          )}

          {/* Loading indicator */}
          {searchLoading && locationString.trim().length >= 2 && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {locationError && (
          <p className="text-sm text-error mt-2">{locationError}</p>
        )}
        <p className="text-xs text-muted-foreground mt-2">
          {ipLoading 
            ? "Detecting your location from IP address..."
            : "Location is auto-filled from your IP. You can change it manually or select from suggestions."
          }
        </p>
      </div>

      {/* Geo Precision Selector */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Location Precision
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['exact', 'approx', 'region'] as GeoPrecision[]).map((precision) => {
            const isRegion = precision === 'region';
            const isSelected = geoPrecision === precision;
            const isDisabled = !isRegion; // Only region is available for now

            return (
              <button
                key={precision}
                type="button"
                onClick={() => !isDisabled && setGeoPrecision(precision)}
                disabled={isDisabled}
                className={`
                  px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${
                    isSelected
                      ? 'bg-primary text-primary-foreground'
                      : isDisabled
                      ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                      : 'bg-muted text-foreground hover:bg-muted/80'
                  }
                `}
              >
                <div className="flex items-center justify-center gap-1">
                  {isRegion && <Lock className="w-3 h-3" />}
                  <span className="capitalize">{precision}</span>
                </div>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Only "Region" is available. Other options coming soon.
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-error-light border border-error rounded-md">
          <p className="text-sm text-error">{error}</p>
          {remaining !== null && remaining === 0 && (
            <p className="text-xs text-error mt-1">
              Rate limit exceeded. Try again in 24 hours.
            </p>
          )}
        </div>
      )}

      {/* Success Message */}
      {!error && remaining !== null && remaining > 0 && (
        <div className="p-3 bg-success-light border border-success rounded-md">
          <p className="text-sm text-success">
            {remaining} message{remaining !== 1 ? 's' : ''} remaining today
          </p>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isButtonDisabled}
        className="w-full"
        size="lg"
      >
        {isLoading ? 'Broadcasting...' : 'Broadcast Now'}
      </Button>
    </form>
  );
}
