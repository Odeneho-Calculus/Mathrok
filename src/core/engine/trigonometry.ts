/**
 * Advanced Trigonometry Operations Engine
 * Handles trigonometric functions, identities, and equation solving
 */

import type {
    MathConfig,
    MathResult,
    SolutionStep,
    VariableAssignment,
} from '../../types/core.js';
import { MathOperation } from '../../types/core.js';
import type {
    SimplifyResult,
    SolveResult,
    Solution,
    EquationType,
} from '../../types/api.js';
import { MathError, MathErrorType } from '../../types/core.js';

// Use require for Nerdamer to ensure proper module loading
const nerdamer = require('nerdamer');
require('nerdamer/Algebra');
require('nerdamer/Solve');

/**
 * Trigonometric identities and transformations
 */
interface TrigIdentity {
    name: string;
    pattern: RegExp;
    replacement: string;
    description: string;
}

/**
 * Advanced trigonometry operations engine
 */
export class TrigonometryEngine {
    private readonly config: MathConfig;
    private readonly trigIdentities: TrigIdentity[];

    constructor(config: MathConfig) {
        this.config = config;
        this.trigIdentities = this.initializeTrigIdentities();
    }

    /**
     * Simplify trigonometric expressions using identities
     */
    public async simplifyTrigonometric(
        expression: string,
        config?: Partial<MathConfig>
    ): Promise<SimplifyResult> {
        const startTime = performance.now();
        const finalConfig = { ...this.config, ...config };

        try {
            // Analyze the trigonometric expression
            const analysis = this.analyzeTrigExpression(expression);

            // Apply trigonometric identities
            const { simplified, steps, rulesApplied } = await this.applyTrigIdentities(
                expression,
                analysis
            );

            // Further simplification using Nerdamer
            const finalResult = await this.finalTrigSimplification(simplified);

            if (finalResult !== simplified) {
                steps.push({
                    id: 'final_simplification',
                    description: 'Final algebraic simplification',
                    operation: MathOperation.SIMPLIFICATION,
                    before: simplified,
                    after: finalResult,
                    explanation: 'Applied final algebraic simplification',
                });
            }

            const originalComplexity = this.calculateTrigComplexity(expression);
            const newComplexity = this.calculateTrigComplexity(finalResult);

            return {
                result: finalResult,
                steps,
                metadata: {
                    computationTime: performance.now() - startTime,
                    method: 'trigonometric_simplification',
                    confidence: 0.95,
                    isExact: true,
                },
                rulesApplied,
                complexityReduction: originalComplexity - newComplexity,
            };
        } catch (error) {
            throw new MathError(
                MathErrorType.COMPUTATION_ERROR,
                `Failed to simplify trigonometric expression: ${(error as Error).message}`,
                expression
            );
        }
    }

    /**
     * Solve trigonometric equations
     */
    public async solveTrigonometric(
        equation: string,
        variable = 'x',
        config?: Partial<MathConfig>
    ): Promise<SolveResult> {
        const startTime = performance.now();
        const finalConfig = { ...this.config, ...config };

        try {
            // Analyze the trigonometric equation
            const analysis = this.analyzeTrigEquation(equation);

            // Apply trigonometric transformations to simplify
            const { transformedEquation, transformationSteps } = await this.transformTrigEquation(
                equation,
                analysis
            );

            // Solve the transformed equation
            const solutions = await this.solveTrigEquationNumerically(
                transformedEquation,
                variable,
                analysis
            );

            // Generate comprehensive steps
            const allSteps = [
                ...transformationSteps,
                ...this.generateSolutionSteps(transformedEquation, solutions, variable),
            ];

            return {
                result: solutions,
                steps: allSteps,
                metadata: {
                    computationTime: performance.now() - startTime,
                    method: 'trigonometric_equation_solving',
                    confidence: 0.9,
                    isExact: true,
                },
                equationType: EquationType.TRIGONOMETRIC,
                variables: [variable],
                domain: this.getTrigDomainRestrictions(equation, variable),
            };
        } catch (error) {
            throw new MathError(
                MathErrorType.COMPUTATION_ERROR,
                `Failed to solve trigonometric equation: ${(error as Error).message}`,
                equation
            );
        }
    }

    /**
     * Convert between trigonometric forms (degrees/radians)
     */
    public async convertTrigUnits(
        expression: string,
        fromUnit: 'degrees' | 'radians',
        toUnit: 'degrees' | 'radians',
        config?: Partial<MathConfig>
    ): Promise<SimplifyResult> {
        const startTime = performance.now();

        try {
            let result = expression;
            const steps: SolutionStep[] = [];
            const rulesApplied: string[] = [];

            if (fromUnit !== toUnit) {
                if (fromUnit === 'degrees' && toUnit === 'radians') {
                    result = this.convertDegreesToRadians(expression);
                    rulesApplied.push('degrees_to_radians');
                    steps.push({
                        id: 'convert_to_radians',
                        description: 'Convert degrees to radians',
                        operation: MathOperation.CONVERSION,
                        before: expression,
                        after: result,
                        explanation: 'Multiplied by π/180 to convert degrees to radians',
                    });
                } else if (fromUnit === 'radians' && toUnit === 'degrees') {
                    result = this.convertRadiansToDegrees(expression);
                    rulesApplied.push('radians_to_degrees');
                    steps.push({
                        id: 'convert_to_degrees',
                        description: 'Convert radians to degrees',
                        operation: MathOperation.CONVERSION,
                        before: expression,
                        after: result,
                        explanation: 'Multiplied by 180/π to convert radians to degrees',
                    });
                }
            }

            return {
                result,
                steps,
                metadata: {
                    computationTime: performance.now() - startTime,
                    method: 'trigonometric_unit_conversion',
                    confidence: 1.0,
                    isExact: true,
                },
                rulesApplied,
                complexityReduction: 0,
            };
        } catch (error) {
            throw new MathError(
                MathErrorType.COMPUTATION_ERROR,
                `Failed to convert trigonometric units: ${(error as Error).message}`,
                expression
            );
        }
    }

    /**
     * Evaluate trigonometric functions at special angles
     */
    public async evaluateSpecialAngles(
        expression: string,
        config?: Partial<MathConfig>
    ): Promise<SimplifyResult> {
        const startTime = performance.now();

        try {
            const { result, steps } = this.evaluateAtSpecialAngles(expression);

            return {
                result,
                steps,
                metadata: {
                    computationTime: performance.now() - startTime,
                    method: 'special_angle_evaluation',
                    confidence: 1.0,
                    isExact: true,
                },
                rulesApplied: ['special_angle_values'],
                complexityReduction: expression.length - result.length,
            };
        } catch (error) {
            throw new MathError(
                MathErrorType.COMPUTATION_ERROR,
                `Failed to evaluate at special angles: ${(error as Error).message}`,
                expression
            );
        }
    }

    // Private helper methods

    private initializeTrigIdentities(): TrigIdentity[] {
        return [
            // Pythagorean identities
            {
                name: 'pythagorean_sin_cos',
                pattern: /sin\^2\(([^)]+)\)\s*\+\s*cos\^2\(([^)]+)\)/g,
                replacement: '1',
                description: 'sin²(x) + cos²(x) = 1',
            },
            {
                name: 'pythagorean_tan_sec',
                pattern: /1\s*\+\s*tan\^2\(([^)]+)\)/g,
                replacement: 'sec^2($1)',
                description: '1 + tan²(x) = sec²(x)',
            },
            {
                name: 'pythagorean_cot_csc',
                pattern: /1\s*\+\s*cot\^2\(([^)]+)\)/g,
                replacement: 'csc^2($1)',
                description: '1 + cot²(x) = csc²(x)',
            },

            // Double angle formulas
            {
                name: 'double_angle_sin',
                pattern: /sin\(2\*([^)]+)\)/g,
                replacement: '2*sin($1)*cos($1)',
                description: 'sin(2x) = 2sin(x)cos(x)',
            },
            {
                name: 'double_angle_cos',
                pattern: /cos\(2\*([^)]+)\)/g,
                replacement: 'cos^2($1) - sin^2($1)',
                description: 'cos(2x) = cos²(x) - sin²(x)',
            },

            // Sum and difference formulas
            {
                name: 'sin_sum',
                pattern: /sin\(([^)]+)\s*\+\s*([^)]+)\)/g,
                replacement: 'sin($1)*cos($2) + cos($1)*sin($2)',
                description: 'sin(A + B) = sin(A)cos(B) + cos(A)sin(B)',
            },
            {
                name: 'cos_sum',
                pattern: /cos\(([^)]+)\s*\+\s*([^)]+)\)/g,
                replacement: 'cos($1)*cos($2) - sin($1)*sin($2)',
                description: 'cos(A + B) = cos(A)cos(B) - sin(A)sin(B)',
            },

            // Reciprocal identities
            {
                name: 'sec_reciprocal',
                pattern: /sec\(([^)]+)\)/g,
                replacement: '1/cos($1)',
                description: 'sec(x) = 1/cos(x)',
            },
            {
                name: 'csc_reciprocal',
                pattern: /csc\(([^)]+)\)/g,
                replacement: '1/sin($1)',
                description: 'csc(x) = 1/sin(x)',
            },
            {
                name: 'cot_reciprocal',
                pattern: /cot\(([^)]+)\)/g,
                replacement: '1/tan($1)',
                description: 'cot(x) = 1/tan(x)',
            },
        ];
    }

    private analyzeTrigExpression(expression: string): any {
        return {
            hasSinCos: /sin|cos/.test(expression),
            hasTanCot: /tan|cot/.test(expression),
            hasSecCsc: /sec|csc/.test(expression),
            hasSquaredTerms: /\^2/.test(expression),
            hasDoubleAngles: /2\*/.test(expression),
            hasSumDifference: /\+|\-/.test(expression),
            complexity: this.calculateTrigComplexity(expression),
        };
    }

    private analyzeTrigEquation(equation: string): any {
        const [left, right] = equation.split('=').map(s => s.trim());

        return {
            leftSide: left,
            rightSide: right || '0',
            isHomogeneous: this.isHomogeneousTrigEquation(equation),
            hasMultipleAngles: this.hasMultipleAngles(equation),
            primaryFunction: this.getPrimaryTrigFunction(equation),
            degree: this.getTrigEquationDegree(equation),
        };
    }

    private async applyTrigIdentities(
        expression: string,
        analysis: any
    ): Promise<{ simplified: string; steps: SolutionStep[]; rulesApplied: string[] }> {
        let current = expression;
        const steps: SolutionStep[] = [];
        const rulesApplied: string[] = [];

        // Apply each relevant identity
        for (const identity of this.trigIdentities) {
            const before = current;
            current = current.replace(identity.pattern, identity.replacement);

            if (current !== before) {
                rulesApplied.push(identity.name);
                steps.push({
                    id: `apply_${identity.name}`,
                    description: `Apply ${identity.description}`,
                    operation: MathOperation.TRIG_IDENTITY,
                    before,
                    after: current,
                    explanation: identity.description,
                });
            }
        }

        return { simplified: current, steps, rulesApplied };
    }

    private async finalTrigSimplification(expression: string): Promise<string> {
        try {
            // Use Nerdamer for final simplification
            const simplified = nerdamer(expression).simplify();
            return simplified.toString();
        } catch (error) {
            return expression;
        }
    }

    private async transformTrigEquation(
        equation: string,
        analysis: any
    ): Promise<{ transformedEquation: string; transformationSteps: SolutionStep[] }> {
        const steps: SolutionStep[] = [];
        let transformed = equation;

        // Apply transformations based on analysis
        if (analysis.hasMultipleAngles) {
            const beforeTransform = transformed;
            transformed = this.normalizeAngles(transformed);

            if (transformed !== beforeTransform) {
                steps.push({
                    id: 'normalize_angles',
                    description: 'Normalize multiple angles',
                    operation: MathOperation.TRIG_SIMPLIFICATION,
                    before: beforeTransform,
                    after: transformed,
                    explanation: 'Converted multiple angles to single angle form',
                });
            }
        }

        if (analysis.isHomogeneous) {
            const beforeTransform = transformed;
            transformed = this.convertToHomogeneous(transformed);

            if (transformed !== beforeTransform) {
                steps.push({
                    id: 'convert_homogeneous',
                    description: 'Convert to homogeneous form',
                    operation: MathOperation.TRIG_SIMPLIFICATION,
                    before: beforeTransform,
                    after: transformed,
                    explanation: 'Converted to homogeneous trigonometric equation',
                });
            }
        }

        return { transformedEquation: transformed, transformationSteps: steps };
    }

    private async solveTrigEquationNumerically(
        equation: string,
        variable: string,
        analysis: any
    ): Promise<Solution[]> {
        try {
            // Use Nerdamer to solve the equation
            const solutions = nerdamer.solveEquations(equation, variable);

            // Convert Nerdamer solutions to our format
            const result: Solution[] = [];

            if (Array.isArray(solutions)) {
                solutions.forEach((sol, index) => {
                    result.push({
                        variable,
                        value: sol.toString(),
                        isExact: true,
                        approximation: this.evaluateNumerically(sol.toString()),
                        conditions: this.getTrigSolutionConditions(sol.toString(), analysis),
                    });
                });
            } else if (solutions) {
                result.push({
                    variable,
                    value: solutions.toString(),
                    isExact: true,
                    approximation: this.evaluateNumerically(solutions.toString()),
                    conditions: this.getTrigSolutionConditions(solutions.toString(), analysis),
                });
            }

            return result;
        } catch (error) {
            // Fallback: provide general solution form
            return [{
                variable,
                value: `General solution depends on the specific trigonometric equation`,
                isExact: false,
                conditions: ['Solution may be periodic', 'Check domain restrictions'],
            }];
        }
    }

    private generateSolutionSteps(
        equation: string,
        solutions: Solution[],
        variable: string
    ): SolutionStep[] {
        const steps: SolutionStep[] = [];

        steps.push({
            id: 'solve_trig_equation',
            description: `Solve trigonometric equation for ${variable}`,
            operation: MathOperation.ELIMINATION,
            before: equation,
            after: solutions.map(s => `${variable} = ${s.value}`).join(', '),
            explanation: 'Applied trigonometric equation solving techniques',
        });

        return steps;
    }

    private getTrigDomainRestrictions(equation: string, variable: string): any[] {
        const restrictions: any[] = [];

        // Check for functions with domain restrictions
        if (equation.includes('tan') || equation.includes('sec')) {
            restrictions.push({
                variable,
                restriction: `${variable} ≠ π/2 + nπ`,
                description: 'Tangent and secant are undefined at odd multiples of π/2',
            });
        }

        if (equation.includes('cot') || equation.includes('csc')) {
            restrictions.push({
                variable,
                restriction: `${variable} ≠ nπ`,
                description: 'Cotangent and cosecant are undefined at multiples of π',
            });
        }

        return restrictions;
    }

    private convertDegreesToRadians(expression: string): string {
        // Convert degree measures to radians
        return expression.replace(/(\d+(?:\.\d+)?)\s*°/g, '($1*π/180)');
    }

    private convertRadiansToDegrees(expression: string): string {
        // Convert radian measures to degrees
        return expression.replace(/(\d+(?:\.\d+)?)\s*π/g, '($1*180)°');
    }

    private evaluateAtSpecialAngles(expression: string): { result: string; steps: SolutionStep[] } {
        const steps: SolutionStep[] = [];
        let result = expression;

        // Special angle values (in radians)
        const specialValues: Record<string, Record<string, string>> = {
            '0': { sin: '0', cos: '1', tan: '0' },
            'π/6': { sin: '1/2', cos: '√3/2', tan: '1/√3' },
            'π/4': { sin: '√2/2', cos: '√2/2', tan: '1' },
            'π/3': { sin: '√3/2', cos: '1/2', tan: '√3' },
            'π/2': { sin: '1', cos: '0', tan: 'undefined' },
            'π': { sin: '0', cos: '-1', tan: '0' },
            '3π/2': { sin: '-1', cos: '0', tan: 'undefined' },
            '2π': { sin: '0', cos: '1', tan: '0' },
        };

        // Replace special angle values
        for (const [angle, values] of Object.entries(specialValues)) {
            for (const [func, value] of Object.entries(values)) {
                const pattern = new RegExp(`${func}\\(${angle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\)`, 'g');
                const before = result;
                result = result.replace(pattern, value);

                if (result !== before) {
                    steps.push({
                        id: `evaluate_${func}_${angle.replace(/[^a-zA-Z0-9]/g, '_')}`,
                        description: `Evaluate ${func}(${angle})`,
                        operation: MathOperation.EVALUATION,
                        before,
                        after: result,
                        explanation: `${func}(${angle}) = ${value}`,
                    });
                }
            }
        }

        return { result, steps };
    }

    private calculateTrigComplexity(expression: string): number {
        let complexity = expression.length;
        complexity += (expression.match(/sin|cos|tan|sec|csc|cot/g) || []).length * 3;
        complexity += (expression.match(/\^2/g) || []).length * 2;
        complexity += (expression.match(/[()]/g) || []).length;
        return complexity;
    }

    private isHomogeneousTrigEquation(equation: string): boolean {
        // Check if all terms have the same degree in trigonometric functions
        return /sin.*cos|cos.*sin/.test(equation) && !/\b\d+\b/.test(equation);
    }

    private hasMultipleAngles(equation: string): boolean {
        return /\d+\*[a-zA-Z]|\d+[a-zA-Z]/.test(equation);
    }

    private getPrimaryTrigFunction(equation: string): string {
        if (equation.includes('sin')) return 'sin';
        if (equation.includes('cos')) return 'cos';
        if (equation.includes('tan')) return 'tan';
        return 'unknown';
    }

    private getTrigEquationDegree(equation: string): number {
        const squaredMatches = equation.match(/\^2/g);
        return squaredMatches ? squaredMatches.length + 1 : 1;
    }

    private normalizeAngles(equation: string): string {
        // Convert multiple angles to single angle form where possible
        return equation.replace(/sin\(2\*([^)]+)\)/g, '2*sin($1)*cos($1)')
            .replace(/cos\(2\*([^)]+)\)/g, 'cos^2($1) - sin^2($1)');
    }

    private convertToHomogeneous(equation: string): string {
        // Convert to homogeneous form by replacing constants with trig identities
        return equation.replace(/\b1\b/g, 'sin^2(x) + cos^2(x)');
    }

    private evaluateNumerically(expression: string): number | undefined {
        try {
            // Simple numerical evaluation for common expressions
            if (expression === '0') return 0;
            if (expression === 'π/2') return Math.PI / 2;
            if (expression === 'π') return Math.PI;
            if (expression === '3π/2') return 3 * Math.PI / 2;
            if (expression === '2π') return 2 * Math.PI;

            // Try to evaluate with Nerdamer
            const result = nerdamer(expression).evaluate();
            return parseFloat(result.toString());
        } catch (error) {
            return undefined;
        }
    }

    private getTrigSolutionConditions(solution: string, analysis: any): string[] {
        const conditions: string[] = [];

        if (solution.includes('π')) {
            conditions.push('Solution is in radians');
        }

        if (analysis.primaryFunction === 'sin' || analysis.primaryFunction === 'cos') {
            conditions.push('Add 2πn for general solution (n ∈ ℤ)');
        } else if (analysis.primaryFunction === 'tan') {
            conditions.push('Add πn for general solution (n ∈ ℤ)');
        }

        return conditions;
    }
}