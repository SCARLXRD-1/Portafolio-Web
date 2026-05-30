'use client';

import React, { useTransition } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const toggleLocale = () => {
    const nextLocale = locale === 'es' ? 'en' : 'es';
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <button
      onClick={toggleLocale}
      disabled={isPending}
      className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 transition-colors border border-white/5 disabled:opacity-50 cursor-pointer"
    >
      <Globe size={14} className="text-emerald-400" />
      <div className="relative w-4 h-4 overflow-hidden flex items-center justify-center font-bold">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={locale}
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -15, opacity: 0 }}
            transition={{ duration: 0.2, type: 'spring', stiffness: 300, damping: 25 }}
            className="absolute text-[10px]"
          >
            {locale.toUpperCase()}
          </motion.span>
        </AnimatePresence>
      </div>
    </button>
  );
}
