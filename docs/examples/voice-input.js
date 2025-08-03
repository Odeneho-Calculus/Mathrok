/**
 * Voice Input Example
 *
 * This example demonstrates how to use voice input for mathematical expressions
 * using the Mathrok library.
 *
 * Note: This example is designed to run in a browser environment that supports
 * the Web Speech API (Chrome, Edge, etc.)
 */

// Initialize the library (the library should be included in your HTML)
const mathrok = new Mathrok();

// Create UI elements
function createUI() {
    // Create main container
    const container = document.createElement('div');
    container.className = 'voice-calculator';
    container.style.maxWidth = '800px';
    container.style.margin = '0 auto';
    container.style.padding = '20px';
    container.style.fontFamily = 'Arial, sans-serif';
    document.body.appendChild(container);

    // Create title
    const title = document.createElement('h1');
    title.textContent = 'Mathrok Voice Calculator';
    container.appendChild(title);

    // Create description
    const description = document.createElement('p');
    description.textContent = 'Click the microphone button and speak a mathematical expression or question.';
    container.appendChild(description);

    // Create status display
    const status = document.createElement('div');
    status.id = 'status';
    status.textContent = 'Ready';
    status.style.margin = '20px 0';
    status.style.padding = '10px';
    status.style.backgroundColor = '#f0f0f0';
    status.style.borderRadius = '5px';
    status.style.textAlign = 'center';
    container.appendChild(status);

    // Create microphone button
    const buttonContainer = document.createElement('div');
    buttonContainer.style.textAlign = 'center';
    buttonContainer.style.margin = '20px 0';
    container.appendChild(buttonContainer);

    const micButton = document.createElement('button');
    micButton.id = 'mic-button';
    micButton.innerHTML = '🎤 Start Listening';
    micButton.style.padding = '15px 30px';
    micButton.style.fontSize = '18px';
    micButton.style.backgroundColor = '#4CAF50';
    micButton.style.color = 'white';
    micButton.style.border = 'none';
    micButton.style.borderRadius = '5px';
    micButton.style.cursor = 'pointer';
    buttonContainer.appendChild(micButton);

    // Create output container
    const outputContainer = document.createElement('div');
    outputContainer.style.margin = '20px 0';
    container.appendChild(outputContainer);

    // Create recognized text display
    const recognizedContainer = document.createElement('div');
    recognizedContainer.style.margin = '20px 0';
    outputContainer.appendChild(recognizedContainer);

    const recognizedLabel = document.createElement('h3');
    recognizedLabel.textContent = 'Recognized Text:';
    recognizedContainer.appendChild(recognizedLabel);

    const recognizedText = document.createElement('div');
    recognizedText.id = 'recognized-text';
    recognizedText.style.padding = '10px';
    recognizedText.style.border = '1px solid #ddd';
    recognizedText.style.borderRadius = '5px';
    recognizedText.style.minHeight = '50px';
    recognizedContainer.appendChild(recognizedText);

    // Create result display
    const resultContainer = document.createElement('div');
    resultContainer.style.margin = '20px 0';
    outputContainer.appendChild(resultContainer);

    const resultLabel = document.createElement('h3');
    resultLabel.textContent = 'Result:';
    resultContainer.appendChild(resultLabel);

    const resultText = document.createElement('div');
    resultText.id = 'result-text';
    resultText.style.padding = '10px';
    resultText.style.border = '1px solid #ddd';
    resultText.style.borderRadius = '5px';
    resultText.style.minHeight = '50px';
    resultText.style.fontWeight = 'bold';
    resultContainer.appendChild(resultText);

    // Create visualization container
    const visualContainer = document.createElement('div');
    visualContainer.style.margin = '20px 0';
    outputContainer.appendChild(visualContainer);

    const visualLabel = document.createElement('h3');
    visualLabel.textContent = 'Visualization:';
    visualContainer.appendChild(visualLabel);

    const graphContainer = document.createElement('div');
    graphContainer.id = 'graph-container';
    graphContainer.style.width = '100%';
    graphContainer.style.height = '300px';
    graphContainer.style.border = '1px solid #ddd';
    graphContainer.style.borderRadius = '5px';
    visualContainer.appendChild(graphContainer);

    // Create speak button
    const speakButton = document.createElement('button');
    speakButton.id = 'speak-button';
    speakButton.innerHTML = '🔊 Speak Result';
    speakButton.style.padding = '10px 20px';
    speakButton.style.fontSize = '16px';
    speakButton.style.backgroundColor = '#2196F3';
    speakButton.style.color = 'white';
    speakButton.style.border = 'none';
    speakButton.style.borderRadius = '5px';
    speakButton.style.cursor = 'pointer';
    speakButton.style.marginRight = '10px';
    speakButton.disabled = true;
    buttonContainer.appendChild(speakButton);

    // Return references to the elements we need to access
    return {
        status,
        micButton,
        recognizedText,
        resultText,
        graphContainer,
        speakButton
    };
}

// Main application logic
function initVoiceCalculator() {
    // Create UI
    const ui = createUI();

    // Check if voice is supported
    const support = mathrok.voice.isSupported();
    if (!support.input) {
        ui.status.textContent = 'Voice input is not supported in this browser';
        ui.status.style.backgroundColor = '#ffcccc';
        ui.micButton.disabled = true;
        return;
    }

    // Function to handle voice input
    async function handleVoiceInput() {
        try {
            // Update UI
            ui.status.textContent = 'Listening...';
            ui.status.style.backgroundColor = '#ccffcc';
            ui.micButton.disabled = true;
            ui.micButton.innerHTML = '🎤 Listening...';

            // Clear previous results
            ui.recognizedText.textContent = '';
            ui.resultText.textContent = '';
            ui.graphContainer.innerHTML = '';
            ui.speakButton.disabled = true;

            // Start listening
            const voiceResult = await mathrok.voice.listen();

            // Display recognized text
            ui.recognizedText.textContent = voiceResult.text;
            ui.status.textContent = `Processing: "${voiceResult.text}"`;

            // Process the natural language query
            const result = await mathrok.nl(voiceResult.text);

            // Display the result
            ui.resultText.textContent = result.result;
            ui.status.textContent = 'Ready';
            ui.status.style.backgroundColor = '#f0f0f0';

            // Try to visualize the result if it's a plottable expression
            try {
                if (result.expression) {
                    mathrok.visualization.plot2D(ui.graphContainer, result.expression, 'x');
                }
            } catch (visualError) {
                console.warn('Visualization error:', visualError);
                // Not all results can be visualized, so we just ignore errors
            }

            // Enable speak button if speech output is supported
            if (support.output) {
                ui.speakButton.disabled = false;
            }

            // Reset microphone button
            ui.micButton.disabled = false;
            ui.micButton.innerHTML = '🎤 Start Listening';

        } catch (error) {
            console.error('Voice input error:', error);

            // Update UI to show error
            ui.status.textContent = `Error: ${error.message}`;
            ui.status.style.backgroundColor = '#ffcccc';

            // Reset microphone button
            ui.micButton.disabled = false;
            ui.micButton.innerHTML = '🎤 Start Listening';
        }
    }

    // Function to speak the result
    async function speakResult() {
        try {
            // Update UI
            ui.status.textContent = 'Speaking...';
            ui.speakButton.disabled = true;

            // Get the recognized text and result
            const query = ui.recognizedText.textContent;
            const result = ui.resultText.textContent;

            // Speak the result
            await mathrok.voice.speak(`The result of ${query} is ${result}`);

            // Reset UI
            ui.status.textContent = 'Ready';
            ui.speakButton.disabled = false;
        } catch (error) {
            console.error('Speech error:', error);

            // Update UI to show error
            ui.status.textContent = `Speech error: ${error.message}`;
            ui.status.style.backgroundColor = '#ffcccc';
            ui.speakButton.disabled = false;
        }
    }

    // Set up event listeners
    ui.micButton.addEventListener('click', handleVoiceInput);
    ui.speakButton.addEventListener('click', speakResult);

    // Disable speak button if speech output is not supported
    if (!support.output) {
        ui.speakButton.disabled = true;
        ui.speakButton.title = 'Speech output is not supported in this browser';
    }
}

// Initialize the application when the page loads
window.addEventListener('DOMContentLoaded', initVoiceCalculator);

/**
 * HTML Template for this example:
 *
 * <!DOCTYPE html>
 * <html>
 * <head>
 *   <title>Mathrok Voice Calculator</title>
 *   <script src="https://cdn.jsdelivr.net/npm/mathrok@1.1.0/dist/mathrok.umd.js"></script>
 *   <script src="voice-input.js"></script>
 * </head>
 * <body>
 *   <!-- Content will be dynamically generated by the script -->
 * </body>
 * </html>
 *
 * Example voice commands to try:
 * - "What is the derivative of x squared?"
 * - "Solve x squared minus 4 equals 0"
 * - "Calculate the integral of sine of x"
 * - "Factor x squared minus 9"
 * - "Simplify 2x plus 3x plus 4"
 * - "Plot sine of x"
 */