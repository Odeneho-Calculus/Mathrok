/**
 * SVG Renderer for Mathrok Graph Generator
 * Provides SVG-based rendering for mathematical functions
 */

import { GraphData, GraphOptions, GraphRenderer, Point } from './graph.js';

/**
 * SVG Renderer class
 */
export class SVGRenderer implements GraphRenderer {
    /**
     * Render graph to an HTML element
     */
    public render(container: HTMLElement, data: GraphData[], options: GraphOptions): void {
        const svg = this.renderToSVG(data, options);
        container.innerHTML = svg;
    }

    /**
     * Render graph to SVG string
     */
    public renderToSVG(data: GraphData[], options: GraphOptions): string {
        const {
            width = 600,
            height = 400,
            xMin = -10,
            xMax = 10,
            yMin = -10,
            yMax = 10,
            xLabel = 'x',
            yLabel = 'y',
            title = '',
            gridLines = true,
            axisLabels = true,
            backgroundColor = '#ffffff',
            axisColor = '#000000',
            gridColor = '#e0e0e0',
            showLegend = true
        } = options;

        // Create SVG container
        let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;

        // Add background
        svg += `<rect width="${width}" height="${height}" fill="${backgroundColor}" />`;

        // Calculate scaling factors
        const xScale = width / (xMax - xMin);
        const yScale = height / (yMax - yMin);

        // Function to convert data coordinates to SVG coordinates
        const toSVGX = (x: number) => (x - xMin) * xScale;
        const toSVGY = (y: number) => height - (y - yMin) * yScale;

        // Draw grid lines if enabled
        if (gridLines) {
            svg += this.drawGrid(xMin, xMax, yMin, yMax, width, height, toSVGX, toSVGY, gridColor);
        }

        // Draw axes
        svg += this.drawAxes(xMin, xMax, yMin, yMax, width, height, toSVGX, toSVGY, axisColor);

        // Draw axis labels if enabled
        if (axisLabels) {
            svg += this.drawAxisLabels(xMin, xMax, yMin, yMax, width, height, toSVGX, toSVGY, xLabel, yLabel, axisColor);
        }

        // Draw title if provided
        if (title) {
            svg += `<text x="${width / 2}" y="20" text-anchor="middle" font-family="Arial" font-size="16" fill="${axisColor}">${title}</text>`;
        }

        // Draw each data series
        for (const series of data) {
            svg += this.drawDataSeries(series, toSVGX, toSVGY);
        }

        // Draw legend if enabled and there are multiple data series
        if (showLegend && data.length > 1) {
            svg += this.drawLegend(data, width, height);
        }

        // Close SVG tag
        svg += '</svg>';

        return svg;
    }

    /**
     * Render graph to Canvas element
     */
    public renderToCanvas(data: GraphData[], options: GraphOptions): HTMLCanvasElement {
        // Create a canvas element
        const canvas = document.createElement('canvas');
        const {
            width = 600,
            height = 400
        } = options;

        canvas.width = width;
        canvas.height = height;

        // Get the SVG string
        const svgString = this.renderToSVG(data, options);

        // Create an image from the SVG
        const img = new Image();
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(svgBlob);

        // Draw the image to the canvas when loaded
        img.onload = () => {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(img, 0, 0);
                URL.revokeObjectURL(url);
            }
        };

        img.src = url;

        return canvas;
    }

    /**
     * Render graph to image data URL
     */
    public renderToImage(data: GraphData[], options: GraphOptions): string {
        // In a browser environment, we would use canvas.toDataURL()
        // For now, return a placeholder or SVG data URL
        const svgString = this.renderToSVG(data, options);
        const svgBase64 = btoa(svgString);
        return `data:image/svg+xml;base64,${svgBase64}`;
    }

    /**
     * Draw grid lines
     */
    private drawGrid(
        xMin: number,
        xMax: number,
        yMin: number,
        yMax: number,
        width: number,
        height: number,
        toSVGX: (x: number) => number,
        toSVGY: (y: number) => number,
        gridColor: string
    ): string {
        let grid = '';

        // Calculate grid spacing
        const xRange = xMax - xMin;
        const yRange = yMax - yMin;

        // Determine appropriate grid spacing
        const xStep = this.calculateGridStep(xRange);
        const yStep = this.calculateGridStep(yRange);

        // Draw vertical grid lines
        for (let x = Math.ceil(xMin / xStep) * xStep; x <= xMax; x += xStep) {
            const svgX = toSVGX(x);
            grid += `<line x1="${svgX}" y1="0" x2="${svgX}" y2="${height}" stroke="${gridColor}" stroke-width="1" stroke-dasharray="5,5" />`;
        }

        // Draw horizontal grid lines
        for (let y = Math.ceil(yMin / yStep) * yStep; y <= yMax; y += yStep) {
            const svgY = toSVGY(y);
            grid += `<line x1="0" y1="${svgY}" x2="${width}" y2="${svgY}" stroke="${gridColor}" stroke-width="1" stroke-dasharray="5,5" />`;
        }

        return grid;
    }

    /**
     * Calculate appropriate grid step size
     */
    private calculateGridStep(range: number): number {
        const rawStep = range / 10;
        const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));

        if (rawStep / magnitude < 2) {
            return magnitude;
        } else if (rawStep / magnitude < 5) {
            return 2 * magnitude;
        } else {
            return 5 * magnitude;
        }
    }

    /**
     * Draw axes
     */
    private drawAxes(
        xMin: number,
        xMax: number,
        yMin: number,
        yMax: number,
        width: number,
        height: number,
        toSVGX: (x: number) => number,
        toSVGY: (y: number) => number,
        axisColor: string
    ): string {
        let axes = '';

        // Draw x-axis if it's in the visible range
        if (yMin <= 0 && yMax >= 0) {
            const y0 = toSVGY(0);
            axes += `<line x1="0" y1="${y0}" x2="${width}" y2="${y0}" stroke="${axisColor}" stroke-width="2" />`;

            // Draw x-axis ticks
            const xStep = this.calculateGridStep(xMax - xMin);
            for (let x = Math.ceil(xMin / xStep) * xStep; x <= xMax; x += xStep) {
                if (Math.abs(x) < 1e-10) continue; // Skip zero
                const svgX = toSVGX(x);
                axes += `<line x1="${svgX}" y1="${y0 - 5}" x2="${svgX}" y2="${y0 + 5}" stroke="${axisColor}" stroke-width="1" />`;
                axes += `<text x="${svgX}" y="${y0 + 20}" text-anchor="middle" font-family="Arial" font-size="12" fill="${axisColor}">${x}</text>`;
            }
        }

        // Draw y-axis if it's in the visible range
        if (xMin <= 0 && xMax >= 0) {
            const x0 = toSVGX(0);
            axes += `<line x1="${x0}" y1="0" x2="${x0}" y2="${height}" stroke="${axisColor}" stroke-width="2" />`;

            // Draw y-axis ticks
            const yStep = this.calculateGridStep(yMax - yMin);
            for (let y = Math.ceil(yMin / yStep) * yStep; y <= yMax; y += yStep) {
                if (Math.abs(y) < 1e-10) continue; // Skip zero
                const svgY = toSVGY(y);
                axes += `<line x1="${x0 - 5}" y1="${svgY}" x2="${x0 + 5}" y2="${svgY}" stroke="${axisColor}" stroke-width="1" />`;
                axes += `<text x="${x0 - 10}" y="${svgY + 5}" text-anchor="end" font-family="Arial" font-size="12" fill="${axisColor}">${y}</text>`;
            }
        }

        // Draw origin label
        if (xMin <= 0 && xMax >= 0 && yMin <= 0 && yMax >= 0) {
            const x0 = toSVGX(0);
            const y0 = toSVGY(0);
            axes += `<text x="${x0 - 10}" y="${y0 + 20}" text-anchor="end" font-family="Arial" font-size="12" fill="${axisColor}">0</text>`;
        }

        return axes;
    }

    /**
     * Draw axis labels
     */
    private drawAxisLabels(
        xMin: number,
        xMax: number,
        yMin: number,
        yMax: number,
        width: number,
        height: number,
        toSVGX: (x: number) => number,
        toSVGY: (y: number) => number,
        xLabel: string,
        yLabel: string,
        axisColor: string
    ): string {
        let labels = '';

        // Draw x-axis label
        labels += `<text x="${width / 2}" y="${height - 10}" text-anchor="middle" font-family="Arial" font-size="14" fill="${axisColor}">${xLabel}</text>`;

        // Draw y-axis label (rotated)
        labels += `<text x="15" y="${height / 2}" text-anchor="middle" font-family="Arial" font-size="14" fill="${axisColor}" transform="rotate(-90, 15, ${height / 2})">${yLabel}</text>`;

        return labels;
    }

    /**
     * Draw data series
     */
    private drawDataSeries(
        series: GraphData,
        toSVGX: (x: number) => number,
        toSVGY: (y: number) => number
    ): string {
        const { points, color = '#1f77b4', type } = series;

        if (points.length === 0) {
            return '';
        }

        // For 2D and parametric plots, draw a path
        if (type === '2d' || type === 'parametric') {
            // Create path data
            let pathData = `M ${toSVGX(points[0].x)} ${toSVGY(points[0].y)}`;

            for (let i = 1; i < points.length; i++) {
                const current = points[i];
                const prev = points[i - 1];

                // Check for discontinuities
                const dx = current.x - prev.x;
                const dy = current.y - prev.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // If the distance is too large, assume a discontinuity
                if (distance > 5 * (points[1].x - points[0].x)) {
                    pathData += ` M ${toSVGX(current.x)} ${toSVGY(current.y)}`;
                } else {
                    pathData += ` L ${toSVGX(current.x)} ${toSVGY(current.y)}`;
                }
            }

            return `<path d="${pathData}" fill="none" stroke="${color}" stroke-width="2" />`;
        }

        // For 3D plots, we'll just draw points for now
        // A proper 3D renderer would require more complex logic
        if (type === '3d') {
            let pointsData = '';

            for (const point of points) {
                pointsData += `<circle cx="${toSVGX(point.x)}" cy="${toSVGY(point.y)}" r="2" fill="${color}" />`;
            }

            return pointsData;
        }

        return '';
    }

    /**
     * Draw legend
     */
    private drawLegend(
        data: GraphData[],
        width: number,
        height: number
    ): string {
        let legend = '';

        // Calculate legend position and size
        const legendWidth = 150;
        const legendHeight = data.length * 25 + 10;
        const legendX = width - legendWidth - 10;
        const legendY = 10;

        // Draw legend background
        legend += `<rect x="${legendX}" y="${legendY}" width="${legendWidth}" height="${legendHeight}" fill="white" fill-opacity="0.8" stroke="#cccccc" stroke-width="1" />`;

        // Draw legend items
        for (let i = 0; i < data.length; i++) {
            const series = data[i];
            const itemY = legendY + 20 + i * 25;

            // Draw color swatch
            legend += `<line x1="${legendX + 10}" y1="${itemY}" x2="${legendX + 30}" y2="${itemY}" stroke="${series.color || '#1f77b4'}" stroke-width="2" />`;

            // Draw label
            legend += `<text x="${legendX + 40}" y="${itemY + 5}" font-family="Arial" font-size="12" fill="#333333">${series.label || series.expression}</text>`;
        }

        return legend;
    }
}