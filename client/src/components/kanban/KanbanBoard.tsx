import { useState, useCallback } from 'react';
import {
  DndContext, closestCorners, KeyboardSensor, PointerSensor,
  useSensor, useSensors, DragEndEvent, DragOverEvent, DragStartEvent, DragOverlay
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import KanbanColumn from './KanbanColumn';
import KanbanCard from './KanbanCard';
import type { Task, User } from '../../types';

const COLUMNS = [
  { id: 'todo', title: 'To Do' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Done' },
];

interface Props {
  tasks: Task[];
  users: User[];
  onMoveTask: (taskId: string, newStatus: string, position: number) => Promise<void>;
}

export default function KanbanBoard({ tasks, users, onMoveTask }: Props) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const getColumnTasks = useCallback(
    (status: string) => tasks.filter(t => t.status === status).sort((a, b) => a.position - b.position),
    [tasks]
  );

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find(t => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragOver = (_event: DragOverEvent) => { /* handled on drag end */ };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Determine target status
    let targetStatus: string | null = null;
    const overColumn = COLUMNS.find(c => c.id === overId);
    if (overColumn) {
      targetStatus = overColumn.id;
    } else {
      const overTask = tasks.find(t => t.id === overId);
      if (overTask) targetStatus = overTask.status;
    }

    if (!targetStatus) return;

    const activeTask = tasks.find(t => t.id === activeId);
    if (!activeTask) return;

    if (activeTask.status === targetStatus) {
      // Same column reorder
      const colTasks = getColumnTasks(targetStatus);
      const overIdx = colTasks.findIndex(t => t.id === overId);
      const newIdx = overIdx >= 0 ? overIdx : colTasks.length;
      await onMoveTask(activeId, targetStatus, newIdx);
    } else {
      // Cross-column move
      const targetTasks = getColumnTasks(targetStatus);
      const overIdx = targetTasks.findIndex(t => t.id === overId);
      const newIdx = overIdx >= 0 ? overIdx : targetTasks.length;
      await onMoveTask(activeId, targetStatus, newIdx);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map(col => (
          <KanbanColumn
            key={col.id}
            id={col.id}
            title={col.title}
            tasks={getColumnTasks(col.id)}
            users={users}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask && (
          <div className="w-[280px]">
            <KanbanCard task={activeTask} users={users} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
