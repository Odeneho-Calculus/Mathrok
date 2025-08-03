# Getting Started with Mathrok

This guide will help you get started with Mathrok, an AI-powered symbolic mathematics library that combines traditional Computer Algebra System (CAS) capabilities with natural language processing, voice interaction, and visualization features.

## Installation

### NPM

```bash
npm install mathrok
```

### Yarn

```bash
yarn add mathrok
```

## Basic Setup

### ES Modules (Recommended)

```javascript
import { Mathrok } from 'mathrok';

// Initialize the library
const mathrok = new Mathrok();
```

### CommonJS

```javascript
const { Mathrok } = require('mathrok');

// Initialize the library
const mathrok = new Mathrok();
```

### Browser via CDN

```html
<script src="https://cdn.jsdelivr.net/npm/mathrok@1.1.0/dist/mathrok.umd.js"></script>
<script>
  // The library is available as a global variable
  const mathrok = new Mathrok();
</script>
```

## Basic Usage

### Solving Equations

```javascript
// Solve a simple equation
const result = await mathrok.solve('x^2 - 4 = 0');
console.log(result.result); // [-2, 2]

// Solve with variables
const result2 = await mathrok.solve('ax^2 + bx + c = 0', { a: 1, b: 3, c: 2 });
console.log(result2.result); // [-2, -1]

// Get step-by-step solution
console.log(result.steps);
```

### Calculus Operations

```javascript
// Calculate a derivative
const derivative = await mathrok.derivative('sin(x)', 'x');
console.log(derivative.result); // cos(x)

// Calculate an integral
const integral = await mathrok.integral('x^2', 'x');
console.log(integral.result); // (1/3)x^3 + C

// Calculate a limit
const limit = await mathrok.limit('sin(x)/x', 'x', 0);
console.log(limit.result); // 1
```

### Algebraic Operations

```javascript
// Factor an expression
const factored = await mathrok.factor('x^2 - 4');
console.log(factored.result); // (x - 2)(x + 2)

// Expand an expression
const expanded = await mathrok.expand('(x + 1)^2');
console.log(expanded.result); // x^2 + 2x + 1

// Simplify an expression
const simplified = await mathrok.simplify('2x + 3x');
console.log(simplified.result); // 5x
```

### Matrix Operations

```javascript
// Create matrices
const matrixA = mathrok.matrix.create([[1, 2], [3, 4]]);
const matrixB = mathrok.matrix.create([[5, 6], [7, 8]]);

// Multiply matrices
const product = await mathrok.matrix.multiply(matrixA, matrixB);
console.log(product.result.data); // [[19, 22], [43, 50]]

// Calculate determinant
const det = await mathrok.matrix.determinant(matrixA);
console.log(det.result); // -2

// Invert a matrix
const inverse = await mathrok.matrix.invert(matrixA);
console.log(inverse.result.data); // [[-2, 1], [1.5, -0.5]]
```

### Statistics

```javascript
// Calculate descriptive statistics
const stats = await mathrok.calculateStatistics([1, 2, 3, 4, 5]);
console.log(stats.result.mean); // 3
console.log(stats.result.median); // 3
console.log(stats.result.standardDeviation); // 1.4142...

// Perform a t-test
const tTest = await mathrok.calculateStatistics([1, 2, 3, 4, 5], {
  operation: 'tTest',
  testValue: 2.5
});
console.log(tTest.result.pValue);
```

## Natural Language Processing

```javascript
// Process a natural language query
const nlResult = await mathrok.nl('find the derivative of x^2');
console.log(nlResult.result); // 2*x

// Multi-step problems
const multiStep = await mathrok.nl('first factor x^2 - 4 then solve x^2 - 4 = 0');
console.log(multiStep.result); // [-2, 2]

// Educational explanations
const explanation = await mathrok.explain('derivative', 'beginner');
console.log(explanation.explanation);
```

## Voice Features

```javascript
// Check if voice is supported
const support = mathrok.voice.isSupported();
console.log(support); // { input: true, output: true }

// Listen for mathematical input
const voiceInput = await mathrok.voice.listen();
console.log(voiceInput.text); // "solve x squared minus 4 equals 0"
console.log(voiceInput.confidence); // 0.92

// Speak a mathematical expression
await mathrok.voice.speak('The derivative of x squared is 2x');

// Speak a step-by-step solution
const solveResult = await mathrok.solve('x^2 - 4 = 0');
await mathrok.voice.speakSolution(solveResult.steps);
```

## Visualization

```javascript
// Get a container element
const container = document.getElementById('graph-container');

// Plot a 2D function
mathrok.visualization.plot2D(container, 'sin(x)', 'x', {
  xMin: -Math.PI,
  xMax: Math.PI,
  lineColor: '#1f77b4'
});

// Plot a 3D function
mathrok.visualization.plot3D(container, 'sin(x)*cos(y)', {
  xMin: -Math.PI,
  xMax: Math.PI,
  yMin: -Math.PI,
  yMax: Math.PI
});

// Plot multiple functions
mathrok.visualization.plotMultiple(container, ['sin(x)', 'cos(x)'], 'x');

// Render mathematical notation
const latex = mathrok.visualization.renderMath('\\frac{d}{dx}x^2 = 2x', 'latex', true);
document.getElementById('math-container').innerHTML = latex;

// Visualize a complete solution
const solveResult = await mathrok.solve('x^2 - 4 = 0');
const solutionHTML = mathrok.visualization.visualizeSolution(
  'x^2 - 4 = 0',
  solveResult.steps,
  { xMin: -3, xMax: 3 }
);
document.getElementById('solution-container').innerHTML = solutionHTML;
```

## Configuration

```javascript
// Get current configuration
const currentConfig = mathrok.config.get();
console.log(currentConfig);

// Set configuration
mathrok.config.set({
  precision: 10,           // Decimal precision
  timeout: 5000,           // Operation timeout in ms
  aiEnabled: true,         // Enable AI features
  cacheEnabled: true,      // Enable caching
  voiceEnabled: true,      // Enable voice features
  visualizationEnabled: true, // Enable visualization
  performanceMonitoring: true // Enable performance monitoring
});

// Reset to default configuration
mathrok.config.reset();

// Add a custom function
mathrok.config.addFunction({
  name: 'double',
  params: ['x'],
  body: 'return 2 * x;'
});

// Use the custom function
const result = await mathrok.evaluate('double(5)');
console.log(result.result); // 10
```

## Performance Monitoring

```javascript
// Start profiling
mathrok.performance.startProfiling();

// Perform operations
await mathrok.solve('x^2 - 4 = 0');
await mathrok.derivative('sin(x)', 'x');

// Stop profiling and get metrics
const metrics = mathrok.performance.stopProfiling();
console.log(metrics.duration); // Total duration in ms
console.log(metrics.operations); // Number of operations
console.log(metrics.averageTime); // Average operation time

// Get current metrics without stopping
const currentMetrics = mathrok.performance.getMetrics();
console.log(currentMetrics);

// Reset metrics
mathrok.performance.reset();
```

## Next Steps

Now that you're familiar with the basics, check out these resources for more advanced usage:

- [API Reference](/docs/api/API_REFERENCE.md) - Complete API documentation
- [Natural Language Processing](/docs/AI_INTEGRATION.md) - Advanced NLP features
- [Voice Features Guide](/docs/guides/VOICE_FEATURES.md) - Voice input and output
- [Visualization Guide](/docs/guides/VISUALIZATION.md) - Function plotting and math rendering
- [Examples](/docs/examples/README.md) - Code examples for common use cases