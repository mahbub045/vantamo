import type { User, Client, Project, Task, Comment, Activity, Notification } from '../../types';

export interface IUserRepository {
  findById(id: string): User | null;
  findByEmail(email: string): User | null;
  findAll(): User[];
  create(user: Omit<User, 'created_at' | 'updated_at'>): User;
  update(id: string, data: Partial<User>): User | null;
  delete(id: string): boolean;
}

export interface IClientRepository {
  findById(id: string): Client | null;
  findAll(archived?: boolean): Client[];
  search(query: string): Client[];
  create(client: Omit<Client, 'created_at' | 'updated_at' | 'archived'>): Client;
  update(id: string, data: Partial<Client>): Client | null;
  delete(id: string): boolean;
}

export interface IProjectRepository {
  findById(id: string): Project | null;
  findAll(filters?: { status?: string; client_id?: string }): Project[];
  search(query: string): Project[];
  create(project: Omit<Project, 'created_at' | 'updated_at' | 'progress'>): Project;
  update(id: string, data: Partial<Project>): Project | null;
  delete(id: string): boolean;
  count(): number;
  countByStatus(): Record<string, number>;
}

export interface ITaskRepository {
  findById(id: string): Task | null;
  findAll(filters?: { project_id?: string; assignee_id?: string; status?: string }): Task[];
  search(query: string): Task[];
  create(task: Omit<Task, 'created_at' | 'updated_at'>): Task;
  update(id: string, data: Partial<Task>): Task | null;
  updatePosition(id: string, status: string, position: number): Task | null;
  delete(id: string): boolean;
  count(): number;
  countByStatus(): Record<string, number>;
  countByAssignee(): { assignee_id: string; count: number }[];
  getOverdue(): Task[];
}

export interface ICommentRepository {
  findById(id: string): Comment | null;
  findByTask(taskId: string): Comment[];
  findByProject(projectId: string): Comment[];
  create(comment: Omit<Comment, 'created_at'>): Comment;
  delete(id: string): boolean;
}

export interface IActivityRepository {
  findAll(limit?: number): Activity[];
  create(activity: Omit<Activity, 'created_at'>): Activity;
  delete(id: string): boolean;
}

export interface INotificationRepository {
  findByUser(userId: string, unreadOnly?: boolean): Notification[];
  create(notification: Omit<Notification, 'created_at' | 'read'>): Notification;
  markRead(id: string): boolean;
  markAllRead(userId: string): boolean;
}

export interface Repositories {
  users: IUserRepository;
  clients: IClientRepository;
  projects: IProjectRepository;
  tasks: ITaskRepository;
  comments: ICommentRepository;
  activities: IActivityRepository;
  notifications: INotificationRepository;
}
