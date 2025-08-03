/**
 * Graph generation module for Mathrok
 * Provides lightweight plotting capabilities for mathematical functions
 */

import { MathEngine } from '../core/engine/index.js';

/**
 * Graph point
 */
export interface Point {
    x: number;
    y: number;
    z?: number;
}

/**
 * Graph options
 */
export interface GraphOptions {
    width?: number;
    height?: number;
    xMin?: number;
    xMax?: number;
    yMin?: number;
    yMax?: number;
    zMin?: number;
    zMax?: number;
    xLabel?: string;
    yLabel?: string;
    zLabel?: string;
    title?: string;
    gridLines?: boolean;
    axisLabels?: boolean;
    points?: number;
    lineColor?: string;
    backgroundColor?: string;
    axisColor?: string;
    gridColor?: string;
    pointColor?: string;
    lineWidth?: number;
    pointSize?: number;
    showLegend?: boolean;
}

/**
 * Graph data
 */
export interface GraphData {
    points: Point[];
    expression: string;
    variable: string;
    type: '2d' | '3d' | 'parametric';
    color?: string;
    label?: string;
}

/**
 * Graph renderer interface
 */
export interface GraphRenderer {
    render(container: HTMLElement, data: GraphData[], options: GraphOptions): void;
    renderToSVG(data: GraphData[], options: GraphOptions): string;
    renderToCanvas(data: GraphData[], options: GraphOptions): HTMLCanvasElement;
    renderToImage(data: GraphData[], options: GraphOptions): string; // Base64 data URL
}

/**
 * Default graph options
 */
const DEFAULT_GRAPH_OPTIONS: GraphOptions = {
    width: 600,
    height: 400,
    xMin: -10,
    xMax: 10,
    yMin: -10,
    yMax: 10,
    zMin: -10,
    zMax: 10,
    xLabel: 'x',
    yLabel: 'y',
    zLabel: 'z',
    title: '',
    gridLines: true,
    axisLabels: true,
    points: 100,
    lineColor: '#1f77b4',
    backgroundColor: '#ffffff',
    axisColor: '#000000',
    gridColor: '#e0e0e0',
    pointColor: '#ff7f0e',
    lineWidth: 2,
    pointSize: 3,
    showLegend: true
};

/**
 * Graph generator class
 */
export class GraphGenerator {
    private engine: MathEngine;
    private renderer: GraphRenderer | null = null;

    constructor(engine: MathEngine) {
        this.engine = engine;
    }

    /**
     * Set the renderer
     */
    public setRenderer(renderer: GraphRenderer): void {
        this.renderer = renderer;
    }

    /**
     * Generate points for a 2D function
     */
    public generatePoints2D(
        expression: string,
        variable: string = 'x',
        options: GraphOptions = {}
    ): GraphData {
        const mergedOptions = { ...DEFAULT_GRAPH_OPTIONS, ...options };
        const { xMin, xMax, points } = mergedOptions;

        const step = (xMax! - xMin!) / (points! - 1);
        const result: Point[] = [];

        for (let i = 0; i < points!; i++) {
            const x = xMin! + i * step;
            try {
                // Evaluate the expression at x
                const evaluationResult = this.evaluateExpression(expression, variable, x);

                if (!isNaN(evaluationResult) && isFinite(evaluationResult)) {
                    result.push({ x, y: evaluationResult });
                }
                // Skip points that result in NaN or Infinity
            } catch (error) {
                // Skip points that cause evaluation errors
                continue;
            }
        }

        return {
            points: result,
            expression,
            variable,
            type: '2d',
            color: mergedOptions.lineColor,
            label: expression
        };
    }

    /**
     * Generate points for a 3D function
     */
    public generatePoints3D(
        expression: string,
        options: GraphOptions = {}
    ): GraphData {
        const mergedOptions = { ...DEFAULT_GRAPH_OPTIONS, ...options };
        const { xMin, xMax, yMin, yMax, points } = mergedOptions;

        // For 3D, we use a square root of points for each dimension
        const pointsPerDim = Math.ceil(Math.sqrt(points!));
        const xStep = (xMax! - xMin!) / (pointsPerDim - 1);
        const yStep = (yMax! - yMin!) / (pointsPerDim - 1);

        const result: Point[] = [];

        for (let i = 0; i < pointsPerDim; i++) {
            const x = xMin! + i * xStep;

            for (let j = 0; j < pointsPerDim; j++) {
                const y = yMin! + j * yStep;

                try {
                    // Evaluate the expression at (x,y)
                    const z = this.evaluateExpression3D(expression, x, y);

                    if (!isNaN(z) && isFinite(z)) {
                        result.push({ x, y, z });
                    }
                    // Skip points that result in NaN or Infinity
                } catch (error) {
                    // Skip points that cause evaluation errors
                    continue;
                }
            }
        }

        return {
            points: result,
            expression,
            variable: 'x,y',
            type: '3d',
            color: mergedOptions.lineColor,
            label: expression
        };
    }

    /**
     * Generate points for a parametric function
     */
    public generateParametricPoints(
        expressionX: string,
        expressionY: string,
        parameter: string = 't',
        tMin: number = 0,
        tMax: number = 2 * Math.PI,
        options: GraphOptions = {}
    ): GraphData {
        const mergedOptions = { ...DEFAULT_GRAPH_OPTIONS, ...options };
        const { points } = mergedOptions;

        const step = (tMax - tMin) / (points! - 1);
        const result: Point[] = [];

        for (let i = 0; i < points!; i++) {
            const t = tMin + i * step;

            try {
                // Evaluate the expressions at t
                const x = this.evaluateExpression(expressionX, parameter, t);
                const y = this.evaluateExpression(expressionY, parameter, t);

                if (!isNaN(x) && !isNaN(y) && isFinite(x) && isFinite(y)) {
                    result.push({ x, y });
                }
                // Skip points that result in NaN or Infinity
            } catch (error) {
                // Skip points that cause evaluation errors
                continue;
            }
        }

        return {
            points: result,
            expression: `${expressionX}, ${expressionY}`,
            variable: parameter,
            type: 'parametric',
            color: mergedOptions.lineColor,
            label: `(${expressionX}, ${expressionY})`
        };
    }

    /**
     * Plot a 2D function
     */
    public plot2D(
        container: HTMLElement,
        expression: string,
        variable: string = 'x',
        options: GraphOptions = {}
    ): void {
        if (!this.renderer) {
            throw new Error('No renderer set. Call setRenderer() first.');
        }

        const data = this.generatePoints2D(expression, variable, options);
        this.renderer.render(container, [data], options);
    }

    /**
     * Plot a 3D function
     */
    public plot3D(
        container: HTMLElement,
        expression: string,
        options: GraphOptions = {}
    ): void {
        if (!this.renderer) {
            throw new Error('No renderer set. Call setRenderer() first.');
        }

        const data = this.generatePoints3D(expression, options);
        this.renderer.render(container, [data], options);
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
        options: GraphOptions = {}
    ): void {
        if (!this.renderer) {
            throw new Error('No renderer set. Call setRenderer() first.');
        }

        const data = this.generateParametricPoints(
            expressionX,
            expressionY,
            parameter,
            tMin,
            tMax,
            options
        );

        this.renderer.render(container, [data], options);
    }

    /**
     * Plot multiple functions
     */
    public plotMultiple(
        container: HTMLElement,
        expressions: string[],
        variable: string = 'x',
        options: GraphOptions = {}
    ): void {
        if (!this.renderer) {
            throw new Error('No renderer set. Call setRenderer() first.');
        }

        const dataArray: GraphData[] = expressions.map((expr, index) => {
            // Generate a different color for each function
            const colors = [
                '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
                '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'
            ];

            const color = colors[index % colors.length];
            const data = this.generatePoints2D(expr, variable, { ...options, lineColor: color });
            return data;
        });

        this.renderer.render(container, dataArray, options);
    }

    /**
     * Generate SVG for a 2D function
     */
    public generateSVG(
        expression: string,
        variable: string = 'x',
        options: GraphOptions = {}
    ): string {
        if (!this.renderer) {
            throw new Error('No renderer set. Call setRenderer() first.');
        }

        const data = this.generatePoints2D(expression, variable, options);
        return this.renderer.renderToSVG([data], options);
    }

    /**
     * Generate image for a 2D function
     */
    public generateImage(
        expression: string,
        variable: string = 'x',
        options: GraphOptions = {}
    ): string {
        if (!this.renderer) {
            throw new Error('No renderer set. Call setRenderer() first.');
        }

        const data = this.generatePoints2D(expression, variable, options);
        return this.renderer.renderToImage([data], options);
    }

    /**
     * Evaluate an expression at a specific value
     */
    private evaluateExpression(expression: string, variable: string, value: number): number {
        // Create a variables object with the specified value
        const variables: Record<string, number> = { [variable]: value };

        // Use the MathEngine to evaluate the expression
        const result = this.engine.evaluate(expression, variables);

        // Extract the numeric result
        if (typeof result === 'object' && result.result !== undefined) {
            return parseFloat(result.result.toString());
        }

        return parseFloat(result.toString());
    }

    /**
     * Evaluate a 3D expression at specific x,y values
     */
    private evaluateExpression3D(expression: string, x: number, y: number): number {
        // Create a variables object with x and y values
        const variables: Record<string, number> = { x, y };

        // Use the MathEngine to evaluate the expression
        const result = this.engine.evaluate(expression, variables);

        // Extract the numeric result
        if (typeof result === 'object' && result.result !== undefined) {
            return parseFloat(result.result.toString());
        }

        return parseFloat(result.toString());
    }
}