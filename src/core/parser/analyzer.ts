/**
 * Mathematical structure analyzer
 * Analyzes AST to identify mathematical structures and patterns
 */

import type { MathStructure, StructureType } from '../../types/api.js';
import type { ExpressionNode } from '../../types/core.js';
import { ASTNode } from './ast.js';

/**
 * Structure pattern interface
 */
interface StructurePattern {
    readonly type: StructureType;
    readonly name: string;
    readonly description: string;
    readonly matcher: (node: ExpressionNode) => StructureMatch | null;
}

/**
 * Structure match result
 */
interface StructureMatch {
    readonly confidence: number;
    readonly properties: Record<string, unknown>;
    readonly position: { start: number; end: number };
}

/**
 * Mathematical structure analyzer
 */
export class StructureAnalyzer {
    private readonly patterns: StructurePattern[];

    constructor() {
        this.patterns = [
            this.createPolynomialPattern(),
            this.createRationalFunctionPattern(),
            this.createTrigonometricPattern(),
            this.createExponentialPattern(),
            this.createLogarithmicPattern(),
            this.createMatrixPattern(),
            this.createVectorPattern(),
            this.createEquationPattern(),
            this.createInequalityPattern(),
            this.createSystemPattern(),
        ];
    }

    /**
     * Analyze AST for mathematical structures
     */
    public async analyze(ast: ExpressionNode): Promise<MathStructure[]> {
        const structures: MathStructure[] = [];

        // Analyze the entire tree
        this.analyzeNode(ast, structures);

        // Sort by confidence and remove duplicates
        return structures
            .sort((a, b) => (b.properties.confidence as number) - (a.properties.confidence as number))
            .filter((structure, index, array) =>
                index === array.findIndex(s =>
                    s.type === structure.type &&
                    s.position.start === structure.position.start &&
                    s.position.end === structure.position.end
                )
            );
    }

    /**
     * Analyze a single node and its children
     */
    private analyzeNode(node: ExpressionNode, structures: MathStructure[]): void {
        // Check each pattern against this node
        for (const pattern of this.patterns) {
            const match = pattern.matcher(node);
            if (match && match.confidence > 0.5) {
                structures.push({
                    type: pattern.type,
                    description: pattern.description,
                    position: match.position,
                    properties: {
                        ...match.properties,
                        confidence: match.confidence,
                        pattern: pattern.name,
                    },
                });
            }
        }

        // Recursively analyze children
        if (node.children) {
            for (const child of node.children) {
                this.analyzeNode(child, structures);
            }
        }
    }

    /**
     * Create polynomial pattern matcher
     */
    private createPolynomialPattern(): StructurePattern {
        return {
            type: 'POLYNOMIAL',
            name: 'polynomial',
            description: 'Polynomial expression',
            matcher: (node) => {
                if (!this.isPolynomial(node)) {
                    return null;
                }

                const degree = this.getPolynomialDegree(node);
                const variables = this.getVariables(node);

                return {
                    confidence: 0.9,
                    properties: {
                        degree,
                        variables: Array.from(variables),
                        isUnivariate: variables.size === 1,
                        isMultivariate: variables.size > 1,
                    },
                    position: this.getNodePosition(node),
                };
            },
        };
    }

    /**
     * Create rational function pattern matcher
     */
    private createRationalFunctionPattern(): StructurePattern {
        return {
            type: 'RATIONAL_FUNCTION',
            name: 'rational_function',
            description: 'Rational function (polynomial divided by polynomial)',
            matcher: (node) => {
                if (node.type !== 'operator' || node.value !== '/') {
                    return null;
                }

                const [numerator, denominator] = node.children || [];
                if (!numerator || !denominator) {
                    return null;
                }

                if (this.isPolynomial(numerator) && this.isPolynomial(denominator)) {
                    return {
                        confidence: 0.85,
                        properties: {
                            numeratorDegree: this.getPolynomialDegree(numerator),
                            denominatorDegree: this.getPolynomialDegree(denominator),
                            variables: Array.from(this.getVariables(node)),
                        },
                        position: this.getNodePosition(node),
                    };
                }

                return null;
            },
        };
    }

    /**
     * Create trigonometric pattern matcher
     */
    private createTrigonometricPattern(): StructurePattern {
        return {
            type: 'TRIGONOMETRIC',
            name: 'trigonometric',
            description: 'Trigonometric expression',
            matcher: (node) => {
                const trigFunctions = new Set([
                    'sin', 'cos', 'tan', 'cot', 'sec', 'csc',
                    'asin', 'acos', 'atan', 'acot', 'asec', 'acsc',
                    'sinh', 'cosh', 'tanh', 'coth', 'sech', 'csch',
                ]);

                if (node.type === 'function' &&
                    typeof node.value === 'string' &&
                    trigFunctions.has(node.value.toLowerCase())) {
                    return {
                        confidence: 0.95,
                        properties: {
                            function: node.value,
                            isInverse: node.value.startsWith('a'),
                            isHyperbolic: node.value.includes('h'),
                            argumentCount: node.children?.length || 0,
                        },
                        position: this.getNodePosition(node),
                    };
                }

                // Check for trigonometric expressions in subtree
                if (this.containsTrigonometric(node)) {
                    return {
                        confidence: 0.7,
                        properties: {
                            containsTrigonometric: true,
                            trigFunctions: this.getTrigonometricFunctions(node),
                        },
                        position: this.getNodePosition(node),
                    };
                }

                return null;
            },
        };
    }

    /**
     * Create exponential pattern matcher
     */
    private createExponentialPattern(): StructurePattern {
        return {
            type: 'EXPONENTIAL',
            name: 'exponential',
            description: 'Exponential expression',
            matcher: (node) => {
                // Check for exp function
                if (node.type === 'function' && node.value === 'exp') {
                    return {
                        confidence: 0.95,
                        properties: {
                            base: 'e',
                            isNaturalExponential: true,
                        },
                        position: this.getNodePosition(node),
                    };
                }

                // Check for exponential with constant base
                if (node.type === 'operator' && node.value === '^') {
                    const [base, exponent] = node.children || [];
                    if (base && this.isConstant(base)) {
                        return {
                            confidence: 0.8,
                            properties: {
                                base: base.value,
                                hasVariableExponent: this.hasVariables(exponent),
                            },
                            position: this.getNodePosition(node),
                        };
                    }
                }

                return null;
            },
        };
    }

    /**
     * Create logarithmic pattern matcher
     */
    private createLogarithmicPattern(): StructurePattern {
        return {
            type: 'LOGARITHMIC',
            name: 'logarithmic',
            description: 'Logarithmic expression',
            matcher: (node) => {
                const logFunctions = new Set(['log', 'ln', 'log10', 'log2']);

                if (node.type === 'function' &&
                    typeof node.value === 'string' &&
                    logFunctions.has(node.value.toLowerCase())) {
                    return {
                        confidence: 0.95,
                        properties: {
                            function: node.value,
                            base: this.getLogBase(node.value),
                            isNaturalLog: node.value === 'ln',
                            argumentCount: node.children?.length || 0,
                        },
                        position: this.getNodePosition(node),
                    };
                }

                return null;
            },
        };
    }

    /**
     * Create matrix pattern matcher
     */
    private createMatrixPattern(): StructurePattern {
        return {
            type: 'MATRIX',
            name: 'matrix',
            description: 'Matrix expression',
            matcher: (node) => {
                // Look for matrix functions
                const matrixFunctions = new Set(['det', 'inv', 'transpose', 'trace']);

                if (node.type === 'function' &&
                    typeof node.value === 'string' &&
                    matrixFunctions.has(node.value.toLowerCase())) {
                    return {
                        confidence: 0.9,
                        properties: {
                            operation: node.value,
                            isMatrixOperation: true,
                        },
                        position: this.getNodePosition(node),
                    };
                }

                // Look for bracket notation (simplified matrix detection)
                if (this.hasMatrixNotation(node)) {
                    return {
                        confidence: 0.7,
                        properties: {
                            hasMatrixNotation: true,
                        },
                        position: this.getNodePosition(node),
                    };
                }

                return null;
            },
        };
    }

    /**
     * Create vector pattern matcher
     */
    private createVectorPattern(): StructurePattern {
        return {
            type: 'VECTOR',
            name: 'vector',
            description: 'Vector expression',
            matcher: (node) => {
                // Simple vector detection based on bracket notation
                if (this.hasVectorNotation(node)) {
                    return {
                        confidence: 0.6,
                        properties: {
                            hasVectorNotation: true,
                        },
                        position: this.getNodePosition(node),
                    };
                }

                return null;
            },
        };
    }

    /**
     * Create equation pattern matcher
     */
    private createEquationPattern(): StructurePattern {
        return {
            type: 'EQUATION',
            name: 'equation',
            description: 'Mathematical equation',
            matcher: (node) => {
                if (node.type === 'equation') {
                    const [left, right] = node.children || [];
                    return {
                        confidence: 1.0,
                        properties: {
                            leftSide: left ? this.getExpressionType(left) : 'unknown',
                            rightSide: right ? this.getExpressionType(right) : 'unknown',
                            variables: Array.from(this.getVariables(node)),
                            isLinear: this.isLinearEquation(node),
                            isQuadratic: this.isQuadraticEquation(node),
                        },
                        position: this.getNodePosition(node),
                    };
                }

                return null;
            },
        };
    }

    /**
     * Create inequality pattern matcher
     */
    private createInequalityPattern(): StructurePattern {
        return {
            type: 'INEQUALITY',
            name: 'inequality',
            description: 'Mathematical inequality',
            matcher: (node) => {
                if (node.type === 'inequality') {
                    const [left, right] = node.children || [];
                    return {
                        confidence: 1.0,
                        properties: {
                            operator: node.value,
                            leftSide: left ? this.getExpressionType(left) : 'unknown',
                            rightSide: right ? this.getExpressionType(right) : 'unknown',
                            variables: Array.from(this.getVariables(node)),
                        },
                        position: this.getNodePosition(node),
                    };
                }

                return null;
            },
        };
    }

    /**
     * Create system pattern matcher
     */
    private createSystemPattern(): StructurePattern {
        return {
            type: 'SYSTEM',
            name: 'system',
            description: 'System of equations or inequalities',
            matcher: (node) => {
                // This would need more sophisticated detection
                // For now, just a placeholder
                return null;
            },
        };
    }

    // Helper methods

    private isPolynomial(node: ExpressionNode): boolean {
        if (node.type === 'number' || node.type === 'variable') {
            return true;
        }

        if (node.type === 'operator') {
            const operator = node.value as string;
            if (['+', '-', '*'].includes(operator)) {
                return node.children?.every(child => this.isPolynomial(child)) || false;
            }

            if (operator === '^') {
                const [base, exponent] = node.children || [];
                return base && exponent &&
                    this.isPolynomial(base) &&
                    exponent.type === 'number' &&
                    typeof exponent.value === 'number' &&
                    exponent.value >= 0 &&
                    Number.isInteger(exponent.value);
            }
        }

        return false;
    }

    private getPolynomialDegree(node: ExpressionNode): number {
        if (node.type === 'number') {
            return 0;
        }

        if (node.type === 'variable') {
            return 1;
        }

        if (node.type === 'operator') {
            const operator = node.value as string;
            const children = node.children || [];

            if (operator === '+' || operator === '-') {
                return Math.max(...children.map(child => this.getPolynomialDegree(child)));
            }

            if (operator === '*') {
                return children.reduce((sum, child) => sum + this.getPolynomialDegree(child), 0);
            }

            if (operator === '^') {
                const [base, exponent] = children;
                if (exponent?.type === 'number' && typeof exponent.value === 'number') {
                    return this.getPolynomialDegree(base) * exponent.value;
                }
            }
        }

        return 0;
    }

    private getVariables(node: ExpressionNode): Set<string> {
        const variables = new Set<string>();

        if (node.type === 'variable' && typeof node.value === 'string') {
            variables.add(node.value);
        }

        if (node.children) {
            for (const child of node.children) {
                const childVars = this.getVariables(child);
                childVars.forEach(v => variables.add(v));
            }
        }

        return variables;
    }

    private isConstant(node: ExpressionNode): boolean {
        return node.type === 'number' ||
            (node.type === 'variable' &&
                typeof node.value === 'string' &&
                ['pi', 'e', 'i'].includes(node.value.toLowerCase()));
    }

    private hasVariables(node: ExpressionNode | undefined): boolean {
        if (!node) return false;
        return this.getVariables(node).size > 0;
    }

    private containsTrigonometric(node: ExpressionNode): boolean {
        const trigFunctions = new Set([
            'sin', 'cos', 'tan', 'cot', 'sec', 'csc',
            'asin', 'acos', 'atan', 'acot', 'asec', 'acsc',
            'sinh', 'cosh', 'tanh', 'coth', 'sech', 'csch',
        ]);

        if (node.type === 'function' &&
            typeof node.value === 'string' &&
            trigFunctions.has(node.value.toLowerCase())) {
            return true;
        }

        return node.children?.some(child => this.containsTrigonometric(child)) || false;
    }

    private getTrigonometricFunctions(node: ExpressionNode): string[] {
        const trigFunctions = new Set([
            'sin', 'cos', 'tan', 'cot', 'sec', 'csc',
            'asin', 'acos', 'atan', 'acot', 'asec', 'acsc',
            'sinh', 'cosh', 'tanh', 'coth', 'sech', 'csch',
        ]);

        const functions: string[] = [];

        if (node.type === 'function' &&
            typeof node.value === 'string' &&
            trigFunctions.has(node.value.toLowerCase())) {
            functions.push(node.value);
        }

        if (node.children) {
            for (const child of node.children) {
                functions.push(...this.getTrigonometricFunctions(child));
            }
        }

        return functions;
    }

    private getLogBase(functionName: string): string {
        switch (functionName.toLowerCase()) {
            case 'ln': return 'e';
            case 'log10': return '10';
            case 'log2': return '2';
            case 'log': return '10'; // Default to base 10
            default: return 'unknown';
        }
    }

    private hasMatrixNotation(node: ExpressionNode): boolean {
        // Simplified matrix detection - would need more sophisticated logic
        return false;
    }

    private hasVectorNotation(node: ExpressionNode): boolean {
        // Simplified vector detection - would need more sophisticated logic
        return false;
    }

    private getExpressionType(node: ExpressionNode): string {
        if (this.isPolynomial(node)) {
            return 'polynomial';
        }
        if (this.containsTrigonometric(node)) {
            return 'trigonometric';
        }
        return 'general';
    }

    private isLinearEquation(node: ExpressionNode): boolean {
        if (node.type !== 'equation') return false;
        const [left, right] = node.children || [];
        return left && right &&
            this.getPolynomialDegree(left) <= 1 &&
            this.getPolynomialDegree(right) <= 1;
    }

    private isQuadraticEquation(node: ExpressionNode): boolean {
        if (node.type !== 'equation') return false;
        const [left, right] = node.children || [];
        return left && right &&
            Math.max(this.getPolynomialDegree(left), this.getPolynomialDegree(right)) === 2;
    }

    private getNodePosition(node: ExpressionNode): { start: number; end: number } {
        return node.metadata?.position || { start: 0, end: 0 };
    }
}