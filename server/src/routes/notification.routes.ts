import { Router, Response } from 'express';
import { NotificationService } from '../services/notification.service';
import { repositories } from '../db';
import { authMiddleware } from '../middleware/auth';
import type { AuthRequest } from '../types';

const router = Router();
const service = new NotificationService(repositories);
router.use(authMiddleware);

router.get('/', (req: AuthRequest, res: Response) => {
  const notifications = service.getByUser(req.userId!, req.query.unread === 'true');
  res.json({ success: true, data: notifications });
});

router.patch('/:id/read', (req: AuthRequest, res: Response) => {
  service.markRead(req.params.id);
  res.json({ success: true });
});

router.patch('/read-all', (req: AuthRequest, res: Response) => {
  service.markAllRead(req.userId!);
  res.json({ success: true });
});

export default router;
