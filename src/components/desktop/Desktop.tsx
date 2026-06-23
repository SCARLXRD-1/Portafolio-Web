'use client';

import React, { useState, useEffect } from 'react';
import Dock from './Dock';
import WindowManager from '../windows/WindowManager';
import LockScreen from './LockScreen';
import { AnimatePresence, motion } from 'framer-motion';
import { useWindowStore } from '@/store/useWindowStore';
import { WALLPAPERS } from '@/constants/wallpapers';
import SplashScreen from './SplashScreen';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import TopMenuBar from './TopMenuBar';
import NotificationCenter from './NotificationCenter';
import ContextMenu from './ContextMenu';
import Spotlight from './Spotlight';
import OfflineDetector from './OfflineDetector';
import { useContextMenuStore } from '@/store/useContextMenuStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useSettingsStore } from '@/store/useSettingsStore';

export default function Desktop() {
  const windows = useWindowStore((state) => state.windows);
  const wallpaperId = useWindowStore((state) => state.wallpaperId);
  const { wallpaper_url, fetchSettings } = useSettingsStore();
  const [isMouseNearBottom, setIsMouseNearBottom] = useState(false);
  const initializeAuth = useAuthStore(state => state.initialize);

  useEffect(() => {
    initializeAuth();
    fetchSettings();
  }, [initializeAuth, fetchSettings]);

  const isAnyMaximized = Object.values(windows).some(
    (w) => w.isOpen && !w.isMinimized && w.isMaximized
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const distanceFromBottom = window.innerHeight - e.clientY;
      setIsMouseNearBottom((prev) => {
        // Hysteresis: 120px threshold to keep visible once shown, 40px to reveal
        const threshold = prev ? 120 : 40;
        return distanceFromBottom < threshold;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const shouldHideDock = isAnyMaximized && !isMouseNearBottom;
  const isBooted = useWindowStore((state) => state.isBooted);
  const setBooted = useWindowStore((state) => state.setBooted);
  const isLocked = useWindowStore((state) => state.isLocked);
  const setLocked = useWindowStore((state) => state.setLocked);
  const { openMenu } = useContextMenuStore();

  useKeyboardShortcuts();

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    openMenu(e.clientX, e.clientY);
  };

  const handleUnlock = () => {
    setLocked(false);
  };

  return (
    <div 
      onContextMenu={handleContextMenu}
      className="relative w-full h-full overflow-hidden text-white font-sans bg-[#0a0a0a] transition-colors duration-500"
    >
      <AnimatePresence>
        {!isBooted && <SplashScreen key="splash" onComplete={() => setBooted(true)} />}
        {isBooted && isLocked && <LockScreen key="lock" onUnlock={handleUnlock} />}
      </AnimatePresence>
      
      <OfflineDetector />

      {(() => {
        const localWallpaper = WALLPAPERS.find(w => w.id === wallpaperId);
        const isGlobal = !localWallpaper || localWallpaper.id === 'global';
        const finalUrl = isGlobal ? wallpaper_url : localWallpaper.url;
        
        if (localWallpaper?.id === 'live-waves' || (isGlobal && !wallpaper_url)) {
          return (
            <div className="absolute inset-0 z-0 overflow-hidden bg-black flex justify-center items-center">
              <div className="wave">
                <div className="wave-item"></div>
                <div className="wave-item"></div>
                <div className="wave-item"></div>
              </div>
            </div>
          );
        }

        if (localWallpaper?.type === 'color') {
          return <div className="absolute inset-0 z-0" style={{ backgroundColor: finalUrl || '#000' }} />;
        }
        
        if (finalUrl) {
          return (
            <div className="absolute inset-0 z-0">
              <img src={finalUrl} alt="Wallpaper" className="w-full h-full object-cover" />
            </div>
          );
        }

        return null;
      })()}

      <NotificationCenter />
      <ContextMenu />
      <Spotlight />

      {/* Window Manager Layer - container passes clicks through, windows catch them */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <WindowManager />
      </div>

      {/* Top Menu Bar */}
      <TopMenuBar />

      {/* Dock Layer */}
      <motion.div 
        animate={{ 
          y: shouldHideDock ? 110 : 0,
          opacity: shouldHideDock ? 0 : 1,
          scale: shouldHideDock ? 0.95 : 1
        }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        className={`absolute bottom-4 left-0 right-0 z-50 flex justify-center ${
          shouldHideDock ? 'pointer-events-none' : 'pointer-events-auto'
        }`}
      >
        <Dock />
      </motion.div>
    </div>
  );
}
