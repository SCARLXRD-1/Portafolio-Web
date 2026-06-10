'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSystemSounds } from '@/hooks/useSystemSounds';

interface LockScreenProps {
  onUnlock: () => void;
}

import { insforge } from '@/lib/insforge';
import { useAuthStore } from '@/store/useAuthStore';
import { useSettingsStore } from '@/store/useSettingsStore';

export default function LockScreen({ onUnlock }: LockScreenProps) {
  const [time, setTime] = useState(() => new Date());
  const [isMounted, setIsMounted] = useState(false);
  const t = useTranslations('Terminal'); // using existing translations or generic text
  const { playLogin, playClick } = useSystemSounds();
  const { user, isAdmin } = useAuthStore();
  const { username } = useSettingsStore();

  useEffect(() => {
    setIsMounted(true);
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleUnlock = () => {
    playLogin();
    onUnlock(); // This enters OS
  };

  const timeString = isMounted ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
  const dateString = isMounted ? time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' }) : '';

  return (
    <motion.div
      initial={{ opacity: 1, backgroundColor: 'rgba(0,0,0,1)' }}
      animate={{ opacity: 1, backgroundColor: 'rgba(0,0,0,0.6)' }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
      transition={{ duration: 1.2, ease: 'easeInOut' }}
      className="absolute inset-0 z-[100] flex flex-col items-center justify-center backdrop-blur-2xl text-white select-none"
    >
      {/* Clock Area */}
      <div className="absolute top-24 flex flex-col items-center">
        <h1 className="text-8xl font-light tracking-tight">{timeString}</h1>
        <p className="text-xl font-medium mt-2 text-white/80 capitalize">{dateString}</p>
      </div>

      {/* Login Area */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col items-center mt-20"
      >
        <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-6 shadow-2xl overflow-hidden">
          <User size={48} className="text-white/50" />
        </div>
        
        <h2 className="text-2xl font-semibold mb-6">{username || 'AKASHI DEV'}</h2>

        <form onSubmit={(e) => { e.preventDefault(); handleUnlock(); }} className="flex flex-col items-center gap-4 w-64">
          <div className="relative w-full">
            <input 
              type="password" 
              placeholder="Contraseña" 
              className="w-full bg-white/10 text-white border border-white/20 focus:border-white/50 focus:bg-white/20 rounded-full py-2 pl-4 pr-10 outline-none transition-all placeholder:text-white/40"
              autoFocus
            />
            <button 
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </form>
      </motion.div>

      {/* Bottom info */}
      <div className="absolute bottom-10 flex gap-6 text-white/50 text-sm">
      
        <span>Presiona <kbd className="font-sans px-1 rounded bg-white/10">Enter</kbd> o la flecha para continuar</span>
      </div>
    </motion.div>
  );
}
