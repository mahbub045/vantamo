import type { Repositories } from '../db/repositories/interfaces';

export class TaskService {
  constructor(private repos: Repositories) {}

  getAll(filters?: { project_id?: string; assignee_id?: string; status?: string }) {
    return this.repos.tasks.findAll(filters);
  }

  getById(id: string) {
    const task = this.repos.tasks.findById(id);
    if (!task) throw new Error('Task not found');
    return task;
  }

  search(query: string) {
    return this.repos.tasks.search(query);
  }

  create(data: Parameters<Repositories['tasks']['create']>[0], userId: string) {
    const task = this.repos.tasks.create(data);
    this.repos.activities.create({
      id: '', type: 'task_created', user_id: userId,
      entity_id: task.id, entity_type: 'task',
      description: `Created task "${task.title}"`,
      metadata: null
    });
    return task;
  }

  update(id: string, data: Parameters<Repositories['tasks']['update']>[1], userId: string) {
    const task = this.repos.tasks.update(id, data);
    if (!task) throw new Error('Task not found');
    this.repos.activities.create({
      id: '', type: 'task_updated', user_id: userId,
      entity_id: task.id, entity_type: 'task',
      description: `Updated task "${task.title}"`,
      metadata: JSON.stringify(data)
    });
    return task;
  }

  move(id: string, status: string, position: number, userId: string) {
    const task = this.repos.tasks.updatePosition(id, status, position);
    if (!task) throw new Error('Task not found');
    this.repos.activities.create({
      id: '', type: 'task_moved', user_id: userId,
      entity_id: task.id, entity_type: 'task',
      description: `Moved "${task.title}" to ${status}`,
      metadata: JSON.stringify({ status, position })
    });
    return task;
  }

  delete(id: string) {
    return this.repos.tasks.delete(id);
  }

  count() {
    return this.repos.tasks.count();
  }

  countByStatus() {
    return this.repos.tasks.countByStatus();
  }

  countByAssignee() {
    return this.repos.tasks.countByAssignee();
  }

  getOverdue() {
    return this.repos.tasks.getOverdue();
  }
}
