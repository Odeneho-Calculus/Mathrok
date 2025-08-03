/**
 * Mathematical expression lexer
 * Tokenizes mathematical expressions into a stream of tokens
 */

import { MathError, MathErrorType } from '../../types/core.js';

/**
 * Token types for mathematical expressions
 */
export enum TokenType {
    NUMBER = 'NUMBER',
    VARIABLE = 'VARIABLE',
    FUNCTION = 'FUNCTION',
    OPERATOR = 'OPERATOR',
    LEFT_PAREN = 'LEFT_PAREN',
    RIGHT_PAREN = 'RIGHT_PAREN',
    LEFT_BRACKET = 'LEFT_BRACKET',
    RIGHT_BRACKET = 'RIGHT_BRACKET',
    COMMA = 'COMMA',
    EQUALS = 'EQUALS',
    LESS_THAN = 'LESS_THAN',
    GREATER_THAN = 'GREATER_THAN',
    LESS_EQUAL = 'LESS_EQUAL',
    GREATER_EQUAL = 'GREATER_EQUAL',
    NOT_EQUAL = 'NOT_EQUAL',
    WHITESPACE = 'WHITESPACE',
    EOF = 'EOF',
    UNKNOWN = 'UNKNOWN',
}

/**
 * Token representation
 */
export interface Token {
    readonly type: TokenType;
    readonly value: string;
    readonly position: { start: number; end: number };
    readonly line: number;
    readonly column: number;
}

/**
 * Operator information
 */
export interface OperatorInfo {
    readonly symbol: string;
    readonly precedence: number;
    readonly associativity: 'left' | 'right';
    readonly arity: number; // 1 for unary, 2 for binary
}

/**
 * Mathematical operators with precedence and associativity
 */
export const OPERATORS: Record<string, OperatorInfo> = {
    '+': { symbol: '+', precedence: 1, associativity: 'left', arity: 2 },
    '-': { symbol: '-', precedence: 1, associativity: 'left', arity: 2 },
    '*': { symbol: '*', precedence: 2, associativity: 'left', arity: 2 },
    '/': { symbol: '/', precedence: 2, associativity: 'left', arity: 2 },
    '^': { symbol: '^', precedence: 3, associativity: 'right', arity: 2 },
    '**': { symbol: '**', precedence: 3, associativity: 'right', arity: 2 },
    '%': { symbol: '%', precedence: 2, associativity: 'left', arity: 2 },
    '!': { symbol: '!', precedence: 4, associativity: 'left', arity: 1 },
    // Unary operators
    'u+': { symbol: '+', precedence: 4, associativity: 'right', arity: 1 },
    'u-': { symbol: '-', precedence: 4, associativity: 'right', arity: 1 },
} as const;

/**
 * Mathematical functions
 */
export const FUNCTIONS = new Set([
    'sin', 'cos', 'tan', 'cot', 'sec', 'csc',
    'asin', 'acos', 'atan', 'acot', 'asec', 'acsc',
    'sinh', 'cosh', 'tanh', 'coth', 'sech', 'csch',
    'asinh', 'acosh', 'atanh', 'acoth', 'asech', 'acsch',
    'log', 'ln', 'log10', 'log2',
    'exp', 'sqrt', 'cbrt',
    'abs', 'floor', 'ceil', 'round',
    'min', 'max',
    'gcd', 'lcm',
    'factorial',
    'gamma', 'beta',
    'erf', 'erfc',
    'integrate', 'derivative', 'diff',
    'sum', 'product',
    'limit',
    'solve',
    'simplify', 'expand', 'factor',
    'det', 'inv', 'transpose',
]);

/**
 * Mathematical constants
 */
export const CONSTANTS = new Set([
    'pi', 'e', 'i', 'infinity', 'inf',
    'euler', 'golden',
]);

/**
 * Lexical analyzer for mathematical expressions
 */
export class MathLexer {
    private readonly input: string;
    private position: number = 0;
    private line: number = 1;
    private column: number = 1;
    private readonly tokens: Token[] = [];

    constructor(input: string) {
        this.input = input.trim();
    }

    /**
     * Tokenize the input expression
     */
    public tokenize(): Token[] {
        this.position = 0;
        this.line = 1;
        this.column = 1;
        this.tokens.length = 0;

        while (this.position < this.input.length) {
            this.scanToken();
        }

        // Add EOF token
        this.addToken(TokenType.EOF, '', this.position, this.position);

        return [...this.tokens];
    }

    /**
     * Scan and identify the next token
     */
    private scanToken(): void {
        const start = this.position;
        const char = this.advance();

        switch (char) {
            case ' ':
            case '\t':
            case '\r':
                // Skip whitespace
                break;
            case '\n':
                this.line++;
                this.column = 1;
                break;
            case '(':
                this.addToken(TokenType.LEFT_PAREN, char, start, this.position);
                break;
            case ')':
                this.addToken(TokenType.RIGHT_PAREN, char, start, this.position);
                break;
            case '[':
                this.addToken(TokenType.LEFT_BRACKET, char, start, this.position);
                break;
            case ']':
                this.addToken(TokenType.RIGHT_BRACKET, char, start, this.position);
                break;
            case ',':
                this.addToken(TokenType.COMMA, char, start, this.position);
                break;
            case '=':
                if (this.match('=')) {
                    this.addToken(TokenType.EQUALS, '==', start, this.position);
                } else {
                    this.addToken(TokenType.EQUALS, char, start, this.position);
                }
                break;
            case '<':
                if (this.match('=')) {
                    this.addToken(TokenType.LESS_EQUAL, '<=', start, this.position);
                } else {
                    this.addToken(TokenType.LESS_THAN, char, start, this.position);
                }
                break;
            case '>':
                if (this.match('=')) {
                    this.addToken(TokenType.GREATER_EQUAL, '>=', start, this.position);
                } else {
                    this.addToken(TokenType.GREATER_THAN, char, start, this.position);
                }
                break;
            case '!':
                if (this.match('=')) {
                    this.addToken(TokenType.NOT_EQUAL, '!=', start, this.position);
                } else {
                    this.addToken(TokenType.OPERATOR, char, start, this.position);
                }
                break;
            case '+':
            case '-':
            case '%':
                this.addToken(TokenType.OPERATOR, char, start, this.position);
                break;
            case '*':
                if (this.match('*')) {
                    this.addToken(TokenType.OPERATOR, '**', start, this.position);
                } else {
                    this.addToken(TokenType.OPERATOR, char, start, this.position);
                }
                break;
            case '/':
                this.addToken(TokenType.OPERATOR, char, start, this.position);
                break;
            case '^':
                this.addToken(TokenType.OPERATOR, char, start, this.position);
                break;
            default:
                if (this.isDigit(char)) {
                    this.scanNumber(start);
                } else if (this.isAlpha(char)) {
                    this.scanIdentifier(start);
                } else {
                    this.addToken(TokenType.UNKNOWN, char, start, this.position);
                    throw new MathError(
                        MathErrorType.SYNTAX_ERROR,
                        `Unexpected character: ${char}`,
                        this.input,
                        { start, end: this.position }
                    );
                }
                break;
        }
    }

    /**
     * Scan a number token (integer or decimal)
     */
    private scanNumber(start: number): void {
        while (this.isDigit(this.peek())) {
            this.advance();
        }

        // Look for decimal point
        if (this.peek() === '.' && this.isDigit(this.peekNext())) {
            this.advance(); // consume '.'
            while (this.isDigit(this.peek())) {
                this.advance();
            }
        }

        // Look for scientific notation
        if (this.peek() === 'e' || this.peek() === 'E') {
            this.advance(); // consume 'e' or 'E'
            if (this.peek() === '+' || this.peek() === '-') {
                this.advance(); // consume sign
            }
            if (!this.isDigit(this.peek())) {
                throw new MathError(
                    MathErrorType.SYNTAX_ERROR,
                    'Invalid scientific notation',
                    this.input,
                    { start, end: this.position }
                );
            }
            while (this.isDigit(this.peek())) {
                this.advance();
            }
        }

        const value = this.input.substring(start, this.position);
        this.addToken(TokenType.NUMBER, value, start, this.position);
    }

    /**
     * Scan an identifier (variable, function, or constant)
     */
    private scanIdentifier(start: number): void {
        while (this.isAlphaNumeric(this.peek()) || this.peek() === '_') {
            this.advance();
        }

        const value = this.input.substring(start, this.position);
        const lowerValue = value.toLowerCase();

        // Determine token type
        let tokenType: TokenType;
        if (FUNCTIONS.has(lowerValue)) {
            tokenType = TokenType.FUNCTION;
        } else if (CONSTANTS.has(lowerValue)) {
            tokenType = TokenType.VARIABLE; // Constants are treated as special variables
        } else {
            tokenType = TokenType.VARIABLE;
        }

        this.addToken(tokenType, value, start, this.position);
    }

    /**
     * Add a token to the tokens array
     */
    private addToken(type: TokenType, value: string, start: number, end: number): void {
        this.tokens.push({
            type,
            value,
            position: { start, end },
            line: this.line,
            column: this.column - value.length,
        });
    }

    /**
     * Advance to the next character
     */
    private advance(): string {
        if (this.position >= this.input.length) {
            return '\0';
        }
        this.column++;
        return this.input.charAt(this.position++);
    }

    /**
     * Check if the current character matches the expected character
     */
    private match(expected: string): boolean {
        if (this.position >= this.input.length) {
            return false;
        }
        if (this.input.charAt(this.position) !== expected) {
            return false;
        }
        this.position++;
        this.column++;
        return true;
    }

    /**
     * Peek at the current character without advancing
     */
    private peek(): string {
        if (this.position >= this.input.length) {
            return '\0';
        }
        return this.input.charAt(this.position);
    }

    /**
     * Peek at the next character without advancing
     */
    private peekNext(): string {
        if (this.position + 1 >= this.input.length) {
            return '\0';
        }
        return this.input.charAt(this.position + 1);
    }

    /**
     * Check if character is a digit
     */
    private isDigit(char: string): boolean {
        return char >= '0' && char <= '9';
    }

    /**
     * Check if character is alphabetic
     */
    private isAlpha(char: string): boolean {
        return (char >= 'a' && char <= 'z') ||
            (char >= 'A' && char <= 'Z') ||
            char === '_';
    }

    /**
     * Check if character is alphanumeric
     */
    private isAlphaNumeric(char: string): boolean {
        return this.isAlpha(char) || this.isDigit(char);
    }

    /**
     * Get operator information
     */
    public static getOperatorInfo(operator: string): OperatorInfo | undefined {
        return OPERATORS[operator];
    }

    /**
     * Check if a string is a known function
     */
    public static isFunction(name: string): boolean {
        return FUNCTIONS.has(name.toLowerCase());
    }

    /**
     * Check if a string is a known constant
     */
    public static isConstant(name: string): boolean {
        return CONSTANTS.has(name.toLowerCase());
    }
}