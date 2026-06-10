'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Code2, Server, Layout, Database, Wrench, Paintbrush, Loader2 } from 'lucide-react';
import { insforge } from '@/lib/insforge';

export default function SkillsApp() {
  const t = useTranslations('Dock');
  const locale = useLocale();
  const [skills, setSkills] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const { data, error } = await insforge.database
        .from('skills')
        .select('*')
        .order('sort_order', { ascending: true });
        
      if (!error && data) {
        setSkills(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryIcon = (catName: string) => {
    switch (catName) {
      case 'Frontend': return <Layout className="text-blue-400" size={20} />;
      case 'Backend': return <Server className="text-green-400" size={20} />;
      case 'Bases de Datos': return <Database className="text-purple-400" size={20} />;
      case 'Herramientas': return <Wrench className="text-orange-400" size={20} />;
      case 'Diseño': return <Paintbrush className="text-pink-400" size={20} />;
      default: return <Code2 className="text-gray-400" size={20} />;
    }
  };

  const categories = Array.from(new Set(skills.map(s => s.category)));

  return (
    <div className="h-full w-full bg-[#0d0d0d]/90 text-white overflow-y-auto p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
            <Code2 className="text-blue-400" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('skills')}</h1>
            <p className="text-white/50 mt-1">{locale === 'es' ? 'Tecnologías y herramientas que domino.' : 'Technologies and tools I master.'}</p>
          </div>
        </header>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-white/50" size={48} />
          </div>
        ) : skills.length === 0 ? (
          <div className="text-center py-20 text-white/50 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm">
            {locale === 'es' ? 'No hay habilidades registradas.' : 'No skills registered.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categories.map((category, idx) => {
              const categorySkills = skills.filter(s => s.category === category);
              
              return (
                <div key={idx} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm relative overflow-hidden group">
                  <div className="flex items-center gap-3 mb-6 relative z-10">
                    <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                      {getCategoryIcon(category)}
                    </div>
                    <h2 className="text-lg font-semibold">{category}</h2>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 relative z-10">
                    {categorySkills.map(skill => (
                      <div key={skill.id} className="flex flex-col items-center justify-center p-4 bg-black/20 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-xl transition-all group/skill">
                        <div className="w-10 h-10 flex items-center justify-center mb-2 text-white/70 group-hover/skill:text-white transition-colors">
                          {skill.icon && skill.icon.startsWith('<svg') ? (
                            <div dangerouslySetInnerHTML={{ __html: skill.icon }} className="w-8 h-8" />
                          ) : skill.icon ? (
                            <img src={skill.icon} alt={skill.name} className="w-8 h-8 object-contain" />
                          ) : (
                            <Code2 size={24} />
                          )}
                        </div>
                        <span className="text-sm text-center font-medium text-white/80 group-hover/skill:text-white">{skill.name}</span>
                        {skill.proficiency > 0 && (
                          <div className="w-full h-1 bg-white/10 rounded-full mt-3 overflow-hidden">
                            <div 
                              className="h-full bg-blue-500/80 rounded-full transition-all duration-1000"
                              style={{ width: `${skill.proficiency}%` }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
