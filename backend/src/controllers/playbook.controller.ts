import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import playbookService from '../services/playbook/playbook.service';
import logger from '../utils/logger';

export class PlaybookController {
    /**
     * GET /api/v1/playbooks
     */
    async list(req: AuthRequest, res: Response): Promise<void> {
        try {
            const playbooks = await playbookService.getAllPlaybooks(req.query);
            res.json({ success: true, count: playbooks.length, data: playbooks });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    /**
     * GET /api/v1/playbooks/:id
     */
    async get(req: AuthRequest, res: Response): Promise<void> {
        try {
            const playbook = await playbookService.getPlaybookById(req.params.id);
            res.json({ success: true, data: playbook });
        } catch (error: any) {
            res.status(404).json({ success: false, error: 'Playbook not found' });
        }
    }

    /**
     * POST /api/v1/playbooks/generate
     */
    async generate(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { prompt, industry } = req.body;
            if (!prompt) {
                res.status(400).json({ success: false, error: 'Prompt is required' });
                return;
            }

            if (!req.user) {
                res.status(401).json({ success: false, error: 'Unauthorized' });
                return;
            }

            logger.info(`AI Generation requested by ${req.user.email} for: ${prompt}`);

            const playbook = await playbookService.generateAndSavePlaybook(req.user.id, prompt, industry);

            res.status(201).json({ success: true, data: playbook });
        } catch (error: any) {
            logger.error('Generation Error:', error);
            res.status(500).json({ success: false, error: error.message || 'AI Generation failed' });
        }
    }

    /**
     * POST /api/v1/playbooks (Manual Create)
     */
    async create(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, error: 'Unauthorized' });
                return;
            }
            const playbook = await playbookService.createPlaybook(req.user.id, req.body);
            res.status(201).json({ success: true, data: playbook });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
}

export default new PlaybookController();
