import { useEffect, useState } from 'react';
import { Plus, Filter, LayoutGrid, List } from 'lucide-react';
import { useTaskStore } from '../stores/taskStore';
import { useProjectStore } from '../stores/projectStore';
import { useTeamStore } from '../stores/teamStore';
import { api } from '../api/client';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import Select from '../components/ui/Select';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import KanbanBoard from '../components/kanban/KanbanBoard';
import type { Task } from '../types';

export default function TasksPage() {
  const { tasks, loading, fetch: fetchTasks, create, move } = useTaskStore();
  const { projects, fetch: fetchProjects } = useProjectStore();
  const { members, fetch: fetchTeam } = useTeamStore();
  const [view, setView] = useState<'board' | 'list'>('board');
  const [filterProject, setFilterProject] = useState('');
  const [filterAssignee, setFilterAssignee] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', project_id: '', priority: 'medium', assignee_id: '', due_date: '' });

  useEffect(() => {
    fetchTasks();
    fetchProjects();
    fetchTeam();
  }, []);

  const filtered = tasks.filter(t => {
    if (filterProject && t.project_id !== filterProject) return false;
    if (filterAssignee && t.assignee_id !== filterAssignee) return false;
    if (filterPriority && t.priority !== filterPriority) return false;
    return true;
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await create({
      ...form,
      project_id: form.project_id || null,
      assignee_id: form.assignee_id || null,
      due_date: form.due_date || null,
      status: 'todo',
    });
    setModalOpen(false);
    setForm({ title: '', description: '', project_id: '', priority: 'medium', assignee_id: '', due_date: '' });
  };

  const handleMoveTask = async (taskId: string, status: string, position: number) => {
    await move(taskId, status, position);
  };

  const getUserName = (id: string | null) => members.find(m => m.id === id)?.name || 'Unassigned';

  return (
    <div className="space-y-6 max-w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display">Tasks</h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1">{tasks.length} total tasks</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg overflow-hidden border border-[var(--border)]">
            <button onClick={() => setView('board')} className={`w-8 h-8 flex items-center justify-center transition-colors cursor-pointer ${view === 'board' ? 'accent-bg' : 'text-[var(--text-muted)] hover:text-[var(--text)]'}`}>
              <LayoutGrid size={14} />
            </button>
            <button onClick={() => setView('list')} className={`w-8 h-8 flex items-center justify-center transition-colors cursor-pointer ${view === 'list' ? 'accent-bg' : 'text-[var(--text-muted)] hover:text-[var(--text)]'}`}>
              <List size={14} />
            </button>
          </div>
          <Button onClick={() => setModalOpen(true)}>
            <Plus size={16} /> New Task
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select value={filterProject} onChange={e => setFilterProject(e.target.value)} className="h-9 px-3 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent)] cursor-pointer">
          <option value="">All Projects</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select value={filterAssignee} onChange={e => setFilterAssignee(e.target.value)} className="h-9 px-3 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent)] cursor-pointer">
          <option value="">All Members</option>
          {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
        <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="h-9 px-3 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent)] cursor-pointer">
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      {/* Content */}
      {view === 'board' ? (
        <KanbanBoard tasks={filtered} users={members} onMoveTask={handleMoveTask} />
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Task</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Project</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Priority</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Assignee</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Due</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(task => {
                const project = projects.find(p => p.id === task.project_id);
                return (
                  <tr key={task.id} className="border-b border-[var(--border-subtle)] hover:bg-[var(--accent-muted)] transition-colors">
                    <td className="py-3 px-4 font-medium text-[var(--text)]">{task.title}</td>
                    <td className="py-3 px-4 text-[var(--text-secondary)]">{project?.name || '—'}</td>
                    <td className="py-3 px-4"><Badge variant={task.status} /></td>
                    <td className="py-3 px-4"><Badge variant={task.priority} /></td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Avatar name={getUserName(task.assignee_id)} size="sm" />
                        <span className="text-[var(--text-secondary)]">{getUserName(task.assignee_id)}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[var(--text-muted)]">{task.due_date ? new Date(task.due_date).toLocaleDateString() : '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="text-center py-8 text-sm text-[var(--text-muted)]">No tasks match filters</p>}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Task">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          <Select
            label="Project"
            value={form.project_id}
            onChange={e => setForm({ ...form, project_id: e.target.value })}
            options={[{ value: '', label: 'No project' }, ...projects.map(p => ({ value: p.id, label: p.name }))]}
          />
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Priority"
              value={form.priority}
              onChange={e => setForm({ ...form, priority: e.target.value })}
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
                { value: 'critical', label: 'Critical' },
              ]}
            />
            <Select
              label="Assignee"
              value={form.assignee_id}
              onChange={e => setForm({ ...form, assignee_id: e.target.value })}
              options={[{ value: '', label: 'Unassigned' }, ...members.map(m => ({ value: m.id, label: m.name }))]}
            />
          </div>
          <Input label="Due Date" type="date" value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} />
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-3.5 py-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-sm text-[var(--text)] transition-all duration-200 focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-glow)] resize-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">Create Task</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
