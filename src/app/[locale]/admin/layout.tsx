'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FolderKanban, UserCircle, LogOut, Menu, X, Code2, Award, Lightbulb, Mail, Briefcase, Settings } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { insforge } from '@/lib/insforge';
import { useSystemSounds } from '@/hooks/useSystemSounds';
import ThemeToggle from '@/components/desktop/ThemeToggle';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Extract locale from pathname (e.g. /es/admin -> es)
  const locale = pathname.split('/')[1] || 'es';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAdmin, signOut, isLoading, initialize, accessDenied, deniedEmail, clearDenied } = useAuthStore();
  const { playClick } = useSystemSounds();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleGithubLogin = async () => {
    playClick();
    clearDenied();
    const { data, error } = await insforge.auth.signInWithOAuth({
      provider: 'github',
      redirectTo: window.location.origin + `/${locale}/admin`,
    });
    if (error) {
      console.error('Error logging in:', error.message);
    }
  };

  const handleSignOut = async () => {
    playClick();
    await signOut();
  };

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

  if (isLoading) {
    return <div className="h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-[#0a0a0a] text-black dark:text-white">Cargando...</div>;
  }

  if (!user || !isAdmin) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-[#0a0a0a] text-black dark:text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.05),transparent_50%)] pointer-events-none" />
        
        {/* Access Denied Message */}
        {accessDenied && deniedEmail && (
          <div className="z-10 mb-8 bg-red-500/10 border border-red-500/30 rounded-2xl p-6 max-w-md text-center backdrop-blur-sm">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-red-500 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-red-500 mb-2">⛔ ACCESO DENEGADO</h2>
            <p className="text-sm text-red-400/80 mb-3">
              La cuenta <span className="font-mono font-bold text-red-400">{deniedEmail}</span> no tiene permisos de administrador.
            </p>
            <p className="text-xs text-black/40 dark:text-white/40">
              Se ha cerrado la sesión automáticamente por seguridad. Solo el propietario del portafolio puede acceder a este panel.
            </p>
          </div>
        )}

        {!accessDenied && (
          <>
            <h1 className="text-3xl font-bold mb-4 tracking-wider z-10 text-black dark:text-white">ACCESO RESTRINGIDO</h1>
            <p className="text-black/60 dark:text-white/60 mb-8 max-w-md text-center z-10">
              Esta área es el panel de control del portafolio. Sólo el administrador autorizado puede acceder.
            </p>
          </>
        )}

        <button 
          onClick={handleGithubLogin}
          className="z-10 bg-[#24292e] text-white border border-white/20 hover:bg-[#2f363d] rounded-full py-3 px-8 flex items-center justify-center gap-3 transition-colors shadow-xl text-sm font-medium"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          {accessDenied ? 'Intentar con otra cuenta' : 'Iniciar sesión con GitHub'}
        </button>
      </div>
    );
  }

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
          <button onClick={handleSignOut} className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
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
