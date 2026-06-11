import { useEffect, useState } from 'react';
import { Plus, Search, Building2, Mail, Phone, Archive, MoreVertical, Edit3, Trash2 } from 'lucide-react';
import { useClientStore } from '../stores/clientStore';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import type { Client } from '../types';

const EMPTY_CLIENT: Partial<Client> = {
  name: '', company: '', contact_person: '', email: '', phone: '', notes: '',
};

export default function ClientsPage() {
  const { clients, loading, fetch: fetchClients, create, update, archive, remove } = useClientStore();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);
  const [form, setForm] = useState(EMPTY_CLIENT);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  useEffect(() => { fetchClients(); }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchClients(search || undefined), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_CLIENT);
    setModalOpen(true);
  };

  const openEdit = (client: Client) => {
    setEditing(client);
    setForm(client);
    setModalOpen(true);
    setMenuOpen(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await update(editing.id, form);
    } else {
      await create(form);
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display">Clients</h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1">{clients.length} total clients</p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={16} /> Add Client
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search clients..."
            className="w-full h-9 pl-9 pr-3 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
          />
        </div>
      </div>

      {/* Client Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading && clients.length === 0 ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="card p-5 h-40 animate-shimmer bg-gradient-to-r from-[var(--surface)] via-[var(--bg-subtle)] to-[var(--surface)] bg-[length:200%_100%]" />
          ))
        ) : clients.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <Building2 size={48} className="mx-auto text-[var(--text-muted)] mb-4" />
            <p className="text-lg font-medium text-[var(--text)]">No clients yet</p>
            <p className="text-sm text-[var(--text-muted)] mt-1">Add your first client to get started</p>
          </div>
        ) : (
          clients.filter(c => !c.archived).map((client, i) => (
            <div
              key={client.id}
              className="card p-5 animate-slide-up opacity-0 hover:border-[var(--accent)]/30 transition-all"
              style={{ animationDelay: `${i * 0.05}s`, animationFillMode: 'forwards' }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl accent-bg flex items-center justify-center">
                    <Building2 size={18} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--text)] text-sm">{client.name}</h3>
                    {client.company && <p className="text-xs text-[var(--text-muted)]">{client.company}</p>}
                  </div>
                </div>
                <div className="relative">
                  <button onClick={() => setMenuOpen(menuOpen === client.id ? null : client.id)} className="w-7 h-7 rounded-md flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--accent-muted)] transition-colors cursor-pointer">
                    <MoreVertical size={14} />
                  </button>
                  {menuOpen === client.id && (
                    <div className="absolute right-0 top-8 w-36 bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-lg py-1 z-10 animate-scale-in">
                      <button onClick={() => openEdit(client)} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--text)] hover:bg-[var(--accent-muted)] transition-colors cursor-pointer">
                        <Edit3 size={14} /> Edit
                      </button>
                      <button onClick={() => { archive(client.id); setMenuOpen(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--text)] hover:bg-[var(--accent-muted)] transition-colors cursor-pointer">
                        <Archive size={14} /> Archive
                      </button>
                      <button onClick={() => { remove(client.id); setMenuOpen(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer">
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                {client.contact_person && (
                  <p className="text-xs text-[var(--text-secondary)]">{client.contact_person}</p>
                )}
                {client.email && (
                  <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                    <Mail size={12} /> <span className="truncate">{client.email}</span>
                  </div>
                )}
                {client.phone && (
                  <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                    <Phone size={12} /> {client.phone}
                  </div>
                )}
              </div>

              {client.notes && (
                <p className="text-xs text-[var(--text-muted)] mt-3 pt-3 border-t border-[var(--border-subtle)] line-clamp-2">
                  {client.notes}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Client' : 'Add Client'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Client Name" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <Input label="Company" value={form.company || ''} onChange={e => setForm({ ...form, company: e.target.value })} />
          <Input label="Contact Person" value={form.contact_person || ''} onChange={e => setForm({ ...form, contact_person: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Email" type="email" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} />
            <Input label="Phone" value={form.phone || ''} onChange={e => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Notes</label>
            <textarea
              value={form.notes || ''}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              rows={3}
              className="w-full px-3.5 py-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] transition-all duration-200 focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-glow)] resize-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editing ? 'Update' : 'Create'} Client</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
