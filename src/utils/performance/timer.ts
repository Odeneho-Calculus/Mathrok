/**
 * Cross-platform performance timing utility
 * Provides consistent high-resolution timing across Node.js and browser environments
 */

/**
 * Get high-resolution timestamp in milliseconds
 * Uses performance.now() when available, falls back to Date.now()
 */
export function getHighResolutionTime(): number {
    // Check if we're in a browser environment with performance.now()
    if (typeof performance !== 'undefined' && performance.now) {
        return performance.now();
    }

    // Check if we're in Node.js with process.hrtime.bigint()
    if (typeof process !== 'undefined' && process.hrtime && process.hrtime.bigint) {
        return Number(process.hrtime.bigint()) / 1_000_000; // Convert nanoseconds to milliseconds
    }

    // Fallback to Date.now() (lower resolution but universally available)
    return Date.now();
}

/**
 * Performance timer class for measuring operation durations
 */
export class PerformanceTimer {
    private startTime: number = 0;
    private endTime: number = 0;
    private isRunning: boolean = false;

    /**
     * Start the timer
     */
    start(): void {
        this.startTime = getHighResolutionTime();
        this.isRunning = true;
        this.endTime = 0;
    }

    /**
     * Stop the timer and return elapsed time in milliseconds
     */
    stop(): number {
        if (!this.isRunning) {
            throw new Error('Timer is not running. Call start() first.');
        }

        this.endTime = getHighResolutionTime();
        this.isRunning = false;

        return this.elapsed();
    }

    /**
     * Get elapsed time in milliseconds
     * If timer is still running, returns time since start
     */
    elapsed(): number {
        if (this.isRunning) {
            return getHighResolutionTime() - this.startTime;
        }

        if (this.endTime === 0) {
            return 0;
        }

        return this.endTime - this.startTime;
    }

    /**
     * Reset the timer
     */
    reset(): void {
        this.startTime = 0;
        this.endTime = 0;
        this.isRunning = false;
    }

    /**
     * Check if timer is currently running
     */
    get running(): boolean {
        return this.isRunning;
    }
}

/**
 * Measure execution time of a function
 */
export async function measureAsync<T>(fn: () => Promise<T>): Promise<{ result: T; duration: number }> {
    const timer = new PerformanceTimer();
    timer.start();

    try {
        const result = await fn();
        const duration = timer.stop();
        return { result, duration };
    } catch (error) {
        timer.stop();
        throw error;
    }
}

/**
 * Measure execution time of a synchronous function
 */
export function measureSync<T>(fn: () => T): { result: T; duration: number } {
    const timer = new PerformanceTimer();
    timer.start();

    try {
        const result = fn();
        const duration = timer.stop();
        return { result, duration };
    } catch (error) {
        timer.stop();
        throw error;
    }
}