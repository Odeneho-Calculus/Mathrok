/**
 * Voice Input Example (Node.js Compatible)
 *
 * This example demonstrates how to use voice input for mathematical expressions
 * using the Mathrok library. Since this is running in Node.js, we'll simulate
 * voice input with predefined text examples.
 *
 * In a browser environment, this would use the Web Speech API.
 */

// Import the library (Node.js)
const { Mathrok } = require('mathrok');

// Initialize the library
const mathrok = new Mathrok();

// Simulated voice input examples (what would come from speech recognition)
const voiceInputExamples = [
    "solve x squared minus four equals zero",
    "what is the derivative of sine x times x squared",
    "integrate x squared with respect to x",
    "factor x cubed minus eight",
    "what is two plus three times four",
    "find the limit of sine x over x as x approaches zero",
    "solve the quadratic equation x squared plus five x plus six equals zero"
];

// Voice-to-math text conversion (simulating speech recognition + NLP)
async function processVoiceInput(voiceText) {
    console.log(`\n🎤 Voice Input: "${voiceText}"`);
    console.log('🔄 Processing natural language...');

    // Convert voice text to mathematical expression using NLP
    return await mathrok.nl(voiceText);
}

// Process a single voice input example
async function processVoiceExample(voiceText) {
    try {
        console.log('='.repeat(60));

        // Step 1: Process voice input with NLP
        const nlpResult = await processVoiceInput(voiceText);

        console.log(`📝 Interpreted as: ${nlpResult.expression}`);
        console.log(`🎯 Intent: ${nlpResult.intent}`);

        // Step 2: Execute the mathematical operation
        let result;
        switch (nlpResult.intent) {
            case 'solve_equation':
                result = await mathrok.solve(nlpResult.expression);
                break;
            case 'calculate_derivative':
                result = await mathrok.derivative(nlpResult.expression, 'x');
                break;
            case 'calculate_integral':
                result = await mathrok.integral(nlpResult.expression, 'x');
                break;
            case 'factor_expression':
                result = await mathrok.factor(nlpResult.expression);
                break;
            case 'evaluate_expression':
                result = await mathrok.evaluate(nlpResult.expression);
                break;
            case 'calculate_limit':
                result = await mathrok.limit(nlpResult.expression, 'x', 0);
                break;
            default:
                result = await mathrok.evaluate(nlpResult.expression);
        }

        // Step 3: Display results
        console.log(`✅ Result: ${result.result || JSON.stringify(result)}`);

        // Step 4: Generate voice output (text-to-speech simulation)
        const voiceResponse = generateVoiceResponse(nlpResult, result);
        console.log(`🔊 Voice Response: "${voiceResponse}"`);

        // Step 5: Show steps if available
        if (result.steps && result.steps.length > 0) {
            console.log('\n📚 Step-by-step explanation:');
            result.steps.forEach((step, index) => {
                console.log(`   ${index + 1}. ${step.description || step.explanation || step}`);
            });
        }

        return { nlpResult, result, voiceResponse };

    } catch (error) {
        console.error(`❌ Error processing voice input: ${error.message}`);
        const errorResponse = `I'm sorry, I couldn't process that mathematical expression. ${error.message}`;
        console.log(`🔊 Voice Response: "${errorResponse}"`);
        return { error: error.message, voiceResponse: errorResponse };
    }
}

// Generate natural language response for text-to-speech
function generateVoiceResponse(nlpResult, result) {
    const intent = nlpResult.intent;
    const expression = nlpResult.expression;

    switch (intent) {
        case 'solve_equation':
            if (Array.isArray(result.result)) {
                const solutions = result.result.map(sol => sol.value || sol).join(', ');
                return `The solution to ${expression} is ${solutions}`;
            }
            return `The solution to ${expression} is ${result.result}`;

        case 'calculate_derivative':
            return `The derivative of ${expression} is ${result.result}`;

        case 'calculate_integral':
            return `The integral of ${expression} is ${result.result}`;

        case 'factor_expression':
            return `The factored form of ${expression} is ${result.result}`;

        case 'evaluate_expression':
            return `${expression} equals ${result.result || result}`;

        case 'calculate_limit':
            return `The limit of ${expression} is ${result.result}`;

        default:
            return `The result is ${result.result || JSON.stringify(result)}`;
    }
}

// Run all voice input examples
async function runVoiceExamples() {
    console.log('🎙️  MATHROK VOICE INPUT DEMONSTRATION');
    console.log('=====================================');
    console.log('Simulating voice input with natural language processing...\n');

    for (let i = 0; i < voiceInputExamples.length; i++) {
        await processVoiceExample(voiceInputExamples[i]);

        // Add a small delay between examples
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('\n🎉 Voice input demonstration completed!');
    console.log('\nIn a browser environment, this would use:');
    console.log('• Web Speech API for speech-to-text');
    console.log('• Mathrok NLP for natural language processing');
    console.log('• Web Speech Synthesis API for text-to-speech');
}

// Additional voice features demonstration
async function demonstrateVoiceFeatures() {
    console.log('\n🔧 VOICE FEATURES DEMONSTRATION');
    console.log('===============================');

    // Test voice configuration
    console.log('\n1. Voice Configuration:');
    try {
        const voiceSupport = mathrok.voice.isSupported();
        console.log('   • Input supported:', voiceSupport.input);
        console.log('   • Output supported:', voiceSupport.output);

        const voices = mathrok.voice.getVoices();
        console.log('   • Available voices:', voices.length || 'None in Node.js environment');
    } catch (error) {
        console.log('   • Voice configuration not available in Node.js environment');
    }

    // Test voice commands
    console.log('\n2. Supported Voice Commands:');
    const commands = [
        'solve [equation]',
        'find the derivative of [expression]',
        'integrate [expression]',
        'factor [expression]',
        'what is [expression]',
        'calculate [expression]',
        'find the limit of [expression]'
    ];

    commands.forEach(command => {
        console.log(`   • "${command}"`);
    });

    // Test mathematical vocabulary
    console.log('\n3. Mathematical Vocabulary Recognition:');
    const vocabulary = [
        'squared → ^2',
        'cubed → ^3',
        'sine → sin',
        'cosine → cos',
        'tangent → tan',
        'natural log → ln',
        'square root → sqrt',
        'plus → +',
        'minus → -',
        'times → *',
        'divided by → /',
        'equals → ='
    ];

    vocabulary.forEach(vocab => {
        console.log(`   • ${vocab}`);
    });
}

// Main execution
async function main() {
    try {
        await runVoiceExamples();
        await demonstrateVoiceFeatures();
    } catch (error) {
        console.error('Error in voice demonstration:', error);
    }
}

// Run the demonstration
main();