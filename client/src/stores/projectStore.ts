import { create } from 'zustand';
import { api } from '../api/client';
import type { Project } from '../types';

interface ProjectState {
  projects: Project[];
  loading: boolean;
  fetch: (filters?: Record<string, string>) => Promise<void>;
  create: (data: Partial<Project>) => Promise<Project>;
  update: (id: string, data: Partial<Project>) => Promise<Project>;
  remove: (id: string) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  loading: false,

  fetch: async (filters) => {
    set({ loading: true });
    const projects = await api.getProjects(filters);
    set({ projects, loading: false });
  },

  create: async (data) => {
    const project = await api.createProject(data);
    set({ projects: [project, ...get().projects] });
    return project;
  },

  update: async (id, data) => {
    const project = await api.updateProject(id, data);
    set({ projects: get().projects.map(p => p.id === id ? project : p) });
    return project;
  },

  remove: async (id) => {
    await api.deleteProject(id);
    set({ projects: get().projects.filter(p => p.id !== id) });
  },
}));
