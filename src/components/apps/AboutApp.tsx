'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { User, MapPin, Briefcase, GraduationCap, Heart } from 'lucide-react';
import { insforge } from '@/lib/insforge';

export default function AboutApp() {
  const locale = useLocale();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data, error } = await insforge.database
          .from('profile_settings')
          .select('*')
          .eq('id', '00000000-0000-0000-0000-000000000001')
          .single();
        
        if (!error && data) {
          setProfile(data);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) {
    return <div className="h-full w-full bg-[#0d0d0d]/80 text-white flex items-center justify-center">Cargando...</div>;
  }

  if (!profile) {
    return <div className="h-full w-full bg-[#0d0d0d]/80 text-white flex items-center justify-center">No se encontró información del perfil.</div>;
  }

  const isEs = locale === 'es';
  const role = isEs ? profile.role_es : profile.role_en;
  const bio = isEs ? profile.bio_es : profile.bio_en;
  const location = isEs ? profile.location_es : profile.location_en;
  // Fallbacks in case they are not in DB yet
  const education = (isEs ? profile.education_es : profile.education_en) || (isEs ? 'Ingeniería en Sistemas Computacionales' : 'Computer Systems Engineering');
  const interests = (isEs ? profile.interests_es : profile.interests_en) || (isEs ? 'Tecnología, Diseño UI, Videojuegos' : 'Technology, UI Design, Video Games');

  return (
    <div className="h-full w-full bg-[#0d0d0d]/80 text-white overflow-y-auto select-text p-4 md:p-8 flex flex-col md:flex-row gap-8 items-center md:items-start transition-colors duration-500">
      {/* Left side: Profile Picture & Branding */}
      <div className="flex flex-col items-center text-center md:w-1/2 shrink-0">
        <div className="relative group p-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl flex items-center justify-center overflow-hidden">
          {profile.avatar_url ? (
            <Image 
              src={profile.avatar_url} 
              alt="Profile Picture" 
              width={240}
              height={240}
              className="w-48 h-48 md:w-56 md:h-56 rounded-full object-cover filter drop-shadow-[0_0_25px_rgba(52,211,153,0.2)] group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-48 h-48 md:w-56 md:h-56 rounded-full bg-gray-800 flex items-center justify-center text-gray-500">
              No Avatar
            </div>
          )}
        </div>
        
        <h2 className="text-xl font-bold mt-4 tracking-wide text-white/90">{profile.display_name}</h2>
        <p className="text-sm font-medium text-emerald-400 mt-1 uppercase tracking-wider">{role}</p>
        
        <p className="text-sm text-white/70 leading-relaxed mt-4 max-w-sm text-justify md:text-center whitespace-pre-wrap">
          {bio}
        </p>
      </div>

      {/* Right side: Personal Info */}
      <div className="flex-1 w-full flex flex-col gap-6 mt-4 md:mt-0">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-lg">
          <h3 className="text-sm font-semibold tracking-widest uppercase text-white/40 mb-5 flex items-center gap-2">
            <User size={16} className="text-emerald-400" />
            {isEs ? 'Información Personal' : 'Personal Info'}
          </h3>
          
          <div className="space-y-4">
            
            {/* Ubicación row */}
            <div className="flex items-center justify-between py-3 border-b border-white/5 text-sm">
              <span className="text-white/50 flex items-center gap-2">
                <MapPin size={16} className="text-red-400" />
                {isEs ? 'Ubicación' : 'Location'}
              </span>
              <span className="font-semibold text-white/90 whitespace-pre-line text-right">{location}</span>
            </div>
            
            {/* Rol actual row */}
            <div className="flex items-center justify-between py-3 border-b border-white/5 text-sm">
              <span className="text-white/50 flex items-center gap-2">
                <Briefcase size={16} className="text-blue-400" />
                {isEs ? 'Rol Actual' : 'Current Role'}
              </span>
              <span className="font-semibold text-white/90 text-right">{role}</span>
            </div>
            
            {/* Educación row */}
            <div className="flex items-center justify-between py-3 border-b border-white/5 text-sm">
              <span className="text-white/50 flex items-center gap-2">
                <GraduationCap size={16} className="text-amber-400" />
                {isEs ? 'Educación' : 'Education'}
              </span>
              <span className="font-semibold text-white/90 text-right">{education}</span>
            </div>

            {/* Intereses row */}
            <div className="flex items-center justify-between py-3 text-sm">
              <span className="text-white/50 flex items-center gap-2">
                <Heart size={16} className="text-pink-400" />
                {isEs ? 'Intereses' : 'Interests'}
              </span>
              <span className="font-semibold text-white/90 text-right">{interests}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
