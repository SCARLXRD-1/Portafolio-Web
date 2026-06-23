'use client';

import React, { useState, useEffect } from 'react';
import { Briefcase, Loader2, Calendar } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { insforge } from '@/lib/insforge';
import { translateDate } from '@/utils/dateTranslator';

export default function ExperienceApp() {
  const t = useTranslations('Dock');
  const locale = useLocale();
  const isEs = locale === 'es';
  const [experiences, setExperiences] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const { data, error } = await insforge.database
        .from('experience')
        .select('*')
        .order('sort_order', { ascending: false });
        
      if (!error && data) {
        setExperiences(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full w-full bg-[#f8f9fa] dark:bg-[#0d0d0d] text-black dark:text-white overflow-y-auto p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
            <Briefcase className="text-blue-500" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('experience')}</h1>
            <p className="text-black/50 dark:text-white/50 mt-1">{isEs ? 'Mi trayectoria profesional y académica.' : 'My professional and academic journey.'}</p>
          </div>
        </header>

        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-black/50 dark:text-white/50" size={48} />
          </div>
        )}
        
        {!isLoading && experiences.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-black/10 dark:border-white/10 rounded-3xl bg-black/5 dark:bg-white/5">
            <Briefcase size={48} className="text-black/20 dark:text-white/20 mb-4" />
            <h3 className="text-xl font-medium mb-1">{isEs ? 'No hay experiencia registrada' : 'No experience registered'}</h3>
            <p className="text-black/50 dark:text-white/50 text-sm text-center max-w-md">
              {isEs 
                ? 'Aún no se ha añadido información sobre la trayectoria laboral. Utiliza el panel de administración para empezar.'
                : 'No work history information has been added yet. Use the admin panel to get started.'}
            </p>
          </div>
        )}
        
        {!isLoading && experiences.length > 0 && (
          <div className="relative border-l-2 border-black/10 dark:border-white/10 ml-4 md:ml-6 pl-8 space-y-12">
            {experiences.map((exp, idx) => (
              <div key={exp.id} className="relative animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${idx * 100}ms` }}>
                {/* Timeline dot */}
                <div className="absolute -left-[41px] md:-left-[49px] top-1.5 w-4 h-4 rounded-full bg-blue-500 border-4 border-[#f8f9fa] dark:border-[#0d0d0d]" />
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <h2 className="text-xl font-bold">{locale === 'es' ? exp.title_es : exp.title_en}</h2>
                  <div className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full w-fit">
                    <Calendar size={14} />
                    <span>{translateDate(exp.start_date, isEs)} - {translateDate(exp.end_date, isEs)}</span>
                  </div>
                </div>
                
                <h3 className="text-lg font-medium text-black/70 dark:text-white/70 mb-4">{exp.company}</h3>
                
                <p className="text-black/60 dark:text-white/60 leading-relaxed whitespace-pre-wrap">
                  {locale === 'es' ? exp.description_es : exp.description_en}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
