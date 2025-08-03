/**
 * Main type definitions export for the Mathrok library
 * Re-exports all type definitions for easy importing
 */

// Core types
export type {
    MathExpression,
    ExpressionNode,
    MathResult,
    SolutionStep,
    AlternativeSolution,
    ResultMetadata,
    VariableAssignment,
    FunctionDefinition,
    MathConstant,
    Unit,
    PerformanceMetrics,
    CacheEntry,
    ValidationResult,
} from './core.js';

export {
    NodeType,
    MathOperation,
    MathErrorType,
    MathError,
} from './core.js';

export type { MathConfig } from './core.js';

// API types
export type {
    MathrokAPI,
    SolveFunction,
    SolveResult,
    Solution,
    DomainRestriction,
    NaturalLanguageFunction,
    NLConfig,
    NLResult,
    AlternativeInterpretation,
    ParseFunction,
    ParseResult,
    MathStructure,
    ExplainFunction,
    ExplanationResult,
    DerivativeFunction,
    DerivativeResult,
    IntegralFunction,
    IntegralConfig,
    IntegralResult,
    FactorFunction,
    FactorResult,
    Factor,
    ExpandFunction,
    ExpandResult,
    Term,
    SimplifyFunction,
    SimplifyResult,
    EvaluateFunction,
    EvaluateResult,
    MatrixOperations,
    Matrix,
    MatrixResult,
    MatrixProperties,
    ConfigurationManager,
    PerformanceMonitor,
    VoiceAPI,
    VisualizationAPI,
} from './api.js';

export {
    EquationType,
    MathIntent,
    StructureType,
    IntegrationMethod,
    FactorType,
} from './api.js';

// AI types
export type {
    AIModelConfig,
    AIModel,
    ModelInput,
    ModelProcessingOptions,
    ModelContext,
    ModelOutput,
    AlternativeResult,
    NLPPipelineConfig,
    PipelineStage,
    CacheConfig,
    NLPProcessor,
    NLPInput,
    NLPContext,
    UserProfile,
    NLPProcessingOptions,
    NLPOutput,
    NLPEntity,
    NLPAlternative,
    NLPMetadata,
    NLPPattern,
    ExtractionRule,
    ModelManager,
    ExplanationGenerator,
    ExplanationInput,
    ExplanationOutput,
} from './ai.js';

export {
    ModelType,
    ModelCapability,
    LoadingStrategy,
    StageType,
    FallbackStrategy,
    EvictionStrategy,
    EducationLevel,
    NotationStyle,
    EntityType,
    ExplanationStyle,
} from './ai.js';

// Utility types for better developer experience
export type DeepReadonly<T> = {
    readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];

export type OptionalKeys<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T];

// Type guards
export const isNumber = (value: unknown): value is number =>
    typeof value === 'number' && !isNaN(value) && isFinite(value);

export const isString = (value: unknown): value is string =>
    typeof value === 'string';

export const isMathExpression = (value: unknown): value is MathExpression =>
    typeof value === 'object' &&
    value !== null &&
    'raw' in value &&
    'normalized' in value &&
    'variables' in value;

export const isMathError = (error: unknown): error is MathError =>
    error instanceof MathError;

// Constants
export const DEFAULT_PRECISION = 15;
export const DEFAULT_TIMEOUT = 30000; // 30 seconds
export const MAX_EXPRESSION_LENGTH = 10000;
export const MAX_VARIABLES = 100;
export const MAX_STEPS = 1000;

// Version information
export const VERSION = '1.1.0';
export const API_VERSION = '1.1';

// Feature flags (for progressive enhancement)
export interface FeatureFlags {
    readonly aiEnabled: boolean;
    readonly cacheEnabled: boolean;
    readonly performanceMonitoring: boolean;
    readonly advancedMath: boolean;
    readonly matrixOperations: boolean;
    readonly plotting: boolean;
    readonly voiceEnabled: boolean;
    readonly visualizationEnabled: boolean;
}

export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
    aiEnabled: true,
    cacheEnabled: true,
    performanceMonitoring: true,
    advancedMath: true,
    matrixOperations: true,
    plotting: true,
    voiceEnabled: true,
    visualizationEnabled: true,
} as const;