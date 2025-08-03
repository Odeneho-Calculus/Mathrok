/**
 * Expression validator
 * Validates mathematical expressions for syntax and semantic correctness
 */

import type { ValidationResult, MathConfig } from '../../types/core.js';
import { MathError, MathErrorType } from '../../types/core.js';
import type { Token } from './lexer.js';
import { TokenType, MathLexer } from './lexer.js';

/**
 * Validation rule interface
 */
interface ValidationRule {
    readonly name: string;
    readonly check: (tokens: readonly Token[], config: MathConfig) => ValidationIssue[];
}

/**
 * Validation issue
 */
interface ValidationIssue {
    readonly type: 'error' | 'warning';
    readonly message: string;
    readonly position?: { start: number; end: number };
    readonly suggestions?: readonly string[];
}

/**
 * Expression validator
 */
export class ExpressionValidator {
    private readonly rules: ValidationRule[];

    constructor() {
        this.rules = [
            this.createParenthesesRule(),
            this.createBracketsRule(),
            this.createOperatorRule(),
            this.createFunctionRule(),
            this.createNumberRule(),
            this.createVariableRule(),
            this.createComplexityRule(),
        ];
    }

    /**
     * Validate tokens
     */
    public async validate(tokens: readonly Token[], config: MathConfig): Promise<ValidationResult> {
        const errors: MathError[] = [];
        const warnings: string[] = [];
        const suggestions: string[] = [];

        // Run all validation rules
        for (const rule of this.rules) {
            try {
                const issues = rule.check(tokens, config);

                for (const issue of issues) {
                    if (issue.type === 'error') {
                        errors.push(new MathError(
                            MathErrorType.SYNTAX_ERROR,
                            issue.message,
                            '',
                            issue.position,
                            issue.suggestions
                        ));
                    } else {
                        warnings.push(issue.message);
                        if (issue.suggestions) {
                            suggestions.push(...issue.suggestions);
                        }
                    }
                }
            } catch (error) {
                errors.push(new MathError(
                    MathErrorType.SYNTAX_ERROR,
                    `Validation rule '${rule.name}' failed: ${(error as Error).message}`
                ));
            }
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings,
            suggestions: [...new Set(suggestions)], // Remove duplicates
        };
    }

    /**
     * Create parentheses validation rule
     */
    private createParenthesesRule(): ValidationRule {
        return {
            name: 'parentheses',
            check: (tokens) => {
                const issues: ValidationIssue[] = [];
                let parenCount = 0;
                const parenStack: Token[] = [];

                for (const token of tokens) {
                    if (token.type === TokenType.LEFT_PAREN) {
                        parenCount++;
                        parenStack.push(token);
                    } else if (token.type === TokenType.RIGHT_PAREN) {
                        parenCount--;
                        if (parenCount < 0) {
                            issues.push({
                                type: 'error',
                                message: 'Unmatched closing parenthesis',
                                position: token.position,
                                suggestions: ['Remove the extra closing parenthesis'],
                            });
                        } else {
                            parenStack.pop();
                        }
                    }
                }

                if (parenCount > 0) {
                    const lastOpen = parenStack[parenStack.length - 1];
                    issues.push({
                        type: 'error',
                        message: 'Unmatched opening parenthesis',
                        position: lastOpen?.position,
                        suggestions: ['Add missing closing parenthesis'],
                    });
                }

                return issues;
            },
        };
    }

    /**
     * Create brackets validation rule
     */
    private createBracketsRule(): ValidationRule {
        return {
            name: 'brackets',
            check: (tokens) => {
                const issues: ValidationIssue[] = [];
                let bracketCount = 0;
                const bracketStack: Token[] = [];

                for (const token of tokens) {
                    if (token.type === TokenType.LEFT_BRACKET) {
                        bracketCount++;
                        bracketStack.push(token);
                    } else if (token.type === TokenType.RIGHT_BRACKET) {
                        bracketCount--;
                        if (bracketCount < 0) {
                            issues.push({
                                type: 'error',
                                message: 'Unmatched closing bracket',
                                position: token.position,
                                suggestions: ['Remove the extra closing bracket'],
                            });
                        } else {
                            bracketStack.pop();
                        }
                    }
                }

                if (bracketCount > 0) {
                    const lastOpen = bracketStack[bracketStack.length - 1];
                    issues.push({
                        type: 'error',
                        message: 'Unmatched opening bracket',
                        position: lastOpen?.position,
                        suggestions: ['Add missing closing bracket'],
                    });
                }

                return issues;
            },
        };
    }

    /**
     * Create operator validation rule
     */
    private createOperatorRule(): ValidationRule {
        return {
            name: 'operators',
            check: (tokens) => {
                const issues: ValidationIssue[] = [];
                let lastToken: Token | null = null;

                for (let i = 0; i < tokens.length; i++) {
                    const token = tokens[i];

                    if (token.type === TokenType.OPERATOR) {
                        // Check for consecutive operators
                        if (lastToken?.type === TokenType.OPERATOR) {
                            // Allow unary operators after binary operators
                            if (!this.isUnaryOperator(token.value) ||
                                !this.isBinaryOperator(lastToken.value)) {
                                issues.push({
                                    type: 'error',
                                    message: `Consecutive operators: ${lastToken.value} ${token.value}`,
                                    position: token.position,
                                    suggestions: ['Remove one of the operators or add operand between them'],
                                });
                            }
                        }

                        // Check for operators at start/end
                        if (i === 0 && !this.isUnaryOperator(token.value)) {
                            issues.push({
                                type: 'error',
                                message: `Binary operator '${token.value}' at start of expression`,
                                position: token.position,
                                suggestions: ['Add operand before the operator'],
                            });
                        }

                        if (i === tokens.length - 1 && token.value !== '!') {
                            issues.push({
                                type: 'error',
                                message: `Operator '${token.value}' at end of expression`,
                                position: token.position,
                                suggestions: ['Add operand after the operator'],
                            });
                        }
                    }

                    if (token.type !== TokenType.WHITESPACE) {
                        lastToken = token;
                    }
                }

                return issues;
            },
        };
    }

    /**
     * Create function validation rule
     */
    private createFunctionRule(): ValidationRule {
        return {
            name: 'functions',
            check: (tokens) => {
                const issues: ValidationIssue[] = [];

                for (let i = 0; i < tokens.length; i++) {
                    const token = tokens[i];

                    if (token.type === TokenType.FUNCTION) {
                        // Check if function is followed by parentheses
                        const nextToken = tokens[i + 1];
                        if (!nextToken || nextToken.type !== TokenType.LEFT_PAREN) {
                            issues.push({
                                type: 'error',
                                message: `Function '${token.value}' must be followed by parentheses`,
                                position: token.position,
                                suggestions: [`Add parentheses: ${token.value}()`],
                            });
                        }

                        // Check if function is known
                        if (!MathLexer.isFunction(token.value)) {
                            issues.push({
                                type: 'warning',
                                message: `Unknown function: ${token.value}`,
                                position: token.position,
                                suggestions: ['Check function name spelling'],
                            });
                        }
                    }
                }

                return issues;
            },
        };
    }

    /**
     * Create number validation rule
     */
    private createNumberRule(): ValidationRule {
        return {
            name: 'numbers',
            check: (tokens) => {
                const issues: ValidationIssue[] = [];

                for (const token of tokens) {
                    if (token.type === TokenType.NUMBER) {
                        const value = parseFloat(token.value);

                        // Check for invalid numbers
                        if (isNaN(value)) {
                            issues.push({
                                type: 'error',
                                message: `Invalid number: ${token.value}`,
                                position: token.position,
                                suggestions: ['Check number format'],
                            });
                        }

                        // Check for very large numbers
                        if (Math.abs(value) > Number.MAX_SAFE_INTEGER) {
                            issues.push({
                                type: 'warning',
                                message: `Very large number may lose precision: ${token.value}`,
                                position: token.position,
                                suggestions: ['Consider using scientific notation'],
                            });
                        }

                        // Check for very small numbers
                        if (value !== 0 && Math.abs(value) < Number.MIN_VALUE) {
                            issues.push({
                                type: 'warning',
                                message: `Very small number may underflow: ${token.value}`,
                                position: token.position,
                                suggestions: ['Consider using scientific notation'],
                            });
                        }
                    }
                }

                return issues;
            },
        };
    }

    /**
     * Create variable validation rule
     */
    private createVariableRule(): ValidationRule {
        return {
            name: 'variables',
            check: (tokens, config) => {
                const issues: ValidationIssue[] = [];
                const variables = new Set<string>();

                for (const token of tokens) {
                    if (token.type === TokenType.VARIABLE) {
                        variables.add(token.value);

                        // Check variable name length
                        if (token.value.length > 20) {
                            issues.push({
                                type: 'warning',
                                message: `Very long variable name: ${token.value}`,
                                position: token.position,
                                suggestions: ['Consider using shorter variable names'],
                            });
                        }

                        // Check for reserved words
                        const reservedWords = ['undefined', 'null', 'true', 'false', 'NaN', 'Infinity'];
                        if (reservedWords.includes(token.value)) {
                            issues.push({
                                type: 'warning',
                                message: `Variable name '${token.value}' is a reserved word`,
                                position: token.position,
                                suggestions: ['Use a different variable name'],
                            });
                        }
                    }
                }

                // Check total number of variables
                const maxVariables = config.maxVariables || 100;
                if (variables.size > maxVariables) {
                    issues.push({
                        type: 'warning',
                        message: `Too many variables (${variables.size}), maximum recommended: ${maxVariables}`,
                        suggestions: ['Consider simplifying the expression'],
                    });
                }

                return issues;
            },
        };
    }

    /**
     * Create complexity validation rule
     */
    private createComplexityRule(): ValidationRule {
        return {
            name: 'complexity',
            check: (tokens, config) => {
                const issues: ValidationIssue[] = [];

                // Simple complexity estimation based on token count
                const complexity = tokens.length;
                const maxComplexity = config.maxComplexity || 1000;

                if (complexity > maxComplexity) {
                    issues.push({
                        type: 'warning',
                        message: `Expression is very complex (${complexity} tokens)`,
                        suggestions: ['Consider breaking into smaller expressions'],
                    });
                }

                return issues;
            },
        };
    }

    /**
     * Check if operator is unary
     */
    private isUnaryOperator(operator: string): boolean {
        return ['+', '-', '!'].includes(operator);
    }

    /**
     * Check if operator is binary
     */
    private isBinaryOperator(operator: string): boolean {
        return ['+', '-', '*', '/', '^', '**', '%'].includes(operator);
    }
}