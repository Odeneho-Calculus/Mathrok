/**
 * 2D Function Plotting Example
 *
 * This example demonstrates how to plot 2D functions using
 * the visualization capabilities of the Mathrok library.
 *
 * Note: This example is designed to run in a browser environment.
 */

// Initialize the library (the library should be included in your HTML)
const mathrok = new Mathrok();

// Function to create a container element
function createContainer(id, width = 600, height = 400) {
    const container = document.createElement('div');
    container.id = id;
    container.style.width = `${width}px`;
    container.style.height = `${height}px`;
    container.style.margin = '20px 0';
    container.style.border = '1px solid #ccc';
    document.body.appendChild(container);

    // Add a title
    const title = document.createElement('h3');
    title.textContent = id;
    document.body.insertBefore(title, container);

    return container;
}

// Basic 2D plot
function basicPlot() {
    const container = createContainer('basic-plot');

    // Plot a simple sine function
    mathrok.visualization.plot2D(container, 'sin(x)', 'x');
}

// Plot with custom options
function customPlot() {
    const container = createContainer('custom-plot');

    // Plot with custom options
    mathrok.visualization.plot2D(container, 'cos(x)', 'x', {
        xMin: -Math.PI,
        xMax: Math.PI,
        yMin: -1.5,
        yMax: 1.5,
        lineColor: '#ff7f0e',
        lineWidth: 3,
        grid: true,
        title: 'Cosine Function',
        xLabel: 'x (radians)',
        yLabel: 'cos(x)'
    });
}

// Plot multiple functions
function multipleFunctionsPlot() {
    const container = createContainer('multiple-functions-plot');

    // Plot multiple functions
    mathrok.visualization.plotMultiple(container, [
        'sin(x)',
        'cos(x)',
        'sin(x) * cos(x)'
    ], 'x', {
        xMin: -Math.PI,
        xMax: Math.PI,
        title: 'Trigonometric Functions',
        legend: ['sin(x)', 'cos(x)', 'sin(x)·cos(x)'],
        colors: ['#1f77b4', '#ff7f0e', '#2ca02c']
    });
}

// Plot a polynomial function
function polynomialPlot() {
    const container = createContainer('polynomial-plot');

    // Plot a polynomial function
    mathrok.visualization.plot2D(container, 'x^3 - 2*x^2 - 5*x + 6', 'x', {
        xMin: -5,
        xMax: 5,
        title: 'Cubic Polynomial',
        lineColor: '#d62728'
    });
}

// Plot with fill below
function filledPlot() {
    const container = createContainer('filled-plot');

    // Plot with area filled below the curve
    mathrok.visualization.plot2D(container, 'x^2', 'x', {
        xMin: -3,
        xMax: 3,
        title: 'Parabola with Fill',
        lineColor: '#9467bd',
        fillColor: 'rgba(148, 103, 189, 0.3)',
        fillBelow: true
    });
}

// Plot a parametric function (circle)
function parametricPlot() {
    const container = createContainer('parametric-plot');

    // Plot a parametric function (circle)
    mathrok.visualization.plotParametric(
        container,
        'cos(t)',  // x expression
        'sin(t)',  // y expression
        't',       // parameter
        0,         // tMin
        2 * Math.PI, // tMax
        {
            title: 'Circle (Parametric)',
            lineColor: '#8c564b',
            points: 100
        }
    );
}

// Generate SVG and display it
function svgGeneration() {
    const container = createContainer('svg-container');

    // Generate SVG
    const svg = mathrok.visualization.generateSVG('tan(x)', 'x', {
        xMin: -1.5,
        xMax: 1.5,
        title: 'Tangent Function (SVG)'
    });

    // Display the SVG
    container.innerHTML = svg;
}

// Plot a function with its derivative
function functionAndDerivative() {
    const container = createContainer('function-derivative-plot');

    // Plot a function and its derivative
    mathrok.visualization.plotMultiple(container, [
        'x^2',
        '2*x'
    ], 'x', {
        xMin: -3,
        xMax: 3,
        title: 'Function and its Derivative',
        legend: ['f(x) = x²', 'f\'(x) = 2x'],
        colors: ['#1f77b4', '#ff7f0e']
    });
}

// Plot a function with solution points
async function functionWithSolutions() {
    const container = createContainer('function-solutions-plot');

    // Define the function and equation
    const func = 'x^2 - 4';
    const equation = 'x^2 - 4 = 0';

    // Solve the equation
    const result = await mathrok.solve(equation);
    const solutions = result.result;

    // Plot the function
    mathrok.visualization.plot2D(container, func, 'x', {
        xMin: -5,
        xMax: 5,
        title: 'Function with Solutions',
        lineColor: '#1f77b4',
        points: [
            { x: solutions[0], y: 0, color: '#d62728', size: 5, label: `x = ${solutions[0]}` },
            { x: solutions[1], y: 0, color: '#d62728', size: 5, label: `x = ${solutions[1]}` }
        ]
    });
}

// Interactive function explorer
function interactiveFunctionExplorer() {
    // Create UI elements
    const title = document.createElement('h3');
    title.textContent = 'Interactive Function Explorer';
    document.body.appendChild(title);

    const controls = document.createElement('div');
    controls.style.margin = '10px 0';
    document.body.appendChild(controls);

    // Function input
    const functionLabel = document.createElement('label');
    functionLabel.textContent = 'Function: ';
    controls.appendChild(functionLabel);

    const functionInput = document.createElement('input');
    functionInput.type = 'text';
    functionInput.value = 'sin(x)';
    functionInput.style.marginRight = '10px';
    controls.appendChild(functionInput);

    // Range inputs
    const xMinLabel = document.createElement('label');
    xMinLabel.textContent = 'xMin: ';
    controls.appendChild(xMinLabel);

    const xMinInput = document.createElement('input');
    xMinInput.type = 'number';
    xMinInput.value = '-3.14';
    xMinInput.style.width = '60px';
    xMinInput.style.marginRight = '10px';
    controls.appendChild(xMinInput);

    const xMaxLabel = document.createElement('label');
    xMaxLabel.textContent = 'xMax: ';
    controls.appendChild(xMaxLabel);

    const xMaxInput = document.createElement('input');
    xMaxInput.type = 'number';
    xMaxInput.value = '3.14';
    xMaxInput.style.width = '60px';
    xMaxInput.style.marginRight = '10px';
    controls.appendChild(xMaxInput);

    // Plot button
    const plotButton = document.createElement('button');
    plotButton.textContent = 'Plot';
    controls.appendChild(plotButton);

    // Create container for the plot
    const container = createContainer('interactive-plot');

    // Function to update the plot
    function updatePlot() {
        const expression = functionInput.value;
        const xMin = parseFloat(xMinInput.value);
        const xMax = parseFloat(xMaxInput.value);

        if (!expression || isNaN(xMin) || isNaN(xMax)) {
            alert('Please enter valid values');
            return;
        }

        try {
            // Clear container
            container.innerHTML = '';

            // Plot the function
            mathrok.visualization.plot2D(container, expression, 'x', {
                xMin: xMin,
                xMax: xMax,
                title: expression
            });
        } catch (error) {
            console.error('Plot error:', error);
            alert(`Error plotting function: ${error.message}`);
        }
    }

    // Set up event listener
    plotButton.addEventListener('click', updatePlot);

    // Initial plot
    updatePlot();
}

// Run all examples when the page loads
window.addEventListener('DOMContentLoaded', () => {
    // Create a title
    const mainTitle = document.createElement('h1');
    mainTitle.textContent = 'Mathrok 2D Plotting Examples';
    document.body.appendChild(mainTitle);

    // Run the examples
    basicPlot();
    customPlot();
    multipleFunctionsPlot();
    polynomialPlot();
    filledPlot();
    parametricPlot();
    svgGeneration();
    functionAndDerivative();
    functionWithSolutions();
    interactiveFunctionExplorer();
});

/**
 * HTML Template for this example:
 *
 * <!DOCTYPE html>
 * <html>
 * <head>
 *   <title>Mathrok 2D Plotting Examples</title>
 *   <script src="https://cdn.jsdelivr.net/npm/mathrok@1.1.0/dist/mathrok.umd.js"></script>
 *   <script src="2d-plotting.js"></script>
 *   <style>
 *     body {
 *       font-family: Arial, sans-serif;
 *       max-width: 800px;
 *       margin: 0 auto;
 *       padding: 20px;
 *     }
 *     h1 {
 *       color: #333;
 *     }
 *     h3 {
 *       color: #666;
 *       margin-top: 30px;
 *     }
 *   </style>
 * </head>
 * <body>
 *   <!-- Content will be dynamically generated by the script -->
 * </body>
 * </html>
 */