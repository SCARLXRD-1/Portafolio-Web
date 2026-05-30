'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FolderKanban, Terminal, UserCircle, MessageSquare } from 'lucide-react';
import { useSpotlightStore } from '@/store/useSpotlightStore';
import { useWindowStore, AppId } from '@/store/useWindowStore';

type ResultItem = {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  action: () => void;
};

export default function Spotlight() {
  const { isOpen, closeSpotlight } = useSpotlightStore();
  const { openWindow } = useWindowStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Handle global clicks and escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) closeSpotlight();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeSpotlight]);

  if (!isOpen) return null;

  // Mock data for search
  const allResults: ResultItem[] = [
    {
      id: 'projects',
      title: 'Proyectos',
      subtitle: 'Aplicación del Sistema',
      icon: <FolderKanban className="text-emerald-500" />,
      action: () => openWindow('projects'),
    },
    {
      id: 'terminal',
      title: 'Terminal',
      subtitle: 'Aplicación del Sistema',
      icon: <Terminal className="text-white" />,
      action: () => openWindow('terminal'),
    },
    {
      id: 'about',
      title: 'Sobre Mí',
      subtitle: 'Aplicación del Sistema',
      icon: <UserCircle className="text-blue-400" />,
      action: () => openWindow('about'),
    },
    {
      id: 'contact',
      title: 'Contacto',
      subtitle: 'Aplicación del Sistema',
      icon: <MessageSquare className="text-purple-400" />,
      action: () => openWindow('contact'),
    },
  ];

  const filteredResults = query
    ? allResults.filter(
        (r) =>
          r.title.toLowerCase().includes(query.toLowerCase()) ||
          r.subtitle.toLowerCase().includes(query.toLowerCase())
      )
    : allResults;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredResults.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredResults.length) % filteredResults.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredResults[selectedIndex]) {
        filteredResults[selectedIndex].action();
        closeSpotlight();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-start justify-center pt-[15vh]">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={closeSpotlight}
      />
      
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.15 }}
          className="relative w-full max-w-2xl bg-white/90 dark:bg-black/80 backdrop-blur-2xl border border-black/10 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden mx-4"
        >
          {/* Search Input */}
          <div className="flex items-center gap-4 px-6 py-4 border-b border-black/10 dark:border-white/10">
            <Search className="text-black/50 dark:text-white/50 shrink-0" size={24} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Búsqueda en Spotlight..."
              className="flex-1 bg-transparent text-xl text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/30 outline-none"
            />
          </div>

          {/* Results List */}
          <div className="max-h-[60vh] overflow-y-auto p-2">
            {filteredResults.length === 0 ? (
              <div className="py-12 text-center text-black/50 dark:text-white/50">
                No se encontraron resultados para "{query}"
              </div>
            ) : (
              filteredResults.map((result, index) => (
                <button
                  key={result.id}
                  onClick={() => {
                    result.action();
                    closeSpotlight();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-colors text-left ${
                    index === selectedIndex
                      ? 'bg-blue-500 text-white dark:bg-white/10 dark:text-white'
                      : 'text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${
                    index === selectedIndex ? 'bg-white/20' : 'bg-black/5 dark:bg-white/5'
                  }`}>
                    {result.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold">{result.title}</h4>
                    <p className={`text-sm ${
                      index === selectedIndex ? 'text-white/80' : 'text-black/50 dark:text-white/50'
                    }`}>
                      {result.subtitle}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
