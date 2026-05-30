'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Settings, Moon, Sun, Monitor, Palette, MonitorSmartphone } from 'lucide-react';
import { useThemeStore } from '@/store/useThemeStore';

export default function SettingsApp() {
  const t = useTranslations('Dock');
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="h-full w-full bg-[#f8f9fa] dark:bg-[#0d0d0d] text-black dark:text-white overflow-y-auto p-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gray-500/10 flex items-center justify-center border border-gray-500/20">
            <Settings className="text-gray-600 dark:text-gray-400 animate-[spin_4s_linear_infinite]" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Ajustes del Sistema</h1>
            <p className="text-black/50 dark:text-white/50 mt-1">Personaliza tu experiencia en AKASHI OS.</p>
          </div>
        </header>

        <div className="space-y-8">
          {/* Apariencia Section */}
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Palette size={18} className="text-blue-500" />
              Apariencia
            </h2>
            <div className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-black/5 dark:border-white/5 flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <Sun size={20} className="text-orange-500" />
                  <div>
                    <div className="font-medium">Modo Claro</div>
                    <div className="text-xs text-black/50 dark:text-white/50">Tema brillante de alto contraste</div>
                  </div>
                </div>
                <button 
                  onClick={() => setTheme('light')}
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${theme === 'light' ? 'border-blue-500' : 'border-black/20 dark:border-white/20'}`}
                >
                  {theme === 'light' && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />}
                </button>
              </div>

              <div className="p-4 border-b border-black/5 dark:border-white/5 flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <Moon size={20} className="text-indigo-400" />
                  <div>
                    <div className="font-medium">Modo Oscuro</div>
                    <div className="text-xs text-black/50 dark:text-white/50">Tema oscuro amigable para la vista</div>
                  </div>
                </div>
                <button 
                  onClick={() => setTheme('dark')}
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${theme === 'dark' ? 'border-blue-500' : 'border-black/20 dark:border-white/20'}`}
                >
                  {theme === 'dark' && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />}
                </button>
              </div>
            </div>
          </section>

          {/* Fondo de Pantalla Section */}
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Monitor size={18} className="text-emerald-500" />
              Fondo de Pantalla
            </h2>
            <div className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
              <MonitorSmartphone size={40} className="text-black/20 dark:text-white/20 mb-3" />
              <p className="text-black/50 dark:text-white/50 text-sm">
                Actualmente estás utilizando el fondo interactivo (Lottie) por defecto.<br/>
                La personalización de fondos estará disponible pronto.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
