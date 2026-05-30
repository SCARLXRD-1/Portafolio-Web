'use client';

import { useEffect } from 'react';
import { useWindowStore } from '@/store/useWindowStore';
import { useSpotlightStore } from '@/store/useSpotlightStore';

export function useKeyboardShortcuts() {
  const { openWindow, activeWindow, closeWindow, minimizeWindow } = useWindowStore();
  const { toggleSpotlight } = useSpotlightStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Spotlight (Ctrl+K or Cmd+K)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggleSpotlight();
      }

      // Ctrl+T or Cmd+T -> Open Terminal
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 't') {
        e.preventDefault();
        openWindow('terminal');
      }

      // Escape -> Minimize active window
      if (e.key === 'Escape' && activeWindow) {
        e.preventDefault();
        minimizeWindow(activeWindow);
      }

      // Alt+W or Opt+W -> Close active window
      if (e.altKey && e.key.toLowerCase() === 'w' && activeWindow) {
        e.preventDefault();
        closeWindow(activeWindow);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openWindow, activeWindow, closeWindow, minimizeWindow]);
}
