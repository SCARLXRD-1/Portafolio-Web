'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { 
  FileText, 
  Mail, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Briefcase, 
  Code2, 
  ArrowUpRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useWindowStore } from '@/store/useWindowStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { useSystemSounds } from '@/hooks/useSystemSounds';

export default function RecruiterApp() {
  const t = useTranslations('Recruiter');
  const locale = useLocale();
  const [copied, setCopied] = useState(false);
  const openWindow = useWindowStore((state) => state.openWindow);
  const addNotification = useNotificationStore((state) => state.addNotification);
  const { playClick } = useSystemSounds();

  const isEs = locale === 'es';
  const email = 'jobathanjimenez1265@gmail.com';

  const handleCopyEmail = () => {
    playClick();
    navigator.clipboard.writeText(email);
    setCopied(true);
    addNotification({
      title: t('emailCopied'),
      message: email,
      type: 'success',
    });
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenResume = () => {
    playClick();
    openWindow('resume');
  };

  const handleOpenContact = () => {
    playClick();
    openWindow('contact');
  };

  const handleOpenProjects = () => {
    playClick();
    openWindow('projects');
  };

  const coreSkills = [
    { name: 'React 19 & Next.js', level: 'Senior', color: 'from-blue-500/20 to-sky-600/30 text-sky-400 border-sky-500/30' },
    { name: 'TypeScript', level: 'Avanzado', color: 'from-blue-600/20 to-indigo-600/30 text-indigo-400 border-indigo-500/30' },
    { name: 'PostgreSQL & InsForge', level: 'Fullstack', color: 'from-emerald-500/20 to-teal-600/30 text-emerald-400 border-emerald-500/30' },
    { name: 'Tailwind CSS & Framer Motion', level: 'UI/UX', color: 'from-cyan-500/20 to-teal-600/30 text-cyan-400 border-cyan-500/30' },
    { name: 'Node.js & REST APIs', level: 'Backend', color: 'from-green-500/20 to-emerald-600/30 text-green-400 border-green-500/30' },
    { name: 'Git & Arquitectura de Software', level: 'Core', color: 'from-purple-500/20 to-indigo-600/30 text-purple-400 border-purple-500/30' },
  ];

  const highlights = [
    {
      title: 'AKASHI OS - Web Portfolio',
      desc: isEs 
        ? 'Sistema operativo completo en el navegador con Next.js, gestor de ventanas real, snap aero, BaaS InsForge y multilingüe.'
        : 'Complete browser operating system with Next.js, native window manager, snap aero, InsForge BaaS and full i18n.',
      tags: ['Next.js', 'TypeScript', 'Zustand', 'InsForge', 'Framer Motion'],
    },
    {
      title: 'CMS & BaaS Architecture',
      desc: isEs
        ? 'Panel administrativo protegido con GitHub OAuth, almacenamiento en la nube para assets y sincronización en tiempo real.'
        : 'Administrative dashboard secured with GitHub OAuth, cloud storage for assets, and real-time syncing.',
      tags: ['PostgreSQL', 'RLS Policies', 'Storage API', 'Auth'],
    },
  ];

  return (
    <div className="flex flex-col h-full w-full overflow-y-auto bg-zinc-950 text-white select-none p-4 sm:p-6 space-y-6">
      {/* Header Ejecutivo */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900/90 via-zinc-900/60 to-zinc-950 border border-white/10 p-5 sm:p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{t('status')}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Jhonatan Jimenez
              <span className="text-xs font-normal px-2 py-0.5 rounded-md bg-white/10 text-zinc-300">
                AKASHI DEV
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 font-medium max-w-xl">
              {t('role')}
            </p>
          </div>

          {/* Botones de acción rápida en header */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap w-full sm:w-auto">
            <button
              type="button"
              onClick={handleOpenResume}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-md transition-all hover:scale-105"
            >
              <FileText size={14} />
              <span>{t('viewCv')}</span>
            </button>
            <button
              type="button"
              onClick={handleCopyEmail}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-xs font-semibold text-zinc-200 transition-colors"
              title={email}
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span className="hidden sm:inline">{copied ? '¡Copiado!' : t('copyEmail')}</span>
            </button>
          </div>
        </div>

        {/* Resumen de 30 segundos */}
        <div className="mt-4 pt-4 border-t border-white/10 text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-3xl">
          {t('summary')}
        </div>
      </div>

      {/* Grid: Competencias Clave & Proyectos Destacados */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Core Competencies */}
        <div className="rounded-2xl bg-zinc-900/60 border border-white/10 p-5 space-y-3.5 backdrop-blur-md">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Zap size={16} className="text-amber-400" />
            <span>{t('topSkills')}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {coreSkills.map((skill) => (
              <div
                key={skill.name}
                className={`p-3 rounded-xl border bg-gradient-to-r flex flex-col justify-between ${skill.color}`}
              >
                <span className="font-semibold text-xs text-white">{skill.name}</span>
                <span className="text-[10px] font-mono opacity-80 mt-1">{skill.level}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Highlights */}
        <div className="rounded-2xl bg-zinc-900/60 border border-white/10 p-5 space-y-3.5 backdrop-blur-md flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm font-semibold text-white">
              <span className="flex items-center gap-2">
                <Sparkles size={16} className="text-blue-400" />
                {t('featuredProjects')}
              </span>
              <button
                type="button"
                onClick={handleOpenProjects}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-normal"
              >
                <span>Explorar todos</span>
                <ArrowUpRight size={12} />
              </button>
            </div>
            <div className="space-y-3">
              {highlights.map((item) => (
                <div 
                  key={item.title}
                  className="p-3 rounded-xl bg-zinc-800/60 border border-white/5 space-y-1.5"
                >
                  <h4 className="text-xs font-bold text-white">{item.title}</h4>
                  <p className="text-[11px] text-zinc-400 leading-snug">{item.desc}</p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {item.tags.map((tag) => (
                      <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-zinc-300 font-mono">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Botones de pie */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={handleOpenContact}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-xs font-semibold text-white transition-colors"
            >
              <Mail size={14} />
              <span>{t('contactMe')}</span>
            </button>
            <button
              type="button"
              onClick={() => window.open('https://github.com/SCARLXRD-1', '_blank', 'noopener,noreferrer')}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-xs font-semibold text-zinc-200 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
              <span>GitHub</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
