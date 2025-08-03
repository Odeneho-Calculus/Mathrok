/**
 * Basic Operations Example
 *
 * This example demonstrates the basic mathematical operations
 * available in the Mathrok library.
 */

// Import the library (Node.js)
// const { Mathrok } = require('mathrok');

// For browser, the library is already available as a global variable

// Initialize the library
const mathrok = new Mathrok();

// Basic operations
async function runBasicOperations() {
    try {
        console.log('Mathrok Basic Operations Example');
        console.log('--------------------------------');

        // 1. Evaluate an expression
        console.log('\n1. Evaluating expressions:');
        const evalResult = mathrok.evaluate('2 + 3 * 4');
        console.log(`2 + 3 * 4 = ${evalResult.result}`);

        const evalWithVars = mathrok.evaluate('x^2 + y', { x: 3, y: 4 });
        console.log(`x^2 + y (with x=3, y=4) = ${evalWithVars.result}`);

        // 2. Simplify an expression
        console.log('\n2. Simplifying expressions:');
        const simplifyResult = mathrok.simplify('2x + 3x + 4');
        console.log(`2x + 3x + 4 = ${simplifyResult.result}`);

        const simplifyResult2 = mathrok.simplify('(x^2 + 2x + 1) / (x + 1)');
        console.log(`(x^2 + 2x + 1) / (x + 1) = ${simplifyResult2.result}`);

        // 3. Factor an expression
        console.log('\n3. Factoring expressions:');
        const factorResult = mathrok.factor('x^2 - 4');
        console.log(`x^2 - 4 = ${factorResult.result}`);

        const factorResult2 = mathrok.factor('x^3 - 8');
        console.log(`x^3 - 8 = ${factorResult2.result}`);

        // 4. Expand an expression
        console.log('\n4. Expanding expressions:');
        const expandResult = mathrok.expand('(x + 1)^2');
        console.log(`(x + 1)^2 = ${expandResult.result}`);

        const expandResult2 = mathrok.expand('(x + 2)(x - 3)');
        console.log(`(x + 2)(x - 3) = ${expandResult2.result}`);

        // 5. Solve an equation
        console.log('\n5. Solving equations:');
        const solveResult = await mathrok.solve('x^2 - 4 = 0');
        console.log(`x^2 - 4 = 0, solutions: ${solveResult.result}`);

        const solveResult2 = await mathrok.solve('2x + 3 = 7');
        console.log(`2x + 3 = 7, solution: ${solveResult2.result}`);

        // 6. Calculate a derivative
        console.log('\n6. Calculating derivatives:');
        const derivativeResult = await mathrok.derivative('x^2', 'x');
        console.log(`d/dx(x^2) = ${derivativeResult.result}`);

        const derivativeResult2 = await mathrok.derivative('sin(x)', 'x');
        console.log(`d/dx(sin(x)) = ${derivativeResult2.result}`);

        // 7. Calculate an integral
        console.log('\n7. Calculating integrals:');
        const integralResult = await mathrok.integral('x^2', 'x');
        console.log(`∫x^2 dx = ${integralResult.result}`);

        const integralResult2 = await mathrok.integral('sin(x)', 'x');
        console.log(`∫sin(x) dx = ${integralResult2.result}`);

        // 8. Calculate a limit
        console.log('\n8. Calculating limits:');
        const limitResult = await mathrok.limit('sin(x)/x', 'x', 0);
        console.log(`lim(x→0) sin(x)/x = ${limitResult.result}`);

        const limitResult2 = await mathrok.limit('(1+1/n)^n', 'n', 'infinity');
        console.log(`lim(n→∞) (1+1/n)^n = ${limitResult2.result}`);

        // 9. Matrix operations
        console.log('\n9. Matrix operations:');
        const matrixA = mathrok.matrix.create([[1, 2], [3, 4]]);
        const matrixB = mathrok.matrix.create([[5, 6], [7, 8]]);

        const matrixProduct = await mathrok.matrix.multiply(matrixA, matrixB);
        console.log('Matrix A * Matrix B =');
        console.log(matrixProduct.result.data);

        const determinant = await mathrok.matrix.determinant(matrixA);
        console.log(`Determinant of Matrix A = ${determinant.result}`);

        // 10. Statistics
        console.log('\n10. Statistics:');
        const statsResult = await mathrok.calculateStatistics([1, 2, 3, 4, 5]);
        console.log('Statistics for [1, 2, 3, 4, 5]:');
        console.log(`Mean: ${statsResult.result.mean}`);
        console.log(`Median: ${statsResult.result.median}`);
        console.log(`Standard Deviation: ${statsResult.result.standardDeviation}`);

        console.log('\nAll operations completed successfully!');
    } catch (error) {
        console.error('Error running basic operations:', error);
    }
}

// Run the example
runBasicOperations();

/**
 * Expected output:
 *
 * Mathrok Basic Operations Example
 * --------------------------------
 *
 * 1. Evaluating expressions:
 * 2 + 3 * 4 = 14
 * x^2 + y (with x=3, y=4) = 13
 *
 * 2. Simplifying expressions:
 * 2x + 3x + 4 = 5x + 4
 * (x^2 + 2x + 1) / (x + 1) = x + 1
 *
 * 3. Factoring expressions:
 * x^2 - 4 = (x - 2)(x + 2)
 * x^3 - 8 = (x - 2)(x^2 + 2x + 4)
 *
 * 4. Expanding expressions:
 * (x + 1)^2 = x^2 + 2x + 1
 * (x + 2)(x - 3) = x^2 - x - 6
 *
 * 5. Solving equations:
 * x^2 - 4 = 0, solutions: [-2, 2]
 * 2x + 3 = 7, solution: [2]
 *
 * 6. Calculating derivatives:
 * d/dx(x^2) = 2x
 * d/dx(sin(x)) = cos(x)
 *
 * 7. Calculating integrals:
 * ∫x^2 dx = (1/3)x^3 + C
 * ∫sin(x) dx = -cos(x) + C
 *
 * 8. Calculating limits:
 * lim(x→0) sin(x)/x = 1
 * lim(n→∞) (1+1/n)^n = e
 *
 * 9. Matrix operations:
 * Matrix A * Matrix B =
 * [[19, 22], [43, 50]]
 * Determinant of Matrix A = -2
 *
 * 10. Statistics:
 * Statistics for [1, 2, 3, 4, 5]:
 * Mean: 3
 * Median: 3
 * Standard Deviation: 1.4142135623730951
 *
 * All operations completed successfully!
 */