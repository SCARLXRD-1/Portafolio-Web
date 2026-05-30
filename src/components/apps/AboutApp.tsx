'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Monitor, Cpu, HardDrive } from 'lucide-react';

export default function AboutApp() {
  const t = useTranslations('About');

  return (
    <div className="h-full w-full bg-[#0d0d0d]/80 text-white overflow-y-auto select-text p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center md:items-start">
      {/* Left side: Profile Picture & Branding */}
      <div className="flex flex-col items-center text-center md:w-1/2 shrink-0">
        <div className="relative group p-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl flex items-center justify-center">
          <Image 
            src="/PERFIL.png" 
            alt="Profile Picture" 
            width={240}
            height={240}
            className="w-48 h-48 md:w-56 md:h-56 rounded-full object-cover filter drop-shadow-[0_0_25px_rgba(52,211,153,0.2)] group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        <h2 className="text-xl font-bold mt-4 tracking-wide text-white/90">{t('title')}</h2>
        <p className="text-sm font-medium text-emerald-400 mt-1 uppercase tracking-wider">{t('subtitle')}</p>
        
        <p className="text-sm text-white/70 leading-relaxed mt-4 max-w-sm text-justify md:text-center">
          {t('description')}
        </p>
      </div>

      {/* Right side: System Specifications */}
      <div className="flex-1 w-full flex flex-col gap-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl shadow-lg">
          <h3 className="text-sm font-semibold tracking-widest uppercase text-white/40 mb-4 flex items-center gap-2">
            <Monitor size={16} className="text-emerald-400" />
            {t('systemInfo')}
          </h3>
          
          <div className="space-y-4">
            {/* OS row */}
            <div className="flex items-center justify-between py-2 border-b border-white/5 text-sm">
              <span className="text-white/50">{t('osName')}</span>
              <span className="font-semibold text-white/90">{t('osValue')}</span>
            </div>
            
            {/* Processor row */}
            <div className="flex flex-col gap-1 py-2 border-b border-white/5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-white/50 flex items-center gap-1.5">
                  <Cpu size={14} className="text-blue-400" />
                  {t('processor')}
                </span>
                <span className="font-semibold text-white/90 text-right max-w-50 truncate md:max-w-none">
                  Next.js App
                </span>
              </div>
              <p className="text-xs text-white/40 leading-normal">{t('processorValue')}</p>
            </div>
            
            {/* Memory row */}
            <div className="flex items-center justify-between py-2 text-sm">
              <span className="text-white/50 flex items-center gap-1.5">
                <HardDrive size={14} className="text-purple-400" />
                {t('memory')}
              </span>
              <span className="font-semibold text-white/90">{t('memoryValue')}</span>
            </div>
          </div>
        </div>

        {/* Dynamic decorative hardware chip graphic */}
        <div className="flex-1 min-h-20 rounded-2xl border border-dashed border-white/10 flex items-center justify-center p-4 bg-linear-to-br from-emerald-500/5 to-blue-500/5">
          <div className="text-center">
            <p className="text-xs font-mono text-white/30">AKASHI OS MICROARCHITECTURE</p>
            <p className="text-[10px] font-mono text-emerald-400/50 mt-1 uppercase tracking-widest">status: active // thread_pool_initialized</p>
          </div>
        </div>
      </div>
    </div>
  );
}
