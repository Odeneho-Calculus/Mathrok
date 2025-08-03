/**
 * Abstract Syntax Tree implementation for mathematical expressions
 * Builds and manipulates AST nodes for mathematical expressions
 */

import type { ExpressionNode, NodeType, NodeMetadata } from '../../types/core.js';
import { MathError, MathErrorType } from '../../types/core.js';
import type { Token, OperatorInfo } from './lexer.js';
import { TokenType, MathLexer } from './lexer.js';

/**
 * AST Node implementation
 */
export class ASTNode implements ExpressionNode {
    public readonly type: NodeType;
    public readonly value?: string | number;
    public readonly children?: readonly ExpressionNode[];
    public readonly metadata?: NodeMetadata;

    constructor(
        type: NodeType,
        value?: string | number,
        children?: readonly ExpressionNode[],
        metadata?: NodeMetadata
    ) {
        this.type = type;
        this.value = value;
        this.children = children ? [...children] : undefined;
        this.metadata = metadata;
    }

    /**
     * Create a number node
     */
    public static number(value: number, metadata?: NodeMetadata): ASTNode {
        return new ASTNode('number', value, undefined, metadata);
    }

    /**
     * Create a variable node
     */
    public static variable(name: string, metadata?: NodeMetadata): ASTNode {
        return new ASTNode('variable', name, undefined, metadata);
    }

    /**
     * Create a function node
     */
    public static function(
        name: string,
        args: readonly ExpressionNode[],
        metadata?: NodeMetadata
    ): ASTNode {
        return new ASTNode('function', name, args, metadata);
    }

    /**
     * Create an operator node
     */
    public static operator(
        operator: string,
        operands: readonly ExpressionNode[],
        metadata?: NodeMetadata
    ): ASTNode {
        return new ASTNode('operator', operator, operands, metadata);
    }

    /**
     * Create an equation node
     */
    public static equation(
        left: ExpressionNode,
        right: ExpressionNode,
        metadata?: NodeMetadata
    ): ASTNode {
        return new ASTNode('equation', '=', [left, right], metadata);
    }

    /**
     * Create an inequality node
     */
    public static inequality(
        operator: string,
        left: ExpressionNode,
        right: ExpressionNode,
        metadata?: NodeMetadata
    ): ASTNode {
        return new ASTNode('inequality', operator, [left, right], metadata);
    }

    /**
     * Clone this node
     */
    public clone(): ASTNode {
        const clonedChildren = this.children?.map(child =>
            child instanceof ASTNode ? child.clone() : child
        );
        return new ASTNode(this.type, this.value, clonedChildren, this.metadata);
    }

    /**
     * Get all variables in this subtree
     */
    public getVariables(): Set<string> {
        const variables = new Set<string>();

        if (this.type === 'variable' && typeof this.value === 'string') {
            variables.add(this.value);
        }

        if (this.children) {
            for (const child of this.children) {
                if (child instanceof ASTNode) {
                    const childVars = child.getVariables();
                    childVars.forEach(v => variables.add(v));
                }
            }
        }

        return variables;
    }

    /**
     * Get all functions in this subtree
     */
    public getFunctions(): Set<string> {
        const functions = new Set<string>();

        if (this.type === 'function' && typeof this.value === 'string') {
            functions.add(this.value);
        }

        if (this.children) {
            for (const child of this.children) {
                if (child instanceof ASTNode) {
                    const childFuncs = child.getFunctions();
                    childFuncs.forEach(f => functions.add(f));
                }
            }
        }

        return functions;
    }

    /**
     * Calculate complexity score for this subtree
     */
    public getComplexity(): number {
        let complexity = 1;

        // Add complexity based on node type
        switch (this.type) {
            case 'number':
                complexity = 0.5;
                break;
            case 'variable':
                complexity = 1;
                break;
            case 'operator':
                complexity = 1.5;
                break;
            case 'function':
                complexity = 2;
                break;
            case 'equation':
            case 'inequality':
                complexity = 3;
                break;
        }

        // Add complexity from children
        if (this.children) {
            for (const child of this.children) {
                if (child instanceof ASTNode) {
                    complexity += child.getComplexity();
                }
            }
        }

        return complexity;
    }

    /**
     * Convert to string representation
     */
    public toString(): string {
        switch (this.type) {
            case 'number':
            case 'variable':
                return String(this.value);

            case 'function':
                if (!this.children || this.children.length === 0) {
                    return `${this.value}()`;
                }
                const args = this.children.map(child =>
                    child instanceof ASTNode ? child.toString() : String(child)
                ).join(', ');
                return `${this.value}(${args})`;

            case 'operator':
                if (!this.children) {
                    return String(this.value);
                }

                if (this.children.length === 1) {
                    // Unary operator
                    const operand = this.children[0];
                    const operandStr = operand instanceof ASTNode ? operand.toString() : String(operand);
                    return `${this.value}${operandStr}`;
                } else if (this.children.length === 2) {
                    // Binary operator
                    const left = this.children[0];
                    const right = this.children[1];
                    const leftStr = left instanceof ASTNode ? left.toString() : String(left);
                    const rightStr = right instanceof ASTNode ? right.toString() : String(right);

                    // Add parentheses if needed based on precedence
                    return `${leftStr} ${this.value} ${rightStr}`;
                }
                break;

            case 'equation':
                if (this.children && this.children.length === 2) {
                    const left = this.children[0];
                    const right = this.children[1];
                    const leftStr = left instanceof ASTNode ? left.toString() : String(left);
                    const rightStr = right instanceof ASTNode ? right.toString() : String(right);
                    return `${leftStr} = ${rightStr}`;
                }
                break;

            case 'inequality':
                if (this.children && this.children.length === 2) {
                    const left = this.children[0];
                    const right = this.children[1];
                    const leftStr = left instanceof ASTNode ? left.toString() : String(left);
                    const rightStr = right instanceof ASTNode ? right.toString() : String(right);
                    return `${leftStr} ${this.value} ${rightStr}`;
                }
                break;
        }

        return `[${this.type}:${this.value}]`;
    }
}

/**
 * AST Builder using recursive descent parsing
 */
export class ASTBuilder {
    private tokens: Token[] = [];
    private current: number = 0;

    /**
     * Build AST from tokens
     */
    public build(tokens: Token[]): ASTNode {
        this.tokens = tokens.filter(token => token.type !== TokenType.WHITESPACE);
        this.current = 0;

        if (this.tokens.length === 0 || (this.tokens.length === 1 && this.tokens[0].type === TokenType.EOF)) {
            throw new MathError(
                MathErrorType.PARSE_ERROR,
                'Empty expression',
                ''
            );
        }

        const ast = this.parseExpression();

        if (!this.isAtEnd()) {
            const token = this.peek();
            throw new MathError(
                MathErrorType.SYNTAX_ERROR,
                `Unexpected token: ${token.value}`,
                '',
                token.position
            );
        }

        return ast;
    }

    /**
     * Parse expression (handles equations and inequalities)
     */
    private parseExpression(): ASTNode {
        let expr = this.parseComparison();

        while (this.match(TokenType.EQUALS)) {
            const operator = this.previous();
            const right = this.parseComparison();
            expr = ASTNode.equation(expr, right, {
                position: operator.position,
            });
        }

        return expr;
    }

    /**
     * Parse comparison operators
     */
    private parseComparison(): ASTNode {
        let expr = this.parseAddition();

        while (this.match(TokenType.LESS_THAN, TokenType.GREATER_THAN,
            TokenType.LESS_EQUAL, TokenType.GREATER_EQUAL,
            TokenType.NOT_EQUAL)) {
            const operator = this.previous();
            const right = this.parseAddition();
            expr = ASTNode.inequality(operator.value, expr, right, {
                position: operator.position,
            });
        }

        return expr;
    }

    /**
     * Parse addition and subtraction
     */
    private parseAddition(): ASTNode {
        let expr = this.parseMultiplication();

        while (this.check(TokenType.OPERATOR) &&
            (this.peek().value === '+' || this.peek().value === '-')) {
            const operator = this.advance();
            const right = this.parseMultiplication();
            expr = ASTNode.operator(operator.value, [expr, right], {
                position: operator.position,
                precedence: MathLexer.getOperatorInfo(operator.value)?.precedence,
                associativity: MathLexer.getOperatorInfo(operator.value)?.associativity,
            });
        }

        return expr;
    }

    /**
     * Parse multiplication, division, and modulo
     */
    private parseMultiplication(): ASTNode {
        let expr = this.parseExponentiation();

        while (this.check(TokenType.OPERATOR) &&
            ['*', '/', '%'].includes(this.peek().value)) {
            const operator = this.advance();
            const right = this.parseExponentiation();
            expr = ASTNode.operator(operator.value, [expr, right], {
                position: operator.position,
                precedence: MathLexer.getOperatorInfo(operator.value)?.precedence,
                associativity: MathLexer.getOperatorInfo(operator.value)?.associativity,
            });
        }

        return expr;
    }

    /**
     * Parse exponentiation (right-associative)
     */
    private parseExponentiation(): ASTNode {
        let expr = this.parseUnary();

        if (this.check(TokenType.OPERATOR) &&
            (this.peek().value === '^' || this.peek().value === '**')) {
            const operator = this.advance();
            const right = this.parseExponentiation(); // Right-associative
            expr = ASTNode.operator(operator.value === '**' ? '^' : operator.value, [expr, right], {
                position: operator.position,
                precedence: MathLexer.getOperatorInfo(operator.value)?.precedence,
                associativity: MathLexer.getOperatorInfo(operator.value)?.associativity,
            });
        }

        return expr;
    }

    /**
     * Parse unary operators
     */
    private parseUnary(): ASTNode {
        if (this.check(TokenType.OPERATOR) &&
            (this.peek().value === '+' || this.peek().value === '-')) {
            const operator = this.advance();
            const expr = this.parseUnary();
            return ASTNode.operator(`u${operator.value}`, [expr], {
                position: operator.position,
                precedence: 4, // High precedence for unary operators
                associativity: 'right',
            });
        }

        return this.parsePostfix();
    }

    /**
     * Parse postfix operators (like factorial)
     */
    private parsePostfix(): ASTNode {
        let expr = this.parsePrimary();

        while (this.check(TokenType.OPERATOR) && this.peek().value === '!') {
            const operator = this.advance();
            expr = ASTNode.operator(operator.value, [expr], {
                position: operator.position,
                precedence: MathLexer.getOperatorInfo(operator.value)?.precedence,
                associativity: MathLexer.getOperatorInfo(operator.value)?.associativity,
            });
        }

        return expr;
    }

    /**
     * Parse primary expressions (numbers, variables, functions, parentheses)
     */
    private parsePrimary(): ASTNode {
        if (this.match(TokenType.NUMBER)) {
            const token = this.previous();
            return ASTNode.number(parseFloat(token.value), {
                position: token.position,
            });
        }

        if (this.match(TokenType.VARIABLE)) {
            const token = this.previous();
            return ASTNode.variable(token.value, {
                position: token.position,
            });
        }

        if (this.match(TokenType.FUNCTION)) {
            const functionToken = this.previous();

            if (!this.check(TokenType.LEFT_PAREN)) {
                throw new MathError(
                    MathErrorType.SYNTAX_ERROR,
                    `Expected '(' after function name: ${functionToken.value}`,
                    '',
                    functionToken.position
                );
            }

            this.consume(TokenType.LEFT_PAREN, "Expected '(' after function name");

            const args: ASTNode[] = [];
            if (!this.check(TokenType.RIGHT_PAREN)) {
                do {
                    args.push(this.parseExpression());
                } while (this.match(TokenType.COMMA));
            }

            this.consume(TokenType.RIGHT_PAREN, "Expected ')' after function arguments");

            return ASTNode.function(functionToken.value, args, {
                position: functionToken.position,
            });
        }

        if (this.match(TokenType.LEFT_PAREN)) {
            const expr = this.parseExpression();
            this.consume(TokenType.RIGHT_PAREN, "Expected ')' after expression");
            return expr;
        }

        const token = this.peek();
        throw new MathError(
            MathErrorType.SYNTAX_ERROR,
            `Unexpected token: ${token.value}`,
            '',
            token.position
        );
    }

    /**
     * Check if current token matches any of the given types
     */
    private match(...types: TokenType[]): boolean {
        for (const type of types) {
            if (this.check(type)) {
                this.advance();
                return true;
            }
        }
        return false;
    }

    /**
     * Check if current token is of given type
     */
    private check(type: TokenType): boolean {
        if (this.isAtEnd()) {
            return false;
        }
        return this.peek().type === type;
    }

    /**
     * Advance to next token
     */
    private advance(): Token {
        if (!this.isAtEnd()) {
            this.current++;
        }
        return this.previous();
    }

    /**
     * Check if at end of tokens
     */
    private isAtEnd(): boolean {
        return this.peek().type === TokenType.EOF;
    }

    /**
     * Get current token
     */
    private peek(): Token {
        return this.tokens[this.current] || {
            type: TokenType.EOF,
            value: '',
            position: { start: 0, end: 0 },
            line: 1,
            column: 1
        };
    }

    /**
     * Get previous token
     */
    private previous(): Token {
        return this.tokens[this.current - 1];
    }

    /**
     * Consume token of expected type or throw error
     */
    private consume(type: TokenType, message: string): Token {
        if (this.check(type)) {
            return this.advance();
        }

        const token = this.peek();
        throw new MathError(
            MathErrorType.SYNTAX_ERROR,
            message,
            '',
            token.position
        );
    }
}