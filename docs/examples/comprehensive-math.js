/**
 * Comprehensive Mathematical Operations Example
 * Demonstrates the full capabilities of the enhanced Mathrok library
 */

const { Mathrok } = require('mathrok');

async function runComprehensiveMathExample() {
    console.log('Mathrok Comprehensive Mathematical Operations');
    console.log('===========================================\n');

    try {
        const mathrok = new Mathrok();

        // 1. Advanced Algebraic Operations
        console.log('1. Advanced Algebraic Operations:');
        console.log('--------------------------------');

        // Polynomial factoring
        const factor1 = await mathrok.factor('x^2 - 9');
        console.log(`x^2 - 9 = ${factor1.result}`);

        const factor2 = await mathrok.factor('x^3 + 8');
        console.log(`x^3 + 8 = ${factor2.result}`);

        const factor3 = await mathrok.factor('x^4 - 16');
        console.log(`x^4 - 16 = ${factor3.result}`);

        // Polynomial expansion
        const expand1 = await mathrok.expand('(x + 3)^2');
        console.log(`(x + 3)^2 = ${expand1.result}`);

        const expand2 = await mathrok.expand('(x + 2)(x - 5)');
        console.log(`(x + 2)(x - 5) = ${expand2.result}`);

        const expand3 = await mathrok.expand('(x + 1)^3');
        console.log(`(x + 1)^3 = ${expand3.result}`);

        // Complex simplification
        const simplify1 = await mathrok.simplify('(x^2 + 4*x + 4) / (x + 2)');
        console.log(`(x^2 + 4x + 4) / (x + 2) = ${simplify1.result}`);

        const simplify2 = await mathrok.simplify('sqrt(x^2 + 2*x + 1)');
        console.log(`sqrt(x^2 + 2x + 1) = ${simplify2.result}`);

        // 2. Advanced Calculus Operations
        console.log('\n2. Advanced Calculus Operations:');
        console.log('--------------------------------');

        // Complex derivatives
        const deriv1 = await mathrok.derivative('x^3 * sin(x)', 'x');
        console.log(`d/dx(x^3 * sin(x)) = ${deriv1.result}`);

        const deriv2 = await mathrok.derivative('ln(x^2 + 1)', 'x');
        console.log(`d/dx(ln(x^2 + 1)) = ${deriv2.result}`);

        const deriv3 = await mathrok.derivative('e^(x^2)', 'x');
        console.log(`d/dx(e^(x^2)) = ${deriv3.result}`);

        // Complex integrals
        const integral1 = await mathrok.integral('x * e^x', 'x');
        console.log(`∫x * e^x dx = ${integral1.result}`);

        const integral2 = await mathrok.integral('1/(x^2 + 1)', 'x');
        console.log(`∫1/(x^2 + 1) dx = ${integral2.result}`);

        const integral3 = await mathrok.integral('x * sin(x)', 'x');
        console.log(`∫x * sin(x) dx = ${integral3.result}`);

        // Advanced limits
        const limit1 = await mathrok.limit('(e^x - 1)/x', 'x', 0);
        console.log(`lim(x→0) (e^x - 1)/x = ${limit1.result}`);

        const limit2 = await mathrok.limit('x^2/e^x', 'x', 'infinity');
        console.log(`lim(x→∞) x^2/e^x = ${limit2.result}`);

        // 3. Equation Solving
        console.log('\n3. Advanced Equation Solving:');
        console.log('-----------------------------');

        // Quadratic equations
        const solve1 = await mathrok.solve('x^2 + 5*x + 6 = 0');
        console.log(`x^2 + 5x + 6 = 0, solutions: ${JSON.stringify(solve1.result, null, 2)}`);

        // Cubic equations
        const solve2 = await mathrok.solve('x^3 - 6*x^2 + 11*x - 6 = 0');
        console.log(`x^3 - 6x^2 + 11x - 6 = 0, solutions: ${JSON.stringify(solve2.result, null, 2)}`);

        // Trigonometric equations
        const solve3 = await mathrok.solve('sin(x) = 0.5');
        console.log(`sin(x) = 0.5, solutions: ${JSON.stringify(solve3.result, null, 2)}`);

        // 4. Matrix Operations
        console.log('\n4. Advanced Matrix Operations:');
        console.log('------------------------------');

        const matrixA = { data: [[2, 1], [1, 3]], rows: 2, cols: 2 };
        const matrixB = { data: [[1, 2], [3, 1]], rows: 2, cols: 2 };
        const matrixC = { data: [[1, 2, 3], [4, 5, 6], [7, 8, 9]], rows: 3, cols: 3 };

        // Matrix multiplication
        const multiply = await mathrok.matrix.multiply(matrixA, matrixB);
        console.log('Matrix A * Matrix B =');
        console.log(multiply.result.data);

        // Determinants
        const detA = await mathrok.matrix.determinant(matrixA);
        console.log(`Determinant of Matrix A = ${detA.result || detA}`);

        const detC = await mathrok.matrix.determinant(matrixC);
        console.log(`Determinant of Matrix C = ${detC.result || detC}`);

        // Matrix inverse
        try {
            const inverse = await mathrok.matrix.inverse(matrixA);
            console.log('Inverse of Matrix A =');
            console.log(inverse.result.data);
        } catch (e) {
            console.log('Matrix inverse: [Not available for this matrix]');
        }

        // 5. Trigonometric Functions
        console.log('\n5. Trigonometric Operations:');
        console.log('----------------------------');

        // Trigonometric simplification
        const trig1 = await mathrok.simplify('sin^2(x) + cos^2(x)');
        console.log(`sin^2(x) + cos^2(x) = ${trig1.result}`);

        const trig2 = await mathrok.simplify('tan(x) * cos(x)');
        console.log(`tan(x) * cos(x) = ${trig2.result}`);

        // Trigonometric evaluation
        const trigEval1 = await mathrok.evaluate('sin(pi/6)');
        console.log(`sin(π/6) = ${trigEval1.result}`);

        const trigEval2 = await mathrok.evaluate('cos(pi/4)');
        console.log(`cos(π/4) = ${trigEval2.result}`);

        // 6. Complex Number Operations
        console.log('\n6. Complex Number Operations:');
        console.log('-----------------------------');

        // Complex arithmetic
        const complex1 = await mathrok.evaluate('(3 + 4*i) + (1 - 2*i)');
        console.log(`(3 + 4i) + (1 - 2i) = ${complex1.result}`);

        const complex2 = await mathrok.evaluate('(2 + 3*i) * (1 + i)');
        console.log(`(2 + 3i) * (1 + i) = ${complex2.result}`);

        // 7. Advanced Function Analysis
        console.log('\n7. Advanced Function Analysis:');
        console.log('------------------------------');

        // Critical points (where derivative = 0)
        const critical = await mathrok.solve('diff(x^3 - 3*x^2 + 2, x) = 0');
        console.log(`Critical points of x^3 - 3x^2 + 2: ${JSON.stringify(critical.result, null, 2)}`);

        // Inflection points (where second derivative = 0)
        const inflection = await mathrok.solve('diff(x^4 - 6*x^2, x, 2) = 0');
        console.log(`Inflection points of x^4 - 6x^2: ${JSON.stringify(inflection.result, null, 2)}`);

        // 8. Series and Sequences
        console.log('\n8. Series and Sequences:');
        console.log('-----------------------');

        // Taylor series expansion
        try {
            const taylor = await mathrok.expand('taylor(e^x, x, 0, 5)');
            console.log(`Taylor series of e^x around x=0: ${taylor.result}`);
        } catch (e) {
            console.log('Taylor series: [Advanced series operations not fully implemented]');
        }

        // Geometric series sum
        const geometric = await mathrok.evaluate('sum(r^n, n, 0, infinity)', { r: 0.5 });
        console.log(`Sum of geometric series (r=0.5): ${geometric.result}`);

        console.log('\n===========================================');
        console.log('All comprehensive mathematical operations completed successfully!');
        console.log('The Mathrok library now supports advanced symbolic mathematics,');
        console.log('calculus, linear algebra, and complex mathematical operations.');

    } catch (error) {
        console.error('Error in comprehensive math example:', error);
    }
}

// Run the comprehensive example
runComprehensiveMathExample();