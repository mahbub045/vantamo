import { v4 as uuid } from 'uuid';
import type { Project } from '../../../types';
import type { DatabaseWrapper } from '../../sqlite-wrapper';

export class SqliteProjectRepo {
  constructor(private db: DatabaseWrapper) {}

  findById(id: string): Project | null {
    return this.db
      .prepare('SELECT * FROM projects WHERE id = ?')
      .get(id) as Project | null;
  }

  findAll(filters?: { status?: string; client_id?: string }): Project[] {
    let sql = 'SELECT * FROM projects WHERE 1=1';
    const params: unknown[] = [];
    if (filters?.status) {
      sql += ' AND status = ?';
      params.push(filters.status);
    }
    if (filters?.client_id) {
      sql += ' AND client_id = ?';
      params.push(filters.client_id);
    }
    sql += ' ORDER BY created_at DESC';
    return this.db.prepare(sql).all(...params) as Project[];
  }

  search(query: string): Project[] {
    const q = `%${query}%`;
    return this.db
      .prepare(
        'SELECT * FROM projects WHERE name LIKE ? OR description LIKE ? ORDER BY name',
      )
      .all(q, q) as Project[];
  }

  create(
    project: Omit<Project, 'created_at' | 'updated_at' | 'progress'>,
  ): Project {
    const id = project.id || uuid();
    this.db
      .prepare(
        'INSERT INTO projects (id, name, client_id, status, priority, description, start_date, due_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      )
      .run(
        id,
        project.name,
        project.client_id,
        project.status,
        project.priority,
        project.description,
        project.start_date,
        project.due_date,
      );
    return this.findById(id)!;
  }

  update(id: string, data: Partial<Project>): Project | null {
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
      .prepare(`UPDATE projects SET ${fields.join(', ')} WHERE id = ?`)
      .run(...values);
    return this.findById(id);
  }

  delete(id: string): boolean {
    const result = this.db.prepare('DELETE FROM projects WHERE id = ?').run(id);
    return result.changes > 0;
  }

  count(): number {
    return (
      this.db.prepare('SELECT COUNT(*) as c FROM projects').get() as {
        c: number;
      }
    ).c;
  }

  countByStatus(): Record<string, number> {
    const rows = this.db
      .prepare('SELECT status, COUNT(*) as count FROM projects GROUP BY status')
      .all() as { status: string; count: number }[];
    return Object.fromEntries(rows.map((r) => [r.status, r.count]));
  }
}
