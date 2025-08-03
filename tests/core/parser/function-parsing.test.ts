/**
 * Test various function parsing scenarios
 */

import mathrok from '../../../src/index.js';

describe('Function Parsing Tests', () => {
    it('should parse single function calls', async () => {
        const testCases = [
            { expr: 'sin(x)', expectedFunctions: ['sin'], expectedVariables: ['x'] },
            { expr: 'cos(y)', expectedFunctions: ['cos'], expectedVariables: ['y'] },
            { expr: 'tan(z)', expectedFunctions: ['tan'], expectedVariables: ['z'] },
            { expr: 'log(a)', expectedFunctions: ['log'], expectedVariables: ['a'] },
            { expr: 'sqrt(b)', expectedFunctions: ['sqrt'], expectedVariables: ['b'] },
        ];

        for (const testCase of testCases) {
            const result = await mathrok.parse(testCase.expr);

            expect(result.result.functions).toEqual(expect.arrayContaining(testCase.expectedFunctions));
            expect(result.result.variables).toEqual(expect.arrayContaining(testCase.expectedVariables));
        }
    });

    it('should parse multiple function calls', async () => {
        const result = await mathrok.parse('sin(x) + cos(y)');

        expect(result.result.functions).toEqual(expect.arrayContaining(['sin', 'cos']));
        expect(result.result.variables).toEqual(expect.arrayContaining(['x', 'y']));
    });

    it('should parse nested function calls', async () => {
        const result = await mathrok.parse('sin(cos(x))');

        expect(result.result.functions).toEqual(expect.arrayContaining(['sin', 'cos']));
        expect(result.result.variables).toEqual(expect.arrayContaining(['x']));
    });

    it('should handle implicit multiplication correctly', async () => {
        // These should still work with implicit multiplication
        const testCases = [
            { expr: '2x', expectedVariables: ['x'] },
            { expr: 'xy', expectedVariables: ['x', 'y'] },
            { expr: '3(x+1)', expectedVariables: ['x'] },
        ];

        for (const testCase of testCases) {
            const result = await mathrok.parse(testCase.expr);
            expect(result.result.variables).toEqual(expect.arrayContaining(testCase.expectedVariables));
        }
    });

    it('should not break function names with implicit multiplication', async () => {
        // These should NOT be broken up
        const result = await mathrok.parse('sin(x) + 2y');

        expect(result.result.functions).toEqual(['sin']);
        expect(result.result.variables).toEqual(expect.arrayContaining(['x', 'y']));
        expect(result.result.normalized).toBe('sin(x) + 2*y');
    });
});