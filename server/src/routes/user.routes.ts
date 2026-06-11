import { Router, Response } from 'express';
import { repositories } from '../db';
import { authMiddleware, requireRole } from '../middleware/auth';
import type { AuthRequest } from '../types';

const router = Router();
router.use(authMiddleware);

router.get('/', (_req: AuthRequest, res: Response) => {
  const users = repositories.users.findAll();
  res.json({ success: true, data: users });
});

router.get('/:id', (req: AuthRequest, res: Response) => {
  const user = repositories.users.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, error: { message: 'User not found' } });
  const { password_hash, ...safe } = user as any;
  res.json({ success: true, data: safe });
});

router.put('/:id', requireRole('admin'), (req: AuthRequest, res: Response) => {
  const user = repositories.users.update(req.params.id, req.body);
  if (!user) return res.status(404).json({ success: false, error: { message: 'User not found' } });
  const { password_hash, ...safe } = user as any;
  res.json({ success: true, data: safe });
});

export default router;
