/**
 * Core type definitions for the Mathrok library
 * Defines fundamental mathematical structures and interfaces
 */

/**
 * Represents a mathematical expression in various formats
 */
export interface MathExpression {
    /** Raw input expression as string */
    readonly raw: string;
    /** Normalized expression */
    readonly normalized: string;
    /** Abstract Syntax Tree representation */
    readonly ast?: ExpressionNode;
    /** Variables present in the expression */
    readonly variables: readonly string[];
    /** Functions used in the expression */
    readonly functions: readonly string[];
    /** Expression complexity score (0-100) */
    readonly complexity: number;
}

/**
 * Abstract Syntax Tree node for mathematical expressions
 */
export interface ExpressionNode {
    /** Node type identifier */
    readonly type: NodeType;
    /** Node value (for leaf nodes) */
    readonly value?: string | number;
    /** Child nodes */
    readonly children?: readonly ExpressionNode[];
    /** Node metadata */
    readonly metadata?: NodeMetadata;
}

/**
 * Types of AST nodes
 */
export enum NodeType {
    NUMBER = 'number',
    VARIABLE = 'variable',
    FUNCTION = 'function',
    OPERATOR = 'operator',
    PARENTHESES = 'parentheses',
    EQUATION = 'equation',
    INEQUALITY = 'inequality',
}

/**
 * Metadata for AST nodes
 */
export interface NodeMetadata {
    /** Position in original expression */
    readonly position?: { start: number; end: number };
    /** Operator precedence */
    readonly precedence?: number;
    /** Associativity for operators */
    readonly associativity?: 'left' | 'right';
}

/**
 * Result of mathematical computation or solving
 */
export interface MathResult<T = unknown> {
    /** The computed result */
    readonly result: T;
    /** Step-by-step solution */
    readonly steps: readonly SolutionStep[];
    /** Execution metadata */
    readonly metadata: ResultMetadata;
    /** Alternative solutions or methods */
    readonly alternatives?: readonly AlternativeSolution<T>[];
}

/**
 * Individual step in a mathematical solution
 */
export interface SolutionStep {
    /** Step identifier */
    readonly id: string;
    /** Step description */
    readonly description: string;
    /** Mathematical operation performed */
    readonly operation: MathOperation;
    /** Expression before this step */
    readonly before: string;
    /** Expression after this step */
    readonly after: string;
    /** Explanation of the step */
    readonly explanation?: string;
    /** Rule or theorem applied */
    readonly rule?: string;
}

/**
 * Alternative solution method
 */
export interface AlternativeSolution<T = unknown> {
    /** Method name */
    readonly method: string;
    /** Result using this method */
    readonly result: T;
    /** Steps for this method */
    readonly steps: readonly SolutionStep[];
    /** Difficulty level (1-5) */
    readonly difficulty: number;
}

/**
 * Metadata for computation results
 */
export interface ResultMetadata {
    /** Computation time in milliseconds */
    readonly computationTime: number;
    /** Memory usage in bytes */
    readonly memoryUsage?: number;
    /** Method used for computation */
    readonly method: string;
    /** Confidence level (0-1) */
    readonly confidence: number;
    /** Whether result is exact or approximate */
    readonly isExact: boolean;
    /** Precision of the result */
    readonly precision?: number;
}

/**
 * Mathematical operations enumeration
 */
export enum MathOperation {
    // Arithmetic
    ADDITION = 'addition',
    SUBTRACTION = 'subtraction',
    MULTIPLICATION = 'multiplication',
    DIVISION = 'division',
    EXPONENTIATION = 'exponentiation',
    ROOT = 'root',

    // Algebraic
    SIMPLIFICATION = 'simplification',
    EXPANSION = 'expansion',
    FACTORING = 'factoring',
    SUBSTITUTION = 'substitution',

    // Equation solving
    ISOLATION = 'isolation',
    ELIMINATION = 'elimination',
    QUADRATIC_FORMULA = 'quadratic_formula',

    // Calculus
    DIFFERENTIATION = 'differentiation',
    INTEGRATION = 'integration',
    LIMIT = 'limit',

    // Trigonometry
    TRIG_SIMPLIFICATION = 'trig_simplification',
    TRIG_IDENTITY = 'trig_identity',

    // Matrix
    MATRIX_MULTIPLICATION = 'matrix_multiplication',
    MATRIX_INVERSION = 'matrix_inversion',
    DETERMINANT = 'determinant',

    // Other
    EVALUATION = 'evaluation',
    CONVERSION = 'conversion',
}

/**
 * Error types for mathematical operations
 */
export enum MathErrorType {
    PARSE_ERROR = 'parse_error',
    SYNTAX_ERROR = 'syntax_error',
    DOMAIN_ERROR = 'domain_error',
    DIVISION_BY_ZERO = 'division_by_zero',
    UNDEFINED_VARIABLE = 'undefined_variable',
    UNDEFINED_FUNCTION = 'undefined_function',
    COMPUTATION_ERROR = 'computation_error',
    TIMEOUT_ERROR = 'timeout_error',
    MEMORY_ERROR = 'memory_error',
    UNSUPPORTED_OPERATION = 'unsupported_operation',
}

/**
 * Mathematical error with detailed information
 */
export class MathError extends Error {
    public readonly type: MathErrorType;
    public readonly expression?: string;
    public readonly position?: { start: number; end: number };
    public readonly suggestions?: readonly string[];

    constructor(
        type: MathErrorType,
        message: string,
        expression?: string,
        position?: { start: number; end: number },
        suggestions?: readonly string[]
    ) {
        super(message);
        this.name = 'MathError';
        this.type = type;
        this.expression = expression;
        this.position = position;
        this.suggestions = suggestions;
    }
}

/**
 * Configuration options for mathematical operations
 */
export interface MathConfig {
    /** Precision for numerical computations */
    readonly precision?: number;
    /** Timeout for computations in milliseconds */
    readonly timeout?: number;
    /** Whether to use exact arithmetic when possible */
    readonly exact?: boolean;
    /** Whether to simplify results automatically */
    readonly autoSimplify?: boolean;
    /** Whether to show step-by-step solutions */
    readonly showSteps?: boolean;
    /** Maximum number of steps to show */
    readonly maxSteps?: number;
    /** Whether to cache results */
    readonly useCache?: boolean;
}

/**
 * Variable assignment for expression evaluation
 */
export interface VariableAssignment {
    readonly [variable: string]: number | string | MathExpression;
}

/**
 * Function definition for custom functions
 */
export interface FunctionDefinition {
    readonly name: string;
    readonly parameters: readonly string[];
    readonly body: string | ((args: readonly number[]) => number);
    readonly description?: string;
}

/**
 * Mathematical constant definition
 */
export interface MathConstant {
    readonly name: string;
    readonly value: number;
    readonly description?: string;
    readonly symbol?: string;
}

/**
 * Unit definition for unit conversion
 */
export interface Unit {
    readonly name: string;
    readonly symbol: string;
    readonly category: string;
    readonly baseUnit?: string;
    readonly conversionFactor?: number;
    readonly conversionFunction?: (value: number) => number;
}

/**
 * Performance metrics for operations
 */
export interface PerformanceMetrics {
    readonly parseTime: number;
    readonly solveTime: number;
    readonly explainTime: number;
    readonly totalTime: number;
    readonly memoryUsage: number;
    readonly cacheHits: number;
    readonly cacheMisses: number;
}

/**
 * Cache entry for storing computation results
 */
export interface CacheEntry<T = unknown> {
    readonly key: string;
    readonly result: T;
    readonly timestamp: number;
    readonly accessCount: number;
    readonly computationTime: number;
}

/**
 * Validation result for mathematical expressions
 */
export interface ValidationResult {
    readonly isValid: boolean;
    readonly errors: readonly MathError[];
    readonly warnings: readonly string[];
    readonly suggestions: readonly string[];
}