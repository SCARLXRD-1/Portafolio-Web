import { create } from 'zustand';
import { insforge } from '@/lib/insforge';
import { UserSchema } from '@insforge/sdk';

interface AuthState {
  user: UserSchema | null;
  isAdmin: boolean;
  profile: any | null;
  isLoading: boolean;
  initialize: () => Promise<void>;
  signOut: () => Promise<void>;
  fetchProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAdmin: false,
  profile: null,
  isLoading: true,

  initialize: async () => {
    // Get current user (automatically waits for OAuth callback if any)
    const { data: { user }, error } = await insforge.auth.getCurrentUser();
    
    if (user) {
      const isAdmin = user.email === 'jobathanjimenez1265@gmail.com';
      if (!isAdmin) {
        // Force sign out if not admin to enforce strict rule
        await insforge.auth.signOut();
        set({ user: null, isAdmin: false, isLoading: false, profile: null });
        return;
      }
      set({ user, isAdmin, isLoading: false });
      get().fetchProfile();
    } else {
      set({ user: null, isAdmin: false, isLoading: false, profile: null });
    }
  },

  fetchProfile: async () => {
    const { data, error } = await insforge.database
      .from('profile_settings')
      .select('*')
      .eq('id', '00000000-0000-0000-0000-000000000001')
      .single();
    
    if (data) {
      set({ profile: data });
    }
  },

  signOut: async () => {
    await insforge.auth.signOut();
    set({ user: null, isAdmin: false, profile: null });
  }
}));
