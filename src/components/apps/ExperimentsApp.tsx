'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Lightbulb, Beaker, Loader2 } from 'lucide-react';
import { insforge } from '@/lib/insforge';

export default function ExperimentsApp() {
  const t = useTranslations('Dock');
  const locale = useLocale();
  const isEs = locale === 'es';
  const [experiments, setExperiments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchExperiments();
  }, []);

  const fetchExperiments = async () => {
    try {
      const { data, error } = await insforge.database
        .from('experiments')
        .select('*')
        .order('sort_order', { ascending: false });
        
      if (!error && data) {
        setExperiments(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full w-full bg-[#0d0d0d]/90 text-white overflow-y-auto p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
            <Lightbulb className="text-orange-400" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('experiments')}</h1>
            <p className="text-white/50 mt-1">{isEs ? 'Exploraciones de UI/UX, animaciones y prototipos.' : 'UI/UX explorations, animations, and prototypes.'}</p>
          </div>
        </header>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-white/50" size={48} />
          </div>
        ) : experiments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/10 rounded-3xl bg-white/5">
            <Lightbulb size={48} className="text-white/20 mb-4" />
            <h3 className="text-xl font-medium text-white mb-1">{isEs ? 'Sin experimentos' : 'No experiments'}</h3>
            <p className="text-white/50 text-sm text-center max-w-md">
              {isEs ? 'El laboratorio está vacío en este momento.' : 'The laboratory is empty right now.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {experiments.map((exp, idx) => (
              <div 
                key={exp.id} 
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-orange-500/50 transition-colors animate-in fade-in slide-in-from-bottom-4 group flex flex-col"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="p-6 pb-4 border-b border-white/5">
                  <div className="flex items-center gap-3 mb-2">
                    <Beaker size={18} className="text-orange-400" />
                    <h2 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors">
                      {locale === 'es' ? exp.name_es : exp.name_en}
                    </h2>
                  </div>
                  <p className="text-white/60 text-sm h-10 overflow-hidden line-clamp-2">
                    {locale === 'es' ? exp.description_es : exp.description_en}
                  </p>
                </div>
                
                <div className="flex-1 bg-black/50 p-4 min-h-[250px] relative">
                  {/* Container for raw embed content. Uses dangerouslySetInnerHTML to run iframe or raw html code. */}
                  <div 
                    className="w-full h-full flex items-center justify-center [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:rounded-xl [&>iframe]:border-none"
                    dangerouslySetInnerHTML={{ __html: exp.embed_code }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
