import { Router, Response } from 'express';
import { CommentService } from '../services/comment.service';
import { repositories } from '../db';
import { authMiddleware } from '../middleware/auth';
import type { AuthRequest } from '../types';

const router = Router();
const service = new CommentService(repositories);
router.use(authMiddleware);

router.get('/', (req: AuthRequest, res: Response) => {
  try {
    const { task_id, project_id } = req.query;
    const comments = task_id
      ? service.getByTask(task_id as string)
      : project_id ? service.getByProject(project_id as string) : [];
    res.json({ success: true, data: comments });
  } catch (err: any) {
    res.status(400).json({ success: false, error: { message: err.message } });
  }
});

router.post('/', (req: AuthRequest, res: Response) => {
  try {
    const comment = service.create(req.body, req.userId!);
    res.status(201).json({ success: true, data: comment });
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
