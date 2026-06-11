export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'member';
  avatar: string | null;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  name: string;
  company: string | null;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  notes: string | null;
  archived: number;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  client_id: string | null;
  status: 'planning' | 'active' | 'review' | 'completed' | 'on_hold';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string | null;
  start_date: string | null;
  due_date: string | null;
  progress: number;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  project_id: string | null;
  assignee_id: string | null;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'critical';
  due_date: string | null;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  content: string;
  user_id: string;
  task_id: string | null;
  project_id: string | null;
  created_at: string;
}

export interface Activity {
  id: string;
  type: string;
  user_id: string | null;
  entity_id: string | null;
  entity_type: string | null;
  description: string;
  metadata: string | null;
  created_at: string;
}

export interface DashboardData {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalTasks: number;
  activeTasks: number;
  completedTasks: number;
  overdueTasks: number;
  overdueTaskList: Task[];
  completionRate: number;
  taskStatuses: Record<string, number>;
  projectStatuses: Record<string, number>;
  workload: { assignee_id: string; count: number }[];
}

export type AccentColor = 'indigo' | 'violet' | 'purple' | 'cyan' | 'emerald' | 'orange';

export interface SearchResults {
  clients: Client[];
  projects: Project[];
  tasks: Task[];
}
