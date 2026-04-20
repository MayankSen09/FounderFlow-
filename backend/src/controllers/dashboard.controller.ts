import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import analyticsService from '../services/analytics/analytics.service';
import pdfService from '../services/export/pdf.service';

export class DashboardController {
    /**
     * GET /api/v1/dashboard/stats
     * Get dashboard statistics
     */
    async getStats(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, error: 'Unauthorized' });
                return;
            }

            const stats = await analyticsService.getDashboardStats(req.user.id, req.user.role);
            res.json({ success: true, data: stats });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    /**
     * GET /api/v1/dashboard/activity
     * Get activity feed
     */
    async getActivity(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, error: 'Unauthorized' });
                return;
            }

            const feed = await analyticsService.getActivityFeed(
                req.user.id,
                req.user.role,
                req.query
            );
            res.json({ success: true, data: feed });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    /**
     * GET /api/v1/dashboard/trends
     * Get Playbook creation trends
     */
    async getTrends(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, error: 'Unauthorized' });
                return;
            }

            const days = parseInt(req.query.days as string) || 30;
            const trends = await analyticsService.getPlaybookTrends(req.user.id, req.user.role, days);
            res.json({ success: true, data: trends });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    /**
     * POST /api/v1/dashboard/export/:playbookId
     * Queue PDF export
     */
    async queueExport(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, error: 'Unauthorized' });
                return;
            }

            const { format } = req.body;
            const job = await pdfService.queueExport(req.params.playbookId, req.user.id, format);
            res.status(202).json({ success: true, data: job });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    /**
     * GET /api/v1/dashboard/exports
     * List export jobs
     */
    async listExports(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, error: 'Unauthorized' });
                return;
            }

            const jobs = await pdfService.listUserJobs(req.user.id);
            res.json({ success: true, count: jobs.length, data: jobs });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    /**
     * GET /api/v1/dashboard/exports/:jobId
     * Get export job status
     */
    async getExportStatus(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, error: 'Unauthorized' });
                return;
            }

            const job = await pdfService.getJobStatus(req.params.jobId, req.user.id);
            res.json({ success: true, data: job });
        } catch (error: any) {
            res.status(404).json({ success: false, error: 'Export job not found' });
        }
    }
}

export default new DashboardController();
