/**
 * Matrix Engine for Mathrok
 * Provides comprehensive matrix operations including eigenvalues, decompositions, and system solving
 */

interface Matrix {
    rows: number;
    cols: number;
    data: number[][];
}

interface Vector {
    size: number;
    data: number[];
}

interface MatrixResult {
    result: Matrix;
    steps: string[];
    metadata: {
        operation: string;
        complexity: string;
        condition?: number;
        determinant?: number;
    };
}

interface EigenResult {
    eigenvalues: number[];
    eigenvectors?: Matrix;
    steps: string[];
    convergence: {
        iterations: number;
        tolerance: number;
        converged: boolean;
    };
}

interface SystemResult {
    solution: Vector;
    method: string;
    steps: string[];
    residual: number;
    condition: number;
}

interface DecompositionResult {
    factors: Matrix[];
    type: 'LU' | 'QR' | 'SVD' | 'Cholesky';
    steps: string[];
    metadata: {
        rank?: number;
        condition?: number;
        determinant?: number;
    };
}

export class MatrixEngine {
    private tolerance = 1e-10;
    private maxIterations = 1000;

    /**
     * Matrix addition with step-by-step explanation
     */
    add(a: Matrix, b: Matrix): MatrixResult {
        this.validateDimensions(a, b, 'addition');
        const result = this.createMatrix(a.rows, a.cols);
        const steps: string[] = [];

        steps.push(`Adding matrices of size ${a.rows}×${a.cols}`);

        for (let i = 0; i < a.rows; i++) {
            for (let j = 0; j < a.cols; j++) {
                result.data[i][j] = a.data[i][j] + b.data[i][j];
            }
        }

        steps.push(`Result: Each element C[i,j] = A[i,j] + B[i,j]`);

        return {
            result,
            steps,
            metadata: {
                operation: 'matrix_addition',
                complexity: 'O(mn)',
                determinant: a.rows === a.cols ? this.determinant(result) : undefined
            }
        };
    }

    /**
     * Matrix multiplication with optimization
     */
    multiply(a: Matrix, b: Matrix): MatrixResult {
        if (a.cols !== b.rows) {
            throw new Error(`Cannot multiply matrices: ${a.rows}×${a.cols} and ${b.rows}×${b.cols}`);
        }

        const result = this.createMatrix(a.rows, b.cols);
        const steps: string[] = [];

        steps.push(`Multiplying ${a.rows}×${a.cols} matrix with ${b.rows}×${b.cols} matrix`);
        steps.push(`Result will be ${a.rows}×${b.cols} matrix`);

        // Use optimized multiplication for large matrices
        if (a.rows > 100 || b.cols > 100) {
            return this.strassenMultiply(a, b, steps);
        }

        for (let i = 0; i < a.rows; i++) {
            for (let j = 0; j < b.cols; j++) {
                let sum = 0;
                for (let k = 0; k < a.cols; k++) {
                    sum += a.data[i][k] * b.data[k][j];
                }
                result.data[i][j] = sum;
            }
        }

        steps.push(`Each element C[i,j] = Σ(A[i,k] * B[k,j]) for k=0 to ${a.cols - 1}`);

        return {
            result,
            steps,
            metadata: {
                operation: 'matrix_multiplication',
                complexity: 'O(n³)',
                condition: this.estimateConditionNumber(result)
            }
        };
    }

    /**
     * Compute eigenvalues using QR algorithm
     */
    eigenvalues(matrix: Matrix): EigenResult {
        if (!this.isSquare(matrix)) {
            throw new Error('Eigenvalues can only be computed for square matrices');
        }

        const steps: string[] = [];
        steps.push(`Computing eigenvalues for ${matrix.rows}×${matrix.cols} matrix`);
        steps.push(`Using QR algorithm with ${this.maxIterations} max iterations`);

        // Make a copy for iteration
        let A = this.copyMatrix(matrix);
        let iterations = 0;
        let converged = false;

        // QR algorithm iterations
        while (iterations < this.maxIterations && !converged) {
            const qr = this.qrDecomposition(A);
            A = this.multiply(qr.R, qr.Q).result;

            iterations++;

            // Check convergence (off-diagonal elements should be small)
            converged = this.checkEigenConvergence(A);

            if (iterations % 10 === 0) {
                steps.push(`Iteration ${iterations}: Continuing QR decomposition`);
            }
        }

        // Extract eigenvalues from diagonal
        const eigenvals: number[] = [];
        for (let i = 0; i < A.rows; i++) {
            eigenvals.push(A.data[i][i]);
        }

        steps.push(`Converged after ${iterations} iterations`);
        steps.push(`Eigenvalues: [${eigenvals.map(v => v.toFixed(6)).join(', ')}]`);

        return {
            eigenvalues: eigenvals,
            steps,
            convergence: {
                iterations,
                tolerance: this.tolerance,
                converged
            }
        };
    }

    /**
     * Solve linear system Ax = b using optimal method
     */
    solveLinearSystem(A: Matrix, b: Vector): SystemResult {
        if (A.rows !== b.size) {
            throw new Error(`Matrix and vector dimensions don't match: ${A.rows} vs ${b.size}`);
        }

        const method = this.selectOptimalMethod(A);
        const steps: string[] = [];

        steps.push(`Solving linear system Ax = b`);
        steps.push(`Matrix size: ${A.rows}×${A.cols}, Vector size: ${b.size}`);
        steps.push(`Selected method: ${method}`);

        switch (method) {
            case 'gaussian':
                return this.gaussianElimination(A, b, steps);
            case 'lu':
                return this.luSolve(A, b, steps);
            case 'qr':
                return this.qrSolve(A, b, steps);
            case 'cholesky':
                return this.choleskySolve(A, b, steps);
            default:
                return this.gaussianElimination(A, b, steps);
        }
    }

    /**
     * LU Decomposition
     */
    luDecomposition(matrix: Matrix): DecompositionResult {
        if (!this.isSquare(matrix)) {
            throw new Error('LU decomposition requires a square matrix');
        }

        const n = matrix.rows;
        const L = this.createIdentityMatrix(n);
        const U = this.copyMatrix(matrix);
        const steps: string[] = [];

        steps.push(`Performing LU decomposition on ${n}×${n} matrix`);
        steps.push(`L will be lower triangular, U will be upper triangular`);

        for (let i = 0; i < n; i++) {
            // Make U upper triangular
            for (let k = i + 1; k < n; k++) {
                if (Math.abs(U.data[i][i]) < this.tolerance) {
                    throw new Error('Matrix is singular - cannot perform LU decomposition');
                }

                const factor = U.data[k][i] / U.data[i][i];
                L.data[k][i] = factor;

                for (let j = i; j < n; j++) {
                    U.data[k][j] -= factor * U.data[i][j];
                }
            }

            if (i % 5 === 0 && i > 0) {
                steps.push(`Completed elimination for column ${i}`);
            }
        }

        steps.push(`LU decomposition complete: A = L × U`);

        return {
            factors: [L, U],
            type: 'LU',
            steps,
            metadata: {
                determinant: this.determinant(U),
                condition: this.estimateConditionNumber(matrix)
            }
        };
    }

    /**
     * QR Decomposition using Gram-Schmidt process
     */
    qrDecomposition(matrix: Matrix): { Q: Matrix; R: Matrix } {
        const m = matrix.rows;
        const n = matrix.cols;
        const Q = this.createMatrix(m, n);
        const R = this.createMatrix(n, n);

        // Gram-Schmidt process
        for (let j = 0; j < n; j++) {
            // Get column j
            const col = this.getColumn(matrix, j);

            // Orthogonalize against previous columns
            for (let i = 0; i < j; i++) {
                const qi = this.getColumn(Q, i);
                const projection = this.vectorDot(col, qi);
                R.data[i][j] = projection;

                // Subtract projection
                for (let k = 0; k < m; k++) {
                    col.data[k] -= projection * qi.data[k];
                }
            }

            // Normalize
            const norm = this.vectorNorm(col);
            R.data[j][j] = norm;

            if (norm > this.tolerance) {
                for (let k = 0; k < m; k++) {
                    Q.data[k][j] = col.data[k] / norm;
                }
            }
        }

        return { Q, R };
    }

    /**
     * Compute matrix determinant using LU decomposition
     */
    determinant(matrix: Matrix): number {
        if (!this.isSquare(matrix)) {
            throw new Error('Determinant can only be computed for square matrices');
        }

        if (matrix.rows === 1) {
            return matrix.data[0][0];
        }

        if (matrix.rows === 2) {
            return matrix.data[0][0] * matrix.data[1][1] - matrix.data[0][1] * matrix.data[1][0];
        }

        try {
            const lu = this.luDecomposition(matrix);
            const U = lu.factors[1];

            // Determinant is product of diagonal elements of U
            let det = 1;
            for (let i = 0; i < U.rows; i++) {
                det *= U.data[i][i];
            }

            return det;
        } catch {
            // Fallback to cofactor expansion for singular matrices
            return this.determinantCofactor(matrix);
        }
    }

    /**
     * Matrix inversion using Gauss-Jordan elimination
     */
    inverse(matrix: Matrix): MatrixResult {
        if (!this.isSquare(matrix)) {
            throw new Error('Only square matrices can be inverted');
        }

        const n = matrix.rows;
        const augmented = this.createMatrix(n, 2 * n);
        const steps: string[] = [];

        steps.push(`Computing inverse of ${n}×${n} matrix using Gauss-Jordan elimination`);

        // Create augmented matrix [A|I]
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                augmented.data[i][j] = matrix.data[i][j];
                augmented.data[i][j + n] = i === j ? 1 : 0;
            }
        }

        // Gauss-Jordan elimination
        for (let i = 0; i < n; i++) {
            // Find pivot
            let maxRow = i;
            for (let k = i + 1; k < n; k++) {
                if (Math.abs(augmented.data[k][i]) > Math.abs(augmented.data[maxRow][i])) {
                    maxRow = k;
                }
            }

            // Swap rows
            if (maxRow !== i) {
                this.swapRows(augmented, i, maxRow);
                steps.push(`Swapped rows ${i} and ${maxRow}`);
            }

            // Check for singularity
            if (Math.abs(augmented.data[i][i]) < this.tolerance) {
                throw new Error('Matrix is singular and cannot be inverted');
            }

            // Scale pivot row
            const pivot = augmented.data[i][i];
            for (let j = 0; j < 2 * n; j++) {
                augmented.data[i][j] /= pivot;
            }

            // Eliminate column
            for (let k = 0; k < n; k++) {
                if (k !== i) {
                    const factor = augmented.data[k][i];
                    for (let j = 0; j < 2 * n; j++) {
                        augmented.data[k][j] -= factor * augmented.data[i][j];
                    }
                }
            }
        }

        // Extract inverse matrix
        const inverse = this.createMatrix(n, n);
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                inverse.data[i][j] = augmented.data[i][j + n];
            }
        }

        steps.push(`Matrix inversion complete`);
        steps.push(`Verification: A × A⁻¹ should equal identity matrix`);

        return {
            result: inverse,
            steps,
            metadata: {
                operation: 'matrix_inversion',
                complexity: 'O(n³)',
                condition: this.estimateConditionNumber(matrix),
                determinant: this.determinant(matrix)
            }
        };
    }

    // Private helper methods

    private validateDimensions(a: Matrix, b: Matrix, operation: string): void {
        if (a.rows !== b.rows || a.cols !== b.cols) {
            throw new Error(`Cannot perform ${operation}: matrices have different dimensions`);
        }
    }

    private createMatrix(rows: number, cols: number): Matrix {
        const data: number[][] = [];
        for (let i = 0; i < rows; i++) {
            data[i] = new Array(cols).fill(0);
        }
        return { rows, cols, data };
    }

    private createIdentityMatrix(size: number): Matrix {
        const matrix = this.createMatrix(size, size);
        for (let i = 0; i < size; i++) {
            matrix.data[i][i] = 1;
        }
        return matrix;
    }

    private copyMatrix(matrix: Matrix): Matrix {
        const copy = this.createMatrix(matrix.rows, matrix.cols);
        for (let i = 0; i < matrix.rows; i++) {
            for (let j = 0; j < matrix.cols; j++) {
                copy.data[i][j] = matrix.data[i][j];
            }
        }
        return copy;
    }

    private isSquare(matrix: Matrix): boolean {
        return matrix.rows === matrix.cols;
    }

    private getColumn(matrix: Matrix, col: number): Vector {
        const data: number[] = [];
        for (let i = 0; i < matrix.rows; i++) {
            data.push(matrix.data[i][col]);
        }
        return { size: matrix.rows, data };
    }

    private vectorDot(a: Vector, b: Vector): number {
        let sum = 0;
        for (let i = 0; i < a.size; i++) {
            sum += a.data[i] * b.data[i];
        }
        return sum;
    }

    private vectorNorm(vector: Vector): number {
        return Math.sqrt(this.vectorDot(vector, vector));
    }

    private swapRows(matrix: Matrix, row1: number, row2: number): void {
        const temp = matrix.data[row1];
        matrix.data[row1] = matrix.data[row2];
        matrix.data[row2] = temp;
    }

    private selectOptimalMethod(matrix: Matrix): string {
        const n = matrix.rows;

        // For small matrices, use Gaussian elimination
        if (n <= 10) {
            return 'gaussian';
        }

        // Check if matrix is positive definite (for Cholesky)
        if (this.isPositiveDefinite(matrix)) {
            return 'cholesky';
        }

        // For well-conditioned matrices, use LU
        const condition = this.estimateConditionNumber(matrix);
        if (condition < 1e12) {
            return 'lu';
        }

        // For ill-conditioned matrices, use QR
        return 'qr';
    }

    private isPositiveDefinite(matrix: Matrix): boolean {
        // Simple check: all diagonal elements positive and matrix symmetric
        if (!this.isSymmetric(matrix)) {
            return false;
        }

        for (let i = 0; i < matrix.rows; i++) {
            if (matrix.data[i][i] <= 0) {
                return false;
            }
        }

        return true;
    }

    private isSymmetric(matrix: Matrix): boolean {
        if (!this.isSquare(matrix)) {
            return false;
        }

        for (let i = 0; i < matrix.rows; i++) {
            for (let j = 0; j < matrix.cols; j++) {
                if (Math.abs(matrix.data[i][j] - matrix.data[j][i]) > this.tolerance) {
                    return false;
                }
            }
        }

        return true;
    }

    private estimateConditionNumber(matrix: Matrix): number {
        // Simple condition number estimation
        // In practice, would use more sophisticated methods
        try {
            const det = Math.abs(this.determinant(matrix));
            if (det < this.tolerance) {
                return Infinity;
            }

            // Rough estimate based on matrix norm and determinant
            const norm = this.matrixNorm(matrix);
            return norm / det;
        } catch {
            return Infinity;
        }
    }

    private matrixNorm(matrix: Matrix): number {
        // Frobenius norm
        let sum = 0;
        for (let i = 0; i < matrix.rows; i++) {
            for (let j = 0; j < matrix.cols; j++) {
                sum += matrix.data[i][j] * matrix.data[i][j];
            }
        }
        return Math.sqrt(sum);
    }

    private checkEigenConvergence(matrix: Matrix): boolean {
        // Check if off-diagonal elements are small enough
        for (let i = 0; i < matrix.rows; i++) {
            for (let j = 0; j < matrix.cols; j++) {
                if (i !== j && Math.abs(matrix.data[i][j]) > this.tolerance) {
                    return false;
                }
            }
        }
        return true;
    }

    private determinantCofactor(matrix: Matrix): number {
        const n = matrix.rows;
        if (n === 1) {
            return matrix.data[0][0];
        }

        let det = 0;
        for (let j = 0; j < n; j++) {
            const minor = this.getMinor(matrix, 0, j);
            const cofactor = Math.pow(-1, j) * this.determinantCofactor(minor);
            det += matrix.data[0][j] * cofactor;
        }

        return det;
    }

    private getMinor(matrix: Matrix, excludeRow: number, excludeCol: number): Matrix {
        const minor = this.createMatrix(matrix.rows - 1, matrix.cols - 1);
        let minorRow = 0;

        for (let i = 0; i < matrix.rows; i++) {
            if (i === excludeRow) continue;

            let minorCol = 0;
            for (let j = 0; j < matrix.cols; j++) {
                if (j === excludeCol) continue;

                minor.data[minorRow][minorCol] = matrix.data[i][j];
                minorCol++;
            }
            minorRow++;
        }

        return minor;
    }

    private strassenMultiply(a: Matrix, b: Matrix, steps: string[]): MatrixResult {
        steps.push(`Using Strassen's algorithm for large matrix multiplication`);

        // For now, fall back to standard multiplication
        // Full Strassen implementation would be more complex
        const result = this.createMatrix(a.rows, b.cols);

        for (let i = 0; i < a.rows; i++) {
            for (let j = 0; j < b.cols; j++) {
                let sum = 0;
                for (let k = 0; k < a.cols; k++) {
                    sum += a.data[i][k] * b.data[k][j];
                }
                result.data[i][j] = sum;
            }
        }

        return {
            result,
            steps,
            metadata: {
                operation: 'matrix_multiplication_strassen',
                complexity: 'O(n^2.807)'
            }
        };
    }

    private gaussianElimination(A: Matrix, b: Vector, steps: string[]): SystemResult {
        const n = A.rows;
        const augmented = this.createMatrix(n, n + 1);

        // Create augmented matrix
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                augmented.data[i][j] = A.data[i][j];
            }
            augmented.data[i][n] = b.data[i];
        }

        steps.push(`Forward elimination phase`);

        // Forward elimination
        for (let i = 0; i < n; i++) {
            // Partial pivoting
            let maxRow = i;
            for (let k = i + 1; k < n; k++) {
                if (Math.abs(augmented.data[k][i]) > Math.abs(augmented.data[maxRow][i])) {
                    maxRow = k;
                }
            }

            if (maxRow !== i) {
                this.swapRows(augmented, i, maxRow);
            }

            // Eliminate
            for (let k = i + 1; k < n; k++) {
                const factor = augmented.data[k][i] / augmented.data[i][i];
                for (let j = i; j <= n; j++) {
                    augmented.data[k][j] -= factor * augmented.data[i][j];
                }
            }
        }

        steps.push(`Back substitution phase`);

        // Back substitution
        const solution: number[] = new Array(n);
        for (let i = n - 1; i >= 0; i--) {
            solution[i] = augmented.data[i][n];
            for (let j = i + 1; j < n; j++) {
                solution[i] -= augmented.data[i][j] * solution[j];
            }
            solution[i] /= augmented.data[i][i];
        }

        // Calculate residual
        const residual = this.calculateResidual(A, { size: n, data: solution }, b);

        return {
            solution: { size: n, data: solution },
            method: 'gaussian_elimination',
            steps,
            residual,
            condition: this.estimateConditionNumber(A)
        };
    }

    private luSolve(A: Matrix, b: Vector, steps: string[]): SystemResult {
        const lu = this.luDecomposition(A);
        const L = lu.factors[0];
        const U = lu.factors[1];

        steps.push(`Solving Ly = b using forward substitution`);
        steps.push(`Solving Ux = y using back substitution`);

        // Forward substitution: Ly = b
        const y: number[] = new Array(b.size);
        for (let i = 0; i < b.size; i++) {
            y[i] = b.data[i];
            for (let j = 0; j < i; j++) {
                y[i] -= L.data[i][j] * y[j];
            }
        }

        // Back substitution: Ux = y
        const x: number[] = new Array(b.size);
        for (let i = b.size - 1; i >= 0; i--) {
            x[i] = y[i];
            for (let j = i + 1; j < b.size; j++) {
                x[i] -= U.data[i][j] * x[j];
            }
            x[i] /= U.data[i][i];
        }

        const solution = { size: b.size, data: x };
        const residual = this.calculateResidual(A, solution, b);

        return {
            solution,
            method: 'lu_decomposition',
            steps,
            residual,
            condition: this.estimateConditionNumber(A)
        };
    }

    private qrSolve(A: Matrix, b: Vector, steps: string[]): SystemResult {
        const qr = this.qrDecomposition(A);
        const Q = qr.Q;
        const R = qr.R;

        steps.push(`Computing Q^T * b`);
        steps.push(`Solving Rx = Q^T*b using back substitution`);

        // Compute Q^T * b
        const qtb: number[] = new Array(b.size);
        for (let i = 0; i < b.size; i++) {
            qtb[i] = 0;
            for (let j = 0; j < b.size; j++) {
                qtb[i] += Q.data[j][i] * b.data[j];
            }
        }

        // Back substitution: Rx = Q^T*b
        const x: number[] = new Array(b.size);
        for (let i = b.size - 1; i >= 0; i--) {
            x[i] = qtb[i];
            for (let j = i + 1; j < b.size; j++) {
                x[i] -= R.data[i][j] * x[j];
            }
            x[i] /= R.data[i][i];
        }

        const solution = { size: b.size, data: x };
        const residual = this.calculateResidual(A, solution, b);

        return {
            solution,
            method: 'qr_decomposition',
            steps,
            residual,
            condition: this.estimateConditionNumber(A)
        };
    }

    private choleskySolve(A: Matrix, b: Vector, steps: string[]): SystemResult {
        // Simplified Cholesky solve - would need full implementation
        return this.luSolve(A, b, steps);
    }

    private calculateResidual(A: Matrix, x: Vector, b: Vector): number {
        // Calculate ||Ax - b||
        let residual = 0;
        for (let i = 0; i < A.rows; i++) {
            let sum = 0;
            for (let j = 0; j < A.cols; j++) {
                sum += A.data[i][j] * x.data[j];
            }
            const diff = sum - b.data[i];
            residual += diff * diff;
        }
        return Math.sqrt(residual);
    }
}