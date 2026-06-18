'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, TargetAndTransition, useDragControls } from 'framer-motion';
import { AppId, useWindowStore } from '@/store/useWindowStore';
import { X, Minus, Square } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSystemSounds } from '@/hooks/useSystemSounds';
import { useMobileDetect } from '@/hooks/useMobileDetect';

interface WindowProps {
  id: AppId;
  children: React.ReactNode;
}

export default function Window({ id, children }: WindowProps) {
  const windowRef = useRef<HTMLDivElement>(null);
  const winState = useWindowStore((state) => state.windows[id]);
  const { closeWindow, minimizeWindow, maximizeWindow, focusWindow } = useWindowStore();
  const t = useTranslations('Dock');
  const isMobile = useMobileDetect();
  const { playOpen, playClose } = useSystemSounds();

  const dragControls = useDragControls();
  const [isDragging, setIsDragging] = useState(false);
  const [size, setSize] = useState({ width: winState?.width || 800, height: winState?.height || 500 });
  const [isResizing, setIsResizing] = useState(false);
  const [snapState, setSnapState] = useState<'none' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'>('none');
  const [hasPlayedOpen, setHasPlayedOpen] = useState(false);

  const isMaximized = winState?.isMaximized || isMobile;

  useEffect(() => {
    if (winState?.isOpen && !winState?.isMinimized && !hasPlayedOpen) {
      playOpen();
      setHasPlayedOpen(true);
    } else if (!winState?.isOpen) {
      setHasPlayedOpen(false);
    }
  }, [winState?.isOpen, winState?.isMinimized, hasPlayedOpen, playOpen]);

  const handleMinimize = useCallback(() => {
    playClose();
    minimizeWindow(id);
  }, [minimizeWindow, id, playClose]);

  const handleClose = useCallback(() => {
    playClose();
    closeWindow(id);
  }, [closeWindow, id, playClose]);

  const startResize = (e: React.PointerEvent, direction: 'e' | 's' | 'se') => {
    if (isMaximized || snapState !== 'none') return;
    e.stopPropagation();
    setIsResizing(true);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size.width;
    const startHeight = size.height;

    const onPointerMove = (moveEvent: PointerEvent) => {
      let newWidth = startWidth;
      let newHeight = startHeight;

      if (direction.includes('e')) {
        newWidth = Math.max(400, startWidth + (moveEvent.clientX - startX));
      }
      if (direction.includes('s')) {
        newHeight = Math.max(300, startHeight + (moveEvent.clientY - startY));
      }

      setSize({ width: newWidth, height: newHeight });
    };

    const onPointerUp = () => {
      setIsResizing(false);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  // Focus window when it opens
  useEffect(() => {
    if (winState?.isOpen && !winState?.isMinimized) {
      focusWindow(id);
    }
  }, [winState?.isOpen, winState?.isMinimized, id, focusWindow]);

  if (!winState || !winState.isOpen) {
    return null;
  }

  return (
    <motion.div
      ref={windowRef}
      key={`window-${id}`}
      drag={!isMaximized}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      onDragStart={() => {
        setIsDragging(true);
        setSnapState('none');
      }}
      onDragEnd={(e, info) => {
        setIsDragging(false);
        const { x, y } = info.point;
        const width = window.innerWidth;
        const height = window.innerHeight;
        const threshold = 30; // pixels from edge

        // Esquinas (Quarters)
        if (x < threshold && y < threshold + 32) {
          if (isMaximized) maximizeWindow(id);
          setSnapState('top-left');
        } else if (x > width - threshold && y < threshold + 32) {
          if (isMaximized) maximizeWindow(id);
          setSnapState('top-right');
        } else if (x < threshold && y > height - threshold - 110) {
          if (isMaximized) maximizeWindow(id);
          setSnapState('bottom-left');
        } else if (x > width - threshold && y > height - threshold - 110) {
          if (isMaximized) maximizeWindow(id);
          setSnapState('bottom-right');
        } 
        // Bordes Laterales (Halves)
        else if (x < threshold) {
          if (isMaximized) maximizeWindow(id);
          setSnapState('left');
        } else if (x > width - threshold) {
          if (isMaximized) maximizeWindow(id);
          setSnapState('right');
        }
        // Borde Superior (Maximize)
        else if (y < threshold + 32) {
          if (!isMaximized) maximizeWindow(id);
          setSnapState('none');
        }
      }}
      onPointerDownCapture={() => focusWindow(id)}
      initial={{ scale: 0.8, opacity: 0, y: 20, top: '10%', left: '20%' }}
      animate={winState.isMinimized ? {
        scale: 0.1,
        opacity: 0,
        y: 600,
        scaleX: 0.2,
        filter: 'blur(8px)',
        transitionEnd: { display: 'none' }
      } : { 
        display: 'flex',
        scale: 1, 
        opacity: 1,
        scaleX: 1,
        filter: 'blur(0px)',
        width: isMaximized ? '100%' : (snapState !== 'none' ? (snapState.includes('left') || snapState.includes('right') ? '50%' : size.width) : size.width),
        height: isMaximized ? 'calc(100% - 32px)' : (snapState !== 'none' ? (snapState.includes('top') || snapState.includes('bottom') ? 'calc(50% - 16px)' : 'calc(100% - 32px)') : size.height),
        x: isMaximized ? 0 : undefined,
        y: isMaximized ? 0 : undefined,
        top: isMaximized || snapState === 'left' || snapState === 'right' || snapState.includes('top') ? 32 : (snapState.includes('bottom') ? '50%' : '10%'),
        left: isMaximized || snapState === 'left' || snapState.includes('left') ? 0 : (snapState === 'right' || snapState.includes('right') ? '50%' : '20%'),
      }}
      whileDrag={{ scale: 1.01, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
      transition={
        isResizing 
          ? { duration: 0 }
          : winState.isMinimized 
            ? { duration: 0.45, ease: [0.55, 0.06, 0.68, 0.19] }
            : { type: 'spring', stiffness: 300, damping: 25, mass: 0.8 }
      }
      style={{ zIndex: winState.zIndex, willChange: 'transform, opacity' }}
      className={`absolute rounded-xl overflow-hidden bg-white/95 dark:bg-[#111111]/90 backdrop-blur-md border border-black/10 dark:border-white/10 shadow-2xl flex-col pointer-events-auto ${
        isMaximized || snapState !== 'none' ? 'rounded-none' : ''
      }`}
    >
          {/* Title Bar */}
          <div 
            className={`h-10 flex items-center px-4 bg-black/5 dark:bg-white/5 border-b border-black/10 dark:border-white/10 select-none ${!isMaximized ? 'cursor-move' : ''}`}
            onDoubleClick={() => maximizeWindow(id)}
            onPointerDown={(e) => {
              if (!isMaximized) dragControls.start(e);
            }}
          >
            {/* macOS style controls */}
            <div 
              className="flex gap-2.5 items-center z-10 pointer-events-auto"
              onPointerDown={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <button 
                onClick={handleClose} 
                className="w-5 h-5 md:w-4 md:h-4 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center group transition-colors duration-150 shadow-sm"
              >
                <X size={10} className="opacity-100 md:opacity-0 group-hover:opacity-100 text-black font-bold transition-opacity" />
              </button>
              <button 
                onClick={handleMinimize} 
                className="w-5 h-5 md:w-4 md:h-4 rounded-full bg-yellow-500 hover:bg-yellow-600 flex items-center justify-center group transition-colors duration-150 shadow-sm"
              >
                <Minus size={10} className="opacity-100 md:opacity-0 group-hover:opacity-100 text-black font-bold transition-opacity" />
              </button>
              <button 
                onClick={() => maximizeWindow(id)} 
                className="w-5 h-5 md:w-4 md:h-4 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center group transition-colors duration-150 shadow-sm"
              >
                <Square size={8} className="opacity-100 md:opacity-0 group-hover:opacity-100 text-black font-bold transition-opacity" />
              </button>
            </div>
            
            {/* Title */}
            <div className="flex-1 text-center text-xs font-semibold text-black/80 dark:text-white/80 -ml-16 tracking-wide">
              {t(id)}
            </div>
          </div>

          {/* Content */}
          <div 
            className={`flex-1 relative overflow-y-auto overflow-x-hidden min-h-0 ${isDragging || isResizing ? 'pointer-events-none' : ''} ${isMaximized && isMobile ? 'pb-28' : ''}`}
            onPointerDownCapture={(e) => {
              // Block drag from starting when clicking inside the window content
              e.stopPropagation();
            }}
          >
            {children}
          </div>

          {/* Resize Handles */}
          {!isMaximized && (
            <>
              <div 
                className="absolute right-0 top-0 bottom-0 w-3 cursor-e-resize hover:bg-white/10 transition-colors z-50"
                onPointerDown={(e) => startResize(e, 'e')}
              />
              <div 
                className="absolute bottom-0 left-0 right-0 h-3 cursor-s-resize hover:bg-white/10 transition-colors z-50"
                onPointerDown={(e) => startResize(e, 's')}
              />
              <div 
                className="absolute right-0 bottom-0 w-5 h-5 cursor-se-resize hover:bg-white/20 transition-colors z-50"
                onPointerDown={(e) => startResize(e, 'se')}
              />
            </>
          )}
        </motion.div>
  );
}
