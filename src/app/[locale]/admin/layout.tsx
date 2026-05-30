'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FolderKanban, UserCircle, LogOut, Menu, X, Code2, Award, Lightbulb, Mail, Briefcase, Settings } from 'lucide-react';
import ThemeToggle from '@/components/desktop/ThemeToggle';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Extract locale from pathname (e.g. /es/admin -> es)
  const locale = pathname.split('/')[1] || 'es';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Dashboard', href: `/${locale}/admin`, icon: LayoutDashboard },
    { name: 'Proyectos', href: `/${locale}/admin/projects`, icon: FolderKanban },
    { name: 'Experiencia', href: `/${locale}/admin/experience`, icon: Briefcase },
    { name: 'Certificados', href: `/${locale}/admin/certificates`, icon: Award },
    { name: 'Habilidades', href: `/${locale}/admin/skills`, icon: Code2 },
    { name: 'Laboratorio', href: `/${locale}/admin/experiments`, icon: Lightbulb },
    { name: 'Mensajes', href: `/${locale}/admin/contact`, icon: Mail },
    { name: 'Sobre Mí', href: `/${locale}/admin/about`, icon: UserCircle },
    { name: 'Ajustes', href: `/${locale}/admin/settings`, icon: Settings },
  ];

  return (
    <div className="flex h-screen w-full bg-gray-50 dark:bg-[#0a0a0a] text-black dark:text-white font-sans overflow-hidden transition-colors duration-500">
      
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-black/50 border-r border-black/10 dark:border-white/10 flex flex-col transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center justify-between md:justify-center px-6 border-b border-black/10 dark:border-white/10 shrink-0">
          <h1 className="text-lg font-black tracking-wider text-emerald-500 dark:text-emerald-400">DASHBOARD</h1>
          <button 
            className="md:hidden p-2 text-black/60 dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          {navLinks.map((link) => {
            const isActive = link.href === `/${locale}/admin` 
              ? pathname === link.href 
              : pathname.startsWith(link.href);

            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30'
                    : 'text-black/60 dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white border border-transparent'
                }`}
              >
                <link.icon size={20} />
                <span className="font-medium tracking-wide">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-black/10 dark:border-white/10">
          <button className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
            <LogOut size={20} />
            <span className="font-medium tracking-wide">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/20 backdrop-blur-xl flex items-center justify-between px-4 md:px-8 shrink-0 transition-colors duration-500">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 text-black/60 dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h2 className="text-lg font-semibold text-black/90 dark:text-white/90 capitalize tracking-wide hidden sm:block">
              {pathname.split('/').pop() === 'admin' ? 'Visión General' : pathname.split('/').pop()}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {/* User Profile */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-black/70 dark:text-white/70 hidden sm:block">AKASHI DEV</span>
              <img src="/PERFIL.png" alt="Admin" className="w-8 h-8 rounded-full border-2 border-emerald-500/50 object-cover" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.05),transparent_50%)] pointer-events-none" />
          <div className="relative z-10 h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
