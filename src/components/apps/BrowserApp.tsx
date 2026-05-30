'use client';

import React, { useState } from 'react';
import { create } from 'zustand';
import { Globe, RefreshCw, ChevronLeft, ChevronRight, Home } from 'lucide-react';

// Store to allow other apps to tell the browser what URL to open
interface BrowserState {
  url: string;
  navigate: (url: string) => void;
}

export const useBrowserStore = create<BrowserState>((set) => ({
  url: 'https://example.com', // Default placeholder
  navigate: (url) => set({ url }),
}));

export default function BrowserApp() {
  const { url, navigate } = useBrowserStore();
  const [inputUrl, setInputUrl] = useState(url);
  const [isLoading, setIsLoading] = useState(true);

  // Sync input when global URL changes
  React.useEffect(() => {
    setInputUrl(url);
    setIsLoading(true);
  }, [url]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      let finalUrl = inputUrl;
      if (!finalUrl.startsWith('http')) {
        finalUrl = 'https://' + finalUrl;
      }
      navigate(finalUrl);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] dark:bg-[#1a1a1a] overflow-hidden text-black dark:text-white">
      {/* Browser Toolbar */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-black/10 dark:border-white/10 bg-[#f0f0f0] dark:bg-[#252525]">
        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded-md hover:bg-black/10 dark:hover:bg-white/10 text-black/50 dark:text-white/50 transition-colors">
            <ChevronLeft size={18} />
          </button>
          <button className="p-1.5 rounded-md hover:bg-black/10 dark:hover:bg-white/10 text-black/50 dark:text-white/50 transition-colors">
            <ChevronRight size={18} />
          </button>
          <button 
            onClick={() => setIsLoading(true)}
            className="p-1.5 rounded-md hover:bg-black/10 dark:hover:bg-white/10 text-black/80 dark:text-white/80 transition-colors"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin text-emerald-500' : ''} />
          </button>
        </div>

        <div className="flex-1 flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-full">
          <Globe size={14} className="text-black/40 dark:text-white/40" />
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-sm outline-none text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40"
            placeholder="Introduce una URL o busca en Google"
          />
        </div>

        <button className="p-1.5 rounded-md hover:bg-black/10 dark:hover:bg-white/10 text-black/80 dark:text-white/80 transition-colors">
          <Home size={18} />
        </button>
      </div>

      {/* Browser Content */}
      <div className="flex-1 relative bg-white dark:bg-black">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-[#1a1a1a] z-10">
            <RefreshCw size={24} className="animate-spin text-emerald-500 mb-4" />
            <p className="text-sm text-black/50 dark:text-white/50">Cargando página...</p>
          </div>
        )}
        <iframe
          src={url}
          className="w-full h-full border-none"
          onLoad={() => setIsLoading(false)}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          title="Browser"
        />
      </div>
    </div>
  );
}
