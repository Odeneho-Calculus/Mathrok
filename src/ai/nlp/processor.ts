/**
 * Enhanced Natural Language Processor
 * Advanced NLP capabilities for mathematical query processing
 */

import {
    MATHEMATICAL_PHRASES,
    OPERATION_SYNONYMS,
    MATHEMATICAL_CONTEXTS,
    COMMON_VARIABLES,
    MATHEMATICAL_CONSTANTS,
    type MathematicalPhrase,
    type IntentRecognition
} from './dictionary.js';

export interface NLToken {
    text: string;
    type: 'operation' | 'expression' | 'variable' | 'number' | 'constant' | 'connector' | 'unknown';
    confidence: number;
    position: number;
    context?: string;
}

export interface NLEntity {
    type: 'expression' | 'variable' | 'number' | 'constant' | 'bounds';
    value: string;
    confidence: number;
    position: number;
    context?: string;
}

export interface NLResult {
    originalQuery: string;
    interpretation: IntentRecognition;
    expression?: string;
    parameters: Record<string, any>;
    confidence: number;
    alternatives: IntentRecognition[];
    tokens: NLToken[];
    entities: NLEntity[];
    isMultiStep: boolean;
    steps?: NLResult[];
}

export interface MultiStepResult {
    originalQuery: string;
    steps: NLResult[];
    finalResult: any;
    overallConfidence: number;
}

/**
 * Advanced Natural Language Processor for mathematical queries
 */
export class NaturalLanguageProcessor {
    private readonly phrasePatterns: Map<RegExp, MathematicalPhrase>;
    private readonly operationSynonyms: Map<string, string[]>;
    private readonly contextKeywords: Map<string, string[]>;

    constructor() {
        this.phrasePatterns = this.compilePhrasePatterns();
        this.operationSynonyms = new Map(Object.entries(OPERATION_SYNONYMS));
        this.contextKeywords = new Map(Object.entries(MATHEMATICAL_CONTEXTS));
    }

    /**
     * Process a natural language mathematical query
     */
    public async processAdvanced(query: string): Promise<NLResult> {
        try {
            // 1. Preprocess and clean the query
            const cleanQuery = this.preprocessQuery(query);

            // 2. Check for multi-step queries
            if (this.isMultiStepQuery(cleanQuery)) {
                return await this.processMultiStep(cleanQuery);
            }

            // 3. Tokenize the query
            const tokens = this.tokenize(cleanQuery);

            // 4. Extract entities (expressions, variables, numbers)
            const entities = this.extractEntities(tokens, cleanQuery);

            // 5. Recognize intent with confidence scoring
            const intent = this.recognizeIntent(tokens, entities, cleanQuery);

            // 6. Generate alternatives
            const alternatives = this.generateAlternatives(tokens, entities, cleanQuery);

            // 7. Extract parameters for the operation
            const parameters = this.extractParameters(intent, entities, cleanQuery);

            return {
                originalQuery: query,
                interpretation: intent,
                expression: this.extractMainExpression(entities),
                parameters,
                confidence: intent.confidence,
                alternatives,
                tokens,
                entities,
                isMultiStep: false
            };
        } catch (error) {
            throw new Error(`Natural language processing failed: ${(error as Error).message}`);
        }
    }

    /**
     * Process multi-step mathematical queries
     */
    public async processMultiStep(query: string): Promise<NLResult> {
        const steps = this.decomposeMultiStepQuery(query);
        const stepResults: NLResult[] = [];

        for (const step of steps) {
            const stepResult = await this.processAdvanced(step);
            stepResults.push(stepResult);
        }

        // Determine overall confidence
        const overallConfidence = stepResults.reduce((sum, step) => sum + step.confidence, 0) / stepResults.length;

        return {
            originalQuery: query,
            interpretation: {
                operation: 'multi_step',
                confidence: overallConfidence,
                parameters: { steps: stepResults.map(s => s.interpretation) },
                context: 'multi_step',
                alternatives: []
            },
            parameters: { steps: stepResults },
            confidence: overallConfidence,
            alternatives: [],
            tokens: [],
            entities: [],
            isMultiStep: true,
            steps: stepResults
        };
    }

    // Private helper methods

    private compilePhrasePatterns(): Map<RegExp, MathematicalPhrase> {
        const patterns = new Map<RegExp, MathematicalPhrase>();

        for (const [phrase, data] of Object.entries(MATHEMATICAL_PHRASES)) {
            // Create flexible regex patterns for each phrase
            const escapedPhrase = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const flexiblePattern = escapedPhrase
                .replace(/\s+/g, '\\s+')
                .replace(/\\s\+/g, '\\s*');

            const regex = new RegExp(`\\b${flexiblePattern}\\b`, 'i');
            patterns.set(regex, data);
        }

        return patterns;
    }

    private preprocessQuery(query: string): string {
        return query
            .toLowerCase()
            .trim()
            // Normalize mathematical symbols
            .replace(/\bpi\b/g, 'π')
            .replace(/\binfinity\b/g, '∞')
            .replace(/\beuler\b/g, 'e')
            // Normalize spacing around operators
            .replace(/\s*([+\-*/^=])\s*/g, ' $1 ')
            // Normalize parentheses spacing
            .replace(/\s*([()])\s*/g, '$1')
            // Remove extra whitespace
            .replace(/\s+/g, ' ');
    }

    private isMultiStepQuery(query: string): boolean {
        const multiStepIndicators = [
            'first', 'then', 'next', 'after that', 'finally',
            'step 1', 'step 2', 'step one', 'step two',
            'and then', 'followed by', 'subsequently'
        ];

        return multiStepIndicators.some(indicator =>
            query.includes(indicator)
        );
    }

    private decomposeMultiStepQuery(query: string): string[] {
        const stepSeparators = [
            /\bfirst\b/i, /\bthen\b/i, /\bnext\b/i, /\bafter that\b/i,
            /\bfinally\b/i, /\bstep \d+\b/i, /\band then\b/i
        ];

        let steps = [query];

        for (const separator of stepSeparators) {
            const newSteps: string[] = [];
            for (const step of steps) {
                const parts = step.split(separator);
                newSteps.push(...parts.filter(part => part.trim().length > 0));
            }
            steps = newSteps;
        }

        return steps.map(step => step.trim()).filter(step => step.length > 0);
    }

    private tokenize(query: string): NLToken[] {
        const tokens: NLToken[] = [];
        const words = query.split(/\s+/);

        words.forEach((word, index) => {
            const token = this.classifyToken(word, index);
            if (token) {
                tokens.push(token);
            }
        });

        return tokens;
    }

    private classifyToken(word: string, position: number): NLToken | null {
        if (!word.trim()) return null;

        // Check for mathematical operations
        for (const [pattern, phrase] of this.phrasePatterns) {
            if (pattern.test(word)) {
                return {
                    text: word,
                    type: 'operation',
                    confidence: phrase.confidence,
                    position,
                    context: phrase.context
                };
            }
        }

        // Check for numbers
        if (/^-?\d+(\.\d+)?$/.test(word)) {
            return {
                text: word,
                type: 'number',
                confidence: 1.0,
                position
            };
        }

        // Check for variables
        if (/^[a-zA-Z]$/.test(word) || Object.keys(COMMON_VARIABLES).includes(word)) {
            return {
                text: word,
                type: 'variable',
                confidence: 0.9,
                position,
                context: COMMON_VARIABLES[word]?.[0]
            };
        }

        // Check for mathematical constants
        if (Object.keys(MATHEMATICAL_CONSTANTS).includes(word)) {
            return {
                text: word,
                type: 'constant',
                confidence: 1.0,
                position,
                context: MATHEMATICAL_CONSTANTS[word].context
            };
        }

        // Check for mathematical expressions (basic patterns)
        if (/[+\-*/^()=]/.test(word) || /\w+\([^)]*\)/.test(word)) {
            return {
                text: word,
                type: 'expression',
                confidence: 0.8,
                position
            };
        }

        // Connectors and common words
        const connectors = ['of', 'the', 'with', 'respect', 'to', 'from', 'at', 'in'];
        if (connectors.includes(word)) {
            return {
                text: word,
                type: 'connector',
                confidence: 0.7,
                position
            };
        }

        return {
            text: word,
            type: 'unknown',
            confidence: 0.3,
            position
        };
    }

    private extractEntities(tokens: NLToken[], query: string): NLEntity[] {
        const entities: NLEntity[] = [];

        // Extract mathematical expressions using regex patterns
        const expressionPatterns = [
            /[a-zA-Z]\^?\d*/g,  // Variables with optional exponents
            /\d+(\.\d+)?/g,     // Numbers
            /[a-zA-Z]+\([^)]*\)/g, // Functions
            /\([^)]+\)/g,       // Parenthetical expressions
            /[a-zA-Z]\s*[+\-*/^]\s*[a-zA-Z0-9]/g // Simple algebraic expressions
        ];

        expressionPatterns.forEach(pattern => {
            const matches = query.match(pattern);
            if (matches) {
                matches.forEach(match => {
                    const entity = this.classifyEntity(match.trim());
                    if (entity) {
                        entities.push(entity);
                    }
                });
            }
        });

        // Remove duplicates
        const uniqueEntities = entities.filter((entity, index, self) =>
            index === self.findIndex(e => e.value === entity.value && e.type === entity.type)
        );

        return uniqueEntities;
    }

    private classifyEntity(text: string): NLEntity | null {
        if (!text.trim()) return null;

        // Numbers
        if (/^-?\d+(\.\d+)?$/.test(text)) {
            return {
                type: 'number',
                value: text,
                confidence: 1.0,
                position: 0
            };
        }

        // Variables
        if (/^[a-zA-Z]$/.test(text)) {
            return {
                type: 'variable',
                value: text,
                confidence: 0.9,
                position: 0,
                context: COMMON_VARIABLES[text]?.[0]
            };
        }

        // Constants
        if (Object.keys(MATHEMATICAL_CONSTANTS).includes(text)) {
            return {
                type: 'constant',
                value: MATHEMATICAL_CONSTANTS[text].value,
                confidence: 1.0,
                position: 0,
                context: MATHEMATICAL_CONSTANTS[text].context
            };
        }

        // Complex expressions
        if (/[+\-*/^()=]/.test(text) || /\w+\([^)]*\)/.test(text)) {
            return {
                type: 'expression',
                value: text,
                confidence: 0.8,
                position: 0
            };
        }

        return null;
    }

    private recognizeIntent(tokens: NLToken[], entities: NLEntity[], query: string): IntentRecognition {
        let bestMatch: IntentRecognition = {
            operation: 'unknown',
            confidence: 0,
            parameters: {},
            context: 'general',
            alternatives: []
        };

        // Check phrase patterns
        for (const [pattern, phrase] of this.phrasePatterns) {
            if (pattern.test(query)) {
                if (phrase.confidence > bestMatch.confidence) {
                    bestMatch = {
                        operation: phrase.operation,
                        confidence: phrase.confidence,
                        parameters: this.extractParametersFromPhrase(phrase, entities),
                        context: phrase.context || 'general',
                        alternatives: []
                    };
                }
            }
        }

        // Boost confidence based on context consistency
        const contextScore = this.calculateContextScore(tokens, bestMatch.context);
        bestMatch.confidence = Math.min(1.0, bestMatch.confidence * (1 + contextScore * 0.2));

        return bestMatch;
    }

    private extractParametersFromPhrase(phrase: MathematicalPhrase, entities: NLEntity[]): Record<string, any> {
        const parameters: Record<string, any> = {};

        if (phrase.parameters) {
            phrase.parameters.forEach(param => {
                switch (param) {
                    case 'expression':
                        const expr = entities.find(e => e.type === 'expression');
                        if (expr) parameters.expression = expr.value;
                        break;
                    case 'variable':
                        const variable = entities.find(e => e.type === 'variable');
                        if (variable) parameters.variable = variable.value;
                        break;
                    case 'lowerBound':
                    case 'upperBound':
                        const bounds = entities.filter(e => e.type === 'number');
                        if (bounds.length >= 2) {
                            parameters.lowerBound = bounds[0].value;
                            parameters.upperBound = bounds[1].value;
                        }
                        break;
                }
            });
        }

        return parameters;
    }

    private calculateContextScore(tokens: NLToken[], context: string): number {
        const contextKeywords = this.contextKeywords.get(context) || [];
        const matchingTokens = tokens.filter(token =>
            contextKeywords.some(keyword =>
                token.text.includes(keyword) || token.context === context
            )
        );

        return matchingTokens.length / Math.max(tokens.length, 1);
    }

    private generateAlternatives(tokens: NLToken[], entities: NLEntity[], query: string): IntentRecognition[] {
        const alternatives: IntentRecognition[] = [];

        // Generate alternatives based on operation synonyms
        for (const [operation, synonyms] of this.operationSynonyms) {
            if (synonyms.some(synonym => query.includes(synonym))) {
                alternatives.push({
                    operation,
                    confidence: 0.7,
                    parameters: {},
                    context: 'general',
                    alternatives: []
                });
            }
        }

        return alternatives.slice(0, 3); // Limit to top 3 alternatives
    }

    private extractParameters(intent: IntentRecognition, entities: NLEntity[], query: string): Record<string, any> {
        const parameters: Record<string, any> = { ...intent.parameters };

        // Extract common parameters
        const expressions = entities.filter(e => e.type === 'expression');
        const variables = entities.filter(e => e.type === 'variable');
        const numbers = entities.filter(e => e.type === 'number');

        if (expressions.length > 0) {
            parameters.expression = expressions[0].value;
        }

        if (variables.length > 0) {
            parameters.variable = variables[0].value;
        }

        if (numbers.length > 0) {
            parameters.numbers = numbers.map(n => n.value);
        }

        // Operation-specific parameter extraction
        switch (intent.operation) {
            case 'limit':
                if (query.includes('approaches')) {
                    const approachMatch = query.match(/approaches\s+([^\s]+)/);
                    if (approachMatch) {
                        parameters.approach = approachMatch[1];
                    }
                }
                break;

            case 'taylorSeries':
                const orderMatch = query.match(/order\s+(\d+)/);
                if (orderMatch) {
                    parameters.order = parseInt(orderMatch[1]);
                }
                const centerMatch = query.match(/around\s+([^\s]+)/);
                if (centerMatch) {
                    parameters.center = centerMatch[1];
                }
                break;

            case 'convertTrigUnits':
                if (query.includes('radians')) {
                    parameters.fromUnit = 'degrees';
                    parameters.toUnit = 'radians';
                } else if (query.includes('degrees')) {
                    parameters.fromUnit = 'radians';
                    parameters.toUnit = 'degrees';
                }
                break;
        }

        return parameters;
    }

    private extractMainExpression(entities: NLEntity[]): string | undefined {
        const expressions = entities.filter(e => e.type === 'expression');
        return expressions.length > 0 ? expressions[0].value : undefined;
    }
}