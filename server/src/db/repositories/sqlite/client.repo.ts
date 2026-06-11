import { v4 as uuid } from 'uuid';
import type { Client } from '../../../types';
import type { DatabaseWrapper } from '../../sqlite-wrapper';

export class SqliteClientRepo {
  constructor(private db: DatabaseWrapper) {}

  findById(id: string): Client | null {
    return this.db
      .prepare('SELECT * FROM clients WHERE id = ?')
      .get(id) as Client | null;
  }

  findAll(archived = false): Client[] {
    return this.db
      .prepare('SELECT * FROM clients WHERE archived = ? ORDER BY name')
      .all(archived ? 1 : 0) as Client[];
  }

  search(query: string): Client[] {
    const q = `%${query}%`;
    return this.db
      .prepare(
        'SELECT * FROM clients WHERE archived = 0 AND (name LIKE ? OR company LIKE ? OR email LIKE ?) ORDER BY name',
      )
      .all(q, q, q) as Client[];
  }

  create(
    client: Omit<Client, 'created_at' | 'updated_at' | 'archived'>,
  ): Client {
    const id = client.id || uuid();
    this.db
      .prepare(
        'INSERT INTO clients (id, name, company, contact_person, email, phone, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
      )
      .run(
        id,
        client.name,
        client.company,
        client.contact_person,
        client.email,
        client.phone,
        client.notes,
      );
    return this.findById(id)!;
  }

  update(id: string, data: Partial<Client>): Client | null {
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
      .prepare(`UPDATE clients SET ${fields.join(', ')} WHERE id = ?`)
      .run(...values);
    return this.findById(id);
  }

  delete(id: string): boolean {
    const result = this.db.prepare('DELETE FROM clients WHERE id = ?').run(id);
    return result.changes > 0;
  }
}
