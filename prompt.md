# Professional AI Development Prompt for Mathrok Library

## Project Overview
Create a complete JavaScript/TypeScript library called "Mathrok" - an AI-powered symbolic mathematics library that combines traditional Computer Algebra System (CAS) capabilities with natural language processing for math problem solving.

## Core Requirements

### 1. Library Architecture
- **Name**: Mathrok
- **Target**: NPM package compatible with both Node.js and browser environments
- **Language**: TypeScript with JavaScript output
- **Bundle**: ESM and CommonJS builds
- **Dependencies**: Use only free, open-source libraries (no paid APIs)

### 2. Core Functionality Stack
```javascript
// Primary API Interface
import { solve, explain, parse, nl, derivative, integral, factor } from 'mathrok';

// Examples of expected functionality
solve("x^2 + 3x - 10 = 0");           // → { solutions: ["x = 2", "x = -5"], steps: [...] }
explain("integrate sin(x) dx");        // → { result: "-cos(x) + C", steps: [...] }
nl("Find the derivative of x cubed");  // → { expression: "d/dx x^3", result: "3x^2" }
parse("solve for x: x squared plus 3x equals 10"); // → "x^2 + 3x = 10"
```

### 3. Required Dependencies (Free Only)
- **Symbolic Math Engine**: `algebrite` or `nerdamer`
- **Step-by-step Algebra**: `mathsteps`
- **AI/NLP Processing**: `@xenova/transformers` (Hugging Face transformers.js)
- **Math Parsing**: `mathjs` (for expression parsing)
- **Build Tools**: `rollup`, `typescript`, `jest` (for testing)

### 4. AI Integration (Free Models Only)
- Use `@xenova/transformers` with small, free models like:
  - `Xenova/phi-2` for general math understanding
  - `microsoft/DialoGPT-small` for conversational math help
  - Any math-specific models available on Hugging Face (free tier)
- Focus AI on natural language → math expression conversion
- Use traditional CAS for actual mathematical computation

### 5. Project Structure
```
mathrok/
├── src/
│   ├── core/
│   │   ├── parser.ts      # Math expression parsing
│   │   ├── solver.ts      # Equation solving logic
│   │   ├── explainer.ts   # Step-by-step explanations
│   │   └── cas.ts         # Computer algebra system wrapper
│   ├── ai/
│   │   ├── nlp.ts         # Natural language processing
│   │   ├── models.ts      # AI model management
│   │   └── converter.ts   # Text to math conversion
│   ├── utils/
│   │   ├── formatter.ts   # Output formatting
│   │   └── validator.ts   # Input validation
│   ├── types/
│   │   └── index.ts       # TypeScript definitions
│   └── index.ts           # Main entry point
├── dist/                  # Built files
├── tests/                 # Jest tests
├── docs/                  # Documentation
├── examples/              # Usage examples
├── package.json
├── tsconfig.json
├── rollup.config.js
└── README.md
```

### 6. Key Features to Implement
1. **Symbolic Math Operations**:
   - Algebraic equation solving
   - Calculus (derivatives, integrals)
   - Polynomial factoring and expansion
   - Trigonometric simplification
   - Matrix operations

2. **AI-Enhanced Features**:
   - Natural language input processing
   - Step-by-step solution explanations
   - Alternative solution methods
   - Math problem type detection

3. **Developer Experience**:
   - Full TypeScript support
   - Comprehensive JSDoc documentation
   - Unit tests with >90% coverage
   - Multiple output formats (ESM, CommonJS, UMD)
   - Tree-shaking support

### 7. Performance & Compatibility
- Bundle size: <500KB minified
- Browser compatibility: ES2017+
- Node.js compatibility: 14+
- No external API dependencies (fully offline capable)
- Lazy loading for AI models

### 8. Deliverables
1. Complete source code with TypeScript
2. Built distribution files (multiple formats)
3. Comprehensive test suite
4. Documentation with API reference
5. Usage examples and demos
6. NPM package configuration
7. GitHub repository setup with CI/CD

## Development Instructions
1. Set up the project structure with proper TypeScript configuration
2. Implement core CAS functionality using free libraries
3. Integrate AI models for natural language processing
4. Create comprehensive API with consistent interface
5. Add extensive testing and documentation
6. Optimize bundle size and performance
7. Prepare for NPM publishing

## Success Criteria
- Library can solve common algebra, calculus, and equation problems
- Natural language input works for basic math queries
- Provides step-by-step explanations for solutions
- Easy to integrate into existing JavaScript/TypeScript projects
- Well-documented with clear examples
- Fully functional without any paid dependencies or API keys

Please implement this as a complete, production-ready library that developers can immediately install via `npm install mathrok` and start using in their projects.