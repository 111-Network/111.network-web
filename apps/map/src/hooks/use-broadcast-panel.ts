'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

/**
 * Hook to manage broadcast panel state with URL hash sync
 */
export function useBroadcastPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Sync with URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const shouldOpen = window.location.hash === '#broadcast';
      setIsOpen(shouldOpen);
    };

    // Check initial hash on mount
    if (typeof window !== 'undefined') {
      handleHashChange();
    }

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [pathname]);

  const openPanel = () => {
    setIsOpen(true);
    window.location.hash = '#broadcast';
  };

  const closePanel = () => {
    // Remove hash first to prevent hash change listener from reopening
    if (window.history.replaceState) {
      window.history.replaceState(null, '', pathname);
    } else {
      window.location.hash = '';
    }
    // Then update state
    setIsOpen(false);
  };

  const togglePanel = () => {
    if (isOpen) {
      closePanel();
    } else {
      openPanel();
    }
  };

  return {
    isOpen,
    openPanel,
    closePanel,
    togglePanel,
  };
}
