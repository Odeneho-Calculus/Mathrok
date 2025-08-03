/**
 * Statistics Engine for Mathrok
 * Provides comprehensive statistical analysis and probability distributions
 */

interface DescriptiveResult {
    mean: number;
    median: number;
    mode: number[];
    variance: number;
    standardDeviation: number;
    skewness: number;
    kurtosis: number;
    quartiles: {
        q1: number;
        q2: number;
        q3: number;
        iqr: number;
    };
    outliers: number[];
    range: number;
    count: number;
}

interface ProbabilityResult {
    pdf: number;
    cdf: number;
    percentile: number;
    zScore?: number;
    explanation: string;
}

interface HypothesisResult {
    testStatistic: number;
    pValue: number;
    criticalValue: number;
    rejected: boolean;
    confidence: number;
    method: string;
    conclusion: string;
}

interface RegressionResult {
    slope: number;
    intercept: number;
    rSquared: number;
    correlation: number;
    equation: string;
    residuals: number[];
    standardError: number;
    predictions: number[];
}

interface DistributionParams {
    mean?: number;
    stdDev?: number;
    df?: number;
    lambda?: number;
    alpha?: number;
    beta?: number;
}

export class StatisticsEngine {
    private tolerance = 1e-10;

    /**
     * Compute comprehensive descriptive statistics
     */
    descriptiveStats(data: number[]): DescriptiveResult {
        if (data.length === 0) {
            throw new Error('Cannot compute statistics for empty dataset');
        }

        const sorted = [...data].sort((a, b) => a - b);
        const n = data.length;

        const mean = this.mean(data);
        const variance = this.variance(data);
        const stdDev = Math.sqrt(variance);

        return {
            mean,
            median: this.median(sorted),
            mode: this.mode(data),
            variance,
            standardDeviation: stdDev,
            skewness: this.skewness(data, mean, stdDev),
            kurtosis: this.kurtosis(data, mean, stdDev),
            quartiles: this.quartiles(sorted),
            outliers: this.detectOutliers(data),
            range: sorted[sorted.length - 1] - sorted[0],
            count: n
        };
    }

    /**
     * Normal distribution calculations
     */
    normalDistribution(x: number, mean = 0, stdDev = 1): ProbabilityResult {
        try {
            // More lenient validation with fallback values
            if (isNaN(x)) {
                x = 0;
            }

            // Ensure mean is a valid number
            if (isNaN(mean)) {
                mean = 0;
            }

            // Ensure standard deviation is valid and positive
            if (isNaN(stdDev) || stdDev <= 0) {
                stdDev = 1; // Use default instead of throwing
            }

            const pdf = this.normalPDF(x, mean, stdDev);
            const cdf = this.normalCDF(x, mean, stdDev);
            const zScore = (x - mean) / stdDev;

            return {
                pdf,
                cdf,
                percentile: cdf * 100,
                zScore,
                explanation: this.generateNormalExplanation(x, mean, stdDev, zScore, cdf)
            };
        } catch (error) {
            // Graceful error handling with fallback values
            return {
                pdf: 0,
                cdf: 0.5,
                percentile: 50,
                zScore: 0,
                explanation: "Could not calculate normal distribution due to invalid input parameters."
            };
        }
    }

    /**
     * Student's t-distribution
     */
    tDistribution(x: number, df: number): ProbabilityResult {
        const pdf = this.tPDF(x, df);
        const cdf = this.tCDF(x, df);

        return {
            pdf,
            cdf,
            percentile: cdf * 100,
            explanation: this.generateTExplanation(x, df, cdf)
        };
    }

    /**
     * Chi-square distribution
     */
    chiSquareDistribution(x: number, df: number): ProbabilityResult {
        if (x < 0) {
            throw new Error('Chi-square distribution is only defined for non-negative values');
        }

        const pdf = this.chiSquarePDF(x, df);
        const cdf = this.chiSquareCDF(x, df);

        return {
            pdf,
            cdf,
            percentile: cdf * 100,
            explanation: this.generateChiSquareExplanation(x, df, cdf)
        };
    }

    /**
     * One-sample t-test
     */
    oneSampleTTest(sample: number[], populationMean: number, alpha = 0.05): HypothesisResult {
        const n = sample.length;
        const sampleMean = this.mean(sample);
        const sampleStd = Math.sqrt(this.variance(sample));
        const standardError = sampleStd / Math.sqrt(n);

        const tStatistic = (sampleMean - populationMean) / standardError;
        const df = n - 1;
        const pValue = 2 * (1 - this.tCDF(Math.abs(tStatistic), df));
        const criticalValue = this.tInverse(1 - alpha / 2, df);

        const rejected = Math.abs(tStatistic) > criticalValue;

        return {
            testStatistic: tStatistic,
            pValue,
            criticalValue,
            rejected,
            confidence: (1 - alpha) * 100,
            method: 'one_sample_t_test',
            conclusion: this.generateTTestConclusion(rejected, pValue, alpha, 'one-sample')
        };
    }

    /**
     * Two-sample t-test
     */
    twoSampleTTest(sample1: number[], sample2: number[], alpha = 0.05): HypothesisResult {
        const n1 = sample1.length;
        const n2 = sample2.length;
        const mean1 = this.mean(sample1);
        const mean2 = this.mean(sample2);
        const var1 = this.variance(sample1);
        const var2 = this.variance(sample2);

        // Welch's t-test (unequal variances)
        const standardError = Math.sqrt(var1 / n1 + var2 / n2);
        const tStatistic = (mean1 - mean2) / standardError;

        // Welch-Satterthwaite equation for degrees of freedom
        const df = Math.pow(var1 / n1 + var2 / n2, 2) /
            (Math.pow(var1 / n1, 2) / (n1 - 1) + Math.pow(var2 / n2, 2) / (n2 - 1));

        const pValue = 2 * (1 - this.tCDF(Math.abs(tStatistic), df));
        const criticalValue = this.tInverse(1 - alpha / 2, df);
        const rejected = Math.abs(tStatistic) > criticalValue;

        return {
            testStatistic: tStatistic,
            pValue,
            criticalValue,
            rejected,
            confidence: (1 - alpha) * 100,
            method: 'two_sample_t_test',
            conclusion: this.generateTTestConclusion(rejected, pValue, alpha, 'two-sample')
        };
    }

    /**
     * Linear regression analysis
     */
    linearRegression(x: number[], y: number[]): RegressionResult {
        if (x.length !== y.length) {
            throw new Error('X and Y arrays must have the same length');
        }

        const n = x.length;
        const meanX = this.mean(x);
        const meanY = this.mean(y);

        // Calculate slope and intercept
        let numerator = 0;
        let denominator = 0;

        for (let i = 0; i < n; i++) {
            numerator += (x[i] - meanX) * (y[i] - meanY);
            denominator += (x[i] - meanX) * (x[i] - meanX);
        }

        const slope = numerator / denominator;
        const intercept = meanY - slope * meanX;

        // Calculate correlation coefficient
        const correlation = this.correlation(x, y);
        const rSquared = correlation * correlation;

        // Calculate residuals and predictions
        const predictions: number[] = [];
        const residuals: number[] = [];
        let sumSquaredResiduals = 0;

        for (let i = 0; i < n; i++) {
            const predicted = slope * x[i] + intercept;
            predictions.push(predicted);

            const residual = y[i] - predicted;
            residuals.push(residual);
            sumSquaredResiduals += residual * residual;
        }

        const standardError = Math.sqrt(sumSquaredResiduals / (n - 2));

        return {
            slope,
            intercept,
            rSquared,
            correlation,
            equation: `y = ${slope.toFixed(4)}x + ${intercept.toFixed(4)}`,
            residuals,
            standardError,
            predictions
        };
    }

    /**
     * ANOVA (Analysis of Variance)
     */
    anova(groups: number[][]): {
        fStatistic: number;
        pValue: number;
        dfBetween: number;
        dfWithin: number;
        msBetween: number;
        msWithin: number;
        rejected: boolean;
        alpha: number;
    } {
        const alpha = 0.05;
        const k = groups.length; // number of groups
        const n = groups.reduce((sum, group) => sum + group.length, 0); // total observations

        // Calculate group means and overall mean
        const groupMeans = groups.map(group => this.mean(group));
        const overallMean = this.mean(groups.flat());

        // Calculate sum of squares
        let ssBetween = 0;
        let ssWithin = 0;

        for (let i = 0; i < k; i++) {
            const groupSize = groups[i].length;
            const groupMean = groupMeans[i];

            // Between-group sum of squares
            ssBetween += groupSize * Math.pow(groupMean - overallMean, 2);

            // Within-group sum of squares
            for (const value of groups[i]) {
                ssWithin += Math.pow(value - groupMean, 2);
            }
        }

        const dfBetween = k - 1;
        const dfWithin = n - k;
        const msBetween = ssBetween / dfBetween;
        const msWithin = ssWithin / dfWithin;
        const fStatistic = msBetween / msWithin;

        // Calculate p-value using F-distribution
        const pValue = 1 - this.fCDF(fStatistic, dfBetween, dfWithin);
        const criticalValue = this.fInverse(1 - alpha, dfBetween, dfWithin);
        const rejected = fStatistic > criticalValue;

        return {
            fStatistic,
            pValue,
            dfBetween,
            dfWithin,
            msBetween,
            msWithin,
            rejected,
            alpha
        };
    }

    // Basic statistical functions

    private mean(data: number[]): number {
        return data.reduce((sum, value) => sum + value, 0) / data.length;
    }

    private median(sortedData: number[]): number {
        const n = sortedData.length;
        if (n % 2 === 0) {
            return (sortedData[n / 2 - 1] + sortedData[n / 2]) / 2;
        } else {
            return sortedData[Math.floor(n / 2)];
        }
    }

    private mode(data: number[]): number[] {
        const frequency = new Map<number, number>();
        let maxFreq = 0;

        for (const value of data) {
            const freq = (frequency.get(value) || 0) + 1;
            frequency.set(value, freq);
            maxFreq = Math.max(maxFreq, freq);
        }

        const modes: number[] = [];
        for (const [value, freq] of frequency.entries()) {
            if (freq === maxFreq) {
                modes.push(value);
            }
        }

        return modes;
    }

    private variance(data: number[]): number {
        const meanValue = this.mean(data);
        const sumSquaredDiffs = data.reduce((sum, value) => {
            return sum + Math.pow(value - meanValue, 2);
        }, 0);
        return sumSquaredDiffs / (data.length - 1); // Sample variance
    }

    private skewness(data: number[], mean: number, stdDev: number): number {
        const n = data.length;
        const sumCubedDeviations = data.reduce((sum, value) => {
            return sum + Math.pow((value - mean) / stdDev, 3);
        }, 0);
        return (n / ((n - 1) * (n - 2))) * sumCubedDeviations;
    }

    private kurtosis(data: number[], mean: number, stdDev: number): number {
        const n = data.length;
        const sumQuartedDeviations = data.reduce((sum, value) => {
            return sum + Math.pow((value - mean) / stdDev, 4);
        }, 0);
        const kurtosis = (n * (n + 1) / ((n - 1) * (n - 2) * (n - 3))) * sumQuartedDeviations;
        return kurtosis - 3 * (n - 1) * (n - 1) / ((n - 2) * (n - 3)); // Excess kurtosis
    }

    private quartiles(sortedData: number[]): {
        q1: number;
        q2: number;
        q3: number;
        iqr: number;
    } {
        const n = sortedData.length;
        const q2 = this.median(sortedData);

        const lowerHalf = sortedData.slice(0, Math.floor(n / 2));
        const upperHalf = sortedData.slice(Math.ceil(n / 2));

        const q1 = this.median(lowerHalf);
        const q3 = this.median(upperHalf);

        return {
            q1,
            q2,
            q3,
            iqr: q3 - q1
        };
    }

    private detectOutliers(data: number[]): number[] {
        const sorted = [...data].sort((a, b) => a - b);
        const quartiles = this.quartiles(sorted);
        const lowerBound = quartiles.q1 - 1.5 * quartiles.iqr;
        const upperBound = quartiles.q3 + 1.5 * quartiles.iqr;

        return data.filter(value => value < lowerBound || value > upperBound);
    }

    private correlation(x: number[], y: number[]): number {
        const n = x.length;
        const meanX = this.mean(x);
        const meanY = this.mean(y);

        let numerator = 0;
        let sumXSquared = 0;
        let sumYSquared = 0;

        for (let i = 0; i < n; i++) {
            const xDiff = x[i] - meanX;
            const yDiff = y[i] - meanY;

            numerator += xDiff * yDiff;
            sumXSquared += xDiff * xDiff;
            sumYSquared += yDiff * yDiff;
        }

        return numerator / Math.sqrt(sumXSquared * sumYSquared);
    }

    // Probability density functions

    private normalPDF(x: number, mean: number, stdDev: number): number {
        const coefficient = 1 / (stdDev * Math.sqrt(2 * Math.PI));
        const exponent = -0.5 * Math.pow((x - mean) / stdDev, 2);
        return coefficient * Math.exp(exponent);
    }

    private tPDF(x: number, df: number): number {
        const gamma1 = this.gamma((df + 1) / 2);
        const gamma2 = this.gamma(df / 2);
        const coefficient = gamma1 / (Math.sqrt(df * Math.PI) * gamma2);
        return coefficient * Math.pow(1 + (x * x) / df, -(df + 1) / 2);
    }

    private chiSquarePDF(x: number, df: number): number {
        if (x <= 0) return 0;

        const coefficient = 1 / (Math.pow(2, df / 2) * this.gamma(df / 2));
        return coefficient * Math.pow(x, df / 2 - 1) * Math.exp(-x / 2);
    }

    // Cumulative distribution functions

    private normalCDF(x: number, mean: number, stdDev: number): number {
        const z = (x - mean) / stdDev;
        return 0.5 * (1 + this.erf(z / Math.sqrt(2)));
    }

    private tCDF(x: number, df: number): number {
        // Approximation for t-distribution CDF
        if (df >= 30) {
            return this.normalCDF(x, 0, 1);
        }

        // Use incomplete beta function for exact calculation
        const t = x / Math.sqrt(df);
        const beta = 0.5 * this.incompleteBeta(0.5, df / 2, df / (df + x * x));

        if (x >= 0) {
            return 0.5 + beta;
        } else {
            return 0.5 - beta;
        }
    }

    private chiSquareCDF(x: number, df: number): number {
        if (x <= 0) return 0;
        return this.incompleteGamma(df / 2, x / 2) / this.gamma(df / 2);
    }

    private fCDF(x: number, df1: number, df2: number): number {
        if (x <= 0) return 0;

        const beta = this.incompleteBeta(df1 / 2, df2 / 2, (df1 * x) / (df1 * x + df2));
        return beta;
    }

    // Inverse distribution functions

    private tInverse(p: number, df: number): number {
        // Approximation for t-distribution inverse
        if (df >= 30) {
            return this.normalInverse(p);
        }

        // Newton-Raphson method for t-distribution inverse
        let x = this.normalInverse(p); // Initial guess

        for (let i = 0; i < 10; i++) {
            const fx = this.tCDF(x, df) - p;
            const fpx = this.tPDF(x, df);

            if (Math.abs(fx) < this.tolerance) break;

            x = x - fx / fpx;
        }

        return x;
    }

    private normalInverse(p: number): number {
        // Beasley-Springer-Moro algorithm
        const a = [0, -3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02, 1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00];
        const b = [0, -5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02, 6.680131188771972e+01, -1.328068155288572e+01];
        const c = [0, -7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00, -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00];
        const d = [0, 7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00, 3.754408661907416e+00];

        if (p < 0 || p > 1) {
            throw new Error('Probability must be between 0 and 1');
        }

        if (p === 0) return -Infinity;
        if (p === 1) return Infinity;
        if (p === 0.5) return 0;

        const q = p < 0.5 ? p : 1 - p;

        let x: number;
        if (q > 1.25e-3) {
            const w = Math.sqrt(-2 * Math.log(q));
            x = (((((c[1] * w + c[2]) * w + c[3]) * w + c[4]) * w + c[5]) * w + c[6]) /
                ((((d[1] * w + d[2]) * w + d[3]) * w + d[4]) * w + 1);
        } else {
            const t = Math.sqrt(-2 * Math.log(q));
            x = (((((a[1] * t + a[2]) * t + a[3]) * t + a[4]) * t + a[5]) * t + a[6]) /
                (((((b[1] * t + b[2]) * t + b[3]) * t + b[4]) * t + b[5]) * t + 1);
        }

        return p < 0.5 ? -x : x;
    }

    private fInverse(p: number, df1: number, df2: number): number {
        // Approximation for F-distribution inverse
        // This is a simplified implementation
        if (p <= 0) return 0;
        if (p >= 1) return Infinity;

        // Use Newton-Raphson method
        let x = 1; // Initial guess

        for (let i = 0; i < 20; i++) {
            const fx = this.fCDF(x, df1, df2) - p;
            const fpx = this.fPDF(x, df1, df2);

            if (Math.abs(fx) < this.tolerance) break;

            x = Math.max(0.001, x - fx / fpx);
        }

        return x;
    }

    private fPDF(x: number, df1: number, df2: number): number {
        if (x <= 0) return 0;

        const beta = this.beta(df1 / 2, df2 / 2);
        const coefficient = Math.pow(df1 / df2, df1 / 2) / beta;
        const numerator = Math.pow(x, df1 / 2 - 1);
        const denominator = Math.pow(1 + (df1 / df2) * x, (df1 + df2) / 2);

        return coefficient * numerator / denominator;
    }

    // Special functions

    private gamma(z: number): number {
        // Lanczos approximation
        const g = 7;
        const p = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];

        if (z < 0.5) {
            return Math.PI / (Math.sin(Math.PI * z) * this.gamma(1 - z));
        }

        z -= 1;
        let x = p[0];
        for (let i = 1; i < g + 2; i++) {
            x += p[i] / (z + i);
        }

        const t = z + g + 0.5;
        return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
    }

    private beta(a: number, b: number): number {
        return this.gamma(a) * this.gamma(b) / this.gamma(a + b);
    }

    private erf(x: number): number {
        // Abramowitz and Stegun approximation
        const a1 = 0.254829592;
        const a2 = -0.284496736;
        const a3 = 1.421413741;
        const a4 = -1.453152027;
        const a5 = 1.061405429;
        const p = 0.3275911;

        const sign = x >= 0 ? 1 : -1;
        x = Math.abs(x);

        const t = 1.0 / (1.0 + p * x);
        const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

        return sign * y;
    }

    private incompleteBeta(a: number, b: number, x: number): number {
        // Simplified incomplete beta function
        if (x === 0) return 0;
        if (x === 1) return 1;

        // Use continued fraction approximation
        const bt = Math.exp(this.logGamma(a + b) - this.logGamma(a) - this.logGamma(b) + a * Math.log(x) + b * Math.log(1 - x));

        if (x < (a + 1) / (a + b + 2)) {
            return bt * this.betaContinuedFraction(a, b, x) / a;
        } else {
            return 1 - bt * this.betaContinuedFraction(b, a, 1 - x) / b;
        }
    }

    private incompleteGamma(a: number, x: number): number {
        // Simplified incomplete gamma function
        if (x === 0) return 0;

        // Use series expansion for small x
        if (x < a + 1) {
            let sum = 1;
            let term = 1;

            for (let n = 1; n < 100; n++) {
                term *= x / (a + n - 1);
                sum += term;

                if (Math.abs(term) < this.tolerance) break;
            }

            return Math.exp(-x + a * Math.log(x) - this.logGamma(a)) * sum;
        } else {
            // Use continued fraction for large x
            return this.gamma(a) - this.incompleteGammaUpper(a, x);
        }
    }

    private incompleteGammaUpper(a: number, x: number): number {
        // Simplified upper incomplete gamma function
        const cf = this.gammaContinuedFraction(a, x);
        return Math.exp(-x + a * Math.log(x) - this.logGamma(a)) * cf;
    }

    private logGamma(z: number): number {
        return Math.log(this.gamma(z));
    }

    private betaContinuedFraction(a: number, b: number, x: number): number {
        const maxIterations = 100;
        const eps = 1e-15;

        const qab = a + b;
        const qap = a + 1;
        const qam = a - 1;
        let c = 1;
        let d = 1 - qab * x / qap;

        if (Math.abs(d) < eps) d = eps;
        d = 1 / d;
        let h = d;

        for (let m = 1; m <= maxIterations; m++) {
            const m2 = 2 * m;
            let aa = m * (b - m) * x / ((qam + m2) * (a + m2));
            d = 1 + aa * d;
            if (Math.abs(d) < eps) d = eps;
            c = 1 + aa / c;
            if (Math.abs(c) < eps) c = eps;
            d = 1 / d;
            h *= d * c;

            aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
            d = 1 + aa * d;
            if (Math.abs(d) < eps) d = eps;
            c = 1 + aa / c;
            if (Math.abs(c) < eps) c = eps;
            d = 1 / d;
            const del = d * c;
            h *= del;

            if (Math.abs(del - 1) < eps) break;
        }

        return h;
    }

    private gammaContinuedFraction(a: number, x: number): number {
        const maxIterations = 100;
        const eps = 1e-15;

        let b = x + 1 - a;
        let c = 1e30;
        let d = 1 / b;
        let h = d;

        for (let i = 1; i <= maxIterations; i++) {
            const an = -i * (i - a);
            b += 2;
            d = an * d + b;
            if (Math.abs(d) < eps) d = eps;
            c = b + an / c;
            if (Math.abs(c) < eps) c = eps;
            d = 1 / d;
            const del = d * c;
            h *= del;

            if (Math.abs(del - 1) < eps) break;
        }

        return h;
    }

    // Explanation generators

    private generateNormalExplanation(x: number, mean: number, stdDev: number, zScore: number, cdf: number): string {
        const percentile = (cdf * 100).toFixed(1);
        return `For a normal distribution with mean ${mean} and standard deviation ${stdDev}, ` +
            `the value ${x} has a z-score of ${zScore.toFixed(3)} and falls at the ${percentile}th percentile.`;
    }

    private generateTExplanation(x: number, df: number, cdf: number): string {
        const percentile = (cdf * 100).toFixed(1);
        return `For a t-distribution with ${df} degrees of freedom, ` +
            `the value ${x} falls at the ${percentile}th percentile.`;
    }

    private generateChiSquareExplanation(x: number, df: number, cdf: number): string {
        const percentile = (cdf * 100).toFixed(1);
        return `For a chi-square distribution with ${df} degrees of freedom, ` +
            `the value ${x} falls at the ${percentile}th percentile.`;
    }

    private generateTTestConclusion(rejected: boolean, pValue: number, alpha: number, type: string): string {
        const conclusion = rejected ? 'reject' : 'fail to reject';
        return `Based on the ${type} t-test with α = ${alpha}, we ${conclusion} the null hypothesis ` +
            `(p-value = ${pValue.toFixed(4)}).`;
    }
}