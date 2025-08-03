/**
 * 2D Function Plotting Example (Node.js Compatible)
 *
 * This example demonstrates how to generate 2D function plots using
 * the visualization capabilities of the Mathrok library in Node.js.
 */

const { Mathrok } = require('mathrok');
const fs = require('fs');
const path = require('path');

async function runPlottingExamples() {
    console.log('Mathrok 2D Plotting Example (Node.js)');
    console.log('=====================================');

    try {
        // Initialize Mathrok
        const mathrok = new Mathrok();

        console.log('\n1. Generating SVG for sine function...');

        // Generate SVG for a sine function
        const sineSVG = mathrok.visualization.generateSVG('sin(x)', 'x', {
            xMin: -Math.PI * 2,
            xMax: Math.PI * 2,
            yMin: -2,
            yMax: 2,
            width: 800,
            height: 400,
            title: 'Sine Function: y = sin(x)'
        });

        // Save SVG to file
        const sineFile = path.join(__dirname, 'sine-plot.svg');
        fs.writeFileSync(sineFile, sineSVG);
        console.log(`✅ Sine function SVG saved to: ${sineFile}`);

        console.log('\n2. Generating SVG for quadratic function...');

        // Generate SVG for a quadratic function
        const quadraticSVG = mathrok.visualization.generateSVG('x^2 - 4*x + 3', 'x', {
            xMin: -2,
            xMax: 6,
            yMin: -2,
            yMax: 8,
            width: 800,
            height: 400,
            title: 'Quadratic Function: y = x² - 4x + 3'
        });

        // Save SVG to file
        const quadraticFile = path.join(__dirname, 'quadratic-plot.svg');
        fs.writeFileSync(quadraticFile, quadraticSVG);
        console.log(`✅ Quadratic function SVG saved to: ${quadraticFile}`);

        console.log('\n3. Generating SVG for exponential function...');

        // Generate SVG for an exponential function
        const expSVG = mathrok.visualization.generateSVG('exp(x/2)', 'x', {
            xMin: -4,
            xMax: 4,
            yMin: 0,
            yMax: 8,
            width: 800,
            height: 400,
            title: 'Exponential Function: y = e^(x/2)'
        });

        // Save SVG to file
        const expFile = path.join(__dirname, 'exponential-plot.svg');
        fs.writeFileSync(expFile, expSVG);
        console.log(`✅ Exponential function SVG saved to: ${expFile}`);

        console.log('\n4. Generating SVG for logarithmic function...');

        // Generate SVG for a logarithmic function
        const logSVG = mathrok.visualization.generateSVG('log(x)', 'x', {
            xMin: 0.1,
            xMax: 10,
            yMin: -3,
            yMax: 3,
            width: 800,
            height: 400,
            title: 'Logarithmic Function: y = ln(x)'
        });

        // Save SVG to file
        const logFile = path.join(__dirname, 'logarithmic-plot.svg');
        fs.writeFileSync(logFile, logSVG);
        console.log(`✅ Logarithmic function SVG saved to: ${logFile}`);

        console.log('\n5. Generating SVG for trigonometric functions...');

        // Generate SVG for multiple trigonometric functions
        const trigSVG = mathrok.visualization.generateSVG('cos(x)', 'x', {
            xMin: -Math.PI * 2,
            xMax: Math.PI * 2,
            yMin: -2,
            yMax: 2,
            width: 800,
            height: 400,
            title: 'Cosine Function: y = cos(x)'
        });

        // Save SVG to file
        const trigFile = path.join(__dirname, 'cosine-plot.svg');
        fs.writeFileSync(trigFile, trigSVG);
        console.log(`✅ Cosine function SVG saved to: ${trigFile}`);

        console.log('\n6. Testing image generation...');

        try {
            // Try to generate image (this might not work in all environments)
            const imageData = mathrok.visualization.generateImage('tan(x)', 'x', {
                xMin: -Math.PI,
                xMax: Math.PI,
                yMin: -5,
                yMax: 5,
                width: 800,
                height: 400,
                title: 'Tangent Function: y = tan(x)'
            });

            if (imageData) {
                console.log('✅ Image generation successful');
                console.log(`Image data length: ${imageData.length} characters`);
            }
        } catch (error) {
            console.log('⚠️  Image generation not available in this environment');
            console.log('   (This is normal for Node.js environments without canvas support)');
        }

        console.log('\n7. Testing mathematical notation rendering...');

        // Test LaTeX rendering
        const latexOutput = mathrok.visualization.renderMath('x^2 + 2x + 1 = (x + 1)^2', 'latex');
        console.log('✅ LaTeX rendering:');
        console.log(`   ${latexOutput}`);

        // Test MathML rendering
        const mathmlOutput = mathrok.visualization.renderMath('sqrt(x^2 + y^2)', 'mathml');
        console.log('✅ MathML rendering:');
        console.log(`   ${mathmlOutput.substring(0, 100)}...`);

        // Test ASCII rendering
        const asciiOutput = mathrok.visualization.renderMath('integral(x^2, x)', 'ascii');
        console.log('✅ ASCII rendering:');
        console.log(`   ${asciiOutput}`);

        console.log('\n8. Testing step-by-step visualization...');

        // Generate steps for a mathematical problem
        const steps = [
            { text: 'Given equation', expression: 'x^2 - 4*x + 3 = 0' },
            { text: 'Factor the quadratic', expression: '(x - 1)(x - 3) = 0' },
            { text: 'Solutions', expression: 'x = 1 \\text{ or } x = 3' }
        ];

        const stepsOutput = mathrok.visualization.renderSteps(steps, 'latex');
        console.log('✅ Step-by-step rendering:');
        console.log(`   ${stepsOutput.substring(0, 150)}...`);

        console.log('\n🎉 All plotting operations completed successfully!');
        console.log('\nGenerated files:');
        console.log('  - sine-plot.svg');
        console.log('  - quadratic-plot.svg');
        console.log('  - exponential-plot.svg');
        console.log('  - logarithmic-plot.svg');
        console.log('  - cosine-plot.svg');
        console.log('\nYou can open these SVG files in any web browser to view the plots.');

    } catch (error) {
        console.error('Error running plotting operations:', error);
        process.exit(1);
    }
}

// Run the example
runPlottingExamples();