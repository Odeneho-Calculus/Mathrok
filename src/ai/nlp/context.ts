/**
 * Context Manager for Natural Language Processing
 * Handles conversation context, variable tracking, and multi-turn interactions
 */

export interface ConversationContext {
    variables: Record<string, any>;
    previousResults: any[];
    currentTopic: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    preferences: UserPreferences;
    history: QueryHistory[];
}

export interface UserPreferences {
    explanationStyle: 'concise' | 'detailed' | 'step-by-step';
    mathematicalNotation: 'standard' | 'latex' | 'plain';
    showSteps: boolean;
    showAlternatives: boolean;
    educationalMode: boolean;
}

export interface QueryHistory {
    query: string;
    result: any;
    timestamp: number;
    operation: string;
    confidence: number;
}

export interface ContextualHint {
    type: 'next_step' | 'alternative_method' | 'common_mistake' | 'concept_explanation';
    content: string;
    confidence: number;
    relevance: number;
}

/**
 * Context Manager for maintaining conversation state and providing contextual assistance
 */
export class ContextManager {
    private context: ConversationContext;
    private readonly maxHistorySize = 50;

    constructor(initialPreferences?: Partial<UserPreferences>) {
        this.context = {
            variables: {},
            previousResults: [],
            currentTopic: 'general',
            difficulty: 'intermediate',
            preferences: {
                explanationStyle: 'detailed',
                mathematicalNotation: 'standard',
                showSteps: true,
                showAlternatives: false,
                educationalMode: false,
                ...initialPreferences
            },
            history: []
        };
    }

    /**
     * Update context with new query and result
     */
    public updateContext(query: string, result: any, operation: string, confidence: number): void {
        // Add to history
        this.context.history.push({
            query,
            result,
            timestamp: Date.now(),
            operation,
            confidence
        });

        // Maintain history size limit
        if (this.context.history.length > this.maxHistorySize) {
            this.context.history = this.context.history.slice(-this.maxHistorySize);
        }

        // Update variables from result
        this.updateVariables(result);

        // Update current topic
        this.updateCurrentTopic(operation);

        // Store result for potential reference
        this.context.previousResults.push(result);
        if (this.context.previousResults.length > 10) {
            this.context.previousResults = this.context.previousResults.slice(-10);
        }
    }

    /**
     * Get contextual information for query processing
     */
    public getContextualInfo(): {
        variables: Record<string, any>;
        recentOperations: string[];
        currentTopic: string;
        suggestedVariables: string[];
    } {
        const recentOperations = this.context.history
            .slice(-5)
            .map(h => h.operation);

        const suggestedVariables = this.getSuggestedVariables();

        return {
            variables: this.context.variables,
            recentOperations,
            currentTopic: this.context.currentTopic,
            suggestedVariables
        };
    }

    /**
     * Generate contextual hints based on current state
     */
    public generateContextualHints(currentQuery: string, currentOperation: string): ContextualHint[] {
        const hints: ContextualHint[] = [];

        // Next step suggestions
        const nextStepHint = this.generateNextStepHint(currentOperation);
        if (nextStepHint) {
            hints.push(nextStepHint);
        }

        // Alternative method suggestions
        const alternativeHint = this.generateAlternativeMethodHint(currentOperation);
        if (alternativeHint) {
            hints.push(alternativeHint);
        }

        // Common mistake warnings
        const mistakeHint = this.generateCommonMistakeHint(currentQuery, currentOperation);
        if (mistakeHint) {
            hints.push(mistakeHint);
        }

        // Concept explanations
        const conceptHint = this.generateConceptExplanationHint(currentOperation);
        if (conceptHint) {
            hints.push(conceptHint);
        }

        return hints.sort((a, b) => b.relevance - a.relevance);
    }

    /**
     * Check if query references previous results
     */
    public resolveReferences(query: string): string {
        let resolvedQuery = query;

        // Replace references like "the result", "that", "it"
        const referencePatterns = [
            { pattern: /\bthe result\b/gi, replacement: this.getLastResultString() },
            { pattern: /\bthat\b/gi, replacement: this.getLastResultString() },
            { pattern: /\bit\b/gi, replacement: this.getLastResultString() },
            { pattern: /\bthe answer\b/gi, replacement: this.getLastResultString() },
            { pattern: /\bthe solution\b/gi, replacement: this.getLastResultString() }
        ];

        referencePatterns.forEach(({ pattern, replacement }) => {
            if (replacement && pattern.test(resolvedQuery)) {
                resolvedQuery = resolvedQuery.replace(pattern, replacement);
            }
        });

        return resolvedQuery;
    }

    /**
     * Get learning progression suggestions
     */
    public getLearningProgression(currentOperation: string): {
        prerequisites: string[];
        nextTopics: string[];
        practiceProblems: string[];
    } {
        const progressionMap: Record<string, any> = {
            'derivative': {
                prerequisites: ['algebra', 'functions', 'limits'],
                nextTopics: ['chain_rule', 'product_rule', 'quotient_rule', 'implicit_differentiation'],
                practiceProblems: [
                    'Find the derivative of x^3',
                    'Differentiate sin(x)',
                    'Find d/dx of e^x'
                ]
            },
            'integral': {
                prerequisites: ['derivative', 'algebra', 'functions'],
                nextTopics: ['integration_by_parts', 'substitution', 'partial_fractions'],
                practiceProblems: [
                    'Integrate x^2',
                    'Find the antiderivative of cos(x)',
                    'Evaluate ∫ e^x dx'
                ]
            },
            'solve': {
                prerequisites: ['algebra', 'equations'],
                nextTopics: ['quadratic_formula', 'systems_of_equations', 'polynomial_equations'],
                practiceProblems: [
                    'Solve x + 5 = 10',
                    'Solve x^2 - 4 = 0',
                    'Solve 2x + 3 = 7'
                ]
            },
            'factor': {
                prerequisites: ['algebra', 'polynomials'],
                nextTopics: ['quadratic_factoring', 'difference_of_squares', 'grouping'],
                practiceProblems: [
                    'Factor x^2 - 9',
                    'Factor x^2 + 5x + 6',
                    'Factor 2x^2 + 8x'
                ]
            }
        };

        return progressionMap[currentOperation] || {
            prerequisites: [],
            nextTopics: [],
            practiceProblems: []
        };
    }

    /**
     * Update user preferences
     */
    public updatePreferences(preferences: Partial<UserPreferences>): void {
        this.context.preferences = { ...this.context.preferences, ...preferences };
    }

    /**
     * Get current context state
     */
    public getContext(): ConversationContext {
        return { ...this.context };
    }

    /**
     * Reset context (new conversation)
     */
    public resetContext(): void {
        this.context = {
            variables: {},
            previousResults: [],
            currentTopic: 'general',
            difficulty: this.context.difficulty, // Preserve difficulty level
            preferences: this.context.preferences, // Preserve preferences
            history: []
        };
    }

    // Private helper methods

    private updateVariables(result: any): void {
        if (result && typeof result === 'object') {
            // Extract variables from solve results
            if (result.result && Array.isArray(result.result)) {
                result.result.forEach((solution: any) => {
                    if (solution.variable && solution.value) {
                        this.context.variables[solution.variable] = solution.value;
                    }
                });
            }

            // Extract variables from evaluation results
            if (result.variables) {
                Object.assign(this.context.variables, result.variables);
            }
        }
    }

    private updateCurrentTopic(operation: string): void {
        const topicMap: Record<string, string> = {
            'derivative': 'calculus',
            'integral': 'calculus',
            'limit': 'calculus',
            'taylorSeries': 'calculus',
            'solve': 'algebra',
            'factor': 'algebra',
            'expand': 'algebra',
            'simplify': 'algebra',
            'solveTrigonometric': 'trigonometry',
            'convertTrigUnits': 'trigonometry',
            'evaluateSpecialAngles': 'trigonometry'
        };

        this.context.currentTopic = topicMap[operation] || 'general';
    }

    private getSuggestedVariables(): string[] {
        const topicVariables: Record<string, string[]> = {
            'calculus': ['x', 't', 'u'],
            'algebra': ['x', 'y', 'z'],
            'trigonometry': ['θ', 'x', 'α'],
            'geometry': ['x', 'y', 'r', 'θ'],
            'general': ['x', 'y']
        };

        return topicVariables[this.context.currentTopic] || ['x'];
    }

    private generateNextStepHint(operation: string): ContextualHint | null {
        const nextStepMap: Record<string, string> = {
            'derivative': 'Consider finding critical points by setting the derivative equal to zero',
            'integral': 'You might want to evaluate this as a definite integral with specific bounds',
            'factor': 'After factoring, you could solve the equation by setting each factor to zero',
            'solve': 'Verify your solution by substituting back into the original equation',
            'expand': 'Consider simplifying the expanded form by combining like terms',
            'simplify': 'Check if the simplified form can be factored further'
        };

        const content = nextStepMap[operation];
        if (!content) return null;

        return {
            type: 'next_step',
            content,
            confidence: 0.8,
            relevance: 0.9
        };
    }

    private generateAlternativeMethodHint(operation: string): ContextualHint | null {
        const alternativeMap: Record<string, string> = {
            'derivative': 'Alternative: Use the definition of derivative with limits',
            'integral': 'Alternative: Try integration by parts or substitution method',
            'solve': 'Alternative: Use the quadratic formula or graphical method',
            'factor': 'Alternative: Try grouping or use the AC method',
            'limit': 'Alternative: Use L\'Hôpital\'s rule for indeterminate forms'
        };

        const content = alternativeMap[operation];
        if (!content) return null;

        return {
            type: 'alternative_method',
            content,
            confidence: 0.7,
            relevance: 0.6
        };
    }

    private generateCommonMistakeHint(query: string, operation: string): ContextualHint | null {
        const mistakeMap: Record<string, string> = {
            'derivative': 'Common mistake: Don\'t forget the chain rule for composite functions',
            'integral': 'Common mistake: Remember to add the constant of integration (+C)',
            'solve': 'Common mistake: Check for extraneous solutions when solving radical equations',
            'factor': 'Common mistake: Always check if factors can be factored further',
            'simplify': 'Common mistake: Don\'t cancel terms that aren\'t common factors'
        };

        const content = mistakeMap[operation];
        if (!content) return null;

        return {
            type: 'common_mistake',
            content,
            confidence: 0.9,
            relevance: 0.8
        };
    }

    private generateConceptExplanationHint(operation: string): ContextualHint | null {
        const conceptMap: Record<string, string> = {
            'derivative': 'Concept: The derivative represents the rate of change or slope of a function',
            'integral': 'Concept: Integration is the reverse process of differentiation',
            'limit': 'Concept: Limits describe the behavior of functions as inputs approach specific values',
            'factor': 'Concept: Factoring breaks down expressions into simpler multiplicative components',
            'solve': 'Concept: Solving finds the values that make an equation true'
        };

        const content = conceptMap[operation];
        if (!content) return null;

        return {
            type: 'concept_explanation',
            content,
            confidence: 0.8,
            relevance: 0.7
        };
    }

    private getLastResultString(): string | null {
        if (this.context.previousResults.length === 0) return null;

        const lastResult = this.context.previousResults[this.context.previousResults.length - 1];

        if (typeof lastResult === 'object' && lastResult.result) {
            return lastResult.result.toString();
        }

        return lastResult?.toString() || null;
    }
}