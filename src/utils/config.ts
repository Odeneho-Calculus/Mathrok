/**
 * Configuration manager for Mathrok library
 * Handles library configuration and settings
 */

import type { MathConfig, FunctionDefinition } from '../types/core.js';
import { DEFAULT_PRECISION, DEFAULT_TIMEOUT, MAX_EXPRESSION_LENGTH, MAX_VARIABLES, MAX_STEPS } from '../types/index.js';

/**
 * Default configuration values
 */
const DEFAULT_CONFIG: MathConfig = {
    precision: DEFAULT_PRECISION,
    timeout: DEFAULT_TIMEOUT,
    exact: true,
    autoSimplify: true,
    showSteps: true,
    maxSteps: MAX_STEPS,
    useCache: true,
    maxExpressionLength: MAX_EXPRESSION_LENGTH,
    maxVariables: MAX_VARIABLES,
    maxComplexity: 1000,
} as const;

/**
 * Configuration manager class
 */
export class ConfigManager {
    private config: MathConfig;
    private readonly customFunctions: Map<string, FunctionDefinition>;

    constructor(initialConfig?: Partial<MathConfig>) {
        this.config = { ...DEFAULT_CONFIG, ...initialConfig };
        this.customFunctions = new Map();
    }

    /**
     * Get current configuration
     */
    public get(): MathConfig {
        return { ...this.config };
    }

    /**
     * Set configuration values
     */
    public set(newConfig: Partial<MathConfig>): void {
        // Validate configuration values
        const validatedConfig = this.validateConfig(newConfig);

        // Merge with existing configuration
        this.config = { ...this.config, ...validatedConfig };
    }

    /**
     * Reset configuration to defaults
     */
    public reset(): void {
        this.config = { ...DEFAULT_CONFIG };
        this.customFunctions.clear();
    }

    /**
     * Get a specific configuration value
     */
    public getValue<K extends keyof MathConfig>(key: K): MathConfig[K] {
        return this.config[key];
    }

    /**
     * Set a specific configuration value
     */
    public setValue<K extends keyof MathConfig>(key: K, value: MathConfig[K]): void {
        const partialConfig = { [key]: value } as Partial<MathConfig>;
        this.set(partialConfig);
    }

    /**
     * Add a custom function definition
     */
    public addFunction(definition: FunctionDefinition): void {
        // Validate function definition
        this.validateFunctionDefinition(definition);

        // Add to custom functions
        this.customFunctions.set(definition.name.toLowerCase(), definition);
    }

    /**
     * Remove a custom function
     */
    public removeFunction(name: string): void {
        this.customFunctions.delete(name.toLowerCase());
    }

    /**
     * Get a custom function definition
     */
    public getFunction(name: string): FunctionDefinition | undefined {
        return this.customFunctions.get(name.toLowerCase());
    }

    /**
     * Get all custom functions
     */
    public getAllFunctions(): FunctionDefinition[] {
        return Array.from(this.customFunctions.values());
    }

    /**
     * Check if a function is defined
     */
    public hasFunction(name: string): boolean {
        return this.customFunctions.has(name.toLowerCase());
    }

    /**
     * Get configuration as JSON string
     */
    public toJSON(): string {
        return JSON.stringify({
            config: this.config,
            customFunctions: Array.from(this.customFunctions.entries()),
        }, null, 2);
    }

    /**
     * Load configuration from JSON string
     */
    public fromJSON(json: string): void {
        try {
            const data = JSON.parse(json);

            if (data.config) {
                this.set(data.config);
            }

            if (data.customFunctions && Array.isArray(data.customFunctions)) {
                this.customFunctions.clear();
                for (const [name, definition] of data.customFunctions) {
                    if (typeof name === 'string' && this.isValidFunctionDefinition(definition)) {
                        this.customFunctions.set(name, definition);
                    }
                }
            }
        } catch (error) {
            throw new Error(`Failed to load configuration from JSON: ${(error as Error).message}`);
        }
    }

    /**
     * Create a scoped configuration
     */
    public createScope(overrides: Partial<MathConfig>): ConfigManager {
        const scopedConfig = { ...this.config, ...overrides };
        const scopedManager = new ConfigManager(scopedConfig);

        // Copy custom functions to scoped manager
        for (const [name, definition] of this.customFunctions) {
            scopedManager.customFunctions.set(name, definition);
        }

        return scopedManager;
    }

    /**
     * Validate configuration values
     */
    private validateConfig(config: Partial<MathConfig>): Partial<MathConfig> {
        const validated: Partial<MathConfig> = {};

        // Validate precision
        if (config.precision !== undefined) {
            if (typeof config.precision !== 'number' ||
                config.precision < 1 ||
                config.precision > 100) {
                throw new Error('Precision must be a number between 1 and 100');
            }
            validated.precision = Math.floor(config.precision);
        }

        // Validate timeout
        if (config.timeout !== undefined) {
            if (typeof config.timeout !== 'number' ||
                config.timeout < 1000 ||
                config.timeout > 300000) {
                throw new Error('Timeout must be a number between 1000 and 300000 milliseconds');
            }
            validated.timeout = config.timeout;
        }

        // Validate boolean values
        const booleanKeys: (keyof MathConfig)[] = ['exact', 'autoSimplify', 'showSteps', 'useCache'];
        for (const key of booleanKeys) {
            if (config[key] !== undefined) {
                if (typeof config[key] !== 'boolean') {
                    throw new Error(`${key} must be a boolean value`);
                }
                (validated as any)[key] = config[key];
            }
        }

        // Validate maxSteps
        if (config.maxSteps !== undefined) {
            if (typeof config.maxSteps !== 'number' ||
                config.maxSteps < 1 ||
                config.maxSteps > 10000) {
                throw new Error('maxSteps must be a number between 1 and 10000');
            }
            validated.maxSteps = Math.floor(config.maxSteps);
        }

        // Validate maxExpressionLength
        if (config.maxExpressionLength !== undefined) {
            if (typeof config.maxExpressionLength !== 'number' ||
                config.maxExpressionLength < 1 ||
                config.maxExpressionLength > 100000) {
                throw new Error('maxExpressionLength must be a number between 1 and 100000');
            }
            validated.maxExpressionLength = Math.floor(config.maxExpressionLength);
        }

        // Validate maxVariables
        if (config.maxVariables !== undefined) {
            if (typeof config.maxVariables !== 'number' ||
                config.maxVariables < 1 ||
                config.maxVariables > 1000) {
                throw new Error('maxVariables must be a number between 1 and 1000');
            }
            validated.maxVariables = Math.floor(config.maxVariables);
        }

        // Validate maxComplexity
        if (config.maxComplexity !== undefined) {
            if (typeof config.maxComplexity !== 'number' ||
                config.maxComplexity < 1 ||
                config.maxComplexity > 100000) {
                throw new Error('maxComplexity must be a number between 1 and 100000');
            }
            validated.maxComplexity = Math.floor(config.maxComplexity);
        }

        return validated;
    }

    /**
     * Validate function definition
     */
    private validateFunctionDefinition(definition: FunctionDefinition): void {
        if (!definition.name || typeof definition.name !== 'string') {
            throw new Error('Function name must be a non-empty string');
        }

        if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(definition.name)) {
            throw new Error('Function name must start with a letter and contain only letters, numbers, and underscores');
        }

        if (!Array.isArray(definition.parameters)) {
            throw new Error('Function parameters must be an array');
        }

        for (const param of definition.parameters) {
            if (typeof param !== 'string' || !/^[a-zA-Z][a-zA-Z0-9_]*$/.test(param)) {
                throw new Error('Function parameters must be valid identifiers');
            }
        }

        if (typeof definition.body !== 'string' && typeof definition.body !== 'function') {
            throw new Error('Function body must be a string or function');
        }

        if (typeof definition.body === 'function') {
            // Validate function signature
            if (definition.body.length !== definition.parameters.length) {
                throw new Error('Function body parameter count must match parameter definition');
            }
        }
    }

    /**
     * Check if object is a valid function definition
     */
    private isValidFunctionDefinition(obj: any): obj is FunctionDefinition {
        return obj &&
            typeof obj.name === 'string' &&
            Array.isArray(obj.parameters) &&
            obj.parameters.every((p: any) => typeof p === 'string') &&
            (typeof obj.body === 'string' || typeof obj.body === 'function');
    }

    /**
     * Get default configuration
     */
    public static getDefaults(): MathConfig {
        return { ...DEFAULT_CONFIG };
    }

    /**
     * Merge multiple configurations
     */
    public static merge(...configs: Partial<MathConfig>[]): MathConfig {
        return configs.reduce((merged, config) => ({ ...merged, ...config }), DEFAULT_CONFIG);
    }

    /**
     * Create configuration from environment variables
     */
    public static fromEnvironment(): Partial<MathConfig> {
        const config: Partial<MathConfig> = {};

        // Check for environment variables (Node.js only)
        if (typeof process !== 'undefined' && process.env) {
            const env = process.env;

            if (env.MATHROK_PRECISION) {
                const precision = parseInt(env.MATHROK_PRECISION, 10);
                if (!isNaN(precision)) {
                    config.precision = precision;
                }
            }

            if (env.MATHROK_TIMEOUT) {
                const timeout = parseInt(env.MATHROK_TIMEOUT, 10);
                if (!isNaN(timeout)) {
                    config.timeout = timeout;
                }
            }

            if (env.MATHROK_EXACT) {
                config.exact = env.MATHROK_EXACT.toLowerCase() === 'true';
            }

            if (env.MATHROK_AUTO_SIMPLIFY) {
                config.autoSimplify = env.MATHROK_AUTO_SIMPLIFY.toLowerCase() === 'true';
            }

            if (env.MATHROK_SHOW_STEPS) {
                config.showSteps = env.MATHROK_SHOW_STEPS.toLowerCase() === 'true';
            }

            if (env.MATHROK_USE_CACHE) {
                config.useCache = env.MATHROK_USE_CACHE.toLowerCase() === 'true';
            }
        }

        return config;
    }
}