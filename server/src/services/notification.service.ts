import type { Repositories } from '../db/repositories/interfaces';

export class NotificationService {
  constructor(private repos: Repositories) {}

  getByUser(userId: string, unreadOnly = false) {
    return this.repos.notifications.findByUser(userId, unreadOnly);
  }

  markRead(id: string) {
    return this.repos.notifications.markRead(id);
  }

  markAllRead(userId: string) {
    return this.repos.notifications.markAllRead(userId);
  }
}
