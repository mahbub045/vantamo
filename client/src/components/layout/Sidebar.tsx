import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Building2, FolderKanban, ListTodo, Users,
  Settings, Search, ChevronLeft
} from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/clients', label: 'Clients', icon: Building2 },
  { path: '/projects', label: 'Projects', icon: FolderKanban },
  { path: '/tasks', label: 'Tasks', icon: ListTodo },
  { path: '/team', label: 'Team', icon: Users },
];

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar, setCommandPaletteOpen } = useUIStore();

  return (
    <aside className={`${sidebarOpen ? 'w-60' : 'w-[68px]'} h-screen flex flex-col border-r border-[var(--border)] bg-[var(--surface)] transition-all duration-300 relative flex-shrink-0`}>
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-lg accent-gradient flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm font-display">V</span>
          </div>
          {sidebarOpen && (
            <span className="text-base font-semibold font-display tracking-tight text-[var(--text)] whitespace-nowrap">
              Vantamo
            </span>
          )}
        </div>
      </div>

      {/* Search trigger */}
      <div className="px-3 mt-4 mb-2">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className={`w-full flex items-center gap-2.5 h-9 px-3 rounded-lg text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] bg-[var(--bg-subtle)] border border-[var(--border-subtle)] hover:border-[var(--border)] transition-all cursor-pointer`}
        >
          <Search size={15} className="flex-shrink-0" />
          {sidebarOpen && (
            <>
              <span className="flex-1 text-left truncate">Search</span>
              <kbd className="hidden lg:flex items-center h-5 px-1.5 text-[10px] font-mono bg-[var(--surface)] border border-[var(--border)] rounded">⌘K</kbd>
            </>
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-2.5 h-9 px-3 rounded-lg text-sm transition-all duration-200 group relative ${
                isActive
                  ? 'accent-bg font-medium'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--accent-muted)]'
              }`
            }
          >
            <item.icon size={18} className="flex-shrink-0" />
            {sidebarOpen && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-[var(--border)] space-y-0.5">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-2.5 h-9 px-3 rounded-lg text-sm transition-all duration-200 ${
              isActive ? 'accent-bg font-medium' : 'text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--accent-muted)]'
            }`
          }
        >
          <Settings size={18} className="flex-shrink-0" />
          {sidebarOpen && <span className="truncate">Settings</span>}
        </NavLink>
      </div>

      {/* Collapse button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--accent)] transition-all z-10 cursor-pointer"
      >
        <ChevronLeft size={14} className={`transition-transform ${sidebarOpen ? '' : 'rotate-180'}`} />
      </button>
    </aside>
  );
}
