'use client';

import React from 'react';
import { FolderKanban, MessageSquare, Activity, ArrowRight, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminDashboard() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'es';

  const stats = [
    { label: 'Proyectos Activos', value: '0', icon: FolderKanban, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Mensajes Recibidos', value: '0', icon: MessageSquare, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Vistas al Perfil', value: '0', icon: Activity, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div>
        <h1 className="text-3xl font-bold tracking-wider text-black dark:text-white">Bienvenido, AKASHI</h1>
        <p className="text-black/50 dark:text-white/50 mt-2 tracking-wide">Aquí tienes un resumen de tu portafolio. La base de datos se conectará próximamente.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="p-6 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 backdrop-blur-sm flex items-center justify-between hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
            <div>
              <p className="text-black/50 dark:text-white/50 text-sm font-medium mb-1 tracking-wide">{stat.label}</p>
              <p className="text-4xl font-bold text-black dark:text-white">{stat.value}</p>
            </div>
            <div className={`p-4 rounded-xl ${stat.bg}`}>
              <stat.icon size={28} className={stat.color} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 backdrop-blur-sm">
          <h3 className="text-lg font-semibold mb-4 border-b border-black/10 dark:border-white/10 pb-4 tracking-wide text-black/80 dark:text-white/80">Acciones Rápidas</h3>
          <div className="space-y-3">
            <Link href={`/${locale}/admin/projects`} className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-black/40 hover:bg-black/5 dark:hover:bg-white/10 border border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10 transition-all group">
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <FolderKanban size={20} />
                </div>
                <div>
                  <p className="font-medium text-black dark:text-white">Gestionar Proyectos</p>
                  <p className="text-xs text-black/50 dark:text-white/40">Añade, edita o elimina proyectos</p>
                </div>
              </div>
              <ArrowRight size={18} className="text-black/30 dark:text-white/30 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link href={`/${locale}/admin/about`} className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-black/40 hover:bg-black/5 dark:hover:bg-white/10 border border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10 transition-all group">
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-lg bg-blue-500/20 text-blue-400">
                  <UserCircle size={20} />
                </div>
                <div>
                  <p className="font-medium text-black dark:text-white">Actualizar Perfil</p>
                  <p className="text-xs text-black/50 dark:text-white/40">Edita tu bio, habilidades y estado</p>
                </div>
              </div>
              <ArrowRight size={18} className="text-black/30 dark:text-white/30 group-hover:text-blue-500 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link href={`/${locale}/admin/certificates`} className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-black/40 hover:bg-black/5 dark:hover:bg-white/10 border border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10 transition-all group">
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-lg bg-yellow-500/20 text-yellow-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
                </div>
                <div>
                  <p className="font-medium text-black dark:text-white">Gestionar Certificados</p>
                  <p className="text-xs text-black/50 dark:text-white/40">Sube y organiza tus certificados</p>
                </div>
              </div>
              <ArrowRight size={18} className="text-black/30 dark:text-white/30 group-hover:text-yellow-500 dark:group-hover:text-yellow-400 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 backdrop-blur-sm flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center mb-4">
            <Activity size={32} className="text-black/30 dark:text-white/30" />
          </div>
          <h3 className="text-lg font-medium text-black/70 dark:text-white/70 mb-2">Métricas de Rendimiento</h3>
          <p className="text-sm text-black/50 dark:text-white/40 max-w-sm">
            Las estadísticas detalladas y analíticas de visitas estarán disponibles cuando se conecte la base de datos de Insforge/Neon.
          </p>
        </div>
      </div>
    </div>
  );
}
