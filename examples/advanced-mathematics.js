/**
 * Advanced Mathematics Examples
 * Demonstrates the enhanced mathematical capabilities of Mathrok
 */

import { Mathrok } from '../dist/index.js';

const mathrok = new Mathrok();

async function demonstrateAdvancedMathematics() {
    console.log('🧮 Advanced Mathematics with Mathrok\n');
    console.log('='.repeat(50));

    // Advanced Algebra
    console.log('\n📐 ADVANCED ALGEBRA');
    console.log('-'.repeat(30));

    try {
        // Polynomial factoring with advanced techniques
        console.log('\n1. Advanced Polynomial Factoring:');
        const factorResult = await mathrok.factor('x^4 - 16');
        console.log(`   Expression: x^4 - 16`);
        console.log(`   Factored: ${factorResult.result}`);
        console.log(`   Method: ${factorResult.method}`);
        console.log(`   Steps: ${factorResult.steps.length} steps`);

        // Rational function simplification
        console.log('\n2. Rational Function Simplification:');
        const simplifyResult = await mathrok.simplify('(x^2 - 4)/(x + 2)');
        console.log(`   Expression: (x^2 - 4)/(x + 2)`);
        console.log(`   Simplified: ${simplifyResult.result}`);
        console.log(`   Rules Applied: ${simplifyResult.rulesApplied?.join(', ')}`);

        // Partial fraction decomposition
        console.log('\n3. Partial Fraction Decomposition:');
        const partialResult = await mathrok.partialFractions('(x + 1)/(x^2 - 1)', 'x');
        console.log(`   Expression: (x + 1)/(x^2 - 1)`);
        console.log(`   Partial Fractions: ${partialResult.result}`);

        // Algebraic substitution
        console.log('\n4. Algebraic Substitution:');
        const substituteResult = await mathrok.substitute('x^2 + 3*x + 2', { x: 'y + 1' });
        console.log(`   Original: x^2 + 3*x + 2`);
        console.log(`   Substitute x = y + 1: ${substituteResult.result}`);

    } catch (error) {
        console.error('Algebra error:', error.message);
    }

    // Advanced Calculus
    console.log('\n🔬 ADVANCED CALCULUS');
    console.log('-'.repeat(30));

    try {
        // Advanced derivatives with multiple rules
        console.log('\n1. Complex Derivative (Product + Chain Rule):');
        const derivResult = await mathrok.derivative('x^2 * sin(x^3)');
        console.log(`   Expression: x^2 * sin(x^3)`);
        console.log(`   Derivative: ${derivResult.result}`);
        console.log(`   Rules Applied: ${derivResult.rulesApplied?.join(', ')}`);

        // Partial derivatives
        console.log('\n2. Partial Derivative:');
        const partialDerivResult = await mathrok.partialDerivative('x^2*y + y^3*x', 'x');
        console.log(`   Expression: x^2*y + y^3*x`);
        console.log(`   ∂/∂x: ${partialDerivResult.result}`);

        // Advanced integration
        console.log('\n3. Advanced Integration (By Parts):');
        const integralResult = await mathrok.integral('x * e^x');
        console.log(`   Expression: x * e^x`);
        console.log(`   Integral: ${integralResult.result}`);
        console.log(`   Method: ${integralResult.method}`);

        // Limits
        console.log('\n4. Limit Computation:');
        const limitResult = await mathrok.limit('sin(x)/x', 'x', 0);
        console.log(`   Expression: sin(x)/x as x → 0`);
        console.log(`   Limit: ${limitResult.result}`);

        // Taylor series
        console.log('\n5. Taylor Series Expansion:');
        const taylorResult = await mathrok.taylorSeries('e^x', 'x', 0, 4);
        console.log(`   Function: e^x around x = 0`);
        console.log(`   Taylor Series (4th order): ${taylorResult.result}`);

        // Definite integral
        console.log('\n6. Definite Integration:');
        const definiteResult = await mathrok.integral('x^2', 'x', {
            definite: true,
            lowerBound: 0,
            upperBound: 2
        });
        console.log(`   ∫₀² x² dx = ${definiteResult.result}`);

    } catch (error) {
        console.error('Calculus error:', error.message);
    }

    // Advanced Trigonometry
    console.log('\n📐 ADVANCED TRIGONOMETRY');
    console.log('-'.repeat(30));

    try {
        // Trigonometric simplification
        console.log('\n1. Trigonometric Identity Simplification:');
        const trigSimplify = await mathrok.simplify('sin^2(x) + cos^2(x)');
        console.log(`   Expression: sin²(x) + cos²(x)`);
        console.log(`   Simplified: ${trigSimplify.result}`);
        console.log(`   Rules Applied: ${trigSimplify.rulesApplied?.join(', ')}`);

        // Trigonometric equation solving
        console.log('\n2. Trigonometric Equation Solving:');
        const trigSolve = await mathrok.solveTrigonometric('sin(x) = 1/2', 'x');
        console.log(`   Equation: sin(x) = 1/2`);
        console.log(`   Solutions: ${trigSolve.result.map(s => s.value).join(', ')}`);

        // Unit conversion
        console.log('\n3. Angle Unit Conversion:');
        const convertResult = await mathrok.convertTrigUnits('90°', 'degrees', 'radians');
        console.log(`   90° in radians: ${convertResult.result}`);

        // Special angle evaluation
        console.log('\n4. Special Angle Evaluation:');
        const specialResult = await mathrok.evaluateSpecialAngles('sin(π/6) + cos(π/4)');
        console.log(`   sin(π/6) + cos(π/4) = ${specialResult.result}`);

    } catch (error) {
        console.error('Trigonometry error:', error.message);
    }

    // Performance and Metadata
    console.log('\n⚡ PERFORMANCE INSIGHTS');
    console.log('-'.repeat(30));

    try {
        // Start performance profiling
        mathrok.startProfiling();

        // Perform a complex calculation
        const complexResult = await mathrok.derivative('(x^3 + 2*x^2 - x + 1) * sin(x^2) / (x^2 + 1)');

        // Get performance data
        const performanceData = mathrok.stopProfiling();

        console.log(`\nComplex Expression: (x³ + 2x² - x + 1) * sin(x²) / (x² + 1)`);
        console.log(`Derivative: ${complexResult.result}`);
        console.log(`\nPerformance Metrics:`);
        console.log(`  - Computation Time: ${complexResult.metadata.computationTime.toFixed(2)}ms`);
        console.log(`  - Method: ${complexResult.metadata.method}`);
        console.log(`  - Confidence: ${(complexResult.metadata.confidence * 100).toFixed(1)}%`);
        console.log(`  - Is Exact: ${complexResult.metadata.isExact}`);
        console.log(`  - Steps Generated: ${complexResult.steps.length}`);

        if (performanceData) {
            console.log(`\nOverall Session:`);
            console.log(`  - Total Operations: ${performanceData.totalOperations}`);
            console.log(`  - Average Time: ${performanceData.averageTime?.toFixed(2)}ms`);
            console.log(`  - Memory Usage: ${performanceData.memoryUsage?.toFixed(2)}MB`);
        }

    } catch (error) {
        console.error('Performance test error:', error.message);
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ Advanced Mathematics Demonstration Complete!');
    console.log('\nMathrok now supports:');
    console.log('  • Advanced polynomial factoring and expansion');
    console.log('  • Rational function simplification');
    console.log('  • Partial fraction decomposition');
    console.log('  • Complex derivative computation (chain, product, quotient rules)');
    console.log('  • Advanced integration techniques (substitution, by parts, etc.)');
    console.log('  • Partial derivatives for multivariable calculus');
    console.log('  • Limit computation with directional limits');
    console.log('  • Taylor series expansion');
    console.log('  • Trigonometric identity simplification');
    console.log('  • Trigonometric equation solving');
    console.log('  • Unit conversion and special angle evaluation');
    console.log('  • Comprehensive step-by-step explanations');
    console.log('  • Performance profiling and metadata');
}

// Run the demonstration
demonstrateAdvancedMathematics().catch(console.error);