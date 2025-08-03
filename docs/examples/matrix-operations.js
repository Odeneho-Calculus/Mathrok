/**
 * Matrix Operations Example
 *
 * This example demonstrates the matrix operations available
 * in the Mathrok library.
 */

// Import the library (Node.js)
const { Mathrok } = require('mathrok');

// For browser, the library is already available as a global variable

// Initialize the library
const mathrok = new Mathrok();

// Matrix operations
async function runMatrixOperations() {
  try {
    console.log('Mathrok Matrix Operations Example');
    console.log('--------------------------------');

    // Define sample matrices
    const matrixA = [
      [1, 2],
      [3, 4]
    ];

    const matrixB = [
      [5, 6],
      [7, 8]
    ];

    const matrixC = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ];

    const vector = [1, 2];

    // Create matrix objects
    console.log('\n1. Creating matrices:');
    const A = { data: matrixA, rows: 2, cols: 2 };
    const B = { data: matrixB, rows: 2, cols: 2 };
    const C = { data: matrixC, rows: 3, cols: 3 };

    console.log('Matrix A:');
    console.log(A.data);

    console.log('Matrix B:');
    console.log(B.data);

    console.log('Matrix C:');
    console.log(C.data);

    // Matrix addition
    console.log('\n2. Matrix addition (A + B):');
    const addition = await mathrok.matrix.add(A, B);
    console.log(addition.result.data);
    // Expected: [[6, 8], [10, 12]]

    // Matrix subtraction
    console.log('\n3. Matrix subtraction (A - B):');
    const subtraction = await mathrok.matrix.subtract(A, B);
    console.log(subtraction.result.data);
    // Expected: [[-4, -4], [-4, -4]]

    // Matrix multiplication
    console.log('\n4. Matrix multiplication (A * B):');
    const multiplication = await mathrok.matrix.multiply(A, B);
    console.log(multiplication.result.data);
    // Expected: [[19, 22], [43, 50]]

    // Scalar multiplication
    console.log('\n5. Scalar multiplication (2 * A):');
    const scalarMult = await mathrok.matrix.scalarMultiply(A, 2);
    console.log(scalarMult.result.data);
    // Expected: [[2, 4], [6, 8]]

    // Transpose
    console.log('\n6. Matrix transpose (A^T):');
    const transpose = await mathrok.matrix.transpose(A);
    console.log(transpose.result.data);
    // Expected: [[1, 3], [2, 4]]

    // Determinant
    console.log('\n7. Matrix determinant (|A|):');
    const determinant = await mathrok.matrix.determinant(A);
    console.log(determinant.result);
    // Expected: -2

    // Inverse
    console.log('\n8. Matrix inverse (A^-1):');
    const inverse = await mathrok.matrix.inverse(A);
    console.log(inverse.result.data);
    // Expected: [[-2, 1], [1.5, -0.5]]

    // Eigenvalues
    console.log('\n9. Matrix eigenvalues:');
    const eigenvalues = await mathrok.matrix.eigenvalues(A);
    console.log(eigenvalues.result);
    // Expected: Approximately [5.37, -0.37]

    // Eigenvectors
    console.log('\n10. Matrix eigenvectors:');
    const eigenvectors = await mathrok.matrix.eigenvectors(A);
    console.log(eigenvectors.result);

    // Matrix power
    console.log('\n11. Matrix power (A^3):');
    const power = await mathrok.matrix.power(A, 3);
    console.log(power.result.data);

    // Trace
    console.log('\n12. Matrix trace (trace of A):');
    const trace = await mathrok.matrix.trace(A);
    console.log(trace.result);
    // Expected: 5 (1 + 4)

    // Rank
    console.log('\n13. Matrix rank (rank of C):');
    const rank = await mathrok.matrix.rank(C);
    console.log(rank.result);
    // Expected: 2 (C is rank deficient)

    // Solving linear system Ax = b
    console.log('\n14. Solving linear system (Ax = b):');
    const b = [5, 11];
    const solution = await mathrok.matrix.solve(A, b);
    console.log(solution.result);
    // Expected: [1, 2]

    // LU Decomposition
    console.log('\n15. LU Decomposition:');
    const lu = await mathrok.matrix.luDecomposition(A);
    console.log('L:');
    console.log(lu.result.L.data);
    console.log('U:');
    console.log(lu.result.U.data);

    // QR Decomposition
    console.log('\n16. QR Decomposition:');
    const qr = await mathrok.matrix.qrDecomposition(A);
    console.log('Q:');
    console.log(qr.result.Q.data);
    console.log('R:');
    console.log(qr.result.R.data);

    console.log('\nAll matrix operations completed successfully!');
  } catch (error) {
    console.error('Error running matrix operations:', error);
  }
}

// Function to create a matrix display for browser
function createMatrixDisplay(matrix) {
  if (!matrix || !matrix.length) return '<div class="empty-matrix">(Empty Matrix)</div>';

  let html = '<table class="matrix-table">';

  for (let i = 0; i < matrix.length; i++) {
    html += '<tr>';
    for (let j = 0; j < matrix[i].length; j++) {
      html += `<td>${matrix[i][j]}</td>`;
    }
    html += '</tr>';
  }

  html += '</table>';
  return html;
}

// Browser UI
function createBrowserUI() {
  // Create main container
  const container = document.createElement('div');
  container.className = 'matrix-demo';
  container.style.maxWidth = '800px';
  container.style.margin = '0 auto';
  container.style.padding = '20px';
  container.style.fontFamily = 'Arial, sans-serif';
  document.body.appendChild(container);

  // Create title
  const title = document.createElement('h1');
  title.textContent = 'Mathrok Matrix Operations';
  container.appendChild(title);

  // Create description
  const description = document.createElement('p');
  description.textContent = 'This example demonstrates the matrix operations available in the Mathrok library.';
  container.appendChild(description);

  // Create matrix input section
  const inputSection = document.createElement('div');
  inputSection.className = 'input-section';
  inputSection.style.margin = '20px 0';
  inputSection.style.padding = '20px';
  inputSection.style.backgroundColor = '#f5f5f5';
  inputSection.style.borderRadius = '5px';
  container.appendChild(inputSection);

  const inputTitle = document.createElement('h2');
  inputTitle.textContent = 'Matrix Input';
  inputSection.appendChild(inputTitle);

  // Matrix A input
  const matrixASection = document.createElement('div');
  matrixASection.style.marginBottom = '20px';
  inputSection.appendChild(matrixASection);

  const matrixALabel = document.createElement('h3');
  matrixALabel.textContent = 'Matrix A';
  matrixASection.appendChild(matrixALabel);

  const matrixAInput = document.createElement('textarea');
  matrixAInput.id = 'matrix-a-input';
  matrixAInput.rows = 4;
  matrixAInput.cols = 30;
  matrixAInput.value = '1 2\n3 4';
  matrixAInput.style.fontFamily = 'monospace';
  matrixASection.appendChild(matrixAInput);

  // Matrix B input
  const matrixBSection = document.createElement('div');
  matrixBSection.style.marginBottom = '20px';
  inputSection.appendChild(matrixBSection);

  const matrixBLabel = document.createElement('h3');
  matrixBLabel.textContent = 'Matrix B';
  matrixBSection.appendChild(matrixBLabel);

  const matrixBInput = document.createElement('textarea');
  matrixBInput.id = 'matrix-b-input';
  matrixBInput.rows = 4;
  matrixBInput.cols = 30;
  matrixBInput.value = '5 6\n7 8';
  matrixBInput.style.fontFamily = 'monospace';
  matrixBSection.appendChild(matrixBInput);

  // Operation selection
  const operationSection = document.createElement('div');
  operationSection.style.marginBottom = '20px';
  inputSection.appendChild(operationSection);

  const operationLabel = document.createElement('h3');
  operationLabel.textContent = 'Operation';
  operationSection.appendChild(operationLabel);

  const operationSelect = document.createElement('select');
  operationSelect.id = 'operation-select';
  operationSelect.style.padding = '5px';
  operationSelect.style.width = '200px';
  operationSection.appendChild(operationSelect);

  const operations = [
    { value: 'add', label: 'Addition (A + B)' },
    { value: 'subtract', label: 'Subtraction (A - B)' },
    { value: 'multiply', label: 'Multiplication (A * B)' },
    { value: 'determinantA', label: 'Determinant of A' },
    { value: 'determinantB', label: 'Determinant of B' },
    { value: 'inverseA', label: 'Inverse of A' },
    { value: 'inverseB', label: 'Inverse of B' },
    { value: 'transposeA', label: 'Transpose of A' },
    { value: 'transposeB', label: 'Transpose of B' },
    { value: 'eigenvaluesA', label: 'Eigenvalues of A' },
    { value: 'traceA', label: 'Trace of A' },
    { value: 'rankA', label: 'Rank of A' }
  ];

  operations.forEach(op => {
    const option = document.createElement('option');
    option.value = op.value;
    option.textContent = op.label;
    operationSelect.appendChild(option);
  });

  // Calculate button
  const calculateButton = document.createElement('button');
  calculateButton.textContent = 'Calculate';
  calculateButton.style.padding = '10px 20px';
  calculateButton.style.backgroundColor = '#4CAF50';
  calculateButton.style.color = 'white';
  calculateButton.style.border = 'none';
  calculateButton.style.borderRadius = '5px';
  calculateButton.style.cursor = 'pointer';
  calculateButton.style.marginTop = '10px';
  inputSection.appendChild(calculateButton);

  // Results section
  const resultsSection = document.createElement('div');
  resultsSection.className = 'results-section';
  resultsSection.style.margin = '20px 0';
  container.appendChild(resultsSection);

  const resultsTitle = document.createElement('h2');
  resultsTitle.textContent = 'Results';
  resultsSection.appendChild(resultsTitle);

  const resultsDisplay = document.createElement('div');
  resultsDisplay.id = 'results-display';
  resultsDisplay.style.padding = '20px';
  resultsDisplay.style.backgroundColor = '#f9f9f9';
  resultsDisplay.style.borderRadius = '5px';
  resultsDisplay.style.minHeight = '100px';
  resultsDisplay.innerHTML = '<p>Results will appear here...</p>';
  resultsSection.appendChild(resultsDisplay);

  // Add CSS for matrix display
  const style = document.createElement('style');
  style.textContent = `
    .matrix-table {
      border-collapse: collapse;
      margin: 10px 0;
    }
    .matrix-table td {
      padding: 5px 10px;
      border: 1px solid #ddd;
      text-align: center;
    }
    .matrix-result {
      margin: 20px 0;
    }
    .matrix-result h3 {
      margin-bottom: 10px;
    }
    .error-message {
      color: red;
      font-weight: bold;
    }
  `;
  document.head.appendChild(style);

  // Function to parse matrix input
  function parseMatrix(text) {
    try {
      return text.trim().split('\n').map(row =>
        row.trim().split(/\s+/).map(val => parseFloat(val))
      );
    } catch (error) {
      throw new Error('Invalid matrix format. Use space-separated values with each row on a new line.');
    }
  }

  // Handle calculate button click
  calculateButton.addEventListener('click', async () => {
    try {
      // Parse matrices
      const matrixAData = parseMatrix(matrixAInput.value);
      const matrixBData = parseMatrix(matrixBInput.value);

      // Create matrix objects
      const A = mathrok.matrix.create(matrixAData);
      const B = mathrok.matrix.create(matrixBData);

      // Get selected operation
      const operation = operationSelect.value;

      // Perform operation
      let result;
      let resultHTML = '';

      switch (operation) {
        case 'add':
          result = await mathrok.matrix.add(A, B);
          resultHTML = `
            <div class="matrix-result">
              <h3>Matrix A + Matrix B:</h3>
              ${createMatrixDisplay(result.result.data)}
            </div>
          `;
          break;

        case 'subtract':
          result = await mathrok.matrix.subtract(A, B);
          resultHTML = `
            <div class="matrix-result">
              <h3>Matrix A - Matrix B:</h3>
              ${createMatrixDisplay(result.result.data)}
            </div>
          `;
          break;

        case 'multiply':
          result = await mathrok.matrix.multiply(A, B);
          resultHTML = `
            <div class="matrix-result">
              <h3>Matrix A * Matrix B:</h3>
              ${createMatrixDisplay(result.result.data)}
            </div>
          `;
          break;

        case 'determinantA':
          result = await mathrok.matrix.determinant(A);
          resultHTML = `
            <div class="matrix-result">
              <h3>Determinant of Matrix A:</h3>
              <p>${result.result}</p>
            </div>
          `;
          break;

        case 'determinantB':
          result = await mathrok.matrix.determinant(B);
          resultHTML = `
            <div class="matrix-result">
              <h3>Determinant of Matrix B:</h3>
              <p>${result.result}</p>
            </div>
          `;
          break;

        case 'inverseA':
          result = await mathrok.matrix.inverse(A);
          resultHTML = `
            <div class="matrix-result">
              <h3>Inverse of Matrix A:</h3>
              ${createMatrixDisplay(result.result.data)}
            </div>
          `;
          break;

        case 'inverseB':
          result = await mathrok.matrix.inverse(B);
          resultHTML = `
            <div class="matrix-result">
              <h3>Inverse of Matrix B:</h3>
              ${createMatrixDisplay(result.result.data)}
            </div>
          `;
          break;

        case 'transposeA':
          result = await mathrok.matrix.transpose(A);
          resultHTML = `
            <div class="matrix-result">
              <h3>Transpose of Matrix A:</h3>
              ${createMatrixDisplay(result.result.data)}
            </div>
          `;
          break;

        case 'transposeB':
          result = await mathrok.matrix.transpose(B);
          resultHTML = `
            <div class="matrix-result">
              <h3>Transpose of Matrix B:</h3>
              ${createMatrixDisplay(result.result.data)}
            </div>
          `;
          break;

        case 'eigenvaluesA':
          result = await mathrok.matrix.eigenvalues(A);
          resultHTML = `
            <div class="matrix-result">
              <h3>Eigenvalues of Matrix A:</h3>
              <p>${JSON.stringify(result.result)}</p>
            </div>
          `;
          break;

        case 'traceA':
          result = await mathrok.matrix.trace(A);
          resultHTML = `
            <div class="matrix-result">
              <h3>Trace of Matrix A:</h3>
              <p>${result.result}</p>
            </div>
          `;
          break;

        case 'rankA':
          result = await mathrok.matrix.rank(A);
          resultHTML = `
            <div class="matrix-result">
              <h3>Rank of Matrix A:</h3>
              <p>${result.result}</p>
            </div>
          `;
          break;

        default:
          resultHTML = '<p>Please select an operation.</p>';
      }

      // Display result
      resultsDisplay.innerHTML = resultHTML;

    } catch (error) {
      resultsDisplay.innerHTML = `<p class="error-message">Error: ${error.message}</p>`;
    }
  });
}

// Run the example
if (typeof window === 'undefined') {
  // Node.js environment
  runMatrixOperations();
} else {
  // Browser environment
  window.addEventListener('DOMContentLoaded', createBrowserUI);
}

/**
 * HTML Template for browser example:
 *
 * <!DOCTYPE html>
 * <html>
 * <head>
 *   <title>Mathrok Matrix Operations</title>
 *   <script src="https://cdn.jsdelivr.net/npm/mathrok@1.1.0/dist/mathrok.umd.js"></script>
 *   <script src="matrix-operations.js"></script>
 * </head>
 * <body>
 *   <!-- Content will be dynamically generated by the script -->
 * </body>
 * </html>
 */