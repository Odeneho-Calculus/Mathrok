# Voice Features Guide

Mathrok provides comprehensive voice input and output capabilities, allowing users to interact with the library using speech. This guide covers how to use these features effectively.

## Overview

The voice features in Mathrok enable:

1. **Speech-to-Text**: Convert spoken mathematical expressions into text
2. **Text-to-Speech**: Convert mathematical expressions and explanations into speech
3. **Step-by-Step Audio**: Narrate solution steps with proper mathematical terminology
4. **Accessibility**: Make mathematical content accessible to visually impaired users

## Browser Compatibility

Voice features require browser support for the Web Speech API:

- **Chrome**: Full support
- **Edge**: Full support
- **Firefox**: Partial support (may require enabling flags)
- **Safari**: Partial support (iOS has better support than macOS)

## Basic Usage

### Checking Support

Before using voice features, check if they're supported in the current environment:

```javascript
const support = mathrok.voice.isSupported();
console.log(support); // { input: boolean, output: boolean }

if (support.input) {
  // Voice input is supported
}

if (support.output) {
  // Voice output is supported
}
```

### Voice Input

To listen for a mathematical expression:

```javascript
try {
  // Start listening (will request microphone permission)
  const result = await mathrok.voice.listen();

  console.log(result.text); // Recognized text
  console.log(result.confidence); // Recognition confidence (0-1)

  // Process the recognized text
  const mathResult = await mathrok.nl(result.text);
  console.log(mathResult.result);
} catch (error) {
  console.error('Voice recognition error:', error);
}
```

### Voice Output

To speak a mathematical expression:

```javascript
// Speak a simple expression
await mathrok.voice.speak('The derivative of x squared is 2x');

// Speak an expression with explanation
await mathrok.voice.speak(
  'x squared minus 4 equals 0',
  'This is a quadratic equation that can be factored as (x minus 2) times (x plus 2)'
);
```

### Speaking Solution Steps

To narrate a step-by-step solution:

```javascript
// Solve an equation
const result = await mathrok.solve('x^2 - 4 = 0');

// Speak the solution steps
await mathrok.voice.speakSolution(result.steps);
```

### Stopping Voice Output

To stop any ongoing speech:

```javascript
mathrok.voice.stop();
```

## Advanced Usage

### Voice Configuration

You can configure voice behavior through the main configuration:

```javascript
mathrok.config.set({
  voiceEnabled: true,  // Enable/disable voice features
  voiceRate: 1.0,      // Speech rate (0.5 to 2.0)
  voicePitch: 1.0,     // Speech pitch (0.5 to 2.0)
  voiceVolume: 1.0,    // Speech volume (0.0 to 1.0)
  preferredVoice: 'en-US-female' // Preferred voice identifier
});
```

### Selecting Voices

To get available voices and select a specific one:

```javascript
// Get all available voices
const voices = mathrok.voice.getVoices();
console.log(voices); // Array of voice objects

// Find a specific voice
const femaleVoice = voices.find(voice =>
  voice.lang.startsWith('en') && voice.name.includes('female')
);

// Set preferred voice
if (femaleVoice) {
  mathrok.config.set({ preferredVoice: femaleVoice.name });
}
```

### Mathematical Term Pronunciation

Mathrok's voice system is optimized for mathematical terminology:

```javascript
// These will be pronounced correctly
await mathrok.voice.speak('The integral of x squared dx equals x cubed over 3 plus C');
await mathrok.voice.speak('The limit as x approaches infinity of 1 over x equals 0');
await mathrok.voice.speak('The derivative of sine of x equals cosine of x');
```

### Continuous Interaction

For a voice-based interactive session:

```javascript
async function voiceSession() {
  try {
    // Welcome message
    await mathrok.voice.speak('Welcome to Mathrok. What would you like to calculate?');

    // Listen for query
    const input = await mathrok.voice.listen();

    // Process query
    const result = await mathrok.nl(input.text);

    // Speak result
    await mathrok.voice.speak(
      `The result is ${result.result}`,
      `I processed your query: ${input.text}`
    );

    // Ask if user wants to continue
    await mathrok.voice.speak('Would you like to ask another question?');

    // Continue listening...
  } catch (error) {
    console.error('Voice session error:', error);
    await mathrok.voice.speak('Sorry, I encountered an error. Please try again.');
  }
}
```

## Accessibility Features

### Screen Reader Compatibility

The voice output is designed to work well with screen readers:

```javascript
// Generate accessible mathematical content
const result = await mathrok.solve('x^2 - 4 = 0');
const accessibleSteps = result.steps.map(step => step.text).join('. ');

// This can be read by screen readers or spoken directly
await mathrok.voice.speak(accessibleSteps);
```

### Combining Voice with Visualization

For multimodal learning experiences:

```javascript
// Solve an equation
const result = await mathrok.solve('x^2 - 4 = 0');

// Visualize the solution
const container = document.getElementById('graph-container');
mathrok.visualization.plot2D(container, 'x^2 - 4', 'x');

// Speak the solution while showing the graph
await mathrok.voice.speakSolution(result.steps);
```

## Error Handling

### Handling Voice Input Errors

```javascript
try {
  const result = await mathrok.voice.listen();
  // Process result...
} catch (error) {
  if (error.name === 'NotAllowedError') {
    console.error('Microphone permission denied');
    // Show UI prompt to request permission
  } else if (error.name === 'NotSupportedError') {
    console.error('Voice recognition not supported in this browser');
    // Fall back to text input
  } else {
    console.error('Voice recognition error:', error);
    // General error handling
  }
}
```

### Handling Voice Output Errors

```javascript
try {
  await mathrok.voice.speak('The derivative of x squared is 2x');
} catch (error) {
  console.error('Speech synthesis error:', error);
  // Fall back to displaying text
}
```

## Performance Considerations

### Voice Recognition Timing

Voice recognition can take time, especially for complex mathematical expressions:

```javascript
// Show loading indicator
showLoadingIndicator();

try {
  // Start listening
  const result = await mathrok.voice.listen();

  // Process result
  const mathResult = await mathrok.nl(result.text);

  // Hide loading indicator
  hideLoadingIndicator();

  // Show and speak result
  displayResult(mathResult);
  await mathrok.voice.speak(`The result is ${mathResult.result}`);
} catch (error) {
  // Hide loading indicator
  hideLoadingIndicator();

  // Show error
  displayError(error);
}
```

### Speech Synthesis Queuing

Multiple speak calls are automatically queued:

```javascript
// These will play in sequence
await mathrok.voice.speak('First, we factor the expression.');
await mathrok.voice.speak('Then, we set each factor equal to zero.');
await mathrok.voice.speak('Finally, we solve for x.');

// To cancel the queue
mathrok.voice.stop();
```

## Best Practices

1. **Always check support**: Use `isSupported()` before attempting voice features
2. **Provide visual feedback**: Show when the system is listening or speaking
3. **Handle errors gracefully**: Always have text-based fallbacks
4. **Use clear prompts**: Guide users on what mathematical expressions to speak
5. **Respect user preferences**: Allow users to enable/disable voice features
6. **Test across browsers**: Voice support varies by browser and device

## Examples

### Complete Voice Calculator

```javascript
class VoiceCalculator {
  constructor() {
    this.mathrok = new Mathrok();
    this.outputElement = document.getElementById('output');
    this.statusElement = document.getElementById('status');
    this.listenButton = document.getElementById('listen-button');

    // Check support
    const support = this.mathrok.voice.isSupported();
    if (!support.input || !support.output) {
      this.statusElement.textContent = 'Voice features not fully supported in this browser';
      this.listenButton.disabled = true;
      return;
    }

    // Set up event listeners
    this.listenButton.addEventListener('click', () => this.startListening());
  }

  async startListening() {
    this.statusElement.textContent = 'Listening...';
    this.listenButton.disabled = true;

    try {
      // Listen for input
      const input = await this.mathrok.voice.listen();
      this.statusElement.textContent = `Recognized: ${input.text}`;

      // Process the input
      this.statusElement.textContent = 'Processing...';
      const result = await this.mathrok.nl(input.text);

      // Display the result
      this.outputElement.innerHTML = `
        <div>Query: ${input.text}</div>
        <div>Result: ${result.result}</div>
      `;

      // Speak the result
      await this.mathrok.voice.speak(`The result is ${result.result}`);

      // Reset status
      this.statusElement.textContent = 'Ready';
      this.listenButton.disabled = false;
    } catch (error) {
      this.statusElement.textContent = `Error: ${error.message}`;
      this.listenButton.disabled = false;
    }
  }
}

// Initialize the calculator
const calculator = new VoiceCalculator();
```

### Voice-Guided Tutorial

```javascript
class MathTutor {
  constructor() {
    this.mathrok = new Mathrok();
    this.contentElement = document.getElementById('tutorial-content');
    this.nextButton = document.getElementById('next-button');
    this.speakButton = document.getElementById('speak-button');

    this.lessons = [
      {
        title: 'Introduction to Derivatives',
        content: 'The derivative measures the rate of change of a function.',
        expression: 'f\'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}'
      },
      {
        title: 'Power Rule',
        content: 'The derivative of x^n is n*x^(n-1).',
        expression: '\\frac{d}{dx}x^n = n \\cdot x^{n-1}'
      },
      // More lessons...
    ];

    this.currentLesson = 0;
    this.displayLesson(0);

    // Set up event listeners
    this.nextButton.addEventListener('click', () => this.nextLesson());
    this.speakButton.addEventListener('click', () => this.speakCurrentLesson());
  }

  displayLesson(index) {
    const lesson = this.lessons[index];
    this.contentElement.innerHTML = `
      <h2>${lesson.title}</h2>
      <p>${lesson.content}</p>
      <div class="math-expression">
        ${this.mathrok.visualization.renderMath(lesson.expression, 'latex', true)}
      </div>
    `;
  }

  async speakCurrentLesson() {
    const lesson = this.lessons[this.currentLesson];
    this.speakButton.disabled = true;

    try {
      await this.mathrok.voice.speak(
        lesson.title,
        `${lesson.content} The mathematical expression is as follows.`
      );
      this.speakButton.disabled = false;
    } catch (error) {
      console.error('Speech error:', error);
      this.speakButton.disabled = false;
    }
  }

  nextLesson() {
    this.currentLesson = (this.currentLesson + 1) % this.lessons.length;
    this.displayLesson(this.currentLesson);
  }
}

// Initialize the tutor
const tutor = new MathTutor();
```

## Troubleshooting

### Common Issues and Solutions

1. **"Voice recognition not working"**
   - Check browser compatibility
   - Ensure microphone permissions are granted
   - Check if the microphone is working in other applications

2. **"Speech synthesis not working"**
   - Some browsers require a user interaction before allowing speech
   - Try calling speech functions directly from a click handler
   - Check if audio is muted or volume is too low

3. **"Poor recognition accuracy for mathematical terms"**
   - Speak clearly and at a moderate pace
   - Use standard mathematical terminology
   - Avoid background noise
   - For complex expressions, break them into smaller parts

4. **"Voice features working inconsistently"**
   - Different browsers implement the Web Speech API differently
   - Mobile devices may have additional restrictions
   - Some features may require an internet connection

### Debugging Voice Features

```javascript
// Enable debug mode
mathrok.config.set({ debug: true });

// Test voice input
async function testVoiceInput() {
  console.log('Testing voice input...');
  try {
    const support = mathrok.voice.isSupported();
    console.log('Voice support:', support);

    if (support.input) {
      console.log('Listening...');
      const result = await mathrok.voice.listen();
      console.log('Recognition result:', result);
    } else {
      console.log('Voice input not supported');
    }
  } catch (error) {
    console.error('Voice input test error:', error);
  }
}

// Test voice output
async function testVoiceOutput() {
  console.log('Testing voice output...');
  try {
    const support = mathrok.voice.isSupported();
    console.log('Voice support:', support);

    if (support.output) {
      console.log('Getting available voices...');
      const voices = mathrok.voice.getVoices();
      console.log('Available voices:', voices.length);

      console.log('Speaking test message...');
      await mathrok.voice.speak('This is a test of the Mathrok voice system');
      console.log('Speech completed');
    } else {
      console.log('Voice output not supported');
    }
  } catch (error) {
    console.error('Voice output test error:', error);
  }
}
```