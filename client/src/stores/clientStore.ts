import { create } from 'zustand';
import { api } from '../api/client';
import type { Client } from '../types';

interface ClientState {
  clients: Client[];
  loading: boolean;
  fetch: (q?: string) => Promise<void>;
  create: (data: Partial<Client>) => Promise<Client>;
  update: (id: string, data: Partial<Client>) => Promise<Client>;
  archive: (id: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export const useClientStore = create<ClientState>((set, get) => ({
  clients: [],
  loading: false,

  fetch: async (q) => {
    set({ loading: true });
    const clients = await api.getClients(q);
    set({ clients, loading: false });
  },

  create: async (data) => {
    const client = await api.createClient(data);
    set({ clients: [client, ...get().clients] });
    return client;
  },

  update: async (id, data) => {
    const client = await api.updateClient(id, data);
    set({ clients: get().clients.map(c => c.id === id ? client : c) });
    return client;
  },

  archive: async (id) => {
    await api.archiveClient(id);
    set({ clients: get().clients.filter(c => c.id !== id) });
  },

  remove: async (id) => {
    await api.deleteClient(id);
    set({ clients: get().clients.filter(c => c.id !== id) });
  },
}));
