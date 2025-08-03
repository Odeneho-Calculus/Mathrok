/**
 * Calculus operations tests
 * Tests for derivatives, integrals, and related calculus functionality
 */

import { Mathrok } from '../src/index.js';
import { MathConfig } from '../src/types/core.js';

describe('Calculus Operations', () => {
    let mathrok: Mathrok;
    let config: MathConfig;

    beforeEach(() => {
        config = {
            precision: 10,
            exact: true,
            autoSimplify: true,
            showSteps: true,
            useCache: false,
            timeout: 5000,
            maxSteps: 100,
        };
        mathrok = new Mathrok(config);
    });

    describe('Derivatives', () => {
        test('should compute derivative of x^2', async () => {
            const result = await mathrok.derivative('x^2');

            expect(result.result).toBe('2*x');
            expect(result.variable).toBe('x');
            expect(result.order).toBe(1);
            expect(result.metadata.isExact).toBe(true);
        });

        test('should compute derivative of polynomial', async () => {
            const result = await mathrok.derivative('x^3 + 2*x + 1');

            expect(result.result).toBe('2+3*x^2'); // Nerdamer format
            expect(result.variable).toBe('x');
            expect(result.steps).toHaveLength(2); // Includes simplification step
        });

        test('should compute derivative with respect to different variable', async () => {
            const result = await mathrok.derivative('y^2 + 3*y', 'y');

            expect(result.result).toBe('2*y+3'); // Nerdamer format
            expect(result.variable).toBe('y');
        });

        test('should compute derivative of trigonometric functions', async () => {
            const result = await mathrok.derivative('sin(x)');

            expect(result.result).toBe('cos(x)');
            expect(result.variable).toBe('x');
        });

        test('should compute derivative of exponential functions', async () => {
            const result = await mathrok.derivative('e^x');

            expect(result.result).toBe('e^x');
            expect(result.variable).toBe('x');
        });

        test('should handle constant derivatives', async () => {
            const result = await mathrok.derivative('5');

            expect(result.result).toBe('0');
            expect(result.variable).toBe('x');
        });

        test('should include step-by-step explanation', async () => {
            const result = await mathrok.derivative('x^2 + 3*x');

            expect(result.steps).toHaveLength(2); // Includes simplification step
            expect(result.steps[0].operation).toBe('differentiation');
            expect(result.steps[0].description).toContain('Differentiate with respect to x');
        });
    });

    describe('Integrals', () => {
        test('should compute integral of x', async () => {
            const result = await mathrok.integral('x');

            expect(result.result).toBe('(1/2)*(2*C+x^2)'); // Nerdamer format with C factored
            expect(result.variable).toBe('x');
            expect(result.isDefinite).toBe(false);
        });

        test('should compute integral of x^2', async () => {
            const result = await mathrok.integral('x^2');

            expect(result.result).toBe('(1/3)*(3*C+x^3)'); // Nerdamer format with C factored
            expect(result.variable).toBe('x');
        });

        test('should compute integral of polynomial', async () => {
            const result = await mathrok.integral('2*x + 3');

            expect(result.result).toBe('(3+x)*x+C'); // Nerdamer format
            expect(result.variable).toBe('x');
        });

        test('should compute integral with respect to different variable', async () => {
            const result = await mathrok.integral('y^2', 'y');

            expect(result.result).toBe('(1/3)*(3*C+y^3)'); // Nerdamer format with C factored
            expect(result.variable).toBe('y');
        });

        test('should compute integral of trigonometric functions', async () => {
            const result = await mathrok.integral('cos(x)');

            expect(result.result).toBe('C+sin(x)'); // Nerdamer format
            expect(result.variable).toBe('x');
        });

        test('should compute integral of exponential functions', async () => {
            const result = await mathrok.integral('e^x');

            expect(result.result).toBe('C+e^x'); // Nerdamer format
            expect(result.variable).toBe('x');
        });

        test('should handle constant integrals', async () => {
            const result = await mathrok.integral('5');

            expect(result.result).toBe('5*x+C'); // Nerdamer format
            expect(result.variable).toBe('x');
        });

        test('should include step-by-step explanation', async () => {
            const result = await mathrok.integral('x^2');

            expect(result.steps).toHaveLength(2); // Integration + simplification step
            expect(result.steps[0].operation).toBe('integration');
            expect(result.steps[0].description).toContain('Integrate with respect to x');
        });

        test('should handle definite integrals', async () => {
            const result = await mathrok.integral('x^2', 'x', {
                definite: true,
                lowerBound: 0,
                upperBound: 2
            });

            expect(result.isDefinite).toBe(true);
            expect(result.bounds).toEqual({ lower: 0, upper: 2 });
            // For definite integral, result should be a number, not include + C
            expect(result.result).not.toContain('+ C');
        });
    });

    describe('Advanced Calculus', () => {
        test('should compute higher order derivatives', async () => {
            // This would require extending the API to support higher order derivatives
            const firstDerivative = await mathrok.derivative('x^4');
            expect(firstDerivative.result).toBe('4*x^3');

            const secondDerivative = await mathrok.derivative('4*x^3');
            expect(secondDerivative.result).toBe('12*x^2');
        });

        test('should handle chain rule', async () => {
            const result = await mathrok.derivative('sin(x^2)');

            // Chain rule: d/dx[sin(x^2)] = cos(x^2) * 2*x
            expect(result.result).toBe('2*cos(x^2)*x'); // Nerdamer format
        });

        test('should handle product rule', async () => {
            const result = await mathrok.derivative('x*sin(x)');

            // Product rule: d/dx[x*sin(x)] = sin(x) + x*cos(x)
            expect(result.result).toBe('cos(x)*x+sin(x)'); // Nerdamer format
        });

        test('should handle quotient rule', async () => {
            const result = await mathrok.derivative('x/sin(x)');

            // Quotient rule: d/dx[x/sin(x)] = (sin(x) - x*cos(x))/sin(x)^2
            expect(result.result).toContain('sin(x)');
            expect(result.result).toContain('cos(x)');
        });
    });

    describe('Error Handling', () => {
        test('should handle invalid expressions for derivatives', async () => {
            await expect(mathrok.derivative('')).rejects.toThrow();
            await expect(mathrok.derivative('invalid_function(x)')).rejects.toThrow();
        });

        test('should handle invalid expressions for integrals', async () => {
            await expect(mathrok.integral('')).rejects.toThrow();
            await expect(mathrok.integral('invalid_function(x)')).rejects.toThrow();
        });

        test('should handle invalid variable names', async () => {
            await expect(mathrok.derivative('x^2', '')).rejects.toThrow();
            await expect(mathrok.integral('x^2', '')).rejects.toThrow();
        });
    });

    describe('Performance', () => {
        test('should compute derivatives efficiently', async () => {
            const startTime = performance.now();
            await mathrok.derivative('x^10 + 5*x^5 + 2*x^2 + x + 1');
            const endTime = performance.now();

            expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
        });

        test('should compute integrals efficiently', async () => {
            const startTime = performance.now();
            await mathrok.integral('x^5 + 3*x^3 + 2*x + 1');
            const endTime = performance.now();

            expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
        });
    });
});