import Database from 'better-sqlite3';
import { v4 as uuid } from 'uuid';
import type { User, IUserRepository } from '../../interfaces'; // adjusted path below
import type { User as UserType } from '../../../types';

export class SqliteUserRepo implements IUserRepository {
  constructor(private db: Database.Database) {}

  findById(id: string): UserType | null {
    return this.db.prepare('SELECT * FROM users WHERE id = ?').get(id) as UserType | null;
  }

  findByEmail(email: string): UserType | null {
    return this.db.prepare('SELECT * FROM users WHERE email = ?').get(email) as UserType | null;
  }

  findAll(): UserType[] {
    return this.db.prepare('SELECT id, name, email, role, avatar, created_at, updated_at FROM users ORDER BY name').all() as UserType[];
  }

  create(user: Omit<UserType, 'created_at' | 'updated_at'>): UserType {
    const id = user.id || uuid();
    this.db.prepare(
      'INSERT INTO users (id, name, email, password_hash, role, avatar) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(id, user.name, user.email, user.password_hash || '', user.role, user.avatar);
    return this.findById(id)!;
  }

  update(id: string, data: Partial<UserType>): UserType | null {
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
    this.db.prepare(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    return this.findById(id);
  }

  delete(id: string): boolean {
    const result = this.db.prepare('DELETE FROM users WHERE id = ?').run(id);
    return result.changes > 0;
  }
}
