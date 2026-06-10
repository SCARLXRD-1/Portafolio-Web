import { create } from 'zustand';
import { insforge } from '@/lib/insforge';

interface SiteSettings {
  accent_color: string;
  username: string;
  wallpaper_url: string | null;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
}

interface SettingsStore extends SiteSettings {
  isLoaded: boolean;
  fetchSettings: () => Promise<void>;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  isLoaded: false,
  accent_color: 'emerald',
  username: 'admin_akashi',
  wallpaper_url: null,
  seo_title: 'AKASHI DEV - OS Portfolio',
  seo_description: 'Creative developer portfolio built like a web operating system.',
  seo_keywords: 'React, Nextjs, Frontend, Developer, OS',

  fetchSettings: async () => {
    try {
      const { data, error } = await insforge.database
        .from('site_settings')
        .select('*')
        .eq('id', 1)
        .single();
      
      if (!error && data) {
        set({
          isLoaded: true,
          accent_color: data.accent_color || 'emerald',
          username: data.username || 'admin_akashi',
          wallpaper_url: data.wallpaper_url,
          seo_title: data.seo_title || 'AKASHI DEV - OS Portfolio',
          seo_description: data.seo_description || 'Creative developer portfolio built like a web operating system.',
          seo_keywords: data.seo_keywords || 'React, Nextjs, Frontend, Developer, OS',
        });
      }
    } catch (e) {
      console.error('Failed to fetch settings', e);
    }
  },

  updateSettings: (newSettings) => set((state) => ({ ...state, ...newSettings })),
}));
