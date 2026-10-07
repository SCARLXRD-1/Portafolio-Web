'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { 
  FolderOpen, 
  User, 
  Briefcase, 
  Code2, 
  Terminal, 
  FileText, 
  Trash2,
  FileDown
} from 'lucide-react';
import { AppId, useWindowStore } from '@/store/useWindowStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { useSystemSounds } from '@/hooks/useSystemSounds';
import { insforge } from '@/lib/insforge';

interface ShortcutItem {
  id: string;
  appId?: AppId;
  labelKey: string;
  icon: React.ReactNode;
  iconBg: string;
  badge?: string;
  action?: () => void;
}

interface MarqueeRect {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

export default function DesktopShortcuts() {
  const t = useTranslations('Desktop.shortcuts');
  const locale = useLocale();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [marquee, setMarquee] = useState<MarqueeRect | null>(null);
  const [cvUrls, setCvUrls] = useState<{ es: string; en: string }>({ es: '', en: '' });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingMarquee = useRef(false);

  const openWindow = useWindowStore((state) => state.openWindow);
  const focusWindow = useWindowStore((state) => state.focusWindow);
  const windows = useWindowStore((state) => state.windows);
  const addNotification = useNotificationStore((state) => state.addNotification);
  const { playClick, playTrash } = useSystemSounds();

  useEffect(() => {
    const fetchCvUrls = async () => {
      try {
        const { data } = await insforge.database
          .from('profile_settings')
          .select('cv_url_es, cv_url_en')
          .eq('id', '00000000-0000-0000-0000-000000000001')
          .single();
        if (data) {
          setCvUrls({ es: data.cv_url_es || '', en: data.cv_url_en || '' });
        }
      } catch {
        // Fallback silencioso
      }
    };
    fetchCvUrls();
  }, []);

  const handleOpenApp = useCallback((appId: AppId) => {
    playClick();
    const win = windows[appId];
    if (!win?.isOpen) {
      openWindow(appId);
    } else {
      focusWindow(appId);
    }
  }, [windows, openWindow, focusWindow, playClick]);

  const handleOpenCv = useCallback(() => {
    playClick();
    const win = windows['resume'];
    if (!win?.isOpen) {
      openWindow('resume');
    } else {
      focusWindow('resume');
    }
  }, [windows, openWindow, focusWindow, playClick]);

  const handleOpenTrash = useCallback(() => {
    playTrash();
    addNotification({
      title: t('trashTitle'),
      message: t('trashEmpty'),
      type: 'info'
    });
  }, [addNotification, t, playTrash]);

  const shortcuts: ShortcutItem[] = [
    {
      id: 'projects',
      appId: 'projects',
      labelKey: 'projects',
      icon: <FolderOpen className="w-6 h-6 sm:w-7 sm:h-7 text-sky-300" strokeWidth={1.75} />,
      iconBg: 'bg-gradient-to-b from-sky-500/25 to-blue-600/35 border-sky-400/30 shadow-[0_8px_16px_-4px_rgba(14,165,233,0.3)]',
    },
    {
      id: 'about',
      appId: 'about',
      labelKey: 'about',
      icon: <User className="w-6 h-6 sm:w-7 sm:h-7 text-purple-300" strokeWidth={1.75} />,
      iconBg: 'bg-gradient-to-b from-purple-500/25 to-indigo-600/35 border-purple-400/30 shadow-[0_8px_16px_-4px_rgba(168,85,247,0.3)]',
    },
    {
      id: 'experience',
      appId: 'experience',
      labelKey: 'experience',
      icon: <Briefcase className="w-6 h-6 sm:w-7 sm:h-7 text-amber-300" strokeWidth={1.75} />,
      iconBg: 'bg-gradient-to-b from-amber-500/25 to-orange-600/35 border-amber-400/30 shadow-[0_8px_16px_-4px_rgba(245,158,11,0.3)]',
    },
    {
      id: 'skills',
      appId: 'skills',
      labelKey: 'skills',
      icon: <Code2 className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-300" strokeWidth={1.75} />,
      iconBg: 'bg-gradient-to-b from-emerald-500/25 to-teal-600/35 border-emerald-400/30 shadow-[0_8px_16px_-4px_rgba(16,185,129,0.3)]',
    },
    {
      id: 'terminal',
      appId: 'terminal',
      labelKey: 'terminal',
      icon: <Terminal className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-400" strokeWidth={1.75} />,
      iconBg: 'bg-gradient-to-b from-zinc-800/90 to-zinc-950/90 border-zinc-700/70 shadow-[0_8px_16px_-4px_rgba(0,0,0,0.5)]',
    },
    {
      id: 'notes',
      appId: 'notes',
      labelKey: 'notes',
      icon: <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-teal-300" strokeWidth={1.75} />,
      iconBg: 'bg-gradient-to-b from-teal-500/25 to-cyan-600/35 border-teal-400/30 shadow-[0_8px_16px_-4px_rgba(20,184,166,0.3)]',
    },
    {
      id: 'cv',
      labelKey: 'cv',
      badge: 'PDF',
      action: handleOpenCv,
      icon: <FileDown className="w-6 h-6 sm:w-7 sm:h-7 text-rose-300" strokeWidth={1.75} />,
      iconBg: 'bg-gradient-to-b from-rose-500/25 to-red-600/35 border-rose-400/30 shadow-[0_8px_16px_-4px_rgba(244,63,94,0.3)]',
    },
    {
      id: 'trash',
      labelKey: 'trash',
      action: handleOpenTrash,
      icon: <Trash2 className="w-6 h-6 sm:w-7 sm:h-7 text-zinc-300" strokeWidth={1.75} />,
      iconBg: 'bg-gradient-to-b from-zinc-600/25 to-zinc-800/35 border-zinc-500/30 shadow-[0_8px_16px_-4px_rgba(0,0,0,0.3)]',
    },
  ];

  const handleItemClick = (e: React.MouseEvent, item: ShortcutItem) => {
    e.stopPropagation();
    playClick();

    if (e.ctrlKey || e.metaKey) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (next.has(item.id)) next.delete(item.id);
        else next.add(item.id);
        return next;
      });
    } else {
      setSelectedIds(new Set([item.id]));
    }

    // Pantallas táctiles: abrir con un toque directo
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
      if (item.appId) handleOpenApp(item.appId);
      else if (item.action) item.action();
    }
  };

  const handleItemDoubleClick = (item: ShortcutItem) => {
    if (item.appId) handleOpenApp(item.appId);
    else if (item.action) item.action();
  };

  // Marquee Selection Logic en el escritorio
  const handleBackdropPointerDown = (e: React.PointerEvent) => {
    // Solo clic primario
    if (e.button !== 0) return;
    
    // Si hace clic sobre un botón de acceso directo o widget, no iniciar marquee
    const target = e.target as HTMLElement;
    if (target.closest('[data-shortcut-id]') || target.closest('[data-no-marquee]')) {
      return;
    }

    setSelectedIds(new Set());
    isDraggingMarquee.current = true;
    setMarquee({
      startX: e.clientX,
      startY: e.clientY,
      currentX: e.clientX,
      currentY: e.clientY,
    });
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDraggingMarquee.current) return;

      setMarquee((prev) => {
        if (!prev) return null;
        const current = { ...prev, currentX: e.clientX, currentY: e.clientY };

        // Calcular colisiones con los accesos directos
        const minX = Math.min(current.startX, current.currentX);
        const maxX = Math.max(current.startX, current.currentX);
        const minY = Math.min(current.startY, current.currentY);
        const maxY = Math.max(current.startY, current.currentY);

        const items = document.querySelectorAll<HTMLElement>('[data-shortcut-id]');
        const matched = new Set<string>();

        items.forEach((el) => {
          const rect = el.getBoundingClientRect();
          const intersects = !(
            rect.right < minX ||
            rect.left > maxX ||
            rect.bottom < minY ||
            rect.top > maxY
          );
          const id = el.dataset.shortcutId;
          if (intersects && id) {
            matched.add(id);
          }
        });

        setSelectedIds(matched);
        return current;
      });
    };

    const handlePointerUp = () => {
      if (isDraggingMarquee.current) {
        isDraggingMarquee.current = false;
        setMarquee(null);
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  return (
    <>
      {/* Capa de fondo sensible a clics para selección por arrastre */}
      <div
        onPointerDown={handleBackdropPointerDown}
        className="absolute inset-0 z-0 pointer-events-auto"
      />

      {/* Recuadro visual translúcido de selección (Marquee Box) */}
      {marquee && (
        <div
          className="absolute z-10 pointer-events-none bg-blue-500/20 border border-blue-400/60 rounded-sm shadow-sm"
          style={{
            left: Math.min(marquee.startX, marquee.currentX),
            top: Math.min(marquee.startY, marquee.currentY),
            width: Math.abs(marquee.currentX - marquee.startX),
            height: Math.abs(marquee.currentY - marquee.startY),
          }}
        />
      )}

      {/* Columna de accesos directos */}
      <div
        ref={containerRef}
        className="absolute top-12 left-2 sm:left-6 z-0 flex flex-col flex-wrap gap-1 sm:gap-2.5 max-h-[calc(100vh-140px)] pointer-events-auto select-none"
      >
        {shortcuts.map((item, index) => {
          const isSelected = selectedIds.has(item.id);
          return (
            <motion.button
              key={item.id}
              type="button"
              data-shortcut-id={item.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.04, duration: 0.2 }}
              onClick={(e) => handleItemClick(e, item)}
              onDoubleClick={() => handleItemDoubleClick(item)}
              aria-label={t(item.labelKey)}
              className={`group relative flex flex-col items-center justify-center w-[74px] sm:w-[84px] py-1.5 sm:py-2 px-1 rounded-xl transition-all duration-150 text-center outline-none ${
                isSelected
                  ? 'bg-blue-500/25 ring-1 ring-blue-400/50 backdrop-blur-sm shadow-sm'
                  : 'hover:bg-white/10'
              }`}
            >
              {/* Contenedor del ícono */}
              <div
                className={`relative w-12 h-12 sm:w-13 sm:h-13 rounded-2xl flex items-center justify-center border backdrop-blur-md transition-transform duration-200 group-hover:scale-105 group-active:scale-95 ${item.iconBg}`}
              >
                {item.icon}

                {/* Badge opcional */}
                {item.badge && (
                  <span className="absolute -top-1 -right-1 text-[9px] font-bold tracking-tight bg-rose-600 text-white px-1 py-0.2 rounded-md shadow-sm border border-rose-400/40">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Etiqueta de texto */}
              <span
                className={`mt-1 text-[11px] sm:text-xs font-medium leading-tight max-w-[76px] sm:max-w-[82px] line-clamp-2 transition-colors duration-150 ${
                  isSelected ? 'text-white font-semibold' : 'text-white/90 group-hover:text-white'
                }`}
                style={{
                  textShadow: '0 1px 3px rgba(0, 0, 0, 0.9), 0 2px 6px rgba(0, 0, 0, 0.7)',
                }}
              >
                {t(item.labelKey)}
              </span>
            </motion.button>
          );
        })}
      </div>
    </>
  );
}
