import { useLocation } from 'react-router-dom';
import { Bell, Command } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useUIStore } from '../../stores/uiStore';
import Avatar from '../ui/Avatar';
import ThemeToggle from '../ui/ThemeToggle';

const TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/clients': 'Clients',
  '/projects': 'Projects',
  '/tasks': 'Tasks',
  '/team': 'Team',
  '/settings': 'Settings',
};

export default function Header() {
  const { pathname } = useLocation();
  const { user, logout } = useAuthStore();
  const { setCommandPaletteOpen } = useUIStore();

  const title = TITLES[pathname] || 'Vantamo';

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-md sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold font-display text-[var(--text)]">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="hidden sm:flex items-center gap-2 h-8 px-3 rounded-lg text-xs text-[var(--text-muted)] bg-[var(--bg-subtle)] border border-[var(--border)] hover:border-[var(--accent)] transition-all cursor-pointer"
        >
          <Command size={14} />
          <span>⌘K</span>
        </button>

        <ThemeToggle />

        <button className="relative w-9 h-9 rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--accent-muted)] transition-colors cursor-pointer">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full accent-gradient" />
        </button>

        <div className="flex items-center gap-2 ml-2 pl-3 border-l border-[var(--border)]">
          <Avatar name={user?.name || 'U'} size="sm" />
          <div className="hidden md:block">
            <p className="text-xs font-medium text-[var(--text)] leading-none">{user?.name}</p>
            <p className="text-[10px] text-[var(--text-muted)] capitalize">{user?.role}</p>
          </div>
          <button onClick={logout} className="ml-1 text-[10px] text-[var(--text-muted)] hover:text-red-400 transition-colors cursor-pointer">
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
