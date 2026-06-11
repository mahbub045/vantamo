import Database from 'better-sqlite3';
import { v4 as uuid } from 'uuid';
import type { Notification } from '../../../types';

export class SqliteNotificationRepo {
  constructor(private db: Database.Database) {}

  findByUser(userId: string, unreadOnly = false): Notification[] {
    let sql = 'SELECT * FROM notifications WHERE user_id = ?';
    if (unreadOnly) sql += ' AND read = 0';
    sql += ' ORDER BY created_at DESC LIMIT 50';
    return this.db.prepare(sql).all(userId) as Notification[];
  }

  create(notification: Omit<Notification, 'created_at' | 'read'>): Notification {
    const id = notification.id || uuid();
    this.db.prepare('INSERT INTO notifications (id, user_id, type, title, message, entity_id, entity_type) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(id, notification.user_id, notification.type, notification.title, notification.message, notification.entity_id, notification.entity_type);
    return this.db.prepare('SELECT * FROM notifications WHERE id = ?').get(id) as Notification;
  }

  markRead(id: string): boolean {
    const result = this.db.prepare('UPDATE notifications SET read = 1 WHERE id = ?').run(id);
    return result.changes > 0;
  }

  markAllRead(userId: string): boolean {
    const result = this.db.prepare('UPDATE notifications SET read = 1 WHERE user_id = ? AND read = 0').run(userId);
    return result.changes > 0;
  }
}
