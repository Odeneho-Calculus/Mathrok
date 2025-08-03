/**
 * Debug test for function parsing
 */

import { MathLexer, TokenType } from '../../src/core/parser/lexer.js';
import { ASTBuilder } from '../../src/core/parser/ast.js';

describe('Debug Function Parsing', () => {
    it('should debug function parsing for "sin(x)"', () => {
        const lexer = new MathLexer('sin(x)');
        const tokens = lexer.tokenize();

        console.log('Tokens:');
        tokens.forEach((token, index) => {
            console.log(`  ${index}: ${token.type} = "${token.value}"`);
        });

        const builder = new ASTBuilder();
        const ast = builder.build(tokens);

        console.log('AST:', JSON.stringify(ast, null, 2));
        console.log('Functions found:', Array.from(ast.getFunctions()));
        console.log('Variables found:', Array.from(ast.getVariables()));

        expect(ast.getFunctions().has('sin')).toBe(true);
        expect(ast.getVariables().has('x')).toBe(true);
    });
});