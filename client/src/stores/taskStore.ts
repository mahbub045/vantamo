import { create } from 'zustand';
import { api } from '../api/client';
import type { Task } from '../types';

interface TaskState {
  tasks: Task[];
  loading: boolean;
  fetch: (filters?: Record<string, string>) => Promise<void>;
  create: (data: Partial<Task>) => Promise<Task>;
  update: (id: string, data: Partial<Task>) => Promise<Task>;
  move: (id: string, status: string, position: number) => Promise<Task>;
  remove: (id: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  loading: false,

  fetch: async (filters) => {
    set({ loading: true });
    const tasks = await api.getTasks(filters);
    set({ tasks, loading: false });
  },

  create: async (data) => {
    const task = await api.createTask(data);
    set({ tasks: [task, ...get().tasks] });
    return task;
  },

  update: async (id, data) => {
    const task = await api.updateTask(id, data);
    set({ tasks: get().tasks.map(t => t.id === id ? task : t) });
    return task;
  },

  move: async (id, status, position) => {
    const task = await api.moveTask(id, status, position);
    set({ tasks: get().tasks.map(t => t.id === id ? task : t) });
    return task;
  },

  remove: async (id) => {
    await api.deleteTask(id);
    set({ tasks: get().tasks.filter(t => t.id !== id) });
  },
}));
