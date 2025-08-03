/**
 * Tests for the mathematical expression lexer
 */

import { MathLexer, TokenType } from '../../../src/core/parser/lexer.js';

describe('MathLexer', () => {
    describe('Basic tokenization', () => {
        it('should tokenize numbers', () => {
            const lexer = new MathLexer('123');
            const tokens = lexer.tokenize();

            expect(tokens).toHaveLength(2); // number + EOF
            expect(tokens[0].type).toBe(TokenType.NUMBER);
            expect(tokens[0].value).toBe('123');
        });

        it('should tokenize decimal numbers', () => {
            const lexer = new MathLexer('3.14');
            const tokens = lexer.tokenize();

            expect(tokens[0].type).toBe(TokenType.NUMBER);
            expect(tokens[0].value).toBe('3.14');
        });

        it('should tokenize scientific notation', () => {
            const lexer = new MathLexer('1.23e-4');
            const tokens = lexer.tokenize();

            expect(tokens[0].type).toBe(TokenType.NUMBER);
            expect(tokens[0].value).toBe('1.23e-4');
        });

        it('should tokenize variables', () => {
            const lexer = new MathLexer('x');
            const tokens = lexer.tokenize();

            expect(tokens[0].type).toBe(TokenType.VARIABLE);
            expect(tokens[0].value).toBe('x');
        });

        it('should tokenize functions', () => {
            const lexer = new MathLexer('sin');
            const tokens = lexer.tokenize();

            expect(tokens[0].type).toBe(TokenType.FUNCTION);
            expect(tokens[0].value).toBe('sin');
        });
    });

    describe('Operators', () => {
        it('should tokenize basic operators', () => {
            const lexer = new MathLexer('+ - * /');
            const tokens = lexer.tokenize();

            const operatorTokens = tokens.filter(t => t.type === TokenType.OPERATOR);
            expect(operatorTokens).toHaveLength(4);
            expect(operatorTokens.map(t => t.value)).toEqual(['+', '-', '*', '/']);
        });

        it('should tokenize power operators', () => {
            const lexer = new MathLexer('^ **');
            const tokens = lexer.tokenize();

            const operatorTokens = tokens.filter(t => t.type === TokenType.OPERATOR);
            expect(operatorTokens).toHaveLength(2);
            expect(operatorTokens.map(t => t.value)).toEqual(['^', '**']);
        });

        it('should tokenize comparison operators', () => {
            const lexer = new MathLexer('= < > <= >= !=');
            const tokens = lexer.tokenize();

            const comparisonTypes = [
                TokenType.EQUALS,
                TokenType.LESS_THAN,
                TokenType.GREATER_THAN,
                TokenType.LESS_EQUAL,
                TokenType.GREATER_EQUAL,
                TokenType.NOT_EQUAL,
            ];

            const comparisonTokens = tokens.filter(t => comparisonTypes.includes(t.type));
            expect(comparisonTokens).toHaveLength(6);
        });
    });

    describe('Parentheses and brackets', () => {
        it('should tokenize parentheses', () => {
            const lexer = new MathLexer('()');
            const tokens = lexer.tokenize();

            expect(tokens[0].type).toBe(TokenType.LEFT_PAREN);
            expect(tokens[1].type).toBe(TokenType.RIGHT_PAREN);
        });

        it('should tokenize brackets', () => {
            const lexer = new MathLexer('[]');
            const tokens = lexer.tokenize();

            expect(tokens[0].type).toBe(TokenType.LEFT_BRACKET);
            expect(tokens[1].type).toBe(TokenType.RIGHT_BRACKET);
        });
    });

    describe('Complex expressions', () => {
        it('should tokenize a simple expression', () => {
            const lexer = new MathLexer('2 * x + 1');
            const tokens = lexer.tokenize();

            const nonEofTokens = tokens.filter(t => t.type !== TokenType.EOF);
            expect(nonEofTokens).toHaveLength(5);

            expect(nonEofTokens[0].type).toBe(TokenType.NUMBER);
            expect(nonEofTokens[0].value).toBe('2');

            expect(nonEofTokens[1].type).toBe(TokenType.OPERATOR);
            expect(nonEofTokens[1].value).toBe('*');

            expect(nonEofTokens[2].type).toBe(TokenType.VARIABLE);
            expect(nonEofTokens[2].value).toBe('x');

            expect(nonEofTokens[3].type).toBe(TokenType.OPERATOR);
            expect(nonEofTokens[3].value).toBe('+');

            expect(nonEofTokens[4].type).toBe(TokenType.NUMBER);
            expect(nonEofTokens[4].value).toBe('1');
        });

        it('should tokenize function calls', () => {
            const lexer = new MathLexer('sin(x)');
            const tokens = lexer.tokenize();

            const nonEofTokens = tokens.filter(t => t.type !== TokenType.EOF);
            expect(nonEofTokens).toHaveLength(4);

            expect(nonEofTokens[0].type).toBe(TokenType.FUNCTION);
            expect(nonEofTokens[0].value).toBe('sin');

            expect(nonEofTokens[1].type).toBe(TokenType.LEFT_PAREN);
            expect(nonEofTokens[2].type).toBe(TokenType.VARIABLE);
            expect(nonEofTokens[3].type).toBe(TokenType.RIGHT_PAREN);
        });

        it('should tokenize equations', () => {
            const lexer = new MathLexer('x^2 + 2*x - 3 = 0');
            const tokens = lexer.tokenize();

            const equalsTokens = tokens.filter(t => t.type === TokenType.EQUALS);
            expect(equalsTokens).toHaveLength(1);

            const nonEofTokens = tokens.filter(t => t.type !== TokenType.EOF);
            expect(nonEofTokens.length).toBeGreaterThan(5);
        });
    });

    describe('Error handling', () => {
        it('should handle invalid scientific notation', () => {
            const lexer = new MathLexer('1.23e');

            expect(() => lexer.tokenize()).toThrow();
        });

        it('should handle unknown characters', () => {
            const lexer = new MathLexer('@');

            expect(() => lexer.tokenize()).toThrow();
        });
    });

    describe('Position tracking', () => {
        it('should track token positions', () => {
            const lexer = new MathLexer('x + 1');
            const tokens = lexer.tokenize();

            expect(tokens[0].position.start).toBe(0);
            expect(tokens[0].position.end).toBe(1);

            expect(tokens[1].position.start).toBe(2);
            expect(tokens[1].position.end).toBe(3);

            expect(tokens[2].position.start).toBe(4);
            expect(tokens[2].position.end).toBe(5);
        });

        it('should track line and column numbers', () => {
            const lexer = new MathLexer('x\n+ 1');
            const tokens = lexer.tokenize();

            expect(tokens[0].line).toBe(1);
            expect(tokens[0].column).toBe(1);

            expect(tokens[1].line).toBe(2);
            expect(tokens[1].column).toBe(1);
        });
    });

    describe('Static methods', () => {
        it('should identify operators', () => {
            expect(MathLexer.getOperatorInfo('+')).toBeDefined();
            expect(MathLexer.getOperatorInfo('+')).toHaveProperty('precedence');
            expect(MathLexer.getOperatorInfo('+')).toHaveProperty('associativity');
        });

        it('should identify functions', () => {
            expect(MathLexer.isFunction('sin')).toBe(true);
            expect(MathLexer.isFunction('cos')).toBe(true);
            expect(MathLexer.isFunction('unknown')).toBe(false);
        });

        it('should identify constants', () => {
            expect(MathLexer.isConstant('pi')).toBe(true);
            expect(MathLexer.isConstant('e')).toBe(true);
            expect(MathLexer.isConstant('unknown')).toBe(false);
        });
    });
});