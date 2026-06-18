export interface Wallpaper {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'color';
}

export const WALLPAPERS: Wallpaper[] = [
  {
    id: 'default-dark',
    name: 'MacOS Dark',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
    type: 'image'
  },
  {
    id: 'abstract-fluid',
    name: 'Abstract Fluid',
    url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop',
    type: 'image'
  },
  {
    id: 'neon-cyberpunk',
    name: 'Neon Cyberpunk',
    url: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=2070&auto=format&fit=crop',
    type: 'image'
  },
  {
    id: 'mountain-minimal',
    name: 'Minimal Mountain',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop',
    type: 'image'
  },
  {
    id: 'space-nebula',
    name: 'Space Nebula',
    url: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2048&auto=format&fit=crop',
    type: 'image'
  },
  {
    id: 'live-waves',
    name: 'Live Waves',
    url: 'waves',
    type: 'color'
  },
  {
    id: 'global',
    name: 'Default (Admin)',
    url: 'global',
    type: 'color'
  },
  {
    id: 'solid-black',
    name: 'Solid Black',
    url: '#000000',
    type: 'color'
  }
];
