'use client';

import React, { useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '@/store/useThemeStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();
  const [wave, setWave] = useState<{ x: number; y: number; color: string; id: number } | null>(null);
  const [clickCount, setClickCount] = useState(0);

  const handleClick = (e: React.MouseEvent) => {
    const isDark = theme === 'dark';
    const nextColor = isDark ? '#ffffff' : '#0a0a0a';
    const nextTheme = isDark ? 'light' : 'dark';
    
    // Capture click coordinates
    const { clientX: x, clientY: y } = e;
    
    setWave({ x, y, color: nextColor, id: clickCount });
    setClickCount((c) => c + 1);

    // Apply theme change slightly after wave starts covering screen
    setTimeout(() => {
      toggleTheme();
    }, 400);

    // Remove wave overlay after animation finishes
    setTimeout(() => {
      setWave(null);
    }, 1000);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="relative z-50 p-1.5 rounded-full hover:bg-black/20 dark:hover:bg-white/10 transition-colors"
        title="Cambiar Tema"
      >
        {theme === 'dark' ? <Sun size={16} className="text-white" /> : <Moon size={16} className="text-black" />}
      </button>

      {/* Expanding Wave Overlay */}
      <AnimatePresence>
        {wave && (
          <motion.div
            key={wave.id}
            initial={{ 
              clipPath: `circle(0px at ${wave.x}px ${wave.y}px)`,
              backgroundColor: wave.color,
            }}
            animate={{ 
              clipPath: `circle(150vw at ${wave.x}px ${wave.y}px)`,
              backgroundColor: wave.color,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] pointer-events-none"
          />
        )}
      </AnimatePresence>
    </>
  );
}
