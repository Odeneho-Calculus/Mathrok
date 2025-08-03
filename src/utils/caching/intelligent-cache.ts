/**
 * Intelligent Caching System for Mathrok
 * Provides multi-level caching with TTL management and performance optimization
 */

interface CachedResult {
    result: any;
    timestamp: number;
    ttl: number;
    hitCount: number;
    computationTime: number;
    size: number;
}

interface CacheStats {
    totalQueries: number;
    cacheHits: number;
    cacheMisses: number;
    hitRate: number;
    averageComputationTime: number;
    totalMemoryUsage: number;
    evictions: number;
}

interface CacheConfig {
    maxQueryCacheSize: number;
    maxComputationCacheSize: number;
    maxAICacheSize: number;
    defaultTTL: number;
    maxMemoryUsage: number;
    enableCompression: boolean;
}

export class IntelligentCache {
    private queryCache = new Map<string, CachedResult>();
    private computationCache = new Map<string, CachedResult>();
    private aiModelCache = new Map<string, CachedResult>();

    private stats: CacheStats = {
        totalQueries: 0,
        cacheHits: 0,
        cacheMisses: 0,
        hitRate: 0,
        averageComputationTime: 0,
        totalMemoryUsage: 0,
        evictions: 0
    };

    private config: CacheConfig = {
        maxQueryCacheSize: 1000,
        maxComputationCacheSize: 500,
        maxAICacheSize: 100,
        defaultTTL: 3600000, // 1 hour
        maxMemoryUsage: 50 * 1024 * 1024, // 50MB
        enableCompression: true
    };

    constructor(config?: Partial<CacheConfig>) {
        if (config) {
            this.config = { ...this.config, ...config };
        }

        // Start cleanup interval
        this.startCleanupInterval();
    }

    /**
     * Get cached result by query and type
     */
    async getCachedResult(
        query: string,
        type: 'query' | 'computation' | 'ai'
    ): Promise<CachedResult | null> {
        try {
            // Validate inputs
            if (!query || typeof query !== 'string') {
                return null;
            }

            // Increment query counter
            this.stats.totalQueries++;

            // Normalize key and get cache
            const normalizedKey = this.normalizeKey(query, type);
            const cache = this.getCache(type);

            // Safely get cached result
            const cached = cache.get(normalizedKey);

            // Check if cache is valid
            if (cached && this.isValidCache(cached)) {
                try {
                    // Update hit count and stats
                    cached.hitCount++;
                    this.stats.cacheHits++;
                    this.updateHitRate();

                    // Return decompressed result
                    return {
                        ...cached,
                        result: this.decompressIfNeeded(cached.result)
                    };
                } catch (decompressError) {
                    // If decompression fails, treat as cache miss
                    this.stats.cacheMisses++;
                    this.updateHitRate();

                    // Remove invalid cache entry
                    cache.delete(normalizedKey);
                    return null;
                }
            }

            // Cache miss
            this.stats.cacheMisses++;
            this.updateHitRate();

            // Clean up expired cache
            if (cached && !this.isValidCache(cached)) {
                cache.delete(normalizedKey);
            }

            return null;
        } catch (error) {
            // Gracefully handle any unexpected errors
            console.warn('Cache retrieval error:', error);
            return null;
        }
    }

    /**
     * Cache a result with intelligent management
     */
    async cacheResult(
        query: string,
        result: any,
        type: 'query' | 'computation' | 'ai',
        computationTime: number,
        ttl?: number
    ): Promise<void> {
        try {
            // Validate inputs
            if (!query || typeof query !== 'string') {
                return;
            }

            // Skip caching null or undefined results
            if (result === null || result === undefined) {
                return;
            }

            // Validate computation time
            if (isNaN(computationTime) || computationTime < 0) {
                computationTime = 0;
            }

            // Normalize key and get cache
            const normalizedKey = this.normalizeKey(query, type);
            const cache = this.getCache(type);
            const maxSize = this.getMaxSize(type);

            try {
                // Compress result if enabled
                const compressedResult = this.compressIfNeeded(result);
                const resultSize = this.calculateSize(compressedResult);

                // Skip if result is too large (>10MB)
                if (resultSize > 10 * 1024 * 1024) {
                    return;
                }

                const cachedResult: CachedResult = {
                    result: compressedResult,
                    timestamp: Date.now(),
                    ttl: ttl || this.config.defaultTTL,
                    hitCount: 0,
                    computationTime,
                    size: resultSize
                };

                // Check memory limits
                if (this.stats.totalMemoryUsage + resultSize > this.config.maxMemoryUsage) {
                    await this.evictLeastUsed(type, resultSize);
                }

                // Check cache size limits
                if (cache.size >= maxSize) {
                    await this.evictLeastRecentlyUsed(cache);
                }

                // Store in cache
                cache.set(normalizedKey, cachedResult);
                this.stats.totalMemoryUsage += resultSize;

                // Update average computation time
                this.updateAverageComputationTime(computationTime);
            } catch (compressionError) {
                // If compression fails, try to cache uncompressed
                try {
                    const resultSize = this.calculateSize(result);

                    // Skip if result is too large
                    if (resultSize > 1 * 1024 * 1024) {
                        return;
                    }

                    const cachedResult: CachedResult = {
                        result: result,
                        timestamp: Date.now(),
                        ttl: ttl || this.config.defaultTTL,
                        hitCount: 0,
                        computationTime,
                        size: resultSize
                    };

                    cache.set(normalizedKey, cachedResult);
                    this.stats.totalMemoryUsage += resultSize;
                } catch (fallbackError) {
                    // If all caching attempts fail, just skip caching this result
                    console.warn('Cache compression error:', fallbackError);
                }
            }
        } catch (error) {
            // Gracefully handle any unexpected errors
            console.warn('Cache storage error:', error);
        }
    }

    /**
     * Clear specific cache type or all caches
     */
    clearCache(type?: 'query' | 'computation' | 'ai'): void {
        try {
            if (type) {
                const cache = this.getCache(type);
                if (cache.size > 0) {
                    this.stats.totalMemoryUsage -= this.calculateCacheMemoryUsage(cache);
                    cache.clear();
                }
            } else {
                this.queryCache.clear();
                this.computationCache.clear();
                this.aiModelCache.clear();
                this.stats.totalMemoryUsage = 0;
            }
        } catch (error) {
            // Gracefully handle any cache clearing errors
            console.warn('Cache clearing error:', error);
        }
    }

    /**
     * Get cache statistics
     */
    getStats(): CacheStats {
        return { ...this.stats };
    }

    /**
     * Get detailed cache information
     */
    getCacheInfo(): {
        queryCache: { size: number; memoryUsage: number };
        computationCache: { size: number; memoryUsage: number };
        aiCache: { size: number; memoryUsage: number };
        totalMemoryUsage: number;
        hitRate: number;
    } {
        return {
            queryCache: {
                size: this.queryCache.size,
                memoryUsage: this.calculateCacheMemoryUsage(this.queryCache)
            },
            computationCache: {
                size: this.computationCache.size,
                memoryUsage: this.calculateCacheMemoryUsage(this.computationCache)
            },
            aiCache: {
                size: this.aiModelCache.size,
                memoryUsage: this.calculateCacheMemoryUsage(this.aiModelCache)
            },
            totalMemoryUsage: this.stats.totalMemoryUsage,
            hitRate: this.stats.hitRate
        };
    }

    /**
     * Optimize cache by removing expired and least used entries
     */
    async optimizeCache(): Promise<void> {
        await this.cleanupExpiredEntries();
        await this.optimizeMemoryUsage();
    }

    // Private helper methods

    private normalizeKey(query: string, type: string): string {
        // Normalize mathematical expressions for consistent caching
        const normalized = query
            .toLowerCase()
            .replace(/\s+/g, '')
            .replace(/\*\*/g, '^')
            .replace(/\*/g, '*');

        return `${type}:${normalized}`;
    }

    private getCache(type: 'query' | 'computation' | 'ai'): Map<string, CachedResult> {
        switch (type) {
            case 'query':
                return this.queryCache;
            case 'computation':
                return this.computationCache;
            case 'ai':
                return this.aiModelCache;
            default:
                // Return empty map for invalid types instead of throwing
                return new Map<string, CachedResult>();
        }
    }

    private getMaxSize(type: 'query' | 'computation' | 'ai'): number {
        switch (type) {
            case 'query':
                return this.config.maxQueryCacheSize;
            case 'computation':
                return this.config.maxComputationCacheSize;
            case 'ai':
                return this.config.maxAICacheSize;
            default:
                return 100;
        }
    }

    private isValidCache(cached: CachedResult): boolean {
        const now = Date.now();
        return (now - cached.timestamp) < cached.ttl;
    }

    private compressIfNeeded(result: any): any {
        if (!this.config.enableCompression) {
            return result;
        }

        // Simple compression for large results
        if (typeof result === 'string' && result.length > 1000) {
            try {
                return {
                    compressed: true,
                    data: this.simpleCompress(result)
                };
            } catch {
                return result;
            }
        }

        return result;
    }

    private decompressIfNeeded(result: any): any {
        if (result && result.compressed) {
            try {
                return this.simpleDecompress(result.data);
            } catch {
                return result;
            }
        }
        return result;
    }

    private simpleCompress(str: string): string {
        // Simple run-length encoding for mathematical expressions
        return str.replace(/(.)\1+/g, (match, char) => {
            return match.length > 3 ? `${char}${match.length}` : match;
        });
    }

    private simpleDecompress(str: string): string {
        // Decompress run-length encoded strings
        return str.replace(/(.)\d+/g, (match, char) => {
            const count = parseInt(match.slice(1));
            return char.repeat(count);
        });
    }

    private calculateSize(obj: any): number {
        // Estimate object size in bytes
        const str = JSON.stringify(obj);
        return new Blob([str]).size;
    }

    private calculateCacheMemoryUsage(cache: Map<string, CachedResult>): number {
        let total = 0;
        for (const cached of cache.values()) {
            total += cached.size;
        }
        return total;
    }

    private async evictLeastUsed(type: 'query' | 'computation' | 'ai', neededSpace: number): Promise<void> {
        const cache = this.getCache(type);
        const entries = Array.from(cache.entries());

        // Sort by hit count (ascending) and timestamp (ascending)
        entries.sort((a, b) => {
            if (a[1].hitCount !== b[1].hitCount) {
                return a[1].hitCount - b[1].hitCount;
            }
            return a[1].timestamp - b[1].timestamp;
        });

        let freedSpace = 0;
        for (const [key, cached] of entries) {
            cache.delete(key);
            freedSpace += cached.size;
            this.stats.evictions++;

            if (freedSpace >= neededSpace) {
                break;
            }
        }

        this.stats.totalMemoryUsage -= freedSpace;
    }

    private async evictLeastRecentlyUsed(cache: Map<string, CachedResult>): Promise<void> {
        const entries = Array.from(cache.entries());

        // Sort by timestamp (ascending)
        entries.sort((a, b) => a[1].timestamp - b[1].timestamp);

        // Remove oldest 25% of entries
        const toRemove = Math.ceil(entries.length * 0.25);
        for (let i = 0; i < toRemove; i++) {
            const [key, cached] = entries[i];
            cache.delete(key);
            this.stats.totalMemoryUsage -= cached.size;
            this.stats.evictions++;
        }
    }

    private async cleanupExpiredEntries(): Promise<void> {
        const now = Date.now();
        const caches = [this.queryCache, this.computationCache, this.aiModelCache];

        for (const cache of caches) {
            const expiredKeys: string[] = [];

            for (const [key, cached] of cache.entries()) {
                if (!this.isValidCache(cached)) {
                    expiredKeys.push(key);
                }
            }

            for (const key of expiredKeys) {
                const cached = cache.get(key);
                if (cached) {
                    this.stats.totalMemoryUsage -= cached.size;
                    cache.delete(key);
                }
            }
        }
    }

    private async optimizeMemoryUsage(): Promise<void> {
        if (this.stats.totalMemoryUsage > this.config.maxMemoryUsage * 0.8) {
            // Reduce cache sizes by 30%
            const targetReduction = this.stats.totalMemoryUsage * 0.3;

            await this.evictLeastUsed('query', targetReduction * 0.5);
            await this.evictLeastUsed('computation', targetReduction * 0.3);
            await this.evictLeastUsed('ai', targetReduction * 0.2);
        }
    }

    private updateHitRate(): void {
        this.stats.hitRate = this.stats.totalQueries > 0
            ? this.stats.cacheHits / this.stats.totalQueries
            : 0;
    }

    private updateAverageComputationTime(computationTime: number): void {
        const totalTime = this.stats.averageComputationTime * (this.stats.totalQueries - 1);
        this.stats.averageComputationTime = (totalTime + computationTime) / this.stats.totalQueries;
    }

    private startCleanupInterval(): void {
        // Cleanup expired entries every 5 minutes
        setInterval(() => {
            this.cleanupExpiredEntries();
        }, 5 * 60 * 1000);

        // Optimize memory usage every 15 minutes
        setInterval(() => {
            this.optimizeMemoryUsage();
        }, 15 * 60 * 1000);
    }
}