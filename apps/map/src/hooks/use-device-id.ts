'use client';

import { useState, useEffect } from 'react';
import { hashString } from '@/lib/validation';

const DEVICE_ID_KEY = '111-network-device-id';

/**
 * Hook to manage device ID for rate limiting
 * Generates UUID and stores in localStorage, falls back to sessionStorage
 */
export function useDeviceId() {
  const [deviceIdHash, setDeviceIdHash] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let deviceId: string | null = null;

    // Try to get from localStorage first
    if (typeof window !== 'undefined') {
      try {
        deviceId = localStorage.getItem(DEVICE_ID_KEY);
      } catch (e) {
        // localStorage might be disabled
        console.warn('localStorage not available, using sessionStorage');
      }
    }

    // If not found, generate new ID
    if (!deviceId) {
      deviceId = generateDeviceId();
      
      // Try to store in localStorage
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(DEVICE_ID_KEY, deviceId);
        } catch (e) {
          // Fallback to sessionStorage
          try {
            sessionStorage.setItem(DEVICE_ID_KEY, deviceId);
          } catch (e2) {
            console.warn('Could not store device ID');
          }
        }
      }
    }

    // Hash the device ID
    const hashed = hashString(deviceId);
    setDeviceIdHash(hashed);
    setIsLoading(false);
  }, []);

  return { deviceIdHash, isLoading };
}

/**
 * Generate a cryptographically secure device ID using Web Crypto API
 */
function generateDeviceId(): string {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    // Use Web Crypto API for secure random generation
    const array = new Uint32Array(4);
    window.crypto.getRandomValues(array);
    return Array.from(array, (val) => val.toString(16).padStart(8, '0')).join('-');
  }
  
  // Fallback to timestamp-based ID (less secure but works)
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}
