'use client';

import React from 'react';
import { Lightbulb } from 'lucide-react';

export default function AdminExperiments() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-wider text-black dark:text-white">Laboratorio</h1>
          <p className="text-black/50 dark:text-white/50 mt-2 tracking-wide">Gestiona los experimentos y prototipos de tu portafolio.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors shadow-lg shadow-emerald-500/20">
          <span>Guardar Experimento</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <h2 className="text-xl font-semibold text-black dark:text-white mb-6">Nuevo Experimento</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Nombre</label>
              <input type="text" className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Ej. Chatbot con IA" />
            </div>
            <div>
              <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Código Embebido o Enlace</label>
              <textarea rows={4} className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" placeholder="<iframe... /> o URL" />
            </div>
          </form>
        </div>

        <div className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <h2 className="text-xl font-semibold text-black dark:text-white mb-6">Lista de Experimentos</h2>
          <div className="text-center py-12 text-black/50 dark:text-white/50 border-2 border-dashed border-black/10 dark:border-white/10 rounded-xl">
            No hay experimentos registrados.
          </div>
        </div>
      </div>
    </div>
  );
}
