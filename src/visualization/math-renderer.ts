/**
 * Mathematical Notation Renderer for Mathrok
 * Provides LaTeX/MathML output for mathematical expressions
 */

/**
 * Math rendering options
 */
export interface MathRenderingOptions {
    format: 'latex' | 'mathml' | 'asciimath';
    displayMode?: boolean;
    fontSize?: number;
    color?: string;
    background?: string;
    linebreaks?: boolean;
    fleqn?: boolean;
    leqno?: boolean;
    throwOnError?: boolean;
    macros?: Record<string, string>;
}

/**
 * Default rendering options
 */
const DEFAULT_OPTIONS: MathRenderingOptions = {
    format: 'latex',
    displayMode: true,
    fontSize: 16,
    color: '#000000',
    background: 'transparent',
    linebreaks: false,
    fleqn: false,
    leqno: false,
    throwOnError: false,
    macros: {}
};

/**
 * Math notation renderer
 */
export class MathRenderer {
    private options: MathRenderingOptions;

    constructor(options?: Partial<MathRenderingOptions>) {
        this.options = { ...DEFAULT_OPTIONS, ...(options || {}) };
    }

    /**
     * Set rendering options
     */
    public setOptions(options: Partial<MathRenderingOptions>): void {
        this.options = { ...this.options, ...options };
    }

    /**
     * Convert a mathematical expression to LaTeX
     */
    public toLatex(expression: string): string {
        // This is a simplified conversion
        // A full implementation would use a proper parser

        // Replace common operators
        let latex = expression
            .replace(/\*/g, '\\cdot ')
            .replace(/\//g, '\\frac{')
            .replace(/\^/g, '^{')
            .replace(/sqrt\(/g, '\\sqrt{')
            .replace(/sin\(/g, '\\sin(')
            .replace(/cos\(/g, '\\cos(')
            .replace(/tan\(/g, '\\tan(')
            .replace(/log\(/g, '\\log(')
            .replace(/ln\(/g, '\\ln(')
            .replace(/pi/g, '\\pi ')
            .replace(/infinity/g, '\\infty ')
            .replace(/infty/g, '\\infty ')
            .replace(/alpha/g, '\\alpha ')
            .replace(/beta/g, '\\beta ')
            .replace(/gamma/g, '\\gamma ')
            .replace(/delta/g, '\\delta ')
            .replace(/epsilon/g, '\\epsilon ')
            .replace(/zeta/g, '\\zeta ')
            .replace(/eta/g, '\\eta ')
            .replace(/theta/g, '\\theta ')
            .replace(/iota/g, '\\iota ')
            .replace(/kappa/g, '\\kappa ')
            .replace(/lambda/g, '\\lambda ')
            .replace(/mu/g, '\\mu ')
            .replace(/nu/g, '\\nu ')
            .replace(/xi/g, '\\xi ')
            .replace(/omicron/g, '\\omicron ')
            .replace(/rho/g, '\\rho ')
            .replace(/sigma/g, '\\sigma ')
            .replace(/tau/g, '\\tau ')
            .replace(/upsilon/g, '\\upsilon ')
            .replace(/phi/g, '\\phi ')
            .replace(/chi/g, '\\chi ')
            .replace(/psi/g, '\\psi ')
            .replace(/omega/g, '\\omega ');

        // Handle fractions
        // This is a simplified approach and might not work for all cases
        let fractionCount = (latex.match(/\\frac{/g) || []).length;
        for (let i = 0; i < fractionCount; i++) {
            let index = latex.indexOf('\\frac{');
            if (index !== -1) {
                // Find the numerator
                let depth = 1;
                let j = index + 6;
                while (depth > 0 && j < latex.length) {
                    if (latex[j] === '{') depth++;
                    if (latex[j] === '}') depth--;
                    j++;
                }

                // Insert the denominator opening
                latex = latex.substring(0, j) + '}{' + latex.substring(j);
            }
        }

        // Handle exponents
        // This is a simplified approach and might not work for all cases
        let exponentCount = (latex.match(/\^{/g) || []).length;
        for (let i = 0; i < exponentCount; i++) {
            let index = latex.indexOf('^{');
            if (index !== -1) {
                // Find what's being exponentiated
                let base = '';
                let j = index - 1;

                // If the character before ^ is a closing brace, find the matching opening brace
                if (latex[j] === '}') {
                    let depth = 1;
                    j--;
                    while (depth > 0 && j >= 0) {
                        if (latex[j] === '}') depth++;
                        if (latex[j] === '{') depth--;
                        j--;
                    }
                    base = latex.substring(j + 1, index - 1);
                } else {
                    // Otherwise, it's just a single character
                    base = latex[j];
                }
            }
        }

        return latex;
    }

    /**
     * Convert a mathematical expression to MathML
     */
    public toMathML(expression: string): string {
        // Convert to LaTeX first, then to MathML
        // This is a simplified approach
        const latex = this.toLatex(expression);

        // Very basic LaTeX to MathML conversion
        // A full implementation would use a proper converter
        let mathml = '<math xmlns="http://www.w3.org/1998/Math/MathML">';

        // Process the LaTeX expression
        let i = 0;
        while (i < latex.length) {
            if (latex[i] === '\\') {
                // Handle LaTeX commands
                if (latex.substring(i, i + 5) === '\\frac') {
                    // Handle fractions
                    i += 5;

                    // Find numerator
                    let numerator = '';
                    if (latex[i] === '{') {
                        let depth = 1;
                        i++;
                        let start = i;
                        while (depth > 0 && i < latex.length) {
                            if (latex[i] === '{') depth++;
                            if (latex[i] === '}') depth--;
                            i++;
                        }
                        numerator = latex.substring(start, i - 1);
                    }

                    // Find denominator
                    let denominator = '';
                    if (latex[i] === '{') {
                        let depth = 1;
                        i++;
                        let start = i;
                        while (depth > 0 && i < latex.length) {
                            if (latex[i] === '{') depth++;
                            if (latex[i] === '}') depth--;
                            i++;
                        }
                        denominator = latex.substring(start, i - 1);
                    }

                    mathml += `<mfrac><mrow>${this.toMathML(numerator)}</mrow><mrow>${this.toMathML(denominator)}</mrow></mfrac>`;
                } else if (latex.substring(i, i + 5) === '\\sqrt') {
                    // Handle square roots
                    i += 5;

                    // Find argument
                    let arg = '';
                    if (latex[i] === '{') {
                        let depth = 1;
                        i++;
                        let start = i;
                        while (depth > 0 && i < latex.length) {
                            if (latex[i] === '{') depth++;
                            if (latex[i] === '}') depth--;
                            i++;
                        }
                        arg = latex.substring(start, i - 1);
                    }

                    mathml += `<msqrt>${this.toMathML(arg)}</msqrt>`;
                } else if (latex.substring(i, i + 4) === '\\sin') {
                    mathml += '<mi>sin</mi>';
                    i += 4;
                } else if (latex.substring(i, i + 4) === '\\cos') {
                    mathml += '<mi>cos</mi>';
                    i += 4;
                } else if (latex.substring(i, i + 4) === '\\tan') {
                    mathml += '<mi>tan</mi>';
                    i += 4;
                } else if (latex.substring(i, i + 4) === '\\log') {
                    mathml += '<mi>log</mi>';
                    i += 4;
                } else if (latex.substring(i, i + 3) === '\\ln') {
                    mathml += '<mi>ln</mi>';
                    i += 3;
                } else if (latex.substring(i, i + 3) === '\\pi') {
                    mathml += '<mi>π</mi>';
                    i += 3;
                } else if (latex.substring(i, i + 6) === '\\infty') {
                    mathml += '<mi>∞</mi>';
                    i += 6;
                } else if (latex.substring(i, i + 5) === '\\cdot') {
                    mathml += '<mo>⋅</mo>';
                    i += 5;
                } else {
                    // Unknown command, skip
                    i++;
                }
            } else if (latex[i] === '^') {
                // Handle superscripts
                i++;

                // Find base (already processed)
                let base = mathml;
                mathml = '';

                // Find exponent
                let exponent = '';
                if (latex[i] === '{') {
                    let depth = 1;
                    i++;
                    let start = i;
                    while (depth > 0 && i < latex.length) {
                        if (latex[i] === '{') depth++;
                        if (latex[i] === '}') depth--;
                        i++;
                    }
                    exponent = latex.substring(start, i - 1);
                } else {
                    exponent = latex[i];
                    i++;
                }

                mathml = `${base}<msup><mrow></mrow><mrow>${this.toMathML(exponent)}</mrow></msup>`;
            } else if (latex[i] === '_') {
                // Handle subscripts
                i++;

                // Find base (already processed)
                let base = mathml;
                mathml = '';

                // Find subscript
                let subscript = '';
                if (latex[i] === '{') {
                    let depth = 1;
                    i++;
                    let start = i;
                    while (depth > 0 && i < latex.length) {
                        if (latex[i] === '{') depth++;
                        if (latex[i] === '}') depth--;
                        i++;
                    }
                    subscript = latex.substring(start, i - 1);
                } else {
                    subscript = latex[i];
                    i++;
                }

                mathml = `${base}<msub><mrow></mrow><mrow>${this.toMathML(subscript)}</mrow></msub>`;
            } else if (latex[i] === '+' || latex[i] === '-' || latex[i] === '=' || latex[i] === '<' || latex[i] === '>') {
                // Handle operators
                mathml += `<mo>${latex[i]}</mo>`;
                i++;
            } else if (/[0-9]/.test(latex[i])) {
                // Handle numbers
                let number = '';
                while (i < latex.length && (/[0-9.]/.test(latex[i]))) {
                    number += latex[i];
                    i++;
                }
                mathml += `<mn>${number}</mn>`;
            } else if (/[a-zA-Z]/.test(latex[i])) {
                // Handle variables
                mathml += `<mi>${latex[i]}</mi>`;
                i++;
            } else if (latex[i] === '(' || latex[i] === ')') {
                // Handle parentheses
                mathml += `<mo>${latex[i]}</mo>`;
                i++;
            } else {
                // Skip other characters
                i++;
            }
        }

        mathml += '</math>';
        return mathml;
    }

    /**
     * Convert a mathematical expression to AsciiMath
     */
    public toAsciiMath(expression: string): string {
        // This is a simplified conversion
        // A full implementation would use a proper parser

        // Replace common operators
        let asciimath = expression
            .replace(/\*/g, ' * ')
            .replace(/\//g, ' / ')
            .replace(/\+/g, ' + ')
            .replace(/\-/g, ' - ')
            .replace(/\=/g, ' = ')
            .replace(/\^/g, '^')
            .replace(/sqrt\(/g, 'sqrt(')
            .replace(/sin\(/g, 'sin(')
            .replace(/cos\(/g, 'cos(')
            .replace(/tan\(/g, 'tan(')
            .replace(/log\(/g, 'log(')
            .replace(/ln\(/g, 'ln(')
            .replace(/pi/g, 'pi')
            .replace(/infinity/g, 'oo')
            .replace(/infty/g, 'oo')
            .replace(/alpha/g, 'alpha')
            .replace(/beta/g, 'beta')
            .replace(/gamma/g, 'gamma')
            .replace(/delta/g, 'delta')
            .replace(/epsilon/g, 'epsilon')
            .replace(/zeta/g, 'zeta')
            .replace(/eta/g, 'eta')
            .replace(/theta/g, 'theta')
            .replace(/iota/g, 'iota')
            .replace(/kappa/g, 'kappa')
            .replace(/lambda/g, 'lambda')
            .replace(/mu/g, 'mu')
            .replace(/nu/g, 'nu')
            .replace(/xi/g, 'xi')
            .replace(/omicron/g, 'omicron')
            .replace(/rho/g, 'rho')
            .replace(/sigma/g, 'sigma')
            .replace(/tau/g, 'tau')
            .replace(/upsilon/g, 'upsilon')
            .replace(/phi/g, 'phi')
            .replace(/chi/g, 'chi')
            .replace(/psi/g, 'psi')
            .replace(/omega/g, 'omega');

        return asciimath;
    }

    /**
     * Render a mathematical expression
     */
    public render(expression: string, options?: Partial<MathRenderingOptions>): string {
        const mergedOptions = { ...this.options, ...(options || {}) };

        switch (mergedOptions.format) {
            case 'latex':
                return this.wrapLatex(this.toLatex(expression), mergedOptions);
            case 'mathml':
                return this.toMathML(expression);
            case 'asciimath':
                return this.toAsciiMath(expression);
            default:
                return this.wrapLatex(this.toLatex(expression), mergedOptions);
        }
    }

    /**
     * Wrap LaTeX in display or inline mode
     */
    private wrapLatex(latex: string, options: MathRenderingOptions): string {
        if (options.displayMode) {
            return `\\[${latex}\\]`;
        } else {
            return `\\(${latex}\\)`;
        }
    }

    /**
     * Render a step-by-step solution
     */
    public renderSteps(steps: { text: string; expression: string }[], options?: Partial<MathRenderingOptions>): string {
        const mergedOptions = { ...this.options, ...(options || {}) };

        let result = '';

        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            const stepNumber = i + 1;

            result += `<div class="math-step">`;
            result += `<div class="step-number">Step ${stepNumber}:</div>`;
            result += `<div class="step-text">${step.text}</div>`;
            result += `<div class="step-expression">${this.render(step.expression, mergedOptions)}</div>`;
            result += `</div>`;
        }

        return result;
    }

    /**
     * Generate HTML with CSS for displaying mathematical content
     */
    public generateHTML(content: string): string {
        return `
            <div class="math-content">
                <style>
                    .math-content {
                        font-family: 'Arial', sans-serif;
                        line-height: 1.5;
                        color: ${this.options.color};
                        background: ${this.options.background};
                        padding: 10px;
                    }
                    .math-step {
                        margin-bottom: 15px;
                        padding: 10px;
                        border-left: 3px solid #3498db;
                        background-color: #f8f9fa;
                    }
                    .step-number {
                        font-weight: bold;
                        color: #3498db;
                        margin-bottom: 5px;
                    }
                    .step-text {
                        margin-bottom: 5px;
                    }
                    .step-expression {
                        padding: 5px;
                        background-color: #ffffff;
                        border-radius: 3px;
                        overflow-x: auto;
                    }
                </style>
                ${content}
            </div>
        `;
    }
}