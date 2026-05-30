'use client';

import React from 'react';
import { Settings, Save, Image, Palette, Globe } from 'lucide-react';

export default function AdminSettings() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-wider text-black dark:text-white">Ajustes Generales</h1>
          <p className="text-black/50 dark:text-white/50 mt-2 tracking-wide">Configura las preferencias de tu sistema operativo web.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors shadow-lg shadow-emerald-500/20">
          <Save size={18} />
          <span>Guardar Cambios</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Personalización */}
        <div className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-lg bg-purple-500/20 text-purple-500">
              <Palette size={20} />
            </div>
            <h2 className="text-xl font-semibold text-black dark:text-white">Personalización</h2>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-2">Color de Acento del Sistema</label>
              <div className="flex gap-3">
                {['bg-emerald-500', 'bg-blue-500', 'bg-purple-500', 'bg-rose-500', 'bg-yellow-500'].map((color, i) => (
                  <button key={i} className={`w-8 h-8 rounded-full ${color} hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-black focus:ring-${color.replace('bg-', '')}`} />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Nombre de Usuario (Login)</label>
              <input type="text" className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Ej. admin_akashi" />
            </div>
          </div>
        </div>

        {/* Fondo de Pantalla */}
        <div className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-lg bg-blue-500/20 text-blue-500">
              <Image size={20} />
            </div>
            <h2 className="text-xl font-semibold text-black dark:text-white">Fondo de Pantalla</h2>
          </div>

          <div className="space-y-4">
            <div className="w-full aspect-video rounded-xl bg-black/10 dark:bg-white/10 border-2 border-dashed border-black/20 dark:border-white/20 flex flex-col items-center justify-center text-black/50 dark:text-white/50 cursor-pointer hover:bg-black/20 dark:hover:bg-white/20 transition-colors">
              <Image size={32} className="mb-2 opacity-50" />
              <span className="text-sm">Clic para subir nuevo fondo (JSON/Imagen)</span>
            </div>
          </div>
        </div>

        {/* SEO y Metadatos */}
        <div className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-6 backdrop-blur-sm lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-lg bg-orange-500/20 text-orange-500">
              <Globe size={20} />
            </div>
            <h2 className="text-xl font-semibold text-black dark:text-white">SEO y Metadatos Globales</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Título del Sitio</label>
              <input type="text" className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Ej. AKASHI DEV - Portafolio" />
            </div>
            <div>
              <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Palabras Clave (Keywords)</label>
              <input type="text" className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Ej. React, Nextjs, Frontend..." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Descripción del Sitio</label>
              <textarea rows={3} className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" placeholder="Descripción para motores de búsqueda..." />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
