/**
 * Mathematical expression parser
 * Main parser implementation combining lexer and AST builder
 */

import type {
    MathExpression,
    MathConfig,
    ValidationResult,
    MathResult,
} from '../../types/core.js';
import type { ParseResult, MathStructure, StructureType } from '../../types/api.js';
import { MathError, MathErrorType } from '../../types/core.js';
import { MathLexer, TokenType } from './lexer.js';
import { ASTBuilder, ASTNode } from './ast.js';
import { ExpressionValidator } from './validator.js';
import { StructureAnalyzer } from './analyzer.js';

/**
 * Main mathematical expression parser
 */
export class MathParser {
    private readonly config: MathConfig;
    private readonly lexer: MathLexer;
    private readonly astBuilder: ASTBuilder;
    private readonly validator: ExpressionValidator;
    private readonly analyzer: StructureAnalyzer;

    constructor(config: MathConfig) {
        this.config = config;
        this.lexer = new MathLexer(''); // Will be set per parse
        this.astBuilder = new ASTBuilder();
        this.validator = new ExpressionValidator();
        this.analyzer = new StructureAnalyzer();
    }

    /**
     * Parse a mathematical expression
     */
    public async parse(expression: string, config?: Partial<MathConfig>): Promise<ParseResult> {
        const startTime = performance.now();
        const finalConfig = { ...this.config, ...config };

        try {
            // Validate input
            if (!expression || typeof expression !== 'string') {
                throw new MathError(
                    MathErrorType.PARSE_ERROR,
                    'Expression must be a non-empty string',
                    expression
                );
            }

            if (expression.length > (finalConfig.maxExpressionLength || 10000)) {
                throw new MathError(
                    MathErrorType.PARSE_ERROR,
                    'Expression too long',
                    expression
                );
            }

            // Normalize expression
            const normalized = this.normalizeExpression(expression);

            // Tokenize
            const lexer = new MathLexer(normalized);
            const tokens = lexer.tokenize();

            // Validate tokens
            const validation = await this.validator.validate(tokens, finalConfig);
            if (!validation.isValid && validation.errors.length > 0) {
                throw validation.errors[0];
            }

            // Build AST
            const ast = this.astBuilder.build(tokens);

            // Extract variables and functions
            const variables = Array.from(ast.getVariables());
            const functions = Array.from(ast.getFunctions());

            // Calculate complexity
            const complexity = Math.min(100, ast.getComplexity());

            // Create math expression
            const mathExpression: MathExpression = {
                raw: expression,
                normalized,
                ast,
                variables,
                functions,
                complexity,
            };

            // Analyze mathematical structures
            const structures = await this.analyzer.analyze(ast);

            // Create result
            const result: ParseResult = {
                result: mathExpression,
                steps: [{
                    id: 'parse',
                    description: 'Parsed mathematical expression',
                    operation: 'parsing' as any,
                    before: expression,
                    after: normalized,
                    explanation: 'Expression successfully parsed and validated',
                }],
                metadata: {
                    computationTime: performance.now() - startTime,
                    method: 'recursive_descent',
                    confidence: validation.isValid ? 1 : 0.8,
                    isExact: finalConfig.exact !== false,
                },
                validation,
                structures,
            };

            return result;

        } catch (error) {
            if (error instanceof MathError) {
                throw error;
            }

            throw new MathError(
                MathErrorType.PARSE_ERROR,
                `Failed to parse expression: ${(error as Error).message}`,
                expression
            );
        }
    }

    /**
     * Parse multiple expressions
     */
    public async parseMultiple(expressions: readonly string[]): Promise<ParseResult[]> {
        const results: ParseResult[] = [];

        for (const expression of expressions) {
            try {
                const result = await this.parse(expression);
                results.push(result);
            } catch (error) {
                // Continue with other expressions, but include error in results
                results.push({
                    result: {
                        raw: expression,
                        normalized: expression,
                        variables: [],
                        functions: [],
                        complexity: 0,
                    },
                    steps: [],
                    metadata: {
                        computationTime: 0,
                        method: 'error',
                        confidence: 0,
                        isExact: false,
                    },
                    validation: {
                        isValid: false,
                        errors: [error instanceof MathError ? error : new MathError(
                            MathErrorType.PARSE_ERROR,
                            (error as Error).message,
                            expression
                        )],
                        warnings: [],
                        suggestions: [],
                    },
                    structures: [],
                });
            }
        }

        return results;
    }

    /**
     * Validate expression without full parsing
     */
    public async validate(expression: string): Promise<ValidationResult> {
        try {
            const normalized = this.normalizeExpression(expression);
            const lexer = new MathLexer(normalized);
            const tokens = lexer.tokenize();
            return await this.validator.validate(tokens, this.config);
        } catch (error) {
            return {
                isValid: false,
                errors: [error instanceof MathError ? error : new MathError(
                    MathErrorType.PARSE_ERROR,
                    (error as Error).message,
                    expression
                )],
                warnings: [],
                suggestions: [],
            };
        }
    }

    /**
     * Get expression complexity score
     */
    public async getComplexity(expression: string): Promise<number> {
        try {
            const result = await this.parse(expression);
            return result.result.complexity;
        } catch {
            return 0;
        }
    }

    /**
     * Extract variables from expression
     */
    public async getVariables(expression: string): Promise<string[]> {
        try {
            const result = await this.parse(expression);
            return result.result.variables;
        } catch {
            return [];
        }
    }

    /**
     * Extract functions from expression
     */
    public async getFunctions(expression: string): Promise<string[]> {
        try {
            const result = await this.parse(expression);
            return result.result.functions;
        } catch {
            return [];
        }
    }

    /**
     * Normalize mathematical expression
     */
    private normalizeExpression(expression: string): string {
        let normalized = expression.trim();

        // Replace common mathematical symbols
        const replacements: Record<string, string> = {
            '×': '*',
            '÷': '/',
            '²': '^2',
            '³': '^3',
            '√': 'sqrt',
            '∞': 'infinity',
            'π': 'pi',
            '∑': 'sum',
            '∏': 'product',
            '∫': 'integrate',
            '∂': 'derivative',
            '≤': '<=',
            '≥': '>=',
            '≠': '!=',
            '≈': '==',
        };

        for (const [symbol, replacement] of Object.entries(replacements)) {
            normalized = normalized.replace(new RegExp(symbol, 'g'), replacement);
        }

        // Handle implicit multiplication
        normalized = this.addImplicitMultiplication(normalized);

        // Normalize whitespace
        normalized = normalized.replace(/\s+/g, ' ').trim();

        return normalized;
    }

    /**
     * Add implicit multiplication operators
     */
    private addImplicitMultiplication(expression: string): string {
        let result = expression;

        // Common mathematical function names that should not be split
        const functionNames = [
            'sin', 'cos', 'tan', 'sec', 'csc', 'cot',
            'asin', 'acos', 'atan', 'asec', 'acsc', 'acot',
            'sinh', 'cosh', 'tanh', 'sech', 'csch', 'coth',
            'asinh', 'acosh', 'atanh', 'asech', 'acsch', 'acoth',
            'log', 'ln', 'exp', 'sqrt', 'cbrt', 'abs', 'floor', 'ceil', 'round',
            'max', 'min', 'sum', 'product', 'integrate', 'derivative', 'limit',
            'gamma', 'beta', 'erf', 'erfc', 'factorial'
        ];

        // Create a pattern that matches function names followed by parentheses
        const functionPattern = new RegExp(`\\b(${functionNames.join('|')})\\s*\\(`, 'gi');
        const functionMatches: Array<{ match: string; start: number; end: number }> = [];

        let match;
        while ((match = functionPattern.exec(result)) !== null) {
            functionMatches.push({
                match: match[0],
                start: match.index,
                end: match.index + match[1].length // Only protect the function name, not the parenthesis
            });
        }

        // Number followed by variable: 2x -> 2*x (but not if x is part of a function)
        result = result.replace(/(\d)([a-zA-Z])/g, (fullMatch, num, letter, offset) => {
            // Check if this letter is part of a protected function name
            for (const func of functionMatches) {
                if (offset + 1 >= func.start && offset + 1 < func.end) {
                    return fullMatch; // Don't modify if it's part of a function
                }
            }
            return `${num}*${letter}`;
        });

        // Variable followed by number: x2 -> x*2 (but not if x is part of a function)
        result = result.replace(/([a-zA-Z])(\d)/g, (fullMatch, letter, num, offset) => {
            // Check if this letter is part of a protected function name
            for (const func of functionMatches) {
                if (offset >= func.start && offset < func.end) {
                    return fullMatch; // Don't modify if it's part of a function
                }
            }
            return `${letter}*${num}`;
        });

        // Variable followed by variable: xy -> x*y (but not if part of a function name)
        result = result.replace(/([a-zA-Z])([a-zA-Z])/g, (fullMatch, letter1, letter2, offset) => {
            // Check if either letter is part of a protected function name
            for (const func of functionMatches) {
                if ((offset >= func.start && offset < func.end) ||
                    (offset + 1 >= func.start && offset + 1 < func.end)) {
                    return fullMatch; // Don't modify if it's part of a function
                }
            }
            return `${letter1}*${letter2}`;
        });

        // Number/variable followed by parentheses: 2(x+1) -> 2*(x+1)
        // But NOT function names followed by parentheses: sin(x) should stay sin(x)
        result = result.replace(/(\d|\w)\(/g, (fullMatch, charBefore, offset) => {
            // Check if this character is part of a protected function name
            for (const func of functionMatches) {
                if (offset >= func.start && offset < func.end) {
                    return fullMatch; // Don't modify if it's part of a function
                }
            }
            return `${charBefore}*(`;
        });

        // Parentheses followed by number/variable: (x+1)2 -> (x+1)*2
        result = result.replace(/\)(\d|\w)/g, ')*$1');

        // Parentheses followed by parentheses: (x+1)(x-1) -> (x+1)*(x-1)
        result = result.replace(/\)\(/g, ')*(');

        return result;
    }

    /**
     * Get parser configuration
     */
    public getConfig(): MathConfig {
        return { ...this.config };
    }

    /**
     * Update parser configuration
     */
    public updateConfig(config: Partial<MathConfig>): void {
        Object.assign(this.config as any, config);
    }
}