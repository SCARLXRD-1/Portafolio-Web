'use client';

import React from 'react';
import { Plus, FolderKanban } from 'lucide-react';

export default function AdminProjects() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-wider text-black dark:text-white">Proyectos</h1>
          <p className="text-black/50 dark:text-white/50 mt-2 tracking-wide">Añade o edita los proyectos que aparecen en tu portafolio.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors shadow-lg shadow-emerald-500/20">
          <span>Guardar Proyecto</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <h2 className="text-xl font-semibold text-black dark:text-white mb-6">Detalles del Proyecto</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Título</label>
              <input type="text" className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Ej. E-commerce Platform" />
            </div>
            <div>
              <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Descripción Corta</label>
              <textarea rows={3} className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" placeholder="Breve descripción de lo que hace..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Enlace a GitHub</label>
                <input type="text" className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="https://github.com/..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Demo en Vivo</label>
                <input type="text" className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="https://..." />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Imágenes del Proyecto</label>
              <div className="w-full h-32 rounded-xl bg-black/10 dark:bg-white/10 border-2 border-dashed border-black/20 dark:border-white/20 flex flex-col items-center justify-center text-black/50 dark:text-white/50 cursor-pointer hover:bg-black/20 dark:hover:bg-white/20 transition-colors">
                <span className="text-sm">Arrastra imágenes o haz clic aquí</span>
              </div>
            </div>
          </form>
        </div>

        <div className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <h2 className="text-xl font-semibold text-black dark:text-white mb-6">Lista de Proyectos</h2>
          <div className="text-center py-12 text-black/50 dark:text-white/50 border-2 border-dashed border-black/10 dark:border-white/10 rounded-xl">
            No hay proyectos publicados.
          </div>
        </div>
      </div>
    </div>
  );
}
