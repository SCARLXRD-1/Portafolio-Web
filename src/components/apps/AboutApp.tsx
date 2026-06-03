'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { User, MapPin, Briefcase, GraduationCap, Heart } from 'lucide-react';
import { insforge } from '@/lib/insforge';

export default function AboutApp() {
  const t = useTranslations('About');
  
  const profileImageUrl = insforge.storage.from('portfolio-assets').getPublicUrl('PERFIL.png').data.publicUrl;

  return (
    <div className="h-full w-full bg-[#0d0d0d]/80 text-white overflow-y-auto select-text p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center md:items-start">
      {/* Left side: Profile Picture & Branding */}
      <div className="flex flex-col items-center text-center md:w-1/2 shrink-0">
        <div className="relative group p-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl flex items-center justify-center">
          <Image 
            src={profileImageUrl} 
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

      {/* Right side: Personal Info */}
      <div className="flex-1 w-full flex flex-col gap-6 mt-4 md:mt-0">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-lg">
          <h3 className="text-sm font-semibold tracking-widest uppercase text-white/40 mb-5 flex items-center gap-2">
            <User size={16} className="text-emerald-400" />
            Información Personal
          </h3>
          
          <div className="space-y-4">
            
            {/* Ubicación row */}
            <div className="flex items-center justify-between py-3 border-b border-white/5 text-sm">
              <span className="text-white/50 flex items-center gap-2">
                <MapPin size={16} className="text-red-400" />
                Ubicación
              </span>
              <span className="font-semibold text-white/90">Villahemosa , Tabasco <br />México.</span>
            </div>
            
            {/* Rol actual row */}
            <div className="flex items-center justify-between py-3 border-b border-white/5 text-sm">
              <span className="text-white/50 flex items-center gap-2">
                <Briefcase size={16} className="text-blue-400" />
                Rol Actual
              </span>
              <span className="font-semibold text-white/90 text-right">Desarrollador Web y<br />Móvil Multiplataforma</span>
            </div>
            
            {/* Educación row */}
            <div className="flex items-center justify-between py-3 border-b border-white/5 text-sm">
              <span className="text-white/50 flex items-center gap-2">
                <GraduationCap size={16} className="text-amber-400" />
                Educación
              </span>
              <span className="font-semibold text-white/90 text-right">Ingeniería en Sistemas<br />Computacionales</span>
            </div>

            {/* Intereses row */}
            <div className="flex items-center justify-between py-3 text-sm">
              <span className="text-white/50 flex items-center gap-2">
                <Heart size={16} className="text-pink-400" />
                Intereses
              </span>
              <span className="font-semibold text-white/90 text-right">Tecnología, Diseño UI, Videojuegos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
