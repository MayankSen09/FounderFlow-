import { Router } from 'express';
import wizardController from '../controllers/wizard.controller';
import { authenticate } from '../middleware/auth.middleware';
import { aiEndpointLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

// All wizard routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/v1/wizard/sessions
 * @desc    Create new wizard session
 */
router.post('/sessions', (req: any, res) => wizardController.createSession(req, res));

/**
 * @route   GET /api/v1/wizard/sessions
 * @desc    List all sessions for current user
 */
router.get('/sessions', (req: any, res) => wizardController.listSessions(req, res));

/**
 * @route   GET /api/v1/wizard/sessions/:id
 * @desc    Get wizard session details
 */
router.get('/sessions/:id', (req: any, res) => wizardController.getSession(req, res));

/**
 * @route   POST /api/v1/wizard/sessions/:id/input
 * @desc    Submit user input to wizard
 */
router.post('/sessions/:id/input', (req: any, res) => wizardController.submitInput(req, res));

/**
 * @route   POST /api/v1/wizard/sessions/:id/generate
 * @desc    Generate final Playbook from wizard session
 */
router.post('/sessions/:id/generate', aiEndpointLimiter, (req: any, res) =>
    wizardController.generatePlaybook(req, res)
);

export default router;
