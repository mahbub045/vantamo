import { v4 as uuid } from 'uuid';
import bcrypt from 'bcryptjs';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { config } from '../config';
import { initializeDatabase } from './schema';

const dbDir = path.dirname(config.database.path);
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

// Remove existing DB for fresh seed
if (fs.existsSync(config.database.path)) fs.unlinkSync(config.database.path);

const db = new Database(config.database.path);
initializeDatabase(db);

const users = [
  { id: uuid(), name: 'Alex Morgan', email: 'admin@vantamo.io', role: 'admin', avatar: null },
  { id: uuid(), name: 'Sarah Chen', email: 'sarah@vantamo.io', role: 'manager', avatar: null },
  { id: uuid(), name: 'James Wilson', email: 'james@vantamo.io', role: 'member', avatar: null },
  { id: uuid(), name: 'Maya Patel', email: 'maya@vantamo.io', role: 'member', avatar: null },
];

const clients = [
  { id: uuid(), name: 'Acme Corporation', company: 'Acme Corp', contact_person: 'John Smith', email: 'john@acme.com', phone: '+1 (555) 123-4567', notes: 'Enterprise client, annual contract' },
  { id: uuid(), name: 'TechFlow Inc', company: 'TechFlow', contact_person: 'Lisa Wang', email: 'lisa@techflow.io', phone: '+1 (555) 987-6543', notes: 'Startup, fast-paced' },
  { id: uuid(), name: 'Brandify Studio', company: 'Brandify', contact_person: 'Michael Brown', email: 'michael@brandify.co', phone: '+1 (555) 456-7890', notes: 'Creative agency partnership' },
  { id: uuid(), name: 'Nova Dynamics', company: 'Nova Dynamics', contact_person: 'Elena Garcia', email: 'elena@novadynamics.com', phone: '+1 (555) 321-6549', notes: 'New client, pending contract renewal' },
];

const projects = [
  { id: uuid(), name: 'Website Redesign', client_id: clients[0].id, status: 'active', priority: 'high', description: 'Complete overhaul of corporate website with modern design and improved UX', start_date: '2025-01-15', due_date: '2025-04-30', progress: 65 },
  { id: uuid(), name: 'Mobile App MVP', client_id: clients[1].id, status: 'active', priority: 'critical', description: 'Cross-platform mobile application for customer engagement', start_date: '2025-02-01', due_date: '2025-06-15', progress: 30 },
  { id: uuid(), name: 'Brand Identity Package', client_id: clients[2].id, status: 'planning', priority: 'medium', description: 'Full brand identity including logo, guidelines, and collateral', start_date: '2025-03-01', due_date: '2025-05-20', progress: 0 },
  { id: uuid(), name: 'Marketing Campaign Q2', client_id: clients[0].id, status: 'review', priority: 'high', description: 'Multi-channel marketing campaign for Q2 product launch', start_date: '2025-01-01', due_date: '2025-03-31', progress: 85 },
  { id: uuid(), name: 'Analytics Dashboard', client_id: clients[3].id, status: 'active', priority: 'medium', description: 'Custom analytics dashboard with real-time data visualization', start_date: '2025-03-01', due_date: '2025-07-01', progress: 15 },
];

const tasks = [
  { id: uuid(), title: 'Design homepage wireframes', description: 'Create low-fi wireframes for the new homepage layout', project_id: projects[0].id, assignee_id: users[1].id, status: 'done', priority: 'high', due_date: '2025-02-01', position: 0 },
  { id: uuid(), title: 'Implement responsive navigation', description: 'Build responsive nav with mobile hamburger menu', project_id: projects[0].id, assignee_id: users[2].id, status: 'in_progress', priority: 'high', due_date: '2025-02-15', position: 0 },
  { id: uuid(), title: 'Set up CMS integration', description: 'Integrate headless CMS for content management', project_id: projects[0].id, assignee_id: users[0].id, status: 'todo', priority: 'medium', due_date: '2025-03-01', position: 1 },
  { id: uuid(), title: 'Create component library', description: 'Build reusable React component library', project_id: projects[0].id, assignee_id: users[3].id, status: 'review', priority: 'medium', due_date: '2025-02-20', position: 1 },
  { id: uuid(), title: 'Design app wireframes', description: 'Create wireframes for all mobile app screens', project_id: projects[1].id, assignee_id: users[1].id, status: 'done', priority: 'high', due_date: '2025-02-20', position: 0 },
  { id: uuid(), title: 'Set up React Native project', description: 'Initialize React Native with TypeScript and navigation', project_id: projects[1].id, assignee_id: users[2].id, status: 'in_progress', priority: 'critical', due_date: '2025-02-28', position: 0 },
  { id: uuid(), title: 'Implement auth flow', description: 'Build authentication screens and token management', project_id: projects[1].id, assignee_id: users[0].id, status: 'todo', priority: 'high', due_date: '2025-03-15', position: 0 },
  { id: uuid(), title: 'Design logo concepts', description: 'Create 3-5 logo concept directions', project_id: projects[2].id, assignee_id: users[3].id, status: 'todo', priority: 'medium', due_date: '2025-03-10', position: 0 },
  { id: uuid(), title: 'Finalize campaign copy', description: 'Review and finalize all marketing copy', project_id: projects[3].id, assignee_id: users[1].id, status: 'review', priority: 'high', due_date: '2025-03-15', position: 0 },
  { id: uuid(), title: 'Set up ad campaigns', description: 'Configure Google and Meta ad campaigns', project_id: projects[3].id, assignee_id: users[0].id, status: 'done', priority: 'critical', due_date: '2025-03-01', position: 0 },
  { id: uuid(), title: 'Design dashboard mockups', description: 'Create visual designs for analytics dashboard', project_id: projects[4].id, assignee_id: users[1].id, status: 'in_progress', priority: 'medium', due_date: '2025-04-01', position: 0 },
  { id: uuid(), title: 'Build data pipeline', description: 'Set up ETL pipeline for real-time data', project_id: projects[4].id, assignee_id: users[2].id, status: 'todo', priority: 'high', due_date: '2025-04-15', position: 1 },
];

// Seed
const passwordHash = bcrypt.hashSync('password123', 12);

const insertUser = db.prepare('INSERT INTO users (id, name, email, password_hash, role, avatar) VALUES (?,?,?,?,?,?)');
const insertClient = db.prepare('INSERT INTO clients (id, name, company, contact_person, email, phone, notes) VALUES (?,?,?,?,?,?,?)');
const insertProject = db.prepare('INSERT INTO projects (id, name, client_id, status, priority, description, start_date, due_date, progress) VALUES (?,?,?,?,?,?,?,?,?)');
const insertTask = db.prepare('INSERT INTO tasks (id, title, description, project_id, assignee_id, status, priority, due_date, position) VALUES (?,?,?,?,?,?,?,?,?)');
const insertActivity = db.prepare('INSERT INTO activities (id, type, user_id, entity_id, entity_type, description, metadata) VALUES (?,?,?,?,?,?,?)');

const seedAll = db.transaction(() => {
  for (const u of users) insertUser.run(u.id, u.name, u.email, passwordHash, u.role, u.avatar);
  for (const c of clients) insertClient.run(c.id, c.name, c.company, c.contact_person, c.email, c.phone, c.notes);
  for (const p of projects) insertProject.run(p.id, p.name, p.client_id, p.status, p.priority, p.description, p.start_date, p.due_date, p.progress);
  for (const t of tasks) insertTask.run(t.id, t.title, t.description, t.project_id, t.assignee_id, t.status, t.priority, t.due_date, t.position);

  const activities = [
    { type: 'project_created', entity_id: projects[0].id, entity_type: 'project', description: 'Created project "Website Redesign"' },
    { type: 'task_created', entity_id: tasks[0].id, entity_type: 'task', description: 'Created task "Design homepage wireframes"' },
    { type: 'task_moved', entity_id: tasks[0].id, entity_type: 'task', description: 'Moved "Design homepage wireframes" to done' },
    { type: 'project_updated', entity_id: projects[3].id, entity_type: 'project', description: 'Updated project "Marketing Campaign Q2" status to review' },
    { type: 'task_created', entity_id: tasks[5].id, entity_type: 'task', description: 'Created task "Set up React Native project"' },
    { type: 'comment_added', entity_id: tasks[1].id, entity_type: 'task', description: 'Added a comment on "Implement responsive navigation"' },
    { type: 'task_moved', entity_id: tasks[4].id, entity_type: 'task', description: 'Moved "Design app wireframes" to done' },
    { type: 'client_created', entity_id: clients[3].id, entity_type: 'client', description: 'Created client "Nova Dynamics"' },
  ];
  for (let i = 0; i < activities.length; i++) {
    const a = activities[i];
    insertActivity.run(uuid(), a.type, users[0].id, a.entity_id, a.entity_type, a.description, null);
  }
});

seedAll();

console.log('✓ Database seeded successfully');
console.log(`  ${users.length} users`);
console.log(`  ${clients.length} clients`);
console.log(`  ${projects.length} projects`);
console.log(`  ${tasks.length} tasks`);
console.log(`\n  Login: admin@vantamo.io / password123`);

db.close();
