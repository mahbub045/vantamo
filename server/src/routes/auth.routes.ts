import { Router, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { authMiddleware } from '../middleware/auth';
import { repositories } from '../db';
import type { AuthRequest } from '../types';

const router = Router();
const authService = new AuthService(repositories);

router.post('/register', async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    const result = await authService.register(name, email, password, role);
    res.status(201).json({ success: true, data: result });
  } catch (err: any) {
    res.status(400).json({ success: false, error: { message: err.message } });
  }
});

router.post('/login', async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(401).json({ success: false, error: { message: err.message } });
  }
});

router.get('/me', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const user = authService.getMe(req.userId!);
    res.json({ success: true, data: user });
  } catch (err: any) {
    res.status(404).json({ success: false, error: { message: err.message } });
  }
});

export default router;
