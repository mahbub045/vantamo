import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, FolderKanban, Calendar } from 'lucide-react';
import { useProjectStore } from '../stores/projectStore';
import { useClientStore } from '../stores/clientStore';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import type { Project } from '../types';

export default function ProjectsPage() {
  const { projects, loading, fetch: fetchProjects, create } = useProjectStore();
  const { clients, fetch: fetchClients } = useClientStore();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<Partial<Project>>({ name: '', description: '', status: 'planning', priority: 'medium', client_id: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
    fetchClients();
  }, []);

  const filtered = projects.filter(p => {
    if (filterStatus && p.status !== filterStatus) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const project = await create({ ...form, client_id: form.client_id || null });
    setModalOpen(false);
    navigate(`/projects/${project.id}`);
  };

  const getClientName = (clientId: string | null) => {
    if (!clientId) return null;
    return clients.find(c => c.id === clientId)?.name || 'Unknown';
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display">Projects</h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1">{projects.length} total projects</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus size={16} /> New Project
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-full h-9 pl-9 pr-3 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['', 'planning', 'active', 'review', 'completed', 'on_hold'].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`h-8 px-3 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                filterStatus === s ? 'accent-bg' : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--accent-muted)]'
              }`}
            >
              {s ? s.replace('_', ' ') : 'All'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading && projects.length === 0 ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="card p-5 h-40 animate-shimmer bg-gradient-to-r from-[var(--surface)] via-[var(--bg-subtle)] to-[var(--surface)] bg-[length:200%_100%]" />
          ))
        ) : filtered.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <FolderKanban size={48} className="mx-auto text-[var(--text-muted)] mb-4" />
            <p className="text-lg font-medium text-[var(--text)]">No projects found</p>
          </div>
        ) : (
          filtered.map((project, i) => (
            <div
              key={project.id}
              className="card p-5 animate-slide-up opacity-0 hover:border-[var(--accent)]/30 transition-all cursor-pointer"
              style={{ animationDelay: `${i * 0.05}s`, animationFillMode: 'forwards' }}
              onClick={() => navigate(`/projects/${project.id}`)}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-[var(--text)]">{project.name}</h3>
                  {project.client_id && (
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">{getClientName(project.client_id)}</p>
                  )}
                </div>
                <Badge variant={project.status} />
              </div>

              {project.description && (
                <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-3">{project.description}</p>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant={project.priority} />
                  {project.due_date && (
                    <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                      <Calendar size={12} />
                      {new Date(project.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-[var(--bg-subtle)] rounded-full overflow-hidden">
                    <div className="h-full accent-gradient rounded-full" style={{ width: `${project.progress}%` }} />
                  </div>
                  <span className="text-xs text-[var(--text-muted)]">{project.progress}%</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Project">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Project Name" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <Select
            label="Client"
            value={form.client_id || ''}
            onChange={e => setForm({ ...form, client_id: e.target.value || null })}
            options={[{ value: '', label: 'No client' }, ...clients.map(c => ({ value: c.id, label: c.name }))]}
          />
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Status"
              value={form.status || 'planning'}
              onChange={e => setForm({ ...form, status: e.target.value as any })}
              options={[
                { value: 'planning', label: 'Planning' },
                { value: 'active', label: 'Active' },
                { value: 'review', label: 'Review' },
                { value: 'completed', label: 'Completed' },
                { value: 'on_hold', label: 'On Hold' },
              ]}
            />
            <Select
              label="Priority"
              value={form.priority || 'medium'}
              onChange={e => setForm({ ...form, priority: e.target.value as any })}
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
                { value: 'critical', label: 'Critical' },
              ]}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Start Date" type="date" value={form.start_date || ''} onChange={e => setForm({ ...form, start_date: e.target.value })} />
            <Input label="Due Date" type="date" value={form.due_date || ''} onChange={e => setForm({ ...form, due_date: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Description</label>
            <textarea
              value={form.description || ''}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-3.5 py-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-sm text-[var(--text)] transition-all duration-200 focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-glow)] resize-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">Create Project</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
