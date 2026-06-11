import { Router, Response } from 'express';
import { SearchService } from '../services/search.service';
import { repositories } from '../db';
import { authMiddleware } from '../middleware/auth';
import type { AuthRequest } from '../types';

const router = Router();
const service = new SearchService(repositories);
router.use(authMiddleware);

router.get('/', (req: AuthRequest, res: Response) => {
  const q = (req.query.q as string) || '';
  const results = service.global(q);
  res.json({ success: true, data: results });
});

export default router;
