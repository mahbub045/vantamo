import { v4 as uuid } from 'uuid';
import type { Comment } from '../../../types';
import type { DatabaseWrapper } from '../../sqlite-wrapper';

export class SqliteCommentRepo {
  constructor(private db: DatabaseWrapper) {}

  findById(id: string): Comment | null {
    return this.db
      .prepare('SELECT * FROM comments WHERE id = ?')
      .get(id) as Comment | null;
  }

  findByTask(taskId: string): Comment[] {
    return this.db
      .prepare(
        'SELECT * FROM comments WHERE task_id = ? ORDER BY created_at ASC',
      )
      .all(taskId) as Comment[];
  }

  findByProject(projectId: string): Comment[] {
    return this.db
      .prepare(
        'SELECT * FROM comments WHERE project_id = ? ORDER BY created_at ASC',
      )
      .all(projectId) as Comment[];
  }

  create(comment: Omit<Comment, 'created_at'>): Comment {
    const id = comment.id || uuid();
    this.db
      .prepare(
        'INSERT INTO comments (id, content, user_id, task_id, project_id) VALUES (?, ?, ?, ?, ?)',
      )
      .run(
        id,
        comment.content,
        comment.user_id,
        comment.task_id,
        comment.project_id,
      );
    return this.findById(id)!;
  }

  delete(id: string): boolean {
    const result = this.db.prepare('DELETE FROM comments WHERE id = ?').run(id);
    return result.changes > 0;
  }
}
