/**
 * Step-by-Step Solutions Example
 *
 * This example demonstrates how to get detailed step-by-step solutions
 * with explanations using the Mathrok library.
 */

// Import the library (Node.js)
// const { Mathrok } = require('mathrok');

// For browser, the library is already available as a global variable

// Initialize the library
const mathrok = new Mathrok();

// Function to display steps in console
function displaySteps(steps) {
    console.log('\nStep-by-Step Solution:');
    console.log('----------------------');

    steps.forEach((step, index) => {
        console.log(`Step ${index + 1}: ${step.text}`);
        console.log(`Expression: ${step.expression}`);
        console.log('');
    });
}

// Function to create HTML for steps
function createStepsHTML(steps) {
    let html = '<div class="steps-container">';
    html += '<h3>Step-by-Step Solution:</h3>';
    html += '<ol class="steps-list">';

    steps.forEach(step => {
        html += `<li>
      <div class="step-text">${step.text}</div>
      <div class="step-expression">${mathrok.visualization.renderMath(step.expression, 'latex', true)}</div>
    </li>`;
    });

    html += '</ol></div>';
    return html;
}

// Example 1: Solving a quadratic equation
async function solveQuadratic() {
    try {
        console.log('Example 1: Solving a quadratic equation');
        console.log('x^2 - 4 = 0');

        const result = await mathrok.solve('x^2 - 4 = 0');

        console.log(`Result: ${result.result}`);
        displaySteps(result.steps);

        // For browser display
        if (typeof document !== 'undefined') {
            const container = document.getElementById('quadratic-container');
            if (container) {
                container.innerHTML = createStepsHTML(result.steps);
            }
        }

        return result;
    } catch (error) {
        console.error('Error solving quadratic equation:', error);
    }
}

// Example 2: Calculating a derivative with steps
async function calculateDerivative() {
    try {
        console.log('\nExample 2: Calculating a derivative');
        console.log('f(x) = sin(x) * x^2');

        const result = await mathrok.derivative('sin(x) * x^2', 'x');

        console.log(`Result: ${result.result}`);
        displaySteps(result.steps);

        // For browser display
        if (typeof document !== 'undefined') {
            const container = document.getElementById('derivative-container');
            if (container) {
                container.innerHTML = createStepsHTML(result.steps);
            }
        }

        return result;
    } catch (error) {
        console.error('Error calculating derivative:', error);
    }
}

// Example 3: Calculating an integral with steps
async function calculateIntegral() {
    try {
        console.log('\nExample 3: Calculating an integral');
        console.log('∫ x^2 dx');

        const result = await mathrok.integral('x^2', 'x');

        console.log(`Result: ${result.result}`);
        displaySteps(result.steps);

        // For browser display
        if (typeof document !== 'undefined') {
            const container = document.getElementById('integral-container');
            if (container) {
                container.innerHTML = createStepsHTML(result.steps);
            }
        }

        return result;
    } catch (error) {
        console.error('Error calculating integral:', error);
    }
}

// Example 4: Factoring an expression with steps
async function factorExpression() {
    try {
        console.log('\nExample 4: Factoring an expression');
        console.log('x^3 - 8');

        const result = await mathrok.factor('x^3 - 8');

        console.log(`Result: ${result.result}`);
        displaySteps(result.steps);

        // For browser display
        if (typeof document !== 'undefined') {
            const container = document.getElementById('factor-container');
            if (container) {
                container.innerHTML = createStepsHTML(result.steps);
            }
        }

        return result;
    } catch (error) {
        console.error('Error factoring expression:', error);
    }
}

// Example 5: Solving a system of equations with steps
async function solveSystem() {
    try {
        console.log('\nExample 5: Solving a system of equations');
        console.log('x + y = 10');
        console.log('x - y = 2');

        const result = await mathrok.solveSystem(['x + y = 10', 'x - y = 2']);

        console.log(`Result: ${JSON.stringify(result.result)}`);
        displaySteps(result.steps);

        // For browser display
        if (typeof document !== 'undefined') {
            const container = document.getElementById('system-container');
            if (container) {
                container.innerHTML = createStepsHTML(result.steps);
            }
        }

        return result;
    } catch (error) {
        console.error('Error solving system of equations:', error);
    }
}

// Run all examples
async function runAllExamples() {
    await solveQuadratic();
    await calculateDerivative();
    await calculateIntegral();
    await factorExpression();
    await solveSystem();

    console.log('\nAll examples completed!');
}

// For Node.js
if (typeof window === 'undefined') {
    runAllExamples();
}

// For browser
if (typeof window !== 'undefined') {
    // Create UI when the page loads
    window.addEventListener('DOMContentLoaded', () => {
        // Create main container
        const mainContainer = document.createElement('div');
        mainContainer.className = 'examples-container';
        mainContainer.style.maxWidth = '800px';
        mainContainer.style.margin = '0 auto';
        mainContainer.style.padding = '20px';
        mainContainer.style.fontFamily = 'Arial, sans-serif';
        document.body.appendChild(mainContainer);

        // Create title
        const title = document.createElement('h1');
        title.textContent = 'Mathrok Step-by-Step Solutions';
        mainContainer.appendChild(title);

        // Create description
        const description = document.createElement('p');
        description.textContent = 'This example demonstrates how to get detailed step-by-step solutions with explanations.';
        mainContainer.appendChild(description);

        // Create example containers
        const examples = [
            { id: 'quadratic-container', title: 'Example 1: Solving a quadratic equation', expression: 'x^2 - 4 = 0' },
            { id: 'derivative-container', title: 'Example 2: Calculating a derivative', expression: 'sin(x) * x^2' },
            { id: 'integral-container', title: 'Example 3: Calculating an integral', expression: '∫ x^2 dx' },
            { id: 'factor-container', title: 'Example 4: Factoring an expression', expression: 'x^3 - 8' },
            { id: 'system-container', title: 'Example 5: Solving a system of equations', expression: 'x + y = 10, x - y = 2' }
        ];

        examples.forEach(example => {
            const container = document.createElement('div');
            container.className = 'example-container';
            container.style.margin = '30px 0';
            container.style.padding = '20px';
            container.style.border = '1px solid #ddd';
            container.style.borderRadius = '5px';
            mainContainer.appendChild(container);

            const exampleTitle = document.createElement('h2');
            exampleTitle.textContent = example.title;
            container.appendChild(exampleTitle);

            const expressionDiv = document.createElement('div');
            expressionDiv.className = 'expression';
            expressionDiv.innerHTML = `<strong>Expression:</strong> ${mathrok.visualization.renderMath(example.expression, 'latex', true)}`;
            container.appendChild(expressionDiv);

            const resultContainer = document.createElement('div');
            resultContainer.id = example.id;
            resultContainer.className = 'result-container';
            resultContainer.innerHTML = '<p>Loading solution...</p>';
            container.appendChild(resultContainer);
        });

        // Run all examples
        runAllExamples();
    });
}

/**
 * HTML Template for browser example:
 *
 * <!DOCTYPE html>
 * <html>
 * <head>
 *   <title>Mathrok Step-by-Step Solutions</title>
 *   <script src="https://cdn.jsdelivr.net/npm/mathrok@1.1.0/dist/mathrok.umd.js"></script>
 *   <script src="step-by-step.js"></script>
 *   <style>
 *     .steps-list {
 *       padding-left: 20px;
 *     }
 *     .step-text {
 *       margin-bottom: 5px;
 *     }
 *     .step-expression {
 *       margin-bottom: 15px;
 *       padding: 5px;
 *       background-color: #f5f5f5;
 *       border-radius: 3px;
 *     }
 *   </style>
 * </head>
 * <body>
 *   <!-- Content will be dynamically generated by the script -->
 * </body>
 * </html>
 */