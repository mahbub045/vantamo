import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, FolderKanban, ListTodo, Users, Building2, ArrowRight } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import { useKeyboardShortcut } from '../../hooks/useKeyboardShortcut';
import { api } from '../../api/client';
import type { SearchResults } from '../../types';

export default function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen } = useUIStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults | null>(null);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useKeyboardShortcut('k', () => setCommandPaletteOpen(!commandPaletteOpen), { meta: true });
  useKeyboardShortcut('k', () => setCommandPaletteOpen(!commandPaletteOpen), { ctrl: true });

  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('');
      setResults(null);
      setSelectedIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [commandPaletteOpen]);

  useEffect(() => {
    if (!query || query.length < 2) { setResults(null); return; }
    const timer = setTimeout(async () => {
      try { setResults(await api.search(query)); } catch { /* ignore */ }
    }, 200);
    return () => clearTimeout(timer);
  }, [query]);

  const getItems = useCallback(() => {
    const items: { id: string; icon: React.ReactNode; label: string; sub?: string; action: () => void }[] = [];

    if (!query) {
      items.push(
        { id: 'new-task', icon: <ListTodo size={16} />, label: 'Create New Task', action: () => { setCommandPaletteOpen(false); navigate('/tasks'); } },
        { id: 'new-project', icon: <FolderKanban size={16} />, label: 'Create New Project', action: () => { setCommandPaletteOpen(false); navigate('/projects'); } },
        { id: 'nav-dash', icon: <ArrowRight size={16} />, label: 'Go to Dashboard', action: () => { setCommandPaletteOpen(false); navigate('/'); } },
        { id: 'nav-projects', icon: <ArrowRight size={16} />, label: 'Go to Projects', action: () => { setCommandPaletteOpen(false); navigate('/projects'); } },
        { id: 'nav-clients', icon: <ArrowRight size={16} />, label: 'Go to Clients', action: () => { setCommandPaletteOpen(false); navigate('/clients'); } },
        { id: 'nav-team', icon: <ArrowRight size={16} />, label: 'Go to Team', action: () => { setCommandPaletteOpen(false); navigate('/team'); } },
      );
    }

    if (results) {
      results.clients.forEach(c => items.push({
        id: `client-${c.id}`, icon: <Building2 size={16} />, label: c.name, sub: c.company || undefined,
        action: () => { setCommandPaletteOpen(false); navigate('/clients'); },
      }));
      results.projects.forEach(p => items.push({
        id: `project-${p.id}`, icon: <FolderKanban size={16} />, label: p.name, sub: p.status,
        action: () => { setCommandPaletteOpen(false); navigate(`/projects/${p.id}`); },
      }));
      results.tasks.forEach(t => items.push({
        id: `task-${t.id}`, icon: <ListTodo size={16} />, label: t.title, sub: t.status,
        action: () => { setCommandPaletteOpen(false); navigate('/tasks'); },
      }));
    }

    return items;
  }, [query, results, navigate, setCommandPaletteOpen]);

  const items = getItems();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIdx(i => Math.min(i + 1, items.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIdx(i => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter' && items[selectedIdx]) { items[selectedIdx].action(); }
  };

  if (!commandPaletteOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]" onClick={() => setCommandPaletteOpen(false)}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden animate-slide-down"
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]">
          <Search size={18} className="text-[var(--text-muted)] flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => { setQuery(e.target.value); setSelectedIdx(0); }}
            placeholder="Search or type a command..."
            className="flex-1 bg-transparent text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] outline-none"
          />
          <kbd className="hidden sm:flex items-center h-5 px-1.5 text-[10px] font-mono text-[var(--text-muted)] bg-[var(--bg-subtle)] border border-[var(--border)] rounded">
            ESC
          </kbd>
        </div>
        <div className="max-h-72 overflow-y-auto py-2">
          {items.length === 0 && query.length >= 2 && (
            <p className="px-4 py-8 text-center text-sm text-[var(--text-muted)]">No results found</p>
          )}
          {items.map((item, i) => (
            <button
              key={item.id}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer ${i === selectedIdx ? 'bg-[var(--accent-muted)] text-[var(--text)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]'}`}
              onClick={item.action}
              onMouseEnter={() => setSelectedIdx(i)}
            >
              <span className="text-[var(--text-muted)]">{item.icon}</span>
              <span className="flex-1 text-left truncate">{item.label}</span>
              {item.sub && <span className="text-xs text-[var(--text-muted)]">{item.sub}</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
