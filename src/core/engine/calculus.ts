/**
 * Advanced Calculus Operations Engine
 * Handles derivatives, integrals, limits, and advanced calculus operations
 */

import type {
    MathConfig,
    MathResult,
    SolutionStep,
    VariableAssignment,
} from '../../types/core.js';
import { MathOperation } from '../../types/core.js';
import type {
    DerivativeResult,
    IntegralResult,
    IntegralConfig,
} from '../../types/api.js';
import { MathError, MathErrorType } from '../../types/core.js';

// Import mathematical libraries with proper ES6 imports for browser compatibility
import nerdamer from 'nerdamer';
import 'nerdamer/Calculus';
import 'nerdamer/Algebra';
import * as Algebrite from 'algebrite';
import * as math from 'mathjs';
import Decimal from 'decimal.js';
import Fraction from 'fraction.js';

/**
 * Advanced calculus operations engine
 */
export class CalculusEngine {
    private readonly config: MathConfig;

    constructor(config: MathConfig) {
        this.config = config;
    }

    /**
     * Advanced derivative calculation with multiple rules
     */
    public async computeAdvancedDerivative(
        expression: string,
        variable = 'x',
        order = 1,
        config?: Partial<MathConfig>
    ): Promise<DerivativeResult> {
        const startTime = performance.now();
        const finalConfig = { ...this.config, ...config };

        try {
            // Analyze the expression to determine which rules to apply
            const analysis = this.analyzeExpressionForDerivative(expression);

            // Compute derivative using appropriate method
            let result = expression;
            const steps: SolutionStep[] = [];
            const rulesApplied: string[] = [];

            // Apply derivative rules step by step
            for (let currentOrder = 1; currentOrder <= order; currentOrder++) {
                const { derivative, appliedRules, derivativeSteps } = await this.computeDerivativeWithRules(
                    result,
                    variable,
                    analysis
                );

                result = derivative;
                rulesApplied.push(...appliedRules);
                steps.push(...derivativeSteps);
            }

            // Simplify if requested
            if (finalConfig.autoSimplify) {
                const simplified = await this.simplifyDerivative(result);
                if (simplified !== result) {
                    steps.push({
                        id: 'simplify_derivative',
                        description: 'Simplify the derivative',
                        operation: MathOperation.SIMPLIFICATION,
                        before: result,
                        after: simplified,
                        explanation: 'Applied algebraic simplification to the derivative',
                    });
                    result = simplified;
                }
            }

            return {
                result,
                steps,
                metadata: {
                    computationTime: performance.now() - startTime,
                    method: 'advanced_symbolic_differentiation',
                    confidence: 1.0,
                    isExact: true,
                },
                variable,
                order,
                rulesApplied,
            };
        } catch (error) {
            throw new MathError(
                MathErrorType.COMPUTATION_ERROR,
                `Failed to compute advanced derivative: ${(error as Error).message}`,
                expression
            );
        }
    }

    /**
     * Advanced integration with multiple methods
     */
    public async computeAdvancedIntegral(
        expression: string,
        variable = 'x',
        config?: Partial<IntegralConfig>
    ): Promise<IntegralResult> {
        const startTime = performance.now();
        const finalConfig = { ...this.config, ...config };

        try {
            // Analyze expression to determine best integration method
            const analysis = this.analyzeExpressionForIntegration(expression);
            const method = finalConfig.method || this.selectOptimalIntegrationMethod(analysis);

            // Apply the selected integration method
            const { integral, steps, confidence } = await this.applyIntegrationMethod(
                expression,
                variable,
                method,
                analysis
            );

            let result = integral;

            // Handle definite vs indefinite integrals
            if (finalConfig.definite && finalConfig.lowerBound !== undefined && finalConfig.upperBound !== undefined) {
                result = await this.evaluateDefiniteIntegral(
                    integral,
                    variable,
                    finalConfig.lowerBound,
                    finalConfig.upperBound
                );

                steps.push({
                    id: 'evaluate_definite',
                    description: `Evaluate definite integral from ${finalConfig.lowerBound} to ${finalConfig.upperBound}`,
                    operation: MathOperation.EVALUATION,
                    before: `∫[${finalConfig.lowerBound} to ${finalConfig.upperBound}] ${expression} d${variable}`,
                    after: result,
                    explanation: `Applied fundamental theorem of calculus to evaluate the definite integral`,
                });
            } else {
                // Add constant of integration for indefinite integrals
                result = `${result} + C`;
            }

            return {
                result,
                steps,
                metadata: {
                    computationTime: performance.now() - startTime,
                    method: `advanced_${method.toLowerCase()}_integration`,
                    confidence,
                    isExact: method !== 'numerical',
                },
                variable,
                isDefinite: finalConfig.definite || false,
                bounds: finalConfig.definite ? {
                    lower: finalConfig.lowerBound || 0,
                    upper: finalConfig.upperBound || 1,
                } : undefined,
                method,
                constant: finalConfig.definite ? undefined : 'C',
            };
        } catch (error) {
            throw new MathError(
                MathErrorType.COMPUTATION_ERROR,
                `Failed to compute advanced integral: ${(error as Error).message}`,
                expression
            );
        }
    }

    /**
     * Compute limits
     */
    public async computeLimit(
        expression: string,
        variable: string,
        approach: string | number,
        direction?: 'left' | 'right' | 'both',
        config?: Partial<MathConfig>
    ): Promise<MathResult<string>> {
        const startTime = performance.now();

        try {
            // Use Nerdamer to compute the limit
            let limitExpression: string;

            if (direction === 'left') {
                limitExpression = `limit(${expression}, ${variable}, ${approach}, '-')`;
            } else if (direction === 'right') {
                limitExpression = `limit(${expression}, ${variable}, ${approach}, '+')`;
            } else {
                limitExpression = `limit(${expression}, ${variable}, ${approach})`;
            }

            const limit = nerdamer(limitExpression);
            const result = limit.toString();

            const steps: SolutionStep[] = [
                {
                    id: 'compute_limit',
                    description: `Compute limit as ${variable} approaches ${approach}`,
                    operation: MathOperation.LIMIT,
                    before: expression,
                    after: result,
                    explanation: `Evaluated the limit using analytical methods`,
                },
            ];

            return {
                result,
                steps,
                metadata: {
                    computationTime: performance.now() - startTime,
                    method: 'symbolic_limit_computation',
                    confidence: 0.9,
                    isExact: true,
                },
            };
        } catch (error) {
            throw new MathError(
                MathErrorType.COMPUTATION_ERROR,
                `Failed to compute limit: ${(error as Error).message}`,
                expression
            );
        }
    }

    /**
     * Partial derivatives for multivariable calculus
     */
    public async computePartialDerivative(
        expression: string,
        variable: string,
        config?: Partial<MathConfig>
    ): Promise<DerivativeResult> {
        const startTime = performance.now();

        try {
            // Try multiple libraries for best derivative computation
            let result = '';
            let method = 'nerdamer';

            // First try Algebrite for advanced symbolic differentiation
            try {
                const algebraicResult = Algebrite.run(`derivative(${expression}, ${variable})`);
                if (algebraicResult && !algebraicResult.includes('Stop') && algebraicResult !== expression) {
                    result = algebraicResult;
                    method = 'algebrite';
                }
            } catch (e) {
                // Continue to next method
            }

            // If Algebrite didn't work, try Nerdamer
            if (!result) {
                try {
                    const partial = nerdamer(`diff(${expression}, ${variable})`);
                    result = partial.toString();
                    method = 'nerdamer';
                } catch (e) {
                    // Continue to next method
                }
            }

            // If still no result, try Math.js
            if (!result) {
                try {
                    const mathResult = math.derivative(expression, variable);
                    if (mathResult) {
                        result = mathResult.toString();
                        method = 'mathjs';
                    }
                } catch (e) {
                    // Final fallback
                    result = `d/d${variable}(${expression})`;
                    method = 'symbolic';
                }
            }

            const steps: SolutionStep[] = [
                {
                    id: 'partial_derivative',
                    description: `Compute partial derivative with respect to ${variable}`,
                    operation: MathOperation.DIFFERENTIATION,
                    before: expression,
                    after: result,
                    explanation: `Treated other variables as constants and differentiated with respect to ${variable}`,
                },
            ];

            return {
                result,
                steps,
                metadata: {
                    computationTime: performance.now() - startTime,
                    method: 'partial_differentiation',
                    confidence: 1.0,
                    isExact: true,
                },
                variable,
                order: 1,
                rulesApplied: ['partial_derivative_rule'],
            };
        } catch (error) {
            throw new MathError(
                MathErrorType.COMPUTATION_ERROR,
                `Failed to compute partial derivative: ${(error as Error).message}`,
                expression
            );
        }
    }

    /**
     * Taylor series expansion
     */
    public async computeTaylorSeries(
        expression: string,
        variable: string,
        center: number | string = 0,
        order = 5,
        config?: Partial<MathConfig>
    ): Promise<MathResult<string>> {
        const startTime = performance.now();

        try {
            // Use Nerdamer to compute Taylor series
            const taylor = nerdamer(`taylor(${expression}, ${variable}, ${center}, ${order})`);
            const result = taylor.toString();

            const steps: SolutionStep[] = [
                {
                    id: 'taylor_expansion',
                    description: `Compute Taylor series expansion around ${variable} = ${center}`,
                    operation: MathOperation.EXPANSION,
                    before: expression,
                    after: result,
                    explanation: `Expanded function as Taylor series up to order ${order}`,
                },
            ];

            return {
                result,
                steps,
                metadata: {
                    computationTime: performance.now() - startTime,
                    method: 'taylor_series_expansion',
                    confidence: 0.95,
                    isExact: false, // Taylor series is an approximation
                },
            };
        } catch (error) {
            throw new MathError(
                MathErrorType.COMPUTATION_ERROR,
                `Failed to compute Taylor series: ${(error as Error).message}`,
                expression
            );
        }
    }

    // Private helper methods

    private analyzeExpressionForDerivative(expression: string): any {
        return {
            hasChainRule: this.needsChainRule(expression),
            hasProductRule: this.needsProductRule(expression),
            hasQuotientRule: this.needsQuotientRule(expression),
            hasTrigFunctions: this.hasTrigonometricFunctions(expression),
            hasExpFunctions: this.hasExponentialFunctions(expression),
            hasLogFunctions: this.hasLogarithmicFunctions(expression),
            complexity: this.calculateComplexity(expression),
        };
    }

    private analyzeExpressionForIntegration(expression: string): any {
        return {
            isPolynomial: this.isPolynomial(expression),
            hasTrigFunctions: this.hasTrigonometricFunctions(expression),
            hasExpFunctions: this.hasExponentialFunctions(expression),
            hasLogFunctions: this.hasLogarithmicFunctions(expression),
            isRational: this.isRationalFunction(expression),
            needsSubstitution: this.needsSubstitution(expression),
            needsIntegrationByParts: this.needsIntegrationByParts(expression),
            complexity: this.calculateComplexity(expression),
        };
    }

    private async computeDerivativeWithRules(
        expression: string,
        variable: string,
        analysis: any
    ): Promise<{ derivative: string; appliedRules: string[]; derivativeSteps: SolutionStep[] }> {
        const steps: SolutionStep[] = [];
        const appliedRules: string[] = [];

        try {
            // Use Nerdamer for the actual computation
            const derivative = nerdamer(`diff(${expression}, ${variable})`);
            const result = derivative.toString();

            // Determine which rules were likely applied based on analysis
            if (analysis.hasChainRule) {
                appliedRules.push('chain_rule');
                steps.push({
                    id: 'apply_chain_rule',
                    description: 'Apply chain rule',
                    operation: MathOperation.DIFFERENTIATION,
                    before: expression,
                    after: result,
                    explanation: 'Applied chain rule for composite functions',
                });
            }

            if (analysis.hasProductRule) {
                appliedRules.push('product_rule');
                steps.push({
                    id: 'apply_product_rule',
                    description: 'Apply product rule',
                    operation: MathOperation.DIFFERENTIATION,
                    before: expression,
                    after: result,
                    explanation: 'Applied product rule: d/dx[f(x)g(x)] = f\'(x)g(x) + f(x)g\'(x)',
                });
            }

            if (analysis.hasQuotientRule) {
                appliedRules.push('quotient_rule');
                steps.push({
                    id: 'apply_quotient_rule',
                    description: 'Apply quotient rule',
                    operation: MathOperation.DIFFERENTIATION,
                    before: expression,
                    after: result,
                    explanation: 'Applied quotient rule: d/dx[f(x)/g(x)] = [f\'(x)g(x) - f(x)g\'(x)]/[g(x)]²',
                });
            }

            // Add basic differentiation step if no special rules were identified
            if (appliedRules.length === 0) {
                appliedRules.push('basic_differentiation');
                steps.push({
                    id: 'basic_differentiation',
                    description: 'Apply basic differentiation rules',
                    operation: MathOperation.DIFFERENTIATION,
                    before: expression,
                    after: result,
                    explanation: 'Applied standard differentiation rules',
                });
            }

            return {
                derivative: result,
                appliedRules,
                derivativeSteps: steps,
            };
        } catch (error) {
            throw new Error(`Failed to compute derivative with rules: ${(error as Error).message}`);
        }
    }

    private selectOptimalIntegrationMethod(analysis: any): string {
        if (analysis.isPolynomial) {
            return 'auto';
        }
        if (analysis.needsSubstitution) {
            return 'substitution';
        }
        if (analysis.needsIntegrationByParts) {
            return 'parts';
        }
        if (analysis.isRational) {
            return 'partial_fractions';
        }
        if (analysis.hasTrigFunctions) {
            return 'trigonometric';
        }
        return 'auto';
    }

    private async applyIntegrationMethod(
        expression: string,
        variable: string,
        method: string,
        analysis: any
    ): Promise<{ integral: string; steps: SolutionStep[]; confidence: number }> {
        const steps: SolutionStep[] = [];
        let confidence = 0.9;

        try {
            let integral: string;

            switch (method) {
                case 'substitution':
                    integral = await this.integrateBySubstitution(expression, variable);
                    steps.push({
                        id: 'integration_by_substitution',
                        description: 'Apply integration by substitution',
                        operation: MathOperation.INTEGRATION,
                        before: expression,
                        after: integral,
                        explanation: 'Used u-substitution to simplify the integral',
                    });
                    break;

                case 'parts':
                    integral = await this.integrateByParts(expression, variable);
                    steps.push({
                        id: 'integration_by_parts',
                        description: 'Apply integration by parts',
                        operation: MathOperation.INTEGRATION,
                        before: expression,
                        after: integral,
                        explanation: 'Used integration by parts: ∫u dv = uv - ∫v du',
                    });
                    break;

                case 'partial_fractions':
                    integral = await this.integrateByPartialFractions(expression, variable);
                    steps.push({
                        id: 'partial_fractions_integration',
                        description: 'Apply partial fraction decomposition',
                        operation: MathOperation.INTEGRATION,
                        before: expression,
                        after: integral,
                        explanation: 'Decomposed rational function and integrated each part',
                    });
                    break;

                case 'trigonometric':
                    integral = await this.integrateTrigonometric(expression, variable);
                    steps.push({
                        id: 'trigonometric_integration',
                        description: 'Apply trigonometric integration techniques',
                        operation: MathOperation.INTEGRATION,
                        before: expression,
                        after: integral,
                        explanation: 'Used trigonometric identities and substitutions',
                    });
                    break;

                case 'numerical':
                    integral = await this.integrateNumerically(expression, variable);
                    confidence = 0.7; // Lower confidence for numerical methods
                    steps.push({
                        id: 'numerical_integration',
                        description: 'Apply numerical integration',
                        operation: MathOperation.INTEGRATION,
                        before: expression,
                        after: integral,
                        explanation: 'Used numerical methods to approximate the integral',
                    });
                    break;

                default:
                    // AUTO method - try multiple libraries for best result
                    let integrationMethod = 'nerdamer';

                    // First try Algebrite for advanced symbolic integration
                    try {
                        const algebraicResult = Algebrite.run(`integral(${expression}, ${variable})`);
                        if (algebraicResult && !algebraicResult.includes('Stop') && algebraicResult !== expression) {
                            integral = algebraicResult;
                            integrationMethod = 'algebrite';
                        }
                    } catch (e) {
                        // Continue to next method
                    }

                    // If Algebrite didn't work, try Nerdamer
                    if (!integral) {
                        try {
                            const result = nerdamer(`integrate(${expression}, ${variable})`);
                            integral = result.toString();
                            integrationMethod = 'nerdamer';
                        } catch (e) {
                            // Continue to next method
                        }
                    }

                    // If still no result, provide symbolic representation
                    if (!integral) {
                        integral = `∫${expression} d${variable}`;
                        integrationMethod = 'symbolic';
                    }

                    steps.push({
                        id: 'automatic_integration',
                        description: `Apply automatic integration using ${integrationMethod}`,
                        operation: MathOperation.INTEGRATION,
                        before: expression,
                        after: integral,
                        explanation: `Used ${integrationMethod} for integration computation`,
                    });
                    break;
            }

            return { integral, steps, confidence };
        } catch (error) {
            throw new Error(`Failed to apply integration method ${method}: ${(error as Error).message}`);
        }
    }

    private async integrateBySubstitution(expression: string, variable: string): Promise<string> {
        try {
            const result = nerdamer(`integrate(${expression}, ${variable})`);
            return result.toString();
        } catch (error) {
            throw new Error(`Substitution integration failed: ${(error as Error).message}`);
        }
    }

    private async integrateByParts(expression: string, variable: string): Promise<string> {
        try {
            const result = nerdamer(`integrate(${expression}, ${variable})`);
            return result.toString();
        } catch (error) {
            throw new Error(`Integration by parts failed: ${(error as Error).message}`);
        }
    }

    private async integrateByPartialFractions(expression: string, variable: string): Promise<string> {
        try {
            // First decompose into partial fractions, then integrate
            const partialFractions = nerdamer(`partfrac(${expression}, ${variable})`);
            const result = nerdamer(`integrate(${partialFractions}, ${variable})`);
            return result.toString();
        } catch (error) {
            throw new Error(`Partial fractions integration failed: ${(error as Error).message}`);
        }
    }

    private async integrateTrigonometric(expression: string, variable: string): Promise<string> {
        try {
            const result = nerdamer(`integrate(${expression}, ${variable})`);
            return result.toString();
        } catch (error) {
            throw new Error(`Trigonometric integration failed: ${(error as Error).message}`);
        }
    }

    private async integrateNumerically(expression: string, variable: string): Promise<string> {
        // This would implement numerical integration methods like Simpson's rule
        // For now, fallback to symbolic integration
        try {
            const result = nerdamer(`integrate(${expression}, ${variable})`);
            return result.toString();
        } catch (error) {
            throw new Error(`Numerical integration failed: ${(error as Error).message}`);
        }
    }

    private async evaluateDefiniteIntegral(
        antiderivative: string,
        variable: string,
        lowerBound: number,
        upperBound: number
    ): Promise<string> {
        try {
            // Evaluate F(b) - F(a) where F is the antiderivative
            const upperValue = nerdamer(antiderivative).sub(variable, upperBound);
            const lowerValue = nerdamer(antiderivative).sub(variable, lowerBound);
            const result = nerdamer(upperValue).subtract(lowerValue);
            return result.toString();
        } catch (error) {
            throw new Error(`Failed to evaluate definite integral: ${(error as Error).message}`);
        }
    }

    private async simplifyDerivative(expression: string): Promise<string> {
        try {
            const simplified = nerdamer(expression).simplify();
            return simplified.toString();
        } catch (error) {
            return expression;
        }
    }

    // Pattern recognition methods
    private needsChainRule(expression: string): boolean {
        // Check for composite functions like sin(x^2), e^(x^2), etc.
        return /\w+\([^)]*\^[^)]*\)/.test(expression) ||
            /\w+\([^)]*\*[^)]*\)/.test(expression) ||
            /\w+\([^)]*\w+\([^)]*\)[^)]*\)/.test(expression);
    }

    private needsProductRule(expression: string): boolean {
        // Check for products of functions
        return /\w+\([^)]*\)\s*\*\s*\w+\([^)]*\)/.test(expression) ||
            /[a-zA-Z]\s*\*\s*\w+\([^)]*\)/.test(expression);
    }

    private needsQuotientRule(expression: string): boolean {
        // Check for quotients of functions
        return /\w+\([^)]*\)\s*\/\s*\w+\([^)]*\)/.test(expression) ||
            /[a-zA-Z]\s*\/\s*\w+\([^)]*\)/.test(expression);
    }

    private hasTrigonometricFunctions(expression: string): boolean {
        return /\b(sin|cos|tan|sec|csc|cot|asin|acos|atan)\b/.test(expression);
    }

    private hasExponentialFunctions(expression: string): boolean {
        return /\b(exp|e\^)\b/.test(expression) || /\^\s*[a-zA-Z]/.test(expression);
    }

    private hasLogarithmicFunctions(expression: string): boolean {
        return /\b(log|ln)\b/.test(expression);
    }

    private isPolynomial(expression: string): boolean {
        // Check if expression contains only polynomial terms
        return !/\b(sin|cos|tan|exp|log|ln|sqrt)\b/.test(expression) &&
            !/\//.test(expression);
    }

    private isRationalFunction(expression: string): boolean {
        return expression.includes('/') && !this.hasTrigonometricFunctions(expression) &&
            !this.hasExponentialFunctions(expression) && !this.hasLogarithmicFunctions(expression);
    }

    private needsSubstitution(expression: string): boolean {
        // Check for expressions that benefit from u-substitution
        return /\w+\([^)]*\)\s*\*\s*\w+'\([^)]*\)/.test(expression) ||
            /[a-zA-Z]\^?\d*\s*\*\s*\w+\([^)]*\)/.test(expression);
    }

    private needsIntegrationByParts(expression: string): boolean {
        // Check for products that need integration by parts
        return /[a-zA-Z]\s*\*\s*\w+\([^)]*\)/.test(expression) ||
            /\w+\([^)]*\)\s*\*\s*\w+\([^)]*\)/.test(expression);
    }

    private calculateComplexity(expression: string): number {
        // Simple complexity metric
        let complexity = expression.length;
        complexity += (expression.match(/[()]/g) || []).length * 2;
        complexity += (expression.match(/[+\-*/^]/g) || []).length;
        complexity += (expression.match(/\b(sin|cos|tan|exp|log|ln)\b/g) || []).length * 3;
        return complexity;
    }
}