import { Activity } from 'lucide-react';
import type { Activity as ActivityType } from '../../types';

const TIME_AGO = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};

const TYPE_ICONS: Record<string, string> = {
  project_created: '📁',
  project_updated: '📝',
  task_created: '✅',
  task_updated: '✏️',
  task_moved: '➡️',
  client_created: '🏢',
  client_updated: '📝',
  comment_added: '💬',
};

export default function ActivityFeed({ activities }: { activities: ActivityType[] }) {
  return (
    <div className="card p-5 animate-slide-up opacity-1" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
      <div className="flex items-center gap-2 mb-4">
        <Activity size={18} className="text-[var(--accent)]" />
        <h3 className="font-semibold font-display text-[var(--text)]">Recent Activity</h3>
      </div>
      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {activities.length === 0 && (
          <p className="text-sm text-[var(--text-muted)] text-center py-4">No recent activity</p>
        )}
        {activities.map(a => (
          <div key={a.id} className="flex items-start gap-3 group">
            <span className="text-sm mt-0.5">{TYPE_ICONS[a.type] || '📌'}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[var(--text)] leading-snug">{a.description}</p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">{TIME_AGO(a.created_at)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
