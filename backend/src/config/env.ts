import dotenv from 'dotenv';

dotenv.config();

interface Config {
    // Server
    nodeEnv: string;
    port: number;
    apiVersion: string;
    frontendUrl: string;

    // Database
    databaseUrl: string;

    // Redis
    redisUrl: string;

    // JWT
    jwtSecret: string;
    jwtExpiresIn: string;
    refreshTokenExpiresIn: string;

    // Google AI
    googleAIKey: string;
    aiModel: string;
    aiMaxRetries: number;
    aiTimeout: number;

    // OAuth
    googleClientId?: string;
    googleClientSecret?: string;
    googleCallbackUrl?: string;

    // Rate Limiting
    rateLimitWindowMs: number;
    rateLimitMaxRequests: number;
    aiRateLimitMax: number;
    aiRateLimitWindowMs: number;

    // Logging
    logLevel: string;
    logFile: string;

    // Session
    sessionExpiryHours: number;
    wizardSessionExpiryHours: number;
}

const config: Config = {
    // Server
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3001', 10),
    apiVersion: process.env.API_VERSION || 'v1',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',

    // Database
    databaseUrl: process.env.DATABASE_URL || '',

    // Redis
    redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',

    // JWT
    jwtSecret: process.env.JWT_SECRET as string,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d',

    // Google AI
    googleAIKey: process.env.GOOGLE_AI_API_KEY || '',
    aiModel: process.env.AI_MODEL || 'gemini-1.5-pro',
    aiMaxRetries: parseInt(process.env.AI_MAX_RETRIES || '3', 10),
    aiTimeout: parseInt(process.env.AI_TIMEOUT_MS || '30000', 10),

    // OAuth
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL,

    // Rate Limiting
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
    aiRateLimitMax: parseInt(process.env.AI_RATE_LIMIT_MAX || '5', 10),
    aiRateLimitWindowMs: parseInt(process.env.AI_RATE_LIMIT_WINDOW_MS || '60000', 10),

    // Logging
    logLevel: process.env.LOG_LEVEL || 'info',
    logFile: process.env.LOG_FILE || 'logs/app.log',

    // Session
    sessionExpiryHours: parseInt(process.env.SESSION_EXPIRY_HOURS || '24', 10),
    wizardSessionExpiryHours: parseInt(process.env.WIZARD_SESSION_EXPIRY_HOURS || '48', 10),
};

// Validation
if (!config.jwtSecret) {
    throw new Error('JWT_SECRET environment variable is strictly required for security.');
}
if (config.jwtSecret === 'your-secret-key' || config.jwtSecret.length < 32) {
    console.warn('⚠️ WARNING: JWT_SECRET is weak. It should be securely generated and at least 32 characters long.');
}
if (config.nodeEnv === 'production') {
    if (!config.databaseUrl) {
        throw new Error('DATABASE_URL is required in production');
    }
    if (!config.googleAIKey) {
        throw new Error('GOOGLE_AI_API_KEY is required in production');
    }
}

export default config;
