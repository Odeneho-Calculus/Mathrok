# Mathrok Examples

This directory contains examples demonstrating how to use the Mathrok library for various mathematical tasks. Each example is self-contained and focuses on a specific feature or use case.

## Basic Examples

### 1. [Basic Operations](./basic-operations.js)

Demonstrates basic mathematical operations like solving equations, calculating derivatives, and simplifying expressions.

```javascript
// Example: Calculate a derivative
const derivative = await mathrok.derivative('sin(x)', 'x');
console.log(derivative.result); // cos(x)
```

### 2. [Equation Solving](./equation-solving.js)

Shows how to solve different types of equations, from simple linear equations to complex systems.

```javascript
// Example: Solve a quadratic equation
const result = await mathrok.solve('x^2 - 4 = 0');
console.log(result.result); // [-2, 2]
```

### 3. [Calculus Operations](./calculus-operations.js)

Examples of calculus operations including derivatives, integrals, and limits.

```javascript
// Example: Calculate an integral
const integral = await mathrok.integral('x^2', 'x');
console.log(integral.result); // (1/3)x^3 + C
```

## Advanced Examples

### 4. [Natural Language Processing](./natural-language.js)

Demonstrates how to use the natural language processing capabilities to solve math problems expressed in plain English.

```javascript
// Example: Process a natural language query
const result = await mathrok.nl('find the derivative of x squared');
console.log(result.result); // 2*x
```

### 5. [Step-by-Step Solutions](./step-by-step.js)

Shows how to get detailed step-by-step solutions with explanations.

```javascript
// Example: Get step-by-step solution
const result = await mathrok.solve('x^2 - 4 = 0');
result.steps.forEach((step, index) => {
  console.log(`Step ${index + 1}: ${step.text}`);
  console.log(`Expression: ${step.expression}`);
});

// Create HTML for steps with LaTeX rendering
const stepsHTML = result.steps.map(step => `
  <div class="step">
    <div class="step-text">${step.text}</div>
    <div class="step-expression">${mathrok.visualization.renderMath(step.expression, 'latex', true)}</div>
  </div>
`).join('');

document.getElementById('solution-container').innerHTML = stepsHTML;
```

### 6. [Matrix Operations](./matrix-operations.js)

Examples of matrix operations including multiplication, determinants, and solving linear systems.

```javascript
// Example: Matrix multiplication
const matrixA = [[1, 2], [3, 4]];
const matrixB = [[5, 6], [7, 8]];
const result = await mathrok.matrix.multiply(matrixA, matrixB);
console.log(result.result.data); // [[19, 22], [43, 50]]
```

## Visualization Examples

### 7. [2D Function Plotting](./2d-plotting.js)

Demonstrates how to plot 2D functions with various options.

```javascript
// Example: Plot a 2D function
const container = document.getElementById('graph-container');
mathrok.visualization.plot2D(container, 'sin(x)', 'x', {
  xMin: -Math.PI,
  xMax: Math.PI
});
```

### 8. [3D Function Plotting](./3d-plotting.js)

Shows how to create 3D surface plots.

```javascript
// Example: Plot a 3D function
const container = document.getElementById('graph-container');
mathrok.visualization.plot3D(container, 'sin(x)*cos(y)');
```

### 9. [Mathematical Notation Rendering](./math-rendering.js)

Examples of rendering mathematical notation in various formats.

```javascript
// Example: Render LaTeX
const latex = mathrok.visualization.renderMath('\\frac{d}{dx}x^2 = 2x', 'latex', true);
document.getElementById('math-container').innerHTML = latex;
```

## Voice Integration Examples

### 10. [Voice Input](./voice-input.js)

Demonstrates how to use voice input for mathematical expressions.

```javascript
// Example: Listen for mathematical input
const result = await mathrok.voice.listen();
console.log(result.text); // "solve x squared minus 4 equals 0"
```

### 11. [Voice Output](./voice-output.js)

Shows how to use text-to-speech for mathematical expressions and explanations.

```javascript
// Example: Speak a mathematical expression
await mathrok.voice.speak('The derivative of x squared is 2x');
```

### 12. [Voice-Guided Solutions](./voice-guided-solutions.js)

Demonstrates how to create voice-guided step-by-step solutions.

```javascript
// Example: Speak solution steps
const result = await mathrok.solve('x^2 - 4 = 0');
await mathrok.voice.speakSolution(result.steps);
```

## Web Application Examples

### 13. [Interactive Calculator](./interactive-calculator.js)

A complete example of an interactive calculator with visualization.

```javascript
// See the full example for implementation details
```

### 14. [Math Tutor Application](./math-tutor.js)

An educational application that provides step-by-step guidance and explanations.

```javascript
// See the full example for implementation details
```

### 15. [Function Explorer](./function-explorer.js)

An interactive tool for exploring mathematical functions with visualization.

```javascript
// See the full example for implementation details
```

## Running the Examples

### Browser Examples

For browser-based examples:

1. Include the Mathrok library:
   ```html
   <script src="https://cdn.jsdelivr.net/npm/mathrok@1.1.0/dist/mathrok.umd.js"></script>
   ```

2. Copy the example code into your HTML file or include it as a separate script:
   ```html
   <script src="example.js"></script>
   ```

3. Add necessary HTML elements (for visualization examples):
   ```html
   <div id="graph-container" style="width: 600px; height: 400px;"></div>
   ```

### Node.js Examples

For Node.js examples:

1. Install Mathrok:
   ```bash
   npm install mathrok
   ```

2. Run the example:
   ```bash
   node example.js
   ```

## Creating Your Own Examples

Feel free to create your own examples based on these templates. If you create something useful, consider contributing it back to the project!

To contribute an example:

1. Create a new JavaScript file in this directory
2. Add a description to this README
3. Submit a pull request

## Additional Resources

- [API Reference](/docs/api/API_REFERENCE.md)
- [Getting Started Guide](/docs/guides/GETTING_STARTED.md)
- [Voice Features Guide](/docs/guides/VOICE_FEATURES.md)
- [Visualization Guide](/docs/guides/VISUALIZATION.md)