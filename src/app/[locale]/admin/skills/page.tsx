'use client';

import React, { useState, useEffect } from 'react';
import { Code2, Trash2, Loader2, Save } from 'lucide-react';
import { insforge } from '@/lib/insforge';
import { toast } from 'react-toastify';

export default function AdminSkills() {
  const [skills, setSkills] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Frontend',
    icon: '',
    proficiency: 100,
    sort_order: 0
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await insforge.database
        .from('skills')
        .select('*')
        .order('category')
        .order('sort_order', { ascending: true });
        
      if (error) throw error;
      setSkills(data || []);
      setFormData(prev => ({ ...prev, sort_order: (data?.length || 0) + 1 }));
    } catch (err: any) {
      console.error('Error fetching skills:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!formData.name || !formData.category) return;
    
    setIsSaving(true);
    try {
      const { error } = await insforge.database
        .from('skills')
        .insert([{
          name: formData.name,
          category: formData.category,
          icon: formData.icon || '',
          proficiency: formData.proficiency,
          sort_order: formData.sort_order
        }]);

      if (error) throw error;
      
      setFormData({
        name: '',
        category: formData.category, // keep selected category
        icon: '',
        proficiency: 100,
        sort_order: skills.length + 2
      });
      fetchSkills();
      toast.success('Habilidad guardada correctamente');
    } catch (err: any) {
      toast.error('Error: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta habilidad?')) return;
    try {
      const { error } = await insforge.database.from('skills').delete().eq('id', id);
      if (error) throw error;
      fetchSkills();
      toast.success('Habilidad eliminada');
    } catch (err: any) {
      toast.error('Error: ' + err.message);
    }
  };

  const renderIcon = (skill: any) => {
    if (skill.icon?.startsWith('<svg')) {
      return <div dangerouslySetInnerHTML={{ __html: skill.icon }} className="w-5 h-5" />;
    }
    if (skill.icon?.includes('://')) {
      return <img src={skill.icon} alt={skill.name} className="w-5 h-5 object-contain" />;
    }
    if (skill.icon) {
      return <img src={`https://cdn.simpleicons.org/${skill.icon}/white`} alt={skill.name} className="w-5 h-5 object-contain" />;
    }
    return <Code2 size={20} />;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-wider text-black dark:text-white">Habilidades</h1>
          <p className="text-black/50 dark:text-white/50 mt-2 tracking-wide">Gestiona las tecnologías y habilidades técnicas de tu portafolio.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <h2 className="text-xl font-semibold text-black dark:text-white mb-6">Añadir Nueva Habilidad</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="skill-name" className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Nombre de la Tecnología</label>
              <input 
                id="skill-name"
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                placeholder="Ej. React, Node.js..." 
              />
            </div>
            <div>
              <label htmlFor="skill-category" className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Categoría</label>
              <select 
                id="skill-category"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Mobile">Mobile</option>
                <option value="Bases de Datos">Bases de Datos</option>
                <option value="Cloud">Cloud</option>
                <option value="DevOps">DevOps</option>
                <option value="Herramientas">Herramientas</option>
                <option value="Diseño">Diseño</option>
                <option value="Lenguajes">Lenguajes</option>
                <option value="APIs e Integraciones">APIs e Integraciones</option>
                <option value="Inteligencia Artificial">Inteligencia Artificial</option>
                <option value="Testing">Testing</option>
                <option value="Seguridad">Seguridad</option>
                <option value="CMS">CMS</option>
                <option value="E-commerce">E-commerce</option>
                <option value="Control de Versiones">Control de Versiones</option>
                <option value="Sistemas Operativos">Sistemas Operativos</option>
                <option value="Arquitectura de Software">Arquitectura de Software</option>
                <option value="Metodologías Ágiles">Metodologías Ágiles</option>
                <option value="Otros">Otros</option>
              </select>
            </div>
            <div>
              <label htmlFor="skill-icon" className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">
                Icono Nativo, URL o Código SVG
                <span className="block text-xs font-normal text-black/50 dark:text-white/50 mt-0.5">
                  Escribe un nombre de simpleicons.org (ej: react, nodedotjs, docker), o pega una URL/SVG.
                </span>
              </label>
              <input 
                id="skill-icon"
                type="text" 
                value={formData.icon}
                onChange={e => setFormData({...formData, icon: e.target.value.toLowerCase()})}
                className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                placeholder="react, nodedotjs, figma, o https://..." 
              />
            </div>
            <div>
              <label htmlFor="skill-proficiency" className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">Nivel de Dominio (%)</label>
              <input 
                id="skill-proficiency"
                type="number" 
                min="1" 
                max="100"
                value={formData.proficiency}
                onChange={e => setFormData({...formData, proficiency: Number.parseInt(e.target.value) || 0})}
                className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" 
              />
            </div>
            <button 
              onClick={handleAdd}
              disabled={isSaving || !formData.name}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors mt-4 disabled:opacity-50"
            >
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              Añadir a la lista
            </button>
          </div>
        </div>

        <div className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <h2 className="text-xl font-semibold text-black dark:text-white mb-6">Lista de Habilidades</h2>
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="animate-spin text-emerald-500" size={32} />
            </div>
          )}
          
          {!isLoading && skills.length === 0 && (
            <div className="text-center py-12 text-black/50 dark:text-white/50 border-2 border-dashed border-black/10 dark:border-white/10 rounded-xl">
              No hay habilidades registradas aún.
            </div>
          )}
          
          {!isLoading && skills.length > 0 && (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {skills.map(skill => (
                <div key={skill.id} className="flex items-center justify-between p-4 bg-white dark:bg-black/40 border border-black/5 dark:border-white/5 rounded-xl hover:border-emerald-500/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 flex items-center justify-center bg-emerald-500/10 text-emerald-500 rounded-lg shrink-0">
                      {renderIcon(skill)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-black dark:text-white leading-tight">{skill.name}</h3>
                      <p className="text-xs text-black/50 dark:text-white/50">{skill.category} • {skill.proficiency}%</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDelete(skill.id)}
                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
