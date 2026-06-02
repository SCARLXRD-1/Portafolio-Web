'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import SystemErrorScreen from './SystemErrorScreen';

export default function OfflineDetector() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Initial check
    if (typeof navigator !== 'undefined') {
      setIsOffline(!navigator.onLine);
    }

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {isOffline && (
        <SystemErrorScreen 
          type="offline" 
          onRetry={() => {
            if (navigator.onLine) {
              setIsOffline(false);
            } else {
              // Optional: Add a subtle shake animation or notification here if still offline
              console.warn("Aún sin conexión");
            }
          }} 
        />
      )}
    </AnimatePresence>
  );
}
