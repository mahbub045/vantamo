import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import KanbanCard from './KanbanCard';
import type { Task, User } from '../../types';

interface Props {
  id: string;
  title: string;
  tasks: Task[];
  users: User[];
}

const STATUS_COLORS: Record<string, string> = {
  todo: 'bg-slate-400',
  in_progress: 'bg-[var(--accent)]',
  review: 'bg-amber-400',
  done: 'bg-emerald-400',
};

export default function KanbanColumn({ id, title, tasks, users }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="flex flex-col min-w-[280px] w-[280px] flex-shrink-0">
      <div className="flex items-center gap-2.5 mb-3 px-1">
        <div className={`w-2.5 h-2.5 rounded-full ${STATUS_COLORS[id] || 'bg-gray-400'}`} />
        <h3 className="text-sm font-semibold text-[var(--text)]">{title}</h3>
        <span className="text-xs text-[var(--text-muted)] bg-[var(--bg-subtle)] px-1.5 py-0.5 rounded-md">{tasks.length}</span>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 rounded-xl p-2 min-h-[200px] transition-colors duration-200 ${
          isOver ? 'bg-[var(--accent-muted)] border-2 border-dashed border-[var(--accent)]/30' : 'bg-[var(--bg-subtle)]'
        }`}
      >
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <KanbanCard key={task.id} task={task} users={users} />
          ))}
        </SortableContext>
        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-20 text-xs text-[var(--text-muted)]">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
}
