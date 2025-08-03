/**
 * Visualization module for Mathrok
 * Provides graph generation and mathematical notation rendering
 */

import { GraphGenerator, GraphOptions, GraphData, Point } from './graph.js';
import { SVGRenderer } from './svg-renderer.js';
import { MathRenderer, MathRenderingOptions } from './math-renderer.js';
import { MathEngine } from '../core/engine/index.js';

/**
 * Visualization service options
 */
export interface VisualizationOptions {
    graphOptions?: Partial<GraphOptions>;
    mathOptions?: Partial<MathRenderingOptions>;
}

/**
 * Visualization service for Mathrok
 * Provides a unified interface for graph generation and math rendering
 */
export class VisualizationService {
    private graphGenerator: GraphGenerator;
    private svgRenderer: SVGRenderer;
    private mathRenderer: MathRenderer;
    private isInitialized: boolean = false;

    constructor(engine: MathEngine, options?: VisualizationOptions) {
        // Initialize graph generator
        this.graphGenerator = new GraphGenerator(engine);
        this.svgRenderer = new SVGRenderer();
        this.graphGenerator.setRenderer(this.svgRenderer);

        // Initialize math renderer
        this.mathRenderer = new MathRenderer(options?.mathOptions);

        // Set graph options if provided
        if (options?.graphOptions) {
            // Options are applied per-operation
        }

        this.isInitialized = true;
    }

    /**
     * Plot a 2D function
     */
    public plot2D(
        container: HTMLElement,
        expression: string,
        variable: string = 'x',
        options?: Partial<GraphOptions>
    ): void {
        if (!this.isInitialized) {
            throw new Error('Visualization service not initialized');
        }

        this.graphGenerator.plot2D(container, expression, variable, options);
    }

    /**
     * Plot a 3D function
     */
    public plot3D(
        container: HTMLElement,
        expression: string,
        options?: Partial<GraphOptions>
    ): void {
        if (!this.isInitialized) {
            throw new Error('Visualization service not initialized');
        }

        this.graphGenerator.plot3D(container, expression, options);
    }

    /**
     * Plot a parametric function
     */
    public plotParametric(
        container: HTMLElement,
        expressionX: string,
        expressionY: string,
        parameter: string = 't',
        tMin: number = 0,
        tMax: number = 2 * Math.PI,
        options?: Partial<GraphOptions>
    ): void {
        if (!this.isInitialized) {
            throw new Error('Visualization service not initialized');
        }

        this.graphGenerator.plotParametric(
            container,
            expressionX,
            expressionY,
            parameter,
            tMin,
            tMax,
            options
        );
    }

    /**
     * Plot multiple functions
     */
    public plotMultiple(
        container: HTMLElement,
        expressions: string[],
        variable: string = 'x',
        options?: Partial<GraphOptions>
    ): void {
        if (!this.isInitialized) {
            throw new Error('Visualization service not initialized');
        }

        this.graphGenerator.plotMultiple(container, expressions, variable, options);
    }

    /**
     * Generate SVG for a 2D function
     */
    public generateSVG(
        expression: string,
        variable: string = 'x',
        options?: Partial<GraphOptions>
    ): string {
        if (!this.isInitialized) {
            throw new Error('Visualization service not initialized');
        }

        return this.graphGenerator.generateSVG(expression, variable, options);
    }

    /**
     * Generate image for a 2D function
     */
    public generateImage(
        expression: string,
        variable: string = 'x',
        options?: Partial<GraphOptions>
    ): string {
        if (!this.isInitialized) {
            throw new Error('Visualization service not initialized');
        }

        return this.graphGenerator.generateImage(expression, variable, options);
    }

    /**
     * Render a mathematical expression
     */
    public renderMath(
        expression: string,
        format: 'latex' | 'mathml' | 'asciimath' = 'latex',
        displayMode: boolean = true
    ): string {
        if (!this.isInitialized) {
            throw new Error('Visualization service not initialized');
        }

        return this.mathRenderer.render(expression, { format, displayMode });
    }

    /**
     * Render a step-by-step solution
     */
    public renderSteps(
        steps: { text: string; expression: string }[],
        format: 'latex' | 'mathml' | 'asciimath' = 'latex'
    ): string {
        if (!this.isInitialized) {
            throw new Error('Visualization service not initialized');
        }

        return this.mathRenderer.renderSteps(steps, { format });
    }

    /**
     * Generate HTML with CSS for displaying mathematical content
     */
    public generateHTML(content: string): string {
        if (!this.isInitialized) {
            throw new Error('Visualization service not initialized');
        }

        return this.mathRenderer.generateHTML(content);
    }

    /**
     * Generate a complete visualization of a mathematical solution
     */
    public visualizeSolution(
        expression: string,
        steps: { text: string; expression: string }[],
        plotOptions?: Partial<GraphOptions>
    ): string {
        if (!this.isInitialized) {
            throw new Error('Visualization service not initialized');
        }

        // Render the steps
        const stepsHTML = this.mathRenderer.renderSteps(steps);

        // Generate a graph if applicable
        let graphHTML = '';
        try {
            const svg = this.graphGenerator.generateSVG(expression, 'x', plotOptions);
            graphHTML = `
                <div class="solution-graph">
                    <h3>Graph</h3>
                    ${svg}
                </div>
            `;
        } catch (error) {
            // If graphing fails, just skip it
            console.warn('Failed to generate graph:', error);
        }

        // Combine everything
        return this.mathRenderer.generateHTML(`
            <div class="solution-container">
                <div class="solution-expression">
                    <h3>Expression</h3>
                    <div class="expression">${this.mathRenderer.render(expression)}</div>
                </div>

                <div class="solution-steps">
                    <h3>Solution Steps</h3>
                    ${stepsHTML}
                </div>

                ${graphHTML}
            </div>
        `);
    }
}

// Export classes and interfaces
export { GraphGenerator, GraphOptions, GraphData, Point } from './graph.js';
export { SVGRenderer } from './svg-renderer.js';
export { MathRenderer, MathRenderingOptions } from './math-renderer.js';