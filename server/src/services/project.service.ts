import type { Repositories } from '../db/repositories/interfaces';

export class ProjectService {
  constructor(private repos: Repositories) {}

  getAll(filters?: { status?: string; client_id?: string }) {
    return this.repos.projects.findAll(filters);
  }

  getById(id: string) {
    const project = this.repos.projects.findById(id);
    if (!project) throw new Error('Project not found');
    return project;
  }

  search(query: string) {
    return this.repos.projects.search(query);
  }

  create(data: Parameters<Repositories['projects']['create']>[0], userId: string) {
    const project = this.repos.projects.create(data);
    this.repos.activities.create({
      id: '', type: 'project_created', user_id: userId,
      entity_id: project.id, entity_type: 'project',
      description: `Created project "${project.name}"`,
      metadata: null
    });
    return project;
  }

  update(id: string, data: Parameters<Repositories['projects']['update']>[1], userId: string) {
    const project = this.repos.projects.update(id, data);
    if (!project) throw new Error('Project not found');
    this.repos.activities.create({
      id: '', type: 'project_updated', user_id: userId,
      entity_id: project.id, entity_type: 'project',
      description: `Updated project "${project.name}"`,
      metadata: JSON.stringify(data)
    });
    return project;
  }

  delete(id: string) {
    return this.repos.projects.delete(id);
  }

  count() {
    return this.repos.projects.count();
  }

  countByStatus() {
    return this.repos.projects.countByStatus();
  }
}
