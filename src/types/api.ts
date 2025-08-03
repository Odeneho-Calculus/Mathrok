/**
 * Public API type definitions for the Mathrok library
 * Defines the interfaces exposed to library users
 */

import type {
    MathExpression,
    MathResult,
    MathConfig,
    VariableAssignment,
    FunctionDefinition,
    PerformanceMetrics,
    ValidationResult,
} from './core.js';

/**
 * Main Mathrok library interface
 */
export interface MathrokAPI {
    /** Solve mathematical equations and expressions */
    solve: SolveFunction;
    /** Parse natural language mathematical queries */
    nl: NaturalLanguageFunction;
    /** Parse mathematical expressions */
    parse: ParseFunction;
    /** Explain mathematical solutions step-by-step */
    explain: ExplainFunction;
    /** Calculate derivatives */
    derivative: DerivativeFunction;
    /** Calculate integrals */
    integral: IntegralFunction;
    /** Factor expressions */
    factor: FactorFunction;
    /** Expand expressions */
    expand: ExpandFunction;
    /** Simplify expressions */
    simplify: SimplifyFunction;
    /** Evaluate expressions */
    evaluate: EvaluateFunction;
    /** Matrix operations */
    matrix: MatrixOperations;
    /** Configuration management */
    config: ConfigurationManager;
    /** Performance monitoring */
    performance: PerformanceMonitor;
    /** Voice input and output capabilities */
    voice: VoiceAPI;
    /** Visualization capabilities */
    visualization: VisualizationAPI;
}

/**
 * Solve function signature
 */
export interface SolveFunction {
    (expression: string, config?: Partial<MathConfig>): Promise<SolveResult>;
    (expression: string, variables?: VariableAssignment, config?: Partial<MathConfig>): Promise<SolveResult>;
}

/**
 * Result of equation solving
 */
export interface SolveResult extends MathResult<readonly Solution[]> {
    /** Type of equation solved */
    readonly equationType: EquationType;
    /** Variables solved for */
    readonly variables: readonly string[];
    /** Domain restrictions */
    readonly domain?: DomainRestriction[];
}

/**
 * Individual solution to an equation
 */
export interface Solution {
    /** Variable name */
    readonly variable: string;
    /** Solution value */
    readonly value: string | number;
    /** Whether solution is exact */
    readonly isExact: boolean;
    /** Numerical approximation if applicable */
    readonly approximation?: number;
    /** Conditions for validity */
    readonly conditions?: readonly string[];
}

/**
 * Types of equations
 */
export enum EquationType {
    LINEAR = 'linear',
    QUADRATIC = 'quadratic',
    POLYNOMIAL = 'polynomial',
    RATIONAL = 'rational',
    RADICAL = 'radical',
    EXPONENTIAL = 'exponential',
    LOGARITHMIC = 'logarithmic',
    TRIGONOMETRIC = 'trigonometric',
    SYSTEM = 'system',
    DIFFERENTIAL = 'differential',
}

/**
 * Domain restriction for solutions
 */
export interface DomainRestriction {
    readonly variable: string;
    readonly restriction: string;
    readonly description: string;
}

/**
 * Natural language processing function
 */
export interface NaturalLanguageFunction {
    (query: string, config?: Partial<NLConfig>): Promise<NLResult>;
}

/**
 * Configuration for natural language processing
 */
export interface NLConfig extends MathConfig {
    /** Language code (e.g., 'en', 'es') */
    readonly language?: string;
    /** Whether to use AI models */
    readonly useAI?: boolean;
    /** Confidence threshold for AI responses */
    readonly confidenceThreshold?: number;
    /** Context from previous queries */
    readonly context?: readonly string[];
}

/**
 * Result of natural language processing
 */
export interface NLResult extends MathResult<string> {
    /** Detected intent */
    readonly intent: MathIntent;
    /** Extracted mathematical expression */
    readonly expression: string;
    /** Confidence in interpretation */
    readonly confidence: number;
    /** Alternative interpretations */
    readonly alternatives?: readonly AlternativeInterpretation[];
}

/**
 * Mathematical intent detected from natural language
 */
export enum MathIntent {
    SOLVE_EQUATION = 'solve_equation',
    CALCULATE_DERIVATIVE = 'calculate_derivative',
    CALCULATE_INTEGRAL = 'calculate_integral',
    SIMPLIFY_EXPRESSION = 'simplify_expression',
    FACTOR_EXPRESSION = 'factor_expression',
    EXPAND_EXPRESSION = 'expand_expression',
    EVALUATE_EXPRESSION = 'evaluate_expression',
    PLOT_FUNCTION = 'plot_function',
    FIND_LIMIT = 'find_limit',
    SOLVE_SYSTEM = 'solve_system',
    MATRIX_OPERATION = 'matrix_operation',
    CONVERT_UNITS = 'convert_units',
    UNKNOWN = 'unknown',
}

/**
 * Alternative interpretation of natural language query
 */
export interface AlternativeInterpretation {
    readonly expression: string;
    readonly intent: MathIntent;
    readonly confidence: number;
    readonly description: string;
}

/**
 * Parse function signature
 */
export interface ParseFunction {
    (expression: string, config?: Partial<MathConfig>): Promise<ParseResult>;
}

/**
 * Result of expression parsing
 */
export interface ParseResult extends MathResult<MathExpression> {
    /** Validation result */
    readonly validation: ValidationResult;
    /** Detected mathematical structures */
    readonly structures: readonly MathStructure[];
}

/**
 * Mathematical structure detected in expression
 */
export interface MathStructure {
    readonly type: StructureType;
    readonly description: string;
    readonly position: { start: number; end: number };
    readonly properties: Record<string, unknown>;
}

/**
 * Types of mathematical structures
 */
export enum StructureType {
    POLYNOMIAL = 'polynomial',
    RATIONAL_FUNCTION = 'rational_function',
    TRIGONOMETRIC = 'trigonometric',
    EXPONENTIAL = 'exponential',
    LOGARITHMIC = 'logarithmic',
    MATRIX = 'matrix',
    VECTOR = 'vector',
    EQUATION = 'equation',
    INEQUALITY = 'inequality',
    SYSTEM = 'system',
}

/**
 * Explain function signature
 */
export interface ExplainFunction {
    (expression: string, operation?: string, config?: Partial<MathConfig>): Promise<ExplanationResult>;
}

/**
 * Result of mathematical explanation
 */
export interface ExplanationResult extends MathResult<string> {
    /** Detailed explanation */
    readonly explanation: string;
    /** Educational level (1-5) */
    readonly level: number;
    /** Related concepts */
    readonly concepts: readonly string[];
    /** Practice problems */
    readonly practiceProblems?: readonly string[];
}

/**
 * Derivative calculation function
 */
export interface DerivativeFunction {
    (expression: string, variable?: string, config?: Partial<MathConfig>): Promise<DerivativeResult>;
}

/**
 * Result of derivative calculation
 */
export interface DerivativeResult extends MathResult<string> {
    /** Variable of differentiation */
    readonly variable: string;
    /** Order of derivative */
    readonly order: number;
    /** Rules applied */
    readonly rulesApplied: readonly string[];
}

/**
 * Integral calculation function
 */
export interface IntegralFunction {
    (expression: string, variable?: string, config?: Partial<IntegralConfig>): Promise<IntegralResult>;
}

/**
 * Configuration for integral calculation
 */
export interface IntegralConfig extends MathConfig {
    /** Whether to calculate definite integral */
    readonly definite?: boolean;
    /** Lower bound for definite integral */
    readonly lowerBound?: number;
    /** Upper bound for definite integral */
    readonly upperBound?: number;
    /** Integration method preference */
    readonly method?: IntegrationMethod;
}

/**
 * Integration methods
 */
export enum IntegrationMethod {
    SUBSTITUTION = 'substitution',
    PARTS = 'parts',
    PARTIAL_FRACTIONS = 'partial_fractions',
    TRIGONOMETRIC = 'trigonometric',
    NUMERICAL = 'numerical',
    AUTO = 'auto',
}

/**
 * Result of integral calculation
 */
export interface IntegralResult extends MathResult<string> {
    /** Variable of integration */
    readonly variable: string;
    /** Whether integral is definite */
    readonly isDefinite: boolean;
    /** Integration bounds if definite */
    readonly bounds?: { lower: number; upper: number };
    /** Method used */
    readonly method: IntegrationMethod;
    /** Constant of integration */
    readonly constant?: string;
}

/**
 * Factor function signature
 */
export interface FactorFunction {
    (expression: string, config?: Partial<MathConfig>): Promise<FactorResult>;
}

/**
 * Result of factoring
 */
export interface FactorResult extends MathResult<string> {
    /** Individual factors */
    readonly factors: readonly Factor[];
    /** Factoring method used */
    readonly method: string;
}

/**
 * Individual factor
 */
export interface Factor {
    readonly expression: string;
    readonly multiplicity: number;
    readonly type: string;
}

/**
 * Types of factors
 */
export enum FactorType {
    LINEAR = 'linear',
    QUADRATIC = 'quadratic',
    IRREDUCIBLE = 'irreducible',
    CONSTANT = 'constant',
}

/**
 * Factoring methods
 */
export enum FactoringMethod {
    COMMON_FACTOR = 'common_factor',
    DIFFERENCE_OF_SQUARES = 'difference_of_squares',
    PERFECT_SQUARE = 'perfect_square',
    GROUPING = 'grouping',
    QUADRATIC = 'quadratic',
    RATIONAL_ROOT = 'rational_root',
}

/**
 * Expand function signature
 */
export interface ExpandFunction {
    (expression: string, config?: Partial<MathConfig>): Promise<ExpandResult>;
}

/**
 * Result of expansion
 */
export interface ExpandResult extends MathResult<string> {
    /** Terms in expanded form */
    readonly terms: readonly Term[];
    /** Expansion method used */
    readonly method: string;
}

/**
 * Individual term in expansion
 */
export interface Term {
    readonly coefficient: number | string;
    readonly variables: Record<string, number>;
    readonly expression: string;
}

/**
 * Expansion methods
 */
export enum ExpansionMethod {
    DISTRIBUTIVE = 'distributive',
    BINOMIAL = 'binomial',
    MULTINOMIAL = 'multinomial',
    TAYLOR = 'taylor',
}

/**
 * Simplify function signature
 */
export interface SimplifyFunction {
    (expression: string, config?: Partial<MathConfig>): Promise<SimplifyResult>;
}

/**
 * Result of simplification
 */
export interface SimplifyResult extends MathResult<string> {
    /** Simplification rules applied */
    readonly rulesApplied: readonly string[];
    /** Complexity reduction */
    readonly complexityReduction: number;
}

/**
 * Evaluate function signature
 */
export interface EvaluateFunction {
    (expression: string, variables?: VariableAssignment, config?: Partial<MathConfig>): Promise<EvaluateResult>;
}

/**
 * Result of evaluation
 */
export interface EvaluateResult extends MathResult<number | string> {
    /** Whether result is numerical */
    readonly isNumerical: boolean;
    /** Units if applicable */
    readonly units?: string;
}

/**
 * Matrix operations interface
 */
export interface MatrixOperations {
    /** Create matrix from array */
    create: (data: readonly (readonly number[])[]) => Matrix;
    /** Add matrices */
    add: (a: Matrix, b: Matrix) => Promise<MatrixResult>;
    /** Multiply matrices */
    multiply: (a: Matrix, b: Matrix) => Promise<MatrixResult>;
    /** Calculate determinant */
    determinant: (matrix: Matrix) => Promise<MatrixResult>;
    /** Invert matrix */
    invert: (matrix: Matrix) => Promise<MatrixResult>;
    /** Solve linear system */
    solve: (coefficients: Matrix, constants: Matrix) => Promise<MatrixResult>;
}

/**
 * Matrix representation
 */
export interface Matrix {
    readonly data: readonly (readonly number[])[];
    readonly rows: number;
    readonly columns: number;
    readonly isSquare: boolean;
}

/**
 * Result of matrix operation
 */
export interface MatrixResult extends MathResult<Matrix> {
    /** Properties of result matrix */
    readonly properties: MatrixProperties;
}

/**
 * Matrix properties
 */
export interface MatrixProperties {
    readonly rank?: number;
    readonly determinant?: number;
    readonly trace?: number;
    readonly eigenvalues?: readonly number[];
    readonly isSymmetric?: boolean;
    readonly isOrthogonal?: boolean;
}

/**
 * Configuration manager interface
 */
export interface ConfigurationManager {
    /** Get current configuration */
    get: () => MathConfig;
    /** Set configuration */
    set: (config: Partial<MathConfig>) => void;
    /** Reset to default configuration */
    reset: () => void;
    /** Add custom function */
    addFunction: (definition: FunctionDefinition) => void;
    /** Remove custom function */
    removeFunction: (name: string) => void;
}

/**
 * Performance monitor interface
 */
export interface PerformanceMonitor {
    /** Get current metrics */
    getMetrics: () => PerformanceMetrics;
    /** Reset metrics */
    reset: () => void;
    /** Start profiling */
    startProfiling: () => void;
    /** Stop profiling */
    stopProfiling: () => PerformanceMetrics;
}

/**
 * Voice service interface
 */
export interface VoiceAPI {
    /** Check if voice services are supported */
    isSupported: () => { input: boolean; output: boolean };
    /** Listen for mathematical expression */
    listen: () => Promise<{ text: string; confidence: number }>;
    /** Speak mathematical expression */
    speak: (expression: string, explanation?: string) => Promise<void>;
    /** Speak step-by-step solution */
    speakSolution: (steps: { text: string; expression: string }[]) => Promise<void>;
    /** Stop all voice activity */
    stop: () => void;
    /** Get available voices */
    getVoices: () => any[];
}

/**
 * Visualization service interface
 */
export interface VisualizationAPI {
    /** Plot a 2D function */
    plot2D: (container: HTMLElement, expression: string, variable?: string, options?: any) => void;
    /** Plot a 3D function */
    plot3D: (container: HTMLElement, expression: string, options?: any) => void;
    /** Plot multiple functions */
    plotMultiple: (container: HTMLElement, expressions: string[], variable?: string, options?: any) => void;
    /** Generate SVG for a function */
    generateSVG: (expression: string, variable?: string, options?: any) => string;
    /** Generate image for a function */
    generateImage: (expression: string, variable?: string, options?: any) => string;
    /** Render a mathematical expression */
    renderMath: (expression: string, format?: 'latex' | 'mathml' | 'asciimath', displayMode?: boolean) => string;
    /** Render a step-by-step solution */
    renderSteps: (steps: { text: string; expression: string }[], format?: 'latex' | 'mathml' | 'asciimath') => string;
    /** Generate a complete visualization of a mathematical solution */
    visualizeSolution: (expression: string, steps: { text: string; expression: string }[], plotOptions?: any) => string;
}