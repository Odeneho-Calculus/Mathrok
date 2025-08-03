/**
 * Tests for equation solving functionality
 */

import { LinearEquationSolver, QuadraticEquationSolver } from '../../../src/core/solver/equation.js';

describe('Equation Solvers', () => {
    describe('LinearEquationSolver', () => {
        it('should solve simple linear equation: x + 5 = 0', () => {
            const result = LinearEquationSolver.solve({ a: 1, b: 5 }, 'x');

            expect(result.solutions).toHaveLength(1);
            expect(result.solutions[0].variable).toBe('x');
            expect(result.solutions[0].value).toBe('-5');
            expect(result.solutions[0].approximation).toBe(-5);
            expect(result.solutions[0].isExact).toBe(true);

            expect(result.steps.length).toBeGreaterThan(0);
            expect(result.steps[0].description).toContain('linear equation');
        });

        it('should solve linear equation: 2x - 6 = 0', () => {
            const result = LinearEquationSolver.solve({ a: 2, b: -6 }, 'x');

            expect(result.solutions).toHaveLength(1);
            expect(result.solutions[0].value).toBe('3');
            expect(result.solutions[0].approximation).toBe(3);
        });

        it('should handle equation with no solution: 0x + 5 = 0', () => {
            const result = LinearEquationSolver.solve({ a: 0, b: 5 }, 'x');

            expect(result.solutions).toHaveLength(0);
            expect(result.steps.some(step => step.id === 'no_solution')).toBe(true);
        });

        it('should handle equation with infinite solutions: 0x + 0 = 0', () => {
            const result = LinearEquationSolver.solve({ a: 0, b: 0 }, 'x');

            expect(result.solutions).toHaveLength(1);
            expect(result.solutions[0].value).toBe('all real numbers');
            expect(result.steps.some(step => step.id === 'infinite_solutions')).toBe(true);
        });

        it('should handle fractional solutions: 3x + 2 = 0', () => {
            const result = LinearEquationSolver.solve({ a: 3, b: 2 }, 'x');

            expect(result.solutions).toHaveLength(1);
            expect(result.solutions[0].approximation).toBeCloseTo(-2 / 3);
            expect(result.solutions[0].isExact).toBe(true); // Should be exact for simple fractions
        });
    });

    describe('QuadraticEquationSolver', () => {
        it('should solve simple quadratic: x² - 4 = 0', () => {
            const result = QuadraticEquationSolver.solve({ a: 1, b: 0, c: -4 }, 'x');

            expect(result.solutions).toHaveLength(2);
            expect(result.solutions[0].approximation).toBe(2);
            expect(result.solutions[1].approximation).toBe(-2);

            expect(result.steps.some(step => step.id === 'two_distinct_roots')).toBe(true);
        });

        it('should solve quadratic with repeated root: x² - 4x + 4 = 0', () => {
            const result = QuadraticEquationSolver.solve({ a: 1, b: -4, c: 4 }, 'x');

            expect(result.solutions).toHaveLength(1);
            expect(result.solutions[0].approximation).toBe(2);
            expect(result.solutions[0].multiplicity).toBe(2);

            expect(result.steps.some(step => step.id === 'one_repeated_root')).toBe(true);
        });

        it('should handle quadratic with no real solutions: x² + 1 = 0', () => {
            const result = QuadraticEquationSolver.solve({ a: 1, b: 0, c: 1 }, 'x');

            expect(result.solutions).toHaveLength(0);
            expect(result.steps.some(step => step.id === 'no_real_solutions')).toBe(true);
        });

        it('should reduce to linear when a = 0: 0x² + 2x + 4 = 0', () => {
            const result = QuadraticEquationSolver.solve({ a: 0, b: 2, c: 4 }, 'x');

            expect(result.solutions).toHaveLength(1);
            expect(result.solutions[0].approximation).toBe(-2);
            expect(result.steps.some(step => step.id === 'reduce_to_linear')).toBe(true);
        });

        it('should solve general quadratic: x² + 3x - 10 = 0', () => {
            const result = QuadraticEquationSolver.solve({ a: 1, b: 3, c: -10 }, 'x');

            expect(result.solutions).toHaveLength(2);

            // Solutions should be x = 2 and x = -5
            const solutions = result.solutions.map(s => s.approximation).sort((a, b) => a - b);
            expect(solutions[0]).toBeCloseTo(-5);
            expect(solutions[1]).toBeCloseTo(2);
        });

        it('should calculate discriminant correctly', () => {
            const result = QuadraticEquationSolver.solve({ a: 1, b: 2, c: 1 }, 'x');

            // Discriminant = 4 - 4 = 0, so one repeated root
            expect(result.solutions).toHaveLength(1);
            expect(result.steps.some(step => step.description.includes('Discriminant is zero'))).toBe(true);
        });
    });
});