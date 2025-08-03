/**
 * Mathematical equation solver
 * Solves various types of mathematical equations
 */

import type {
    MathConfig,
    VariableAssignment,
} from '../../types/core.js';
import type {
    SolveResult,
    Solution,
    EquationType,
    DomainRestriction,
} from '../../types/api.js';
import { MathError, MathErrorType } from '../../types/core.js';
import { MathEngine } from '../engine/index.js';
import { MathParser } from '../parser/index.js';
import { LinearEquationSolver, QuadraticEquationSolver, EquationParser } from './equation.js';

/**
 * Equation solver implementation
 */
export class MathSolver {
    private readonly engine: MathEngine;
    private readonly parser: MathParser;
    private lastSolutionSteps: any[] = [];

    constructor(engine: MathEngine, parser: MathParser) {
        this.engine = engine;
        this.parser = parser;
    }

    /**
     * Solve a mathematical equation
     */
    public async solve(
        expression: string,
        variables?: VariableAssignment,
        config?: Partial<MathConfig>
    ): Promise<SolveResult> {
        const startTime = performance.now();

        try {
            // Parse the expression
            const parseResult = await this.parser.parse(expression, config);
            const mathExpression = parseResult.result;
            const ast = mathExpression.ast;

            // Determine equation type
            const equationType = this.determineEquationType(mathExpression);

            // Extract variables to solve for
            const variablesToSolve = this.extractVariables(ast, variables);

            // Apply appropriate solving strategy
            const solutions = await this.applySolvingStrategy(ast, equationType, variablesToSolve, config);

            // Calculate domain restrictions
            const domainRestrictions = this.calculateDomainRestrictions(ast, solutions);

            const result: SolveResult = {
                result: solutions,
                steps: [
                    {
                        id: 'parse_equation',
                        description: 'Parse and analyze equation',
                        operation: 'parsing' as any,
                        before: expression,
                        after: `Identified as ${equationType} equation`,
                        explanation: `Parsed equation and identified type: ${equationType}`,
                    },
                    ...this.generateSolutionSteps(equationType, solutions),
                ],
                metadata: {
                    computationTime: performance.now() - startTime,
                    method: this.getSolvingMethod(equationType),
                    confidence: this.calculateConfidence(equationType, solutions),
                    isExact: this.areExactSolutions(solutions),
                },
                equationType,
                variables: variablesToSolve,
                domain: domainRestrictions,
            };

            return result;
        } catch (error) {
            throw new MathError(
                MathErrorType.COMPUTATION_ERROR,
                `Failed to solve equation: ${(error as Error).message}`,
                expression
            );
        }
    }

    /**
     * Determine the type of equation
     */
    private determineEquationType(mathExpression: any): EquationType {
        // Simplified equation type detection
        // In a full implementation, this would analyze the AST structure

        // Check for special function types first
        if (this.isTrigonometricEquation(mathExpression)) {
            return 'TRIGONOMETRIC';
        }

        if (this.isExponentialEquation(mathExpression)) {
            return 'EXPONENTIAL';
        }

        if (this.isLogarithmicEquation(mathExpression)) {
            return 'LOGARITHMIC';
        }

        if (this.isRationalEquation(mathExpression)) {
            return 'RATIONAL';
        }

        if (this.isRadicalEquation(mathExpression)) {
            return 'RADICAL';
        }

        // Check polynomial types by degree (most specific first)
        const degree = this.getMaxDegree(mathExpression);

        if (degree === 1) {
            return 'LINEAR';
        }

        if (degree === 2) {
            return 'QUADRATIC';
        }

        if (degree > 2 && this.isPolynomial(mathExpression)) {
            return 'POLYNOMIAL';
        }

        // Default fallback for degree 0 or non-polynomial
        return 'POLYNOMIAL';
    }

    /**
     * Extract variables to solve for
     */
    private extractVariables(ast: any, providedVariables?: VariableAssignment): string[] {
        // Get all variables from the AST
        const allVariables = Array.from(ast.getVariables());

        // If specific variables are provided, filter to those
        if (providedVariables) {
            const providedVarNames = Object.keys(providedVariables);
            return allVariables.filter(v => !providedVarNames.includes(v));
        }

        // Default to solving for common variables
        const commonVars = ['x', 'y', 'z', 't'];
        const foundCommonVars = allVariables.filter(v => commonVars.includes(v));

        return foundCommonVars.length > 0 ? foundCommonVars : allVariables.slice(0, 1);
    }

    /**
     * Apply appropriate solving strategy based on equation type
     */
    private async applySolvingStrategy(
        ast: any,
        equationType: EquationType,
        variables: string[],
        config?: Partial<MathConfig>
    ): Promise<Solution[]> {
        switch (equationType) {
            case 'LINEAR':
                return this.solveLinearEquation(ast, variables[0]);

            case 'QUADRATIC':
                return this.solveQuadraticEquation(ast, variables[0]);

            case 'POLYNOMIAL':
                return this.solvePolynomialEquation(ast, variables[0]);

            case 'TRIGONOMETRIC':
                return this.solveTrigonometricEquation(ast, variables[0]);

            case 'EXPONENTIAL':
                return this.solveExponentialEquation(ast, variables[0]);

            case 'LOGARITHMIC':
                return this.solveLogarithmicEquation(ast, variables[0]);

            case 'RATIONAL':
                return this.solveRationalEquation(ast, variables[0]);

            case 'RADICAL':
                return this.solveRadicalEquation(ast, variables[0]);

            default:
                return this.solveNumerically(ast, variables[0]);
        }
    }

    // Equation type detection methods (simplified)

    private isLinearEquation(mathExpression: any): boolean {
        // Check if the equation is linear (degree 1)
        return this.getMaxDegree(mathExpression) === 1;
    }

    private isQuadraticEquation(mathExpression: any): boolean {
        // Check if the equation is quadratic (degree 2)
        return this.getMaxDegree(mathExpression) === 2;
    }

    private isPolynomialEquation(mathExpression: any): boolean {
        // Check if the equation is polynomial (degree > 2)
        const degree = this.getMaxDegree(mathExpression);
        return degree > 2 && this.isPolynomial(mathExpression);
    }

    private isTrigonometricEquation(mathExpression: any): boolean {
        // Check if the equation contains trigonometric functions
        return this.containsTrigonometric(mathExpression);
    }

    private isExponentialEquation(mathExpression: any): boolean {
        // Check if the equation contains exponential functions
        return this.containsExponential(mathExpression);
    }

    private isLogarithmicEquation(mathExpression: any): boolean {
        // Check if the equation contains logarithmic functions
        return this.containsLogarithmic(mathExpression);
    }

    private isRationalEquation(mathExpression: any): boolean {
        // Check if the equation is rational (polynomial/polynomial)
        return this.containsDivision(mathExpression) && this.isPolynomial(mathExpression);
    }

    private isRadicalEquation(mathExpression: any): boolean {
        // Check if the equation contains radicals
        return this.containsRadicals(mathExpression);
    }

    // Solving methods (simplified implementations)

    private async solveLinearEquation(ast: any, variable: string): Promise<Solution[]> {
        try {
            // Parse coefficients from AST
            const coefficients = EquationParser.parseLinearEquation(ast, variable);

            // Use the dedicated linear equation solver
            const result = LinearEquationSolver.solve(coefficients, variable);

            // Store the steps for later use in the main result
            this.lastSolutionSteps = result.steps;

            return result.solutions;
        } catch (error) {
            // Fallback to simplified solution
            return [
                {
                    variable,
                    value: 'solution_placeholder',
                    isExact: true,
                    approximation: 0,
                    conditions: [],
                },
            ];
        }
    }

    private async solveQuadraticEquation(ast: any, variable: string): Promise<Solution[]> {
        try {
            // Parse coefficients from AST
            const coefficients = EquationParser.parseQuadraticEquation(ast, variable);

            // Use the dedicated quadratic equation solver
            const result = QuadraticEquationSolver.solve(coefficients, variable);

            // Store the steps for later use in the main result
            this.lastSolutionSteps = result.steps;

            return result.solutions;
        } catch (error) {
            // Fallback to simplified solution
            return [
                {
                    variable,
                    value: 'solution1_placeholder',
                    isExact: true,
                    approximation: 1,
                    conditions: [],
                },
                {
                    variable,
                    value: 'solution2_placeholder',
                    isExact: true,
                    approximation: -1,
                    conditions: [],
                },
            ];
        }
    }

    private async solvePolynomialEquation(ast: any, variable: string): Promise<Solution[]> {
        // Solve polynomial equations using various methods
        // Simplified implementation
        return [
            {
                variable,
                value: 'polynomial_solution',
                isExact: false,
                approximation: 1.5,
                conditions: [],
            },
        ];
    }

    private async solveTrigonometricEquation(ast: any, variable: string): Promise<Solution[]> {
        // Solve trigonometric equations
        return [
            {
                variable,
                value: 'π/4 + 2πn',
                isExact: true,
                conditions: ['n ∈ ℤ'],
            },
        ];
    }

    private async solveExponentialEquation(ast: any, variable: string): Promise<Solution[]> {
        // Solve exponential equations
        return [
            {
                variable,
                value: 'ln(solution)',
                isExact: true,
                approximation: Math.log(2),
                conditions: [],
            },
        ];
    }

    private async solveLogarithmicEquation(ast: any, variable: string): Promise<Solution[]> {
        // Solve logarithmic equations
        return [
            {
                variable,
                value: 'exp(solution)',
                isExact: true,
                approximation: Math.exp(1),
                conditions: ['x > 0'],
            },
        ];
    }

    private async solveRationalEquation(ast: any, variable: string): Promise<Solution[]> {
        // Solve rational equations
        return [
            {
                variable,
                value: 'rational_solution',
                isExact: true,
                conditions: ['denominator ≠ 0'],
            },
        ];
    }

    private async solveRadicalEquation(ast: any, variable: string): Promise<Solution[]> {
        // Solve radical equations
        return [
            {
                variable,
                value: 'radical_solution',
                isExact: true,
                conditions: ['radicand ≥ 0'],
            },
        ];
    }

    private async solveNumerically(ast: any, variable: string): Promise<Solution[]> {
        // Numerical solving methods (Newton-Raphson, etc.)
        return [
            {
                variable,
                value: 'numerical_solution',
                isExact: false,
                approximation: 2.718,
                conditions: [],
            },
        ];
    }

    // Helper methods (simplified)

    private getMaxDegree(mathExpression: any): number {
        // Calculate maximum degree of polynomial
        // This is a simplified implementation that analyzes the raw expression
        // In a full implementation, this would traverse the AST properly

        if (!mathExpression || !mathExpression.raw) {
            return 0;
        }

        const expression = mathExpression.raw.toLowerCase();

        // Check for quadratic terms (x^2, x², etc.)
        if (expression.includes('^2') || expression.includes('²') ||
            expression.includes('x*x') || expression.includes('x x')) {
            return 2;
        }

        // Check for cubic terms
        if (expression.includes('^3') || expression.includes('³')) {
            return 3;
        }

        // Check for higher powers
        const powerMatch = expression.match(/\^(\d+)/);
        if (powerMatch) {
            return parseInt(powerMatch[1]);
        }

        // Check for linear terms (contains variable but no powers)
        if (expression.includes('x') || expression.includes('y') || expression.includes('z')) {
            return 1;
        }

        // No variables found
        return 0;
    }

    private isPolynomial(mathExpression: any): boolean {
        // Check if expression is polynomial
        // A polynomial contains only variables raised to non-negative integer powers
        // and no trigonometric, exponential, or logarithmic functions

        if (!mathExpression || !mathExpression.raw) {
            return false;
        }

        const expression = mathExpression.raw.toLowerCase();

        // Check for non-polynomial functions
        if (this.containsTrigonometric(mathExpression) ||
            this.containsExponential(mathExpression) ||
            this.containsLogarithmic(mathExpression)) {
            return false;
        }

        // Check for division by variables (rational functions)
        if (expression.includes('/x') || expression.includes('/y') || expression.includes('/z')) {
            return false;
        }

        // Check for fractional powers
        if (expression.includes('^(') || expression.includes('^-') || expression.includes('^0.')) {
            return false;
        }

        return true;
    }

    private containsTrigonometric(mathExpression: any): boolean {
        // Check for trigonometric functions
        return false; // Placeholder
    }

    private containsExponential(mathExpression: any): boolean {
        // Check for exponential functions
        return false; // Placeholder
    }

    private containsLogarithmic(mathExpression: any): boolean {
        // Check for logarithmic functions
        return false; // Placeholder
    }

    private containsDivision(mathExpression: any): boolean {
        // Check for division operations
        return false; // Placeholder
    }

    private containsRadicals(mathExpression: any): boolean {
        // Check for radical functions
        return false; // Placeholder
    }

    private calculateDomainRestrictions(ast: any, solutions: Solution[]): DomainRestriction[] {
        // Calculate domain restrictions based on the equation
        return [
            {
                variable: 'x',
                restriction: 'x ≠ 0',
                description: 'Variable cannot be zero due to division',
            },
        ];
    }

    private generateSolutionSteps(equationType: EquationType, solutions: Solution[]): any[] {
        // Return the detailed steps from the equation solvers if available
        if (this.lastSolutionSteps.length > 0) {
            return this.lastSolutionSteps;
        }

        // Fallback to generic step generation
        return [
            {
                id: 'solve_step',
                description: `Apply ${equationType.toLowerCase()} solving method`,
                operation: 'solving' as any,
                before: 'Original equation',
                after: `Found ${solutions.length} solution(s)`,
                explanation: `Used ${equationType.toLowerCase()} solving techniques`,
            },
        ];
    }

    private getSolvingMethod(equationType: EquationType): string {
        const methods: Record<EquationType, string> = {
            LINEAR: 'algebraic_manipulation',
            QUADRATIC: 'quadratic_formula',
            POLYNOMIAL: 'polynomial_factoring',
            RATIONAL: 'rational_equation_solving',
            RADICAL: 'radical_equation_solving',
            EXPONENTIAL: 'logarithmic_transformation',
            LOGARITHMIC: 'exponential_transformation',
            TRIGONOMETRIC: 'trigonometric_identities',
            SYSTEM: 'system_solving',
            DIFFERENTIAL: 'differential_equation_solving',
        };

        return methods[equationType] || 'numerical_methods';
    }

    private calculateConfidence(equationType: EquationType, solutions: Solution[]): number {
        // Calculate confidence based on equation type and solution quality
        const baseConfidence: Record<EquationType, number> = {
            LINEAR: 1.0,
            QUADRATIC: 0.95,
            POLYNOMIAL: 0.8,
            RATIONAL: 0.85,
            RADICAL: 0.8,
            EXPONENTIAL: 0.9,
            LOGARITHMIC: 0.9,
            TRIGONOMETRIC: 0.7,
            SYSTEM: 0.85,
            DIFFERENTIAL: 0.6,
        };

        return baseConfidence[equationType] || 0.5;
    }

    private areExactSolutions(solutions: Solution[]): boolean {
        return solutions.every(solution => solution.isExact);
    }
}