import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import config from './config/env';
import { initializeAI } from './config/ai';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.middleware';
import { apiLimiter } from './middleware/rateLimit.middleware';
import logger from './utils/logger';

const app: Application = express();

// Security middleware
app.use(helmet());
app.use(
    cors({
        origin: config.frontendUrl,
        credentials: true,
    })
);

// Logging
app.use(
    morgan('combined', {
        stream: {
            write: (message) => logger.info(message.trim()),
        },
    })
);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use(apiLimiter);

// Initialize AI
try {
    initializeAI();
} catch (error) {
    logger.error('Failed to initialize AI:', error);
}

// Root endpoint - API information
app.get('/', (_req, res) => {
    res.json({
        name: 'FounderFlow Backend API',
        version: config.apiVersion,
        status: 'running',
        documentation: {
            health: '/health',
            api: `/api/${config.apiVersion}`,
            endpoints: {
                auth: `/api/${config.apiVersion}/auth`,
                sops: `/api/${config.apiVersion}/sops`,
                wizard: `/api/${config.apiVersion}/wizard`,
                dashboard: `/api/${config.apiVersion}/dashboard`,
            },
        },
        message: 'Welcome to the FounderFlow API. Please use the endpoints listed above.',
    });
});

// Health check (before API versioning)
app.get('/health', (_req, res) => {
    res.status(200).json({
        status: 'healthy',
        version: config.apiVersion,
        timestamp: new Date().toISOString(),
    });
});

// API routes
app.use(`/api/${config.apiVersion}`, routes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const PORT = config.port;
const server = app.listen(PORT, () => {
    logger.info(`
    ╔═══════════════════════════════════════╗
    ║   FounderFlow Backend API              ║
    ║   Environment: ${config.nodeEnv.padEnd(24)}║
    ║   Port: ${PORT.toString().padEnd(30)}║
    ║   API Version: ${config.apiVersion.padEnd(23)}║
    ╚═══════════════════════════════════════╝
  `);
    logger.info(`Server running at http://localhost:${PORT}`);
    logger.info(`API available at http://localhost:${PORT}/api/${config.apiVersion}`);
    logger.info(`Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
const shutdown = async () => {
    logger.info('Shutting down gracefully...');
    server.close(async () => {
        logger.info('Server closed');
        process.exit(0);
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
        logger.error('Forced shutdown');
        process.exit(1);
    }, 10000);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

export default app;
