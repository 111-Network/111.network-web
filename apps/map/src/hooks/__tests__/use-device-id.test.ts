import { renderHook, waitFor } from '@testing-library/react';
import { useDeviceId } from '../use-device-id';

// Mock crypto API
const mockCrypto = {
  getRandomValues: jest.fn((arr) => {
    for (let i = 0; i < arr.length; i++) {
      arr[i] = Math.floor(Math.random() * 0xffffffff);
    }
    return arr;
  }),
};

beforeEach(() => {
  // Clear localStorage
  localStorage.clear();
  sessionStorage.clear();
  
  // Mock window.crypto
  Object.defineProperty(window, 'crypto', {
    value: mockCrypto,
    writable: true,
  });
});

describe('useDeviceId', () => {
  it('should generate a device ID on first use', async () => {
    const { result } = renderHook(() => useDeviceId());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.deviceIdHash).toBeTruthy();
    expect(typeof result.current.deviceIdHash).toBe('string');
    expect(result.current.deviceIdHash.length).toBeGreaterThan(0);
  });

  it('should persist device ID in localStorage', async () => {
    const { result: result1 } = renderHook(() => useDeviceId());

    await waitFor(() => {
      expect(result1.current.isLoading).toBe(false);
    });

    const firstId = result1.current.deviceIdHash;

    // Unmount and remount
    const { result: result2 } = renderHook(() => useDeviceId());

    await waitFor(() => {
      expect(result2.current.isLoading).toBe(false);
    });

    // Should be the same ID
    expect(result2.current.deviceIdHash).toBe(firstId);
  });

  it('should fallback to sessionStorage if localStorage fails', async () => {
    // Mock localStorage to throw
    const originalGetItem = localStorage.getItem;
    const originalSetItem = localStorage.setItem;
    localStorage.getItem = jest.fn(() => null);
    localStorage.setItem = jest.fn(() => {
      throw new Error('localStorage disabled');
    });

    const { result } = renderHook(() => useDeviceId());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.deviceIdHash).toBeTruthy();

    // Restore
    localStorage.getItem = originalGetItem;
    localStorage.setItem = originalSetItem;
  });
});
