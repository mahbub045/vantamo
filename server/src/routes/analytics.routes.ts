import { Router, Response } from 'express';
import { AnalyticsService } from '../services/analytics.service';
import { repositories } from '../db';
import { authMiddleware } from '../middleware/auth';
import type { AuthRequest } from '../types';

const router = Router();
const service = new AnalyticsService(repositories);
router.use(authMiddleware);

router.get('/dashboard', (_req: AuthRequest, res: Response) => {
  const data = service.getDashboard();
  res.json({ success: true, data });
});

router.get('/workload', (_req: AuthRequest, res: Response) => {
  const data = service.getWorkload();
  res.json({ success: true, data });
});

export default router;
