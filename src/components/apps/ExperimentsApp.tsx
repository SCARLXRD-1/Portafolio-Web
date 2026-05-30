'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Lightbulb, Beaker } from 'lucide-react';

export default function ExperimentsApp() {
  const t = useTranslations('Dock');

  return (
    <div className="h-full w-full bg-[#0d0d0d]/90 text-white overflow-y-auto p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
            <Lightbulb className="text-orange-400" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('experiments')}</h1>
            <p className="text-white/50 mt-1">Exploraciones de UI/UX, animaciones y prototipos.</p>
          </div>
        </header>

        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/10 rounded-3xl bg-white/5">
          <Lightbulb size={48} className="text-white/20 mb-4" />
          <h3 className="text-xl font-medium text-white mb-1">Sin experimentos</h3>
          <p className="text-white/50 text-sm text-center max-w-md">
            El laboratorio está vacío en este momento.
          </p>
        </div>
      </div>
    </div>
  );
}
