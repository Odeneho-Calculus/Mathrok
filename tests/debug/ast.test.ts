/**
 * Debug test for AST building
 */

import { MathLexer, TokenType } from '../../src/core/parser/lexer.js';
import { ASTBuilder } from '../../src/core/parser/ast.js';

describe('Debug AST Building', () => {
    it('should debug AST building for "2 + 3"', () => {
        const lexer = new MathLexer('2 + 3');
        const tokens = lexer.tokenize();

        console.log('Tokens before AST building:');
        tokens.forEach((token, index) => {
            console.log(`  ${index}: ${token.type} = "${token.value}"`);
        });

        const builder = new ASTBuilder();

        try {
            const ast = builder.build(tokens);
            console.log('AST built successfully:', ast);
            expect(ast).toBeDefined();
        } catch (error) {
            console.error('AST building failed:', error.message);
            throw error;
        }
    });

    it('should debug AST building for "x + 1"', () => {
        const lexer = new MathLexer('x + 1');
        const tokens = lexer.tokenize();

        console.log('Tokens before AST building:');
        tokens.forEach((token, index) => {
            console.log(`  ${index}: ${token.type} = "${token.value}"`);
        });

        const builder = new ASTBuilder();

        try {
            const ast = builder.build(tokens);
            console.log('AST built successfully:', ast);
            expect(ast).toBeDefined();
        } catch (error) {
            console.error('AST building failed:', error.message);
            throw error;
        }
    });
});