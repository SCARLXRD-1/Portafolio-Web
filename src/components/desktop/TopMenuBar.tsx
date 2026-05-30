'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Wifi, Battery, BatteryCharging, BatteryFull, BatteryLow, BatteryMedium, BatteryWarning, Volume2, Search, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageSwitcher from './LanguageSwitcher';
import { useBattery } from '@/hooks/useBattery';

import ThemeToggle from './ThemeToggle';

export default function TopMenuBar() {
  const [time, setTime] = useState(() => new Date());
  const [isMounted, setIsMounted] = useState(false);
  const [showMusic, setShowMusic] = useState(false);
  const musicRef = useRef<HTMLDivElement>(null);
  
  const { level, charging, supported } = useBattery();
  const batteryPercentage = Math.round(level * 100);

  const renderBatteryIcon = () => {
    if (charging) return <BatteryCharging size={14} className="text-emerald-500" />;
    if (batteryPercentage >= 90) return <BatteryFull size={14} />;
    if (batteryPercentage >= 50) return <BatteryMedium size={14} />;
    if (batteryPercentage >= 20) return <BatteryLow size={14} />;
    return <BatteryWarning size={14} className="text-red-500" />;
  };

  useEffect(() => {
    setIsMounted(true);
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (musicRef.current && !musicRef.current.contains(e.target as Node)) {
        setShowMusic(false);
      }
    };
    if (showMusic) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMusic]);

  const timeString = isMounted ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
  const fullDateString = isMounted ? time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }) : '';

  return (
    <div className="absolute top-0 left-0 right-0 h-8 bg-white/40 dark:bg-black/40 backdrop-blur-xl border-b border-black/5 dark:border-white/10 z-50 flex items-center px-4 text-xs font-medium tracking-wide text-black/90 dark:text-white/90 transition-colors duration-500">
      <div className="flex items-center gap-4">
        <span className="font-bold flex items-center gap-2 cursor-default px-2">
          <span>AKASHI DEV</span>
        </span>
        <span className="hidden md:inline opacity-60 hover:opacity-100 cursor-pointer transition-opacity">Workspace</span>
        <span className="hidden md:inline opacity-60 hover:opacity-100 cursor-pointer transition-opacity">View</span>
        <span className="hidden md:inline opacity-60 hover:opacity-100 cursor-pointer transition-opacity">Help</span>
      </div>
      
      <div className="flex-1" />
      
      <div className="flex items-center gap-4 relative" ref={musicRef}>
        <ThemeToggle />
        <LanguageSwitcher />
        
        {/* Music Popover Trigger */}
        <button 
          onClick={() => setShowMusic(!showMusic)}
          className={`opacity-70 hover:opacity-100 transition-opacity flex items-center justify-center ${showMusic ? 'opacity-100 text-emerald-500' : ''}`}
        >
          <Music size={14} />
        </button>

        {/* Music Popover */}
        <AnimatePresence>
          {showMusic && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full mt-2 right-2 sm:right-12 w-[calc(100vw-16px)] sm:w-80 max-w-[320px] bg-black rounded-xl overflow-hidden shadow-2xl border border-white/10 z-[99999] flex flex-col"
            >
              <div className="bg-[#181818] px-3 py-2 border-b border-white/10 flex items-center justify-between">
                <span className="text-xs font-semibold text-white/80">Spotify</span>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              {/* Content */}
              <div className="h-[352px] w-full bg-[#121212] relative flex flex-col">
                <iframe 
                  style={{ borderRadius: '0' }} 
                  src="https://open.spotify.com/embed/playlist/0vvXsWCC9xrXsKd4FyS8kM?utm_source=generator&theme=0" 
                  width="100%" 
                  height="100%" 
                  frameBorder="0" 
                  allowFullScreen={false} 
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                  loading="lazy"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Search size={14} className="opacity-70 cursor-pointer hover:opacity-100 transition-opacity" />
        <Wifi size={14} className="opacity-70 cursor-pointer hover:opacity-100 transition-opacity" />
        <Volume2 size={14} className="opacity-70 cursor-pointer hover:opacity-100 transition-opacity" />
        <div className="hidden sm:flex items-center gap-1 opacity-70 cursor-pointer hover:opacity-100 transition-opacity" title={supported ? `Batería: ${batteryPercentage}%` : "Batería no soportada"}>
          {supported && <span className="mr-1">{batteryPercentage}%</span>}
          {renderBatteryIcon()}
        </div>
        <span className="ml-2 font-semibold tracking-wider cursor-default">
          <span className="hidden md:inline">{fullDateString} </span>{timeString}
        </span>
      </div>
    </div>
  );
}
