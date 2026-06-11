import { create } from 'zustand';
import { api } from '../api/client';
import type { User } from '../types';

interface TeamState {
  members: User[];
  loading: boolean;
  fetch: () => Promise<void>;
}

export const useTeamStore = create<TeamState>((set) => ({
  members: [],
  loading: false,

  fetch: async () => {
    set({ loading: true });
    const members = await api.getUsers();
    set({ members, loading: false });
  },
}));
