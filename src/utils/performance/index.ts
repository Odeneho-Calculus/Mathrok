/**
 * Performance monitoring and tracking utilities
 * Tracks execution time, memory usage, and operation metrics
 */

import type { PerformanceMetrics } from '../../types/core.js';
import { getHighResolutionTime } from './timer.js';

/**
 * Operation timing data
 */
interface OperationTiming {
    readonly name: string;
    readonly startTime: number;
    readonly endTime: number;
    readonly duration: number;
    readonly memoryBefore?: number;
    readonly memoryAfter?: number;
}

/**
 * Performance statistics
 */
interface PerformanceStats {
    readonly count: number;
    readonly totalTime: number;
    readonly averageTime: number;
    readonly minTime: number;
    readonly maxTime: number;
    readonly lastTime: number;
}

/**
 * Performance tracker class
 */
export class PerformanceTracker {
    private readonly operations: Map<string, OperationTiming[]>;
    private readonly errors: Map<string, Error[]>;
    private profilingActive: boolean;
    private profilingStartTime: number;
    private readonly maxHistorySize: number;

    constructor(maxHistorySize = 1000) {
        this.operations = new Map();
        this.errors = new Map();
        this.profilingActive = false;
        this.profilingStartTime = 0;
        this.maxHistorySize = maxHistorySize;
    }

    /**
     * Record an operation timing
     */
    public recordOperation(name: string, duration: number, memoryUsage?: number): void {
        const timing: OperationTiming = {
            name,
            startTime: performance.now() - duration,
            endTime: performance.now(),
            duration,
            memoryBefore: memoryUsage ? memoryUsage - this.estimateMemoryDelta() : undefined,
            memoryAfter: memoryUsage,
        };

        if (!this.operations.has(name)) {
            this.operations.set(name, []);
        }

        const timings = this.operations.get(name)!;
        timings.push(timing);

        // Limit history size
        if (timings.length > this.maxHistorySize) {
            timings.shift();
        }
    }

    /**
     * Record an error
     */
    public recordError(operation: string, error: Error): void {
        if (!this.errors.has(operation)) {
            this.errors.set(operation, []);
        }

        const errors = this.errors.get(operation)!;
        errors.push(error);

        // Limit error history
        if (errors.length > this.maxHistorySize) {
            errors.shift();
        }
    }

    /**
     * Start profiling session
     */
    public startProfiling(): void {
        this.profilingActive = true;
        this.profilingStartTime = getHighResolutionTime();
    }

    /**
     * Stop profiling session and return metrics
     */
    public stopProfiling(): { duration: number; operations: number } {
        this.profilingActive = false;
        const profilingDuration = getHighResolutionTime() - this.profilingStartTime;

        // Count total operations during profiling session
        let totalOperations = 0;

        for (const [operation, timings] of this.operations) {
            totalOperations += timings.length;
        }

        // Return the format expected by tests: { duration, operations }
        return {
            duration: profilingDuration,
            operations: totalOperations,
        };
    }

    /**
     * Get current performance metrics
     */
    public getMetrics(): PerformanceMetrics {
        const parseStats = this.getOperationStats('parse');
        const solveStats = this.getOperationStats('solve');
        const explainStats = this.getOperationStats('explain');

        return {
            parseTime: parseStats.averageTime,
            solveTime: solveStats.averageTime,
            explainTime: explainStats.averageTime,
            totalTime: parseStats.averageTime + solveStats.averageTime + explainStats.averageTime,
            memoryUsage: this.getCurrentMemoryUsage(),
            cacheHits: this.getCacheHits(),
            cacheMisses: this.getCacheMisses(),
        };
    }

    /**
     * Get statistics for a specific operation
     */
    public getOperationStats(operationName: string): PerformanceStats {
        const timings = this.operations.get(operationName) || [];

        if (timings.length === 0) {
            return {
                count: 0,
                totalTime: 0,
                averageTime: 0,
                minTime: 0,
                maxTime: 0,
                lastTime: 0,
            };
        }

        const durations = timings.map(t => t.duration);
        const totalTime = durations.reduce((sum, duration) => sum + duration, 0);

        return {
            count: timings.length,
            totalTime,
            averageTime: totalTime / timings.length,
            minTime: Math.min(...durations),
            maxTime: Math.max(...durations),
            lastTime: durations[durations.length - 1],
        };
    }

    /**
     * Get all operation names
     */
    public getOperationNames(): string[] {
        return Array.from(this.operations.keys());
    }

    /**
     * Get error count for an operation
     */
    public getErrorCount(operationName: string): number {
        return this.errors.get(operationName)?.length || 0;
    }

    /**
     * Get total error count
     */
    public getTotalErrorCount(): number {
        let total = 0;
        for (const errors of this.errors.values()) {
            total += errors.length;
        }
        return total;
    }

    /**
     * Get recent errors for an operation
     */
    public getRecentErrors(operationName: string, count = 10): Error[] {
        const errors = this.errors.get(operationName) || [];
        return errors.slice(-count);
    }

    /**
     * Reset all metrics
     */
    public reset(): void {
        this.operations.clear();
        this.errors.clear();
        this.profilingActive = false;
        this.profilingStartTime = 0;
    }

    /**
     * Get performance summary
     */
    public getSummary(): Record<string, any> {
        const summary: Record<string, any> = {
            totalOperations: 0,
            totalErrors: this.getTotalErrorCount(),
            operations: {},
        };

        for (const operationName of this.getOperationNames()) {
            const stats = this.getOperationStats(operationName);
            summary.totalOperations += stats.count;
            summary.operations[operationName] = {
                count: stats.count,
                averageTime: Math.round(stats.averageTime * 100) / 100,
                totalTime: Math.round(stats.totalTime * 100) / 100,
                errorCount: this.getErrorCount(operationName),
            };
        }

        return summary;
    }

    /**
     * Export metrics as JSON
     */
    public exportMetrics(): string {
        const data = {
            timestamp: new Date().toISOString(),
            summary: this.getSummary(),
            operations: {},
            errors: {},
        };

        // Export detailed operation data
        for (const [name, timings] of this.operations) {
            (data.operations as any)[name] = timings.map(timing => ({
                duration: timing.duration,
                timestamp: timing.endTime,
                memoryUsage: timing.memoryAfter,
            }));
        }

        // Export error data
        for (const [name, errors] of this.errors) {
            (data.errors as any)[name] = errors.map(error => ({
                message: error.message,
                name: error.name,
                timestamp: Date.now(), // Approximate
            }));
        }

        return JSON.stringify(data, null, 2);
    }

    /**
     * Get performance statistics in the format expected by tests
     */
    public getStats(): {
        totalOperations: number;
        averageTime: number;
        totalTime: number;
        operationCounts: Record<string, number>;
        memoryUsage: number;
        cacheHits: number;
        cacheMisses: number;
        parseTime: number;
        solveTime: number;
        explainTime: number;
    } {
        const summary = this.getSummary();
        let totalTime = 0;
        let totalOperations = 0;
        const operationCounts: Record<string, number> = {};

        // Calculate totals from all operations
        for (const [name, stats] of Object.entries(summary.operations)) {
            const s = stats as any;
            totalTime += s.totalTime;
            totalOperations += s.count;
            operationCounts[name] = s.count;
        }

        return {
            totalOperations,
            averageTime: totalOperations > 0 ? totalTime / totalOperations : 0,
            totalTime,
            operationCounts,
            memoryUsage: this.getCurrentMemoryUsage(),
            cacheHits: 0, // Will be updated by cache system
            cacheMisses: 0, // Will be updated by cache system
            parseTime: this.getOperationStats('parse').totalTime,
            solveTime: this.getOperationStats('solve').totalTime,
            explainTime: this.getOperationStats('explain').totalTime,
        };
    }

    /**
     * Create a performance report
     */
    public createReport(): string {
        const summary = this.getSummary();
        const lines: string[] = [];

        lines.push('=== Mathrok Performance Report ===');
        lines.push(`Generated: ${new Date().toISOString()}`);
        lines.push('');

        lines.push('Summary:');
        lines.push(`  Total Operations: ${summary.totalOperations}`);
        lines.push(`  Total Errors: ${summary.totalErrors}`);
        lines.push(`  Memory Usage: ${this.formatBytes(this.getCurrentMemoryUsage())}`);
        lines.push('');

        lines.push('Operations:');
        for (const [name, stats] of Object.entries(summary.operations)) {
            const s = stats as any;
            lines.push(`  ${name}:`);
            lines.push(`    Count: ${s.count}`);
            lines.push(`    Average Time: ${s.averageTime}ms`);
            lines.push(`    Total Time: ${s.totalTime}ms`);
            lines.push(`    Errors: ${s.errorCount}`);
            lines.push('');
        }

        return lines.join('\n');
    }

    /**
     * Get current memory usage (approximate)
     */
    private getCurrentMemoryUsage(): number {
        if (typeof process !== 'undefined' && process.memoryUsage) {
            return process.memoryUsage().heapUsed;
        }

        // Browser approximation
        if (typeof performance !== 'undefined' && 'memory' in performance) {
            return (performance as any).memory.usedJSHeapSize || 0;
        }

        return 0;
    }

    /**
     * Estimate memory delta (simplified)
     */
    private estimateMemoryDelta(): number {
        // This is a simplified estimation
        // In a real implementation, you'd want more sophisticated memory tracking
        return 1024; // 1KB estimate
    }

    /**
     * Get cache hits (placeholder - would integrate with actual cache)
     */
    private getCacheHits(): number {
        // This would integrate with the actual cache implementation
        return 0;
    }

    /**
     * Get cache misses (placeholder - would integrate with actual cache)
     */
    private getCacheMisses(): number {
        // This would integrate with the actual cache implementation
        return 0;
    }

    /**
     * Format bytes for human reading
     */
    private formatBytes(bytes: number): string {
        if (bytes === 0) return '0 B';

        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
    }

    /**
     * Check if profiling is active
     */
    public isProfiling(): boolean {
        return this.profilingActive;
    }

    /**
     * Get profiling duration
     */
    public getProfilingDuration(): number {
        if (!this.profilingActive) {
            return 0;
        }
        return performance.now() - this.profilingStartTime;
    }
}