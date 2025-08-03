/**
 * AI and Natural Language Processing type definitions
 * Defines interfaces for AI model integration and NLP functionality
 */

/**
 * AI model configuration
 */
export interface AIModelConfig {
    /** Model identifier */
    readonly modelId: string;
    /** Model type */
    readonly type: ModelType;
    /** Model size in bytes */
    readonly size: number;
    /** Whether model supports offline usage */
    readonly offline: boolean;
    /** Supported languages */
    readonly languages: readonly string[];
    /** Model capabilities */
    readonly capabilities: readonly ModelCapability[];
    /** Loading strategy */
    readonly loadingStrategy: LoadingStrategy;
}

/**
 * Types of AI models
 */
export enum ModelType {
    TRANSFORMER = 'transformer',
    BERT = 'bert',
    GPT = 'gpt',
    T5 = 't5',
    DISTILBERT = 'distilbert',
    CUSTOM = 'custom',
}

/**
 * AI model capabilities
 */
export enum ModelCapability {
    TEXT_CLASSIFICATION = 'text_classification',
    TOKEN_CLASSIFICATION = 'token_classification',
    QUESTION_ANSWERING = 'question_answering',
    TEXT_GENERATION = 'text_generation',
    TRANSLATION = 'translation',
    SUMMARIZATION = 'summarization',
    MATH_PARSING = 'math_parsing',
    INTENT_DETECTION = 'intent_detection',
}

/**
 * Model loading strategies
 */
export enum LoadingStrategy {
    EAGER = 'eager',
    LAZY = 'lazy',
    ON_DEMAND = 'on_demand',
    PRELOAD = 'preload',
}

/**
 * AI model interface
 */
export interface AIModel {
    /** Model configuration */
    readonly config: AIModelConfig;
    /** Whether model is loaded */
    readonly isLoaded: boolean;
    /** Load the model */
    load: () => Promise<void>;
    /** Unload the model */
    unload: () => Promise<void>;
    /** Process input with the model */
    process: <T>(input: ModelInput) => Promise<ModelOutput<T>>;
    /** Get model memory usage */
    getMemoryUsage: () => number;
}

/**
 * Input for AI model processing
 */
export interface ModelInput {
    /** Input text */
    readonly text: string;
    /** Processing options */
    readonly options?: ModelProcessingOptions;
    /** Context information */
    readonly context?: ModelContext;
}

/**
 * Options for model processing
 */
export interface ModelProcessingOptions {
    /** Maximum sequence length */
    readonly maxLength?: number;
    /** Temperature for generation */
    readonly temperature?: number;
    /** Top-k sampling */
    readonly topK?: number;
    /** Top-p sampling */
    readonly topP?: number;
    /** Number of beams for beam search */
    readonly numBeams?: number;
    /** Whether to return attention weights */
    readonly returnAttention?: boolean;
}

/**
 * Context for model processing
 */
export interface ModelContext {
    /** Previous conversation turns */
    readonly history?: readonly string[];
    /** Domain-specific context */
    readonly domain?: string;
    /** User preferences */
    readonly preferences?: Record<string, unknown>;
}

/**
 * Output from AI model processing
 */
export interface ModelOutput<T = unknown> {
    /** Primary result */
    readonly result: T;
    /** Confidence score */
    readonly confidence: number;
    /** Processing time */
    readonly processingTime: number;
    /** Attention weights if requested */
    readonly attention?: readonly number[][];
    /** Alternative results */
    readonly alternatives?: readonly AlternativeResult<T>[];
}

/**
 * Alternative result from model
 */
export interface AlternativeResult<T = unknown> {
    readonly result: T;
    readonly confidence: number;
    readonly score: number;
}

/**
 * NLP pipeline configuration
 */
export interface NLPPipelineConfig {
    /** Pipeline stages */
    readonly stages: readonly PipelineStage[];
    /** Default language */
    readonly defaultLanguage: string;
    /** Fallback strategy */
    readonly fallbackStrategy: FallbackStrategy;
    /** Cache configuration */
    readonly cache?: CacheConfig;
}

/**
 * NLP pipeline stage
 */
export interface PipelineStage {
    /** Stage name */
    readonly name: string;
    /** Stage type */
    readonly type: StageType;
    /** Stage configuration */
    readonly config: Record<string, unknown>;
    /** Whether stage is required */
    readonly required: boolean;
}

/**
 * Types of pipeline stages
 */
export enum StageType {
    TOKENIZATION = 'tokenization',
    NORMALIZATION = 'normalization',
    ENTITY_EXTRACTION = 'entity_extraction',
    INTENT_CLASSIFICATION = 'intent_classification',
    MATH_PARSING = 'math_parsing',
    VALIDATION = 'validation',
    POST_PROCESSING = 'post_processing',
}

/**
 * Fallback strategies for NLP processing
 */
export enum FallbackStrategy {
    RULE_BASED = 'rule_based',
    PATTERN_MATCHING = 'pattern_matching',
    TEMPLATE_MATCHING = 'template_matching',
    ERROR = 'error',
    NONE = 'none',
}

/**
 * Cache configuration for AI models
 */
export interface CacheConfig {
    /** Maximum cache size in MB */
    readonly maxSize: number;
    /** Cache TTL in milliseconds */
    readonly ttl: number;
    /** Cache eviction strategy */
    readonly evictionStrategy: EvictionStrategy;
    /** Whether to persist cache */
    readonly persistent: boolean;
}

/**
 * Cache eviction strategies
 */
export enum EvictionStrategy {
    LRU = 'lru',
    LFU = 'lfu',
    FIFO = 'fifo',
    TTL = 'ttl',
}

/**
 * NLP processor interface
 */
export interface NLPProcessor {
    /** Process natural language input */
    process: (input: NLPInput) => Promise<NLPOutput>;
    /** Get supported languages */
    getSupportedLanguages: () => readonly string[];
    /** Set language */
    setLanguage: (language: string) => void;
    /** Add custom pattern */
    addPattern: (pattern: NLPPattern) => void;
    /** Remove custom pattern */
    removePattern: (id: string) => void;
}

/**
 * Input for NLP processing
 */
export interface NLPInput {
    /** Input text */
    readonly text: string;
    /** Language hint */
    readonly language?: string;
    /** Context information */
    readonly context?: NLPContext;
    /** Processing options */
    readonly options?: NLPProcessingOptions;
}

/**
 * Context for NLP processing
 */
export interface NLPContext {
    /** Previous queries */
    readonly history?: readonly string[];
    /** Current topic */
    readonly topic?: string;
    /** User profile */
    readonly userProfile?: UserProfile;
}

/**
 * User profile for personalization
 */
export interface UserProfile {
    /** Education level */
    readonly educationLevel?: EducationLevel;
    /** Preferred notation */
    readonly preferredNotation?: NotationStyle;
    /** Mathematical background */
    readonly mathBackground?: readonly string[];
    /** Language preferences */
    readonly languagePreferences?: readonly string[];
}

/**
 * Education levels
 */
export enum EducationLevel {
    ELEMENTARY = 'elementary',
    MIDDLE_SCHOOL = 'middle_school',
    HIGH_SCHOOL = 'high_school',
    UNDERGRADUATE = 'undergraduate',
    GRADUATE = 'graduate',
    PROFESSIONAL = 'professional',
}

/**
 * Mathematical notation styles
 */
export enum NotationStyle {
    STANDARD = 'standard',
    LATEX = 'latex',
    MATHML = 'mathml',
    ASCII = 'ascii',
    UNICODE = 'unicode',
}

/**
 * Options for NLP processing
 */
export interface NLPProcessingOptions {
    /** Whether to use AI models */
    readonly useAI?: boolean;
    /** Confidence threshold */
    readonly confidenceThreshold?: number;
    /** Maximum alternatives to return */
    readonly maxAlternatives?: number;
    /** Whether to explain reasoning */
    readonly explainReasoning?: boolean;
}

/**
 * Output from NLP processing
 */
export interface NLPOutput {
    /** Extracted mathematical expression */
    readonly expression: string;
    /** Detected intent */
    readonly intent: string;
    /** Confidence in interpretation */
    readonly confidence: number;
    /** Extracted entities */
    readonly entities: readonly NLPEntity[];
    /** Alternative interpretations */
    readonly alternatives?: readonly NLPAlternative[];
    /** Processing metadata */
    readonly metadata: NLPMetadata;
}

/**
 * Entity extracted from natural language
 */
export interface NLPEntity {
    /** Entity type */
    readonly type: EntityType;
    /** Entity value */
    readonly value: string;
    /** Position in text */
    readonly position: { start: number; end: number };
    /** Confidence in extraction */
    readonly confidence: number;
    /** Additional properties */
    readonly properties?: Record<string, unknown>;
}

/**
 * Types of entities
 */
export enum EntityType {
    NUMBER = 'number',
    VARIABLE = 'variable',
    FUNCTION = 'function',
    OPERATOR = 'operator',
    UNIT = 'unit',
    CONSTANT = 'constant',
    EQUATION = 'equation',
    EXPRESSION = 'expression',
}

/**
 * Alternative NLP interpretation
 */
export interface NLPAlternative {
    readonly expression: string;
    readonly intent: string;
    readonly confidence: number;
    readonly explanation: string;
}

/**
 * Metadata for NLP processing
 */
export interface NLPMetadata {
    /** Processing time */
    readonly processingTime: number;
    /** Language detected */
    readonly detectedLanguage: string;
    /** Models used */
    readonly modelsUsed: readonly string[];
    /** Fallback used */
    readonly fallbackUsed: boolean;
    /** Cache hit */
    readonly cacheHit: boolean;
}

/**
 * Custom NLP pattern
 */
export interface NLPPattern {
    /** Pattern identifier */
    readonly id: string;
    /** Pattern regex or template */
    readonly pattern: string | RegExp;
    /** Intent to assign */
    readonly intent: string;
    /** Extraction rules */
    readonly extractionRules?: readonly ExtractionRule[];
    /** Priority (higher = more priority) */
    readonly priority: number;
}

/**
 * Rule for extracting information from matched patterns
 */
export interface ExtractionRule {
    /** Rule name */
    readonly name: string;
    /** Extraction pattern */
    readonly pattern: string | RegExp;
    /** Target entity type */
    readonly entityType: EntityType;
    /** Transformation function */
    readonly transform?: (value: string) => string;
}

/**
 * Model manager interface
 */
export interface ModelManager {
    /** Load a model */
    loadModel: (modelId: string) => Promise<AIModel>;
    /** Unload a model */
    unloadModel: (modelId: string) => Promise<void>;
    /** Get loaded models */
    getLoadedModels: () => readonly string[];
    /** Get model info */
    getModelInfo: (modelId: string) => AIModelConfig | undefined;
    /** Check if model is available */
    isModelAvailable: (modelId: string) => boolean;
    /** Get memory usage */
    getMemoryUsage: () => number;
    /** Clear cache */
    clearCache: () => Promise<void>;
}

/**
 * Explanation generator interface
 */
export interface ExplanationGenerator {
    /** Generate explanation for a mathematical operation */
    generateExplanation: (input: ExplanationInput) => Promise<ExplanationOutput>;
    /** Get available explanation styles */
    getAvailableStyles: () => readonly ExplanationStyle[];
    /** Set explanation style */
    setStyle: (style: ExplanationStyle) => void;
}

/**
 * Input for explanation generation
 */
export interface ExplanationInput {
    /** Mathematical expression or equation */
    readonly expression: string;
    /** Operation being performed */
    readonly operation: string;
    /** Steps taken */
    readonly steps: readonly string[];
    /** Target audience */
    readonly audience?: EducationLevel;
    /** Explanation style */
    readonly style?: ExplanationStyle;
}

/**
 * Output from explanation generation
 */
export interface ExplanationOutput {
    /** Generated explanation */
    readonly explanation: string;
    /** Key concepts involved */
    readonly concepts: readonly string[];
    /** Difficulty level */
    readonly difficulty: number;
    /** Estimated reading time */
    readonly readingTime: number;
    /** Related topics */
    readonly relatedTopics?: readonly string[];
}

/**
 * Explanation styles
 */
export enum ExplanationStyle {
    CONCISE = 'concise',
    DETAILED = 'detailed',
    STEP_BY_STEP = 'step_by_step',
    CONCEPTUAL = 'conceptual',
    VISUAL = 'visual',
    CONVERSATIONAL = 'conversational',
}