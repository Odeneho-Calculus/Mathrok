# Mathrok - AI-Powered Symbolic Mathematics Library

[![npm version](https://img.shields.io/badge/npm-v1.1.0-blue.svg)](https://www.npmjs.com/package/mathrok)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue.svg)](https://www.typescriptlang.org/)
[![Bundle Size](https://img.shields.io/badge/bundle%20size-~380KB-green.svg)](https://bundlephobia.com/package/mathrok)

Mathrok is a comprehensive symbolic mathematics library that combines traditional Computer Algebra System (CAS) capabilities with natural language processing, voice interaction, and visualization features for advanced mathematical problem-solving.

## Features

- **Symbolic Mathematics**: Solve equations, calculate derivatives, integrals, limits, and more
- **Natural Language Processing**: Understand and solve math problems expressed in plain English
- **Step-by-Step Solutions**: Detailed explanations with educational content
- **Voice Interaction**: Speech-to-text for mathematical expressions and audio explanations
- **Visualization**: 2D and 3D function plotting with mathematical notation rendering
- **Performance Optimized**: Intelligent caching, lazy loading, and minimal bundle size

## Installation

```bash
npm install mathrok
```

## Quick Start

```javascript
import { Mathrok } from 'mathrok';

// Initialize the library
const mathrok = new Mathrok();

// Solve an equation
const result = await mathrok.solve('x^2 + 2x - 3 = 0');
console.log(result.result); // [-3, 1]

// Calculate a derivative
const derivative = await mathrok.derivative('sin(x)', 'x');
console.log(derivative.result); // cos(x)

// Process natural language
const nlResult = await mathrok.nl('find the derivative of x^2');
console.log(nlResult.result); // 2*x

// Visualize a function
const container = document.getElementById('graph-container');
mathrok.visualization.plot2D(container, 'sin(x)', 'x', {
  xMin: -Math.PI,
  xMax: Math.PI
});

// Use voice input
const voiceResult = await mathrok.voice.listen();
console.log(voiceResult.text); // "solve x squared plus 2x minus 3 equals 0"
```

## Documentation

Comprehensive documentation is available in the [docs](/docs) directory:

- [Getting Started Guide](/docs/guides/GETTING_STARTED.md)
- [API Reference](/docs/api/API_REFERENCE.md)
- [Voice Features Guide](/docs/guides/VOICE_FEATURES.md)
- [Visualization Guide](/docs/guides/VISUALIZATION.md)
- [Examples](/docs/examples/README.md)
- [Contributing Guide](/docs/guides/CONTRIBUTING.md)

## Core Features

### Symbolic Mathematics

```javascript
// Solve equations
const eqResult = await mathrok.solve('x^2 - 4 = 0');

// Calculate derivatives
const derResult = await mathrok.derivative('x^3 + 2x^2', 'x');

// Calculate integrals
const intResult = await mathrok.integral('x^2', 'x');

// Factor expressions
const factorResult = await mathrok.factor('x^2 - 4');

// Simplify expressions
const simplifyResult = await mathrok.simplify('2x + 3x');

// Matrix operations
const matrixResult = await mathrok.matrix.multiply([[1, 2], [3, 4]], [[5, 6], [7, 8]]);
```

### Natural Language Processing

```javascript
// Basic NL processing
const result = await mathrok.nl('find the derivative of x^2 sin(x)');

// Advanced multi-step problems
const advResult = await mathrok.nl('first factor x^2 - 4 then solve x^2 - 4 = 0');

// Educational explanations
const explainResult = await mathrok.explain('derivative', 'beginner');
```

### Voice Features

```javascript
// Check if voice is supported
const support = mathrok.voice.isSupported();

// Listen for mathematical input
const voiceInput = await mathrok.voice.listen();

// Speak a mathematical expression
await mathrok.voice.speak('The derivative of x squared is 2x');

// Speak a step-by-step solution
await mathrok.voice.speakSolution(steps);
```

### Visualization

```javascript
// Plot a 2D function
mathrok.visualization.plot2D(container, 'sin(x)', 'x');

// Plot a 3D function
mathrok.visualization.plot3D(container, 'sin(x)*cos(y)');

// Plot multiple functions
mathrok.visualization.plotMultiple(container, ['sin(x)', 'cos(x)'], 'x');

// Render mathematical notation
const latex = mathrok.visualization.renderMath('\\frac{d}{dx}x^2 = 2x', 'latex', true);
```

## Advanced Configuration

```javascript
// Configure the library
mathrok.config.set({
  precision: 10,
  timeout: 5000,
  aiEnabled: true,
  cacheEnabled: true,
  voiceEnabled: true,
  visualizationEnabled: true
});

// Monitor performance
const metrics = mathrok.performance.getMetrics();
console.log(`Average operation time: ${metrics.averageTime}ms`);
```

## Browser Support

Mathrok works in all modern browsers (Chrome, Firefox, Safari, Edge) and Node.js environments. The voice features require browser support for the Web Speech API.

## License

MIT © [Mathrok Team](https://github.com/Odeneho-Calculus/Mathrok)

## Contributing

Contributions are welcome! Please see our [Contributing Guide](/docs/guides/CONTRIBUTING.md) for more details.