'use client';

import React from 'react';
import { Music } from 'lucide-react';

export default function MusicApp() {
  return (
    <div className="flex flex-col h-full bg-[#121212] overflow-hidden text-white">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-[#181818]">
        <div className="p-2 bg-emerald-500 rounded-full">
          <Music size={16} className="text-black" />
        </div>
        <h3 className="font-semibold tracking-wide">Reproductor</h3>
      </div>
      
      <div className="flex-1 w-full bg-black">
        {/* Spotify Embed Lofi Playlist as default */}
        <iframe 
          style={{ borderRadius: '0' }} 
          src="https://open.spotify.com/embed/playlist/0vvXsWCC9xrXsKd4FyS8kM?utm_source=generator&theme=0" 
          width="100%" 
          height="100%" 
          frameBorder="0" 
          allowFullScreen={false} 
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
          loading="lazy"
        />
      </div>
    </div>
  );
}
