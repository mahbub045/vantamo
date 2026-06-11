import Database from 'better-sqlite3';
import { v4 as uuid } from 'uuid';
import type { Activity } from '../../../types';

export class SqliteActivityRepo {
  constructor(private db: Database.Database) {}

  findAll(limit = 50): Activity[] {
    return this.db.prepare('SELECT * FROM activities ORDER BY created_at DESC LIMIT ?').all(limit) as Activity[];
  }

  create(activity: Omit<Activity, 'created_at'>): Activity {
    const id = activity.id || uuid();
    this.db.prepare('INSERT INTO activities (id, type, user_id, entity_id, entity_type, description, metadata) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(id, activity.type, activity.user_id, activity.entity_id, activity.entity_type, activity.description, activity.metadata);
    return this.db.prepare('SELECT * FROM activities WHERE id = ?').get(id) as Activity;
  }

  delete(id: string): boolean {
    const result = this.db.prepare('DELETE FROM activities WHERE id = ?').run(id);
    return result.changes > 0;
  }
}
