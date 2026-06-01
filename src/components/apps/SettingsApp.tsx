'use client';

import React, { useTransition } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Settings, Moon, Sun, Monitor, Palette, MonitorSmartphone, Cpu, HardDrive, MemoryStick, Languages, Globe, Info, Network } from 'lucide-react';
import { useThemeStore } from '@/store/useThemeStore';
import { useRouter, usePathname } from '@/i18n/routing';

export default function SettingsApp() {
  const t = useTranslations('Dock');
  const { theme, setTheme } = useThemeStore();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const changeLanguage = (nextLocale: string) => {
    if (locale === nextLocale) return;
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <div className="h-full w-full bg-[#f8f9fa] dark:bg-[#0d0d0d] text-black dark:text-white overflow-y-auto p-8">
      <div className="max-w-3xl mx-auto space-y-10 pb-12">
        <header className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gray-500/10 flex items-center justify-center border border-gray-500/20 shadow-inner">
            <Settings className="text-gray-600 dark:text-gray-400 animate-[spin_4s_linear_infinite]" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Ajustes del Sistema</h1>
            <p className="text-black/50 dark:text-white/50 mt-1">Personaliza tu experiencia en AKASHI OS.</p>
          </div>
        </header>

        <div className="space-y-10">
          
          {/* Apariencia Section */}
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Palette size={18} className="text-blue-500" />
              Apariencia
            </h2>
            <div className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
              <button 
                onClick={() => setTheme('light')}
                className="w-full text-left p-4 border-b border-black/5 dark:border-white/5 flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Sun size={20} className="text-orange-500" />
                  <div>
                    <div className="font-medium">Modo Claro</div>
                    <div className="text-xs text-black/50 dark:text-white/50">Tema brillante de alto contraste</div>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${theme === 'light' ? 'border-blue-500' : 'border-black/20 dark:border-white/20'}`}>
                  {theme === 'light' && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />}
                </div>
              </button>

              <button 
                onClick={() => setTheme('dark')}
                className="w-full text-left p-4 flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Moon size={20} className="text-indigo-400" />
                  <div>
                    <div className="font-medium">Modo Oscuro</div>
                    <div className="text-xs text-black/50 dark:text-white/50">Tema oscuro amigable para la vista</div>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${theme === 'dark' ? 'border-blue-500' : 'border-black/20 dark:border-white/20'}`}>
                  {theme === 'dark' && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />}
                </div>
              </button>
            </div>
          </section>

          {/* Idioma Section */}
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Languages size={18} className="text-purple-500" />
              Idioma / Language
            </h2>
            <div className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
              <button 
                onClick={() => changeLanguage('es')}
                disabled={isPending}
                className="w-full text-left p-4 border-b border-black/5 dark:border-white/5 flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 transition-colors disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">🇪🇸</span>
                  <div>
                    <div className="font-medium">Español</div>
                    <div className="text-xs text-black/50 dark:text-white/50">Idioma principal</div>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${locale === 'es' ? 'border-blue-500' : 'border-black/20 dark:border-white/20'}`}>
                  {locale === 'es' && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />}
                </div>
              </button>

              <button 
                onClick={() => changeLanguage('en')}
                disabled={isPending}
                className="w-full text-left p-4 flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 transition-colors disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">🇺🇸</span>
                  <div>
                    <div className="font-medium">English</div>
                    <div className="text-xs text-black/50 dark:text-white/50">Second language</div>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${locale === 'en' ? 'border-blue-500' : 'border-black/20 dark:border-white/20'}`}>
                  {locale === 'en' && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />}
                </div>
              </button>
            </div>
          </section>

          {/* Especificaciones del Sistema */}
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Cpu size={18} className="text-rose-500" />
              Especificaciones del Sistema
            </h2>
            <div className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-black/5 dark:border-white/5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center shrink-0">
                  <Cpu size={20} className="text-rose-500" />
                </div>
                <div>
                  <div className="text-xs text-black/50 dark:text-white/50 uppercase font-bold tracking-wider mb-0.5">Procesador</div>
                  <div className="font-medium">AKASHI Neural Engine v2.0</div>
                </div>
              </div>
              <div className="p-4 border-b border-black/5 dark:border-white/5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <MemoryStick size={20} className="text-emerald-500" />
                </div>
                <div>
                  <div className="text-xs text-black/50 dark:text-white/50 uppercase font-bold tracking-wider mb-0.5">Memoria</div>
                  <div className="font-medium">32 GB Unified Memory</div>
                </div>
              </div>
              <div className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                  <HardDrive size={20} className="text-amber-500" />
                </div>
                <div>
                  <div className="text-xs text-black/50 dark:text-white/50 uppercase font-bold tracking-wider mb-0.5">Almacenamiento</div>
                  <div className="font-medium">1 TB NVMe SSD</div>
                </div>
              </div>
            </div>
          </section>

          {/* Red & Conexión */}
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Network size={18} className="text-sky-500" />
              Conexión
            </h2>
            <div className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <Globe size={24} className="text-sky-500" />
                <div>
                  <div className="font-medium">Red Global</div>
                  <div className="text-xs text-green-600 dark:text-green-400 font-medium">Conectado y Seguro</div>
                </div>
              </div>
              <div className="text-xs bg-black/5 dark:bg-white/10 px-3 py-1.5 rounded-full font-mono">
                IP: 192.168.1.OS
              </div>
            </div>
          </section>

          {/* Fondo de Pantalla Section */}
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Monitor size={18} className="text-teal-500" />
              Fondo de Pantalla
            </h2>
            <div className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
              <MonitorSmartphone size={40} className="text-black/20 dark:text-white/20 mb-3" />
              <p className="text-black/50 dark:text-white/50 text-sm">
                Actualmente estás utilizando el fondo interactivo por defecto.<br/>
                La galería de fondos personalizados estará disponible en una próxima actualización.
              </p>
            </div>
          </section>

          {/* Acerca de */}
          <section className="pt-4 border-t border-black/10 dark:border-white/10">
            <div className="flex flex-col items-center justify-center text-center opacity-60 hover:opacity-100 transition-opacity">
              <Info size={24} className="mb-2 text-black/50 dark:text-white/50" />
              <h3 className="font-bold text-lg">AKASHI OS</h3>
              <p className="text-sm text-black/50 dark:text-white/50">Versión 1.0.0 (Build 2026)</p>
              <p className="text-xs text-black/40 dark:text-white/40 mt-2 max-w-sm">
                Un entorno de escritorio web interactivo creado para demostrar habilidades técnicas de desarrollo frontend, diseño UI/UX y arquitectura.
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
