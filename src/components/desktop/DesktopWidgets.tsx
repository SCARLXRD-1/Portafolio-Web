'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import { 
  MapPin, 
  Clock, 
  Sparkles, 
  ExternalLink,
  Code2,
  Terminal,
  Activity
} from 'lucide-react';
import { useSystemSounds } from '@/hooks/useSystemSounds';
import { useWindowStore } from '@/store/useWindowStore';

export default function DesktopWidgets() {
  const locale = useLocale();
  const [time, setTime] = useState<string>('');
  const isEs = locale === 'es';
  const { playClick } = useSystemSounds();
  const openWindow = useWindowStore((state) => state.openWindow);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString(isEs ? 'es-MX' : 'en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [isEs]);

  const handleOpenTerminal = () => {
    playClick();
    openWindow('terminal');
  };

  const handleOpenProjects = () => {
    playClick();
    openWindow('projects');
  };

  return (
    <aside 
      aria-label="Desktop Information Widgets"
      className="absolute top-12 right-4 md:right-8 z-0 hidden lg:flex flex-col gap-3.5 w-64 select-none pointer-events-auto"
    >
      {/* Widget 1: Perfil & Disponibilidad en vivo */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-2xl bg-zinc-900/40 dark:bg-black/30 backdrop-blur-xl border border-white/10 p-4 shadow-xl text-white space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center font-bold text-sm shadow-md">
                JD
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-zinc-900 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-bold leading-tight">Jhonatan J.</div>
              <div className="text-[10px] text-zinc-400 font-medium">@SCARLXRD-1</div>
            </div>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
            {isEs ? 'Disponible' : 'Available'}
          </span>
        </div>

        <div className="pt-2 border-t border-white/5 space-y-1.5 text-[11px] text-zinc-300">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-zinc-400">
              <MapPin size={12} className="text-rose-400" />
              <span>{isEs ? 'Ubicación' : 'Location'}</span>
            </span>
            <span className="font-medium text-white">México (CST)</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-zinc-400">
              <Clock size={12} className="text-blue-400" />
              <span>{isEs ? 'Hora Local' : 'Local Time'}</span>
            </span>
            <span className="font-mono text-xs text-white">{time || '--:--:--'}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-zinc-400">
              <Activity size={12} className="text-emerald-400" />
              <span>Status</span>
            </span>
            <span className="text-emerald-400 text-[10px] font-medium truncate max-w-[120px]">
              Fullstack & AI Dev
            </span>
          </div>
        </div>
      </motion.div>

      {/* Widget 2: Actividad de GitHub & Tech Highlights */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="rounded-2xl bg-zinc-900/40 dark:bg-black/30 backdrop-blur-xl border border-white/10 p-4 shadow-xl text-white space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
            <span>GitHub Live</span>
          </div>
          <a
            href="https://github.com/SCARLXRD-1"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-0.5 transition-colors"
          >
            <span>Ver perfil</span>
            <ExternalLink size={10} />
          </a>
        </div>

        {/* Stack Highlights */}
        <div className="space-y-1.5">
          <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">
            {isEs ? 'Stack Predilecto' : 'Core Stack'}
          </span>
          <div className="flex flex-wrap gap-1">
            {['Next.js 15', 'TypeScript', 'React 19', 'PostgreSQL', 'Tailwind'].map((tech) => (
              <span
                key={tech}
                className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-zinc-200 font-mono"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div className="pt-2 border-t border-white/5 flex items-center gap-2">
          <button
            type="button"
            onClick={handleOpenProjects}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-white/10 hover:bg-white/15 text-[11px] font-medium text-white transition-colors"
          >
            <Code2 size={12} className="text-blue-400" />
            <span>{isEs ? 'Proyectos' : 'Projects'}</span>
          </button>
          <button
            type="button"
            onClick={handleOpenTerminal}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-white/10 hover:bg-white/15 text-[11px] font-medium text-white transition-colors"
          >
            <Terminal size={12} className="text-emerald-400" />
            <span>Terminal</span>
          </button>
        </div>
      </motion.div>
    </aside>
  );
}
