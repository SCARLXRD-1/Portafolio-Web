'use client';

import React, { useTransition } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Settings, Moon, Sun, Monitor, Palette, MonitorSmartphone, Cpu, HardDrive, MemoryStick, Languages, Globe, Info, Network, Image as ImageIcon } from 'lucide-react';
import { useThemeStore } from '@/store/useThemeStore';
import { useWindowStore } from '@/store/useWindowStore';
import { WALLPAPERS } from '@/constants/wallpapers';
import { useRouter, usePathname } from '@/i18n/routing';
import { useSystemSounds } from '@/hooks/useSystemSounds';

export default function SettingsApp() {
  const t = useTranslations('Dock');
  const { theme, setTheme } = useThemeStore();
  const locale = useLocale();
  const isEs = locale === 'es';
  const router = useRouter();
  const pathname = usePathname();
  const wallpaperId = useWindowStore(state => state.wallpaperId);
  const setWallpaperId = useWindowStore(state => state.setWallpaperId);
  const [isPending, startTransition] = useTransition();
  const changeLanguage = (nextLocale: string) => {
    if (locale === nextLocale) return;
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale, scroll: false } as any);
    });
  };

  return (
    <div className="h-full w-full bg-[#f8f9fa] dark:bg-[#0d0d0d] text-black dark:text-white overflow-y-auto p-4 sm:p-8">
      <div className="max-w-3xl mx-auto space-y-10 pb-12">
        <header className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gray-500/10 flex items-center justify-center border border-gray-500/20 shadow-inner">
            <Settings className="text-gray-600 dark:text-gray-400 animate-[spin_4s_linear_infinite]" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{isEs ? 'Ajustes del Sistema' : 'System Settings'}</h1>
            <p className="text-black/50 dark:text-white/50 mt-1">{isEs ? 'Personaliza tu experiencia en AKASHI OS.' : 'Customize your experience in AKASHI OS.'}</p>
          </div>
        </header>

        <div className="space-y-10">
          
          {/* Apariencia Section */}
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Palette size={18} className="text-blue-500" />
              {isEs ? 'Apariencia' : 'Appearance'}
            </h2>
            <div className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
              <button 
                onClick={() => setTheme('light')}
                className="w-full text-left p-4 border-b border-black/5 dark:border-white/5 flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Sun size={20} className="text-orange-500" />
                  <div>
                    <div className="font-medium">{isEs ? 'Modo Claro' : 'Light Mode'}</div>
                    <div className="text-xs text-black/50 dark:text-white/50">{isEs ? 'Tema brillante de alto contraste' : 'High contrast bright theme'}</div>
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
                    <div className="font-medium">{isEs ? 'Modo Oscuro' : 'Dark Mode'}</div>
                    <div className="text-xs text-black/50 dark:text-white/50">{isEs ? 'Tema oscuro amigable para la vista' : 'Eye-friendly dark theme'}</div>
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
                    <div className="text-xs text-black/50 dark:text-white/50">{isEs ? 'Idioma principal' : 'Main language'}</div>
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
                    <div className="text-xs text-black/50 dark:text-white/50">{isEs ? 'Idioma secundario' : 'Second language'}</div>
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
              {isEs ? 'Especificaciones del Sistema' : 'System Specifications'}
            </h2>
            <div className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-black/5 dark:border-white/5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center shrink-0">
                  <Cpu size={20} className="text-rose-500" />
                </div>
                <div>
                  <div className="text-xs text-black/50 dark:text-white/50 uppercase font-bold tracking-wider mb-0.5">{isEs ? 'Procesador' : 'Processor'}</div>
                  <div className="font-medium">AKASHI Neural Engine v2.0</div>
                </div>
              </div>
              <div className="p-4 border-b border-black/5 dark:border-white/5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <MemoryStick size={20} className="text-emerald-500" />
                </div>
                <div>
                  <div className="text-xs text-black/50 dark:text-white/50 uppercase font-bold tracking-wider mb-0.5">{isEs ? 'Memoria' : 'Memory'}</div>
                  <div className="font-medium">32 GB Unified Memory</div>
                </div>
              </div>
              <div className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                  <HardDrive size={20} className="text-amber-500" />
                </div>
                <div>
                  <div className="text-xs text-black/50 dark:text-white/50 uppercase font-bold tracking-wider mb-0.5">{isEs ? 'Almacenamiento' : 'Storage'}</div>
                  <div className="font-medium">1 TB NVMe SSD</div>
                </div>
              </div>
            </div>
          </section>

          {/* Red & Conexión */}
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Network size={18} className="text-sky-500" />
              {isEs ? 'Conexión' : 'Connection'}
            </h2>
            <div className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <Globe size={24} className="text-sky-500" />
                <div>
                  <div className="font-medium">{isEs ? 'Red Global' : 'Global Network'}</div>
                  <div className="text-xs text-green-600 dark:text-green-400 font-medium">{isEs ? 'Conectado y Seguro' : 'Connected and Secure'}</div>
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
              <ImageIcon size={18} className="text-teal-500" />
              {isEs ? 'Fondo de Pantalla' : 'Wallpaper'}
            </h2>
            <div className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-4 shadow-sm">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {WALLPAPERS.map((wp) => (
                  <button
                    key={wp.id}
                    onClick={() => setWallpaperId(wp.id)}
                    className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all hover:scale-105 active:scale-95 ${
                      wallpaperId === wp.id 
                        ? 'border-blue-500 shadow-md scale-105' 
                        : 'border-transparent hover:border-black/20 dark:hover:border-white/20'
                    }`}
                  >
                    {wp.type === 'color' ? (
                      <div className="w-full h-full" style={{ backgroundColor: wp.url }} />
                    ) : (
                      <img src={wp.url} alt={wp.name} className="w-full h-full object-cover" />
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-md p-2">
                      <p className="text-[10px] font-medium text-white text-center truncate">{wp.name}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>



          {/* Acerca de */}
          <section className="pt-4 border-t border-black/10 dark:border-white/10">
            <div className="flex flex-col items-center justify-center text-center opacity-60 hover:opacity-100 transition-opacity">
              <Info size={24} className="mb-2 text-black/50 dark:text-white/50" />
              <h3 className="font-bold text-lg">AKASHI OS</h3>
              <p className="text-sm text-black/50 dark:text-white/50">{isEs ? 'Versión 1.0.0 (Build 2026)' : 'Version 1.0.0 (Build 2026)'}</p>
              <p className="text-xs text-black/40 dark:text-white/40 mt-2 max-w-sm">
                {isEs 
                  ? 'Un entorno de escritorio web interactivo creado para demostrar habilidades técnicas de desarrollo frontend, diseño UI/UX y arquitectura.'
                  : 'An interactive web desktop environment created to showcase technical frontend development skills, UI/UX design, and architecture.'}
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
