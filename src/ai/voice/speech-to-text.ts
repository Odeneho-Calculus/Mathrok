/**
 * Speech-to-Text module for Mathrok
 * Provides voice input capabilities using Web Speech API with fallbacks
 */

interface SpeechRecognitionResult {
    text: string;
    confidence: number;
    alternatives?: { text: string; confidence: number }[];
    isFinal: boolean;
}

interface SpeechRecognitionOptions {
    language?: string;
    continuous?: boolean;
    interimResults?: boolean;
    maxAlternatives?: number;
}

/**
 * Speech recognition service
 */
export class SpeechToText {
    private recognition: any = null;
    private isListening: boolean = false;
    private isSupported: boolean = false;
    private options: SpeechRecognitionOptions = {
        language: 'en-US',
        continuous: false,
        interimResults: true,
        maxAlternatives: 3
    };

    constructor(options?: Partial<SpeechRecognitionOptions>) {
        // Merge options
        if (options) {
            this.options = { ...this.options, ...options };
        }

        // Check if browser environment
        if (typeof window !== 'undefined') {
            // Initialize Web Speech API
            this.initializeSpeechRecognition();
        }
    }

    /**
     * Initialize speech recognition
     */
    private initializeSpeechRecognition(): void {
        try {
            // Try to get the SpeechRecognition constructor
            const SpeechRecognition = (window as any).SpeechRecognition ||
                (window as any).webkitSpeechRecognition ||
                (window as any).mozSpeechRecognition ||
                (window as any).msSpeechRecognition;

            if (SpeechRecognition) {
                this.recognition = new SpeechRecognition();
                this.isSupported = true;

                // Configure recognition
                this.recognition.lang = this.options.language;
                this.recognition.continuous = this.options.continuous;
                this.recognition.interimResults = this.options.interimResults;
                this.recognition.maxAlternatives = this.options.maxAlternatives;
            } else {
                this.isSupported = false;
                console.warn('Speech recognition is not supported in this browser');
            }
        } catch (error) {
            this.isSupported = false;
            console.warn('Failed to initialize speech recognition:', error);
        }
    }

    /**
     * Check if speech recognition is supported
     */
    public isRecognitionSupported(): boolean {
        return this.isSupported;
    }

    /**
     * Start listening for speech input
     */
    public startListening(callback: (result: SpeechRecognitionResult) => void): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.isSupported) {
                reject(new Error('Speech recognition is not supported'));
                return;
            }

            if (this.isListening) {
                reject(new Error('Already listening'));
                return;
            }

            try {
                // Set up event handlers
                this.recognition.onresult = (event: any) => {
                    const result = this.processRecognitionResult(event);
                    callback(result);
                };

                this.recognition.onerror = (event: any) => {
                    console.warn('Speech recognition error:', event.error);
                    if (this.isListening) {
                        this.stopListening();
                    }
                    reject(new Error(`Speech recognition error: ${event.error}`));
                };

                this.recognition.onend = () => {
                    this.isListening = false;
                    resolve();
                };

                // Start recognition
                this.recognition.start();
                this.isListening = true;
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Stop listening for speech input
     */
    public stopListening(): Promise<void> {
        return new Promise((resolve) => {
            if (this.isListening && this.recognition) {
                try {
                    this.recognition.stop();
                } catch (error) {
                    console.warn('Error stopping speech recognition:', error);
                }
            }
            this.isListening = false;
            resolve();
        });
    }

    /**
     * Process speech recognition results
     */
    private processRecognitionResult(event: any): SpeechRecognitionResult {
        const lastResult = event.results[event.results.length - 1];
        const mainResult = lastResult[0];

        // Process alternatives
        const alternatives = [];
        for (let i = 1; i < lastResult.length; i++) {
            alternatives.push({
                text: lastResult[i].transcript,
                confidence: lastResult[i].confidence
            });
        }

        return {
            text: mainResult.transcript,
            confidence: mainResult.confidence,
            alternatives: alternatives.length > 0 ? alternatives : undefined,
            isFinal: lastResult.isFinal
        };
    }

    /**
     * One-shot speech recognition
     * Returns a promise that resolves with the recognized text
     */
    public async recognizeSpeech(): Promise<SpeechRecognitionResult> {
        return new Promise((resolve, reject) => {
            if (!this.isSupported) {
                reject(new Error('Speech recognition is not supported'));
                return;
            }

            let finalResult: SpeechRecognitionResult | null = null;

            const handleResult = (result: SpeechRecognitionResult) => {
                if (result.isFinal) {
                    finalResult = result;
                    this.stopListening();
                    resolve(finalResult);
                }
            };

            this.startListening(handleResult)
                .catch(reject);

            // Set a timeout to prevent hanging
            setTimeout(() => {
                if (!finalResult) {
                    this.stopListening();
                    reject(new Error('Speech recognition timed out'));
                }
            }, 10000); // 10 second timeout
        });
    }

    /**
     * Detect mathematical terms in speech
     * Specialized for mathematical expressions
     */
    public async recognizeMathExpression(): Promise<SpeechRecognitionResult> {
        // Use a specialized language model for math if available
        const originalLang = this.options.language;

        try {
            // Set math-optimized options
            this.options.language = 'en-US'; // Most reliable for math terms
            this.options.maxAlternatives = 5; // Get more alternatives for math expressions

            if (this.recognition) {
                this.recognition.lang = this.options.language;
                this.recognition.maxAlternatives = this.options.maxAlternatives;
            }

            // Perform recognition
            const result = await this.recognizeSpeech();

            // Post-process for mathematical expressions
            return this.processMathematicalSpeech(result);
        } finally {
            // Restore original settings
            this.options.language = originalLang;
            if (this.recognition) {
                this.recognition.lang = originalLang;
            }
        }
    }

    /**
     * Process speech specifically for mathematical expressions
     * Applies corrections for common math terms
     */
    private processMathematicalSpeech(result: SpeechRecognitionResult): SpeechRecognitionResult {
        const mathTermCorrections: Record<string, string> = {
            // Numbers and operations
            'to': '2',
            'too': '2',
            'for': '4',
            'fore': '4',
            'plus': '+',
            'minus': '-',
            'times': '*',
            'multiplied by': '*',
            'divided by': '/',
            'equals': '=',
            'equal to': '=',
            'equal': '=',

            // Functions
            'sine': 'sin',
            'cosine': 'cos',
            'tangent': 'tan',
            'cotangent': 'cot',
            'secant': 'sec',
            'cosecant': 'csc',
            'arc sine': 'arcsin',
            'arc cosine': 'arccos',
            'arc tangent': 'arctan',
            'logarithm': 'log',
            'natural logarithm': 'ln',
            'square root': 'sqrt',
            'cube root': 'cbrt',

            // Exponents
            'squared': '^2',
            'cubed': '^3',
            'to the power of': '^',
            'to the': '^',
            'raised to': '^',

            // Variables
            'x squared': 'x^2',
            'y squared': 'y^2',
            'z squared': 'z^2',
            'x cubed': 'x^3',
            'y cubed': 'y^3',
            'z cubed': 'z^3',

            // Calculus terms
            'derivative of': 'd/dx',
            'integrate': 'int',
            'integral of': 'int',
            'with respect to': 'dx',

            // Parentheses
            'open parenthesis': '(',
            'close parenthesis': ')',
            'open bracket': '[',
            'close bracket': ']',
            'open brace': '{',
            'close brace': '}',

            // Constants
            'pi': 'π',
            'pie': 'π',
            'euler\'s number': 'e',
            'infinity': '∞'
        };

        // Apply corrections to the main result
        let processedText = result.text;
        for (const [term, replacement] of Object.entries(mathTermCorrections)) {
            const regex = new RegExp(`\\b${term}\\b`, 'gi');
            processedText = processedText.replace(regex, replacement);
        }

        // Process alternatives if available
        const processedAlternatives = result.alternatives?.map(alt => ({
            text: Object.entries(mathTermCorrections).reduce(
                (text, [term, replacement]) =>
                    text.replace(new RegExp(`\\b${term}\\b`, 'gi'), replacement),
                alt.text
            ),
            confidence: alt.confidence
        }));

        return {
            text: processedText,
            confidence: result.confidence,
            alternatives: processedAlternatives,
            isFinal: result.isFinal
        };
    }
}