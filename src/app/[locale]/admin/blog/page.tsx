'use client';

import React, { useState, useEffect } from 'react';
import { insforge } from '@/lib/insforge';
import { Plus, Trash2, Save, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  slug: string;
  is_published: boolean;
  created_at: string;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  const fetchPosts = async () => {
    setIsLoading(true);
    const { data, error } = await insforge.database
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      toast.error('Error al cargar posts: ' + error.message);
    } else if (data) {
      setPosts(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (selectedPost) {
      setTitle(selectedPost.title);
      setSlug(selectedPost.slug);
      setContent(selectedPost.content);
      setIsPublished(selectedPost.is_published);
    } else {
      setTitle('');
      setSlug('');
      setContent('');
      setIsPublished(true);
    }
  }, [selectedPost]);

  const handleCreateNew = () => {
    setSelectedPost(null);
    setTitle('');
    setSlug('');
    setContent('');
    setIsPublished(true);
  };

  const handleSave = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!title || !slug || !content) {
      toast.warning('Por favor, llena todos los campos.');
      return;
    }

    setIsSaving(true);
    
    const postData = {
      title,
      slug,
      content,
      is_published: isPublished,
      updated_at: new Date().toISOString()
    };

    if (selectedPost) {
      // Actualizar existente
      const { error } = await insforge.database
        .from('blog_posts')
        .update(postData)
        .eq('id', selectedPost.id);
        
      if (error) {
        toast.error('Error al actualizar: ' + error.message);
      } else {
        toast.success('Post actualizado correctamente');
        fetchPosts();
      }
    } else {
      // Crear nuevo (no pasamos id, lo genera postgres)
      const { error } = await insforge.database
        .from('blog_posts')
        .insert([postData]);
        
      if (error) {
        toast.error('Error al crear: ' + error.message);
      } else {
        toast.success('Post creado correctamente');
        fetchPosts();
      }
    }
    
    setIsSaving(false);
  };

  const handleDelete = (id: string) => {
    setPostToDelete(id);
  };

  const confirmDelete = async () => {
    if (!postToDelete) return;
    const id = postToDelete;
    setPostToDelete(null);
    
    const { error } = await insforge.database
      .from('blog_posts')
      .delete()
      .eq('id', id);
      
    if (error) {
      toast.error('Error al eliminar: ' + error.message);
    } else {
      toast.success('Post eliminado');
      if (selectedPost?.id === id) {
        handleCreateNew();
      }
      fetchPosts();
    }
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in zoom-in duration-300">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestor de Notas (Blog)</h1>
          <p className="text-black/50 dark:text-white/50 mt-2 tracking-wide">
            Crea artículos o notas en formato Markdown para tus visitantes.
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={18} /> Nuevo Post
        </button>
      </header>

      <div className="flex-1 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-black/10 dark:border-white/10 shadow-sm overflow-hidden flex min-h-[600px]">
        
        {/* Sidebar (Lista de Posts) */}
        <div className="w-80 border-r border-black/10 dark:border-white/10 flex flex-col bg-black/5 dark:bg-white/5 shrink-0">
          <div className="p-4 border-b border-black/10 dark:border-white/10">
            <h2 className="font-semibold">Artículos Publicados</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {isLoading && (
              <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-blue-500" /></div>
            )}
            
            {!isLoading && posts.length === 0 && (
              <div className="p-4 text-sm text-black/50 dark:text-white/50 text-center">No has escrito ningún post todavía.</div>
            )}
            
            {!isLoading && posts.length > 0 && posts.map(post => (
                <div 
                  key={post.id}
                  className={`flex items-center justify-between border-b border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${
                    selectedPost?.id === post.id ? 'bg-white dark:bg-black border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedPost(post)}
                    className="flex-1 min-w-0 p-4 text-left cursor-pointer"
                  >
                    <h3 className="font-semibold text-sm truncate">{post.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${post.is_published ? 'bg-emerald-500/20 text-emerald-600' : 'bg-yellow-500/20 text-yellow-600'}`}>
                        {post.is_published ? 'Publicado' : 'Borrador'}
                      </span>
                    </div>
                  </button>
                  <div className="p-4 pl-0">
                    <button 
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleDelete(post.id); }}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col p-6 overflow-y-auto">
          <h2 className="text-xl font-bold mb-6">
            {selectedPost ? 'Editar Artículo' : 'Crear Nuevo Artículo'}
          </h2>

          <form onSubmit={handleSave} className="flex flex-col gap-6 max-w-4xl">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="title-input" className="block text-sm font-medium mb-2 text-black/70 dark:text-white/70">Título</label>
                <input 
                  id="title-input"
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: Cómo construí mi OS en React..."
                  className="w-full bg-[#f8f9fa] dark:bg-[#121212] border border-black/10 dark:border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="slug-input" className="block text-sm font-medium mb-2 text-black/70 dark:text-white/70">Slug (URL amigable)</label>
                <input 
                  id="slug-input"
                  type="text" 
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="ej-como-construi-mi-os"
                  className="w-full bg-[#f8f9fa] dark:bg-[#121212] border border-black/10 dark:border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 font-mono text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="content-input" className="block text-sm font-medium mb-2 text-black/70 dark:text-white/70 flex justify-between items-center">
                <span>Contenido (Markdown)</span>
                <span className="text-xs text-blue-500 font-normal">Soporta negritas, listas, código, etc.</span>
              </label>
              <textarea 
                id="content-input"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="# Mi nuevo artículo&#10;&#10;Escribe tu genialidad aquí usando **Markdown**..."
                rows={15}
                className="w-full bg-[#f8f9fa] dark:bg-[#121212] border border-black/10 dark:border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 font-mono text-sm resize-y"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-black/10 dark:border-white/10">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-sm font-medium">Publicar artículo (visible para visitantes)</span>
              </label>

              <button 
                type="submit"
                disabled={isSaving}
                className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium"
              >
                {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                Guardar Artículo
              </button>
            </div>
          </form>
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {postToDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1e1e1e] border border-black/10 dark:border-white/10 rounded-xl shadow-2xl p-6 max-w-sm w-full animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold mb-2">Eliminar Artículo</h3>
            <p className="text-sm text-black/60 dark:text-white/60 mb-6">
              ¿Estás seguro de que deseas eliminar este artículo? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setPostToDelete(null)}
                className="px-4 py-2 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-sm font-medium"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors text-sm font-medium shadow-sm shadow-red-500/20"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
