/**
 * Mathematical explanation generator
 * Generates step-by-step explanations for mathematical operations
 */

import type {
    ExplanationInput,
    ExplanationOutput,
    ExplanationStyle,
    EducationLevel,
} from '../../types/ai.js';
import { MathError, MathErrorType } from '../../types/core.js';

/**
 * Explanation templates for different operations
 */
const EXPLANATION_TEMPLATES: Record<string, Record<ExplanationStyle, string[]>> = {
    solve: {
        CONCISE: [
            'Isolate the variable by performing inverse operations.',
            'Apply algebraic manipulation to solve for the unknown.',
        ],
        DETAILED: [
            'To solve this equation, we need to isolate the variable on one side.',
            'We will use inverse operations to undo what has been done to the variable.',
            'Each step maintains the equality by performing the same operation on both sides.',
        ],
        STEP_BY_STEP: [
            'Step 1: Identify the variable to solve for',
            'Step 2: Identify operations applied to the variable',
            'Step 3: Apply inverse operations in reverse order',
            'Step 4: Simplify to get the final answer',
        ],
        CONCEPTUAL: [
            'Solving equations is about finding the value that makes the equation true.',
            'We use the balance principle: whatever we do to one side, we must do to the other.',
            'The goal is to isolate the variable using inverse operations.',
        ],
        VISUAL: [
            'Imagine a balance scale with the equation on both sides.',
            'Each operation maintains the balance while moving closer to the solution.',
        ],
        CONVERSATIONAL: [
            "Let's work together to solve this equation step by step.",
            "Think of this as a puzzle where we need to find the missing piece.",
        ],
    },

    derivative: {
        CONCISE: [
            'Apply differentiation rules to find the rate of change.',
        ],
        DETAILED: [
            'The derivative represents the instantaneous rate of change of the function.',
            'We apply differentiation rules such as the power rule, product rule, and chain rule.',
            'Each rule helps us find how the function changes at any given point.',
        ],
        STEP_BY_STEP: [
            'Step 1: Identify the function type and applicable rules',
            'Step 2: Apply the appropriate differentiation rule',
            'Step 3: Simplify the resulting expression',
        ],
        CONCEPTUAL: [
            'Derivatives measure how quickly something is changing.',
            'Think of it as the slope of the tangent line at any point on the curve.',
        ],
        VISUAL: [
            'Picture the curve of the function and imagine drawing tangent lines.',
            'The derivative gives us the slope of these tangent lines.',
        ],
        CONVERSATIONAL: [
            "Let's find how fast this function is changing at any point.",
            "We'll use the rules of calculus to compute this derivative.",
        ],
    },

    integral: {
        CONCISE: [
            'Find the antiderivative using integration rules.',
        ],
        DETAILED: [
            'Integration is the reverse process of differentiation.',
            'We find a function whose derivative gives us the original function.',
            'This represents the area under the curve or the accumulation of quantities.',
        ],
        STEP_BY_STEP: [
            'Step 1: Identify the integrand and integration variable',
            'Step 2: Apply appropriate integration techniques',
            'Step 3: Add the constant of integration (for indefinite integrals)',
        ],
        CONCEPTUAL: [
            'Integration finds the total accumulation or area under a curve.',
            'It undoes differentiation, like addition undoes subtraction.',
        ],
        VISUAL: [
            'Imagine filling the area under the curve with infinitely thin rectangles.',
            'Integration sums up all these tiny areas to get the total.',
        ],
        CONVERSATIONAL: [
            "Now we'll find the antiderivative of this function.",
            "Think of integration as collecting all the little changes back together.",
        ],
    },

    simplify: {
        CONCISE: [
            'Combine like terms and reduce the expression to its simplest form.',
        ],
        DETAILED: [
            'Simplification involves combining like terms, reducing fractions, and eliminating unnecessary complexity.',
            'We follow the order of operations and algebraic rules to make the expression cleaner.',
        ],
        STEP_BY_STEP: [
            'Step 1: Identify like terms that can be combined',
            'Step 2: Apply algebraic rules to combine terms',
            'Step 3: Reduce fractions and eliminate common factors',
        ],
        CONCEPTUAL: [
            'Simplification makes expressions easier to work with and understand.',
            'We maintain mathematical equivalence while reducing complexity.',
        ],
        VISUAL: [
            'Think of simplification as organizing a messy room.',
            'We group similar items together and remove unnecessary clutter.',
        ],
        CONVERSATIONAL: [
            "Let's clean up this expression to make it easier to work with.",
            "We'll combine similar terms and reduce where possible.",
        ],
    },
};

/**
 * Difficulty levels for different education levels
 */
const DIFFICULTY_LEVELS: Record<EducationLevel, number> = {
    ELEMENTARY: 1,
    MIDDLE_SCHOOL: 2,
    HIGH_SCHOOL: 3,
    UNDERGRADUATE: 4,
    GRADUATE: 5,
    PROFESSIONAL: 5,
};

/**
 * Mathematical concepts database
 */
const CONCEPT_DATABASE: Record<string, string[]> = {
    solve: ['equations', 'algebra', 'inverse operations', 'variables'],
    derivative: ['calculus', 'rates of change', 'limits', 'functions'],
    integral: ['calculus', 'antiderivatives', 'area under curve', 'accumulation'],
    simplify: ['algebra', 'like terms', 'factoring', 'order of operations'],
    factor: ['algebra', 'polynomials', 'common factors', 'quadratic expressions'],
    expand: ['algebra', 'distributive property', 'polynomials', 'multiplication'],
    evaluate: ['arithmetic', 'order of operations', 'substitution', 'functions'],
};

/**
 * Explanation generator implementation
 */
export class ExplanationGenerator {
    private currentStyle: ExplanationStyle = 'DETAILED';

    /**
     * Generate explanation for a mathematical operation
     */
    public async generateExplanation(input: ExplanationInput): Promise<ExplanationOutput> {
        const startTime = performance.now();

        try {
            const style = input.style || this.currentStyle;
            const audience = input.audience || 'HIGH_SCHOOL';

            // Get explanation template
            const templates = this.getExplanationTemplates(input.operation, style);

            // Generate main explanation
            const explanation = this.buildExplanation(
                input.expression,
                input.operation,
                input.steps,
                templates,
                audience
            );

            // Get related concepts
            const concepts = this.getRelatedConcepts(input.operation);

            // Calculate difficulty and reading time
            const difficulty = this.calculateDifficulty(explanation, audience);
            const readingTime = this.estimateReadingTime(explanation);

            // Get related topics
            const relatedTopics = this.getRelatedTopics(input.operation, concepts);

            const result: ExplanationOutput = {
                explanation,
                concepts,
                difficulty,
                readingTime,
                relatedTopics,
            };

            return result;
        } catch (error) {
            throw new MathError(
                MathErrorType.EXPLANATION_ERROR,
                `Failed to generate explanation: ${(error as Error).message}`,
                input.expression
            );
        }
    }

    /**
     * Get available explanation styles
     */
    public getAvailableStyles(): readonly ExplanationStyle[] {
        return ['CONCISE', 'DETAILED', 'STEP_BY_STEP', 'CONCEPTUAL', 'VISUAL', 'CONVERSATIONAL'] as const;
    }

    /**
     * Set explanation style
     */
    public setStyle(style: ExplanationStyle): void {
        this.currentStyle = style;
    }

    // Private helper methods

    private getExplanationTemplates(operation: string, style: ExplanationStyle): string[] {
        const operationTemplates = EXPLANATION_TEMPLATES[operation.toLowerCase()];
        if (!operationTemplates) {
            return EXPLANATION_TEMPLATES.solve[style]; // Default fallback
        }

        return operationTemplates[style] || operationTemplates.DETAILED;
    }

    private buildExplanation(
        expression: string,
        operation: string,
        steps: readonly string[],
        templates: string[],
        audience: EducationLevel
    ): string {
        const parts: string[] = [];

        // Add introduction
        parts.push(this.generateIntroduction(expression, operation, audience));

        // Add template-based explanation
        parts.push(...templates);

        // Add step-by-step details if provided
        if (steps.length > 0) {
            parts.push('\nDetailed steps:');
            steps.forEach((step, index) => {
                parts.push(`${index + 1}. ${step}`);
            });
        }

        // Add conclusion
        parts.push(this.generateConclusion(operation, audience));

        return parts.join('\n\n');
    }

    private generateIntroduction(expression: string, operation: string, audience: EducationLevel): string {
        const operationNames: Record<string, string> = {
            solve: 'solve the equation',
            derivative: 'find the derivative',
            integral: 'calculate the integral',
            simplify: 'simplify the expression',
            factor: 'factor the expression',
            expand: 'expand the expression',
            evaluate: 'evaluate the expression',
        };

        const operationName = operationNames[operation.toLowerCase()] || `perform ${operation}`;

        if (audience === 'ELEMENTARY' || audience === 'MIDDLE_SCHOOL') {
            return `Let's ${operationName} "${expression}" together!`;
        } else {
            return `To ${operationName} "${expression}", we need to apply the appropriate mathematical techniques.`;
        }
    }

    private generateConclusion(operation: string, audience: EducationLevel): string {
        const conclusions: Record<string, Record<string, string>> = {
            solve: {
                simple: 'Great! We found the solution to the equation.',
                advanced: 'The solution satisfies the original equation and represents the value(s) that make it true.',
            },
            derivative: {
                simple: 'We successfully found how fast the function is changing!',
                advanced: 'The derivative represents the instantaneous rate of change of the function with respect to the variable.',
            },
            integral: {
                simple: 'We found the area under the curve!',
                advanced: 'The integral represents the antiderivative and can be interpreted as the area under the curve or accumulated change.',
            },
            simplify: {
                simple: 'The expression is now in its simplest form!',
                advanced: 'The simplified expression is mathematically equivalent to the original but in a more manageable form.',
            },
        };

        const operationConclusions = conclusions[operation.toLowerCase()];
        if (!operationConclusions) {
            return 'The mathematical operation has been completed successfully.';
        }

        const isSimple = audience === 'ELEMENTARY' || audience === 'MIDDLE_SCHOOL';
        return operationConclusions[isSimple ? 'simple' : 'advanced'];
    }

    private getRelatedConcepts(operation: string): string[] {
        return CONCEPT_DATABASE[operation.toLowerCase()] || ['mathematics', 'algebra'];
    }

    private calculateDifficulty(explanation: string, audience: EducationLevel): number {
        const baseLevel = DIFFICULTY_LEVELS[audience];

        // Adjust based on explanation complexity
        const wordCount = explanation.split(/\s+/).length;
        const complexityFactor = Math.min(wordCount / 100, 2); // Cap at 2x

        return Math.min(5, Math.max(1, baseLevel + complexityFactor - 1));
    }

    private estimateReadingTime(explanation: string): number {
        // Average reading speed: 200-250 words per minute
        const wordCount = explanation.split(/\s+/).length;
        const wordsPerMinute = 225;

        return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
    }

    private getRelatedTopics(operation: string, concepts: string[]): string[] {
        const topicMap: Record<string, string[]> = {
            solve: ['Linear equations', 'Quadratic equations', 'Systems of equations'],
            derivative: ['Chain rule', 'Product rule', 'Implicit differentiation'],
            integral: ['Integration by parts', 'Substitution method', 'Definite integrals'],
            simplify: ['Factoring', 'Combining like terms', 'Rational expressions'],
            factor: ['Quadratic factoring', 'Difference of squares', 'Grouping method'],
            expand: ['FOIL method', 'Distributive property', 'Binomial expansion'],
            evaluate: ['Order of operations', 'Function evaluation', 'Substitution'],
        };

        return topicMap[operation.toLowerCase()] || ['Basic algebra', 'Mathematical operations'];
    }
}