import { create } from 'zustand';

interface ContextMenuState {
  isOpen: boolean;
  x: number;
  y: number;
  targetId: string | null; // useful for context menus on specific items
  openMenu: (x: number, y: number, targetId?: string | null) => void;
  closeMenu: () => void;
}

export const useContextMenuStore = create<ContextMenuState>((set) => ({
  isOpen: false,
  x: 0,
  y: 0,
  targetId: null,
  openMenu: (x, y, targetId = null) => set({ isOpen: true, x, y, targetId }),
  closeMenu: () => set({ isOpen: false }),
}));
