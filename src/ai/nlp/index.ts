/**
 * Natural Language Processing for mathematical expressions
 * Converts natural language queries to mathematical expressions
 */

import type {
    NLPInput,
    NLPOutput,
    NLPPattern,
    MathConfig,
} from '../../types/ai.js';
import { MathError, MathErrorType } from '../../types/core.js';

/**
 * Mathematical intent patterns
 */
const INTENT_PATTERNS: NLPPattern[] = [
    // Solving equations
    {
        id: 'solve_equation',
        pattern: /solve\s+(.+?)\s+for\s+(\w+)/i,
        intent: 'solve_equation',
        extractionRules: [
            {
                name: 'equation',
                pattern: /solve\s+(.+?)\s+for/i,
                entityType: 'EQUATION',
                transform: (value) => value.trim(),
            },
            {
                name: 'variable',
                pattern: /for\s+(\w+)/i,
                entityType: 'VARIABLE',
            },
        ],
        priority: 10,
    },

    // Derivatives
    {
        id: 'derivative',
        pattern: /(derivative|differentiate|d\/dx)\s+(.+)/i,
        intent: 'calculate_derivative',
        extractionRules: [
            {
                name: 'expression',
                pattern: /(derivative|differentiate|d\/dx)\s+(.+)/i,
                entityType: 'EXPRESSION',
                transform: (value) => value.replace(/^(derivative|differentiate|d\/dx)\s+/i, ''),
            },
        ],
        priority: 9,
    },

    // Integrals
    {
        id: 'integral',
        pattern: /(integral|integrate|∫)\s+(.+)/i,
        intent: 'calculate_integral',
        extractionRules: [
            {
                name: 'expression',
                pattern: /(integral|integrate|∫)\s+(.+)/i,
                entityType: 'EXPRESSION',
                transform: (value) => value.replace(/^(integral|integrate|∫)\s+/i, ''),
            },
        ],
        priority: 9,
    },

    // Simplification
    {
        id: 'simplify',
        pattern: /simplify\s+(.+)/i,
        intent: 'simplify_expression',
        extractionRules: [
            {
                name: 'expression',
                pattern: /simplify\s+(.+)/i,
                entityType: 'EXPRESSION',
            },
        ],
        priority: 8,
    },

    // Factoring
    {
        id: 'factor',
        pattern: /factor\s+(.+)/i,
        intent: 'factor_expression',
        extractionRules: [
            {
                name: 'expression',
                pattern: /factor\s+(.+)/i,
                entityType: 'EXPRESSION',
            },
        ],
        priority: 8,
    },

    // Expansion
    {
        id: 'expand',
        pattern: /expand\s+(.+)/i,
        intent: 'expand_expression',
        extractionRules: [
            {
                name: 'expression',
                pattern: /expand\s+(.+)/i,
                entityType: 'EXPRESSION',
            },
        ],
        priority: 8,
    },

    // Evaluation
    {
        id: 'evaluate',
        pattern: /(evaluate|calculate|compute)\s+(.+)/i,
        intent: 'evaluate_expression',
        extractionRules: [
            {
                name: 'expression',
                pattern: /(evaluate|calculate|compute)\s+(.+)/i,
                entityType: 'EXPRESSION',
                transform: (value) => value.replace(/^(evaluate|calculate|compute)\s+/i, ''),
            },
        ],
        priority: 7,
    },

    // Generic mathematical expression
    {
        id: 'expression',
        pattern: /^(.+)$/,
        intent: 'evaluate_expression',
        extractionRules: [
            {
                name: 'expression',
                pattern: /^(.+)$/,
                entityType: 'EXPRESSION',
            },
        ],
        priority: 1,
    },
];

/**
 * Mathematical term replacements
 */
const TERM_REPLACEMENTS: Record<string, string> = {
    // Numbers
    'zero': '0',
    'one': '1',
    'two': '2',
    'three': '3',
    'four': '4',
    'five': '5',
    'six': '6',
    'seven': '7',
    'eight': '8',
    'nine': '9',
    'ten': '10',

    // Operations
    'plus': '+',
    'minus': '-',
    'times': '*',
    'multiplied by': '*',
    'divided by': '/',
    'over': '/',
    'to the power of': '^',
    'squared': '^2',
    'cubed': '^3',
    'square root of': 'sqrt(',
    'sqrt': 'sqrt(',

    // Functions
    'sine': 'sin',
    'cosine': 'cos',
    'tangent': 'tan',
    'natural log': 'ln',
    'logarithm': 'log',

    // Constants
    'pi': 'π',
    'euler': 'e',
    'infinity': '∞',

    // Comparison
    'equals': '=',
    'is equal to': '=',
    'less than': '<',
    'greater than': '>',
    'less than or equal to': '≤',
    'greater than or equal to': '≥',
};

/**
 * NLP Processor implementation
 */
export class NLPProcessor {
    private readonly config: MathConfig;
    private readonly patterns: NLPPattern[];

    constructor(config: MathConfig) {
        this.config = config;
        this.patterns = [...INTENT_PATTERNS].sort((a, b) => b.priority - a.priority);
    }

    /**
     * Process natural language input
     */
    public async process(input: NLPInput): Promise<NLPOutput> {
        const startTime = performance.now();

        try {
            // Normalize the input text
            const normalizedText = this.normalizeText(input.text);

            // Replace mathematical terms
            const processedText = this.replaceMathematicalTerms(normalizedText);

            // Extract intent and entities
            const { intent, entities, expression, confidence } = this.extractIntentAndEntities(processedText);

            // Generate alternatives
            const alternatives = this.generateAlternatives(processedText, intent, confidence);

            const result: NLPOutput = {
                expression,
                intent,
                confidence,
                entities,
                alternatives,
                metadata: {
                    processingTime: performance.now() - startTime,
                    detectedLanguage: this.detectLanguage(input.text),
                    modelsUsed: ['rule_based_nlp'],
                    fallbackUsed: confidence < 0.7,
                    cacheHit: false,
                },
            };

            return result;
        } catch (error) {
            throw new MathError(
                MathErrorType.NLP_ERROR,
                `NLP processing failed: ${(error as Error).message}`,
                input.text
            );
        }
    }

    /**
     * Get supported languages
     */
    public getSupportedLanguages(): readonly string[] {
        return ['en', 'es', 'fr', 'de'] as const;
    }

    /**
     * Set processing language
     */
    public setLanguage(language: string): void {
        // Language setting would be implemented here
        console.log(`Language set to: ${language}`);
    }

    /**
     * Add custom pattern
     */
    public addPattern(pattern: NLPPattern): void {
        this.patterns.push(pattern);
        this.patterns.sort((a, b) => b.priority - a.priority);
    }

    /**
     * Remove custom pattern
     */
    public removePattern(id: string): void {
        const index = this.patterns.findIndex(p => p.id === id);
        if (index !== -1) {
            this.patterns.splice(index, 1);
        }
    }

    // Private helper methods

    private normalizeText(text: string): string {
        return text
            .toLowerCase()
            .trim()
            .replace(/\s+/g, ' ')
            .replace(/[""'']/g, '"')
            .replace(/[–—]/g, '-');
    }

    private replaceMathematicalTerms(text: string): string {
        let result = text;

        // Sort replacements by length (longest first) to avoid partial replacements
        const sortedReplacements = Object.entries(TERM_REPLACEMENTS)
            .sort(([a], [b]) => b.length - a.length);

        for (const [term, replacement] of sortedReplacements) {
            const regex = new RegExp(`\\b${term}\\b`, 'gi');
            result = result.replace(regex, replacement);
        }

        // Handle special cases
        result = result.replace(/(\w+)\s*\^\s*2/g, '$1²');
        result = result.replace(/(\w+)\s*\^\s*3/g, '$1³');
        result = result.replace(/sqrt\s*\(/g, '√(');

        return result;
    }

    private extractIntentAndEntities(text: string): {
        intent: string;
        entities: any[];
        expression: string;
        confidence: number;
    } {
        // Try each pattern in priority order
        for (const pattern of this.patterns) {
            const match = this.matchPattern(text, pattern);
            if (match) {
                return {
                    intent: pattern.intent,
                    entities: match.entities,
                    expression: match.expression,
                    confidence: match.confidence,
                };
            }
        }

        // Fallback: treat entire text as expression
        return {
            intent: 'evaluate_expression',
            entities: [
                {
                    type: 'EXPRESSION',
                    value: text,
                    position: { start: 0, end: text.length },
                    confidence: 0.5,
                },
            ],
            expression: text,
            confidence: 0.5,
        };
    }

    private matchPattern(text: string, pattern: NLPPattern): {
        entities: any[];
        expression: string;
        confidence: number;
    } | null {
        const regex = typeof pattern.pattern === 'string'
            ? new RegExp(pattern.pattern, 'i')
            : pattern.pattern;

        const match = text.match(regex);
        if (!match) {
            return null;
        }

        const entities: any[] = [];
        let expression = '';
        let confidence = 0.8;

        // Extract entities using extraction rules
        if (pattern.extractionRules) {
            for (const rule of pattern.extractionRules) {
                const ruleRegex = typeof rule.pattern === 'string'
                    ? new RegExp(rule.pattern, 'i')
                    : rule.pattern;

                const ruleMatch = text.match(ruleRegex);
                if (ruleMatch && ruleMatch[1]) {
                    let value = ruleMatch[1].trim();
                    if (rule.transform) {
                        value = rule.transform(value);
                    }

                    entities.push({
                        type: rule.entityType,
                        value,
                        position: { start: 0, end: value.length },
                        confidence: 0.9,
                    });

                    if (rule.entityType === 'EXPRESSION' || rule.entityType === 'EQUATION') {
                        expression = value;
                    }
                }
            }
        }

        // If no expression found, use the first capture group
        if (!expression && match[1]) {
            expression = match[1].trim();
        }

        return { entities, expression, confidence };
    }

    private generateAlternatives(text: string, primaryIntent: string, primaryConfidence: number): any[] {
        const alternatives: any[] = [];

        // Try other patterns with lower confidence
        for (const pattern of this.patterns) {
            if (pattern.intent === primaryIntent) {
                continue;
            }

            const match = this.matchPattern(text, pattern);
            if (match && match.confidence > 0.3) {
                alternatives.push({
                    expression: match.expression,
                    intent: pattern.intent,
                    confidence: match.confidence * 0.8, // Reduce confidence for alternatives
                    explanation: `Alternative interpretation as ${pattern.intent}`,
                });
            }
        }

        return alternatives.slice(0, 3); // Limit to top 3 alternatives
    }

    private detectLanguage(text: string): string {
        // Simplified language detection
        // In a real implementation, this would use proper language detection

        const spanishWords = ['resolver', 'derivada', 'integral', 'simplificar'];
        const frenchWords = ['résoudre', 'dérivée', 'intégrale', 'simplifier'];
        const germanWords = ['lösen', 'ableitung', 'integral', 'vereinfachen'];

        const lowerText = text.toLowerCase();

        if (spanishWords.some(word => lowerText.includes(word))) {
            return 'es';
        }

        if (frenchWords.some(word => lowerText.includes(word))) {
            return 'fr';
        }

        if (germanWords.some(word => lowerText.includes(word))) {
            return 'de';
        }

        return 'en'; // Default to English
    }
}