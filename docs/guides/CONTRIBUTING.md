# Contributing to Mathrok

Thank you for your interest in contributing to Mathrok! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)
- [Documentation Guidelines](#documentation-guidelines)
- [Release Process](#release-process)

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please read it before contributing.

- Be respectful and inclusive
- Be patient and welcoming
- Be thoughtful
- Be collaborative
- When disagreeing, try to understand why

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- Git

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/Odeneho-Calculus/Mathrok.git
   cd Mathrok
   ```
3. Add the original repository as a remote:
   ```bash
   git remote add upstream https://github.com/Odeneho-Calculus/Mathrok.git
   ```

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Run tests:
   ```bash
   npm test
   ```

4. Start development mode with auto-rebuilding:
   ```bash
   npm run dev
   ```

## Project Structure

The Mathrok project is organized as follows:

```
mathrok/
├── src/                  # Source code
│   ├── ai/               # AI-related modules
│   │   ├── explainer/    # Explanation generation
│   │   ├── models/       # AI model integration
│   │   ├── nlp/          # Natural language processing
│   │   └── voice/        # Voice input/output
│   ├── core/             # Core mathematical engine
│   │   ├── engine/       # Mathematical operations
│   │   ├── parser/       # Expression parsing
│   │   └── solver/       # Equation solving
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   │   ├── caching/      # Caching system
│   │   └── performance/  # Performance monitoring
│   ├── visualization/    # Visualization components
│   └── index.ts          # Main entry point
├── tests/                # Test files
├── dist/                 # Compiled output (generated)
├── docs/                 # Documentation
├── examples/             # Usage examples
└── scripts/              # Build and utility scripts
```

## Coding Standards

Mathrok follows strict coding standards to maintain code quality and consistency:

### TypeScript

- Use TypeScript for all new code
- Enable strict mode
- Provide comprehensive type definitions
- Use interfaces for public APIs

### Formatting

- Use Prettier for code formatting
- Use ESLint for code linting
- Follow the existing code style

### Naming Conventions

- Use camelCase for variables and functions
- Use PascalCase for classes and interfaces
- Use UPPER_CASE for constants
- Use descriptive names that reflect purpose

### Comments and Documentation

- Use JSDoc comments for all public APIs
- Document parameters, return types, and exceptions
- Provide examples for complex functionality
- Keep comments up-to-date with code changes

## Pull Request Process

1. **Create a branch**: Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes**: Implement your changes, following the coding standards.

3. **Write tests**: Add tests for your changes to ensure they work correctly.

4. **Update documentation**: Update relevant documentation to reflect your changes.

5. **Run tests**: Ensure all tests pass:
   ```bash
   npm test
   ```

6. **Lint and format**: Ensure code passes linting and formatting checks:
   ```bash
   npm run lint
   npm run format
   ```

7. **Commit changes**: Use clear and descriptive commit messages:
   ```bash
   git commit -m "feat: add new feature X"
   ```
   Follow [Conventional Commits](https://www.conventionalcommits.org/) format.

8. **Push changes**: Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

9. **Create Pull Request**: Open a pull request against the main repository.

10. **Code Review**: Address any feedback from code reviews.

11. **Merge**: Once approved, your PR will be merged.

## Testing Guidelines

Mathrok uses Jest for testing. All new features should include tests.

### Test Structure

- Place tests in the `tests/` directory
- Mirror the source directory structure
- Name test files with `.test.ts` or `.spec.ts` suffix

### Test Coverage

- Aim for 90%+ test coverage for new code
- Test both success and error cases
- Test edge cases and boundary conditions

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## Documentation Guidelines

Good documentation is essential for Mathrok. Please follow these guidelines:

### API Documentation

- Use JSDoc comments for all public APIs
- Document all parameters, return types, and exceptions
- Provide examples for complex functionality

### User Documentation

- Update relevant user documentation in the `docs/` directory
- Use clear, concise language
- Include examples where appropriate
- Keep documentation up-to-date with code changes

### README and Examples

- Update the README.md if your changes affect the public API
- Add examples for new features in the `examples/` directory

## Release Process

Mathrok follows semantic versioning (SEMVER):

- **MAJOR** version for incompatible API changes
- **MINOR** version for backwards-compatible functionality
- **PATCH** version for backwards-compatible bug fixes

### Release Steps

1. Update version in `package.json` and `src/types/index.ts`
2. Update CHANGELOG.md with changes
3. Create a new git tag with the version number
4. Push the tag to GitHub
5. Create a GitHub release with release notes
6. Publish to npm

## Getting Help

If you need help with contributing to Mathrok, you can:

- Open an issue on GitHub
- Contact the maintainers
- Join the community discussion

Thank you for contributing to Mathrok!