/**
 * Mathematical Phrase Dictionary
 * Comprehensive collection of mathematical phrases and their corresponding operations
 */

export interface MathematicalPhrase {
    operation: string;
    confidence: number;
    parameters?: string[];
    context?: string;
    examples?: string[];
}

export interface IntentRecognition {
    operation: string;
    confidence: number;
    parameters: Record<string, any>;
    context: string;
    alternatives: string[];
}

/**
 * Comprehensive mathematical phrase dictionary
 */
export const MATHEMATICAL_PHRASES: Record<string, MathematicalPhrase> = {
    // Calculus - Derivatives
    'find the derivative of': {
        operation: 'derivative',
        confidence: 0.95,
        parameters: ['expression', 'variable'],
        context: 'calculus',
        examples: ['find the derivative of x^2', 'find the derivative of sin(x)']
    },
    'differentiate': {
        operation: 'derivative',
        confidence: 0.9,
        parameters: ['expression', 'variable'],
        context: 'calculus',
        examples: ['differentiate x^3', 'differentiate with respect to x']
    },
    'take the derivative': {
        operation: 'derivative',
        confidence: 0.9,
        parameters: ['expression', 'variable'],
        context: 'calculus'
    },
    'd/dx': {
        operation: 'derivative',
        confidence: 1.0,
        parameters: ['expression'],
        context: 'calculus'
    },
    'derivative with respect to': {
        operation: 'derivative',
        confidence: 0.95,
        parameters: ['expression', 'variable'],
        context: 'calculus'
    },
    'partial derivative': {
        operation: 'partialDerivative',
        confidence: 0.95,
        parameters: ['expression', 'variable'],
        context: 'multivariable_calculus'
    },
    '∂/∂': {
        operation: 'partialDerivative',
        confidence: 1.0,
        parameters: ['expression', 'variable'],
        context: 'multivariable_calculus'
    },

    // Calculus - Integration
    'integrate': {
        operation: 'integral',
        confidence: 0.95,
        parameters: ['expression', 'variable'],
        context: 'calculus',
        examples: ['integrate x^2', 'integrate sin(x) dx']
    },
    'find the integral of': {
        operation: 'integral',
        confidence: 0.95,
        parameters: ['expression', 'variable'],
        context: 'calculus'
    },
    'antiderivative': {
        operation: 'integral',
        confidence: 0.9,
        parameters: ['expression', 'variable'],
        context: 'calculus'
    },
    'indefinite integral': {
        operation: 'integral',
        confidence: 0.95,
        parameters: ['expression', 'variable'],
        context: 'calculus'
    },
    'definite integral': {
        operation: 'integral',
        confidence: 0.95,
        parameters: ['expression', 'variable', 'lowerBound', 'upperBound'],
        context: 'calculus'
    },
    '∫': {
        operation: 'integral',
        confidence: 1.0,
        parameters: ['expression', 'variable'],
        context: 'calculus'
    },

    // Calculus - Limits
    'limit as x approaches': {
        operation: 'limit',
        confidence: 0.95,
        parameters: ['expression', 'variable', 'approach'],
        context: 'calculus'
    },
    'limit of': {
        operation: 'limit',
        confidence: 0.9,
        parameters: ['expression', 'variable', 'approach'],
        context: 'calculus'
    },
    'lim': {
        operation: 'limit',
        confidence: 0.95,
        parameters: ['expression', 'variable', 'approach'],
        context: 'calculus'
    },
    'left hand limit': {
        operation: 'limit',
        confidence: 0.95,
        parameters: ['expression', 'variable', 'approach', 'direction'],
        context: 'calculus'
    },
    'right hand limit': {
        operation: 'limit',
        confidence: 0.95,
        parameters: ['expression', 'variable', 'approach', 'direction'],
        context: 'calculus'
    },

    // Calculus - Series
    'taylor series': {
        operation: 'taylorSeries',
        confidence: 0.95,
        parameters: ['expression', 'variable', 'center', 'order'],
        context: 'calculus'
    },
    'maclaurin series': {
        operation: 'taylorSeries',
        confidence: 0.95,
        parameters: ['expression', 'variable', 'center', 'order'],
        context: 'calculus'
    },
    'power series': {
        operation: 'taylorSeries',
        confidence: 0.85,
        parameters: ['expression', 'variable', 'center', 'order'],
        context: 'calculus'
    },

    // Algebra - Basic Operations
    'solve for': {
        operation: 'solve',
        confidence: 0.95,
        parameters: ['equation', 'variable'],
        context: 'algebra',
        examples: ['solve for x', 'solve x^2 - 4 = 0 for x']
    },
    'solve': {
        operation: 'solve',
        confidence: 0.9,
        parameters: ['equation', 'variable'],
        context: 'algebra'
    },
    'find the solution': {
        operation: 'solve',
        confidence: 0.9,
        parameters: ['equation', 'variable'],
        context: 'algebra'
    },
    'what is x': {
        operation: 'solve',
        confidence: 0.8,
        parameters: ['equation', 'variable'],
        context: 'algebra'
    },

    // Algebra - Factoring
    'factor': {
        operation: 'factor',
        confidence: 0.9,
        parameters: ['expression'],
        context: 'algebra',
        examples: ['factor x^2 - 4', 'factor the expression']
    },
    'factorize': {
        operation: 'factor',
        confidence: 0.9,
        parameters: ['expression'],
        context: 'algebra'
    },
    'find the factors': {
        operation: 'factor',
        confidence: 0.9,
        parameters: ['expression'],
        context: 'algebra'
    },
    'factor completely': {
        operation: 'factor',
        confidence: 0.95,
        parameters: ['expression'],
        context: 'algebra'
    },

    // Algebra - Expansion
    'expand': {
        operation: 'expand',
        confidence: 0.9,
        parameters: ['expression'],
        context: 'algebra',
        examples: ['expand (x+1)^2', 'expand the expression']
    },
    'multiply out': {
        operation: 'expand',
        confidence: 0.85,
        parameters: ['expression'],
        context: 'algebra'
    },
    'distribute': {
        operation: 'expand',
        confidence: 0.8,
        parameters: ['expression'],
        context: 'algebra'
    },

    // Algebra - Simplification
    'simplify': {
        operation: 'simplify',
        confidence: 0.9,
        parameters: ['expression'],
        context: 'algebra',
        examples: ['simplify x^2 + 2x + x^2', 'simplify the expression']
    },
    'reduce': {
        operation: 'simplify',
        confidence: 0.85,
        parameters: ['expression'],
        context: 'algebra'
    },
    'combine like terms': {
        operation: 'simplify',
        confidence: 0.9,
        parameters: ['expression'],
        context: 'algebra'
    },

    // Algebra - Advanced Operations
    'substitute': {
        operation: 'substitute',
        confidence: 0.9,
        parameters: ['expression', 'substitutions'],
        context: 'algebra'
    },
    'replace': {
        operation: 'substitute',
        confidence: 0.8,
        parameters: ['expression', 'substitutions'],
        context: 'algebra'
    },
    'partial fractions': {
        operation: 'partialFractions',
        confidence: 0.95,
        parameters: ['expression', 'variable'],
        context: 'algebra'
    },
    'partial fraction decomposition': {
        operation: 'partialFractions',
        confidence: 0.95,
        parameters: ['expression', 'variable'],
        context: 'algebra'
    },

    // Trigonometry
    'solve trigonometric equation': {
        operation: 'solveTrigonometric',
        confidence: 0.95,
        parameters: ['equation', 'variable'],
        context: 'trigonometry'
    },
    'solve trig equation': {
        operation: 'solveTrigonometric',
        confidence: 0.9,
        parameters: ['equation', 'variable'],
        context: 'trigonometry'
    },
    'convert to radians': {
        operation: 'convertTrigUnits',
        confidence: 0.95,
        parameters: ['expression', 'fromUnit', 'toUnit'],
        context: 'trigonometry'
    },
    'convert to degrees': {
        operation: 'convertTrigUnits',
        confidence: 0.95,
        parameters: ['expression', 'fromUnit', 'toUnit'],
        context: 'trigonometry'
    },
    'evaluate at special angles': {
        operation: 'evaluateSpecialAngles',
        confidence: 0.95,
        parameters: ['expression'],
        context: 'trigonometry'
    },

    // Evaluation
    'evaluate': {
        operation: 'evaluate',
        confidence: 0.9,
        parameters: ['expression', 'variables'],
        context: 'general'
    },
    'calculate': {
        operation: 'evaluate',
        confidence: 0.85,
        parameters: ['expression', 'variables'],
        context: 'general'
    },
    'compute': {
        operation: 'evaluate',
        confidence: 0.85,
        parameters: ['expression', 'variables'],
        context: 'general'
    },
    'find the value': {
        operation: 'evaluate',
        confidence: 0.9,
        parameters: ['expression', 'variables'],
        context: 'general'
    },

    // Multi-step operations
    'first': {
        operation: 'multi_step',
        confidence: 0.8,
        parameters: ['steps'],
        context: 'multi_step'
    },
    'then': {
        operation: 'multi_step',
        confidence: 0.8,
        parameters: ['steps'],
        context: 'multi_step'
    },
    'next': {
        operation: 'multi_step',
        confidence: 0.8,
        parameters: ['steps'],
        context: 'multi_step'
    },
    'after that': {
        operation: 'multi_step',
        confidence: 0.8,
        parameters: ['steps'],
        context: 'multi_step'
    },

    // Educational queries
    'explain how to': {
        operation: 'explain',
        confidence: 0.9,
        parameters: ['topic'],
        context: 'educational'
    },
    'show me how': {
        operation: 'explain',
        confidence: 0.9,
        parameters: ['topic'],
        context: 'educational'
    },
    'what is the process': {
        operation: 'explain',
        confidence: 0.85,
        parameters: ['topic'],
        context: 'educational'
    },
    'step by step': {
        operation: 'explain',
        confidence: 0.9,
        parameters: ['topic'],
        context: 'educational'
    }
};

/**
 * Mathematical operation synonyms for better recognition
 */
export const OPERATION_SYNONYMS: Record<string, string[]> = {
    'derivative': ['differentiate', 'diff', 'd/dx', 'derive'],
    'integral': ['integrate', 'antiderivative', '∫', 'anti-derivative'],
    'solve': ['find', 'determine', 'calculate x', 'what is x'],
    'factor': ['factorize', 'factorise', 'find factors'],
    'expand': ['multiply out', 'distribute', 'expand brackets'],
    'simplify': ['reduce', 'combine', 'simplify expression'],
    'limit': ['lim', 'limiting value', 'approaches'],
    'evaluate': ['calculate', 'compute', 'find value']
};

/**
 * Context-specific mathematical terms
 */
export const MATHEMATICAL_CONTEXTS: Record<string, string[]> = {
    'calculus': ['derivative', 'integral', 'limit', 'continuous', 'differentiable'],
    'algebra': ['equation', 'polynomial', 'factor', 'expand', 'solve'],
    'trigonometry': ['sin', 'cos', 'tan', 'angle', 'radian', 'degree'],
    'geometry': ['area', 'volume', 'perimeter', 'angle', 'triangle'],
    'statistics': ['mean', 'median', 'mode', 'standard deviation', 'probability']
};

/**
 * Common mathematical variables and their contexts
 */
export const COMMON_VARIABLES: Record<string, string[]> = {
    'x': ['algebra', 'calculus', 'general'],
    'y': ['algebra', 'calculus', 'geometry'],
    't': ['calculus', 'physics', 'time'],
    'n': ['discrete', 'sequences', 'number_theory'],
    'θ': ['trigonometry', 'geometry', 'polar'],
    'α': ['angles', 'parameters', 'statistics'],
    'β': ['angles', 'parameters', 'statistics']
};

/**
 * Mathematical constants and their values
 */
export const MATHEMATICAL_CONSTANTS: Record<string, { value: string; context: string }> = {
    'π': { value: 'pi', context: 'trigonometry' },
    'pi': { value: 'pi', context: 'trigonometry' },
    'e': { value: 'e', context: 'calculus' },
    'euler': { value: 'e', context: 'calculus' },
    '∞': { value: 'infinity', context: 'limits' },
    'infinity': { value: 'infinity', context: 'limits' },
    'inf': { value: 'infinity', context: 'limits' }
};