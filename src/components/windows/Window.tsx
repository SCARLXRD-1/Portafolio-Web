'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, TargetAndTransition } from 'framer-motion';
import { AppId, useWindowStore } from '@/store/useWindowStore';
import { X, Minus, Square } from 'lucide-react';
import { useTranslations } from 'next-intl';

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

  const [isDragging, setIsDragging] = useState(false);
  const [size, setSize] = useState({ width: winState?.width || 800, height: winState?.height || 500 });
  const [isResizing, setIsResizing] = useState(false);

  const isMaximized = winState?.isMaximized || isMobile;
  const shouldBeVisible = winState?.isOpen && !winState?.isMinimized;

  // Track whether the window should be visually present (allows exit animation to play)
  const [showWindow, setShowWindow] = useState(shouldBeVisible);
  const [animState, setAnimState] = useState<'idle' | 'minimizing' | 'closing'>('idle');

  const [prevShouldBeVisible, setPrevShouldBeVisible] = useState(shouldBeVisible);

  // Sync visibility without useEffect (derived state pattern to avoid cascading renders)
  if (shouldBeVisible !== prevShouldBeVisible) {
    setPrevShouldBeVisible(shouldBeVisible);
    if (shouldBeVisible) {
      setShowWindow(true);
      setAnimState('idle');
    } else {
      // Determine the correct exit animation based on the store state
      if (winState?.isOpen && winState?.isMinimized) {
        setAnimState('minimizing');
      } else {
        setAnimState('closing');
      }
      setShowWindow(false);
    }
  }

  const handleMinimize = useCallback(() => {
    minimizeWindow(id);
  }, [minimizeWindow, id]);

  const handleClose = useCallback(() => {
    closeWindow(id);
  }, [closeWindow, id]);

  const onExitComplete = useCallback(() => {
    setAnimState('idle');
  }, []);

  const startResize = (e: React.PointerEvent, direction: 'e' | 's' | 'se') => {
    if (isMaximized) return;
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

  // Suction / genie exit animation (minimize) — goes toward dock at bottom center
  const suctionExit: TargetAndTransition = {
    scale: 0.1,
    opacity: 0,
    y: 600,
    scaleX: 0.2,
    filter: 'blur(8px)',
    transition: {
      duration: 0.45,
      ease: [0.55, 0.06, 0.68, 0.19] as [number, number, number, number],
    },
  };

  // Quick fade exit animation (close)
  const closeExit: TargetAndTransition = {
    scale: 0.85,
    opacity: 0,
    y: 20,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  };

  return (
    <AnimatePresence onExitComplete={onExitComplete}>
      {showWindow && (
        <motion.div
          ref={windowRef}
          key={`window-${id}`}
          drag={!isMaximized}
          dragMomentum={false}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          onPointerDownCapture={() => focusWindow(id)}
          layout
          initial={{ scale: 0.8, opacity: 0, y: 20, top: '10%', left: '20%' }}
          animate={{ 
            scale: 1, 
            opacity: 1,
            scaleX: 1,
            filter: 'blur(0px)',
            width: isMaximized ? '100%' : size.width,
            height: isMaximized ? 'calc(100% - 32px)' : size.height,
            x: isMaximized ? 0 : undefined,
            y: isMaximized ? 0 : undefined,
            top: isMaximized ? 32 : '10%',
            left: isMaximized ? 0 : '20%',
          }}
          exit={animState === 'minimizing' ? suctionExit : closeExit}
          whileDrag={{ scale: 1.01, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
          transition={{ type: 'spring', stiffness: 300, damping: 25, mass: 0.8 }}
          style={{ zIndex: winState.zIndex }}
          className={`absolute rounded-xl overflow-hidden bg-white/90 dark:bg-black/60 backdrop-blur-2xl border border-black/10 dark:border-white/10 shadow-2xl flex flex-col pointer-events-auto transition-colors duration-500 ${
            isMaximized ? 'rounded-none' : ''
          }`}
        >
          {/* Title Bar */}
          <div 
            className={`h-10 flex items-center px-4 bg-black/5 dark:bg-white/5 border-b border-black/10 dark:border-white/10 select-none transition-colors duration-500 ${!isMaximized ? 'cursor-move' : ''}`}
            onDoubleClick={() => maximizeWindow(id)}
          >
            {/* macOS style controls */}
            <div 
              className="flex gap-2.5 items-center z-10 pointer-events-auto"
              onPointerDown={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <button 
                onClick={handleClose} 
                className="w-4 h-4 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center group transition-colors duration-150 shadow-sm"
              >
                <X size={10} className="opacity-0 group-hover:opacity-100 text-black font-bold transition-opacity" />
              </button>
              <button 
                onClick={handleMinimize} 
                className="w-4 h-4 rounded-full bg-yellow-500 hover:bg-yellow-600 flex items-center justify-center group transition-colors duration-150 shadow-sm"
              >
                <Minus size={10} className="opacity-0 group-hover:opacity-100 text-black font-bold transition-opacity" />
              </button>
              <button 
                onClick={() => maximizeWindow(id)} 
                className="w-4 h-4 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center group transition-colors duration-150 shadow-sm"
              >
                <Square size={8} className="opacity-0 group-hover:opacity-100 text-black font-bold transition-opacity" />
              </button>
            </div>
            
            {/* Title */}
            <div className="flex-1 text-center text-xs font-semibold text-black/80 dark:text-white/80 -ml-16 tracking-wide transition-colors duration-500">
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
      )}
    </AnimatePresence>
  );
}
