/**
 * Phase 4 Advanced Features Tests
 * Comprehensive testing for advanced matrix operations, statistics, and caching
 */

import { Mathrok } from '../../src/index.js';

describe('Phase 4: Advanced Features', () => {
    let mathrok: Mathrok;

    beforeEach(() => {
        mathrok = new Mathrok();
    });

    describe('Advanced Matrix Operations', () => {
        const matrix2x2 = {
            rows: 2,
            cols: 2,
            data: [[1, 2], [3, 4]]
        };

        const matrix2x2_b = {
            rows: 2,
            cols: 2,
            data: [[5, 6], [7, 8]]
        };

        const matrix3x3 = {
            rows: 3,
            cols: 3,
            data: [[2, -1, 0], [-1, 2, -1], [0, -1, 2]]
        };

        const vector2 = {
            size: 2,
            data: [1, 2]
        };

        test('should perform matrix addition with steps', () => {
            const result = mathrok.matrix.add(matrix2x2, matrix2x2_b);

            expect(result.result.data).toEqual([[6, 8], [10, 12]]);
            expect(result.steps).toContain('Adding matrices of size 2×2');
            expect(result.metadata.operation).toBe('matrix_addition');
            expect(result.metadata.complexity).toBe('O(mn)');
        });

        test('should perform matrix multiplication', () => {
            const result = mathrok.matrix.multiply(matrix2x2, matrix2x2_b);

            expect(result.result.data).toEqual([[19, 22], [43, 50]]);
            expect(result.steps).toContain('Multiplying 2×2 matrix with 2×2 matrix');
            expect(result.metadata.operation).toBe('matrix_multiplication');
        });

        test('should compute matrix determinant', () => {
            const det = mathrok.matrix.determinant(matrix2x2);

            expect(det).toBe(-2); // 1*4 - 2*3 = -2
        });

        test('should compute eigenvalues', () => {
            const result = mathrok.matrix.eigenvalues(matrix3x3);

            expect(result.eigenvalues).toHaveLength(3);
            expect(result.convergence.converged).toBe(true);
            expect(result.steps).toContain('Computing eigenvalues for 3×3 matrix');
        });

        test('should solve linear system', () => {
            const A = {
                rows: 2,
                cols: 2,
                data: [[2, 1], [1, 1]]
            };
            const b = {
                size: 2,
                data: [3, 2]
            };

            const result = mathrok.matrix.solveLinearSystem(A, b);

            expect(result.solution.data).toHaveLength(2);
            expect(result.method).toMatch(/gaussian|lu|qr/);
            expect(result.residual).toBeLessThan(1e-10);
        });

        test('should perform LU decomposition', () => {
            const result = mathrok.matrix.luDecomposition(matrix3x3);

            expect(result.factors).toHaveLength(2);
            expect(result.type).toBe('LU');
            expect(result.steps).toContain('Performing LU decomposition on 3×3 matrix');
        });

        test('should perform QR decomposition', () => {
            const result = mathrok.matrix.qrDecomposition(matrix3x3);

            expect(result.Q.rows).toBe(3);
            expect(result.Q.cols).toBe(3);
            expect(result.R.rows).toBe(3);
            expect(result.R.cols).toBe(3);
        });

        test('should compute matrix inverse', () => {
            const result = mathrok.matrix.inverse(matrix2x2);

            expect(result.result.rows).toBe(2);
            expect(result.result.cols).toBe(2);
            expect(result.steps).toContain('Computing inverse of 2×2 matrix using Gauss-Jordan elimination');
            expect(result.metadata.operation).toBe('matrix_inversion');
        });

        test('should handle singular matrix errors', () => {
            const singularMatrix = {
                rows: 2,
                cols: 2,
                data: [[1, 2], [2, 4]]
            };

            expect(() => {
                mathrok.matrix.inverse(singularMatrix);
            }).toThrow('Matrix is singular and cannot be inverted');
        });

        test('should handle dimension mismatch errors', () => {
            const matrix3x2 = {
                rows: 3,
                cols: 2,
                data: [[1, 2], [3, 4], [5, 6]]
            };

            expect(() => {
                mathrok.matrix.add(matrix2x2, matrix3x2);
            }).toThrow('Cannot perform addition: matrices have different dimensions');
        });
    });

    describe('Statistics Engine', () => {
        const sampleData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const normalData = [1.2, 2.1, 1.8, 2.3, 1.9, 2.0, 1.7, 2.2, 1.6, 2.4];

        test('should compute descriptive statistics', () => {
            const result = mathrok.statistics.descriptive(sampleData);

            expect(result.mean).toBe(5.5);
            expect(result.median).toBe(5.5);
            expect(result.count).toBe(10);
            expect(result.range).toBe(9);
            expect(result.standardDeviation).toBeGreaterThan(0);
            expect(result.quartiles.q1).toBeLessThan(result.quartiles.q2);
            expect(result.quartiles.q2).toBeLessThan(result.quartiles.q3);
        });

        test('should handle normal distribution calculations', () => {
            const result = mathrok.statistics.normalDistribution(0, 0, 1);

            expect(result.pdf).toBeCloseTo(0.3989, 3); // 1/sqrt(2π)
            expect(result.cdf).toBeCloseTo(0.5, 3);
            expect(result.percentile).toBeCloseTo(50, 1);
            expect(result.zScore).toBe(0);
            expect(result.explanation).toContain('normal distribution');
        });

        test('should handle t-distribution calculations', () => {
            const result = mathrok.statistics.tDistribution(0, 10);

            expect(result.pdf).toBeGreaterThan(0);
            expect(result.cdf).toBeCloseTo(0.5, 2);
            expect(result.explanation).toContain('t-distribution');
        });

        test('should handle chi-square distribution calculations', () => {
            const result = mathrok.statistics.chiSquareDistribution(1, 1);

            expect(result.pdf).toBeGreaterThan(0);
            expect(result.cdf).toBeGreaterThan(0);
            expect(result.explanation).toContain('chi-square distribution');
        });

        test('should perform one-sample t-test', () => {
            const result = mathrok.statistics.oneSampleTTest(normalData, 2.0, 0.05);

            expect(result.testStatistic).toBeDefined();
            expect(result.pValue).toBeGreaterThan(0);
            expect(result.pValue).toBeLessThan(1);
            expect(result.confidence).toBe(95);
            expect(result.method).toBe('one_sample_t_test');
            expect(result.conclusion).toContain('null hypothesis');
        });

        test('should perform two-sample t-test', () => {
            const sample1 = [1.8, 2.0, 1.9, 2.1, 1.7];
            const sample2 = [2.2, 2.4, 2.3, 2.5, 2.1];

            const result = mathrok.statistics.twoSampleTTest(sample1, sample2, 0.05);

            expect(result.testStatistic).toBeDefined();
            expect(result.pValue).toBeGreaterThan(0);
            expect(result.method).toBe('two_sample_t_test');
            expect(result.conclusion).toContain('null hypothesis');
        });

        test('should perform linear regression', () => {
            const x = [1, 2, 3, 4, 5];
            const y = [2, 4, 6, 8, 10];

            const result = mathrok.statistics.linearRegression(x, y);

            expect(result.slope).toBeCloseTo(2, 1);
            expect(result.intercept).toBeCloseTo(0, 1);
            expect(result.rSquared).toBeCloseTo(1, 2);
            expect(result.correlation).toBeCloseTo(1, 2);
            expect(result.equation).toContain('y =');
            expect(result.predictions).toHaveLength(5);
            expect(result.residuals).toHaveLength(5);
        });

        test('should perform ANOVA', () => {
            const groups = [
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 9]
            ];

            const result = mathrok.statistics.anova(groups);

            expect(result.fStatistic).toBeGreaterThan(0);
            expect(result.pValue).toBeGreaterThan(0);
            expect(result.dfBetween).toBe(2);
            expect(result.dfWithin).toBe(6);
            expect(result.alpha).toBe(0.05);
        });

        test('should handle empty data errors', () => {
            expect(() => {
                mathrok.statistics.descriptive([]);
            }).toThrow('Cannot compute statistics for empty dataset');
        });

        test('should handle negative chi-square values', () => {
            expect(() => {
                mathrok.statistics.chiSquareDistribution(-1, 1);
            }).toThrow('Chi-square distribution is only defined for non-negative values');
        });

        test('should handle mismatched regression data', () => {
            expect(() => {
                mathrok.statistics.linearRegression([1, 2, 3], [1, 2]);
            }).toThrow('X and Y arrays must have the same length');
        });
    });

    describe('Intelligent Caching System', () => {
        test('should provide cache statistics', () => {
            const stats = mathrok.cache.getStats();

            expect(stats).toHaveProperty('totalQueries');
            expect(stats).toHaveProperty('cacheHits');
            expect(stats).toHaveProperty('cacheMisses');
            expect(stats).toHaveProperty('hitRate');
            expect(stats).toHaveProperty('averageComputationTime');
            expect(stats).toHaveProperty('totalMemoryUsage');
            expect(stats).toHaveProperty('evictions');
        });

        test('should provide detailed cache information', () => {
            const info = mathrok.cache.getInfo();

            expect(info).toHaveProperty('queryCache');
            expect(info).toHaveProperty('computationCache');
            expect(info).toHaveProperty('aiCache');
            expect(info).toHaveProperty('totalMemoryUsage');
            expect(info).toHaveProperty('hitRate');

            expect(info.queryCache).toHaveProperty('size');
            expect(info.queryCache).toHaveProperty('memoryUsage');
        });

        test('should clear cache by type', () => {
            mathrok.cache.clear('query');
            mathrok.cache.clear('computation');
            mathrok.cache.clear('ai');

            const info = mathrok.cache.getInfo();
            expect(info.queryCache.size).toBe(0);
            expect(info.computationCache.size).toBe(0);
            expect(info.aiCache.size).toBe(0);
        });

        test('should clear all caches', () => {
            mathrok.cache.clear();

            const info = mathrok.cache.getInfo();
            expect(info.totalMemoryUsage).toBe(0);
        });

        test('should optimize cache', async () => {
            await expect(mathrok.cache.optimize()).resolves.not.toThrow();
        });
    });

    describe('Performance Monitoring', () => {
        test('should provide performance statistics', () => {
            const stats = mathrok.performance.getStats();

            expect(stats).toHaveProperty('totalOperations');
            expect(stats).toHaveProperty('averageTime');
            expect(stats).toHaveProperty('totalTime');
            expect(stats).toHaveProperty('operationCounts');
        });

        test('should start and stop profiling', () => {
            mathrok.performance.startProfiling();

            // Perform some operations
            mathrok.solve('x + 1 = 2');

            const results = mathrok.performance.stopProfiling();
            expect(results).toHaveProperty('duration');
            expect(results).toHaveProperty('operations');
        });

        test('should reset performance tracking', () => {
            mathrok.performance.reset();

            const stats = mathrok.performance.getStats();
            expect(stats.totalOperations).toBe(0);
            expect(stats.totalTime).toBe(0);
        });
    });

    describe('Integration Tests', () => {
        test('should cache matrix operations', async () => {
            const matrix = {
                rows: 2,
                cols: 2,
                data: [[1, 2], [3, 4]]
            };

            // First computation
            const result1 = mathrok.matrix.determinant(matrix);

            // Second computation (should be cached)
            const result2 = mathrok.matrix.determinant(matrix);

            expect(result1).toBe(result2);

            const cacheStats = mathrok.cache.getStats();
            expect(cacheStats.totalQueries).toBeGreaterThan(0);
        });

        test('should track performance for statistics operations', () => {
            const data = [1, 2, 3, 4, 5];

            mathrok.performance.startProfiling();
            mathrok.statistics.descriptive(data);
            const results = mathrok.performance.stopProfiling();

            expect(results.operations).toBeGreaterThan(0);
            expect(results.duration).toBeGreaterThan(0);
        });

        test('should handle complex workflow with all features', async () => {
            // Matrix operations
            const matrix = {
                rows: 2,
                cols: 2,
                data: [[2, 1], [1, 2]]
            };

            const eigenResult = mathrok.matrix.eigenvalues(matrix);
            expect(eigenResult.eigenvalues).toHaveLength(2);

            // Statistics
            const data = eigenResult.eigenvalues;
            const statsResult = mathrok.statistics.descriptive(data);
            expect(statsResult.count).toBe(2);

            // Performance monitoring
            const perfStats = mathrok.performance.getStats();
            expect(perfStats.totalOperations).toBeGreaterThan(0);

            // Cache optimization
            await mathrok.cache.optimize();

            const cacheInfo = mathrok.cache.getInfo();
            expect(cacheInfo).toBeDefined();
        });

        test('should maintain performance under load', () => {
            const startTime = performance.now();

            // Perform multiple operations
            for (let i = 0; i < 10; i++) {
                const data = Array.from({ length: 100 }, () => Math.random());
                mathrok.statistics.descriptive(data);
            }

            const endTime = performance.now();
            const totalTime = endTime - startTime;

            // Should complete within reasonable time (adjust threshold as needed)
            expect(totalTime).toBeLessThan(1000); // 1 second

            const perfStats = mathrok.performance.getStats();
            expect(perfStats.averageTime).toBeLessThan(100); // 100ms average
        });
    });

    describe('Error Handling and Edge Cases', () => {
        test('should handle invalid matrix operations gracefully', () => {
            const invalidMatrix = {
                rows: 0,
                cols: 0,
                data: []
            };

            expect(() => {
                mathrok.matrix.determinant(invalidMatrix);
            }).toThrow();
        });

        test('should handle invalid statistical data', () => {
            expect(() => {
                mathrok.statistics.descriptive([]);
            }).toThrow('Cannot compute statistics for empty dataset');

            expect(() => {
                mathrok.statistics.normalDistribution(0, 0, 0);
            }).toThrow();
        });

        test('should handle cache errors gracefully', () => {
            // These should not throw errors
            expect(() => mathrok.cache.clear('invalid' as any)).not.toThrow();
            expect(() => mathrok.cache.getStats()).not.toThrow();
            expect(() => mathrok.cache.getInfo()).not.toThrow();
        });

        test('should handle performance monitoring errors', () => {
            // Multiple start/stop calls should be handled gracefully
            mathrok.performance.startProfiling();
            mathrok.performance.startProfiling(); // Second call

            const results = mathrok.performance.stopProfiling();
            expect(results).toBeDefined();
        });
    });
});