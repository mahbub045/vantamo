import { create } from 'zustand';
import type { AccentColor } from '../types';

const ACCENT_MAP: Record<AccentColor, number> = {
  indigo: 239, violet: 258, purple: 280, cyan: 189, emerald: 160, orange: 25,
};

interface UIState {
  darkMode: boolean;
  accent: AccentColor;
  sidebarOpen: boolean;
  commandPaletteOpen: boolean;
  toggleDarkMode: () => void;
  setAccent: (color: AccentColor) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  darkMode: localStorage.getItem('vantamo_dark') !== 'false',
  accent: (localStorage.getItem('vantamo_accent') as AccentColor) || 'indigo',
  sidebarOpen: true,
  commandPaletteOpen: false,

  toggleDarkMode: () => {
    const next = !get().darkMode;
    localStorage.setItem('vantamo_dark', String(next));
    set({ darkMode: next });
  },

  setAccent: (color) => {
    localStorage.setItem('vantamo_accent', color);
    document.documentElement.style.setProperty('--accent-h', String(ACCENT_MAP[color]));
    set({ accent: color });
  },

  toggleSidebar: () => set({ sidebarOpen: !get().sidebarOpen }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
}));

// Apply accent on load
const savedAccent = (localStorage.getItem('vantamo_accent') as AccentColor) || 'indigo';
document.documentElement.style.setProperty('--accent-h', String(ACCENT_MAP[savedAccent]));
