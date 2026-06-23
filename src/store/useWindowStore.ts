import { create } from 'zustand';

export type AppId = 'terminal' | 'projects' | 'about' | 'skills' | 'contact' | 'chat' | 'experiments' | 'browser' | 'certificates' | 'experience' | 'settings' | 'music' | 'files' | 'notes';

export interface WindowState {
  id: AppId;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
}

interface WindowStore {
  windows: Record<AppId, WindowState>;
  activeWindow: AppId | null;
  openWindow: (id: AppId) => void;
  closeWindow: (id: AppId) => void;
  minimizeWindow: (id: AppId) => void;
  maximizeWindow: (id: AppId) => void;
  focusWindow: (id: AppId) => void;
  resizeWindow: (id: AppId, width: number, height: number) => void;
  moveWindow: (id: AppId, x: number, y: number) => void;
  wallpaperId: string;
  setWallpaperId: (id: string) => void;
  isBooted: boolean;
  setBooted: (val: boolean) => void;
  isLocked: boolean;
  setLocked: (val: boolean) => void;
}

const defaultWindows: Record<AppId, WindowState> = {
  terminal: { id: 'terminal', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0, width: 800, height: 500 },
  projects: { id: 'projects', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0, width: 900, height: 600 },
  about: { id: 'about', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0, width: 800, height: 500 },
  skills: { id: 'skills', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0, width: 900, height: 600 },
  contact: { id: 'contact', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0, width: 800, height: 600 },
  chat: { id: 'chat', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0, width: 450, height: 600 },
  experiments: { id: 'experiments', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0, width: 1000, height: 650 },
  browser: { id: 'browser', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0, width: 1000, height: 650 },
  certificates: { id: 'certificates', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0, width: 900, height: 600 },
  experience: { id: 'experience', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0, width: 900, height: 650 },
  settings: { id: 'settings', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0, width: 700, height: 500 },
  music: { id: 'music', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0, width: 340, height: 420 },
  files: { id: 'files', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0, width: 750, height: 500 },
  notes: { id: 'notes', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0, width: 800, height: 600 },
};

let highestZIndex = 1;

export const useWindowStore = create<WindowStore>((set) => ({
  windows: defaultWindows,
  activeWindow: null,
  wallpaperId: globalThis.window === undefined ? 'global' : localStorage.getItem('os_wallpaper') || 'global',

  setWallpaperId: (id) => {
    if (globalThis.window !== undefined) localStorage.setItem('os_wallpaper', id);
    set({ wallpaperId: id });
  },

  openWindow: (id) => set((state) => {
    highestZIndex += 1;
    return {
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], isOpen: true, isMinimized: false, zIndex: highestZIndex }
      },
      activeWindow: id
    };
  }),

  closeWindow: (id) => set((state) => ({
    windows: {
      ...state.windows,
      [id]: { ...state.windows[id], isOpen: false }
    },
    activeWindow: state.activeWindow === id ? null : state.activeWindow
  })),

  minimizeWindow: (id) => set((state) => ({
    windows: {
      ...state.windows,
      [id]: { ...state.windows[id], isMinimized: true }
    },
    activeWindow: state.activeWindow === id ? null : state.activeWindow
  })),

  maximizeWindow: (id) => set((state) => ({
    windows: {
      ...state.windows,
      [id]: { ...state.windows[id], isMaximized: !state.windows[id].isMaximized }
    }
  })),

  focusWindow: (id) => set((state) => {
    if (state.activeWindow === id && state.windows[id].zIndex === highestZIndex) {
      return state;
    }
    highestZIndex += 1;
    return {
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], isMinimized: false, zIndex: highestZIndex }
      },
      activeWindow: id
    };
  }),

  resizeWindow: (id, width, height) => set((state) => ({
    windows: {
      ...state.windows,
      [id]: { ...state.windows[id], width, height }
    }
  })),

  moveWindow: (id, x, y) => set((state) => ({
    windows: {
      ...state.windows,
      [id]: { ...state.windows[id], x, y },
    },
  })),

  wallpaperId: '1',
  setWallpaperId: (id) => set({ wallpaperId: id }),

  isBooted: false,
  setBooted: (val) => set({ isBooted: val }),
  
  isLocked: true,
  setLocked: (val) => set({ isLocked: val }),
}));
