/**
 * Wraps an async function with exponential backoff retries.
 * Automatically delays scaling based on retry attempt iteration.
 */
export async function retryAsync<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelayMs: number = 1000
): Promise<T> {
    let attempt = 0;
    while (attempt < maxRetries) {
        try {
            return await fn();
        } catch (error) {
            attempt++;
            if (attempt >= maxRetries) {
                throw error;
            }
            // Exponential backoff strategy
            const delay = baseDelayMs * Math.pow(2, attempt - 1);
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }
    throw new Error('Unreachable retry state');
}
