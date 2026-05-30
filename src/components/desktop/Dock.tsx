'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Terminal, FolderOpen, User, Code2, Mail, Lightbulb, Globe, Award, Briefcase, Settings } from 'lucide-react';
import { AppId, useWindowStore } from '@/store/useWindowStore';

interface DockItemProps {
  id: AppId | 'github';
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  isOpen?: boolean;
}

function DockItem({ label, icon, onClick, isOpen }: DockItemProps) {
  return (
    <div className="relative group flex flex-col items-center">
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.2, y: -10 }}
        whileTap={{ scale: 0.9 }}
        className="w-12 h-12 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 border border-black/5 dark:border-white/10 backdrop-blur-lg rounded-2xl flex items-center justify-center text-black dark:text-white shadow-lg transition-colors duration-500"
      >
        {icon}
      </motion.button>
      
      {/* Active dot indicator */}
      {isOpen && (
        <div className="absolute -bottom-2 w-1 h-1 bg-white rounded-full opacity-100 shadow-[0_0_8px_2px_rgba(255,255,255,0.8)] animate-pulse" />
      )}
      
      {/* Tooltip */}
      <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-black/80 text-black dark:text-white text-xs px-2 py-1 rounded border border-black/10 dark:border-white/10 pointer-events-none whitespace-nowrap z-50">
        {label}
      </div>
    </div>
  );
}

export default function Dock() {
  const t = useTranslations('Dock');
  const openWindow = useWindowStore((state) => state.openWindow);
  const minimizeWindow = useWindowStore((state) => state.minimizeWindow);
  const focusWindow = useWindowStore((state) => state.focusWindow);
  const activeWindow = useWindowStore((state) => state.activeWindow);
  const windows = useWindowStore((state) => state.windows);

  const handleAppClick = (id: AppId) => {
    const win = windows[id];
    if (!win?.isOpen) {
      openWindow(id);
    } else if (win.isMinimized) {
      focusWindow(id);
    } else if (activeWindow === id) {
      minimizeWindow(id);
    } else {
      focusWindow(id);
    }
  };

  const apps = [
    { id: 'projects' as AppId, label: t('projects'), icon: <FolderOpen size={22} strokeWidth={1.5} /> },
    { id: 'experience' as AppId, label: t('experience'), icon: <Briefcase size={22} strokeWidth={1.5} /> },
    { id: 'about' as AppId, label: t('about'), icon: <User size={22} strokeWidth={1.5} /> },
    { id: 'skills' as AppId, label: t('skills'), icon: <Code2 size={22} strokeWidth={1.5} /> },
    { id: 'certificates' as AppId, label: t('certificates'), icon: <Award size={22} strokeWidth={1.5} /> },
    { id: 'browser' as AppId, label: t('browser'), icon: <Globe size={22} strokeWidth={1.5} /> },
    { id: 'experiments' as AppId, label: t('experiments'), icon: <Lightbulb size={22} strokeWidth={1.5} /> },
    { id: 'contact' as AppId, label: t('contact'), icon: <Mail size={22} strokeWidth={1.5} /> },
    { id: 'terminal' as AppId, label: t('terminal'), icon: <Terminal size={22} strokeWidth={1.5} /> },
    { id: 'settings' as AppId, label: t('settings'), icon: <Settings size={22} strokeWidth={1.5} /> },
  ];

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="p-3 rounded-3xl bg-white/40 dark:bg-black/30 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-2xl flex items-center gap-2 sm:gap-3 max-w-[calc(100vw-2rem)] sm:max-w-none overflow-x-auto sm:overflow-visible [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] transition-colors duration-500"
    >
      {apps.map((app) => (
        <DockItem
          key={app.id}
          id={app.id}
          label={app.label}
          icon={app.icon}
          isOpen={windows[app.id]?.isOpen}
          onClick={() => handleAppClick(app.id)}
        />
      ))}
      
      {/* Divider */}
      <div className="w-px h-10 bg-black/10 dark:bg-white/10 mx-1 transition-colors duration-500" />
      
      {/* External Links */}
      <DockItem
        id="github"
        label={t('github')}
        icon={
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
            <path d="M9 18c-4.51 2-5-2-7-2" />
          </svg>
        }
        onClick={() => window.open('https://github.com/SCARLXRD-1', '_blank')}
      />
    </motion.div>
  );
}
