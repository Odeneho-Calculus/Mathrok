/**
 * Mathrok - AI-powered symbolic mathematics library
 * Main entry point for the library
 */

import type {
    MathrokAPI,
    SolveFunction,
    NaturalLanguageFunction,
    ParseFunction,
    ExplainFunction,
    DerivativeFunction,
    IntegralFunction,
    FactorFunction,
    ExpandFunction,
    SimplifyFunction,
    EvaluateFunction,
    MatrixOperations,
    ConfigurationManager,
    PerformanceMonitor,
    MathConfig,
} from './types/api.js';

import { MathEngine } from './core/engine/index.js';
import { MathParser } from './core/parser/index.js';
import { MathSolver } from './core/solver/index.js';
import { NLPProcessor } from './ai/nlp/index.js';
import { ExplanationGenerator } from './ai/explainer/index.js';
import { MatrixEngine } from './core/engine/matrix.js';
import { StatisticsEngine } from './core/engine/statistics.js';
import { ConfigManager } from './utils/config.js';
import { IntelligentCache } from './utils/caching/intelligent-cache.js';
import { PerformanceTracker } from './utils/performance/index.js';
import { getHighResolutionTime } from './utils/performance/timer.js';
import { NaturalLanguageProcessor } from './core/nl.js';
import { DEFAULT_FEATURE_FLAGS, VERSION } from './types/index.js';
import { VoiceService } from './ai/voice/index.js';
import { VisualizationService } from './visualization/index.js';

/**
 * Main Mathrok class implementing the public API
 */
class Mathrok implements MathrokAPI {
    private readonly engine: MathEngine;
    private readonly parser: MathParser;
    private readonly solver: MathSolver;
    private readonly nlpProcessor: NLPProcessor;
    private readonly nlProcessor: NaturalLanguageProcessor;
    private readonly explanationGenerator: ExplanationGenerator;
    private readonly matrixEngine: MatrixEngine;
    private readonly statisticsEngine: StatisticsEngine;
    private readonly configManager: ConfigManager;
    private readonly performanceTracker: PerformanceTracker;
    private readonly intelligentCache: IntelligentCache;
    private readonly voiceService: VoiceService;
    private readonly visualizationService: VisualizationService;

    constructor(config?: Partial<MathConfig>) {
        // Initialize configuration manager
        this.configManager = new ConfigManager(config);

        // Initialize performance tracker
        this.performanceTracker = new PerformanceTracker();

        // Initialize caching system
        this.intelligentCache = new IntelligentCache({
            maxQueryCacheSize: 1000,
            maxComputationCacheSize: 500,
            maxAICacheSize: 100,
            defaultTTL: 3600000, // 1 hour
            enableCompression: true
        });

        // Initialize core components
        this.parser = new MathParser(this.configManager.get());
        this.engine = new MathEngine(this.configManager.get());
        this.solver = new MathSolver(this.engine, this.parser);
        this.matrixEngine = new MatrixEngine();
        this.statisticsEngine = new StatisticsEngine();

        // Initialize AI components
        this.nlpProcessor = new NLPProcessor(this.configManager.get());
        this.nlProcessor = new NaturalLanguageProcessor(this.engine, this.configManager.get());
        this.explanationGenerator = new ExplanationGenerator();

        // Initialize Phase 5 components
        this.voiceService = new VoiceService();
        this.visualizationService = new VisualizationService(this.engine);
    }

    /**
     * Solve mathematical equations and expressions
     */
    public readonly solve: SolveFunction = async (
        expression: string,
        variablesOrConfig?: any,
        config?: Partial<MathConfig>
    ) => {
        const startTime = getHighResolutionTime();

        try {
            // Handle overloaded parameters
            let variables: any = {};
            let finalConfig: Partial<MathConfig> = {};

            if (typeof variablesOrConfig === 'object' && !config) {
                // Check if it's variables or config
                if ('precision' in variablesOrConfig || 'timeout' in variablesOrConfig) {
                    finalConfig = variablesOrConfig;
                } else {
                    variables = variablesOrConfig;
                }
            } else {
                variables = variablesOrConfig || {};
                finalConfig = config || {};
            }

            const result = await this.solver.solve(expression, variables, finalConfig);

            // Track performance
            const endTime = getHighResolutionTime();
            this.performanceTracker.recordOperation('solve', endTime - startTime);

            return result;
        } catch (error) {
            this.performanceTracker.recordError('solve', error as Error);
            throw error;
        }
    };

    /**
     * Parse natural language mathematical queries
     */
    public readonly nl: NaturalLanguageFunction = async (query: string, config?) => {
        const startTime = getHighResolutionTime();

        try {
            const result = await this.nlpProcessor.process({
                text: query,
                options: config,
            });

            // Convert NLP output to expected format
            const nlResult = {
                result: result.expression,
                steps: [],
                metadata: {
                    computationTime: getHighResolutionTime() - startTime,
                    method: 'nlp',
                    confidence: result.confidence,
                    isExact: true,
                },
                intent: result.intent as any,
                expression: result.expression,
                confidence: result.confidence,
                alternatives: result.alternatives?.map(alt => ({
                    expression: alt.expression,
                    intent: alt.intent as any,
                    confidence: alt.confidence,
                    description: alt.explanation,
                })),
            };

            this.performanceTracker.recordOperation('nl', getHighResolutionTime() - startTime);
            return nlResult;
        } catch (error) {
            this.performanceTracker.recordError('nl', error as Error);
            throw error;
        }
    };

    /**
     * Parse mathematical expressions
     */
    public readonly parse: ParseFunction = async (expression: string, config?) => {
        const startTime = getHighResolutionTime();

        try {
            const result = await this.parser.parse(expression, config);

            this.performanceTracker.recordOperation('parse', getHighResolutionTime() - startTime);
            return result;
        } catch (error) {
            this.performanceTracker.recordError('parse', error as Error);
            throw error;
        }
    };

    /**
     * Explain mathematical solutions step-by-step
     */
    public readonly explain: ExplainFunction = async (expression: string, operation?, config?) => {
        const startTime = getHighResolutionTime();

        try {
            const result = await this.explanationGenerator.generateExplanation({
                expression,
                operation: operation || 'solve',
                steps: [],
                audience: config?.educationLevel,
            });

            const explanationResult = {
                result: result.explanation,
                steps: [],
                metadata: {
                    computationTime: getHighResolutionTime() - startTime,
                    method: 'explanation',
                    confidence: 1,
                    isExact: true,
                },
                explanation: result.explanation,
                level: result.difficulty,
                concepts: result.concepts,
                practiceProblems: result.relatedTopics,
            };

            this.performanceTracker.recordOperation('explain', getHighResolutionTime() - startTime);
            return explanationResult;
        } catch (error) {
            this.performanceTracker.recordError('explain', error as Error);
            throw error;
        }
    };

    /**
     * Calculate derivatives
     */
    public readonly derivative: DerivativeFunction = async (expression: string, variable = 'x', config?) => {
        const startTime = getHighResolutionTime();

        try {
            const result = await this.engine.derivative(expression, variable, config);

            this.performanceTracker.recordOperation('derivative', getHighResolutionTime() - startTime);
            return result;
        } catch (error) {
            this.performanceTracker.recordError('derivative', error as Error);
            throw error;
        }
    };

    /**
     * Calculate integrals
     */
    public readonly integral: IntegralFunction = async (expression: string, variable = 'x', config?) => {
        const startTime = getHighResolutionTime();

        try {
            const result = await this.engine.integral(expression, variable, config);

            this.performanceTracker.recordOperation('integral', getHighResolutionTime() - startTime);
            return result;
        } catch (error) {
            this.performanceTracker.recordError('integral', error as Error);
            throw error;
        }
    };

    /**
     * Factor expressions
     */
    public readonly factor: FactorFunction = async (expression: string, config?) => {
        const startTime = getHighResolutionTime();

        try {
            const result = await this.engine.factor(expression, config);

            this.performanceTracker.recordOperation('factor', getHighResolutionTime() - startTime);
            return result;
        } catch (error) {
            this.performanceTracker.recordError('factor', error as Error);
            throw error;
        }
    };

    /**
     * Expand expressions
     */
    public readonly expand: ExpandFunction = async (expression: string, config?) => {
        const startTime = getHighResolutionTime();

        try {
            const result = await this.engine.expand(expression, config);

            this.performanceTracker.recordOperation('expand', getHighResolutionTime() - startTime);
            return result;
        } catch (error) {
            this.performanceTracker.recordError('expand', error as Error);
            throw error;
        }
    };

    /**
     * Simplify expressions
     */
    public readonly simplify: SimplifyFunction = async (expression: string, config?) => {
        const startTime = getHighResolutionTime();

        try {
            const result = await this.engine.simplify(expression, config);

            this.performanceTracker.recordOperation('simplify', getHighResolutionTime() - startTime);
            return result;
        } catch (error) {
            this.performanceTracker.recordError('simplify', error as Error);
            throw error;
        }
    };

    /**
     * Evaluate expressions
     */
    public readonly evaluate: EvaluateFunction = async (expression: string, variables?, config?) => {
        const startTime = getHighResolutionTime();

        try {
            const result = await this.engine.evaluate(expression, variables, config);

            this.performanceTracker.recordOperation('evaluate', getHighResolutionTime() - startTime);
            return result;
        } catch (error) {
            this.performanceTracker.recordError('evaluate', error as Error);
            throw error;
        }
    };





    /**
     * Configuration management
     */
    public readonly config: ConfigurationManager = {
        get: () => this.configManager.get(),
        set: (config) => this.configManager.set(config),
        reset: () => this.configManager.reset(),
        addFunction: (definition) => this.configManager.addFunction(definition),
        removeFunction: (name) => this.configManager.removeFunction(name),
    };

    /**
     * Voice input and output capabilities
     */
    public readonly voice = {
        /**
         * Check if voice services are supported
         */
        isSupported: (): { input: boolean; output: boolean } => {
            return this.voiceService.isVoiceSupported();
        },

        /**
         * Listen for mathematical expression
         */
        listen: async (): Promise<{ text: string; confidence: number }> => {
            const result = await this.voiceService.listenForMathExpression();
            return {
                text: result.text,
                confidence: result.confidence
            };
        },

        /**
         * Speak mathematical expression
         */
        speak: async (expression: string, explanation?: string): Promise<void> => {
            return this.voiceService.speakMathExpression(expression, explanation);
        },

        /**
         * Speak step-by-step solution
         */
        speakSolution: async (steps: { text: string; expression: string }[]): Promise<void> => {
            return this.voiceService.speakStepByStepSolution(steps);
        },

        /**
         * Stop all voice activity
         */
        stop: (): void => {
            this.voiceService.stopAll();
        },

        /**
         * Get available voices
         */
        getVoices: () => {
            return this.voiceService.getAvailableVoices();
        }
    };

    /**
     * Visualization capabilities
     */
    public readonly visualization = {
        /**
         * Plot a 2D function
         */
        plot2D: (container: HTMLElement, expression: string, variable?: string, options?: any): void => {
            this.visualizationService.plot2D(container, expression, variable, options);
        },

        /**
         * Plot a 3D function
         */
        plot3D: (container: HTMLElement, expression: string, options?: any): void => {
            this.visualizationService.plot3D(container, expression, options);
        },

        /**
         * Plot multiple functions
         */
        plotMultiple: (container: HTMLElement, expressions: string[], variable?: string, options?: any): void => {
            this.visualizationService.plotMultiple(container, expressions, variable, options);
        },

        /**
         * Generate SVG for a function
         */
        generateSVG: (expression: string, variable?: string, options?: any): string => {
            return this.visualizationService.generateSVG(expression, variable, options);
        },

        /**
         * Generate image for a function
         */
        generateImage: (expression: string, variable?: string, options?: any): string => {
            return this.visualizationService.generateImage(expression, variable, options);
        },

        /**
         * Render a mathematical expression
         */
        renderMath: (expression: string, format?: 'latex' | 'mathml' | 'asciimath', displayMode?: boolean): string => {
            return this.visualizationService.renderMath(expression, format, displayMode);
        },

        /**
         * Render a step-by-step solution
         */
        renderSteps: (steps: { text: string; expression: string }[], format?: 'latex' | 'mathml' | 'asciimath'): string => {
            return this.visualizationService.renderSteps(steps, format);
        },

        /**
         * Generate a complete visualization of a mathematical solution
         */
        visualizeSolution: (expression: string, steps: { text: string; expression: string }[], plotOptions?: any): string => {
            return this.visualizationService.visualizeSolution(expression, steps, plotOptions);
        }
    };

    /**
     * Performance monitoring
     */
    public readonly performance: PerformanceMonitor = {
        getMetrics: () => this.performanceTracker.getMetrics(),
        reset: () => this.performanceTracker.reset(),
        startProfiling: () => this.performanceTracker.startProfiling(),
        stopProfiling: () => this.performanceTracker.stopProfiling(),
    };

    /**
     * Get library version
     */
    public getVersion(): string {
        return VERSION;
    }

    /**
     * Get feature flags
     */
    public getFeatureFlags(): typeof DEFAULT_FEATURE_FLAGS {
        return DEFAULT_FEATURE_FLAGS;
    }

    /**
     * Configure the library (alias for config.set)
     */
    public configure(config: Partial<MathConfig>): void {
        this.config.set(config);
    }

    /**
     * Get current configuration (alias for config.get)
     */
    public getConfig(): MathConfig {
        return this.config.get();
    }

    /**
     * Start performance profiling (alias for performance.startProfiling)
     */
    public startProfiling(): void {
        this.performance.startProfiling();
    }

    /**
     * Stop performance profiling (alias for performance.stopProfiling)
     */
    public stopProfiling(): any {
        return this.performance.stopProfiling();
    }

    /**
     * Advanced algebraic substitution
     */
    public async substitute(
        expression: string,
        substitutions: any,
        config?: Partial<MathConfig>
    ) {
        const startTime = getHighResolutionTime();

        try {
            const result = await this.engine['algebraEngine'].substitute(expression, substitutions, config);
            this.performanceTracker.recordOperation('substitute', getHighResolutionTime() - startTime);
            return result;
        } catch (error) {
            this.performanceTracker.recordError('substitute', error as Error);
            throw error;
        }
    }

    /**
     * Partial fraction decomposition
     */
    public async partialFractions(
        expression: string,
        variable = 'x',
        config?: Partial<MathConfig>
    ) {
        const startTime = getHighResolutionTime();

        try {
            const result = await this.engine['algebraEngine'].partialFractionDecomposition(expression, variable, config);
            this.performanceTracker.recordOperation('partialFractions', getHighResolutionTime() - startTime);
            return result;
        } catch (error) {
            this.performanceTracker.recordError('partialFractions', error as Error);
            throw error;
        }
    }

    /**
     * Compute limits
     */
    public async limit(
        expression: string,
        variable: string,
        approach: string | number,
        direction?: 'left' | 'right' | 'both',
        config?: Partial<MathConfig>
    ) {
        const startTime = getHighResolutionTime();

        try {
            const result = await this.engine['calculusEngine'].computeLimit(expression, variable, approach, direction, config);
            this.performanceTracker.recordOperation('limit', getHighResolutionTime() - startTime);
            return result;
        } catch (error) {
            this.performanceTracker.recordError('limit', error as Error);
            throw error;
        }
    }

    /**
     * Partial derivatives for multivariable calculus
     */
    public async partialDerivative(
        expression: string,
        variable: string,
        config?: Partial<MathConfig>
    ) {
        const startTime = getHighResolutionTime();

        try {
            const result = await this.engine['calculusEngine'].computePartialDerivative(expression, variable, config);
            this.performanceTracker.recordOperation('partialDerivative', getHighResolutionTime() - startTime);
            return result;
        } catch (error) {
            this.performanceTracker.recordError('partialDerivative', error as Error);
            throw error;
        }
    }

    /**
     * Taylor series expansion
     */
    public async taylorSeries(
        expression: string,
        variable: string,
        center: number | string = 0,
        order = 5,
        config?: Partial<MathConfig>
    ) {
        const startTime = getHighResolutionTime();

        try {
            const result = await this.engine['calculusEngine'].computeTaylorSeries(expression, variable, center, order, config);
            this.performanceTracker.recordOperation('taylorSeries', getHighResolutionTime() - startTime);
            return result;
        } catch (error) {
            this.performanceTracker.recordError('taylorSeries', error as Error);
            throw error;
        }
    }

    /**
     * Solve trigonometric equations
     */
    public async solveTrigonometric(
        equation: string,
        variable = 'x',
        config?: Partial<MathConfig>
    ) {
        const startTime = getHighResolutionTime();

        try {
            const result = await this.engine['trigonometryEngine'].solveTrigonometric(equation, variable, config);
            this.performanceTracker.recordOperation('solveTrigonometric', getHighResolutionTime() - startTime);
            return result;
        } catch (error) {
            this.performanceTracker.recordError('solveTrigonometric', error as Error);
            throw error;
        }
    }

    /**
     * Convert between trigonometric units
     */
    public async convertTrigUnits(
        expression: string,
        fromUnit: 'degrees' | 'radians',
        toUnit: 'degrees' | 'radians',
        config?: Partial<MathConfig>
    ) {
        const startTime = getHighResolutionTime();

        try {
            const result = await this.engine['trigonometryEngine'].convertTrigUnits(expression, fromUnit, toUnit, config);
            this.performanceTracker.recordOperation('convertTrigUnits', getHighResolutionTime() - startTime);
            return result;
        } catch (error) {
            this.performanceTracker.recordError('convertTrigUnits', error as Error);
            throw error;
        }
    }

    /**
     * Evaluate trigonometric functions at special angles
     */
    public async evaluateSpecialAngles(
        expression: string,
        config?: Partial<MathConfig>
    ) {
        const startTime = getHighResolutionTime();

        try {
            const result = await this.engine['trigonometryEngine'].evaluateSpecialAngles(expression, config);
            this.performanceTracker.recordOperation('evaluateSpecialAngles', getHighResolutionTime() - startTime);
            return result;
        } catch (error) {
            this.performanceTracker.recordError('evaluateSpecialAngles', error as Error);
            throw error;
        }
    }

    /**
     * Process natural language mathematical queries (enhanced)
     */
    public async fromNaturalLanguage(query: string): Promise<{
        result: any;
        interpretation: string;
        confidence: number;
        alternatives?: string[];
        explanation?: string;
        steps?: any[];
        processingTime?: number;
        method?: 'rule_based' | 'ai' | 'hybrid';
        intent?: string;
        expression?: string;
    }> {
        const startTime = getHighResolutionTime();

        try {
            const nlResult = await this.nlProcessor.process(query);
            this.performanceTracker.recordOperation('fromNaturalLanguage', getHighResolutionTime() - startTime);

            // Add intent and expression fields for backward compatibility
            const enhancedResult = {
                ...nlResult,
                intent: this.mapOperationToIntent(nlResult.interpretation),
                expression: this.extractExpressionFromQuery(query)
            };

            return enhancedResult;
        } catch (error) {
            this.performanceTracker.recordError('fromNaturalLanguage', error as Error);
            throw error;
        }
    }

    /**
     * Map operation to intent for backward compatibility
     */
    private mapOperationToIntent(interpretation: string): string {
        if (typeof interpretation === 'string') {
            switch (interpretation.toLowerCase()) {
                case 'derivative':
                    return 'calculate_derivative';
                case 'integral':
                    return 'calculate_integral';
                case 'solve':
                    return 'solve_equation';
                case 'factor':
                    return 'factor_expression';
                case 'simplify':
                    return 'simplify_expression';
                case 'evaluate':
                    return 'evaluate_expression';
                default:
                    return 'unknown';
            }
        }
        return 'unknown';
    }

    /**
     * Extract mathematical expression from natural language query
     */
    private extractExpressionFromQuery(query: string): string {
        // Remove common natural language words and extract mathematical expression
        let cleaned = query.toLowerCase();

        // Remove common phrases
        cleaned = cleaned.replace(/derivative\s+of\s+/g, '');
        cleaned = cleaned.replace(/integral\s+of\s+/g, '');
        cleaned = cleaned.replace(/solve\s+/g, '');
        cleaned = cleaned.replace(/factor\s+/g, '');
        cleaned = cleaned.replace(/simplify\s+/g, '');
        cleaned = cleaned.replace(/\s+equals?\s+/g, ' = ');
        cleaned = cleaned.replace(/\s+plus\s+/g, ' + ');
        cleaned = cleaned.replace(/\s+minus\s+/g, ' - ');
        cleaned = cleaned.replace(/\s+times\s+/g, ' * ');
        cleaned = cleaned.replace(/\s+squared\s*/g, '^2');
        cleaned = cleaned.replace(/\s+cubed\s*/g, '^3');
        cleaned = cleaned.replace(/\s+for\s+[a-zA-Z]\s*$/g, ''); // Remove "for x" at end

        // Extract mathematical parts
        const mathPattern = /([a-zA-Z0-9+\-*/^()=.\s]+)/;
        const match = cleaned.match(mathPattern);
        let result = match ? match[1].trim() : cleaned.trim();

        // Clean up extra spaces
        result = result.replace(/\s+/g, ' ').trim();

        return result || 'x'; // Default fallback
    }

    /**
     * Advanced natural language processing with multi-step support
     */
    public async nlAdvanced(query: string): Promise<{
        result: any;
        interpretation: string;
        confidence: number;
        alternatives?: string[];
        explanation?: string;
        steps?: any[];
        processingTime?: number;
        method?: 'rule_based' | 'ai' | 'hybrid';
        multiStep?: boolean;
        stepResults?: any[];
        contextualInfo?: any;
        learningProgression?: {
            prerequisites: string[];
            nextTopics: string[];
            practiceProblems: string[];
        };
    }> {
        const startTime = getHighResolutionTime();

        try {
            const nlResult = await this.nlProcessor.processAdvanced(query);
            this.performanceTracker.recordOperation('nlAdvanced', getHighResolutionTime() - startTime);
            return nlResult;
        } catch (error) {
            this.performanceTracker.recordError('nlAdvanced', error as Error);
            throw error;
        }
    }

    /**
     * Educational tutoring mode with detailed explanations
     */
    public async nlTutor(query: string): Promise<{
        result: any;
        interpretation: string;
        confidence: number;
        alternatives?: string[];
        explanation?: string;
        steps?: any[];
        processingTime?: number;
        method?: 'rule_based' | 'ai' | 'hybrid';
        educationalExplanation: string;
        conceptExplanation: string;
        commonMistakes: string[];
        practiceProblems: string[];
        difficulty: 'beginner' | 'intermediate' | 'advanced';
        relatedConcepts: string[];
    }> {
        const startTime = getHighResolutionTime();

        try {
            const nlResult = await this.nlProcessor.processTutor(query);
            this.performanceTracker.recordOperation('nlTutor', getHighResolutionTime() - startTime);
            return nlResult;
        } catch (error) {
            this.performanceTracker.recordError('nlTutor', error as Error);
            throw error;
        }
    }

    /**
     * Explain mathematical concepts in natural language
     */
    public async nlExplain(topic: string): Promise<{
        topic: string;
        explanation: string;
        examples: string[];
        stepByStep: string[];
        visualAids?: string[];
        prerequisites: string[];
        applications: string[];
        difficulty: 'beginner' | 'intermediate' | 'advanced';
    }> {
        const startTime = getHighResolutionTime();

        try {
            const nlResult = await this.nlProcessor.explainConcept(topic);
            this.performanceTracker.recordOperation('nlExplain', getHighResolutionTime() - startTime);
            return nlResult;
        } catch (error) {
            this.performanceTracker.recordError('nlExplain', error as Error);
            throw error;
        }
    }

    /**
     * Update natural language processing preferences
     */
    public updateNLPreferences(preferences: {
        explanationStyle?: 'concise' | 'detailed' | 'step-by-step';
        mathematicalNotation?: 'standard' | 'latex' | 'plain';
        showSteps?: boolean;
        showAlternatives?: boolean;
        educationalMode?: boolean;
    }): void {
        this.nlProcessor.updatePreferences(preferences);
    }

    /**
     * Get natural language processing statistics
     */
    public getNLStats(): {
        totalQueries: number;
        ruleBasedQueries: number;
        aiQueries: number;
        hybridQueries: number;
        averageProcessingTime: number;
        successRate: number;
        cacheHitRate: number;
    } {
        return this.nlProcessor.getStats();
    }

    /**
     * Reset natural language processing context and cache
     */
    public resetNLContext(): void {
        this.nlProcessor.reset();
    }

    // ===== PHASE 4: ADVANCED FEATURES =====

    /**
     * Advanced matrix operations with comprehensive linear algebra
     */
    public readonly matrix = {
        /**
         * Matrix addition with step-by-step explanation
         */
        add: (a: any, b: any) => {
            const startTime = getHighResolutionTime();
            try {
                const result = this.matrixEngine.add(a, b);
                this.performanceTracker.recordOperation('matrix_add', getHighResolutionTime() - startTime);
                return result;
            } catch (error) {
                this.performanceTracker.recordError('matrix_add', error as Error);
                throw error;
            }
        },

        /**
         * Matrix multiplication with optimization
         */
        multiply: (a: any, b: any) => {
            const startTime = getHighResolutionTime();
            try {
                const result = this.matrixEngine.multiply(a, b);
                this.performanceTracker.recordOperation('matrix_multiply', getHighResolutionTime() - startTime);
                return result;
            } catch (error) {
                this.performanceTracker.recordError('matrix_multiply', error as Error);
                throw error;
            }
        },

        /**
         * Compute eigenvalues using QR algorithm
         */
        eigenvalues: (matrix: any) => {
            const startTime = getHighResolutionTime();
            try {
                const eigenResult = this.matrixEngine.eigenvalues(matrix);
                this.performanceTracker.recordOperation('matrix_eigenvalues', getHighResolutionTime() - startTime);
                return {
                    result: eigenResult.eigenvalues,
                    steps: eigenResult.steps,
                    metadata: {
                        operation: 'matrix_eigenvalues',
                        computationTime: getHighResolutionTime() - startTime,
                        convergence: eigenResult.convergence
                    }
                };
            } catch (error) {
                this.performanceTracker.recordError('matrix_eigenvalues', error as Error);
                throw error;
            }
        },

        /**
         * Solve linear system Ax = b
         */
        solveLinearSystem: (A: any, b: any) => {
            const startTime = getHighResolutionTime();
            try {
                const result = this.matrixEngine.solveLinearSystem(A, b);
                this.performanceTracker.recordOperation('matrix_solve_system', getHighResolutionTime() - startTime);
                return result;
            } catch (error) {
                this.performanceTracker.recordError('matrix_solve_system', error as Error);
                throw error;
            }
        },

        /**
         * LU decomposition
         */
        luDecomposition: (matrix: any) => {
            const startTime = getHighResolutionTime();
            try {
                const decomposition = this.matrixEngine.luDecomposition(matrix);
                this.performanceTracker.recordOperation('matrix_lu_decomposition', getHighResolutionTime() - startTime);
                return {
                    result: {
                        L: decomposition.factors[0],
                        U: decomposition.factors[1]
                    },
                    steps: decomposition.steps,
                    metadata: {
                        operation: 'lu_decomposition',
                        computationTime: getHighResolutionTime() - startTime,
                        determinant: decomposition.metadata.determinant,
                        condition: decomposition.metadata.condition
                    }
                };
            } catch (error) {
                this.performanceTracker.recordError('matrix_lu_decomposition', error as Error);
                throw error;
            }
        },

        /**
         * QR decomposition
         */
        qrDecomposition: (matrix: any) => {
            const startTime = getHighResolutionTime();
            try {
                const decomposition = this.matrixEngine.qrDecomposition(matrix);
                this.performanceTracker.recordOperation('matrix_qr_decomposition', getHighResolutionTime() - startTime);
                return {
                    result: {
                        Q: decomposition.Q,
                        R: decomposition.R
                    },
                    steps: [`QR decomposition completed for ${matrix.rows}×${matrix.cols} matrix`],
                    metadata: {
                        operation: 'qr_decomposition',
                        computationTime: getHighResolutionTime() - startTime,
                        method: 'gram_schmidt'
                    }
                };
            } catch (error) {
                this.performanceTracker.recordError('matrix_qr_decomposition', error as Error);
                throw error;
            }
        },

        /**
         * Matrix determinant
         */
        determinant: (matrix: any) => {
            const startTime = getHighResolutionTime();
            try {
                const determinantValue = this.matrixEngine.determinant(matrix);
                this.performanceTracker.recordOperation('matrix_determinant', getHighResolutionTime() - startTime);
                return {
                    result: determinantValue,
                    metadata: {
                        operation: 'matrix_determinant',
                        computationTime: getHighResolutionTime() - startTime,
                        method: 'lu_decomposition'
                    }
                };
            } catch (error) {
                this.performanceTracker.recordError('matrix_determinant', error as Error);
                throw error;
            }
        },

        /**
         * Matrix inverse
         */
        inverse: (matrix: any) => {
            const startTime = getHighResolutionTime();
            try {
                const result = this.matrixEngine.inverse(matrix);
                this.performanceTracker.recordOperation('matrix_inverse', getHighResolutionTime() - startTime);
                return result;
            } catch (error) {
                this.performanceTracker.recordError('matrix_inverse', error as Error);
                throw error;
            }
        },

        /**
         * Matrix subtraction with step-by-step explanation
         */
        subtract: (a: any, b: any) => {
            const startTime = getHighResolutionTime();
            try {
                const result = this.matrixEngine.subtract(a, b);
                this.performanceTracker.recordOperation('matrix_subtract', getHighResolutionTime() - startTime);
                return result;
            } catch (error) {
                this.performanceTracker.recordError('matrix_subtract', error as Error);
                throw error;
            }
        },

        /**
         * Scalar multiplication with step-by-step explanation
         */
        scalarMultiply: (matrix: any, scalar: number) => {
            const startTime = getHighResolutionTime();
            try {
                const result = this.matrixEngine.scalarMultiply(matrix, scalar);
                this.performanceTracker.recordOperation('matrix_scalar_multiply', getHighResolutionTime() - startTime);
                return result;
            } catch (error) {
                this.performanceTracker.recordError('matrix_scalar_multiply', error as Error);
                throw error;
            }
        },

        /**
         * Matrix transpose with step-by-step explanation
         */
        transpose: (matrix: any) => {
            const startTime = getHighResolutionTime();
            try {
                const result = this.matrixEngine.transpose(matrix);
                this.performanceTracker.recordOperation('matrix_transpose', getHighResolutionTime() - startTime);
                return result;
            } catch (error) {
                this.performanceTracker.recordError('matrix_transpose', error as Error);
                throw error;
            }
        },

        /**
         * Matrix eigenvectors computation
         */
        eigenvectors: (matrix: any) => {
            const startTime = getHighResolutionTime();
            try {
                const eigenResult = this.matrixEngine.eigenvectors(matrix);
                this.performanceTracker.recordOperation('matrix_eigenvectors', getHighResolutionTime() - startTime);
                return {
                    result: eigenResult.eigenvectors,
                    eigenvalues: eigenResult.eigenvalues,
                    steps: eigenResult.steps,
                    metadata: {
                        operation: 'matrix_eigenvectors',
                        computationTime: getHighResolutionTime() - startTime,
                        convergence: eigenResult.convergence
                    }
                };
            } catch (error) {
                this.performanceTracker.recordError('matrix_eigenvectors', error as Error);
                throw error;
            }
        },

        /**
         * Matrix power computation
         */
        power: (matrix: any, n: number) => {
            const startTime = getHighResolutionTime();
            try {
                const result = this.matrixEngine.power(matrix, n);
                this.performanceTracker.recordOperation('matrix_power', getHighResolutionTime() - startTime);
                return result;
            } catch (error) {
                this.performanceTracker.recordError('matrix_power', error as Error);
                throw error;
            }
        },

        /**
         * Matrix trace computation
         */
        trace: (matrix: any) => {
            const startTime = getHighResolutionTime();
            try {
                const result = this.matrixEngine.trace(matrix);
                this.performanceTracker.recordOperation('matrix_trace', getHighResolutionTime() - startTime);
                return result;
            } catch (error) {
                this.performanceTracker.recordError('matrix_trace', error as Error);
                throw error;
            }
        },

        /**
         * Matrix rank computation
         */
        rank: (matrix: any) => {
            const startTime = getHighResolutionTime();
            try {
                const result = this.matrixEngine.rank(matrix);
                this.performanceTracker.recordOperation('matrix_rank', getHighResolutionTime() - startTime);
                return result;
            } catch (error) {
                this.performanceTracker.recordError('matrix_rank', error as Error);
                throw error;
            }
        },

        /**
         * Solve linear system Ax = b
         */
        solve: (A: any, b: any) => {
            const startTime = getHighResolutionTime();
            try {
                const result = this.matrixEngine.solve(A, b);
                this.performanceTracker.recordOperation('matrix_solve', getHighResolutionTime() - startTime);
                return result;
            } catch (error) {
                this.performanceTracker.recordError('matrix_solve', error as Error);
                throw error;
            }
        }
    };

    /**
     * Comprehensive statistics and probability analysis
     */
    public readonly statistics = {
        /**
         * Compute descriptive statistics
         */
        descriptive: (data: number[]) => {
            const startTime = getHighResolutionTime();
            try {
                const result = this.statisticsEngine.descriptiveStats(data);
                this.performanceTracker.recordOperation('stats_descriptive', getHighResolutionTime() - startTime);
                return {
                    result,
                    metadata: {
                        computationTime: getHighResolutionTime() - startTime,
                        method: 'descriptive_statistics',
                        confidence: 1.0
                    }
                };
            } catch (error) {
                this.performanceTracker.recordError('stats_descriptive', error as Error);
                throw error;
            }
        },

        /**
         * Normal distribution calculations
         */
        normalDistribution: (x: number, mean = 0, stdDev = 1) => {
            const startTime = getHighResolutionTime();
            try {
                const result = this.statisticsEngine.normalDistribution(x, mean, stdDev);
                this.performanceTracker.recordOperation('stats_normal', getHighResolutionTime() - startTime);
                return result;
            } catch (error) {
                this.performanceTracker.recordError('stats_normal', error as Error);
                throw error;
            }
        },

        /**
         * Student's t-distribution
         */
        tDistribution: (x: number, df: number) => {
            const startTime = getHighResolutionTime();
            try {
                const result = this.statisticsEngine.tDistribution(x, df);
                this.performanceTracker.recordOperation('stats_t_distribution', getHighResolutionTime() - startTime);
                return result;
            } catch (error) {
                this.performanceTracker.recordError('stats_t_distribution', error as Error);
                throw error;
            }
        },

        /**
         * Chi-square distribution
         */
        chiSquareDistribution: (x: number, df: number) => {
            const startTime = getHighResolutionTime();
            try {
                const result = this.statisticsEngine.chiSquareDistribution(x, df);
                this.performanceTracker.recordOperation('stats_chi_square', getHighResolutionTime() - startTime);
                return result;
            } catch (error) {
                this.performanceTracker.recordError('stats_chi_square', error as Error);
                throw error;
            }
        },

        /**
         * One-sample t-test
         */
        oneSampleTTest: (sample: number[], populationMean: number, alpha = 0.05) => {
            const startTime = getHighResolutionTime();
            try {
                const result = this.statisticsEngine.oneSampleTTest(sample, populationMean, alpha);
                this.performanceTracker.recordOperation('stats_one_sample_t_test', getHighResolutionTime() - startTime);
                return result;
            } catch (error) {
                this.performanceTracker.recordError('stats_one_sample_t_test', error as Error);
                throw error;
            }
        },

        /**
         * Two-sample t-test
         */
        twoSampleTTest: (sample1: number[], sample2: number[], alpha = 0.05) => {
            const startTime = getHighResolutionTime();
            try {
                const result = this.statisticsEngine.twoSampleTTest(sample1, sample2, alpha);
                this.performanceTracker.recordOperation('stats_two_sample_t_test', getHighResolutionTime() - startTime);
                return result;
            } catch (error) {
                this.performanceTracker.recordError('stats_two_sample_t_test', error as Error);
                throw error;
            }
        },

        /**
         * Linear regression analysis
         */
        linearRegression: (x: number[], y: number[]) => {
            const startTime = getHighResolutionTime();
            try {
                const result = this.statisticsEngine.linearRegression(x, y);
                this.performanceTracker.recordOperation('stats_linear_regression', getHighResolutionTime() - startTime);
                return result;
            } catch (error) {
                this.performanceTracker.recordError('stats_linear_regression', error as Error);
                throw error;
            }
        },

        /**
         * ANOVA (Analysis of Variance)
         */
        anova: (groups: number[][]) => {
            const startTime = getHighResolutionTime();
            try {
                const result = this.statisticsEngine.anova(groups);
                this.performanceTracker.recordOperation('stats_anova', getHighResolutionTime() - startTime);
                return result;
            } catch (error) {
                this.performanceTracker.recordError('stats_anova', error as Error);
                throw error;
            }
        }
    };

    /**
     * Advanced caching operations
     */
    public readonly cache = {
        /**
         * Get cache statistics
         */
        getStats: () => {
            return this.intelligentCache.getStats();
        },

        /**
         * Get detailed cache information
         */
        getInfo: () => {
            return this.intelligentCache.getCacheInfo();
        },

        /**
         * Clear cache by type or all caches
         */
        clear: (type?: 'query' | 'computation' | 'ai') => {
            this.intelligentCache.clearCache(type);
        },

        /**
         * Optimize cache performance
         */
        optimize: async () => {
            await this.intelligentCache.optimizeCache();
        }
    };

    /**
     * Performance monitoring and analytics
     */
    public readonly performance = {
        /**
         * Get performance statistics
         */
        getStats: () => {
            return this.performanceTracker.getStats();
        },

        /**
         * Start performance profiling
         */
        startProfiling: () => {
            this.performanceTracker.startProfiling();
        },

        /**
         * Stop performance profiling and get results
         */
        stopProfiling: () => {
            return this.performanceTracker.stopProfiling();
        },

        /**
         * Reset performance tracking
         */
        reset: () => {
            this.performanceTracker.reset();
        }
    };
}

// Create default instance
const mathrok = new Mathrok();

// Export individual functions for convenience
export const solve = mathrok.solve;
export const nl = mathrok.nl;
export const parse = mathrok.parse;
export const explain = mathrok.explain;
export const derivative = mathrok.derivative;
export const integral = mathrok.integral;
export const factor = mathrok.factor;
export const expand = mathrok.expand;
export const simplify = mathrok.simplify;
export const evaluate = mathrok.evaluate;
// Export Phase 4 advanced features
export const matrix = mathrok.matrix;
export const statistics = mathrok.statistics;
export const cache = mathrok.cache;
export const performance = mathrok.performance;

// Export the main class and instance
export { Mathrok };
export default mathrok;

// Export types for TypeScript users
export type * from './types/index.js';

// Export version and metadata
export { VERSION, DEFAULT_FEATURE_FLAGS } from './types/index.js';