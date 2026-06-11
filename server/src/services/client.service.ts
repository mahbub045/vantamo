import type { Repositories } from '../db/repositories/interfaces';

export class ClientService {
  constructor(private repos: Repositories) {}

  getAll(archived = false) {
    return this.repos.clients.findAll(archived);
  }

  getById(id: string) {
    const client = this.repos.clients.findById(id);
    if (!client) throw new Error('Client not found');
    return client;
  }

  search(query: string) {
    return this.repos.clients.search(query);
  }

  create(data: Parameters<Repositories['clients']['create']>[0], userId: string) {
    const client = this.repos.clients.create(data);
    this.repos.activities.create({
      id: '', type: 'client_created', user_id: userId,
      entity_id: client.id, entity_type: 'client',
      description: `Created client "${client.name}"`,
      metadata: null
    });
    return client;
  }

  update(id: string, data: Parameters<Repositories['clients']['update']>[1], userId: string) {
    const client = this.repos.clients.update(id, data);
    if (!client) throw new Error('Client not found');
    this.repos.activities.create({
      id: '', type: 'client_updated', user_id: userId,
      entity_id: client.id, entity_type: 'client',
      description: `Updated client "${client.name}"`,
      metadata: null
    });
    return client;
  }

  archive(id: string, userId: string) {
    return this.update(id, { archived: 1 }, userId);
  }

  delete(id: string) {
    return this.repos.clients.delete(id);
  }
}
