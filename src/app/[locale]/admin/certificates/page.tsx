'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Award, Plus, Search, Edit2, Trash2, CheckCircle, Clock, X, Save, Loader2, Link as LinkIcon, FileUp, File as FileIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { insforge } from '@/lib/insforge';
import { toast } from 'react-toastify';

export default function AdminCertificates() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'es';
  const [searchTerm, setSearchTerm] = useState('');

  const [certificates, setCertificates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingFile, setUploadingFile] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    date: '',
    url: '',
    file_url: '',
    skills: '',
    status: 'draft',
    sort_order: 0
  });

  const fetchCertificates = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await insforge.database
        .from('certificates')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      setCertificates(data || []);
    } catch (error) {
      console.error('Error fetching certificates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleEdit = (cert: any) => {
    setFormData({
      title: cert.title || '',
      issuer: cert.issuer || '',
      date: cert.date || '',
      url: cert.url || '',
      file_url: cert.file_url || '',
      skills: cert.skills ? cert.skills.join(', ') : '',
      status: cert.status || 'draft',
      sort_order: cert.sort_order || 0
    });
    setEditingId(cert.id);
    setIsEditing(true);
  };

  const handleCreate = () => {
    setFormData({
      title: '',
      issuer: '',
      date: '',
      url: '',
      file_url: '',
      skills: '',
      status: 'draft',
      sort_order: certificates.length + 1
    });
    setEditingId(null);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este certificado?')) return;
    try {
      const { error } = await insforge.database
        .from('certificates')
        .delete()
        .eq('id', id);
      if (error) throw error;
      await fetchCertificates();
      toast.success('Certificado eliminado');
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Error al eliminar');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      // Optimizador de imagen antes de subir (si es imagen)
      let fileToUpload = file;
      if (file.type.startsWith('image/')) {
        const { compressImage } = await import('@/utils/imageCompressor');
        fileToUpload = await compressImage(file);
      }

      const fileExt = fileToUpload.name.split('.').pop();
      const fileName = `cert_${Date.now()}.${fileExt}`;
      const filePath = `certificates/${fileName}`;

      const { data, error: uploadError } = await insforge.storage
        .from('portfolio-assets')
        .upload(filePath, fileToUpload);

      if (uploadError) throw uploadError;

      if (data?.url) {
        setFormData((prev) => ({ ...prev, file_url: data.url }));
        toast.success('Archivo subido');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Error al subir el archivo');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s);
      const payload = {
        title: formData.title,
        issuer: formData.issuer,
        date: formData.date,
        url: formData.url,
        file_url: formData.file_url,
        skills: skillsArray,
        status: formData.status,
        sort_order: formData.sort_order
      };

      if (editingId) {
        const { error } = await insforge.database
          .from('certificates')
          .update(payload)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await insforge.database
          .from('certificates')
          .insert([payload]);
        if (error) throw error;
      }

      setIsEditing(false);
      await fetchCertificates();
      toast.success('Cambios guardados');
    } catch (error) {
      console.error('Error saving:', error);
      toast.error('Error al guardar');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredCertificates = certificates.filter(c => 
    (c.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.issuer || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isEditing) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{editingId ? 'Editar Certificado' : 'Nuevo Certificado'}</h2>
            <p className="text-black/50 dark:text-white/50">Completa los detalles de la acreditación.</p>
          </div>
          <button 
            onClick={() => setIsEditing(false)}
            className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid gap-6 bg-black/5 dark:bg-white/5 p-6 rounded-2xl border border-black/10 dark:border-white/10">
          <div>
            <label className="block text-sm font-medium mb-2">Título del Certificado *</label>
            <input 
              type="text" 
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              className="w-full bg-white dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
              placeholder="Ej. Curso Completo de React"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Emisor</label>
              <input 
                type="text" 
                value={formData.issuer}
                onChange={e => setFormData({...formData, issuer: e.target.value})}
                className="w-full bg-white dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
                placeholder="Ej. Udemy, Coursera, Universidad..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Fecha / Año</label>
              <input 
                type="text" 
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
                className="w-full bg-white dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
                placeholder="Ej. Octubre 2023"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">URL del Certificado (Verificación Externa)</label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40 dark:text-white/40" size={18} />
                <input 
                  type="text" 
                  value={formData.url}
                  onChange={e => setFormData({...formData, url: e.target.value})}
                  className="w-full bg-white dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-xl pl-10 pr-4 py-2 focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
                  placeholder="https://..."
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Archivo del Certificado (PDF o Imagen)</label>
              {formData.file_url ? (
                <div className="flex items-center gap-3 p-2 border border-black/10 dark:border-white/10 rounded-xl bg-white dark:bg-black/40">
                  <div className="p-2 bg-yellow-500/10 text-yellow-500 rounded-lg">
                    <FileIcon size={20} />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm truncate">Archivo subido</p>
                  </div>
                  <button 
                    onClick={() => setFormData({...formData, file_url: ''})}
                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                    accept="image/*"
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingFile}
                    className="w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-black/20 dark:border-white/20 hover:border-yellow-500 rounded-xl transition-colors text-black/60 dark:text-white/60 hover:text-yellow-500 disabled:opacity-50"
                  >
                    {uploadingFile ? <Loader2 size={18} className="animate-spin" /> : <FileUp size={18} />}
                    <span>{uploadingFile ? 'Subiendo...' : 'Subir Archivo'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Habilidades (Separadas por comas)</label>
            <input 
              type="text" 
              value={formData.skills}
              onChange={e => setFormData({...formData, skills: e.target.value})}
              className="w-full bg-white dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
              placeholder="React, TypeScript, CSS..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Orden (Menor = Primero)</label>
              <input 
                type="number" 
                value={formData.sort_order}
                onChange={e => setFormData({...formData, sort_order: parseInt(e.target.value) || 0})}
                className="w-full bg-white dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Estado</label>
              <select 
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value as 'draft'|'published'})}
                className="w-full bg-white dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
              >
                <option value="draft">Borrador</option>
                <option value="published">Publicado</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              onClick={handleSave}
              disabled={isSaving || !formData.title}
              className="flex items-center gap-2 px-6 py-2.5 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-black font-semibold rounded-xl transition-all shadow-lg shadow-yellow-500/20"
            >
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              <span>{isSaving ? 'Guardando...' : 'Guardar Certificado'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-wider text-black dark:text-white">Certificados</h1>
          <p className="text-black/50 dark:text-white/50 mt-2 tracking-wide">Gestiona los certificados y acreditaciones de tu portafolio.</p>
        </div>
        <button 
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-xl transition-colors shadow-lg shadow-yellow-500/20"
        >
          <Plus size={18} />
          <span>Nuevo Certificado</span>
        </button>
      </div>

      <div className="flex items-center gap-4 p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 backdrop-blur-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40 dark:text-white/40" size={18} />
          <input
            type="text"
            placeholder="Buscar certificados por título o emisor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent border-none focus:ring-0 pl-10 text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 outline-none"
          />
        </div>
      </div>

      <div className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-black/5 dark:bg-white/5 text-xs uppercase text-black/50 dark:text-white/50 tracking-wider border-b border-black/10 dark:border-white/10">
              <tr>
                <th className="px-6 py-4 font-medium">Título del Certificado</th>
                <th className="px-6 py-4 font-medium">Emisor</th>
                <th className="px-6 py-4 font-medium">Fecha</th>
                <th className="px-6 py-4 font-medium">Estado</th>
                <th className="px-6 py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center">
                    <Loader2 className="animate-spin mx-auto text-black/50 dark:text-white/50" />
                  </td>
                </tr>
              ) : filteredCertificates.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-black/50 dark:text-white/50">
                    No se encontraron certificados.
                  </td>
                </tr>
              ) : (
                filteredCertificates.map((cert) => (
                  <tr key={cert.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500">
                          <Award size={18} />
                        </div>
                        <span className="font-medium text-black dark:text-white">{cert.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-black/70 dark:text-white/70">
                      {cert.issuer}
                    </td>
                    <td className="px-6 py-4 text-black/70 dark:text-white/70">
                      {cert.date}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        cert.status === 'published' 
                          ? 'bg-emerald-500/10 text-emerald-500' 
                          : 'bg-black/10 dark:bg-white/10 text-black/60 dark:text-white/60'
                      }`}>
                        {cert.status === 'published' ? <CheckCircle size={12} /> : <Clock size={12} />}
                        {cert.status === 'published' ? 'Público' : 'Borrador'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleEdit(cert)}
                          className="p-2 text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(cert.id)}
                          className="p-2 text-red-500/70 hover:text-red-500 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
