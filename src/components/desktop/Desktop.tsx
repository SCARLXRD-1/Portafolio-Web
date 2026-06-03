'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Dock from './Dock';
import WindowManager from '../windows/WindowManager';
import { Wifi, BatteryMedium, Volume2, Search } from 'lucide-react';
import LockScreen from './LockScreen';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useWindowStore } from '@/store/useWindowStore';
import LanguageSwitcher from './LanguageSwitcher';
import SplashScreen from './SplashScreen';
import { useMobileDetect } from '@/hooks/useMobileDetect';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import TopMenuBar from './TopMenuBar';
import ThemeToggle from './ThemeToggle';
import NotificationCenter from './NotificationCenter';
import ContextMenu from './ContextMenu';
import Spotlight from './Spotlight';
import OfflineDetector from './OfflineDetector';
import { useContextMenuStore } from '@/store/useContextMenuStore';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import { useAuthStore } from '@/store/useAuthStore';

export default function Desktop() {
  const windows = useWindowStore((state) => state.windows);
  const [isMouseNearBottom, setIsMouseNearBottom] = useState(false);
  const [animationData, setAnimationData] = useState<any>(null);
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const initializeAuth = useAuthStore(state => state.initialize);

  useEffect(() => {
    initializeAuth();
    // Fetch the Lottie json file (~62KB) asynchronously to avoid blocking the initial JS bundle
    fetch('/fondo.json')
      .then(res => res.json())
      .then(data => setAnimationData(data))
      .catch(err => console.error('Error loading background animation:', err));
  }, []);

  const isAnyMaximized = Object.values(windows).some(
    (w) => w.isOpen && !w.isMinimized && w.isMaximized
  );

  // Pause Lottie when any window is visible to free GPU/CPU
  const isAnyWindowVisible = useMemo(
    () => Object.values(windows).some((w) => w.isOpen && !w.isMinimized),
    [windows]
  );

  useEffect(() => {
    if (!lottieRef.current) return;
    if (isAnyWindowVisible) {
      lottieRef.current.pause();
    } else {
      lottieRef.current.play();
    }
  }, [isAnyWindowVisible]);

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
  const [isMounted, setIsMounted] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [isLocked, setIsLocked] = useState(true);
  const isMobile = useMobileDetect();
  const { openMenu } = useContextMenuStore();

  useKeyboardShortcuts();

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    openMenu(e.clientX, e.clientY);
  };

  const handleUnlock = () => {
    setIsLocked(false);
  };

  return (
    <div 
      onContextMenu={handleContextMenu}
      className="relative w-full h-full overflow-hidden text-white font-sans bg-[#0a0a0a] transition-colors duration-500"
    >
      <AnimatePresence>
        {showSplash && <SplashScreen key="splash" onComplete={() => setShowSplash(false)} />}
        {!showSplash && isLocked && <LockScreen key="lock" onUnlock={handleUnlock} />}
      </AnimatePresence>
      
      <OfflineDetector />

      {/* Lottie Background Animation (Optimized json) */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-black transition-colors duration-500">
        {animationData && (
          <Lottie
            lottieRef={lottieRef}
            animationData={animationData}
            loop={true}
            className="absolute top-1/2 left-1/2 min-w-[100vw] min-h-[100vh] w-auto h-auto max-w-none -translate-x-1/2 -translate-y-1/2 opacity-80 pointer-events-none"
            style={{ objectFit: 'cover' }}
          />
        )}
        <div className="absolute inset-0 bg-black/40 pointer-events-none transition-colors duration-500" />
      </div>

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
