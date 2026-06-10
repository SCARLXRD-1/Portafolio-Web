'use client';

import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Save, Trash2, Loader2, Calendar } from 'lucide-react';
import { insforge } from '@/lib/insforge';
import { toast } from 'react-toastify';

export default function AdminExperience() {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title_es: '',
    title_en: '',
    company: '',
    start_date: '',
    end_date: '',
    description_es: '',
    description_en: '',
    sort_order: 0
  });

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await insforge.database
        .from('experience')
        .select('*')
        .order('sort_order', { ascending: false });
        
      if (error) throw error;
      setExperiences(data || []);
      setFormData(prev => ({ ...prev, sort_order: (data?.length || 0) + 1 }));
    } catch (err: any) {
      console.error('Error fetching experience:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!formData.title_es || !formData.company) return;
    
    setIsSaving(true);
    try {
      const { error } = await insforge.database
        .from('experience')
        .insert([{
          title_es: formData.title_es,
          title_en: formData.title_en || formData.title_es,
          company: formData.company,
          start_date: formData.start_date,
          end_date: formData.end_date,
          description_es: formData.description_es,
          description_en: formData.description_en || formData.description_es,
          sort_order: formData.sort_order
        }]);

      if (error) throw error;
      
      setFormData({
        title_es: '',
        title_en: '',
        company: '',
        start_date: '',
        end_date: '',
        description_es: '',
        description_en: '',
        sort_order: experiences.length + 2
      });
      fetchExperiences();
      toast.success('Experiencia guardada');
    } catch (err: any) {
      toast.error('Error: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta experiencia?')) return;
    try {
      const { error } = await insforge.database.from('experience').delete().eq('id', id);
      if (error) throw error;
      fetchExperiences();
      toast.success('Experiencia eliminada');
    } catch (err: any) {
      toast.error('Error: ' + err.message);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-wider text-black dark:text-white">Experiencia</h1>
          <p className="text-black/50 dark:text-white/50 mt-2 tracking-wide">Añade tu experiencia laboral y académica.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulario Agregar Experiencia */}
        <div className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-500">
              <Plus size={20} />
            </div>
            <h2 className="text-xl font-semibold text-black dark:text-white">Nueva Experiencia</h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Cargo / Título (ES)</label>
                <input 
                  type="text" 
                  value={formData.title_es}
                  onChange={e => setFormData({...formData, title_es: e.target.value})}
                  className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                  placeholder="Ej. Desarrollador" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Cargo / Título (EN)</label>
                <input 
                  type="text" 
                  value={formData.title_en}
                  onChange={e => setFormData({...formData, title_en: e.target.value})}
                  className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                  placeholder="Ej. Developer" 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Empresa / Institución</label>
              <input 
                type="text" 
                value={formData.company}
                onChange={e => setFormData({...formData, company: e.target.value})}
                className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                placeholder="Nombre de la empresa" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Fecha de Inicio</label>
                <input 
                  type="text" 
                  value={formData.start_date}
                  onChange={e => setFormData({...formData, start_date: e.target.value})}
                  className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                  placeholder="Ej. Ene 2023"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Fecha de Fin</label>
                <input 
                  type="text" 
                  value={formData.end_date}
                  onChange={e => setFormData({...formData, end_date: e.target.value})}
                  className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                  placeholder="Ej. Presente"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Descripción (ES)</label>
                <textarea 
                  rows={4} 
                  value={formData.description_es}
                  onChange={e => setFormData({...formData, description_es: e.target.value})}
                  className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" 
                  placeholder="Describe tus responsabilidades..." 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Descripción (EN)</label>
                <textarea 
                  rows={4} 
                  value={formData.description_en}
                  onChange={e => setFormData({...formData, description_en: e.target.value})}
                  className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" 
                  placeholder="Describe your responsibilities..." 
                />
              </div>
            </div>

            <button 
              onClick={handleAdd}
              disabled={isSaving || !formData.title_es || !formData.company}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors mt-4 disabled:opacity-50"
            >
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              Añadir a la lista
            </button>
          </div>
        </div>

        {/* Lista de Experiencias */}
        <div className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-lg bg-blue-500/20 text-blue-500">
              <Briefcase size={20} />
            </div>
            <h2 className="text-xl font-semibold text-black dark:text-white">Trayectoria Actual</h2>
          </div>

          <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="animate-spin text-emerald-500" size={32} />
              </div>
            ) : experiences.length === 0 ? (
              <div className="text-center py-12 text-black/50 dark:text-white/50 border-2 border-dashed border-black/10 dark:border-white/10 rounded-xl">
                No hay experiencia registrada aún.
              </div>
            ) : (
              experiences.map(exp => (
                <div key={exp.id} className="p-4 bg-white dark:bg-black/40 border border-black/5 dark:border-white/5 rounded-xl hover:border-emerald-500/50 transition-colors relative group">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-black dark:text-white">{exp.title_es}</h3>
                      <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{exp.company}</p>
                    </div>
                    <button 
                      onClick={() => handleDelete(exp.id)}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-black/50 dark:text-white/50 mb-3">
                    <Calendar size={12} />
                    <span>{exp.start_date} - {exp.end_date}</span>
                  </div>
                  <p className="text-sm text-black/70 dark:text-white/70 line-clamp-3">{exp.description_es}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
