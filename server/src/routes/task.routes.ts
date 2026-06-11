import { Router, Response } from 'express';
import { TaskService } from '../services/task.service';
import { repositories } from '../db';
import { authMiddleware } from '../middleware/auth';
import type { AuthRequest } from '../types';

const router = Router();
const service = new TaskService(repositories);

router.use(authMiddleware);

router.get('/', (req: AuthRequest, res: Response) => {
  try {
    const filters: any = {};
    if (req.query.project_id) filters.project_id = req.query.project_id;
    if (req.query.assignee_id) filters.assignee_id = req.query.assignee_id;
    if (req.query.status) filters.status = req.query.status;
    const tasks = req.query.q ? service.search(req.query.q as string) : service.getAll(filters);
    res.json({ success: true, data: tasks });
  } catch (err: any) {
    res.status(400).json({ success: false, error: { message: err.message } });
  }
});

router.get('/overdue', (req: AuthRequest, res: Response) => {
  try {
    const tasks = service.getOverdue();
    res.json({ success: true, data: tasks });
  } catch (err: any) {
    res.status(400).json({ success: false, error: { message: err.message } });
  }
});

router.get('/:id', (req: AuthRequest, res: Response) => {
  try {
    const task = service.getById(req.params.id);
    res.json({ success: true, data: task });
  } catch (err: any) {
    res.status(404).json({ success: false, error: { message: err.message } });
  }
});

router.post('/', (req: AuthRequest, res: Response) => {
  try {
    const task = service.create(req.body, req.userId!);
    res.status(201).json({ success: true, data: task });
  } catch (err: any) {
    res.status(400).json({ success: false, error: { message: err.message } });
  }
});

router.put('/:id', (req: AuthRequest, res: Response) => {
  try {
    const task = service.update(req.params.id, req.body, req.userId!);
    res.json({ success: true, data: task });
  } catch (err: any) {
    res.status(400).json({ success: false, error: { message: err.message } });
  }
});

router.patch('/:id/move', (req: AuthRequest, res: Response) => {
  try {
    const { status, position } = req.body;
    const task = service.move(req.params.id, status, position, req.userId!);
    res.json({ success: true, data: task });
  } catch (err: any) {
    res.status(400).json({ success: false, error: { message: err.message } });
  }
});

router.delete('/:id', (req: AuthRequest, res: Response) => {
  try {
    service.delete(req.params.id);
    res.json({ success: true, data: null });
  } catch (err: any) {
    res.status(400).json({ success: false, error: { message: err.message } });
  }
});

export default router;
