/**
 * Advanced equation solving algorithms
 * Implements various equation solving strategies with step-by-step solutions
 */

import type { Solution, SolutionStep } from '../../types/api.js';
import { MathError, MathErrorType } from '../../types/core.js';

/**
 * Linear equation solver: ax + b = 0
 */
export class LinearEquationSolver {
    /**
     * Solve linear equation of the form ax + b = 0
     * @param coefficients - Object containing coefficients {a, b}
     * @param variable - Variable name to solve for
     * @returns Solution with steps
     */
    public static solve(coefficients: { a: number; b: number }, variable: string): {
        solutions: Solution[];
        steps: SolutionStep[];
    } {
        const { a, b } = coefficients;
        const steps: SolutionStep[] = [];

        // Step 1: Identify equation form
        steps.push({
            id: 'identify_form',
            description: `Identify linear equation form: ${a}${variable} + ${b} = 0`,
            operation: 'identification' as any,
            before: `${a}${variable} + ${b} = 0`,
            after: `Linear equation in standard form`,
            explanation: `This is a linear equation with coefficient a = ${a} and constant b = ${b}`,
        });

        // Check for special cases
        if (a === 0) {
            if (b === 0) {
                // 0 = 0, infinite solutions
                steps.push({
                    id: 'infinite_solutions',
                    description: 'Equation simplifies to 0 = 0',
                    operation: 'simplification' as any,
                    before: `0 + ${b} = 0`,
                    after: '0 = 0',
                    explanation: 'This equation is always true, so there are infinite solutions',
                });

                return {
                    solutions: [{
                        variable,
                        value: 'all real numbers',
                        isExact: true,
                        conditions: ['x ∈ ℝ'],
                    }],
                    steps,
                };
            } else {
                // 0 + b = 0 where b ≠ 0, no solution
                steps.push({
                    id: 'no_solution',
                    description: `Equation simplifies to ${b} = 0`,
                    operation: 'simplification' as any,
                    before: `0 + ${b} = 0`,
                    after: `${b} = 0`,
                    explanation: `This equation is never true since ${b} ≠ 0, so there is no solution`,
                });

                return {
                    solutions: [],
                    steps,
                };
            }
        }

        // Step 2: Isolate the variable term
        steps.push({
            id: 'isolate_variable_term',
            description: `Subtract ${b} from both sides`,
            operation: 'algebraic_manipulation' as any,
            before: `${a}${variable} + ${b} = 0`,
            after: `${a}${variable} = ${-b}`,
            explanation: `Subtract ${b} from both sides to isolate the variable term`,
        });

        // Step 3: Solve for the variable
        const solution = -b / a;
        steps.push({
            id: 'solve_for_variable',
            description: `Divide both sides by ${a}`,
            operation: 'algebraic_manipulation' as any,
            before: `${a}${variable} = ${-b}`,
            after: `${variable} = ${solution}`,
            explanation: `Divide both sides by ${a} to solve for ${variable}`,
        });

        // Step 4: Verify solution
        const verification = a * solution + b;
        steps.push({
            id: 'verify_solution',
            description: 'Verify the solution',
            operation: 'verification' as any,
            before: `${variable} = ${solution}`,
            after: `${a}(${solution}) + ${b} = ${verification}`,
            explanation: `Substitute ${variable} = ${solution} back into the original equation to verify`,
        });

        return {
            solutions: [{
                variable,
                value: solution.toString(),
                isExact: Number.isInteger(solution) || this.isSimpleFraction(-b, a),
                approximation: solution,
                conditions: [],
            }],
            steps,
        };
    }

    /**
     * Check if a fraction is in simple form
     */
    private static isSimpleFraction(numerator: number, denominator: number): boolean {
        return Number.isInteger(numerator) && Number.isInteger(denominator) && denominator !== 0;
    }
}

/**
 * Quadratic equation solver: ax² + bx + c = 0
 */
export class QuadraticEquationSolver {
    /**
     * Solve quadratic equation using the quadratic formula
     * @param coefficients - Object containing coefficients {a, b, c}
     * @param variable - Variable name to solve for
     * @returns Solution with steps
     */
    public static solve(coefficients: { a: number; b: number; c: number }, variable: string): {
        solutions: Solution[];
        steps: SolutionStep[];
    } {
        const { a, b, c } = coefficients;
        const steps: SolutionStep[] = [];

        // Step 1: Identify equation form
        steps.push({
            id: 'identify_quadratic',
            description: `Identify quadratic equation: ${a}${variable}² + ${b}${variable} + ${c} = 0`,
            operation: 'identification' as any,
            before: `${a}${variable}² + ${b}${variable} + ${c} = 0`,
            after: `Quadratic equation in standard form`,
            explanation: `This is a quadratic equation with a = ${a}, b = ${b}, c = ${c}`,
        });

        // Check if it's actually linear (a = 0)
        if (a === 0) {
            steps.push({
                id: 'reduce_to_linear',
                description: 'Coefficient of x² is 0, reducing to linear equation',
                operation: 'simplification' as any,
                before: `0${variable}² + ${b}${variable} + ${c} = 0`,
                after: `${b}${variable} + ${c} = 0`,
                explanation: 'Since a = 0, this reduces to a linear equation',
            });

            const linearResult = LinearEquationSolver.solve({ a: b, b: c }, variable);
            return {
                solutions: linearResult.solutions,
                steps: [...steps, ...linearResult.steps],
            };
        }

        // Step 2: Calculate discriminant
        const discriminant = b * b - 4 * a * c;
        steps.push({
            id: 'calculate_discriminant',
            description: 'Calculate discriminant Δ = b² - 4ac',
            operation: 'calculation' as any,
            before: `Δ = ${b}² - 4(${a})(${c})`,
            after: `Δ = ${discriminant}`,
            explanation: `The discriminant determines the nature of the roots: Δ = ${b}² - 4(${a})(${c}) = ${discriminant}`,
        });

        // Step 3: Analyze discriminant and solve
        if (discriminant < 0) {
            steps.push({
                id: 'no_real_solutions',
                description: 'Discriminant is negative',
                operation: 'analysis' as any,
                before: `Δ = ${discriminant} < 0`,
                after: 'No real solutions',
                explanation: 'Since the discriminant is negative, there are no real solutions (complex solutions exist)',
            });

            return {
                solutions: [],
                steps,
            };
        } else if (discriminant === 0) {
            // One repeated root
            const solution = -b / (2 * a);
            steps.push({
                id: 'one_repeated_root',
                description: 'Discriminant is zero - one repeated root',
                operation: 'analysis' as any,
                before: `Δ = 0`,
                after: 'One repeated root',
                explanation: 'Since the discriminant is zero, there is one repeated root',
            });

            steps.push({
                id: 'calculate_repeated_root',
                description: 'Calculate the repeated root using x = -b/(2a)',
                operation: 'calculation' as any,
                before: `${variable} = -${b}/(2·${a})`,
                after: `${variable} = ${solution}`,
                explanation: `Using the quadratic formula with Δ = 0: ${variable} = -${b}/(2·${a}) = ${solution}`,
            });

            return {
                solutions: [{
                    variable,
                    value: solution.toString(),
                    isExact: Number.isInteger(solution) || this.isSimpleFraction(-b, 2 * a),
                    approximation: solution,
                    conditions: [],
                    multiplicity: 2,
                }],
                steps,
            };
        } else {
            // Two distinct real roots
            const sqrtDiscriminant = Math.sqrt(discriminant);
            const solution1 = (-b + sqrtDiscriminant) / (2 * a);
            const solution2 = (-b - sqrtDiscriminant) / (2 * a);

            steps.push({
                id: 'two_distinct_roots',
                description: 'Discriminant is positive - two distinct real roots',
                operation: 'analysis' as any,
                before: `Δ = ${discriminant} > 0`,
                after: 'Two distinct real roots',
                explanation: 'Since the discriminant is positive, there are two distinct real roots',
            });

            steps.push({
                id: 'apply_quadratic_formula',
                description: 'Apply quadratic formula: x = (-b ± √Δ)/(2a)',
                operation: 'calculation' as any,
                before: `${variable} = (-${b} ± √${discriminant})/(2·${a})`,
                after: `${variable} = ${solution1} or ${variable} = ${solution2}`,
                explanation: `Using the quadratic formula: ${variable} = (-${b} ± √${discriminant})/(2·${a})`,
            });

            return {
                solutions: [
                    {
                        variable,
                        value: solution1.toString(),
                        isExact: this.isPerfectSquare(discriminant) && this.isSimpleFraction(-b + sqrtDiscriminant, 2 * a),
                        approximation: solution1,
                        conditions: [],
                    },
                    {
                        variable,
                        value: solution2.toString(),
                        isExact: this.isPerfectSquare(discriminant) && this.isSimpleFraction(-b - sqrtDiscriminant, 2 * a),
                        approximation: solution2,
                        conditions: [],
                    },
                ],
                steps,
            };
        }
    }

    /**
     * Check if a number is a perfect square
     */
    private static isPerfectSquare(n: number): boolean {
        if (n < 0) return false;
        const sqrt = Math.sqrt(n);
        return Number.isInteger(sqrt);
    }

    /**
     * Check if a fraction is in simple form
     */
    private static isSimpleFraction(numerator: number, denominator: number): boolean {
        return Number.isInteger(numerator) && Number.isInteger(denominator) && denominator !== 0;
    }
}

/**
 * Equation parser - extracts coefficients from AST
 */
export class EquationParser {
    /**
     * Parse linear equation from AST to extract coefficients
     * Handles equations of the form ax + b = c or ax + b = cx + d
     */
    public static parseLinearEquation(ast: any, variable: string): { a: number; b: number } {
        // This is a simplified implementation
        // In a full implementation, this would traverse the AST to extract coefficients

        // For now, return default coefficients for testing
        // This should be replaced with proper AST analysis
        return { a: 1, b: 0 };
    }

    /**
     * Parse quadratic equation from AST to extract coefficients
     * Handles equations of the form ax² + bx + c = 0
     */
    public static parseQuadraticEquation(ast: any, variable: string): { a: number; b: number; c: number } {
        // This is a simplified implementation
        // In a full implementation, this would traverse the AST to extract coefficients

        // For now, return default coefficients for testing
        // This should be replaced with proper AST analysis
        return { a: 1, b: 0, c: 0 };
    }

    /**
     * Determine if an equation is linear
     */
    public static isLinear(ast: any, variable: string): boolean {
        // Simplified check - in reality would analyze AST structure
        // Check if the highest power of the variable is 1
        return true; // Placeholder
    }

    /**
     * Determine if an equation is quadratic
     */
    public static isQuadratic(ast: any, variable: string): boolean {
        // Simplified check - in reality would analyze AST structure
        // Check if the highest power of the variable is 2
        return false; // Placeholder
    }
}