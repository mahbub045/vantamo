import path from 'path';
import fs from 'fs';
import { config } from '../config';
import { createDatabase, DatabaseWrapper } from './sqlite-wrapper';
import { initializeDatabase } from './schema';
import { SqliteClientRepo } from './repositories/sqlite/client.repo';
import { SqliteProjectRepo } from './repositories/sqlite/project.repo';
import { SqliteTaskRepo } from './repositories/sqlite/task.repo';
import { SqliteUserRepo } from './repositories/sqlite/user.repo';
import { SqliteCommentRepo } from './repositories/sqlite/comment.repo';
import { SqliteActivityRepo } from './repositories/sqlite/activity.repo';
import { SqliteNotificationRepo } from './repositories/sqlite/notification.repo';
import type { Repositories } from './repositories/interfaces';

export let repositories: Repositories = {} as Repositories;
export let db: DatabaseWrapper;

export async function initDatabase(): Promise<Repositories> {
  const dbDir = path.dirname(config.database.path);
  if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

  db = await createDatabase(config.database.path);
  initializeDatabase(db);

  repositories = {
    users: new SqliteUserRepo(db),
    clients: new SqliteClientRepo(db),
    projects: new SqliteProjectRepo(db),
    tasks: new SqliteTaskRepo(db),
    comments: new SqliteCommentRepo(db),
    activities: new SqliteActivityRepo(db),
    notifications: new SqliteNotificationRepo(db),
  };

  return repositories;
}
