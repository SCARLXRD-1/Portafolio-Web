import { create } from 'zustand';

interface SpotlightState {
  isOpen: boolean;
  toggleSpotlight: () => void;
  openSpotlight: () => void;
  closeSpotlight: () => void;
}

export const useSpotlightStore = create<SpotlightState>((set) => ({
  isOpen: false,
  toggleSpotlight: () => set((state) => ({ isOpen: !state.isOpen })),
  openSpotlight: () => set({ isOpen: true }),
  closeSpotlight: () => set({ isOpen: false }),
}));
