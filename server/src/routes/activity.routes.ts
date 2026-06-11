import { Router, Response } from 'express';
import { ActivityService } from '../services/activity.service';
import { repositories } from '../db';
import { authMiddleware } from '../middleware/auth';
import type { AuthRequest } from '../types';

const router = Router();
const service = new ActivityService(repositories);
router.use(authMiddleware);

router.get('/', (req: AuthRequest, res: Response) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
  const activities = service.getAll(limit);
  res.json({ success: true, data: activities });
});

export default router;
