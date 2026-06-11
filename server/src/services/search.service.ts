import type { Repositories } from '../db/repositories/interfaces';

export class SearchService {
  constructor(private repos: Repositories) {}

  global(query: string) {
    if (!query || query.length < 2) return { clients: [], projects: [], tasks: [] };
    return {
      clients: this.repos.clients.search(query).slice(0, 5),
      projects: this.repos.projects.search(query).slice(0, 5),
      tasks: this.repos.tasks.search(query).slice(0, 5),
    };
  }
}
