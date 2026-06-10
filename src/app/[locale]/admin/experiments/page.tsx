'use client';

import React, { useState, useEffect } from 'react';
import { Lightbulb, Save, Trash2, Loader2, Code, Edit2, X } from 'lucide-react';
import { insforge } from '@/lib/insforge';
import { toast } from 'react-toastify';

export default function AdminExperiments() {
  const [experiments, setExperiments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name_es: '',
    name_en: '',
    description_es: '',
    description_en: '',
    embed_code: '',
    sort_order: 0
  });

  useEffect(() => {
    fetchExperiments();
  }, []);

  const fetchExperiments = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await insforge.database
        .from('experiments')
        .select('*')
        .order('sort_order', { ascending: false });
        
      if (error) throw error;
      setExperiments(data || []);
      setFormData(prev => ({ ...prev, sort_order: (data?.length || 0) + 1 }));
    } catch (err: any) {
      console.error('Error fetching experiments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!formData.name_es || !formData.embed_code) return;
    
    setIsSaving(true);
    try {
      if (editingId) {
        const { error } = await insforge.database
          .from('experiments')
          .update({
            name_es: formData.name_es,
            name_en: formData.name_en || formData.name_es,
            description_es: formData.description_es,
            description_en: formData.description_en || formData.description_es,
            embed_code: formData.embed_code,
            sort_order: formData.sort_order
          })
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await insforge.database
          .from('experiments')
          .insert([{
            name_es: formData.name_es,
            name_en: formData.name_en || formData.name_es,
            description_es: formData.description_es,
            description_en: formData.description_en || formData.description_es,
            embed_code: formData.embed_code,
            sort_order: formData.sort_order
          }]);
        if (error) throw error;
      }
      
      resetForm();
      fetchExperiments();
      toast.success(editingId ? 'Experimento actualizado' : 'Experimento añadido');
    } catch (err: any) {
      toast.error('Error: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (exp: any) => {
    setEditingId(exp.id);
    setFormData({
      name_es: exp.name_es || '',
      name_en: exp.name_en || '',
      description_es: exp.description_es || '',
      description_en: exp.description_en || '',
      embed_code: exp.embed_code || '',
      sort_order: exp.sort_order || 0
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name_es: '',
      name_en: '',
      description_es: '',
      description_en: '',
      embed_code: '',
      sort_order: experiments.length + 2
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este experimento?')) return;
    try {
      const { error } = await insforge.database.from('experiments').delete().eq('id', id);
      if (error) throw error;
      fetchExperiments();
      toast.success('Experimento eliminado');
    } catch (err: any) {
      toast.error('Error: ' + err.message);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-wider text-black dark:text-white">Laboratorio</h1>
          <p className="text-black/50 dark:text-white/50 mt-2 tracking-wide">Gestiona los experimentos y prototipos de tu portafolio.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-black dark:text-white">
              {editingId ? 'Editar Experimento' : 'Nuevo Experimento'}
            </h2>
            {editingId && (
              <button 
                onClick={resetForm}
                className="text-sm text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white flex items-center gap-1 transition-colors"
              >
                <X size={16} /> Cancelar edición
              </button>
            )}
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Nombre (ES)</label>
                <input 
                  type="text" 
                  value={formData.name_es}
                  onChange={e => setFormData({...formData, name_es: e.target.value})}
                  className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                  placeholder="Ej. Chatbot" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Nombre (EN)</label>
                <input 
                  type="text" 
                  value={formData.name_en}
                  onChange={e => setFormData({...formData, name_en: e.target.value})}
                  className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                  placeholder="Ej. Chatbot" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Descripción (ES)</label>
                <textarea 
                  rows={2} 
                  value={formData.description_es}
                  onChange={e => setFormData({...formData, description_es: e.target.value})}
                  className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" 
                  placeholder="Pequeña descripción..." 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Descripción (EN)</label>
                <textarea 
                  rows={2} 
                  value={formData.description_en}
                  onChange={e => setFormData({...formData, description_en: e.target.value})}
                  className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" 
                  placeholder="Short description..." 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Código Embebido o Enlace</label>
              <textarea 
                rows={4} 
                value={formData.embed_code}
                onChange={e => setFormData({...formData, embed_code: e.target.value})}
                className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 font-mono text-xs text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" 
                placeholder="<iframe... /> o URL" 
              />
            </div>
            
            <button 
              onClick={handleAdd}
              disabled={isSaving || !formData.name_es || !formData.embed_code}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors mt-4 disabled:opacity-50"
            >
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {editingId ? 'Guardar Cambios' : 'Añadir Experimento'}
            </button>
          </div>
        </div>

        <div className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <h2 className="text-xl font-semibold text-black dark:text-white mb-6">Lista de Experimentos</h2>
          <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="animate-spin text-emerald-500" size={32} />
              </div>
            ) : experiments.length === 0 ? (
              <div className="text-center py-12 text-black/50 dark:text-white/50 border-2 border-dashed border-black/10 dark:border-white/10 rounded-xl">
                No hay experimentos registrados aún.
              </div>
            ) : (
              experiments.map(exp => (
                <div key={exp.id} className="p-4 bg-white dark:bg-black/40 border border-black/5 dark:border-white/5 rounded-xl hover:border-emerald-500/50 transition-colors relative group">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-black dark:text-white">{exp.name_es}</h3>
                      <p className="text-xs text-black/50 dark:text-white/50 line-clamp-1">{exp.description_es}</p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEdit(exp)}
                        className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(exp.id)}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="p-2 bg-black/5 dark:bg-white/5 rounded-lg border border-black/5 dark:border-white/5 flex items-center gap-2 mt-3">
                    <Code size={14} className="text-emerald-500" />
                    <span className="text-xs font-mono text-black/60 dark:text-white/60 truncate">{exp.embed_code.substring(0, 50)}...</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
