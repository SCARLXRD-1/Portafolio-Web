'use client';

import React, { useState, useEffect } from 'react';
import { insforge } from '@/lib/insforge';
import { FileText, ChevronRight, Hash, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useLocale } from 'next-intl';

interface BlogPost {
  id: string;
  title: string;
  title_en?: string;
  content: string;
  content_en?: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export default function NotesApp() {
  const locale = useLocale();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getTitle = (post: BlogPost) => (locale === 'en' && post.title_en) ? post.title_en : post.title;
  const getContent = (post: BlogPost) => (locale === 'en' && post.content_en) ? post.content_en : post.content;

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await insforge.database
        .from('blog_posts')
        .select('*')
        // El RLS ya filtra is_published = true para usuarios anónimos
        .order('created_at', { ascending: false });
      
      if (data) {
        setPosts(data);
        if (data.length > 0) setSelectedPost(data[0]);
      }
      setIsLoading(false);
    };

    fetchPosts();
  }, []);

  return (
    <div className="flex h-full w-full bg-[#1e1e1e] text-[#d4d4d4] font-sans selection:bg-[#264f78]">
      {/* Sidebar (Explorer) */}
      <div className="w-64 border-r border-[#333] flex flex-col shrink-0 bg-[#252526]">
        <div className="p-3 text-xs font-semibold tracking-wider text-[#bbb] uppercase mb-2">
          Explorador
        </div>
        
        <div className="flex items-center px-3 py-1 text-sm font-bold bg-[#37373d]">
          <ChevronRight size={16} className="mr-1 text-[#bbb]" />
          <span>PORTAFOLIO_POSTS</span>
        </div>
        
        <div className="flex-1 overflow-y-auto py-2">
          {isLoading && (
            <div className="flex justify-center p-4"><Loader2 size={20} className="animate-spin text-[#007acc]" /></div>
          )}
          
          {!isLoading && posts.length === 0 && (
            <div className="px-8 py-2 text-xs text-[#888] italic">No hay notas publicadas.</div>
          )}
          
          {!isLoading && posts.length > 0 && posts.map(post => (
              <button
                key={post.id}
                type="button"
                onClick={() => setSelectedPost(post)}
                className={`w-full flex items-center px-6 py-1 text-sm hover:bg-[#2a2d2e] transition-colors ${
                  selectedPost?.id === post.id ? 'bg-[#37373d] text-white' : 'text-[#cccccc]'
                }`}
              >
                <FileText size={14} className="mr-2 text-[#519aba]" />
                <span className="truncate">{post.slug}.md</span>
              </button>
            ))}
        </div>
      </div>

      {/* Main Content (Editor/Viewer) */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#1e1e1e]">
        {selectedPost ? (
          <>
            {/* Tabs */}
            <div className="flex bg-[#2d2d2d] border-b border-[#333] overflow-x-auto [&::-webkit-scrollbar]:hidden">
              <div className="flex items-center px-4 py-2 bg-[#1e1e1e] border-t-2 border-t-[#007acc] text-[#cccccc] min-w-max">
                <FileText size={14} className="mr-2 text-[#519aba]" />
                <span className="text-sm">{selectedPost.slug}.md</span>
              </div>
            </div>

            {/* Markdown Content */}
            <div className="flex-1 overflow-y-auto p-8 font-sans">
              <div className="max-w-3xl mx-auto">
                <div className="mb-8 pb-4 border-b border-[#333]">
                  <h1 className="text-3xl font-bold text-white mb-2">{getTitle(selectedPost)}</h1>
                  <div className="text-xs text-[#888]">
                    Última actualización: {new Date(selectedPost.updated_at).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="prose prose-invert prose-blue max-w-none 
                  prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl 
                  prose-a:text-[#3794ff] prose-a:no-underline hover:prose-a:underline
                  prose-code:bg-[#2d2d2d] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[#d4d4d4]
                  prose-pre:bg-[#1e1e1e] prose-pre:border prose-pre:border-[#333] prose-pre:text-[#d4d4d4]
                  prose-hr:border-[#333] prose-blockquote:border-l-[#007acc] prose-blockquote:bg-[#252526] prose-blockquote:py-0.5 prose-blockquote:px-4 prose-blockquote:not-italic
                  marker:text-[#007acc]"
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {getContent(selectedPost)}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-[#888]">
            <Hash size={64} className="mb-4 text-[#333]" />
            <p>Selecciona una nota para leerla</p>
          </div>
        )}
      </div>
    </div>
  );
}
