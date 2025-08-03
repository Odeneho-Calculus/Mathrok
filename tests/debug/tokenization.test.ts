/**
 * Debug test for tokenization
 */

import { MathLexer, TokenType } from '../../src/core/parser/lexer.js';

describe('Debug Tokenization', () => {
    it('should debug tokenization of "2 + 3"', () => {
        const lexer = new MathLexer('2 + 3');
        const tokens = lexer.tokenize();

        // Check what tokens we actually get
        expect(tokens.length).toBe(4); // 2, +, 3, EOF
        expect(tokens[0].type).toBe(TokenType.NUMBER);
        expect(tokens[0].value).toBe('2');
        expect(tokens[1].type).toBe(TokenType.OPERATOR);
        expect(tokens[1].value).toBe('+');
        expect(tokens[2].type).toBe(TokenType.NUMBER);
        expect(tokens[2].value).toBe('3');
        expect(tokens[3].type).toBe(TokenType.EOF);
    });

    it('should debug tokenization of "x + 1"', () => {
        const lexer = new MathLexer('x + 1');
        const tokens = lexer.tokenize();

        // Check what tokens we actually get
        expect(tokens.length).toBe(4); // x, +, 1, EOF
        expect(tokens[0].type).toBe(TokenType.VARIABLE);
        expect(tokens[0].value).toBe('x');
        expect(tokens[1].type).toBe(TokenType.OPERATOR);
        expect(tokens[1].value).toBe('+');
        expect(tokens[2].type).toBe(TokenType.NUMBER);
        expect(tokens[2].value).toBe('1');
        expect(tokens[3].type).toBe(TokenType.EOF);
    });

    it('should debug tokenization of "sin(x)"', () => {
        const lexer = new MathLexer('sin(x)');
        const tokens = lexer.tokenize();

        // Check what tokens we actually get for function calls
        expect(tokens.length).toBe(5); // sin, (, x, ), EOF
        expect(tokens[0].type).toBe(TokenType.FUNCTION);
        expect(tokens[0].value).toBe('sin');
        expect(tokens[1].type).toBe(TokenType.LEFT_PAREN);
        expect(tokens[2].type).toBe(TokenType.VARIABLE);
        expect(tokens[2].value).toBe('x');
        expect(tokens[3].type).toBe(TokenType.RIGHT_PAREN);
        expect(tokens[4].type).toBe(TokenType.EOF);
    });
});