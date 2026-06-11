import type { Repositories } from '../db/repositories/interfaces';

export class ActivityService {
  constructor(private repos: Repositories) {}

  getAll(limit = 50) {
    return this.repos.activities.findAll(limit);
  }
}
