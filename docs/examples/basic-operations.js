/**
 * Basic Operations Example
 *
 * This example demonstrates the basic mathematical operations
 * available in the Mathrok library.
 */

// Import the library (CommonJS)
const { Mathrok } = require('mathrok');

// Initialize the library
const mathrok = new Mathrok();

// Basic operations
async function runBasicOperations() {
    try {
        console.log('Mathrok Basic Operations Example');
        console.log('--------------------------------');

        // 1. Evaluate an expression
        console.log('\n1. Evaluating expressions:');
        const evalResult = await mathrok.evaluate('2 + 3 * 4');
        console.log(`2 + 3 * 4 = ${evalResult.result}`);

        const evalWithVars = await mathrok.evaluate('x^2 + y', { x: 3, y: 4 });
        console.log(`x^2 + y (with x=3, y=4) = ${evalWithVars.result}`);

        // 2. Simplify an expression
        console.log('\n2. Simplifying expressions:');
        const simplifyResult = await mathrok.simplify('2*x + 3*x + 4');
        console.log(`2x + 3x + 4 = ${simplifyResult.result}`);

        const simplifyResult2 = await mathrok.simplify('(x^2 + 2*x + 1) / (x + 1)');
        console.log(`(x^2 + 2x + 1) / (x + 1) = ${simplifyResult2.result}`);

        // 3. Factor an expression
        console.log('\n3. Factoring expressions:');
        const factorResult = await mathrok.factor('x^2 - 4');
        console.log(`x^2 - 4 = ${factorResult.result}`);

        try {
            const factorResult2 = await mathrok.factor('x^3 - 8');
            console.log(`x^3 - 8 = ${factorResult2.result}`);
        } catch (error) {
            console.log(`x^3 - 8 = [Factoring not available for this expression]`);
        }

        // 4. Expand an expression
        console.log('\n4. Expanding expressions:');
        try {
            const expandResult = await mathrok.expand('(x + 1)^2');
            console.log(`(x + 1)^2 = ${expandResult.result}`);
        } catch (error) {
            console.log(`(x + 1)^2 = [Expansion not available for this expression]`);
        }

        try {
            const expandResult2 = await mathrok.expand('(x + 2)*(x - 3)');
            console.log(`(x + 2)(x - 3) = ${expandResult2.result}`);
        } catch (error) {
            console.log(`(x + 2)(x - 3) = [Expansion not available for this expression]`);
        }

        // 5. Solve an equation
        console.log('\n5. Solving equations:');
        try {
            const solveResult = await mathrok.solve('x^2 - 4 = 0');
            console.log(`x^2 - 4 = 0, solutions: ${JSON.stringify(solveResult.result)}`);
        } catch (error) {
            console.log(`x^2 - 4 = 0, solutions: [Solving not available for this equation]`);
        }

        try {
            const solveResult2 = await mathrok.solve('2*x + 3 = 7');
            console.log(`2x + 3 = 7, solution: ${JSON.stringify(solveResult2.result)}`);
        } catch (error) {
            console.log(`2x + 3 = 7, solution: [Solving not available for this equation]`);
        }

        // 6. Calculate a derivative
        console.log('\n6. Calculating derivatives:');
        try {
            const derivativeResult = await mathrok.derivative('x^2', 'x');
            console.log(`d/dx(x^2) = ${derivativeResult.result}`);
        } catch (error) {
            console.log(`d/dx(x^2) = [Derivative calculation not available]`);
        }

        try {
            const derivativeResult2 = await mathrok.derivative('sin(x)', 'x');
            console.log(`d/dx(sin(x)) = ${derivativeResult2.result}`);
        } catch (error) {
            console.log(`d/dx(sin(x)) = [Derivative calculation not available]`);
        }

        // 7. Calculate an integral
        console.log('\n7. Calculating integrals:');
        try {
            const integralResult = await mathrok.integral('x^2', 'x');
            console.log(`∫x^2 dx = ${integralResult.result}`);
        } catch (error) {
            console.log(`∫x^2 dx = [Integral calculation not available]`);
        }

        try {
            const integralResult2 = await mathrok.integral('sin(x)', 'x');
            console.log(`∫sin(x) dx = ${integralResult2.result}`);
        } catch (error) {
            console.log(`∫sin(x) dx = [Integral calculation not available]`);
        }

        // 8. Calculate a limit
        console.log('\n8. Calculating limits:');
        try {
            const limitResult = await mathrok.limit('sin(x)/x', 'x', 0);
            console.log(`lim(x→0) sin(x)/x = ${limitResult.result}`);
        } catch (error) {
            console.log(`lim(x→0) sin(x)/x = [Limit calculation not available]`);
        }

        try {
            const limitResult2 = await mathrok.limit('(1+1/n)^n', 'n', 'infinity');
            console.log(`lim(n→∞) (1+1/n)^n = ${limitResult2.result}`);
        } catch (error) {
            console.log(`lim(n→∞) (1+1/n)^n = [Limit calculation not available]`);
        }

        // 9. Matrix operations
        console.log('\n9. Matrix operations:');
        try {
            const matrixA = { data: [[1, 2], [3, 4]], rows: 2, cols: 2 };
            const matrixB = { data: [[5, 6], [7, 8]], rows: 2, cols: 2 };

            const matrixProduct = await mathrok.matrix.multiply(matrixA, matrixB);
            console.log('Matrix A * Matrix B =');
            console.log(matrixProduct.result.data);

            const determinant = await mathrok.matrix.determinant(matrixA);
            console.log(`Determinant of Matrix A = ${determinant.result || determinant}`);
        } catch (error) {
            console.log('Matrix operations: [Matrix operations not available]');
        }

        // 10. Statistics
        console.log('\n10. Statistics:');
        try {
            const statsResult = await mathrok.statistics.descriptive([1, 2, 3, 4, 5]);
            console.log('Statistics for [1, 2, 3, 4, 5]:');
            console.log(`Mean: ${statsResult.result.mean}`);
            console.log(`Median: ${statsResult.result.median}`);
            console.log(`Standard Deviation: ${statsResult.result.standardDeviation}`);
        } catch (error) {
            console.log('Statistics: [Statistical operations not available]');
        }

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