# Visualization Guide

Mathrok provides powerful visualization capabilities for mathematical functions and expressions. This guide covers how to use these features to create graphs, render mathematical notation, and visualize solutions.

## Overview

The visualization features in Mathrok enable:

1. **Function Plotting**: Create 2D and 3D visualizations of mathematical functions
2. **Mathematical Notation**: Render expressions in LaTeX, MathML, or AsciiMath
3. **Step-by-Step Visualization**: Display solution steps with proper mathematical notation
4. **Interactive Graphs**: Create interactive visualizations for educational purposes

## Basic Usage

### 2D Function Plotting

To plot a simple 2D function:

```javascript
// Get a container element
const container = document.getElementById('graph-container');

// Plot a function
mathrok.visualization.plot2D(container, 'sin(x)', 'x');
```

With custom options:

```javascript
mathrok.visualization.plot2D(container, 'sin(x)', 'x', {
  xMin: -Math.PI,
  xMax: Math.PI,
  yMin: -1.5,
  yMax: 1.5,
  points: 100,
  lineColor: '#1f77b4',
  lineWidth: 2,
  grid: true,
  axes: true,
  title: 'Sine Function'
});
```

### 3D Function Plotting

To plot a 3D function:

```javascript
// Get a container element
const container = document.getElementById('graph-container');

// Plot a 3D function
mathrok.visualization.plot3D(container, 'sin(x)*cos(y)');
```

With custom options:

```javascript
mathrok.visualization.plot3D(container, 'sin(x)*cos(y)', {
  xMin: -Math.PI,
  xMax: Math.PI,
  yMin: -Math.PI,
  yMax: Math.PI,
  zMin: -1,
  zMax: 1,
  points: 50,
  colorMap: 'viridis',
  grid: true,
  axes: true,
  title: '3D Surface Plot'
});
```

### Multiple Function Plotting

To plot multiple functions on the same graph:

```javascript
// Get a container element
const container = document.getElementById('graph-container');

// Plot multiple functions
mathrok.visualization.plotMultiple(container, ['sin(x)', 'cos(x)'], 'x');
```

With custom options:

```javascript
mathrok.visualization.plotMultiple(container, ['sin(x)', 'cos(x)', 'tan(x)'], 'x', {
  xMin: -Math.PI/2,
  xMax: Math.PI/2,
  yMin: -3,
  yMax: 3,
  points: 100,
  colors: ['#1f77b4', '#ff7f0e', '#2ca02c'],
  lineWidths: [2, 2, 1],
  legend: ['Sine', 'Cosine', 'Tangent'],
  grid: true,
  title: 'Trigonometric Functions'
});
```

### Parametric Function Plotting

To plot a parametric function:

```javascript
// Get a container element
const container = document.getElementById('graph-container');

// Plot a parametric function (circle)
mathrok.visualization.plotParametric(
  container,
  'cos(t)',  // x expression
  'sin(t)',  // y expression
  't',       // parameter
  0,         // tMin
  2*Math.PI  // tMax
);
```

## Mathematical Notation Rendering

### Rendering Expressions

To render a mathematical expression:

```javascript
// Render a LaTeX expression
const latex = mathrok.visualization.renderMath('\\frac{d}{dx}x^2 = 2x', 'latex', true);
document.getElementById('math-container').innerHTML = latex;

// Render a MathML expression
const mathml = mathrok.visualization.renderMath('x^2 + y^2 = r^2', 'mathml', true);
document.getElementById('mathml-container').innerHTML = mathml;

// Render an AsciiMath expression
const ascii = mathrok.visualization.renderMath('int_0^1 x^2 dx = 1/3', 'asciimath', false);
document.getElementById('ascii-container').innerHTML = ascii;
```

### Rendering Solution Steps

To render step-by-step solution steps:

```javascript
// Solve an equation
const result = await mathrok.solve('x^2 - 4 = 0');

// Render the steps
const stepsHTML = mathrok.visualization.renderSteps(result.steps);
document.getElementById('steps-container').innerHTML = stepsHTML;
```

### Complete Solution Visualization

To create a complete visualization of a solution:

```javascript
// Solve an equation
const result = await mathrok.solve('x^2 - 4 = 0');

// Generate a complete solution visualization
const solutionHTML = mathrok.visualization.visualizeSolution(
  'x^2 - 4 = 0',  // Original expression
  result.steps,   // Solution steps
  {               // Plot options
    xMin: -3,
    xMax: 3
  }
);

// Display the solution
document.getElementById('solution-container').innerHTML = solutionHTML;
```

## Advanced Usage

### Generating SVG and Images

To generate SVG or image representations of functions:

```javascript
// Generate an SVG
const svg = mathrok.visualization.generateSVG('sin(x)', 'x', {
  xMin: -Math.PI,
  xMax: Math.PI
});
document.getElementById('svg-container').innerHTML = svg;

// Generate an image (data URL)
const imageUrl = mathrok.visualization.generateImage('cos(x)', 'x', {
  xMin: -Math.PI,
  xMax: Math.PI,
  width: 800,
  height: 400
});

// Use the image URL
const img = document.createElement('img');
img.src = imageUrl;
document.body.appendChild(img);
```

### Customizing Graph Appearance

```javascript
// Custom styling options
const options = {
  // Axis options
  xMin: -5,
  xMax: 5,
  yMin: -3,
  yMax: 3,

  // Appearance
  lineColor: '#1f77b4',
  lineWidth: 2,
  fillColor: 'rgba(31, 119, 180, 0.2)',
  fillBelow: true,

  // Grid and axes
  grid: true,
  gridColor: '#cccccc',
  axes: true,
  axesColor: '#000000',

  // Labels
  title: 'Function Plot',
  xLabel: 'x-axis',
  yLabel: 'y-axis',

  // Resolution
  points: 200,

  // Size
  width: 600,
  height: 400,

  // Interaction
  interactive: true,
  tooltip: true,

  // Animation
  animate: true,
  animationDuration: 1000
};

// Plot with custom options
mathrok.visualization.plot2D(container, 'x^2', 'x', options);
```

### Interactive Graphs

To create interactive graphs:

```javascript
// Create an interactive graph with a parameter
function createInteractiveGraph() {
  const container = document.getElementById('interactive-container');
  const slider = document.getElementById('parameter-slider');
  const valueDisplay = document.getElementById('parameter-value');

  // Initial parameter value
  let a = 1;

  // Update function
  function updateGraph() {
    // Clear container
    container.innerHTML = '';

    // Plot the function with current parameter
    mathrok.visualization.plot2D(container, `${a}*sin(x)`, 'x', {
      xMin: -Math.PI,
      xMax: Math.PI,
      title: `f(x) = ${a}·sin(x)`
    });

    // Update display
    valueDisplay.textContent = a.toFixed(1);
  }

  // Set up slider event
  slider.addEventListener('input', function() {
    a = parseFloat(this.value);
    updateGraph();
  });

  // Initial plot
  updateGraph();
}
```

### Generating HTML for Complete Solutions

```javascript
// Generate HTML for a complete solution
function generateSolutionHTML(expression, variable) {
  // Solve the expression
  return mathrok.solve(expression, variable)
    .then(result => {
      // Generate solution HTML
      const solutionHTML = mathrok.visualization.visualizeSolution(
        expression,
        result.steps,
        {
          xMin: -5,
          xMax: 5,
          title: `Solution for ${expression}`
        }
      );

      // Create a container with additional information
      return `
        <div class="solution-container">
          <h2>Solution for ${expression}</h2>
          <div class="solution-summary">
            <p>Expression: ${mathrok.visualization.renderMath(expression)}</p>
            <p>Result: ${mathrok.visualization.renderMath(result.result.toString())}</p>
          </div>
          <div class="solution-details">
            ${solutionHTML}
          </div>
        </div>
      `;
    });
}

// Use the function
generateSolutionHTML('x^2 - 4 = 0', 'x')
  .then(html => {
    document.getElementById('output').innerHTML = html;
  });
```

## Customization Options

### 2D Plot Options

```javascript
const options2D = {
  // Axis bounds
  xMin: -10,           // Minimum x value
  xMax: 10,            // Maximum x value
  yMin: -5,            // Minimum y value
  yMax: 5,             // Maximum y value

  // Appearance
  lineColor: '#1f77b4', // Line color (CSS color)
  lineWidth: 2,         // Line width in pixels
  fillColor: 'rgba(31, 119, 180, 0.2)', // Fill color
  fillBelow: false,     // Fill area below curve

  // Grid and axes
  grid: true,           // Show grid
  gridColor: '#cccccc', // Grid color
  axes: true,           // Show axes
  axesColor: '#000000', // Axes color

  // Labels
  title: '',            // Plot title
  xLabel: 'x',          // x-axis label
  yLabel: 'y',          // y-axis label

  // Resolution
  points: 100,          // Number of points to calculate

  // Size
  width: 600,           // Width in pixels
  height: 400,          // Height in pixels

  // Interaction
  interactive: true,    // Enable interaction
  tooltip: true,        // Show tooltips on hover

  // Animation
  animate: false,       // Enable animation
  animationDuration: 500 // Animation duration in ms
};
```

### 3D Plot Options

```javascript
const options3D = {
  // Axis bounds
  xMin: -5,             // Minimum x value
  xMax: 5,              // Maximum x value
  yMin: -5,             // Minimum y value
  yMax: 5,              // Maximum y value
  zMin: null,           // Minimum z value (auto if null)
  zMax: null,           // Maximum z value (auto if null)

  // Appearance
  colorMap: 'viridis',  // Color map name
  wireframe: false,     // Show wireframe

  // Grid and axes
  grid: true,           // Show grid
  axes: true,           // Show axes

  // Labels
  title: '',            // Plot title
  xLabel: 'x',          // x-axis label
  yLabel: 'y',          // y-axis label
  zLabel: 'z',          // z-axis label

  // Resolution
  points: 50,           // Points per dimension

  // Size
  width: 600,           // Width in pixels
  height: 400,          // Height in pixels

  // Interaction
  interactive: true,    // Enable interaction
  rotate: true,         // Enable rotation

  // Lighting
  lighting: true,       // Enable lighting
  ambient: 0.3,         // Ambient light intensity
  directional: 0.7      // Directional light intensity
};
```

### Math Rendering Options

```javascript
const mathOptions = {
  // Format options
  format: 'latex',      // 'latex', 'mathml', or 'asciimath'
  displayMode: true,    // Display mode (block) or inline

  // Styling
  fontSize: 16,         // Font size in pixels
  color: '#000000',     // Text color
  background: 'transparent', // Background color

  // Delimiters
  inlineMath: [['$', '$'], ['\\(', '\\)']], // Inline math delimiters
  displayMath: [['$$', '$$'], ['\\[', '\\]']], // Display math delimiters

  // Extensions
  extensions: ['AMSmath', 'AMSsymbols', 'noErrors', 'noUndefined'],

  // Accessibility
  assistiveMml: true    // Add hidden MathML for accessibility
};
```

## Integration with Other Features

### Combining with Voice Features

```javascript
// Create an interactive voice-enabled graph
async function createVoiceEnabledGraph() {
  const container = document.getElementById('graph-container');
  const voiceButton = document.getElementById('voice-button');

  // Plot initial function
  mathrok.visualization.plot2D(container, 'sin(x)', 'x');

  // Set up voice button
  voiceButton.addEventListener('click', async () => {
    try {
      // Prompt user
      await mathrok.voice.speak('Please say a function to plot');

      // Listen for function
      const result = await mathrok.voice.listen();

      // Process the input
      const nlResult = await mathrok.nl(result.text);

      // Extract the expression
      const expression = nlResult.expression || result.text;

      // Plot the function
      container.innerHTML = '';
      mathrok.visualization.plot2D(container, expression, 'x');

      // Confirm to user
      await mathrok.voice.speak(`Plotting ${expression}`);
    } catch (error) {
      console.error('Voice graph error:', error);
    }
  });
}
```

### Combining with Natural Language Processing

```javascript
// Create a natural language graph generator
async function nlGraph() {
  const container = document.getElementById('graph-container');
  const inputField = document.getElementById('nl-input');
  const plotButton = document.getElementById('plot-button');

  plotButton.addEventListener('click', async () => {
    try {
      const query = inputField.value;

      // Process the natural language query
      const result = await mathrok.nl(query);

      // Check if we got an expression
      if (result.expression) {
        // Plot the expression
        container.innerHTML = '';
        mathrok.visualization.plot2D(container, result.expression, 'x');
      } else {
        alert('Could not extract a plottable expression from the query');
      }
    } catch (error) {
      console.error('NL graph error:', error);
    }
  });
}
```

## Examples

### Interactive Function Explorer

```javascript
class FunctionExplorer {
  constructor() {
    this.mathrok = new Mathrok();
    this.container = document.getElementById('explorer-container');
    this.expressionInput = document.getElementById('expression-input');
    this.plotButton = document.getElementById('plot-button');
    this.xMinInput = document.getElementById('x-min');
    this.xMaxInput = document.getElementById('x-max');

    // Set default values
    this.expressionInput.value = 'sin(x)';
    this.xMinInput.value = '-3.14';
    this.xMaxInput.value = '3.14';

    // Set up event listeners
    this.plotButton.addEventListener('click', () => this.plotFunction());

    // Initial plot
    this.plotFunction();
  }

  plotFunction() {
    const expression = this.expressionInput.value;
    const xMin = parseFloat(this.xMinInput.value);
    const xMax = parseFloat(this.xMaxInput.value);

    // Validate inputs
    if (!expression || isNaN(xMin) || isNaN(xMax)) {
      alert('Please enter valid values');
      return;
    }

    try {
      // Clear container
      this.container.innerHTML = '';

      // Plot the function
      this.mathrok.visualization.plot2D(this.container, expression, 'x', {
        xMin: xMin,
        xMax: xMax,
        title: expression
      });
    } catch (error) {
      console.error('Plot error:', error);
      alert(`Error plotting function: ${error.message}`);
    }
  }
}

// Initialize the explorer
const explorer = new FunctionExplorer();
```

### Step-by-Step Equation Solver

```javascript
class EquationSolver {
  constructor() {
    this.mathrok = new Mathrok();
    this.equationInput = document.getElementById('equation-input');
    this.solveButton = document.getElementById('solve-button');
    this.solutionContainer = document.getElementById('solution-container');

    // Set up event listeners
    this.solveButton.addEventListener('click', () => this.solveEquation());
  }

  async solveEquation() {
    const equation = this.equationInput.value;

    if (!equation) {
      alert('Please enter an equation');
      return;
    }

    try {
      // Show loading state
      this.solutionContainer.innerHTML = '<p>Solving...</p>';

      // Solve the equation
      const result = await this.mathrok.solve(equation);

      // Generate visualization
      const solutionHTML = this.mathrok.visualization.visualizeSolution(
        equation,
        result.steps,
        {
          xMin: -10,
          xMax: 10
        }
      );

      // Display the solution
      this.solutionContainer.innerHTML = solutionHTML;
    } catch (error) {
      console.error('Solve error:', error);
      this.solutionContainer.innerHTML = `<p>Error: ${error.message}</p>`;
    }
  }
}

// Initialize the solver
const solver = new EquationSolver();
```

### Function Comparison Tool

```javascript
class FunctionComparison {
  constructor() {
    this.mathrok = new Mathrok();
    this.container = document.getElementById('comparison-container');
    this.functionsInput = document.getElementById('functions-input');
    this.compareButton = document.getElementById('compare-button');

    // Set default values
    this.functionsInput.value = 'sin(x), cos(x), tan(x)';

    // Set up event listeners
    this.compareButton.addEventListener('click', () => this.compareFunctions());

    // Initial comparison
    this.compareFunctions();
  }

  compareFunctions() {
    // Get functions as comma-separated list
    const functionsText = this.functionsInput.value;
    const functions = functionsText.split(',').map(f => f.trim());

    if (functions.length === 0) {
      alert('Please enter at least one function');
      return;
    }

    try {
      // Clear container
      this.container.innerHTML = '';

      // Generate colors
      const colors = this.generateColors(functions.length);

      // Generate legend
      const legend = functions.map((f, i) => ({
        label: f,
        color: colors[i]
      }));

      // Plot the functions
      this.mathrok.visualization.plotMultiple(this.container, functions, 'x', {
        xMin: -Math.PI,
        xMax: Math.PI,
        colors: colors,
        legend: functions,
        title: 'Function Comparison'
      });
    } catch (error) {
      console.error('Comparison error:', error);
      alert(`Error comparing functions: ${error.message}`);
    }
  }

  generateColors(count) {
    // Generate distinct colors
    const baseColors = [
      '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
      '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'
    ];

    // Return colors, repeating if necessary
    return Array(count).fill(0).map((_, i) => baseColors[i % baseColors.length]);
  }
}

// Initialize the comparison tool
const comparison = new FunctionComparison();
```

## Troubleshooting

### Common Issues and Solutions

1. **"Graph not displaying"**
   - Check if the container element exists and has dimensions
   - Verify that the expression is valid
   - Check browser console for errors

2. **"Mathematical notation not rendering"**
   - Ensure LaTeX syntax is correct
   - Check if the container is properly set up
   - Verify that the browser supports the rendering method

3. **"3D plots not working"**
   - 3D plots require WebGL support in the browser
   - Check if hardware acceleration is enabled
   - Try reducing the number of points for better performance

4. **"SVG generation failing"**
   - Verify that the expression is valid
   - Check if the browser supports SVG
   - Try with simpler expressions first

### Debugging Visualization Features

```javascript
// Enable debug mode
mathrok.config.set({ debug: true });

// Test basic plotting
function testPlotting() {
  console.log('Testing basic plotting...');
  try {
    const container = document.createElement('div');
    container.style.width = '400px';
    container.style.height = '300px';
    document.body.appendChild(container);

    console.log('Plotting sin(x)...');
    mathrok.visualization.plot2D(container, 'sin(x)', 'x');
    console.log('Plot created');

    // Test SVG generation
    console.log('Generating SVG...');
    const svg = mathrok.visualization.generateSVG('sin(x)', 'x');
    console.log('SVG length:', svg.length);

    // Clean up
    setTimeout(() => {
      document.body.removeChild(container);
    }, 5000);
  } catch (error) {
    console.error('Plotting test error:', error);
  }
}

// Test math rendering
function testMathRendering() {
  console.log('Testing math rendering...');
  try {
    const container = document.createElement('div');
    document.body.appendChild(container);

    console.log('Rendering LaTeX...');
    const latex = mathrok.visualization.renderMath('\\frac{d}{dx}x^2 = 2x', 'latex', true);
    container.innerHTML = latex;
    console.log('LaTeX rendered');

    // Clean up
    setTimeout(() => {
      document.body.removeChild(container);
    }, 5000);
  } catch (error) {
    console.error('Math rendering test error:', error);
  }
}
```