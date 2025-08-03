/** @type {import('jest').Config} */
export default {
    // Test environment
    preset: 'ts-jest',
    testEnvironment: 'jsdom',

    // Test file patterns
    roots: ['<rootDir>/src', '<rootDir>/tests'],
    testMatch: [
        '**/__tests__/**/*.ts',
        '**/?(*.)+(spec|test).ts'
    ],

    // TypeScript configuration
    transform: {
        '^.+\\.ts$': ['ts-jest', {
            tsconfig: {
                target: 'ES2017',
                module: 'CommonJS',
                moduleResolution: 'node',
                esModuleInterop: true,
                allowSyntheticDefaultImports: true,
                strict: true
            },
            useESM: false
        }]
    },

    // Module resolution
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@/core/(.*)$': '<rootDir>/src/core/$1',
        '^@/ai/(.*)$': '<rootDir>/src/ai/$1',
        '^@/utils/(.*)$': '<rootDir>/src/utils/$1',
        '^@/types/(.*)$': '<rootDir>/src/types/$1',
        '^(.+)\\.js$': '$1'
    },

    // Coverage configuration
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/**/*.d.ts',
        '!src/types/**/*',
        '!src/**/__tests__/**/*',
        '!src/**/*.test.ts',
        '!src/**/*.spec.ts'
    ],

    coverageDirectory: 'coverage',
    coverageReporters: [
        'text',
        'text-summary',
        'lcov',
        'html',
        'json'
    ],

    // Coverage thresholds
    coverageThreshold: {
        global: {
            branches: 90,
            functions: 90,
            lines: 90,
            statements: 90
        }
    },

    // Setup files
    setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],

    // Test timeout
    testTimeout: 10000,

    // Performance settings
    maxWorkers: '50%',

    // Error handling
    errorOnDeprecated: true,

    // Verbose output for CI
    verbose: process.env.CI === 'true',

    // Watch mode settings
    watchPathIgnorePatterns: [
        '<rootDir>/node_modules/',
        '<rootDir>/dist/',
        '<rootDir>/coverage/'
    ],

    // Mock configuration
    clearMocks: true,
    restoreMocks: true
};