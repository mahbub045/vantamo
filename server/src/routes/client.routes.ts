import { Router, Response } from 'express';
import { ClientService } from '../services/client.service';
import { repositories } from '../db';
import { authMiddleware } from '../middleware/auth';
import type { AuthRequest } from '../types';

const router = Router();
const service = new ClientService(repositories);

router.use(authMiddleware);

router.get('/', (req: AuthRequest, res: Response) => {
  try {
    const archived = req.query.archived === 'true';
    const clients = req.query.q ? service.search(req.query.q as string) : service.getAll(archived);
    res.json({ success: true, data: clients });
  } catch (err: any) {
    res.status(400).json({ success: false, error: { message: err.message } });
  }
});

router.get('/:id', (req: AuthRequest, res: Response) => {
  try {
    const client = service.getById(req.params.id);
    res.json({ success: true, data: client });
  } catch (err: any) {
    res.status(404).json({ success: false, error: { message: err.message } });
  }
});

router.post('/', (req: AuthRequest, res: Response) => {
  try {
    const client = service.create(req.body, req.userId!);
    res.status(201).json({ success: true, data: client });
  } catch (err: any) {
    res.status(400).json({ success: false, error: { message: err.message } });
  }
});

router.put('/:id', (req: AuthRequest, res: Response) => {
  try {
    const client = service.update(req.params.id, req.body, req.userId!);
    res.json({ success: true, data: client });
  } catch (err: any) {
    res.status(400).json({ success: false, error: { message: err.message } });
  }
});

router.post('/:id/archive', (req: AuthRequest, res: Response) => {
  try {
    const client = service.archive(req.params.id, req.userId!);
    res.json({ success: true, data: client });
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
