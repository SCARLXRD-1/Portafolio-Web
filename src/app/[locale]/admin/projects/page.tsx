'use client';

import React, { useState } from 'react';
import { Plus, FolderKanban, Image as ImageIcon, Trash2 } from 'lucide-react';

export default function AdminProjects() {
  const [activeTab, setActiveTab] = useState<'es' | 'en'>('es');
  const [images, setImages] = useState<string[]>([]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-wider text-black dark:text-white">Proyectos</h1>
          <p className="text-black/50 dark:text-white/50 mt-2 tracking-wide">Añade o edita los proyectos que aparecen en tu portafolio.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors shadow-lg shadow-emerald-500/20">
          <Plus size={20} />
          <span>Guardar Proyecto</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <h2 className="text-xl font-semibold text-black dark:text-white mb-4">Detalles del Proyecto</h2>
          
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

          <form className="space-y-4">
            {/* Title depends on language */}
            <div className={activeTab === 'es' ? 'block' : 'hidden'}>
              <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Título (Español)</label>
              <input type="text" className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Ej. Plataforma E-commerce" />
            </div>
            <div className={activeTab === 'en' ? 'block' : 'hidden'}>
              <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Title (English)</label>
              <input type="text" className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Ej. E-commerce Platform" />
            </div>

            {/* Description depends on language */}
            <div className={activeTab === 'es' ? 'block' : 'hidden'}>
              <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Descripción Corta (Español)</label>
              <textarea rows={3} className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" placeholder="Breve descripción de lo que hace el proyecto..." />
            </div>
            <div className={activeTab === 'en' ? 'block' : 'hidden'}>
              <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Short Description (English)</label>
              <textarea rows={3} className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" placeholder="Brief description of what the project does..." />
            </div>

            {/* Common fields for all languages */}
            <div className="pt-4 border-t border-black/10 dark:border-white/10">
              <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Tecnologías (Separadas por comas)</label>
              <input type="text" className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Ej. React, Node.js, PostgreSQL" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Enlace a GitHub</label>
                <input type="url" className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="https://github.com/..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Demo en Vivo</label>
                <input type="url" className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="https://..." />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Galería de Imágenes del Proyecto</label>
              <div className="w-full h-32 rounded-xl bg-black/5 dark:bg-white/5 border-2 border-dashed border-black/20 dark:border-white/20 flex flex-col items-center justify-center text-black/50 dark:text-white/50 cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                <ImageIcon size={24} className="mb-2" />
                <span className="text-sm">Haz clic para subir múltiples imágenes</span>
              </div>
              
              {/* Image Preview Area */}
              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {/* Dummy preview items for UI structure */}
                  <div className="aspect-video bg-black/10 dark:bg-white/10 rounded-lg relative group">
                    <button type="button" className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>

        <div className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-6 backdrop-blur-sm flex flex-col">
          <h2 className="text-xl font-semibold text-black dark:text-white mb-6">Lista de Proyectos</h2>
          <div className="flex-1 flex flex-col items-center justify-center py-12 text-black/50 dark:text-white/50 border-2 border-dashed border-black/10 dark:border-white/10 rounded-xl">
            <FolderKanban size={48} className="mb-4 opacity-50" />
            <p>No hay proyectos publicados.</p>
            <p className="text-sm mt-1">Crea tu primer proyecto a la izquierda.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
