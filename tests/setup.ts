/**
 * Jest test setup file
 * Configures global test environment and utilities
 */

import 'jest-environment-jsdom';

// Global test configuration
beforeAll(() => {
    // Set up global test environment
    global.console = {
        ...console,
        // Suppress console.log in tests unless explicitly needed
        log: jest.fn(),
        debug: jest.fn(),
        info: jest.fn(),
        warn: console.warn,
        error: console.error,
    };

    // Mock performance API for Node.js environment
    if (typeof performance === 'undefined') {
        global.performance = {
            now: jest.fn(() => Date.now()),
            mark: jest.fn(),
            measure: jest.fn(),
            getEntriesByName: jest.fn(() => []),
            getEntriesByType: jest.fn(() => []),
            clearMarks: jest.fn(),
            clearMeasures: jest.fn(),
        } as any;
    }

    // Mock Web APIs that might not be available in test environment
    if (typeof window !== 'undefined') {
        // Mock localStorage
        const localStorageMock = {
            getItem: jest.fn(),
            setItem: jest.fn(),
            removeItem: jest.fn(),
            clear: jest.fn(),
            length: 0,
            key: jest.fn(),
        };
        Object.defineProperty(window, 'localStorage', {
            value: localStorageMock,
        });

        // Mock sessionStorage
        Object.defineProperty(window, 'sessionStorage', {
            value: localStorageMock,
        });

        // Mock IndexedDB
        Object.defineProperty(window, 'indexedDB', {
            value: {
                open: jest.fn(),
                deleteDatabase: jest.fn(),
            },
        });
    }
});

beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Reset any global state
    if (typeof window !== 'undefined') {
        window.localStorage.clear();
        window.sessionStorage.clear();
    }
});

afterEach(() => {
    // Clean up after each test
    jest.restoreAllMocks();
});

afterAll(() => {
    // Global cleanup
    jest.clearAllTimers();
});

// Custom matchers for mathematical testing
expect.extend({
    toBeCloseToNumber(received: number, expected: number, precision = 2) {
        const pass = Math.abs(received - expected) < Math.pow(10, -precision);
        if (pass) {
            return {
                message: () =>
                    `expected ${received} not to be close to ${expected} with precision ${precision}`,
                pass: true,
            };
        } else {
            return {
                message: () =>
                    `expected ${received} to be close to ${expected} with precision ${precision}`,
                pass: false,
            };
        }
    },

    toBeValidMathExpression(received: string) {
        // Basic validation for mathematical expressions
        const validPattern = /^[a-zA-Z0-9+\-*/^().\s=<>!]+$/;
        const pass = typeof received === 'string' && validPattern.test(received);

        if (pass) {
            return {
                message: () => `expected ${received} not to be a valid math expression`,
                pass: true,
            };
        } else {
            return {
                message: () => `expected ${received} to be a valid math expression`,
                pass: false,
            };
        }
    },

    toHaveSteps(received: any, expectedCount: number) {
        const hasSteps = received && Array.isArray(received.steps);
        const correctCount = hasSteps && received.steps.length === expectedCount;

        if (correctCount) {
            return {
                message: () =>
                    `expected result not to have ${expectedCount} steps`,
                pass: true,
            };
        } else {
            const actualCount = hasSteps ? received.steps.length : 0;
            return {
                message: () =>
                    `expected result to have ${expectedCount} steps, but got ${actualCount}`,
                pass: false,
            };
        }
    },

    toBeWithinPerformanceThreshold(received: number, threshold: number) {
        const pass = received <= threshold;

        if (pass) {
            return {
                message: () =>
                    `expected ${received}ms not to be within performance threshold of ${threshold}ms`,
                pass: true,
            };
        } else {
            return {
                message: () =>
                    `expected ${received}ms to be within performance threshold of ${threshold}ms`,
                pass: false,
            };
        }
    },
});

// Declare custom matchers for TypeScript
declare global {
    namespace jest {
        interface Matchers<R> {
            toBeCloseToNumber(expected: number, precision?: number): R;
            toBeValidMathExpression(): R;
            toHaveSteps(expectedCount: number): R;
            toBeWithinPerformanceThreshold(threshold: number): R;
        }
    }
}

// Test utilities
export const createMockMathExpression = (raw: string, normalized?: string) => ({
    raw,
    normalized: normalized || raw,
    variables: [],
    functions: [],
    complexity: 1,
});

export const createMockSolutionStep = (id: string, description: string) => ({
    id,
    description,
    operation: 'simplification' as const,
    before: 'x + 1',
    after: 'x + 1',
    explanation: description,
});

export const createMockMathResult = <T>(result: T) => ({
    result,
    steps: [],
    metadata: {
        computationTime: 10,
        method: 'test',
        confidence: 1,
        isExact: true,
    },
});

// Performance testing utilities
export const measurePerformance = async <T>(
    fn: () => Promise<T> | T,
    label?: string
): Promise<{ result: T; time: number }> => {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    const time = end - start;

    if (label) {
        console.log(`${label}: ${time.toFixed(2)}ms`);
    }

    return { result, time };
};

// Memory testing utilities
export const measureMemory = <T>(fn: () => T): { result: T; memoryUsed: number } => {
    const initialMemory = process.memoryUsage().heapUsed;
    const result = fn();
    const finalMemory = process.memoryUsage().heapUsed;
    const memoryUsed = finalMemory - initialMemory;

    return { result, memoryUsed };
};

// Async testing utilities
export const waitFor = (ms: number): Promise<void> =>
    new Promise(resolve => setTimeout(resolve, ms));

export const waitForCondition = async (
    condition: () => boolean,
    timeout = 5000,
    interval = 100
): Promise<void> => {
    const start = Date.now();

    while (!condition() && Date.now() - start < timeout) {
        await waitFor(interval);
    }

    if (!condition()) {
        throw new Error(`Condition not met within ${timeout}ms`);
    }
};

// Mock data generators
export const generateRandomExpression = (complexity = 1): string => {
    const variables = ['x', 'y', 'z'];
    const operators = ['+', '-', '*', '/'];
    const numbers = [1, 2, 3, 4, 5];

    if (complexity === 1) {
        const variable = variables[Math.floor(Math.random() * variables.length)];
        const operator = operators[Math.floor(Math.random() * operators.length)];
        const number = numbers[Math.floor(Math.random() * numbers.length)];
        return `${variable} ${operator} ${number}`;
    }

    // More complex expressions for higher complexity levels
    return 'x^2 + 3*x - 10';
};

export const generateTestCases = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
        id: `test-${i}`,
        expression: generateRandomExpression(Math.floor(i / 10) + 1),
        expected: `result-${i}`,
    }));
};

// Error testing utilities
export const expectToThrowMathError = async (
    fn: () => Promise<any> | any,
    errorType?: string
): Promise<void> => {
    try {
        await fn();
        throw new Error('Expected function to throw an error');
    } catch (error) {
        expect(error).toBeInstanceOf(Error);
        if (errorType) {
            expect((error as any).type).toBe(errorType);
        }
    }
};

// Snapshot testing utilities
export const normalizeSnapshot = (obj: any): any => {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    const normalized: any = {};
    for (const [key, value] of Object.entries(obj)) {
        if (key === 'computationTime' || key === 'timestamp') {
            normalized[key] = '[DYNAMIC]';
        } else if (Array.isArray(value)) {
            normalized[key] = value.map(normalizeSnapshot);
        } else if (typeof value === 'object') {
            normalized[key] = normalizeSnapshot(value);
        } else {
            normalized[key] = value;
        }
    }

    return normalized;
};