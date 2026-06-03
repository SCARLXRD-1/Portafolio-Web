'use client';

import React, { useState } from 'react';

export default function AdminAbout() {
  const [activeTab, setActiveTab] = useState<'es' | 'en'>('es');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-wider text-black dark:text-white">Sobre Mí</h1>
          <p className="text-black/50 dark:text-white/50 mt-2 tracking-wide">Edita tu información personal y biografía en varios idiomas.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors shadow-lg shadow-emerald-500/20">
          <span>Guardar Cambios</span>
        </button>
      </div>

      <div className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-6 backdrop-blur-sm">
        
        {/* Language Tabs */}
        <div className="flex space-x-2 mb-6 border-b border-black/10 dark:border-white/10 pb-2">
          <button
            onClick={() => setActiveTab('es')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'es'
                ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                : 'text-black/60 dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            Español
          </button>
          <button
            onClick={() => setActiveTab('en')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'en'
                ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                : 'text-black/60 dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            English
          </button>
        </div>

        <form className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Nombre Completo</label>
                <input type="text" className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Ej. John Doe" />
              </div>
              
              {/* Role depends on language */}
              <div className={activeTab === 'es' ? 'block' : 'hidden'}>
                <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Rol / Profesión (Español)</label>
                <input type="text" className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Ej. Desarrollador Web" />
              </div>
              <div className={activeTab === 'en' ? 'block' : 'hidden'}>
                <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Role / Profession (English)</label>
                <input type="text" className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Ej. Web Developer" />
              </div>

              {/* Location depends on language */}
              <div className={activeTab === 'es' ? 'block' : 'hidden'}>
                <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Ubicación (Español)</label>
                <input type="text" className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Ej. Ciudad, País" />
              </div>
              <div className={activeTab === 'en' ? 'block' : 'hidden'}>
                <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Location (English)</label>
                <input type="text" className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Ej. City, Country" />
              </div>
            </div>
            
            <div className="w-full md:w-1/3 flex flex-col items-center justify-start space-y-2 mt-4 md:mt-0">
              <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Foto de Perfil</label>
              <div className="w-32 h-32 rounded-full border-2 border-dashed border-black/20 dark:border-white/20 flex flex-col items-center justify-center text-black/50 dark:text-white/50 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors overflow-hidden">
                <span className="text-xs text-center px-2">Clic para subir imagen (.png, .jpg)</span>
              </div>
            </div>
          </div>

          {/* Bio depends on language */}
          <div className={activeTab === 'es' ? 'block' : 'hidden'}>
            <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Biografía (Español)</label>
            <textarea rows={6} className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" placeholder="Escribe sobre ti..." />
          </div>
          <div className={activeTab === 'en' ? 'block' : 'hidden'}>
            <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Biography (English)</label>
            <textarea rows={6} className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" placeholder="Write about yourself..." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-black/10 dark:border-white/10">
            <div>
              <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Enlace a CV (PDF)</label>
              <input type="text" className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="URL del CV..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Email Público</label>
              <input type="email" className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="correo@ejemplo.com" />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

