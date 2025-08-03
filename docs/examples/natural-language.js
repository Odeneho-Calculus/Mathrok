/**
 * Natural Language Processing Example
 *
 * This example demonstrates how to use the natural language processing
 * capabilities of the Mathrok library to solve math problems expressed
 * in plain English.
 */

// Import the library (Node.js)
const { Mathrok } = require('mathrok');

// Initialize the library
const mathrok = new Mathrok();

// Process natural language queries
async function processNaturalLanguage() {
    try {
        console.log('Mathrok Natural Language Processing Example');
        console.log('------------------------------------------');

        // Basic queries
        console.log('\n1. Basic Queries:');

        const query1 = 'find the derivative of x squared';
        console.log(`Query: "${query1}"`);
        const result1 = await mathrok.nl(query1);
        console.log(`Result: ${result1.result}`);
        console.log(`Intent: ${result1.intent}`);
        console.log(`Expression: ${result1.expression}`);
        console.log(`Confidence: ${result1.confidence}`);

        const query2 = 'solve x squared minus 4 equals 0';
        console.log(`\nQuery: "${query2}"`);
        const result2 = await mathrok.nl(query2);
        console.log(`Result: ${result2.result}`);
        console.log(`Intent: ${result2.intent}`);
        console.log(`Expression: ${result2.expression}`);
        console.log(`Confidence: ${result2.confidence}`);

        // Advanced queries
        console.log('\n2. Advanced Queries:');

        const query3 = 'find the limit of sin(x)/x as x approaches 0';
        console.log(`Query: "${query3}"`);
        const result3 = await mathrok.nl(query3);
        console.log(`Result: ${result3.result}`);
        console.log(`Intent: ${result3.intent}`);
        console.log(`Expression: ${result3.expression}`);
        console.log(`Confidence: ${result3.confidence}`);

        const query4 = 'calculate the integral of x squared from 0 to 1';
        console.log(`\nQuery: "${query4}"`);
        const result4 = await mathrok.nl(query4);
        console.log(`Result: ${result4.result}`);
        console.log(`Intent: ${result4.intent}`);
        console.log(`Expression: ${result4.expression}`);
        console.log(`Confidence: ${result4.confidence}`);

        // Multi-step queries
        console.log('\n3. Multi-step Queries:');

        const query5 = 'first factor x squared minus 4 then solve x squared minus 4 equals 0';
        console.log(`Query: "${query5}"`);
        const result5 = await mathrok.nl(query5);
        console.log(`Result: ${result5.result}`);
        console.log(`Multi-step: ${result5.multiStep}`);
        if (result5.stepResults) {
            console.log('Step Results:');
            result5.stepResults.forEach((step, index) => {
                console.log(`  Step ${index + 1}: ${step.result}`);
            });
        }

        // Educational queries
        console.log('\n4. Educational Queries:');

        const query6 = 'explain how to find derivatives';
        console.log(`Query: "${query6}"`);
        const result6 = await mathrok.explain('derivative', 'beginner');
        console.log(`Explanation: ${result6.explanation.substring(0, 100)}...`);
        console.log(`Educational Level: ${result6.level}`);
        console.log(`Related Concepts: ${result6.concepts.join(', ')}`);

        // Context-aware queries
        console.log('\n5. Context-aware Queries:');

        // First query to establish context
        const query7a = 'solve x squared minus 9 equals 0';
        console.log(`Query 1: "${query7a}"`);
        const result7a = await mathrok.nl(query7a);
        console.log(`Result 1: ${result7a.result}`);

        // Follow-up query referencing previous result
        const query7b = 'substitute that into x plus 5';
        console.log(`Query 2: "${query7b}"`);
        const result7b = await mathrok.nl(query7b);
        console.log(`Result 2: ${result7b.result}`);

        // Reset context
        mathrok.resetNLContext();

        console.log('\nAll natural language processing completed successfully!');
    } catch (error) {
        console.error('Error processing natural language:', error);
    }
}

// Create a browser UI for natural language processing
function createNaturalLanguageUI() {
    // Create container
    const container = document.createElement('div');
    container.style.maxWidth = '800px';
    container.style.margin = '0 auto';
    container.style.padding = '20px';
    container.style.fontFamily = 'Arial, sans-serif';
    document.body.appendChild(container);

    // Create title
    const title = document.createElement('h1');
    title.textContent = 'Mathrok Natural Language Calculator';
    container.appendChild(title);

    // Create description
    const description = document.createElement('p');
    description.textContent = 'Enter a mathematical question in plain English and get the answer.';
    container.appendChild(description);

    // Create input area
    const inputContainer = document.createElement('div');
    inputContainer.style.margin = '20px 0';
    container.appendChild(inputContainer);

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'e.g., find the derivative of x squared';
    input.style.width = '70%';
    input.style.padding = '10px';
    input.style.fontSize = '16px';
    input.style.marginRight = '10px';
    inputContainer.appendChild(input);

    const button = document.createElement('button');
    button.textContent = 'Calculate';
    button.style.padding = '10px 20px';
    button.style.fontSize = '16px';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    inputContainer.appendChild(button);

    // Create output area
    const outputContainer = document.createElement('div');
    outputContainer.style.margin = '20px 0';
    container.appendChild(outputContainer);

    const outputTitle = document.createElement('h2');
    outputTitle.textContent = 'Result';
    outputContainer.appendChild(outputTitle);

    const output = document.createElement('div');
    output.id = 'output';
    output.style.padding = '20px';
    output.style.backgroundColor = '#f5f5f5';
    output.style.borderRadius = '5px';
    output.style.minHeight = '100px';
    outputContainer.appendChild(output);

    // Create visualization area
    const visualContainer = document.createElement('div');
    visualContainer.style.margin = '20px 0';
    container.appendChild(visualContainer);

    const visualTitle = document.createElement('h2');
    visualTitle.textContent = 'Visualization';
    visualContainer.appendChild(visualTitle);

    const graphContainer = document.createElement('div');
    graphContainer.id = 'graph-container';
    graphContainer.style.width = '100%';
    graphContainer.style.height = '300px';
    graphContainer.style.backgroundColor = '#f5f5f5';
    graphContainer.style.borderRadius = '5px';
    visualContainer.appendChild(graphContainer);

    // Create examples section
    const examplesContainer = document.createElement('div');
    examplesContainer.style.margin = '20px 0';
    container.appendChild(examplesContainer);

    const examplesTitle = document.createElement('h2');
    examplesTitle.textContent = 'Example Queries';
    examplesContainer.appendChild(examplesTitle);

    const examples = [
        'find the derivative of x squared',
        'solve x squared minus 4 equals 0',
        'calculate the integral of sin(x)',
        'factor x squared minus 9',
        'find the limit of sin(x)/x as x approaches 0',
        'simplify 2x plus 3x plus 4',
        'first factor x squared minus 4 then solve for x'
    ];

    const examplesList = document.createElement('ul');
    examples.forEach(example => {
        const item = document.createElement('li');
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = example;
        link.style.color = '#2196F3';
        link.style.textDecoration = 'none';
        link.addEventListener('click', (e) => {
            e.preventDefault();
            input.value = example;
            button.click();
        });
        item.appendChild(link);
        examplesList.appendChild(item);
    });
    examplesContainer.appendChild(examplesList);

    // Function to process query
    async function processQuery() {
        const query = input.value.trim();
        if (!query) return;

        // Show loading state
        output.innerHTML = '<p>Processing...</p>';
        graphContainer.innerHTML = '';

        try {
            // Process the query
            const result = await mathrok.nl(query);

            // Create result HTML
            let resultHTML = `
        <div style="margin-bottom: 10px;">
          <strong>Query:</strong> ${query}
        </div>
        <div style="margin-bottom: 10px;">
          <strong>Result:</strong> ${result.result}
        </div>
        <div style="margin-bottom: 10px;">
          <strong>Intent:</strong> ${result.intent}
        </div>
        <div style="margin-bottom: 10px;">
          <strong>Expression:</strong> ${result.expression}
        </div>
        <div style="margin-bottom: 10px;">
          <strong>Confidence:</strong> ${(result.confidence * 100).toFixed(1)}%
        </div>
      `;

            // Add step results if available
            if (result.multiStep && result.stepResults) {
                resultHTML += '<div style="margin-top: 20px;"><strong>Steps:</strong></div><ol>';
                result.stepResults.forEach(step => {
                    resultHTML += `<li>${step.result}</li>`;
                });
                resultHTML += '</ol>';
            }

            // Display the result
            output.innerHTML = resultHTML;

            // Try to visualize the result
            try {
                if (result.expression) {
                    mathrok.visualization.plot2D(graphContainer, result.expression, 'x');
                }
            } catch (visualError) {
                console.warn('Visualization error:', visualError);
                // Not all results can be visualized, so we just ignore errors
            }
        } catch (error) {
            console.error('Processing error:', error);
            output.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
        }
    }

    // Set up event listeners
    button.addEventListener('click', processQuery);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            processQuery();
        }
    });

    // Focus the input
    input.focus();
}

// Run the example in Node.js
if (typeof window === 'undefined') {
    processNaturalLanguage();
} else {
    // Run the browser UI when the page loads
    window.addEventListener('DOMContentLoaded', createNaturalLanguageUI);
}

/**
 * HTML Template for browser example:
 *
 * <!DOCTYPE html>
 * <html>
 * <head>
 *   <title>Mathrok Natural Language Calculator</title>
 *   <script src="https://cdn.jsdelivr.net/npm/mathrok@1.1.0/dist/mathrok.umd.js"></script>
 *   <script src="natural-language.js"></script>
 * </head>
 * <body>
 *   <!-- Content will be dynamically generated by the script -->
 * </body>
 * </html>
 */