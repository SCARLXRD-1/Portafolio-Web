'use client';

import React from 'react';
import { Briefcase } from 'lucide-react';

export default function ExperienceApp() {
  const experiences: any[] = []; // Vacío por diseño

  return (
    <div className="h-full w-full bg-[#f8f9fa] dark:bg-[#0d0d0d] text-black dark:text-white overflow-y-auto p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
            <Briefcase className="text-blue-500" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Experiencia</h1>
            <p className="text-black/50 dark:text-white/50 mt-1">Mi trayectoria profesional y académica.</p>
          </div>
        </header>

        {experiences.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-black/10 dark:border-white/10 rounded-3xl bg-black/5 dark:bg-white/5">
            <Briefcase size={48} className="text-black/20 dark:text-white/20 mb-4" />
            <h3 className="text-xl font-medium mb-1">No hay experiencia registrada</h3>
            <p className="text-black/50 dark:text-white/50 text-sm text-center max-w-md">
              Aún no se ha añadido información sobre la trayectoria laboral. Utiliza el panel de administración para empezar.
            </p>
          </div>
        ) : (
          <div className="relative border-l-2 border-black/10 dark:border-white/10 ml-4 md:ml-6 pl-8 space-y-12">
            {/* Aquí iría el mapeo de experiencias cuando existan */}
          </div>
        )}
      </div>
    </div>
  );
}
