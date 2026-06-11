import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, GripVertical } from 'lucide-react';
import Badge from '../ui/Badge';
import Avatar from '../ui/Avatar';
import type { Task, User } from '../../types';

interface Props {
  task: Task;
  users: User[];
  onClick?: () => void;
}

export default function KanbanCard({ task, users, onClick }: Props) {
  const {
    attributes, listeners, setNodeRef, transform, transition, isDragging,
  } = useSortable({ id: task.id, data: { type: 'task', task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 0,
  };

  const assignee = users.find(u => u.id === task.assignee_id);

  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done';

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`card p-3.5 mb-2 group hover:border-[var(--accent)]/40 transition-all ${isDragging ? 'shadow-lg rotate-1' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-[var(--text)] leading-snug flex-1">{task.title}</p>
        <button {...attributes} {...listeners} className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing text-[var(--text-muted)] hover:text-[var(--text)] flex-shrink-0">
          <GripVertical size={14} />
        </button>
      </div>

      {task.description && (
        <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2">
          <Badge variant={task.priority} />
          {task.due_date && (
            <span className={`flex items-center gap-1 text-[10px] ${isOverdue ? 'text-red-400' : 'text-[var(--text-muted)]'}`}>
              <Calendar size={10} />
              {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>
        {assignee && <Avatar name={assignee.name} size="sm" />}
      </div>
    </div>
  );
}
