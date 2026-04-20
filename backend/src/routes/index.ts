import { Router } from 'express';
import authRoutes from './auth.routes';
import playbookRoutes from './playbook.routes';
import wizardRoutes from './wizard.routes';
import dashboardRoutes from './dashboard.routes';
import demoRoutes from './demo.routes';

const router = Router();

// Health check
router.get('/health', (_req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/playbooks', playbookRoutes);
router.use('/wizard', wizardRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/demo', demoRoutes);

export default router;
