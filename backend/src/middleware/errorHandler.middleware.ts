import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export interface ApiError extends Error {
    statusCode?: number;
    details?: any;
}

export const errorHandler = (
    err: ApiError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // Log error
    logger.error('API Error:', {
        path: req.path,
        method: req.method,
        statusCode,
        message,
        stack: err.stack,
        details: err.details,
    });

    // Send response
    res.status(statusCode).json({
        error: process.env.NODE_ENV === 'production' && statusCode >= 500 ? 'Internal Server Error' : message,
        ...(err.details && process.env.NODE_ENV !== 'production' && { details: err.details }),
    });
};

// Not found handler
export const notFoundHandler = (req: Request, res: Response): void => {
    res.status(404).json({
        error: 'Not Found',
        message: `Cannot ${req.method} ${req.path}`,
    });
};
