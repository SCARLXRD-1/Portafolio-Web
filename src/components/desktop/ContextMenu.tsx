'use client';

import React, { useEffect, useRef } from 'react';
import { useContextMenuStore } from '@/store/useContextMenuStore';
import { useThemeStore } from '@/store/useThemeStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { Code2, Monitor, SunMoon, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContextMenu() {
  const { isOpen, x, y, closeMenu, targetId } = useContextMenuStore();
  const { toggleTheme, theme } = useThemeStore();
  const isDark = theme === 'dark';
  const { addNotification } = useNotificationStore();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleGlobalClick = () => {
      if (isOpen) closeMenu();
    };
    
    // Listen for click anywhere to close
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, [isOpen, closeMenu]);

  if (!isOpen) return null;

  // Make sure the menu doesn't go off-screen
  let posX = x;
  let posY = y;
  
  // Approximate width/height of the menu
  const menuWidth = 220;
  const menuHeight = 200;
  
  if (typeof window !== 'undefined') {
    if (x + menuWidth > window.innerWidth) posX = window.innerWidth - menuWidth - 10;
    if (y + menuHeight > window.innerHeight) posY = window.innerHeight - menuHeight - 10;
  }

  const handleAction = (action: string) => {
    switch (action) {
      case 'theme':
        toggleTheme();
        break;
      case 'github':
        window.open('https://github.com/SCARLXRD-1/Portafolio-Web', '_blank');
        break;
      case 'wallpaper':
        addNotification({
          title: 'Fondo de pantalla',
          message: 'La función para cambiar el fondo estará disponible en la próxima actualización.',
          type: 'info'
        });
        break;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.1 }}
        style={{ top: posY, left: posX }}
        className="fixed z-[99999] w-56 bg-white/90 dark:bg-black/90 backdrop-blur-2xl border border-black/10 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden py-1.5"
        onClick={(e) => e.stopPropagation()} // Prevent click inside from closing immediately
      >
        <div className="px-3 py-1.5 text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-wider mb-1">
          Opciones del Sistema
        </div>
        
        <button 
          onClick={() => { handleAction('theme'); closeMenu(); }}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <SunMoon size={16} className="text-black/70 dark:text-white/70" />
          <span>Cambiar Modo ({isDark ? 'Claro' : 'Oscuro'})</span>
        </button>

        <button 
          onClick={() => { handleAction('wallpaper'); closeMenu(); }}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <Monitor size={16} className="text-black/70 dark:text-white/70" />
          <span>Cambiar Fondo</span>
        </button>
        
        <div className="h-px bg-black/10 dark:bg-white/10 my-1.5 mx-2" />

        <button 
          onClick={() => { handleAction('github'); closeMenu(); }}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <Code2 size={16} className="text-black/70 dark:text-white/70" />
          <span>Ver código fuente</span>
        </button>

        <button 
          onClick={() => {
            window.location.href = '/es/admin';
            closeMenu();
          }}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <Settings size={16} className="text-black/70 dark:text-white/70" />
          <span>Panel de Administración</span>
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
