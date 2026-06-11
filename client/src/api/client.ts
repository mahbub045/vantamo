const BASE = '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('vantamo_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options?.headers as Record<string, string> || {}),
  };

  const res = await fetch(`${BASE}${path}`, { ...options, headers });

  if (res.status === 401) {
    localStorage.removeItem('vantamo_token');
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || 'Request failed');
  return json.data;
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    request<{ user: any; token: string }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (name: string, email: string, password: string) =>
    request<{ user: any; token: string }>('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) }),
  getMe: () => request<any>('/auth/me'),

  // Clients
  getClients: (q?: string) => request<any[]>(`/clients${q ? `?q=${q}` : ''}`),
  getClient: (id: string) => request<any>(`/clients/${id}`),
  createClient: (data: any) => request<any>('/clients', { method: 'POST', body: JSON.stringify(data) }),
  updateClient: (id: string, data: any) => request<any>(`/clients/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  archiveClient: (id: string) => request<any>(`/clients/${id}/archive`, { method: 'POST' }),
  deleteClient: (id: string) => request<any>(`/clients/${id}`, { method: 'DELETE' }),

  // Projects
  getProjects: (filters?: Record<string, string>) => {
    const params = new URLSearchParams(filters).toString();
    return request<any[]>(`/projects${params ? `?${params}` : ''}`);
  },
  getProject: (id: string) => request<any>(`/projects/${id}`),
  getProjectTasks: (id: string) => request<any[]>(`/projects/${id}/tasks`),
  createProject: (data: any) => request<any>('/projects', { method: 'POST', body: JSON.stringify(data) }),
  updateProject: (id: string, data: any) => request<any>(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProject: (id: string) => request<any>(`/projects/${id}`, { method: 'DELETE' }),

  // Tasks
  getTasks: (filters?: Record<string, string>) => {
    const params = new URLSearchParams(filters).toString();
    return request<any[]>(`/tasks${params ? `?${params}` : ''}`);
  },
  getTask: (id: string) => request<any>(`/tasks/${id}`),
  createTask: (data: any) => request<any>('/tasks', { method: 'POST', body: JSON.stringify(data) }),
  updateTask: (id: string, data: any) => request<any>(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  moveTask: (id: string, status: string, position: number) =>
    request<any>(`/tasks/${id}/move`, { method: 'PATCH', body: JSON.stringify({ status, position }) }),
  deleteTask: (id: string) => request<any>(`/tasks/${id}`, { method: 'DELETE' }),

  // Users
  getUsers: () => request<any[]>('/users'),

  // Activity
  getActivity: (limit?: number) => request<any[]>(`/activity${limit ? `?limit=${limit}` : ''}`),

  // Analytics
  getDashboard: () => request<any>('/analytics/dashboard'),
  getWorkload: () => request<any[]>('/analytics/workload'),

  // Search
  search: (q: string) => request<any>('/search?q=' + encodeURIComponent(q)),

  // Comments
  getComments: (taskId?: string, projectId?: string) => {
    const params = new URLSearchParams();
    if (taskId) params.set('task_id', taskId);
    if (projectId) params.set('project_id', projectId);
    return request<any[]>(`/comments?${params}`);
  },
  createComment: (data: any) => request<any>('/comments', { method: 'POST', body: JSON.stringify(data) }),

  // Notifications
  getNotifications: () => request<any[]>('/notifications'),
  markNotificationRead: (id: string) => request<any>(`/notifications/${id}/read`, { method: 'PATCH' }),
  markAllRead: () => request<any>('/notifications/read-all', { method: 'PATCH' }),
};
