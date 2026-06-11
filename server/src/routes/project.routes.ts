import { Router, Response } from 'express';
import { ProjectService } from '../services/project.service';
import { TaskService } from '../services/task.service';
import { repositories } from '../db';
import { authMiddleware } from '../middleware/auth';
import type { AuthRequest } from '../types';

const router = Router();
const projectService = new ProjectService(repositories);
const taskService = new TaskService(repositories);

router.use(authMiddleware);

router.get('/', (req: AuthRequest, res: Response) => {
  try {
    const filters: any = {};
    if (req.query.status) filters.status = req.query.status;
    if (req.query.client_id) filters.client_id = req.query.client_id;
    const projects = req.query.q ? projectService.search(req.query.q as string) : projectService.getAll(filters);
    res.json({ success: true, data: projects });
  } catch (err: any) {
    res.status(400).json({ success: false, error: { message: err.message } });
  }
});

router.get('/:id', (req: AuthRequest, res: Response) => {
  try {
    const project = projectService.getById(req.params.id);
    res.json({ success: true, data: project });
  } catch (err: any) {
    res.status(404).json({ success: false, error: { message: err.message } });
  }
});

router.get('/:id/tasks', (req: AuthRequest, res: Response) => {
  try {
    const tasks = taskService.getAll({ project_id: req.params.id });
    res.json({ success: true, data: tasks });
  } catch (err: any) {
    res.status(400).json({ success: false, error: { message: err.message } });
  }
});

router.post('/', (req: AuthRequest, res: Response) => {
  try {
    const project = projectService.create(req.body, req.userId!);
    res.status(201).json({ success: true, data: project });
  } catch (err: any) {
    res.status(400).json({ success: false, error: { message: err.message } });
  }
});

router.put('/:id', (req: AuthRequest, res: Response) => {
  try {
    const project = projectService.update(req.params.id, req.body, req.userId!);
    res.json({ success: true, data: project });
  } catch (err: any) {
    res.status(400).json({ success: false, error: { message: err.message } });
  }
});

router.delete('/:id', (req: AuthRequest, res: Response) => {
  try {
    projectService.delete(req.params.id);
    res.json({ success: true, data: null });
  } catch (err: any) {
    res.status(400).json({ success: false, error: { message: err.message } });
  }
});

export default router;
