import { Router } from 'express';
import playbookController from '../controllers/playbook.controller';
import { authenticate } from '../middleware/auth.middleware';
import { aiEndpointLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

// All Playbook routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/v1/playbooks
 * @desc    Get all Playbooks
 */
router.get('/', (req: any, res) => playbookController.list(req, res));

/**
 * @route   GET /api/v1/playbooks/:id
 * @desc    Get single Playbook details
 */
router.get('/:id', (req: any, res) => playbookController.get(req, res));

/**
 * @route   POST /api/v1/playbooks (Manual)
 * @desc    Create new Playbook manually
 */
router.post('/', (req: any, res) => playbookController.create(req, res));

/**
 * @route   POST /api/v1/playbooks/generate
 * @desc    Generate Playbook using AI Architect
 */
router.post('/generate', aiEndpointLimiter, (req: any, res) => playbookController.generate(req, res));

export default router;
