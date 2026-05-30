'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { 
  Folder, FileCode2, ChevronRight, ChevronLeft, 
  Home, HardDrive, Star, Search, Grid, List 
} from 'lucide-react';
import { useBrowserStore } from './BrowserApp';
import { useWindowStore } from '@/store/useWindowStore';

// Types for the file system
type FileType = 'folder' | 'project';

interface FileSystemItem {
  id: string;
  name: string;
  type: FileType;
  parentId: string | null; // null means root
  url?: string;
  description?: string;
  date?: string;
  size?: string;
}

// Simulated file system (vacío para que agregues tus propios proyectos reales)
const fileSystem: FileSystemItem[] = [];

export default function ProjectsApp() {
  const t = useTranslations('Dock');
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [history, setHistory] = useState<(string | null)[]>([null]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const { navigate } = useBrowserStore();
  const { openWindow } = useWindowStore();

  const navigateTo = (folderId: string | null) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(folderId);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentFolderId(folderId);
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
      navigate(item.url);
      openWindow('browser');
    }
  };

  // Compute breadcrumbs
  const getBreadcrumbs = () => {
    if (currentFolderId === 'starred') return [{ id: 'starred', name: 'Destacados' }];
    if (currentFolderId === 'local_c') return [{ id: 'local_c', name: 'Disco Local (C:)' }];

    const crumbs = [{ id: null, name: 'Inicio' }];
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

  return (
    <div className="flex h-full w-full bg-white dark:bg-[#121212] text-black dark:text-white font-sans">
      
      {/* Sidebar */}
      <aside className="w-48 border-r border-black/10 dark:border-white/10 bg-[#f8f9fa] dark:bg-[#181818] flex flex-col p-3 shrink-0 hidden sm:flex">
        <div className="text-xs font-bold text-black/40 dark:text-white/40 uppercase tracking-wider mb-2 px-3">Favoritos</div>
        <button 
          onClick={() => navigateTo(null)}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
            currentFolderId === null 
              ? 'bg-blue-500 text-white' 
              : 'hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          <Home size={16} className={currentFolderId === null ? '' : 'text-blue-500'} />
          <span>Inicio</span>
        </button>
        <button 
          onClick={() => navigateTo('starred')}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
            currentFolderId === 'starred' 
              ? 'bg-blue-500 text-white' 
              : 'hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          <Star size={16} className={currentFolderId === 'starred' ? '' : 'text-amber-500'} />
          <span>Destacados</span>
        </button>

        <div className="text-xs font-bold text-black/40 dark:text-white/40 uppercase tracking-wider mt-6 mb-2 px-3">Ubicaciones</div>
        <button 
          onClick={() => navigateTo('local_c')}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
            currentFolderId === 'local_c' 
              ? 'bg-blue-500 text-white' 
              : 'hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          <HardDrive size={16} className={currentFolderId === 'local_c' ? '' : 'text-black/50 dark:text-white/50'} />
          <span>Disco Local (C:)</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Toolbar */}
        <header className="h-14 border-b border-black/10 dark:border-white/10 flex items-center justify-between px-4 shrink-0 bg-[#f8f9fa] dark:bg-[#181818]">
          <div className="flex items-center gap-2">
            <button 
              onClick={goBack} 
              disabled={historyIndex === 0}
              className="p-1.5 rounded-md hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={goForward} 
              disabled={historyIndex === history.length - 1}
              className="p-1.5 rounded-md hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
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
                placeholder="Buscar..." 
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
              <p>Esta carpeta está vacía.</p>
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
                    {item.type === 'folder' ? (
                      <Folder size={64} strokeWidth={1} fill="currentColor" className="text-blue-400 dark:text-blue-500/80 drop-shadow-md" />
                    ) : (
                      <div className="relative">
                        <FileCode2 size={56} strokeWidth={1} className="text-emerald-500" />
                        <div className="absolute bottom-1 -right-2 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold px-1.5 rounded uppercase border border-emerald-200 dark:border-emerald-700">
                          EXE
                        </div>
                      </div>
                    )}
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
                <div className="col-span-6 sm:col-span-5">Nombre</div>
                <div className="col-span-3 hidden sm:block">Fecha de mod.</div>
                <div className="col-span-3 hidden md:block">Tipo</div>
                <div className="col-span-6 sm:col-span-4 md:col-span-1 text-right">Tamaño</div>
              </div>
              {currentItems.map(item => (
                <div 
                  key={item.id}
                  onDoubleClick={() => handleDoubleClick(item)}
                  className="grid grid-cols-12 gap-4 items-center p-2 px-4 rounded-lg hover:bg-blue-50 dark:hover:bg-white/5 cursor-default transition-colors border border-transparent hover:border-blue-200 dark:hover:border-white/10"
                >
                  <div className="col-span-6 sm:col-span-5 flex items-center gap-3">
                    {item.type === 'folder' ? (
                      <Folder size={20} fill="currentColor" className="text-blue-400" />
                    ) : (
                      <FileCode2 size={20} className="text-emerald-500" />
                    )}
                    <span className="text-sm font-medium truncate">{item.name}</span>
                  </div>
                  <div className="col-span-3 hidden sm:block text-sm text-black/50 dark:text-white/50 truncate">{item.date}</div>
                  <div className="col-span-3 hidden md:block text-sm text-black/50 dark:text-white/50 truncate">
                    {item.type === 'folder' ? 'Carpeta de archivos' : 'Aplicación Web (.exe)'}
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
