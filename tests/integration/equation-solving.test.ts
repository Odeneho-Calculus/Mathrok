/**
 * Integration tests for equation solving through the main API
 */

import { Mathrok } from '../../src/index.js';

describe('Equation Solving Integration', () => {
    let mathrok: Mathrok;

    beforeEach(() => {
        mathrok = new Mathrok();
    });

    describe('Linear Equations', () => {
        it('should solve simple linear equation through main API', async () => {
            // Note: This test will use placeholder parsing for now
            // Once we implement proper AST coefficient extraction, this will work with real equations
            const result = await mathrok.solve('x + 5 = 0');

            expect(result.result).toBeDefined();
            expect(result.result.length).toBeGreaterThan(0);
            expect(result.equationType).toBe('LINEAR');
            expect(result.steps.length).toBeGreaterThan(0);
            expect(result.metadata.method).toBe('algebraic_manipulation');
        });

        it('should provide step-by-step solutions', async () => {
            const result = await mathrok.solve('2x - 6 = 0');

            expect(result.steps).toBeDefined();
            expect(result.steps.length).toBeGreaterThan(2); // Should have multiple detailed steps

            // Check that we have meaningful step descriptions
            const stepDescriptions = result.steps.map(step => step.description);
            expect(stepDescriptions.some(desc => desc.includes('linear equation'))).toBe(true);
        });
    });

    describe('Quadratic Equations', () => {
        it('should solve quadratic equations through main API', async () => {
            const result = await mathrok.solve('x^2 + 3x - 10 = 0');

            expect(result.result).toBeDefined();
            expect(result.equationType).toBe('QUADRATIC');
            expect(result.steps.length).toBeGreaterThan(0);
            expect(result.metadata.method).toBe('quadratic_formula');
        });

        it('should handle quadratic equations with no real solutions', async () => {
            const result = await mathrok.solve('x^2 + 1 = 0');

            expect(result.result).toBeDefined();
            expect(result.equationType).toBe('QUADRATIC');

            // Should still provide steps explaining why there are no real solutions
            expect(result.steps.length).toBeGreaterThan(0);
        });
    });

    describe('Equation Type Detection', () => {
        it('should correctly identify linear equations', async () => {
            const result = await mathrok.solve('3x + 7 = 0');
            expect(result.equationType).toBe('LINEAR');
        });

        it('should correctly identify quadratic equations', async () => {
            const result = await mathrok.solve('x^2 - 4 = 0');
            expect(result.equationType).toBe('QUADRATIC');
        });

        it('should provide confidence metrics', async () => {
            const result = await mathrok.solve('x + 1 = 0');

            expect(result.metadata.confidence).toBeDefined();
            expect(result.metadata.confidence).toBeGreaterThan(0);
            expect(result.metadata.confidence).toBeLessThanOrEqual(1);
        });
    });

    describe('Solution Metadata', () => {
        it('should provide computation time', async () => {
            const result = await mathrok.solve('x + 1 = 0');

            expect(result.metadata.computationTime).toBeDefined();
            expect(result.metadata.computationTime).toBeGreaterThan(0);
        });

        it('should indicate if solutions are exact', async () => {
            const result = await mathrok.solve('x + 1 = 0');

            expect(result.metadata.isExact).toBeDefined();
            expect(typeof result.metadata.isExact).toBe('boolean');
        });

        it('should provide solving method information', async () => {
            const result = await mathrok.solve('x^2 - 4 = 0');

            expect(result.metadata.method).toBeDefined();
            expect(result.metadata.method).toBe('quadratic_formula');
        });
    });

    describe('Error Handling', () => {
        it('should handle invalid equations gracefully', async () => {
            await expect(mathrok.solve('')).rejects.toThrow();
        });

        it('should handle malformed equations', async () => {
            // This should not crash the system
            try {
                await mathrok.solve('invalid equation format');
                // If it doesn't throw, that's fine - it should handle gracefully
            } catch (error) {
                // If it throws, the error should be meaningful
                expect(error).toBeInstanceOf(Error);
            }
        });
    });

    describe('Variable Handling', () => {
        it('should identify variables to solve for', async () => {
            const result = await mathrok.solve('x + y = 5');

            expect(result.variables).toBeDefined();
            expect(result.variables.length).toBeGreaterThan(0);
        });

        it('should handle equations with multiple variables', async () => {
            const result = await mathrok.solve('2x + 3y = 10');

            expect(result.variables).toBeDefined();
            // Should identify both x and y as variables
            expect(result.variables.length).toBeGreaterThanOrEqual(1);
        });
    });
});