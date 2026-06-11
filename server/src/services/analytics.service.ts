import type { Repositories } from '../db/repositories/interfaces';

export class AnalyticsService {
  constructor(private repos: Repositories) {}

  getDashboard() {
    const totalProjects = this.repos.projects.count();
    const projectStatuses = this.repos.projects.countByStatus();
    const taskStatuses = this.repos.tasks.countByStatus();
    const totalTasks = this.repos.tasks.count();
    const overdueTasks = this.repos.tasks.getOverdue();
    const workload = this.repos.tasks.countByAssignee();
    const activeTasks = (taskStatuses['todo'] || 0) + (taskStatuses['in_progress'] || 0) + (taskStatuses['review'] || 0);
    const completedTasks = taskStatuses['done'] || 0;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      totalProjects,
      activeProjects: (projectStatuses['active'] || 0) + (projectStatuses['review'] || 0),
      completedProjects: projectStatuses['completed'] || 0,
      totalTasks,
      activeTasks,
      completedTasks,
      overdueTasks: overdueTasks.length,
      overdueTaskList: overdueTasks.slice(0, 5),
      completionRate,
      taskStatuses,
      projectStatuses,
      workload
    };
  }

  getWorkload() {
    const workload = this.repos.tasks.countByAssignee();
    const users = workload.map(w => {
      const user = this.repos.users.findById(w.assignee_id);
      return { ...w, user: user ? { id: user.id, name: user.name, avatar: user.avatar, role: user.role } : null };
    });
    return users;
  }
}
