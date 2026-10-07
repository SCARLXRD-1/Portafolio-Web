'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { 
  FileText, 
  Mail, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  ArrowUpRight,
  Shield,
  Zap,
  MessageCircle
} from 'lucide-react';
import { useWindowStore } from '@/store/useWindowStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { useSystemSounds } from '@/hooks/useSystemSounds';
import { insforge } from '@/lib/insforge';

interface FeaturedProject {
  id: string;
  title: string;
  desc: string;
  tags: string[];
  demoUrl?: string;
  githubUrl?: string;
  isPrivateRepo?: boolean;
}

export default function RecruiterApp() {
  const t = useTranslations('Recruiter');
  const locale = useLocale();
  const [copied, setCopied] = useState(false);
  const openWindow = useWindowStore((state) => state.openWindow);
  const addNotification = useNotificationStore((state) => state.addNotification);
  const { playClick } = useSystemSounds();

  const isEs = locale === 'es';
  const email = 'jobathanjimenez1265@gmail.com';

  // Solo los 2 proyectos insignia reales y listos
  const defaultProjects: FeaturedProject[] = [
    {
      id: 'pest-control',
      title: 'Pest Control Manager',
      desc: isEs
        ? 'Aplicación SaaS multiplataforma para empresas de control de plagas, diseñada para optimizar la gestión operativa mediante administración de clientes, trabajadores, servicios, reportes técnicos PDF automáticos, geolocalización GPS y sincronización en tiempo real.'
        : 'Cross-platform SaaS application for pest control companies designed to streamline daily operations with client, staff, and service management, automated PDF technical reports, GPS geolocation, and real-time syncing.',
      tags: ['Flutter', 'Dart', 'Supabase', 'PostgreSQL', 'Firebase', 'GPS', 'PDF'],
      demoUrl: 'https://dynova.dpdns.org/#/splash',
      isPrivateRepo: true,
    },
    {
      id: 'mip-d',
      title: 'Sitio Web Corporativo MIP-D',
      desc: isEs
        ? 'Desarrollo de sitio web corporativo enfocado en mejorar la presencia digital de la empresa, proporcionando una plataforma moderna, responsiva y optimizada para la presentación de servicios, captación de clientes y fortalecimiento de marca.'
        : 'Corporate website developed to enhance digital presence with a modern, responsive platform optimized for service showcase, client acquisition, and strong brand identity.',
      tags: ['HTML5', 'CSS3', 'JavaScript', 'PHP', 'Responsive Design'],
      demoUrl: 'https://mipd.site/HOME/Home.html',
      isPrivateRepo: true,
    },
  ];

  const [featuredProjects, setFeaturedProjects] = useState<FeaturedProject[]>(defaultProjects);

  useEffect(() => {
    const loadFeaturedFromDb = async () => {
      try {
        const { data } = await insforge.database
          .from('projects')
          .select('*')
          .eq('is_featured', true)
          .eq('status', 'published')
          .order('sort_order', { ascending: true });

        if (data && data.length > 0) {
          // Filtrar rigurosamente para NO incluir CodeChronicles ni proyectos en desarrollo
          const filtered = data.filter((p) => {
            const titleEs = (p.title_es || '').toLowerCase();
            const titleEn = (p.title_en || '').toLowerCase();
            return !titleEs.includes('codechronicles') && !titleEn.includes('codechronicles');
          });

          if (filtered.length > 0) {
            const mapped: FeaturedProject[] = filtered.map((p) => ({
              id: p.id,
              title: (isEs ? p.title_es : p.title_en) || p.title_es,
              desc: (isEs ? p.description_es : p.description_en) || p.description_es,
              tags: p.technologies || [],
              demoUrl: p.demo_url || undefined,
              githubUrl: p.github_url || undefined,
              isPrivateRepo: Boolean(p.is_private_repo),
            }));
            setFeaturedProjects(mapped);
          }
        }
      } catch (err) {}
    };

    loadFeaturedFromDb();
  }, [isEs]);

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

  const handleOpenChat = () => {
    playClick();
    openWindow('chat');
  };

  const handleOpenProjects = () => {
    playClick();
    openWindow('projects');
  };

  const coreSkills = [
    { 
      name: 'Flutter & Dart', 
      level: isEs ? 'Móvil & Multiplataforma' : 'Mobile & Cross-platform', 
      color: 'from-blue-600/20 to-cyan-600/30 text-cyan-400 border-cyan-500/30' 
    },
    { 
      name: 'Astro & Next.js', 
      level: isEs ? 'Web Moderna & SSR/SSG' : 'Modern Web & SSR/SSG', 
      color: 'from-orange-500/20 to-amber-600/30 text-amber-400 border-amber-500/30' 
    },
    { 
      name: 'React 19 & TypeScript', 
      level: isEs ? 'Frontend Dinámico' : 'Interactive Frontend', 
      color: 'from-sky-500/20 to-blue-600/30 text-sky-400 border-sky-500/30' 
    },
    { 
      name: 'PostgreSQL & Supabase', 
      level: isEs ? 'Bases de Datos & BaaS' : 'Relational DB & BaaS', 
      color: 'from-emerald-500/20 to-teal-600/30 text-emerald-400 border-emerald-500/30' 
    },
    { 
      name: 'Firebase & Cloud Services', 
      level: isEs ? 'Auth, Storage & APIs' : 'Auth, Storage & APIs', 
      color: 'from-yellow-500/20 to-amber-600/30 text-yellow-400 border-yellow-500/30' 
    },
    { 
      name: 'Python, Node.js & REST APIs', 
      level: isEs ? 'Backend & Automatización' : 'Backend & Automation', 
      color: 'from-green-500/20 to-emerald-600/30 text-green-400 border-green-500/30' 
    },
  ];

  return (
    <div className="flex flex-col h-full w-full overflow-y-auto bg-zinc-950 text-white select-none p-4 sm:p-5 space-y-4">
      {/* Header Ejecutivo Conciso */}
      <div className="rounded-2xl bg-zinc-900/80 border border-white/10 p-4 sm:p-5 shadow-xl backdrop-blur-md space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{t('status')}</span>
              </div>
              <span className="text-[11px] text-zinc-400 px-2 py-0.5 rounded-full bg-white/5 border border-white/5">
                📍 Tabasco, México (Remoto / Presencial)
              </span>
            </div>

            <div className="flex items-center gap-2 pt-0.5">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Jhonatan Jimenez
              </h1>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-white/10 text-zinc-300 font-medium">
                AKASHI DEV
              </span>
            </div>

            <p className="text-xs sm:text-sm text-blue-400 font-semibold">
              {t('role')}
            </p>
          </div>

          {/* Botones de acción rápida */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap w-full sm:w-auto shrink-0">
            <button
              type="button"
              onClick={handleOpenResume}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-md transition-all hover:scale-105"
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
            <button
              type="button"
              onClick={handleOpenChat}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-semibold text-white transition-colors"
              title={isEs ? 'Abrir chat' : 'Open chat'}
            >
              <MessageCircle size={14} />
              <span className="hidden sm:inline">Chat</span>
            </button>
          </div>
        </div>

        {/* Resumen Ejecutivo: Una sola frase concisa */}
        <div className="pt-2.5 border-t border-white/10 text-xs sm:text-[13px] text-zinc-300 leading-relaxed">
          <p>{t('summary')}</p>
        </div>
      </div>

      {/* Grid: Competencias Clave & Proyectos Destacados */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Core Competencies (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-zinc-900/60 border border-white/10 p-4 space-y-3 backdrop-blur-md flex flex-col justify-between">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-white">
              <Zap size={15} className="text-amber-400" />
              <span>{t('topSkills')}</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {coreSkills.map((skill) => (
                <div
                  key={skill.name}
                  className={`px-3 py-2.5 rounded-xl border bg-gradient-to-r flex items-center justify-between gap-2 ${skill.color}`}
                >
                  <span className="font-semibold text-xs text-white">{skill.name}</span>
                  <span className="text-[10px] font-mono opacity-85 px-2 py-0.5 rounded bg-black/20 border border-white/5">
                    {skill.level}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
            <span>Stack enfocado & escalable</span>
            <span className="text-emerald-400 font-medium">Multiplataforma</span>
          </div>
        </div>

        {/* Featured Highlights (7 cols) - Solo los 2 proyectos solicitados */}
        <div className="lg:col-span-7 rounded-2xl bg-zinc-900/60 border border-white/10 p-4 space-y-3 backdrop-blur-md flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-white">
              <span className="flex items-center gap-2">
                <Sparkles size={15} className="text-blue-400" />
                {t('featuredProjects')}
              </span>
              <button
                type="button"
                onClick={handleOpenProjects}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-normal transition-colors"
              >
                <span>Explorar todos</span>
                <ArrowUpRight size={12} />
              </button>
            </div>

            <div className="space-y-2.5">
              {featuredProjects.map((item) => (
                <div 
                  key={item.id}
                  className="p-3.5 rounded-xl bg-zinc-800/60 border border-white/5 space-y-2 hover:border-blue-500/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                      {item.title}
                    </h4>

                    {/* Badge Privado y Demo */}
                    <div className="flex items-center gap-2 shrink-0">
                      {item.isPrivateRepo && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-700/60 border border-white/10 text-zinc-300 flex items-center gap-1 font-mono">
                          <Shield size={10} className="text-amber-400" />
                          <span>{t('privateRepo')}</span>
                        </span>
                      )}
                      {item.demoUrl && (
                        <a
                          href={item.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 transition-colors"
                        >
                          <span>{t('liveDemo')}</span>
                          <ExternalLink size={10} />
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="text-[11px] sm:text-xs text-zinc-300/90 leading-relaxed">{item.desc}</p>

                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {item.tags.map((tag) => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-zinc-300 font-mono">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Botones de pie */}
          <div className="pt-2 border-t border-white/5 flex items-center gap-2">
            <button
              type="button"
              onClick={handleOpenContact}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-xs font-semibold text-white transition-colors shadow-sm"
            >
              <Mail size={14} />
              <span>{t('contactMe')}</span>
            </button>
            <button
              type="button"
              onClick={() => window.open('https://github.com/SCARLXRD-1', '_blank', 'noopener,noreferrer')}
              className="flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-xs font-semibold text-zinc-200 transition-colors"
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


