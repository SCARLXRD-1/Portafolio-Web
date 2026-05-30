'use client';

import React from 'react';
import { Briefcase, Plus, Save } from 'lucide-react';

export default function AdminExperience() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-wider text-black dark:text-white">Experiencia</h1>
          <p className="text-black/50 dark:text-white/50 mt-2 tracking-wide">Añade tu experiencia laboral y académica.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors shadow-lg shadow-emerald-500/20">
          <Save size={18} />
          <span>Guardar Cambios</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulario Agregar Experiencia */}
        <div className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-500">
              <Plus size={20} />
            </div>
            <h2 className="text-xl font-semibold text-black dark:text-white">Nueva Experiencia</h2>
          </div>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Cargo / Título</label>
              <input type="text" className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Ej. Desarrollador Frontend" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Empresa / Institución</label>
              <input type="text" className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Nombre de la empresa" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Fecha de Inicio</label>
                <input type="month" className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Fecha de Fin</label>
                <input type="month" className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Descripción</label>
              <textarea rows={4} className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" placeholder="Describe tus responsabilidades y logros..." />
            </div>

            <button type="button" className="w-full py-2.5 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-black dark:text-white font-medium rounded-xl transition-colors mt-4">
              Añadir a la lista
            </button>
          </form>
        </div>

        {/* Lista de Experiencias */}
        <div className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-lg bg-blue-500/20 text-blue-500">
              <Briefcase size={20} />
            </div>
            <h2 className="text-xl font-semibold text-black dark:text-white">Trayectoria Actual</h2>
          </div>

          <div className="space-y-4">
            {/* Lista vacía por defecto como pidió el usuario */}
            <div className="text-center py-12 text-black/50 dark:text-white/50 border-2 border-dashed border-black/10 dark:border-white/10 rounded-xl">
              No hay experiencia registrada aún.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
