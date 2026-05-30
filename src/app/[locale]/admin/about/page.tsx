'use client';

import React from 'react';

export default function AdminAbout() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-wider text-black dark:text-white">Sobre Mí</h1>
          <p className="text-black/50 dark:text-white/50 mt-2 tracking-wide">Edita tu información personal y biografía.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors shadow-lg shadow-emerald-500/20">
          <span>Guardar Cambios</span>
        </button>
      </div>

      <div className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-6 backdrop-blur-sm">
        <form className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Nombre Completo</label>
                <input type="text" className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Rol / Profesión</label>
                <input type="text" className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
            </div>
            
            <div className="w-full md:w-1/3 flex flex-col items-center justify-center space-y-2">
              <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Foto de Perfil</label>
              <div className="w-32 h-32 rounded-full border-2 border-dashed border-black/20 dark:border-white/20 flex flex-col items-center justify-center text-black/50 dark:text-white/50 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors overflow-hidden">
                <span className="text-xs text-center px-2">Clic para cambiar imagen</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Biografía</label>
            <textarea rows={6} className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Enlace a CV (PDF)</label>
              <input type="text" className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="URL o subir archivo..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Email Público</label>
              <input type="email" className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
