'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSystemSounds } from '@/hooks/useSystemSounds';

interface LockScreenProps {
  onUnlock: () => void;
}

export default function LockScreen({ onUnlock }: LockScreenProps) {
  const [time, setTime] = useState(() => new Date());
  const [password, setPassword] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const t = useTranslations('Terminal'); // using existing translations or generic text
  const { playLogin, playClick } = useSystemSounds();

  useEffect(() => {
    setIsMounted(true);
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleUnlock = () => {
    playLogin();
    onUnlock();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleUnlock();
    } else {
      playClick(); // Play a small click on typing
    }
  };

  const timeString = isMounted ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
  const dateString = isMounted ? time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' }) : '';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black/60 backdrop-blur-2xl text-white select-none"
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
        
        <h2 className="text-2xl font-semibold mb-6">AKASHI DEV</h2>

        <div className="relative w-64 group">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Introduce contraseña..."
            autoFocus
            className="w-full bg-white/10 border border-white/20 rounded-full py-2 px-4 pr-10 text-center text-sm outline-none focus:bg-white/20 focus:border-white/40 transition-all placeholder:text-white/40"
          />
          <button 
            onClick={handleUnlock}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition-colors"
          >
            <ArrowRight size={14} />
          </button>
        </div>
        
        <p className="text-xs text-white/40 mt-4 opacity-0 group-focus-within:opacity-100 transition-opacity">
          Presiona Enter para iniciar sesión
        </p>
      </motion.div>

      {/* Bottom info */}
      <div className="absolute bottom-10 flex gap-6 text-white/50 text-sm">
      
        <span>Presiona <kbd className="font-sans px-1 rounded bg-white/10">Enter</kbd> o la flecha para continuar</span>
      </div>
    </motion.div>
  );
}
