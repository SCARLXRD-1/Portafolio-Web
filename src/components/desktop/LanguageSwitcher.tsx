'use client';

import React, { useTransition, useState, useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLocale = (nextLocale: string) => {
    if (nextLocale === locale) {
      setIsOpen(false);
      return;
    }
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
      setIsOpen(false);
    });
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 transition-colors border border-white/5 disabled:opacity-50 cursor-pointer"
      >
        <Globe size={14} className={isOpen ? "text-emerald-300" : "text-emerald-400"} />
        <span className="font-bold text-[10px] uppercase">
          {locale}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-2 w-32 bg-white/90 dark:bg-black/90 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-lg shadow-xl overflow-hidden py-1 z-50 text-sm"
          >
            <button
              onClick={() => changeLocale('es')}
              className={`w-full text-left px-4 py-2 hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${locale === 'es' ? 'text-emerald-500 font-semibold' : 'text-black dark:text-white'}`}
            >
              Español
            </button>
            <button
              onClick={() => changeLocale('en')}
              className={`w-full text-left px-4 py-2 hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${locale === 'en' ? 'text-emerald-500 font-semibold' : 'text-black dark:text-white'}`}
            >
              English
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
