import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Edit3, Plus } from 'lucide-react';
import { api } from '../api/client';
import { useTaskStore } from '../stores/taskStore';
import { useTeamStore } from '../stores/teamStore';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import KanbanBoard from '../components/kanban/KanbanBoard';
import type { Project, Task } from '../types';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [view, setView] = useState<'board' | 'list'>('board');
  const [modalOpen, setModalOpen] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: '', description: '', priority: 'medium', assignee_id: '', due_date: '' });
  const { members, fetch: fetchTeam } = useTeamStore();

  const load = async () => {
    if (!id) return;
    const [p, t] = await Promise.all([api.getProject(id), api.getProjectTasks(id)]);
    setProject(p);
    setTasks(t);
  };

  useEffect(() => { load(); fetchTeam(); }, [id]);

  const handleMoveTask = async (taskId: string, status: string, position: number) => {
    await api.moveTask(taskId, status, position);
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: status as any, position } : t));
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const task = await api.createTask({
      ...taskForm,
      project_id: id,
      assignee_id: taskForm.assignee_id || null,
      due_date: taskForm.due_date || null,
    });
    setTasks(prev => [task, ...prev]);
    setModalOpen(false);
    setTaskForm({ title: '', description: '', priority: 'medium', assignee_id: '', due_date: '' });
  };

  if (!project) {
    return <div className="flex items-center justify-center h-64 text-[var(--text-muted)]">Loading...</div>;
  }

  return (
    <div className="space-y-6 max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/projects')} className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--accent-muted)] transition-colors cursor-pointer">
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold font-display">{project.name}</h2>
              <Badge variant={project.status} />
              <Badge variant={project.priority} />
            </div>
            {project.description && <p className="text-sm text-[var(--text-secondary)] mt-1">{project.description}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg overflow-hidden border border-[var(--border)]">
            <button onClick={() => setView('board')} className={`h-8 px-3 text-xs font-medium transition-colors cursor-pointer ${view === 'board' ? 'accent-bg' : 'text-[var(--text-muted)] hover:text-[var(--text)]'}`}>Board</button>
            <button onClick={() => setView('list')} className={`h-8 px-3 text-xs font-medium transition-colors cursor-pointer ${view === 'list' ? 'accent-bg' : 'text-[var(--text-muted)] hover:text-[var(--text)]'}`}>List</button>
          </div>
          <Button onClick={() => setModalOpen(true)} size="sm">
            <Plus size={14} /> Add Task
          </Button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="card p-4 flex items-center gap-4">
        <span className="text-xs text-[var(--text-muted)] whitespace-nowrap">Progress</span>
        <div className="flex-1 h-2 bg-[var(--bg-subtle)] rounded-full overflow-hidden">
          <div className="h-full accent-gradient rounded-full transition-all duration-500" style={{ width: `${project.progress}%` }} />
        </div>
        <span className="text-xs font-medium text-[var(--text)]">{project.progress}%</span>
        {project.due_date && (
          <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
            <Calendar size={12} />
            Due {new Date(project.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>

      {/* Board / List */}
      {view === 'board' ? (
        <KanbanBoard tasks={tasks} users={members} onMoveTask={handleMoveTask} />
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Task</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Priority</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task.id} className="border-b border-[var(--border-subtle)] hover:bg-[var(--accent-muted)] transition-colors">
                  <td className="py-3 px-4 font-medium text-[var(--text)]">{task.title}</td>
                  <td className="py-3 px-4"><Badge variant={task.status} /></td>
                  <td className="py-3 px-4"><Badge variant={task.priority} /></td>
                  <td className="py-3 px-4 text-[var(--text-muted)]">{task.due_date ? new Date(task.due_date).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {tasks.length === 0 && <p className="text-center py-8 text-sm text-[var(--text-muted)]">No tasks yet</p>}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Task">
        <form onSubmit={handleCreateTask} className="space-y-4">
          <Input label="Title" value={taskForm.title} onChange={e => setTaskForm({ ...taskForm, title: e.target.value })} required />
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Priority"
              value={taskForm.priority}
              onChange={e => setTaskForm({ ...taskForm, priority: e.target.value })}
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
                { value: 'critical', label: 'Critical' },
              ]}
            />
            <Select
              label="Assignee"
              value={taskForm.assignee_id}
              onChange={e => setTaskForm({ ...taskForm, assignee_id: e.target.value })}
              options={[{ value: '', label: 'Unassigned' }, ...members.map(m => ({ value: m.id, label: m.name }))]}
            />
          </div>
          <Input label="Due Date" type="date" value={taskForm.due_date} onChange={e => setTaskForm({ ...taskForm, due_date: e.target.value })} />
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Description</label>
            <textarea
              value={taskForm.description}
              onChange={e => setTaskForm({ ...taskForm, description: e.target.value })}
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
