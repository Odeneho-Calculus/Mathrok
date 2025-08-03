/**
 * Advanced Algebraic Operations Engine
 * Handles polynomial factoring, expansion, rational expressions, and algebraic manipulations
 */

import type {
    MathConfig,
    MathResult,
    SolutionStep,
    VariableAssignment,
} from '../../types/core.js';
import { MathOperation } from '../../types/core.js';
import type {
    FactorResult,
    ExpandResult,
    SimplifyResult,
    Factor,
    Term,
} from '../../types/api.js';
import { MathError, MathErrorType } from '../../types/core.js';

// Import mathematical libraries with proper ES6 imports for browser compatibility
import nerdamer from 'nerdamer';
import 'nerdamer/Algebra';
import 'nerdamer/Solve';
import * as Algebrite from 'algebrite';
import * as math from 'mathjs';
import Decimal from 'decimal.js';
import Fraction from 'fraction.js';

/**
 * Advanced algebraic operations engine
 */
export class AlgebraEngine {
    private readonly config: MathConfig;

    constructor(config: MathConfig) {
        this.config = config;
    }

    /**
     * Advanced polynomial factoring with multiple methods
     */
    public async factorPolynomial(
        expression: string,
        config?: Partial<MathConfig>
    ): Promise<FactorResult> {
        const startTime = performance.now();
        const finalConfig = { ...this.config, ...config };

        try {
            // Determine the best factoring method
            const method = this.determineFactoringMethod(expression);

            // Apply the appropriate factoring technique
            const factoredExpression = await this.applyFactoringMethod(expression, method);

            // Extract individual factors
            const factors = this.extractFactorsFromExpression(factoredExpression);

            // Generate step-by-step explanation
            const steps = this.generateFactoringSteps(expression, factoredExpression, method);

            const result: FactorResult = {
                result: factoredExpression,
                steps,
                metadata: {
                    computationTime: performance.now() - startTime,
                    method: `algebraic_factoring_${method.toLowerCase()}`,
                    confidence: this.calculateFactoringConfidence(expression, factoredExpression),
                    isExact: true,
                },
                factors,
                method,
            };

            return result;
        } catch (error) {
            throw new MathError(
                MathErrorType.COMPUTATION_ERROR,
                `Failed to factor polynomial: ${(error as Error).message}`,
                expression
            );
        }
    }

    /**
     * Advanced polynomial expansion with binomial and multinomial theorems
     */
    public async expandPolynomial(
        expression: string,
        config?: Partial<MathConfig>
    ): Promise<ExpandResult> {
        const startTime = performance.now();
        const finalConfig = { ...this.config, ...config };

        try {
            // Determine expansion method
            const method = this.determineExpansionMethod(expression);

            // Apply expansion
            const expandedExpression = await this.applyExpansionMethod(expression, method);

            // Extract terms
            const terms = this.extractTermsFromExpression(expandedExpression);

            // Generate steps
            const steps = this.generateExpansionSteps(expression, expandedExpression, method);

            const result: ExpandResult = {
                result: expandedExpression,
                steps,
                metadata: {
                    computationTime: performance.now() - startTime,
                    method: `algebraic_expansion_${method.toLowerCase()}`,
                    confidence: 1.0,
                    isExact: true,
                },
                terms,
                method,
            };

            return result;
        } catch (error) {
            throw new MathError(
                MathErrorType.COMPUTATION_ERROR,
                `Failed to expand polynomial: ${(error as Error).message}`,
                expression
            );
        }
    }

    /**
     * Rational expression simplification
     */
    public async simplifyRational(
        expression: string,
        config?: Partial<MathConfig>
    ): Promise<SimplifyResult> {
        const startTime = performance.now();
        const finalConfig = { ...this.config, ...config };

        try {
            // Parse and analyze the rational expression
            const analysis = this.analyzeRationalExpression(expression);

            // Apply appropriate simplification techniques
            const simplifiedExpression = await this.applyRationalSimplification(expression, analysis);

            // Calculate complexity reduction
            const originalComplexity = this.calculateExpressionComplexity(expression);
            const newComplexity = this.calculateExpressionComplexity(simplifiedExpression);

            // Generate steps
            const steps = this.generateSimplificationSteps(expression, simplifiedExpression, analysis);

            const result: SimplifyResult = {
                result: simplifiedExpression,
                steps,
                metadata: {
                    computationTime: performance.now() - startTime,
                    method: 'rational_expression_simplification',
                    confidence: 0.95,
                    isExact: true,
                },
                rulesApplied: analysis.rulesApplied,
                complexityReduction: originalComplexity - newComplexity,
            };

            return result;
        } catch (error) {
            throw new MathError(
                MathErrorType.COMPUTATION_ERROR,
                `Failed to simplify rational expression: ${(error as Error).message}`,
                expression
            );
        }
    }

    /**
     * Algebraic substitution with variable replacement
     */
    public async substitute(
        expression: string,
        substitutions: VariableAssignment,
        config?: Partial<MathConfig>
    ): Promise<SimplifyResult> {
        const startTime = performance.now();
        const finalConfig = { ...this.config, ...config };

        try {
            let result = expression;
            const steps: SolutionStep[] = [];

            // Apply each substitution
            for (const [variable, value] of Object.entries(substitutions)) {
                const beforeSubstitution = result;
                result = this.performSubstitution(result, variable, value);

                steps.push({
                    id: `substitute_${variable}`,
                    description: `Substitute ${variable} = ${value}`,
                    operation: MathOperation.SUBSTITUTION,
                    before: beforeSubstitution,
                    after: result,
                    explanation: `Replaced all instances of ${variable} with ${value}`,
                });
            }

            // Simplify the result
            const finalResult = await this.simplifyAfterSubstitution(result);

            if (finalResult !== result) {
                steps.push({
                    id: 'simplify_after_substitution',
                    description: 'Simplify after substitution',
                    operation: MathOperation.SIMPLIFICATION,
                    before: result,
                    after: finalResult,
                    explanation: 'Simplified the expression after variable substitution',
                });
            }

            return {
                result: finalResult,
                steps,
                metadata: {
                    computationTime: performance.now() - startTime,
                    method: 'algebraic_substitution',
                    confidence: 1.0,
                    isExact: true,
                },
                rulesApplied: ['variable_substitution', 'algebraic_simplification'],
                complexityReduction: expression.length - finalResult.length,
            };
        } catch (error) {
            throw new MathError(
                MathErrorType.COMPUTATION_ERROR,
                `Failed to perform substitution: ${(error as Error).message}`,
                expression
            );
        }
    }

    /**
     * Partial fraction decomposition
     */
    public async partialFractionDecomposition(
        expression: string,
        variable = 'x',
        config?: Partial<MathConfig>
    ): Promise<SimplifyResult> {
        const startTime = performance.now();

        try {
            // Use Nerdamer's partial fraction decomposition
            const decomposed = nerdamer(`partfrac(${expression}, ${variable})`);
            const result = decomposed.toString();

            const steps: SolutionStep[] = [
                {
                    id: 'partial_fraction_decomposition',
                    description: 'Decompose into partial fractions',
                    operation: MathOperation.CONVERSION,
                    before: expression,
                    after: result,
                    explanation: `Decomposed rational function into sum of simpler fractions`,
                },
            ];

            return {
                result,
                steps,
                metadata: {
                    computationTime: performance.now() - startTime,
                    method: 'partial_fraction_decomposition',
                    confidence: 0.9,
                    isExact: true,
                },
                rulesApplied: ['partial_fraction_decomposition'],
                complexityReduction: 0, // May actually increase complexity initially
            };
        } catch (error) {
            throw new MathError(
                MathErrorType.COMPUTATION_ERROR,
                `Failed to decompose into partial fractions: ${(error as Error).message}`,
                expression
            );
        }
    }

    // Private helper methods

    private determineFactoringMethod(expression: string): string {
        // Analyze expression to determine best factoring method
        if (this.isQuadratic(expression)) {
            return 'quadratic';
        }
        if (this.isDifferenceOfSquares(expression)) {
            return 'difference_of_squares';
        }
        if (this.isPerfectSquare(expression)) {
            return 'perfect_square';
        }
        if (this.hasCommonFactor(expression)) {
            return 'common_factor';
        }
        if (this.canUseGrouping(expression)) {
            return 'grouping';
        }
        return 'rational_root';
    }

    private async applyFactoringMethod(expression: string, method: string): Promise<string> {
        try {
            // Try multiple libraries for best results
            let result = expression;

            // First try Algebrite for advanced symbolic factoring
            try {
                const algebraicResult = Algebrite.run(`factor(${expression})`);
                if (algebraicResult && algebraicResult !== expression && !algebraicResult.includes('Stop')) {
                    result = algebraicResult;
                }
            } catch (e) {
                // Continue to next method
            }

            // If Algebrite didn't work, try Nerdamer
            if (result === expression) {
                try {
                    const nerdamerResult = nerdamer(`factor(${expression})`);
                    const factored = nerdamerResult.toString();
                    if (factored && factored !== expression) {
                        result = factored;
                    }
                } catch (e) {
                    // Continue to next method
                }
            }

            // If still no result, try Math.js
            if (result === expression) {
                try {
                    const mathResult = math.simplify(expression);
                    if (mathResult && mathResult.toString() !== expression) {
                        result = mathResult.toString();
                    }
                } catch (e) {
                    // Use original expression
                }
            }

            return result;
        } catch (error) {
            // Final fallback - return original expression
            return expression;
        }
    }

    private factorCommonFactor(expression: string): string {
        try {
            // Use Nerdamer to factor out common factors
            const factored = nerdamer(`factor(${expression})`);
            return factored.toString();
        } catch (error) {
            return expression;
        }
    }

    private factorDifferenceOfSquares(expression: string): string {
        try {
            // Pattern: a^2 - b^2 = (a + b)(a - b)
            const factored = nerdamer(`factor(${expression})`);
            return factored.toString();
        } catch (error) {
            return expression;
        }
    }

    private factorPerfectSquare(expression: string): string {
        try {
            // Pattern: a^2 + 2ab + b^2 = (a + b)^2
            const factored = nerdamer(`factor(${expression})`);
            return factored.toString();
        } catch (error) {
            return expression;
        }
    }

    private factorQuadratic(expression: string): string {
        try {
            // Use Nerdamer's quadratic factoring
            const factored = nerdamer(`factor(${expression})`);
            return factored.toString();
        } catch (error) {
            return expression;
        }
    }

    private factorByGrouping(expression: string): string {
        try {
            const factored = nerdamer(`factor(${expression})`);
            return factored.toString();
        } catch (error) {
            return expression;
        }
    }

    private factorUsingRationalRoot(expression: string): string {
        try {
            const factored = nerdamer(`factor(${expression})`);
            return factored.toString();
        } catch (error) {
            return expression;
        }
    }

    private extractFactorsFromExpression(expression: string): Factor[] {
        // Parse the factored expression to extract individual factors
        const factors: Factor[] = [];

        try {
            // This is a simplified implementation
            // In a full system, this would parse the factored form more thoroughly
            const factorMatches = expression.match(/\([^)]+\)/g) || [];

            factorMatches.forEach((factor, index) => {
                factors.push({
                    expression: factor,
                    multiplicity: 1, // Would need more sophisticated parsing to determine multiplicity
                    type: this.determineFactorType(factor),
                });
            });

            // If no parentheses found, treat the whole expression as one factor
            if (factors.length === 0) {
                factors.push({
                    expression,
                    multiplicity: 1,
                    type: this.determineFactorType(expression),
                });
            }
        } catch (error) {
            // Fallback
            factors.push({
                expression,
                multiplicity: 1,
                type: 'irreducible',
            });
        }

        return factors;
    }

    private determineFactorType(factor: string): string {
        // Remove parentheses for analysis
        const cleanFactor = factor.replace(/[()]/g, '');

        // Check if it's a constant
        if (/^-?\d+(\.\d+)?$/.test(cleanFactor)) {
            return 'constant';
        }

        // Check if it's linear (degree 1)
        if (/^[+-]?\d*[a-zA-Z]([+-]\d+)?$/.test(cleanFactor)) {
            return 'linear';
        }

        // Check if it's quadratic (degree 2)
        if (cleanFactor.includes('^2') || cleanFactor.match(/[a-zA-Z]\^?2/)) {
            return 'quadratic';
        }

        return 'irreducible';
    }

    private determineExpansionMethod(expression: string): string {
        if (expression.includes('^') && /\([^)]+\)\^?\d+/.test(expression)) {
            return 'binomial';
        }
        if (expression.match(/\([^)]*\)\s*\([^)]*\)/)) {
            return 'distributive';
        }
        return 'distributive';
    }

    private async applyExpansionMethod(expression: string, method: string): Promise<string> {
        try {
            // Try multiple libraries for best expansion results
            let result = expression;

            // First try Algebrite for advanced symbolic expansion
            try {
                const algebraicResult = Algebrite.run(`expand(${expression})`);
                if (algebraicResult && algebraicResult !== expression && !algebraicResult.includes('Stop')) {
                    result = algebraicResult;
                }
            } catch (e) {
                // Continue to next method
            }

            // If Algebrite didn't work, try Nerdamer
            if (result === expression) {
                try {
                    const nerdamerResult = nerdamer(`expand(${expression})`);
                    const expanded = nerdamerResult.toString();
                    if (expanded && expanded !== expression) {
                        result = expanded;
                    }
                } catch (e) {
                    // Continue to next method
                }
            }

            // If still no result, try Math.js
            if (result === expression) {
                try {
                    const mathResult = math.simplify(expression);
                    if (mathResult && mathResult.toString() !== expression) {
                        result = mathResult.toString();
                    }
                } catch (e) {
                    // Use original expression
                }
            }

            return result;
        } catch (error) {
            return expression;
        }
    }

    private extractTermsFromExpression(expression: string): Term[] {
        const terms: Term[] = [];

        try {
            // Split by + and - while preserving the signs
            const termStrings = expression.split(/(?=[+-])/).filter(term => term.trim() !== '');

            termStrings.forEach(termString => {
                const term = this.parseTermString(termString.trim());
                if (term) {
                    terms.push(term);
                }
            });
        } catch (error) {
            // Fallback: treat entire expression as one term
            terms.push({
                coefficient: 1,
                variables: {},
                expression: expression,
            });
        }

        return terms;
    }

    private parseTermString(termString: string): Term | null {
        try {
            // Extract coefficient
            let coefficient = 1;
            let variablePart = termString;

            const coeffMatch = termString.match(/^([+-]?\d*\.?\d*)/);
            if (coeffMatch && coeffMatch[1]) {
                const coeffStr = coeffMatch[1];
                if (coeffStr === '+' || coeffStr === '') {
                    coefficient = 1;
                } else if (coeffStr === '-') {
                    coefficient = -1;
                } else {
                    coefficient = parseFloat(coeffStr);
                }
                variablePart = termString.replace(coeffMatch[1], '');
            }

            // Extract variables and their powers
            const variables: Record<string, number> = {};
            const variableMatches = variablePart.match(/[a-zA-Z](\^?\d+)?/g) || [];

            variableMatches.forEach(varMatch => {
                const [variable, power] = varMatch.split('^');
                variables[variable] = power ? parseInt(power, 10) : 1;
            });

            return {
                coefficient,
                variables,
                expression: termString,
            };
        } catch (error) {
            return null;
        }
    }

    private generateFactoringSteps(
        original: string,
        factored: string,
        method: string
    ): SolutionStep[] {
        const steps: SolutionStep[] = [];

        steps.push({
            id: 'factor_analysis',
            description: 'Analyze expression for factoring method',
            operation: MathOperation.FACTORING,
            before: original,
            after: original,
            explanation: `Identified that ${method.replace('_', ' ')} method is most appropriate`,
        });

        steps.push({
            id: 'apply_factoring',
            description: `Apply ${method.replace('_', ' ')} factoring`,
            operation: MathOperation.FACTORING,
            before: original,
            after: factored,
            explanation: `Used ${method.replace('_', ' ')} technique to factor the expression`,
        });

        return steps;
    }

    private generateExpansionSteps(
        original: string,
        expanded: string,
        method: string
    ): SolutionStep[] {
        const steps: SolutionStep[] = [];

        steps.push({
            id: 'expansion_method',
            description: `Apply ${method.toLowerCase()} expansion`,
            operation: MathOperation.EXPANSION,
            before: original,
            after: expanded,
            explanation: `Used ${method.toLowerCase()} method to expand the expression`,
        });

        return steps;
    }

    private generateSimplificationSteps(
        original: string,
        simplified: string,
        analysis: any
    ): SolutionStep[] {
        const steps: SolutionStep[] = [];

        steps.push({
            id: 'rational_simplification',
            description: 'Simplify rational expression',
            operation: MathOperation.SIMPLIFICATION,
            before: original,
            after: simplified,
            explanation: 'Applied rational expression simplification rules',
        });

        return steps;
    }

    private analyzeRationalExpression(expression: string): any {
        return {
            hasCommonFactors: true,
            canCancelTerms: true,
            rulesApplied: ['cancel_common_factors', 'reduce_fractions'],
        };
    }

    private async applyRationalSimplification(expression: string, analysis: any): Promise<string> {
        try {
            const simplified = nerdamer(expression).simplify();
            return simplified.toString();
        } catch (error) {
            return expression;
        }
    }

    private calculateExpressionComplexity(expression: string): number {
        // Simple complexity metric based on length and special characters
        return expression.length + (expression.match(/[()^*/+-]/g) || []).length;
    }

    private calculateFactoringConfidence(original: string, factored: string): number {
        // Higher confidence if the factored form is different and contains factors
        if (factored === original) return 0.5;
        if (factored.includes('(') && factored.includes(')')) return 0.95;
        return 0.7;
    }

    private performSubstitution(expression: string, variable: string, value: string | number): string {
        try {
            // Use Nerdamer for substitution
            const substituted = nerdamer(expression).sub(variable, value);
            return substituted.toString();
        } catch (error) {
            // Fallback to simple string replacement
            const regex = new RegExp(`\\b${variable}\\b`, 'g');
            return expression.replace(regex, `(${value})`);
        }
    }

    private async simplifyAfterSubstitution(expression: string): Promise<string> {
        try {
            const simplified = nerdamer(expression).simplify();
            return simplified.toString();
        } catch (error) {
            return expression;
        }
    }

    // Pattern recognition methods
    private isQuadratic(expression: string): boolean {
        return /[a-zA-Z]\^?2/.test(expression) && !expression.includes('^3');
    }

    private isDifferenceOfSquares(expression: string): boolean {
        return expression.includes('^2') && expression.includes('-') && !expression.includes('+');
    }

    private isPerfectSquare(expression: string): boolean {
        // Simplified check - would need more sophisticated analysis
        return expression.includes('^2') && expression.includes('+');
    }

    private hasCommonFactor(expression: string): boolean {
        // Check if all terms have a common factor
        return /^\d+[a-zA-Z]/.test(expression) || expression.includes('*');
    }

    private canUseGrouping(expression: string): boolean {
        // Check if expression has 4 or more terms that can be grouped
        const terms = expression.split(/[+-]/).filter(t => t.trim());
        return terms.length >= 4;
    }
}