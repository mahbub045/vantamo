import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderKanban, ListTodo, Users, TrendingUp, AlertTriangle, Clock } from 'lucide-react';
import { api } from '../api/client';
import StatsCard from '../components/dashboard/StatsCard';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import type { DashboardData, Activity, User } from '../types';

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.getDashboard().then(setData).catch(console.error);
    api.getActivity(15).then(setActivities).catch(console.error);
    api.getUsers().then(setUsers).catch(console.error);
  }, []);

  if (!data) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card p-5 h-32 animate-shimmer bg-gradient-to-r from-[var(--surface)] via-[var(--bg-subtle)] to-[var(--surface)] bg-[length:200%_100%]" />
        ))}
      </div>
    );
  }

  const workloadMap = new Map(data.workload.map(w => [w.assignee_id, w.count]));

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="Active Projects" value={data.activeProjects} icon={FolderKanban} delay={0} />
        <StatsCard label="Total Tasks" value={data.totalTasks} icon={ListTodo} trend={`${data.completedTasks} completed`} delay={1} />
        <StatsCard label="Team Members" value={users.length} icon={Users} delay={2} />
        <StatsCard label="Completion Rate" value={`${data.completionRate}%`} icon={TrendingUp} accent delay={3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overdue & Upcoming */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overdue */}
          {data.overdueTasks > 0 && (
            <div className="card p-5 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={18} className="text-red-400" />
                <h3 className="font-semibold font-display text-[var(--text)]">Overdue Tasks</h3>
                <span className="text-xs text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">{data.overdueTasks}</span>
              </div>
              <div className="space-y-2">
                {data.overdueTaskList.map(task => (
                  <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-subtle)] hover:bg-[var(--accent-muted)] transition-colors cursor-pointer" onClick={() => navigate('/tasks')}>
                    <div className="flex items-center gap-3 min-w-0">
                      <Badge variant={task.priority} />
                      <span className="text-sm text-[var(--text)] truncate">{task.title}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Clock size={12} className="text-red-400" />
                      <span className="text-xs text-red-400">{task.due_date && new Date(task.due_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Project Status */}
          <div className="card p-5 animate-slide-up" style={{ animationDelay: '0.25s' }}>
            <h3 className="font-semibold font-display text-[var(--text)] mb-4">Project Progress</h3>
            <div className="space-y-3">
              {Object.entries(data.projectStatuses).map(([status, count]) => {
                const total = Object.values(data.projectStatuses).reduce((a, b) => a + b, 0);
                const pct = total > 0 ? (count / total) * 100 : 0;
                return (
                  <div key={status} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant={status} />
                      </div>
                      <span className="text-xs text-[var(--text-muted)]">{count} projects</span>
                    </div>
                    <div className="h-1.5 bg-[var(--bg-subtle)] rounded-full overflow-hidden">
                      <div className="h-full accent-gradient rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Team Workload */}
          <div className="card p-5 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <h3 className="font-semibold font-display text-[var(--text)] mb-4">Team Workload</h3>
            <div className="space-y-3">
              {users.map(user => {
                const load = workloadMap.get(user.id) || 0;
                const maxLoad = Math.max(...[...workloadMap.values(), 1]);
                const pct = (load / maxLoad) * 100;
                return (
                  <div key={user.id} className="flex items-center gap-3">
                    <Avatar name={user.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-[var(--text)] truncate">{user.name}</span>
                        <span className="text-xs text-[var(--text-muted)]">{load} tasks</span>
                      </div>
                      <div className="h-1.5 bg-[var(--bg-subtle)] rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: 'var(--accent)' }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div>
          <ActivityFeed activities={activities} />
        </div>
      </div>
    </div>
  );
}
