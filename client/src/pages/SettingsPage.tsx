import { useUIStore } from '../stores/uiStore';
import { useAuthStore } from '../stores/authStore';
import Avatar from '../components/ui/Avatar';
import type { AccentColor } from '../types';

const ACCENTS: { name: AccentColor; color: string }[] = [
  { name: 'indigo', color: '#6366f1' },
  { name: 'violet', color: '#8b5cf6' },
  { name: 'purple', color: '#a855f7' },
  { name: 'cyan', color: '#06b6d4' },
  { name: 'emerald', color: '#10b981' },
  { name: 'orange', color: '#f97316' },
];

export default function SettingsPage() {
  const { accent, setAccent, darkMode, toggleDarkMode } = useUIStore();
  const { user } = useAuthStore();

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold font-display">Settings</h2>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Customize your experience</p>
      </div>

      {/* Profile */}
      <div className="card p-6">
        <h3 className="font-semibold font-display text-[var(--text)] mb-4">Profile</h3>
        <div className="flex items-center gap-4">
          <Avatar name={user?.name || 'U'} size="lg" />
          <div>
            <p className="font-medium text-[var(--text)]">{user?.name}</p>
            <p className="text-sm text-[var(--text-muted)]">{user?.email}</p>
            <p className="text-xs text-[var(--text-muted)] capitalize mt-0.5">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="card p-6 space-y-6">
        <h3 className="font-semibold font-display text-[var(--text)]">Appearance</h3>

        {/* Theme */}
        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] block mb-3">Theme</label>
          <div className="flex gap-3">
            <button
              onClick={() => { if (darkMode) toggleDarkMode(); }}
              className={`flex items-center gap-3 h-12 px-5 rounded-xl border-2 transition-all cursor-pointer ${
                !darkMode ? 'border-[var(--accent)] bg-[var(--surface)]' : 'border-[var(--border)] hover:border-[var(--accent)]/30'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-100 to-amber-200" />
              <span className="text-sm font-medium text-[var(--text)]">Light</span>
            </button>
            <button
              onClick={() => { if (!darkMode) toggleDarkMode(); }}
              className={`flex items-center gap-3 h-12 px-5 rounded-xl border-2 transition-all cursor-pointer ${
                darkMode ? 'border-[var(--accent)] bg-[var(--surface)]' : 'border-[var(--border)] hover:border-[var(--accent)]/30'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-slate-700 to-slate-900" />
              <span className="text-sm font-medium text-[var(--text)]">Dark</span>
            </button>
          </div>
        </div>

        {/* Accent */}
        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] block mb-3">Accent Color</label>
          <div className="flex gap-3">
            {ACCENTS.map(a => (
              <button
                key={a.name}
                onClick={() => setAccent(a.name)}
                className={`w-10 h-10 rounded-xl transition-all cursor-pointer ${
                  accent === a.name ? 'ring-2 ring-offset-2 ring-offset-[var(--surface)] scale-110' : 'hover:scale-105'
                }`}
                style={{ background: a.color, ringColor: a.color }}
                title={a.name}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Integrations (future) */}
      <div className="card p-6">
        <h3 className="font-semibold font-display text-[var(--text)] mb-2">Integrations</h3>
        <p className="text-sm text-[var(--text-muted)] mb-4">Connect your favorite tools</p>
        <div className="grid grid-cols-2 gap-3">
          {['Slack', 'Google Workspace', 'Microsoft 365', 'GitHub'].map(int => (
            <div key={int} className="flex items-center justify-between p-3 rounded-lg border border-[var(--border)] opacity-50">
              <span className="text-sm text-[var(--text)]">{int}</span>
              <span className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider">Coming Soon</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
