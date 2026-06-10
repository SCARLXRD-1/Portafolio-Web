'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { 
  Folder, FileCode2, FileText, Image as ImageIcon, ChevronRight, ChevronLeft, 
  Home, HardDrive, Star, Search, Grid, List, Menu, X 
} from 'lucide-react';
import { useBrowserStore } from './BrowserApp';
import { useWindowStore } from '@/store/useWindowStore';
import { insforge } from '@/lib/insforge';

// Types for the file system
type FileType = 'folder' | 'project' | 'text' | 'image';

interface FileSystemItem {
  id: string;
  name: string;
  type: FileType;
  parentId: string | null; // null means root
  url?: string;
  content?: string;
  date?: string;
  size?: string;
}

export default function ProjectsApp() {
  const t = useTranslations('Dock');
  const locale = useLocale();
  const isEs = locale === 'es';
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [history, setHistory] = useState<(string | null)[]>([null]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [fileSystem, setFileSystem] = useState<FileSystemItem[]>([]);
  const [openFile, setOpenFile] = useState<FileSystemItem | null>(null);

  useEffect(() => {
    const loadProjects = async () => {
      const { data } = await insforge.database
        .from('projects')
        .select('*')
        .eq('status', 'published')
        .order('sort_order', { ascending: true });
        
      if (data) {
        const fsItems: FileSystemItem[] = [];
        
        data.forEach(proj => {
          const folderId = proj.id;
          const projName = (isEs ? proj.title_es : proj.title_en) || (isEs ? 'Sin título' : 'Untitled');
          const projDesc = (isEs ? proj.description_es : proj.description_en) || '';
          const dateStr = new Date(proj.created_at).toLocaleDateString();
          
          // 1. Create the project folder
          fsItems.push({
            id: folderId,
            name: projName,
            type: 'folder',
            parentId: null,
            date: dateStr,
            size: '--'
          });
          
          // 2. Create the executable (.exe)
          fsItems.push({
            id: folderId + '-exe',
            name: isEs ? 'Lanzar App.exe' : 'Launch App.exe',
            type: 'project',
            parentId: folderId,
            url: proj.demo_url || proj.github_url || 'https://github.com',
            date: dateStr,
            size: '2.4 MB'
          });
          
          // 3. Create the description text (.txt)
          fsItems.push({
            id: folderId + '-txt',
            name: isEs ? 'Acerca de.txt' : 'About.txt',
            type: 'text',
            parentId: folderId,
            content: isEs 
              ? `PROYECTO: ${projName}\n\nDESCRIPCIÓN:\n${projDesc}\n\nTECNOLOGÍAS:\n${proj.technologies?.join(', ') || 'N/A'}\n\nGITHUB: ${proj.github_url || 'N/A'}\nDEMO: ${proj.demo_url || 'N/A'}`
              : `PROJECT: ${projName}\n\nDESCRIPTION:\n${projDesc}\n\nTECHNOLOGIES:\n${proj.technologies?.join(', ') || 'N/A'}\n\nGITHUB: ${proj.github_url || 'N/A'}\nDEMO: ${proj.demo_url || 'N/A'}`,
            date: dateStr,
            size: '4 KB'
          });
          
          // 4. Create image files if any
          if (proj.image_urls && Array.isArray(proj.image_urls)) {
            proj.image_urls.forEach((imgUrl: string, idx: number) => {
              fsItems.push({
                id: folderId + '-img-' + idx,
                name: isEs ? `captura_${idx + 1}.png` : `screenshot_${idx + 1}.png`,
                type: 'image',
                parentId: folderId,
                url: imgUrl,
                date: dateStr,
                size: `${Math.floor(Math.random() * 5 + 1)} MB`
              });
            });
          }
        });
        
        setFileSystem(fsItems);
      }
    };
    loadProjects();
  }, [locale]);
  
  const { navigate } = useBrowserStore();
  const { openWindow } = useWindowStore();

  const navigateTo = (folderId: string | null) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(folderId);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentFolderId(folderId);
    setIsMobileMenuOpen(false); // Close mobile menu after navigating
  };

  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentFolderId(history[historyIndex - 1]);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCurrentFolderId(history[historyIndex + 1]);
    }
  };

  const handleDoubleClick = (item: FileSystemItem) => {
    if (item.type === 'folder') {
      navigateTo(item.id);
    } else if (item.type === 'project' && item.url) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    } else if (item.type === 'text' || item.type === 'image') {
      setOpenFile(item);
    }
  };

  // Compute breadcrumbs
  const getBreadcrumbs = () => {
    const isEs = locale === 'es';
    if (currentFolderId === 'starred') return [{ id: 'starred', name: isEs ? 'Destacados' : 'Starred' }];
    if (currentFolderId === 'local_c') return [{ id: 'local_c', name: isEs ? 'Disco Local (C:)' : 'Local Disk (C:)' }];

    const crumbs = [{ id: null, name: isEs ? 'Inicio' : 'Home' }];
    let current = currentFolderId;
    const path = [];
    
    while (current) {
      const folder = fileSystem.find(f => f.id === current);
      if (folder) {
        path.unshift({ id: folder.id, name: folder.name });
        current = folder.parentId;
      } else {
        break;
      }
    }
    return [...crumbs, ...path];
  };

  const currentItems = fileSystem.filter(item => {
    if (currentFolderId === 'starred') return false; // No favorites logic yet
    if (currentFolderId === 'local_c') return false; // Local disk is empty
    return item.parentId === currentFolderId;
  });
  const breadcrumbs = getBreadcrumbs();

  const renderIcon = (type: FileType, isLarge: boolean) => {
    const size = isLarge ? 56 : 20;
    switch (type) {
      case 'folder':
        return <Folder size={isLarge ? 64 : 20} strokeWidth={1} fill="currentColor" className="text-blue-400 dark:text-blue-500/80 drop-shadow-md" />;
      case 'project':
        return (
          <div className="relative">
            <FileCode2 size={size} strokeWidth={1} className="text-emerald-500" />
            {isLarge && (
              <div className="absolute bottom-1 -right-2 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold px-1.5 rounded uppercase border border-emerald-200 dark:border-emerald-700">
                EXE
              </div>
            )}
          </div>
        );
      case 'text':
        return <FileText size={size} strokeWidth={1} className="text-amber-500" />;
      case 'image':
        return <ImageIcon size={size} strokeWidth={1} className="text-purple-500" />;
    }
  };

  const getTypeLabel = (type: FileType) => {
    const isEs = locale === 'es';
    switch (type) {
      case 'folder': return isEs ? 'Carpeta de archivos' : 'File Folder';
      case 'project': return isEs ? 'Aplicación (.exe)' : 'Application (.exe)';
      case 'text': return isEs ? 'Documento de texto (.txt)' : 'Text Document (.txt)';
      case 'image': return isEs ? 'Imagen PNG (.png)' : 'PNG Image (.png)';
    }
  };

  return (
    <div className="flex h-full w-full bg-white dark:bg-[#121212] text-black dark:text-white font-sans relative">
      
      {/* File Viewer Overlay */}
      {openFile && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1e1e1e] border border-black/10 dark:border-white/10 shadow-2xl rounded-xl w-full max-w-2xl max-h-full flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center px-4 py-3 border-b border-black/10 dark:border-white/10 bg-[#f8f9fa] dark:bg-[#252525]">
              <div className="flex items-center gap-2">
                {renderIcon(openFile.type, false)}
                <span className="font-semibold text-sm">{openFile.name}</span>
              </div>
              <button onClick={() => setOpenFile(null)} className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="p-4 overflow-auto flex-1 bg-white dark:bg-[#121212]">
              {openFile.type === 'text' && (
                <pre className="whitespace-pre-wrap font-mono text-sm text-black/80 dark:text-white/80 p-4">
                  {openFile.content}
                </pre>
              )}
              {openFile.type === 'image' && openFile.url && (
                <img src={openFile.url} alt={openFile.name} className="w-full h-auto rounded-lg object-contain" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="absolute inset-0 bg-black/20 dark:bg-black/50 z-40 sm:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        ${isMobileMenuOpen ? 'absolute inset-y-0 left-0 z-50 flex' : 'hidden'}
        sm:relative sm:flex w-56 border-r border-black/10 dark:border-white/10 bg-[#f8f9fa] dark:bg-[#181818] flex-col p-3 shrink-0 h-full shadow-2xl sm:shadow-none transition-transform
      `}>
        <div className="flex justify-between items-center sm:hidden mb-4 px-3">
          <span className="font-bold text-sm">{isEs ? 'Menú' : 'Menu'}</span>
          <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded">
            <X size={18} />
          </button>
        </div>
        <div className="text-xs font-bold text-black/40 dark:text-white/40 uppercase tracking-wider mb-2 px-3">{isEs ? 'Favoritos' : 'Favorites'}</div>
        <button 
          onClick={() => navigateTo(null)}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
            currentFolderId === null 
              ? 'bg-blue-500 text-white' 
              : 'hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          <Home size={16} className={currentFolderId === null ? '' : 'text-blue-500'} />
          <span>{isEs ? 'Inicio' : 'Home'}</span>
        </button>
        <button 
          onClick={() => navigateTo('starred')}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors mt-1 ${
            currentFolderId === 'starred' 
              ? 'bg-blue-500 text-white' 
              : 'hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          <Star size={16} className={currentFolderId === 'starred' ? '' : 'text-amber-500'} />
          <span>{isEs ? 'Destacados' : 'Starred'}</span>
        </button>

        <div className="text-xs font-bold text-black/40 dark:text-white/40 uppercase tracking-wider mt-6 mb-2 px-3">{isEs ? 'Ubicaciones' : 'Locations'}</div>
        <button 
          onClick={() => navigateTo('local_c')}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
            currentFolderId === 'local_c' 
              ? 'bg-blue-500 text-white' 
              : 'hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          <HardDrive size={16} className={currentFolderId === 'local_c' ? '' : 'text-black/50 dark:text-white/50'} />
          <span>{isEs ? 'Disco Local (C:)' : 'Local Disk (C:)'}</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Toolbar */}
        <header className="h-14 border-b border-black/10 dark:border-white/10 flex items-center justify-between px-4 shrink-0 bg-[#f8f9fa] dark:bg-[#181818]">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors sm:hidden"
            >
              <Menu size={20} />
            </button>
            <button 
              onClick={goBack} 
              disabled={historyIndex === 0}
              className="p-1.5 rounded-md hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors hidden sm:block"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={goForward} 
              disabled={historyIndex === history.length - 1}
              className="p-1.5 rounded-md hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors hidden sm:block"
            >
              <ChevronRight size={20} />
            </button>

            {/* Breadcrumbs */}
            <div className="flex items-center ml-2 overflow-hidden whitespace-nowrap text-sm">
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={crumb.id ?? `crumb-${idx}`}>
                  {idx > 0 && <ChevronRight size={14} className="mx-1 text-black/30 dark:text-white/30" />}
                  <button 
                    onClick={() => navigateTo(crumb.id)}
                    className="hover:bg-black/5 dark:hover:bg-white/10 px-2 py-1 rounded transition-colors truncate"
                  >
                    {crumb.name}
                  </button>
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* View toggle */}
            <div className="flex bg-black/5 dark:bg-white/5 rounded-lg p-0.5 border border-black/10 dark:border-white/10">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-1 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-black/50 shadow-sm' : 'text-black/50 dark:text-white/50'}`}
              >
                <Grid size={16} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-1 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-black/50 shadow-sm' : 'text-black/50 dark:text-white/50'}`}
              >
                <List size={16} />
              </button>
            </div>

            {/* Search */}
            <div className="relative hidden md:block">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-black/40 dark:text-white/40" />
              <input 
                type="text" 
                placeholder={isEs ? "Buscar..." : "Search..."} 
                className="w-48 bg-white dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-full pl-8 pr-4 py-1 text-sm outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </header>

        {/* File Grid/List */}
        <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-[#121212]">
          {currentItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-black/40 dark:text-white/40">
              <Folder size={48} className="mb-4 opacity-20" />
              <p>{isEs ? 'Esta carpeta está vacía.' : 'This folder is empty.'}</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {currentItems.map(item => (
                <div 
                  key={item.id}
                  onDoubleClick={() => handleDoubleClick(item)}
                  className="group flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-white/5 cursor-default transition-colors border border-transparent hover:border-blue-200 dark:hover:border-white/10"
                >
                  <div className="w-16 h-16 flex items-center justify-center relative">
                    {renderIcon(item.type, true)}
                  </div>
                  <span className="text-sm font-medium text-center truncate w-full group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full">
              <div className="grid grid-cols-12 gap-4 border-b border-black/10 dark:border-white/10 pb-2 mb-2 text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-wider px-4">
                <div className="col-span-6 sm:col-span-5">{isEs ? 'Nombre' : 'Name'}</div>
                <div className="col-span-3 hidden sm:block">{isEs ? 'Fecha de mod.' : 'Date modified'}</div>
                <div className="col-span-3 hidden md:block">{isEs ? 'Tipo' : 'Type'}</div>
                <div className="col-span-6 sm:col-span-4 md:col-span-1 text-right">{isEs ? 'Tamaño' : 'Size'}</div>
              </div>
              {currentItems.map(item => (
                <div 
                  key={item.id}
                  onDoubleClick={() => handleDoubleClick(item)}
                  className="grid grid-cols-12 gap-4 items-center p-2 px-4 rounded-lg hover:bg-blue-50 dark:hover:bg-white/5 cursor-default transition-colors border border-transparent hover:border-blue-200 dark:hover:border-white/10"
                >
                  <div className="col-span-6 sm:col-span-5 flex items-center gap-3">
                    {renderIcon(item.type, false)}
                    <span className="text-sm font-medium truncate">{item.name}</span>
                  </div>
                  <div className="col-span-3 hidden sm:block text-sm text-black/50 dark:text-white/50 truncate">{item.date}</div>
                  <div className="col-span-3 hidden md:block text-sm text-black/50 dark:text-white/50 truncate">
                    {getTypeLabel(item.type)}
                  </div>
                  <div className="col-span-6 sm:col-span-4 md:col-span-1 text-right text-sm text-black/50 dark:text-white/50">
                    {item.size}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
