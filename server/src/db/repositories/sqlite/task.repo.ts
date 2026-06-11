import { v4 as uuid } from 'uuid';
import type { Task } from '../../../types';
import type { DatabaseWrapper } from '../../sqlite-wrapper';

export class SqliteTaskRepo {
  constructor(private db: DatabaseWrapper) {}

  findById(id: string): Task | null {
    return this.db
      .prepare('SELECT * FROM tasks WHERE id = ?')
      .get(id) as Task | null;
  }

  findAll(filters?: {
    project_id?: string;
    assignee_id?: string;
    status?: string;
  }): Task[] {
    let sql = 'SELECT * FROM tasks WHERE 1=1';
    const params: unknown[] = [];
    if (filters?.project_id) {
      sql += ' AND project_id = ?';
      params.push(filters.project_id);
    }
    if (filters?.assignee_id) {
      sql += ' AND assignee_id = ?';
      params.push(filters.assignee_id);
    }
    if (filters?.status) {
      sql += ' AND status = ?';
      params.push(filters.status);
    }
    sql += ' ORDER BY position ASC, created_at DESC';
    return this.db.prepare(sql).all(...params) as Task[];
  }

  search(query: string): Task[] {
    const q = `%${query}%`;
    return this.db
      .prepare(
        'SELECT * FROM tasks WHERE title LIKE ? OR description LIKE ? ORDER BY created_at DESC',
      )
      .all(q, q) as Task[];
  }

  create(task: Omit<Task, 'created_at' | 'updated_at'>): Task {
    const id = task.id || uuid();
    const maxPos = this.db
      .prepare(
        'SELECT COALESCE(MAX(position),0)+1 as p FROM tasks WHERE status = ? AND project_id = ?',
      )
      .get(task.status, task.project_id) as { p: number };
    this.db
      .prepare(
        'INSERT INTO tasks (id, title, description, project_id, assignee_id, status, priority, due_date, position) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      )
      .run(
        id,
        task.title,
        task.description,
        task.project_id,
        task.assignee_id,
        task.status,
        task.priority,
        task.due_date,
        task.position ?? maxPos.p,
      );
    return this.findById(id)!;
  }

  update(id: string, data: Partial<Task>): Task | null {
    const fields: string[] = [];
    const values: unknown[] = [];
    for (const [key, val] of Object.entries(data)) {
      if (key !== 'id' && key !== 'created_at') {
        fields.push(`${key} = ?`);
        values.push(val);
      }
    }
    if (fields.length === 0) return this.findById(id);
    fields.push("updated_at = datetime('now')");
    values.push(id);
    this.db
      .prepare(`UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`)
      .run(...values);
    return this.findById(id);
  }

  updatePosition(id: string, status: string, position: number): Task | null {
    this.db
      .prepare(
        "UPDATE tasks SET status = ?, position = ?, updated_at = datetime('now') WHERE id = ?",
      )
      .run(status, position, id);
    return this.findById(id);
  }

  delete(id: string): boolean {
    const result = this.db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
    return result.changes > 0;
  }

  count(): number {
    return (
      this.db.prepare('SELECT COUNT(*) as c FROM tasks').get() as { c: number }
    ).c;
  }

  countByStatus(): Record<string, number> {
    const rows = this.db
      .prepare('SELECT status, COUNT(*) as count FROM tasks GROUP BY status')
      .all() as { status: string; count: number }[];
    return Object.fromEntries(rows.map((r) => [r.status, r.count]));
  }

  countByAssignee(): { assignee_id: string; count: number }[] {
    return this.db
      .prepare(
        "SELECT assignee_id, COUNT(*) as count FROM tasks WHERE assignee_id IS NOT NULL AND status != 'done' GROUP BY assignee_id",
      )
      .all() as { assignee_id: string; count: number }[];
  }

  getOverdue(): Task[] {
    return this.db
      .prepare(
        "SELECT * FROM tasks WHERE due_date < date('now') AND status != 'done' ORDER BY due_date ASC",
      )
      .all() as Task[];
  }
}
