import { Router } from 'express';
import dashboardController from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All dashboard routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/v1/dashboard/stats
 * @desc    Get dashboard statistics
 */
router.get('/stats', (req: any, res) => dashboardController.getStats(req, res));

/**
 * @route   GET /api/v1/dashboard/activity
 * @desc    Get activity feed
 */
router.get('/activity', (req: any, res) => dashboardController.getActivity(req, res));

/**
 * @route   GET /api/v1/dashboard/trends
 * @desc    Get Playbook creation trends
 */
router.get('/trends', (req: any, res) => dashboardController.getTrends(req, res));

/**
 * @route   POST /api/v1/dashboard/export/:playbookId
 * @desc    Queue PDF export for Playbook
 */
router.post('/export/:playbookId', (req: any, res) => dashboardController.queueExport(req, res));

/**
 * @route   GET /api/v1/dashboard/exports
 * @desc    List all export jobs
 */
router.get('/exports', (req: any, res) => dashboardController.listExports(req, res));

/**
 * @route   GET /api/v1/dashboard/exports/:jobId
 * @desc    Get export job status
 */
router.get('/exports/:jobId', (req: any, res) => dashboardController.getExportStatus(req, res));

export default router;
