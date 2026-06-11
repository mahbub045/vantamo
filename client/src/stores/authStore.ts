import { create } from 'zustand';
import { api } from '../api/client';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('vantamo_token'),
  loading: true,

  login: async (email, password) => {
    const { user, token } = await api.login(email, password);
    localStorage.setItem('vantamo_token', token);
    set({ user, token });
  },

  register: async (name, email, password) => {
    const { user, token } = await api.register(name, email, password);
    localStorage.setItem('vantamo_token', token);
    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem('vantamo_token');
    set({ user: null, token: null });
  },

  loadUser: async () => {
    const token = localStorage.getItem('vantamo_token');
    if (!token) { set({ loading: false }); return; }
    try {
      const user = await api.getMe();
      set({ user, token, loading: false });
    } catch {
      localStorage.removeItem('vantamo_token');
      set({ user: null, token: null, loading: false });
    }
  },
}));
