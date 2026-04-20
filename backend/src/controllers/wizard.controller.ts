import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import wizardService from '../services/wizard/wizard.service';
import logger from '../utils/logger';

export class WizardController {
    /**
     * POST /api/v1/wizard/sessions
     * Create new wizard session
     */
    async createSession(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, error: 'Unauthorized' });
                return;
            }

            const { initialInput } = req.body;
            const session = await wizardService.createSession(req.user.id, initialInput);

            res.status(201).json({ success: true, data: session });
        } catch (error: any) {
            logger.error('Error creating wizard session:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    }

    /**
     * GET /api/v1/wizard/sessions/:id
     * Get wizard session details
     */
    async getSession(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, error: 'Unauthorized' });
                return;
            }

            const session = await wizardService.getSession(req.params.id, req.user.id);
            res.json({ success: true, data: session });
        } catch (error: any) {
            res.status(404).json({ success: false, error: 'Session not found' });
        }
    }

    /**
     * POST /api/v1/wizard/sessions/:id/input
     * Submit user input to wizard session
     */
    async submitInput(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, error: 'Unauthorized' });
                return;
            }

            const { input } = req.body;
            if (!input) {
                res.status(400).json({ success: false, error: 'Input is required' });
                return;
            }

            const updated = await wizardService.processInput(
                req.params.id,
                req.user.id,
                input
            );

            res.json({ success: true, data: updated });
        } catch (error: any) {
            logger.error('Error processing wizard input:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    }

    /**
     * POST /api/v1/wizard/sessions/:id/generate
     * Generate final Playbook from wizard session
     */
    async generatePlaybook(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, error: 'Unauthorized' });
                return;
            }

            const playbook = await wizardService.generateFromSession(req.params.id, req.user.id);
            res.status(201).json({ success: true, data: playbook });
        } catch (error: any) {
            logger.error('Error generating Playbook from wizard:', error);
            res.status(400).json({ success: false, error: error.message });
        }
    }

    /**
     * GET /api/v1/wizard/sessions
     * List all wizard sessions for current user
     */
    async listSessions(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, error: 'Unauthorized' });
                return;
            }

            const sessions = await wizardService.listUserSessions(req.user.id);
            res.json({ success: true, count: sessions.length, data: sessions });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}

export default new WizardController();
