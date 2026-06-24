'use client';

import React, { useState, useEffect } from 'react';
import { insforge } from '@/lib/insforge';
import { toast } from 'react-toastify';

type ProfileSettings = {
  display_name: string;
  role_es: string;
  role_en: string;
  location_es: string;
  location_en: string;
  bio_es: string;
  bio_en: string;
  cv_url_es: string;
  cv_url_en: string;
  public_email: string;
  avatar_url: string;
};

export default function AdminAbout() {
  const [activeTab, setActiveTab] = useState<'es' | 'en'>('es');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingCv, setUploadingCv] = useState<'es' | 'en' | null>(null);
  
  const [formData, setFormData] = useState<ProfileSettings>({
    display_name: '',
    role_es: '',
    role_en: '',
    location_es: '',
    location_en: '',
    bio_es: '',
    bio_en: '',
    cv_url_es: '',
    cv_url_en: '',
    public_email: '',
    avatar_url: '',
  });

  const PROFILE_ID = '00000000-0000-0000-0000-000000000001';

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data, error } = await insforge.database
        .from('profile_settings')
        .select('*')
        .eq('id', PROFILE_ID)
        .single();
        
      if (error) throw error;
      if (data) {
        setFormData({
          display_name: data.display_name || '',
          role_es: data.role_es || '',
          role_en: data.role_en || '',
          location_es: data.location_es || '',
          location_en: data.location_en || '',
          bio_es: data.bio_es || '',
          bio_en: data.bio_en || '',
          cv_url_es: data.cv_url_es || '',
          cv_url_en: data.cv_url_en || '',
          public_email: data.public_email || '',
          avatar_url: data.avatar_url || '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await insforge.database
        .from('profile_settings')
        .update({
          display_name: formData.display_name,
          role_es: formData.role_es,
          role_en: formData.role_en,
          location_es: formData.location_es,
          location_en: formData.location_en,
          bio_es: formData.bio_es,
          bio_en: formData.bio_en,
          cv_url_es: formData.cv_url_es,
          cv_url_en: formData.cv_url_en,
          public_email: formData.public_email,
          avatar_url: formData.avatar_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', PROFILE_ID);

      if (error) throw error;
      toast.success('Cambios guardados con éxito.');
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast.error('Error al guardar: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `avatar-${Date.now()}.${fileExt}`;
      const filePath = `profile/${fileName}`;

      const { data, error } = await insforge.storage
        .from('portfolio-assets')
        .upload(filePath, file);

      if (error) throw error;

      if (data?.url) {
        setFormData((prev) => ({ ...prev, avatar_url: data.url }));
        toast.success('Imagen subida correctamente. Recuerda guardar los cambios.');
      }
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error('Error al subir la imagen: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>, lang: 'es' | 'en') => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setUploadingCv(lang);
    try {
      const fileExt = file.name.split('.').pop() || 'pdf';
      const fileName = `CV_Jhonatan_Jimenez_${lang}.${fileExt}`;
      const filePath = `cv/${fileName}`;

      const { data, error } = await insforge.storage
        .from('portfolio-assets')
        .upload(filePath, file, { upsert: true });

      if (error) throw error;

      if (data?.url) {
        const urlWithCacheBuster = `${data.url}?v=${Date.now()}`;
        setFormData((prev) => ({ 
          ...prev, 
          [lang === 'es' ? 'cv_url_es' : 'cv_url_en']: urlWithCacheBuster 
        }));
        toast.success(`CV en ${lang === 'es' ? 'Español' : 'Inglés'} subido correctamente. Recuerda guardar.`);
      }
    } catch (error: any) {
      console.error('Error uploading CV:', error);
      toast.error('Error al subir el CV: ' + error.message);
    } finally {
      setUploadingCv(null);
    }
  };

  if (loading) {
    return <div className="animate-pulse flex space-x-4"><div className="flex-1 space-y-6 py-1"><div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div></div></div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-wider text-black dark:text-white">Sobre Mí</h1>
          <p className="text-black/50 dark:text-white/50 mt-2 tracking-wide">Edita tu información personal y biografía en varios idiomas.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-white font-medium rounded-xl transition-colors shadow-lg shadow-emerald-500/20"
        >
          <span>{saving ? 'Guardando...' : 'Guardar Cambios'}</span>
        </button>
      </div>

      <div className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-6 backdrop-blur-sm">
        
        {/* Language Tabs */}
        <div className="flex space-x-2 mb-6 border-b border-black/10 dark:border-white/10 pb-2">
          <button
            onClick={() => setActiveTab('es')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'es'
                ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                : 'text-black/60 dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            Español
          </button>
          <button
            onClick={() => setActiveTab('en')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'en'
                ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                : 'text-black/60 dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            English
          </button>
        </div>

        <form className="space-y-6" onSubmit={handleSave}>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Nombre Completo</label>
                <input name="display_name" value={formData.display_name} onChange={handleChange} type="text" className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Ej. John Doe" />
              </div>
              
              {/* Role depends on language */}
              <div className={activeTab === 'es' ? 'block' : 'hidden'}>
                <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Rol / Profesión (Español)</label>
                <input name="role_es" value={formData.role_es} onChange={handleChange} type="text" className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Ej. Desarrollador Web" />
              </div>
              <div className={activeTab === 'en' ? 'block' : 'hidden'}>
                <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Role / Profession (English)</label>
                <input name="role_en" value={formData.role_en} onChange={handleChange} type="text" className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Ej. Web Developer" />
              </div>

              {/* Location depends on language */}
              <div className={activeTab === 'es' ? 'block' : 'hidden'}>
                <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Ubicación (Español)</label>
                <input name="location_es" value={formData.location_es} onChange={handleChange} type="text" className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Ej. Ciudad, País" />
              </div>
              <div className={activeTab === 'en' ? 'block' : 'hidden'}>
                <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Location (English)</label>
                <input name="location_en" value={formData.location_en} onChange={handleChange} type="text" className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Ej. City, Country" />
              </div>
            </div>
            
            <div className="w-full md:w-1/3 flex flex-col items-center justify-start space-y-2 mt-4 md:mt-0 relative group">
              <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Foto de Perfil</label>
              <div className="w-32 h-32 rounded-full border-2 border-dashed border-black/20 dark:border-white/20 flex flex-col items-center justify-center text-black/50 dark:text-white/50 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors overflow-hidden relative">
                {formData.avatar_url ? (
                  <img src={formData.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs text-center px-2">{uploading ? 'Subiendo...' : 'Clic para subir imagen (.png, .jpg)'}</span>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <span className="text-white text-xs font-medium">Cambiar</span>
                </div>
                <input 
                  type="file" 
                  accept="image/png, image/jpeg, image/webp"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
              </div>
            </div>
          </div>

          {/* Bio depends on language */}
          <div className={activeTab === 'es' ? 'block' : 'hidden'}>
            <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Biografía (Español)</label>
            <textarea name="bio_es" value={formData.bio_es} onChange={handleChange} rows={6} className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" placeholder="Escribe sobre ti..." />
          </div>
          <div className={activeTab === 'en' ? 'block' : 'hidden'}>
            <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Biography (English)</label>
            <textarea name="bio_en" value={formData.bio_en} onChange={handleChange} rows={6} className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" placeholder="Write about yourself..." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-black/10 dark:border-white/10">
            <div className={activeTab === 'es' ? 'block' : 'hidden'}>
              <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Subir CV (PDF - Español)</label>
              <div className="flex items-center gap-2">
                <input 
                  type="file" 
                  accept="application/pdf"
                  onChange={(e) => handleCvUpload(e, 'es')}
                  disabled={uploadingCv === 'es'}
                  className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-sm text-black dark:text-white file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-500/10 file:text-emerald-500 hover:file:bg-emerald-500/20" 
                />
                {formData.cv_url_es && (
                  <a href={formData.cv_url_es} target="_blank" rel="noreferrer" className="text-emerald-500 hover:underline text-sm shrink-0">Ver Actual</a>
                )}
              </div>
            </div>
            
            <div className={activeTab === 'en' ? 'block' : 'hidden'}>
              <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Subir CV (PDF - Inglés)</label>
              <div className="flex items-center gap-2">
                <input 
                  type="file" 
                  accept="application/pdf"
                  onChange={(e) => handleCvUpload(e, 'en')}
                  disabled={uploadingCv === 'en'}
                  className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-sm text-black dark:text-white file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-500/10 file:text-emerald-500 hover:file:bg-emerald-500/20" 
                />
                {formData.cv_url_en && (
                  <a href={formData.cv_url_en} target="_blank" rel="noreferrer" className="text-emerald-500 hover:underline text-sm shrink-0">Ver Actual</a>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Email Público</label>
              <input name="public_email" value={formData.public_email} onChange={handleChange} type="email" className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="correo@ejemplo.com" />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

