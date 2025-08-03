---
description: Repository Information Overview
alwaysApply: true
---

# Mathrok Information

## Summary
Mathrok is an AI-powered symbolic mathematics library combining traditional Computer Algebra System (CAS) capabilities with natural language processing for math problem solving. It provides comprehensive mathematical operations including algebra, calculus, trigonometry, and matrix operations with step-by-step explanations.

## Structure
- **src/**: Source code organized into core mathematical components and AI features
  - **core/**: Mathematical engine, parser, and solver components
  - **ai/**: AI integration with NLP, explanation generation, and voice features
    - **nlp/**: Natural language processing
    - **explainer/**: Step-by-step explanation generation
    - **voice/**: Speech-to-text and text-to-speech capabilities
  - **types/**: TypeScript type definitions
  - **utils/**: Utility functions for caching, performance, etc.
  - **visualization/**: Graph generation and mathematical notation rendering
- **tests/**: Comprehensive test suites with unit, integration, and performance tests
- **examples/**: Usage examples for basic and advanced features
- **demo/**: Demonstration applications
- **docs/**: Documentation including API references and guides

## Language & Runtime
**Language**: TypeScript
**Version**: ES2017 target with Node.js >=14.0.0
**Build System**: Rollup
**Package Manager**: npm/pnpm

## Dependencies
**Main Dependencies**:
- nerdamer (^1.1.13): Symbolic math library
- mathjs (^11.11.3): Mathematics library
- @xenova/transformers (^2.17.2): AI models for natural language processing

**Development Dependencies**:
- TypeScript (^5.2.2)
- Jest (^29.7.0) for testing
- Rollup (^4.5.0) for bundling
- ESLint and Prettier for code quality

## Build & Installation
```bash
# Install dependencies
npm install

# Build the library
npm run build

# Run tests
npm test

# Generate documentation
npm run docs:generate
```

## Testing
**Framework**: Jest with ts-jest
**Test Location**: /tests directory with specialized subdirectories
**Naming Convention**: *.test.ts and *.spec.ts
**Configuration**: jest.config.js with TypeScript support
**Run Command**:
```bash
npm test
npm run test:watch
npm run test:coverage
```

## Features
**Core Mathematical Capabilities**:
- Symbolic algebra with equation solving
- Calculus operations (derivatives, integrals, limits)
- Matrix operations and linear algebra
- Trigonometric functions and identities

**AI Integration**:
- Natural language processing for math problems
- Step-by-step explanations with educational content
- Intelligent method selection based on expression analysis
- Voice input and audio explanations
- Speech-to-text for mathematical expressions

**Visualization**:
- 2D and 3D function plotting
- Multiple function comparison
- Mathematical notation rendering (LaTeX, MathML, AsciiMath)
- Step-by-step visual solutions

**Performance Optimization**:
- Intelligent caching system
- Performance profiling and monitoring
- Optimized bundle size (<500KB)