'use client';

import React from 'react';

export default function MusicApp() {
  return (
    <div className="h-full w-full bg-[#121212] flex flex-col overflow-hidden">
      <iframe 
        style={{ borderRadius: '0' }} 
        src="https://open.spotify.com/embed/playlist/0vvXsWCC9xrXsKd4FyS8kM?utm_source=generator&theme=0" 
        width="100%" 
        height="100%" 
        frameBorder="0" 
        allowFullScreen={false} 
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
        loading="lazy"
        className="flex-1"
      />
    </div>
  );
}
