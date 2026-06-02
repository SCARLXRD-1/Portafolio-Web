'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Wifi, Battery, BatteryCharging, BatteryFull, BatteryLow, BatteryMedium, BatteryWarning, Volume2, Search, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageSwitcher from './LanguageSwitcher';
import { useBattery } from '@/hooks/useBattery';

import ThemeToggle from './ThemeToggle';

import { useWindowStore } from '@/store/useWindowStore';
import { useAuthStore } from '@/store/useAuthStore';

export default function TopMenuBar() {
  const [time, setTime] = useState(() => new Date());
  const [isMounted, setIsMounted] = useState(false);
  const { user, profile } = useAuthStore();
  
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

  const timeString = isMounted ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
  const fullDateString = isMounted ? time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }) : '';

  const handleMusicClick = () => {
    const winState = useWindowStore.getState().windows['music'];
    if (winState?.isOpen) {
      useWindowStore.getState().focusWindow('music');
    } else {
      useWindowStore.getState().openWindow('music');
    }
  };

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
      
      <div className="flex items-center gap-4 relative">


        <ThemeToggle />
        <LanguageSwitcher />
        
        {/* Music App Trigger */}
        <button 
          onClick={handleMusicClick}
          className="opacity-70 hover:opacity-100 transition-opacity flex items-center justify-center"
        >
          <Music size={14} />
        </button>

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
