import { Request, Response, NextFunction } from 'express';

/**
 * Injects X-Response-Time headers to measure server latency limits.
 */
export const performanceProfiler = (req: Request, res: Response, next: NextFunction) => {
    const start = process.hrtime();
    
    res.on('finish', () => {
        const diff = process.hrtime(start);
        const timeInMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(3);
        
        // Expose to frontend via headers for local profiling
        res.setHeader('X-Response-Time', `${timeInMs}ms`);
    });

    next();
};
