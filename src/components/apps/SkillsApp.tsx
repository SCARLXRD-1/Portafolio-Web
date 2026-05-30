'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Code2, Server, Layout, Database } from 'lucide-react';

export default function SkillsApp() {
  const t = useTranslations('Dock');

  const skillCategories = [
    { name: 'Frontend', icon: <Layout className="text-blue-400" size={20} />, color: 'bg-blue-500' },
    { name: 'Backend', icon: <Server className="text-green-400" size={20} />, color: 'bg-green-500' },
    { name: 'Database', icon: <Database className="text-purple-400" size={20} />, color: 'bg-purple-500' },
    { name: 'Other', icon: <Code2 className="text-orange-400" size={20} />, color: 'bg-orange-500' }
  ];

  return (
    <div className="h-full w-full bg-[#0d0d0d]/90 text-white overflow-y-auto p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
            <Code2 className="text-blue-400" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('skills')}</h1>
            <p className="text-white/50 mt-1">Tecnologías y herramientas que domino.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skillCategories.map((category, idx) => (
            <div key={idx} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm relative overflow-hidden group">
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                  {category.icon}
                </div>
                <h2 className="text-lg font-semibold">{category.name}</h2>
              </div>

              <div className="flex flex-col items-center justify-center py-8 text-white/30 text-sm">
                <Code2 size={32} className="mb-2 opacity-20" />
                <p>Sin habilidades</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
