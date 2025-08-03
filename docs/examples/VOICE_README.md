# 🎙️ Mathrok Voice Input Examples

This directory contains two comprehensive examples demonstrating Mathrok's voice input capabilities for mathematical expressions.

## 📁 Files

### 1. `voice-input.js` - Node.js Console Demo
A Node.js compatible demonstration that simulates voice input processing with predefined examples.

**Features:**
- Simulated voice input with natural language processing
- Step-by-step explanations
- Voice response generation (text-to-speech simulation)
- Comprehensive mathematical vocabulary recognition
- Error handling and fallback processing

**Usage:**
```bash
# Run the Node.js voice demo
pnpm run voice

# Or directly with node
node voice-input.js
```

### 2. `voice-input.html` - Interactive Browser Demo
A fully interactive web application with real speech recognition and text-to-speech capabilities.

**Features:**
- **Real Speech Recognition**: Uses Web Speech API for actual voice input
- **Text-to-Speech**: Speaks results back to the user
- **Beautiful UI**: Modern, responsive design with animations
- **Live Processing**: Real-time natural language processing
- **Example Buttons**: Click-to-try common mathematical expressions
- **Step-by-Step Solutions**: Visual display of solution steps
- **Error Handling**: Graceful error messages and fallbacks

**Usage:**
```bash
# Open the HTML demo in your browser
pnpm run voice:html

# Or manually open the file
# Open voice-input.html in Chrome, Edge, or Safari
```

## 🎯 Supported Voice Commands

The voice input system recognizes natural language mathematical expressions:

### Equation Solving
- "Solve x squared minus four equals zero"
- "Find the solution to 2x plus 3 equals 7"
- "Solve the quadratic equation x squared plus 5x plus 6 equals zero"

### Calculus Operations
- "What is the derivative of sine x"
- "Find the derivative of x squared times cosine x"
- "Integrate x squared with respect to x"
- "What is the integral of sine x"
- "Find the limit of sine x over x as x approaches zero"

### Algebraic Operations
- "Factor x cubed minus eight"
- "Expand (x plus 2) squared"
- "Simplify x squared minus 4 over x minus 2"

### Basic Arithmetic
- "What is two plus three times four"
- "Calculate the square root of 16"
- "What is 5 factorial"

## 🗣️ Mathematical Vocabulary

The system automatically converts spoken mathematical terms:

| Spoken | Mathematical |
|--------|-------------|
| "squared" | ^2 |
| "cubed" | ^3 |
| "to the power of" | ^ |
| "sine" | sin |
| "cosine" | cos |
| "tangent" | tan |
| "natural log" | ln |
| "square root" | sqrt |
| "plus" | + |
| "minus" | - |
| "times" | * |
| "divided by" | / |
| "equals" | = |

## 🌐 Browser Compatibility

### Speech Recognition Support
- ✅ **Chrome** (Desktop & Mobile)
- ✅ **Microsoft Edge**
- ✅ **Safari** (macOS/iOS 14.5+)
- ❌ Firefox (not supported)

### Text-to-Speech Support
- ✅ All modern browsers support Speech Synthesis API

## 🚀 Getting Started

### Prerequisites
1. Build the Mathrok library:
   ```bash
   cd ../../
   pnpm build
   ```

2. Install example dependencies:
   ```bash
   cd docs/examples
   pnpm install
   ```

### Running the Examples

#### Node.js Demo
```bash
pnpm run voice
```

#### Browser Demo
```bash
pnpm run voice:html
```
Then click the microphone button and speak a mathematical expression!

## 🔧 Technical Implementation

### Natural Language Processing
- Uses Mathrok's built-in NLP engine (`mathrok.nl()`)
- Converts natural language to mathematical expressions
- Identifies mathematical intent (solve, derivative, integral, etc.)
- Provides confidence scores for recognition accuracy

### Voice Processing Pipeline
1. **Speech-to-Text**: Web Speech API converts voice to text
2. **NLP Processing**: Mathrok processes natural language
3. **Mathematical Computation**: Executes the identified operation
4. **Result Generation**: Formats results with step-by-step explanations
5. **Text-to-Speech**: Speaks the result back to the user

### Error Handling
- Graceful fallback for unsupported browsers
- Clear error messages for processing failures
- Alternative input methods (example buttons)
- Retry mechanisms for speech recognition errors

## 🎨 UI Features (HTML Version)

- **Responsive Design**: Works on desktop and mobile devices
- **Visual Feedback**: Animated microphone button during listening
- **Status Indicators**: Clear status messages for each processing stage
- **Result Display**: Formatted mathematical expressions and results
- **Step-by-Step Solutions**: Expandable solution steps
- **Voice Output**: Visual display of spoken responses
- **Example Gallery**: Quick-access buttons for common expressions

## 🐛 Troubleshooting

### Common Issues

**"Speech recognition not supported"**
- Use Chrome, Edge, or Safari
- Ensure you're using HTTPS (required for speech recognition)
- Check browser permissions for microphone access

**"Microphone access denied"**
- Click the microphone icon in the address bar
- Allow microphone permissions
- Refresh the page and try again

**"Processing errors"**
- Try speaking more clearly and slowly
- Use the example buttons to test functionality
- Check the browser console for detailed error messages

### Performance Tips
- Speak clearly and at a moderate pace
- Use standard mathematical terminology
- Pause briefly between mathematical terms
- Try the example buttons first to understand expected phrasing

## 📚 Example Expressions to Try

### Beginner
- "What is 2 plus 3"
- "Calculate 5 times 7"
- "What is the square root of 25"

### Intermediate
- "Solve x plus 5 equals 10"
- "What is the derivative of x squared"
- "Factor x squared minus 9"

### Advanced
- "Find the integral of sine x cosine x"
- "Solve the system x plus y equals 5 and x minus y equals 1"
- "What is the limit of x squared minus 1 over x minus 1 as x approaches 1"

## 🔮 Future Enhancements

- Multi-language support
- Custom voice commands
- Mathematical notation display (LaTeX rendering)
- Voice-controlled graphing
- Collaborative voice sessions
- Advanced mathematical vocabulary expansion

---

**Note**: The voice input feature works best in quiet environments with clear pronunciation. For optimal results, use a good quality microphone and speak mathematical expressions using standard terminology.