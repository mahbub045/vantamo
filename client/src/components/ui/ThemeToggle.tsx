import { Moon, Sun } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';

export default function ThemeToggle() {
  const { darkMode, toggleDarkMode } = useUIStore();
  return (
    <button
      onClick={toggleDarkMode}
      className="w-9 h-9 rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--accent-muted)] transition-all duration-200 cursor-pointer"
      title="Toggle theme"
    >
      {darkMode ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
