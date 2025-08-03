/**
 * Basic integration tests for Mathrok library
 */

import { Mathrok } from '../../src/index.js';

describe('Mathrok Integration Tests', () => {
    let mathrok: Mathrok;

    beforeEach(() => {
        mathrok = new Mathrok();
    });

    describe('Basic parsing', () => {
        it('should parse simple expressions', async () => {
            const result = await mathrok.parse('2 + 3');

            expect(result.result).toBeDefined();
            expect(result.result.raw).toBe('2 + 3');
            expect(result.result.variables).toEqual([]);
            expect(result.metadata.isExact).toBe(true);
        });

        it('should parse expressions with variables', async () => {
            const result = await mathrok.parse('x + 1');

            expect(result.result.variables).toContain('x');
            expect(result.result.complexity).toBeGreaterThan(0);
        });

        it('should parse function calls', async () => {
            const result = await mathrok.parse('sin(x)');

            expect(result.result.functions).toContain('sin');
            expect(result.result.variables).toContain('x');
        });
    });

    describe('Basic evaluation', () => {
        it('should evaluate simple arithmetic', async () => {
            const result = await mathrok.evaluate('2 + 3');

            expect(result.result).toBe(5);
            expect(result.metadata.isExact).toBe(true);
        });

        it('should evaluate expressions with variables', async () => {
            const result = await mathrok.evaluate('x + 1', { x: 5 });

            expect(result.result).toBe(6);
        });
    });

    describe('Configuration', () => {
        it('should use custom configuration', async () => {
            const customMathrok = new Mathrok({
                precision: 5,
                exact: false,
            });

            const result = await customMathrok.parse('1/3');
            expect(result.metadata.isExact).toBe(false);
        });

        it('should update configuration', () => {
            mathrok.configure({ precision: 10 });
            const config = mathrok.getConfig();

            expect(config.precision).toBe(10);
        });
    });

    describe('Error handling', () => {
        it('should handle invalid expressions', async () => {
            await expect(mathrok.parse('')).rejects.toThrow();
        });

        it('should handle malformed expressions', async () => {
            await expect(mathrok.parse('2 +')).rejects.toThrow();
        });
    });

    describe('Natural Language Processing', () => {
        it('should process simple natural language queries', async () => {
            const result = await mathrok.fromNaturalLanguage('solve x plus one equals five for x');

            expect(result.expression).toContain('x');
            expect(result.intent).toBe('solve_equation');
        });

        it('should handle derivative requests', async () => {
            const result = await mathrok.fromNaturalLanguage('derivative of x squared');

            expect(result.intent).toBe('calculate_derivative');
            expect(result.expression).toContain('x');
        });
    });

    describe('Step-by-step explanations', () => {
        it('should generate explanations for operations', async () => {
            const result = await mathrok.explain('2 + 3', 'evaluate');

            expect(result.explanation).toBeDefined();
            expect(result.explanation.length).toBeGreaterThan(0);
            expect(result.concepts).toContain('arithmetic');
        });
    });

    describe('Performance monitoring', () => {
        it('should track performance metrics', async () => {
            mathrok.startProfiling();

            await mathrok.parse('x^2 + 2*x + 1');
            await mathrok.evaluate('2 + 3');

            const metrics = mathrok.stopProfiling();

            expect(metrics.parseTime).toBeGreaterThan(0);
            expect(metrics.totalTime).toBeGreaterThan(0);
        });
    });
});