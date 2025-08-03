# Mathrok Browser Usage Guide

This guide explains how to use the Mathrok library in browser environments after the recent fixes to resolve CommonJS `require` issues.

## Quick Start

### 1. Include the Library

```html
<script src="path/to/mathrok.umd.js"></script>
```

### 2. Initialize Mathrok

There are two ways to use Mathrok in the browser:

#### Method 1: Using the Constructor (Recommended)
```javascript
const mathrok = new window.Mathrok.Mathrok();
```

#### Method 2: Using the Pre-instantiated Instance
```javascript
const mathrok = window.Mathrok.default;
```

## Library Structure

When the UMD build loads, it creates a `window.Mathrok` object with the following structure:

```javascript
window.Mathrok = {
    Mathrok: [Function], // Constructor function
    default: [Object],   // Pre-instantiated instance
    VERSION: "1.1.1",
    // ... other exports (evaluate, factor, derivative, etc.)
}
```

## Usage Examples

### Basic Mathematical Operations

```javascript
// Create instance
const mathrok = new window.Mathrok.Mathrok();

// Basic evaluation
const result1 = await mathrok.evaluate('2 + 3 * 4');
console.log(result1.result); // 14

// Algebraic operations
const factored = await mathrok.factor('x^2 - 4');
console.log(factored.result); // "(x-2)*(x+2)"

// Calculus
const derivative = await mathrok.derivative('x^3 + 2*x^2 + x', 'x');
console.log(derivative.result); // "3*x^2 + 4*x + 1"
```

### Natural Language Processing

```javascript
const mathrok = new window.Mathrok.Mathrok();

// Natural language queries
const nlResult = await mathrok.nl('What is the derivative of x squared?');
console.log(nlResult);
```

### Voice Integration

```javascript
const mathrok = new window.Mathrok.Mathrok();

// Check if voice features are available
if (mathrok.voice && mathrok.voice.isSupported()) {
    // Use voice features
    const voices = mathrok.voice.getAvailableVoices();
    console.log('Available voices:', voices);
}
```

## Error Handling

Always wrap Mathrok operations in try-catch blocks:

```javascript
try {
    const mathrok = new window.Mathrok.Mathrok();
    const result = await mathrok.evaluate('invalid expression');
} catch (error) {
    console.error('Mathrok error:', error.message);
}
```

## Robust Initialization Pattern

For maximum compatibility, use this initialization pattern:

```javascript
let mathrok;
try {
    if (window.Mathrok && window.Mathrok.Mathrok && typeof window.Mathrok.Mathrok === 'function') {
        mathrok = new window.Mathrok.Mathrok();
        console.log('Using constructor method');
    } else if (window.Mathrok && window.Mathrok.default) {
        mathrok = window.Mathrok.default;
        console.log('Using pre-instantiated instance');
    } else {
        throw new Error('Mathrok library not found or not properly loaded');
    }
} catch (error) {
    console.error('Failed to initialize Mathrok:', error);
}
```

## Configuration

You can configure Mathrok with custom settings:

```javascript
const mathrok = new window.Mathrok.Mathrok();

// Configure the instance
mathrok.configure({
    precision: 10,
    angleUnit: 'radians',
    // ... other configuration options
});
```

## Available Methods

The Mathrok instance provides these main methods:

- `evaluate(expression)` - Evaluate mathematical expressions
- `factor(expression)` - Factor algebraic expressions
- `expand(expression)` - Expand algebraic expressions
- `simplify(expression)` - Simplify expressions
- `derivative(expression, variable)` - Calculate derivatives
- `integral(expression, variable)` - Calculate integrals
- `solve(equation, variable)` - Solve equations
- `nl(query)` - Natural language processing
- `voice.*` - Voice-related features

## Testing

Use the provided test files to verify functionality:

- `test-mathrok.html` - Basic library loading test
- `mathrok-usage-test.html` - Comprehensive usage examples
- `voice-input.html` - Voice input demonstration

## Troubleshooting

### Common Issues

1. **"require is not defined" error**: This has been fixed in the latest build. Make sure you're using the updated UMD bundle.

2. **"Cannot find Mathrok constructor"**: Check that the script is loaded properly and `window.Mathrok` exists.

3. **Async/await issues**: Remember that most Mathrok methods are asynchronous and return Promises.

### Browser Compatibility

The library works in modern browsers that support:
- ES6 features (arrow functions, async/await, etc.)
- Web Speech API (for voice features)
- Modern JavaScript APIs

## Recent Fixes

The following issues have been resolved:

1. ✅ Fixed CommonJS `require` statements causing browser errors
2. ✅ Converted all `require()` calls to ES6 `import` statements
3. ✅ Updated algebra.ts, calculus.ts, trigonometry.ts, and index.ts files
4. ✅ Verified UMD build works correctly in browser environments
5. ✅ Created comprehensive test examples

## Support

For issues or questions:
1. Check the test files for working examples
2. Review the console for detailed error messages
3. Ensure you're using the latest build of the library