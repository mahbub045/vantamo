import { Router } from 'express';
import authRoutes from './auth.routes';
import clientRoutes from './client.routes';
import projectRoutes from './project.routes';
import taskRoutes from './task.routes';
import userRoutes from './user.routes';
import commentRoutes from './comment.routes';
import activityRoutes from './activity.routes';
import analyticsRoutes from './analytics.routes';
import searchRoutes from './search.routes';
import notificationRoutes from './notification.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/clients', clientRoutes);
router.use('/projects', projectRoutes);
router.use('/tasks', taskRoutes);
router.use('/users', userRoutes);
router.use('/comments', commentRoutes);
router.use('/activity', activityRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/search', searchRoutes);
router.use('/notifications', notificationRoutes);

export default router;
