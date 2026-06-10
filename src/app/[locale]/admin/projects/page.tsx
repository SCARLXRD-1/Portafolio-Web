'use client';

import React, { useState, useEffect } from 'react';
import { Plus, FolderKanban, Image as ImageIcon, Trash2, Edit2, X, Loader2 } from 'lucide-react';
import { insforge } from '@/lib/insforge';
import { toast } from 'react-toastify';

type Project = {
  id: string;
  title_es: string;
  title_en: string;
  description_es: string;
  description_en: string;
  technologies: string[];
  github_url: string;
  demo_url: string;
  image_urls: string[];
  sort_order: number;
  status: 'draft' | 'published';
};

const defaultForm: Partial<Project> = {
  title_es: '',
  title_en: '',
  description_es: '',
  description_en: '',
  technologies: [],
  github_url: '',
  demo_url: '',
  image_urls: [],
  sort_order: 0,
  status: 'published',
};

export default function AdminProjects() {
  const [activeTab, setActiveTab] = useState<'es' | 'en'>('es');
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState<Partial<Project>>(defaultForm);
  const [techInput, setTechInput] = useState('');
  
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await insforge.database
        .from('projects')
        .select('*')
        .order('sort_order', { ascending: true });
        
      if (error) throw error;
      setProjects(data || []);
    } catch (err: any) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = (proj: Project) => {
    setEditingId(proj.id);
    setFormData(proj);
    setTechInput(proj.technologies?.join(', ') || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData(defaultForm);
    setTechInput('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const techs = techInput.split(',').map(t => t.trim()).filter(t => t.length > 0);
      
      const payload = {
        title_es: formData.title_es,
        title_en: formData.title_en,
        description_es: formData.description_es,
        description_en: formData.description_en,
        technologies: techs,
        github_url: formData.github_url,
        demo_url: formData.demo_url,
        image_urls: formData.image_urls || [],
        sort_order: Number(formData.sort_order) || 0,
        status: formData.status || 'published',
      };

      if (editingId) {
        const { error } = await insforge.database.from('projects').update(payload).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await insforge.database.from('projects').insert([payload]);
        if (error) throw error;
      }
      
      handleCancel();
      fetchProjects();
      toast.success(editingId ? 'Proyecto actualizado' : 'Proyecto creado');
    } catch (err: any) {
      console.error('Save error:', err);
      toast.error('Error al guardar: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este proyecto?')) return;
    try {
      const { error } = await insforge.database.from('projects').delete().eq('id', id);
      if (error) throw error;
      fetchProjects();
      toast.success('Proyecto eliminado');
    } catch (err: any) {
      toast.error('Error: ' + err.message);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const newFiles = Array.from(e.target.files);
    setUploading(true);
    try {
      const { compressImage } = await import('@/utils/imageCompressor');

      const uploadPromises = newFiles.map(async (file) => {
        try {
          const compressedFile = await compressImage(file);
          const fileExt = compressedFile.name.split('.').pop();
          const fileName = `img_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
          const filePath = `projects/${fileName}`;

          const { data, error } = await insforge.storage
            .from('portfolio-assets')
            .upload(filePath, compressedFile);
          
          if (error) throw error;
          return data?.url;
        } catch (err) {
          console.error('Error uploading file:', err);
          return null;
        }
      });
      
      const results = await Promise.all(uploadPromises);
      const newUrls = results.filter(url => url !== null) as string[];
      
      setFormData(prev => ({
        ...prev,
        image_urls: [...(prev.image_urls || []), ...newUrls]
      }));
      toast.success(`${newUrls.length} imágenes subidas correctamente`);
      
    } catch (error: any) {
      console.error('Upload error', error);
      toast.error('Error al subir imágenes: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => {
      const newImages = [...(prev.image_urls || [])];
      newImages.splice(index, 1);
      return { ...prev, image_urls: newImages };
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-wider text-black dark:text-white">Proyectos</h1>
          <p className="text-black/50 dark:text-white/50 mt-2 tracking-wide">Añade o edita los proyectos que aparecen en tu portafolio.</p>
        </div>
        {editingId && (
          <button onClick={handleCancel} className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 font-medium rounded-xl transition-colors">
            Cancelar Edición
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <h2 className="text-xl font-semibold text-black dark:text-white mb-4">
            {editingId ? 'Editando Proyecto' : 'Nuevo Proyecto'}
          </h2>
          
          <div className="flex space-x-2 mb-6 border-b border-black/10 dark:border-white/10 pb-2">
            <button
              onClick={() => setActiveTab('es')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'es' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'text-black/60 dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              Español
            </button>
            <button
              onClick={() => setActiveTab('en')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'en' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'text-black/60 dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              English
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleSave}>
            <div className={activeTab === 'es' ? 'block' : 'hidden'}>
              <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Título (Español) *</label>
              <input required={activeTab === 'es'} name="title_es" value={formData.title_es} onChange={handleInputChange} type="text" className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Ej. Plataforma E-commerce" />
            </div>
            <div className={activeTab === 'en' ? 'block' : 'hidden'}>
              <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Title (English) *</label>
              <input required={activeTab === 'en'} name="title_en" value={formData.title_en} onChange={handleInputChange} type="text" className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Ej. E-commerce Platform" />
            </div>

            <div className={activeTab === 'es' ? 'block' : 'hidden'}>
              <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Descripción (Español)</label>
              <textarea name="description_es" value={formData.description_es} onChange={handleInputChange} rows={3} className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" placeholder="Breve descripción..." />
            </div>
            <div className={activeTab === 'en' ? 'block' : 'hidden'}>
              <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Description (English)</label>
              <textarea name="description_en" value={formData.description_en} onChange={handleInputChange} rows={3} className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" placeholder="Brief description..." />
            </div>

            <div className="pt-4 border-t border-black/10 dark:border-white/10">
              <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Tecnologías (Separadas por comas)</label>
              <input type="text" value={techInput} onChange={(e) => setTechInput(e.target.value)} className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Ej. React, Node.js, PostgreSQL" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Enlace a GitHub</label>
                <input name="github_url" value={formData.github_url} onChange={handleInputChange} type="url" className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="https://github.com/..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Demo en Vivo</label>
                <input name="demo_url" value={formData.demo_url} onChange={handleInputChange} type="url" className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="https://..." />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Orden (Menor = Primero)</label>
                <input name="sort_order" value={formData.sort_order} onChange={handleInputChange} type="number" className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Estado</label>
                <select name="status" value={formData.status} onChange={handleInputChange} className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option value="published">Publicado</option>
                  <option value="draft">Borrador</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Galería de Imágenes</label>
              <div className="relative w-full h-32 rounded-xl bg-black/5 dark:bg-white/5 border-2 border-dashed border-black/20 dark:border-white/20 flex flex-col items-center justify-center text-black/50 dark:text-white/50 hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                {uploading ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="animate-spin mb-2" size={24} />
                    <span className="text-sm">Subiendo...</span>
                  </div>
                ) : (
                  <>
                    <ImageIcon size={24} className="mb-2" />
                    <span className="text-sm">Haz clic para subir múltiples imágenes</span>
                  </>
                )}
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  disabled={uploading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                />
              </div>
              
              {formData.image_urls && formData.image_urls.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {formData.image_urls.map((url, idx) => (
                    <div key={idx} className="aspect-video bg-black/10 dark:bg-white/10 rounded-lg relative group overflow-hidden border border-black/10 dark:border-white/10">
                      <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="pt-4">
              <button disabled={saving} type="submit" className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-white font-medium rounded-xl transition-colors shadow-lg shadow-emerald-500/20">
                <Plus size={20} />
                <span>{saving ? 'Guardando...' : (editingId ? 'Actualizar Proyecto' : 'Crear Proyecto')}</span>
              </button>
            </div>
          </form>
        </div>

        <div className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-6 backdrop-blur-sm flex flex-col h-fit">
          <h2 className="text-xl font-semibold text-black dark:text-white mb-6">Proyectos Existentes</h2>
          
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="animate-spin text-emerald-500" size={32} /></div>
          ) : projects.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12 text-black/50 dark:text-white/50 border-2 border-dashed border-black/10 dark:border-white/10 rounded-xl">
              <FolderKanban size={48} className="mb-4 opacity-50" />
              <p>No hay proyectos guardados.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj.id} className="flex items-center justify-between p-4 bg-white dark:bg-black/40 border border-black/5 dark:border-white/10 rounded-xl hover:border-emerald-500/30 transition-colors">
                  <div className="flex items-center gap-4 overflow-hidden">
                    {proj.image_urls?.[0] ? (
                      <img src={proj.image_urls[0]} alt={proj.title_es} className="w-12 h-12 rounded-lg object-cover bg-black/10" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center">
                        <ImageIcon size={20} className="text-black/30 dark:text-white/30" />
                      </div>
                    )}
                    <div className="truncate">
                      <h3 className="font-semibold text-black dark:text-white truncate">{proj.title_es || 'Sin título'}</h3>
                      <div className="flex gap-2 text-xs text-black/50 dark:text-white/50 mt-1">
                        <span className={`px-2 py-0.5 rounded-full ${proj.status === 'published' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-orange-500/10 text-orange-600 dark:text-orange-400'}`}>
                          {proj.status === 'published' ? 'Público' : 'Borrador'}
                        </span>
                        <span>Orden: {proj.sort_order}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(proj)} className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg text-black/60 dark:text-white/60 transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(proj.id)} className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
