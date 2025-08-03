# Mathrok API Reference

This document provides a comprehensive reference for the Mathrok API. It covers all available methods, their parameters, return types, and usage examples.

## Table of Contents

- [Core API](#core-api)
  - [Constructor](#constructor)
  - [Solve](#solve)
  - [Evaluate](#evaluate)
  - [Simplify](#simplify)
  - [Factor](#factor)
  - [Expand](#expand)
  - [Derivative](#derivative)
  - [Integral](#integral)
  - [Limit](#limit)
  - [Solve Equation](#solve-equation)
  - [Solve System](#solve-system)
  - [Calculate Statistics](#calculate-statistics)
  - [Process Matrix](#process-matrix)
- [Natural Language API](#natural-language-api)
  - [Process Natural Language](#process-natural-language)
  - [Explain](#explain)
- [Voice API](#voice-api)
  - [Is Supported](#is-supported)
  - [Listen](#listen)
  - [Speak](#speak)
  - [Speak Solution](#speak-solution)
  - [Stop](#stop)
  - [Get Voices](#get-voices)
- [Visualization API](#visualization-api)
  - [Plot 2D](#plot-2d)
  - [Plot 3D](#plot-3d)
  - [Plot Multiple](#plot-multiple)
  - [Generate SVG](#generate-svg)
  - [Generate Image](#generate-image)
  - [Render Math](#render-math)
  - [Render Steps](#render-steps)
  - [Visualize Solution](#visualize-solution)
- [Configuration API](#configuration-api)
  - [Get](#get)
  - [Set](#set)
  - [Reset](#reset)
  - [Add Function](#add-function)
  - [Remove Function](#remove-function)
- [Performance API](#performance-api)
  - [Get Metrics](#get-metrics)
  - [Reset](#reset-1)
  - [Start Profiling](#start-profiling)
  - [Stop Profiling](#stop-profiling)

## Core API

### Constructor

Creates a new instance of the Mathrok library.

```typescript
constructor(config?: Partial<MathConfig>)
```

**Parameters:**
- `config` (optional): Configuration options for the library

**Example:**
```javascript
const mathrok = new Mathrok({
  precision: 10,
  timeout: 5000,
  aiEnabled: true
});
```

### Solve

Solves mathematical equations and expressions.

```typescript
solve(expression: string, options?: SolveOptions): Promise<SolveResult>
solve(expression: string, variables?: Record<string, any>, options?: SolveOptions): Promise<SolveResult>
```

**Parameters:**
- `expression`: The mathematical expression or equation to solve
- `variables` (optional): Variable assignments for the expression
- `options` (optional): Solving options

**Returns:**
- `Promise<SolveResult>`: The solution result

**Example:**
```javascript
// Solve an equation
const result = await mathrok.solve('x^2 - 4 = 0');
console.log(result.result); // [-2, 2]

// Solve with variables
const result2 = await mathrok.solve('ax^2 + bx + c = 0', { a: 1, b: 3, c: 2 });
```

### Evaluate

Evaluates a mathematical expression with given variables.

```typescript
evaluate(expression: string, variables?: Record<string, any>): EvaluateResult
```

**Parameters:**
- `expression`: The mathematical expression to evaluate
- `variables` (optional): Variable assignments for the expression

**Returns:**
- `EvaluateResult`: The evaluation result

**Example:**
```javascript
const result = mathrok.evaluate('2*x + y', { x: 3, y: 4 });
console.log(result.result); // 10
```

### Simplify

Simplifies a mathematical expression.

```typescript
simplify(expression: string): SimplifyResult
```

**Parameters:**
- `expression`: The mathematical expression to simplify

**Returns:**
- `SimplifyResult`: The simplified expression

**Example:**
```javascript
const result = mathrok.simplify('2*x + 3*x');
console.log(result.result); // 5*x
```

### Factor

Factors a mathematical expression.

```typescript
factor(expression: string): FactorResult
```

**Parameters:**
- `expression`: The mathematical expression to factor

**Returns:**
- `FactorResult`: The factored expression

**Example:**
```javascript
const result = mathrok.factor('x^2 - 4');
console.log(result.result); // (x - 2)*(x + 2)
```

### Expand

Expands a mathematical expression.

```typescript
expand(expression: string): ExpandResult
```

**Parameters:**
- `expression`: The mathematical expression to expand

**Returns:**
- `ExpandResult`: The expanded expression

**Example:**
```javascript
const result = mathrok.expand('(x + 1)^2');
console.log(result.result); // x^2 + 2*x + 1
```

### Derivative

Calculates the derivative of an expression.

```typescript
derivative(expression: string, variable?: string): DeriveResult
```

**Parameters:**
- `expression`: The mathematical expression to differentiate
- `variable` (optional): The variable to differentiate with respect to (defaults to 'x')

**Returns:**
- `DeriveResult`: The derivative result

**Example:**
```javascript
const result = mathrok.derivative('sin(x)', 'x');
console.log(result.result); // cos(x)
```

### Integral

Calculates the integral of an expression.

```typescript
integral(expression: string, variable?: string, config?: Partial<IntegralConfig>): IntegralResult
```

**Parameters:**
- `expression`: The mathematical expression to integrate
- `variable` (optional): The variable to integrate with respect to (defaults to 'x')
- `config` (optional): Integration configuration options

**Returns:**
- `IntegralResult`: The integral result

**Example:**
```javascript
// Indefinite integral
const result = mathrok.integral('x^2', 'x');
console.log(result.result); // (1/3)*x^3 + C

// Definite integral
const result2 = mathrok.integral('x^2', 'x', {
  definite: true,
  lowerBound: 0,
  upperBound: 1
});
console.log(result2.result); // 1/3
```

### Limit

Calculates the limit of an expression.

```typescript
limit(expression: string, variable: string, value: number | string): LimitResult
```

**Parameters:**
- `expression`: The mathematical expression to find the limit of
- `variable`: The variable in the expression
- `value`: The value the variable approaches

**Returns:**
- `LimitResult`: The limit result

**Example:**
```javascript
const result = mathrok.limit('sin(x)/x', 'x', 0);
console.log(result.result); // 1
```

### Solve Equation

Solves a single equation for a variable.

```typescript
solveEquation(equation: string, variable?: string): EquationResult
```

**Parameters:**
- `equation`: The equation to solve
- `variable` (optional): The variable to solve for (defaults to 'x')

**Returns:**
- `EquationResult`: The equation solution

**Example:**
```javascript
const result = mathrok.solveEquation('x^2 - 4 = 0', 'x');
console.log(result.result); // [-2, 2]
```

### Solve System

Solves a system of equations.

```typescript
solveSystem(equations: string[], variables?: string[]): SystemResult
```

**Parameters:**
- `equations`: Array of equations to solve
- `variables` (optional): Array of variables to solve for

**Returns:**
- `SystemResult`: The system solution

**Example:**
```javascript
const result = mathrok.solveSystem(['x + y = 10', 'x - y = 2']);
console.log(result.result); // { x: 6, y: 4 }
```

### Calculate Statistics

Performs statistical calculations on data.

```typescript
calculateStatistics(data: number[] | string, options?: StatisticsOptions): StatisticsResult
```

**Parameters:**
- `data`: Array of numbers or a string representation of data
- `options` (optional): Statistics calculation options

**Returns:**
- `StatisticsResult`: The statistical results

**Example:**
```javascript
const result = mathrok.calculateStatistics([1, 2, 3, 4, 5]);
console.log(result.result.mean); // 3
console.log(result.result.median); // 3
console.log(result.result.standardDeviation); // 1.4142...
```

### Process Matrix

Performs matrix operations.

```typescript
processMatrix(matrix: number[][] | string, operation: MatrixOperation): MatrixResult
```

**Parameters:**
- `matrix`: The matrix to process (2D array or string representation)
- `operation`: The matrix operation to perform

**Returns:**
- `MatrixResult`: The matrix operation result

**Example:**
```javascript
const result = mathrok.processMatrix([[1, 2], [3, 4]], 'determinant');
console.log(result.result); // -2
```

## Natural Language API

### Process Natural Language

Processes a natural language mathematical query.

```typescript
nl(query: string, config?: Partial<NLConfig>): Promise<NLResult>
```

**Parameters:**
- `query`: The natural language query
- `config` (optional): NLP configuration options

**Returns:**
- `Promise<NLResult>`: The processed result

**Example:**
```javascript
const result = await mathrok.nl('find the derivative of x squared');
console.log(result.result); // 2*x
console.log(result.intent); // CALCULATE_DERIVATIVE
console.log(result.expression); // 'x^2'
```

### Explain

Explains a mathematical concept or solution.

```typescript
explain(expression: string, level?: ExplanationLevel): Promise<ExplanationResult>
```

**Parameters:**
- `expression`: The mathematical expression or concept to explain
- `level` (optional): The educational level (1-5)

**Returns:**
- `Promise<ExplanationResult>`: The explanation result

**Example:**
```javascript
const result = await mathrok.explain('derivative', 'beginner');
console.log(result.explanation);
console.log(result.concepts);
```

## Voice API

### Is Supported

Checks if voice input and output are supported.

```typescript
voice.isSupported(): { input: boolean; output: boolean }
```

**Returns:**
- Object with `input` and `output` boolean properties

**Example:**
```javascript
const support = mathrok.voice.isSupported();
console.log(support); // { input: true, output: true }
```

### Listen

Listens for a mathematical expression via microphone.

```typescript
voice.listen(): Promise<{ text: string; confidence: number }>
```

**Returns:**
- `Promise` with recognized text and confidence score

**Example:**
```javascript
const result = await mathrok.voice.listen();
console.log(result.text); // "solve x squared minus 4 equals 0"
console.log(result.confidence); // 0.92
```

### Speak

Speaks a mathematical expression or explanation.

```typescript
voice.speak(expression: string, explanation?: string): Promise<void>
```

**Parameters:**
- `expression`: The mathematical expression to speak
- `explanation` (optional): Additional explanation to speak

**Example:**
```javascript
await mathrok.voice.speak('The derivative of x squared is 2x');
```

### Speak Solution

Speaks a step-by-step solution.

```typescript
voice.speakSolution(steps: { text: string; expression: string }[]): Promise<void>
```

**Parameters:**
- `steps`: Array of solution steps with text and expression

**Example:**
```javascript
const result = await mathrok.solve('x^2 - 4 = 0');
await mathrok.voice.speakSolution(result.steps);
```

### Stop

Stops all voice activity.

```typescript
voice.stop(): void
```

**Example:**
```javascript
mathrok.voice.stop();
```

### Get Voices

Gets available text-to-speech voices.

```typescript
voice.getVoices(): any[]
```

**Returns:**
- Array of available voice objects

**Example:**
```javascript
const voices = mathrok.voice.getVoices();
console.log(voices.length);
```

## Visualization API

### Plot 2D

Plots a 2D function in a container element.

```typescript
visualization.plot2D(container: HTMLElement, expression: string, variable?: string, options?: any): void
```

**Parameters:**
- `container`: HTML element to render the plot in
- `expression`: Mathematical expression to plot
- `variable` (optional): Variable to plot against (defaults to 'x')
- `options` (optional): Plotting options

**Example:**
```javascript
const container = document.getElementById('graph-container');
mathrok.visualization.plot2D(container, 'sin(x)', 'x', {
  xMin: -Math.PI,
  xMax: Math.PI,
  lineColor: '#1f77b4'
});
```

### Plot 3D

Plots a 3D function in a container element.

```typescript
visualization.plot3D(container: HTMLElement, expression: string, options?: any): void
```

**Parameters:**
- `container`: HTML element to render the plot in
- `expression`: Mathematical expression to plot
- `options` (optional): Plotting options

**Example:**
```javascript
const container = document.getElementById('graph-container');
mathrok.visualization.plot3D(container, 'sin(x)*cos(y)', {
  xMin: -Math.PI,
  xMax: Math.PI,
  yMin: -Math.PI,
  yMax: Math.PI
});
```

### Plot Multiple

Plots multiple functions in a container element.

```typescript
visualization.plotMultiple(container: HTMLElement, expressions: string[], variable?: string, options?: any): void
```

**Parameters:**
- `container`: HTML element to render the plot in
- `expressions`: Array of mathematical expressions to plot
- `variable` (optional): Variable to plot against (defaults to 'x')
- `options` (optional): Plotting options

**Example:**
```javascript
const container = document.getElementById('graph-container');
mathrok.visualization.plotMultiple(container, ['sin(x)', 'cos(x)'], 'x');
```

### Generate SVG

Generates an SVG representation of a function.

```typescript
visualization.generateSVG(expression: string, variable?: string, options?: any): string
```

**Parameters:**
- `expression`: Mathematical expression to plot
- `variable` (optional): Variable to plot against (defaults to 'x')
- `options` (optional): Plotting options

**Returns:**
- SVG string representation

**Example:**
```javascript
const svg = mathrok.visualization.generateSVG('sin(x)', 'x');
document.getElementById('svg-container').innerHTML = svg;
```

### Generate Image

Generates an image representation of a function.

```typescript
visualization.generateImage(expression: string, variable?: string, options?: any): string
```

**Parameters:**
- `expression`: Mathematical expression to plot
- `variable` (optional): Variable to plot against (defaults to 'x')
- `options` (optional): Plotting options

**Returns:**
- Data URL for the image

**Example:**
```javascript
const imageUrl = mathrok.visualization.generateImage('sin(x)', 'x');
const img = document.createElement('img');
img.src = imageUrl;
document.body.appendChild(img);
```

### Render Math

Renders a mathematical expression in the specified format.

```typescript
visualization.renderMath(expression: string, format?: 'latex' | 'mathml' | 'asciimath', displayMode?: boolean): string
```

**Parameters:**
- `expression`: Mathematical expression to render
- `format` (optional): Output format (defaults to 'latex')
- `displayMode` (optional): Whether to use display mode (defaults to false)

**Returns:**
- Rendered mathematical notation

**Example:**
```javascript
const latex = mathrok.visualization.renderMath('\\frac{d}{dx}x^2 = 2x', 'latex', true);
document.getElementById('math-container').innerHTML = latex;
```

### Render Steps

Renders a step-by-step solution.

```typescript
visualization.renderSteps(steps: { text: string; expression: string }[], format?: 'latex' | 'mathml' | 'asciimath'): string
```

**Parameters:**
- `steps`: Array of solution steps with text and expression
- `format` (optional): Output format (defaults to 'latex')

**Returns:**
- Rendered step-by-step solution

**Example:**
```javascript
const result = await mathrok.solve('x^2 - 4 = 0');
const stepsHTML = mathrok.visualization.renderSteps(result.steps);
document.getElementById('steps-container').innerHTML = stepsHTML;
```

### Visualize Solution

Generates a complete visualization of a mathematical solution.

```typescript
visualization.visualizeSolution(expression: string, steps: { text: string; expression: string }[], plotOptions?: any): string
```

**Parameters:**
- `expression`: The original mathematical expression
- `steps`: Array of solution steps with text and expression
- `plotOptions` (optional): Options for plotting

**Returns:**
- HTML string with the complete solution visualization

**Example:**
```javascript
const result = await mathrok.solve('x^2 - 4 = 0');
const solutionHTML = mathrok.visualization.visualizeSolution(
  'x^2 - 4 = 0',
  result.steps,
  { xMin: -3, xMax: 3 }
);
document.getElementById('solution-container').innerHTML = solutionHTML;
```

## Configuration API

### Get

Gets the current configuration.

```typescript
config.get(): MathConfig
```

**Returns:**
- Current configuration object

**Example:**
```javascript
const config = mathrok.config.get();
console.log(config.precision);
```

### Set

Sets configuration options.

```typescript
config.set(config: Partial<MathConfig>): void
```

**Parameters:**
- `config`: Configuration options to set

**Example:**
```javascript
mathrok.config.set({
  precision: 10,
  timeout: 5000,
  aiEnabled: true
});
```

### Reset

Resets to default configuration.

```typescript
config.reset(): void
```

**Example:**
```javascript
mathrok.config.reset();
```

### Add Function

Adds a custom function.

```typescript
config.addFunction(definition: FunctionDefinition): void
```

**Parameters:**
- `definition`: Function definition object

**Example:**
```javascript
mathrok.config.addFunction({
  name: 'double',
  params: ['x'],
  body: 'return 2 * x;'
});
```

### Remove Function

Removes a custom function.

```typescript
config.removeFunction(name: string): void
```

**Parameters:**
- `name`: Name of the function to remove

**Example:**
```javascript
mathrok.config.removeFunction('double');
```

## Performance API

### Get Metrics

Gets current performance metrics.

```typescript
performance.getMetrics(): PerformanceMetrics
```

**Returns:**
- Performance metrics object

**Example:**
```javascript
const metrics = mathrok.performance.getMetrics();
console.log(metrics.operationCount);
console.log(metrics.averageTime);
```

### Reset

Resets performance metrics.

```typescript
performance.reset(): void
```

**Example:**
```javascript
mathrok.performance.reset();
```

### Start Profiling

Starts performance profiling.

```typescript
performance.startProfiling(): void
```

**Example:**
```javascript
mathrok.performance.startProfiling();
```

### Stop Profiling

Stops performance profiling and returns metrics.

```typescript
performance.stopProfiling(): PerformanceMetrics
```

**Returns:**
- Performance metrics object

**Example:**
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
```