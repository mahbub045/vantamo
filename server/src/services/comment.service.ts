import type { Repositories } from '../db/repositories/interfaces';

export class CommentService {
  constructor(private repos: Repositories) {}

  getByTask(taskId: string) {
    return this.repos.comments.findByTask(taskId);
  }

  getByProject(projectId: string) {
    return this.repos.comments.findByProject(projectId);
  }

  create(data: Parameters<Repositories['comments']['create']>[0], userId: string) {
    const comment = this.repos.comments.create({ ...data, user_id: userId });
    this.repos.activities.create({
      id: '', type: 'comment_added', user_id: userId,
      entity_id: data.task_id || data.project_id || '',
      entity_type: data.task_id ? 'task' : 'project',
      description: `Added a comment`,
      metadata: null
    });
    return comment;
  }

  delete(id: string) {
    return this.repos.comments.delete(id);
  }
}
