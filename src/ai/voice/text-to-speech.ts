/**
 * Text-to-Speech module for Mathrok
 * Provides audio explanation capabilities using Web Speech API with fallbacks
 */

interface TextToSpeechOptions {
    voice?: string;
    rate?: number;
    pitch?: number;
    volume?: number;
    language?: string;
}

interface VoiceInfo {
    id: string;
    name: string;
    language: string;
    default: boolean;
}

/**
 * Text to speech service
 */
export class TextToSpeech {
    private synthesis: any = null;
    private isSupported: boolean = false;
    private isSpeaking: boolean = false;
    private availableVoices: VoiceInfo[] = [];
    private options: TextToSpeechOptions = {
        voice: '',
        rate: 1.0,
        pitch: 1.0,
        volume: 1.0,
        language: 'en-US'
    };

    constructor(options?: Partial<TextToSpeechOptions>) {
        // Merge options
        if (options) {
            this.options = { ...this.options, ...options };
        }

        // Check if browser environment
        if (typeof window !== 'undefined') {
            // Initialize Web Speech API
            this.initializeSpeechSynthesis();
        }
    }

    /**
     * Initialize speech synthesis
     */
    private initializeSpeechSynthesis(): void {
        try {
            if ('speechSynthesis' in window) {
                this.synthesis = window.speechSynthesis;
                this.isSupported = true;

                // Load available voices
                this.loadVoices();

                // Some browsers load voices asynchronously
                if (this.synthesis.onvoiceschanged !== undefined) {
                    this.synthesis.onvoiceschanged = this.loadVoices.bind(this);
                }
            } else {
                this.isSupported = false;
                console.warn('Speech synthesis is not supported in this browser');
            }
        } catch (error) {
            this.isSupported = false;
            console.warn('Failed to initialize speech synthesis:', error);
        }
    }

    /**
     * Load available voices
     */
    private loadVoices(): void {
        if (!this.synthesis) return;

        try {
            const voices = this.synthesis.getVoices();
            this.availableVoices = voices.map((voice: any) => ({
                id: voice.voiceURI,
                name: voice.name,
                language: voice.lang,
                default: voice.default
            }));
        } catch (error) {
            console.warn('Failed to load voices:', error);
            this.availableVoices = [];
        }
    }

    /**
     * Check if speech synthesis is supported
     */
    public isSynthesisSupported(): boolean {
        return this.isSupported;
    }

    /**
     * Get available voices
     */
    public getVoices(): VoiceInfo[] {
        return [...this.availableVoices];
    }

    /**
     * Get voice by language
     */
    public getVoiceByLanguage(language: string): VoiceInfo | null {
        const voice = this.availableVoices.find(v => v.language.startsWith(language));
        return voice || null;
    }

    /**
     * Speak text
     */
    public speak(text: string, options?: Partial<TextToSpeechOptions>): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.isSupported) {
                reject(new Error('Speech synthesis is not supported'));
                return;
            }

            try {
                // Create utterance
                const utterance = new SpeechSynthesisUtterance(text);

                // Apply options
                const mergedOptions = { ...this.options, ...(options || {}) };
                utterance.rate = mergedOptions.rate || 1.0;
                utterance.pitch = mergedOptions.pitch || 1.0;
                utterance.volume = mergedOptions.volume || 1.0;

                // Set language
                if (mergedOptions.language) {
                    utterance.lang = mergedOptions.language;
                }

                // Set voice if specified
                if (mergedOptions.voice) {
                    const voices = this.synthesis.getVoices();
                    const voice = voices.find((v: any) =>
                        v.name === mergedOptions.voice ||
                        v.voiceURI === mergedOptions.voice
                    );
                    if (voice) {
                        utterance.voice = voice;
                    }
                }

                // Set event handlers
                utterance.onstart = () => {
                    this.isSpeaking = true;
                };

                utterance.onend = () => {
                    this.isSpeaking = false;
                    resolve();
                };

                utterance.onerror = (event) => {
                    this.isSpeaking = false;
                    reject(new Error(`Speech synthesis error: ${event.error}`));
                };

                // Speak the text
                this.synthesis.speak(utterance);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Stop speaking
     */
    public stop(): void {
        if (this.isSupported && this.synthesis) {
            this.synthesis.cancel();
            this.isSpeaking = false;
        }
    }

    /**
     * Pause speaking
     */
    public pause(): void {
        if (this.isSupported && this.synthesis) {
            this.synthesis.pause();
        }
    }

    /**
     * Resume speaking
     */
    public resume(): void {
        if (this.isSupported && this.synthesis) {
            this.synthesis.resume();
        }
    }

    /**
     * Check if currently speaking
     */
    public isSpeakingNow(): boolean {
        return this.isSpeaking;
    }

    /**
     * Speak mathematical expression with special handling
     */
    public speakMathExpression(expression: string, explanation?: string): Promise<void> {
        // Process the expression to make it more speech-friendly
        const speechText = this.processMathExpressionForSpeech(expression, explanation);

        // Use a slightly slower rate for mathematical expressions
        return this.speak(speechText, { rate: 0.9 });
    }

    /**
     * Process mathematical expressions for better speech output
     */
    private processMathExpressionForSpeech(expression: string, explanation?: string): string {
        // Replace mathematical symbols with spoken equivalents
        const replacements: Record<string, string> = {
            '+': ' plus ',
            '-': ' minus ',
            '*': ' times ',
            '/': ' divided by ',
            '=': ' equals ',
            '^': ' to the power of ',
            '√': ' square root of ',
            '∛': ' cube root of ',
            'π': ' pi ',
            '∞': ' infinity ',
            '≈': ' approximately equals ',
            '≠': ' not equal to ',
            '≤': ' less than or equal to ',
            '≥': ' greater than or equal to ',
            '∫': ' integral of ',
            '∑': ' sum of ',
            '∏': ' product of ',
            '∂': ' partial derivative of ',
            '∇': ' gradient of ',
            '∆': ' delta ',
            '∈': ' element of ',
            '∉': ' not an element of ',
            '⊂': ' subset of ',
            '⊃': ' superset of ',
            '∩': ' intersection ',
            '∪': ' union ',
            '∅': ' empty set ',
            '∀': ' for all ',
            '∃': ' there exists ',
            '∄': ' there does not exist ',
            '⇒': ' implies ',
            '⇔': ' if and only if ',
            '¬': ' not ',
            '∧': ' and ',
            '∨': ' or ',
            '⊕': ' exclusive or ',
            '⊗': ' tensor product ',
            '⊥': ' perpendicular to ',
            '∥': ' parallel to ',
            '°': ' degrees ',
            '′': ' prime ',
            '″': ' double prime ',
            '‴': ' triple prime ',
        };

        // Replace symbols
        let speechText = expression;
        for (const [symbol, replacement] of Object.entries(replacements)) {
            speechText = speechText.split(symbol).join(replacement);
        }

        // Handle common functions
        speechText = speechText
            .replace(/sin\(/g, 'sine of ')
            .replace(/cos\(/g, 'cosine of ')
            .replace(/tan\(/g, 'tangent of ')
            .replace(/log\(/g, 'logarithm of ')
            .replace(/ln\(/g, 'natural logarithm of ')
            .replace(/exp\(/g, 'exponential of ')
            .replace(/sqrt\(/g, 'square root of ')
            .replace(/abs\(/g, 'absolute value of ');

        // Handle parentheses
        speechText = speechText
            .replace(/\(/g, ' open parenthesis ')
            .replace(/\)/g, ' close parenthesis ');

        // Clean up extra spaces
        speechText = speechText
            .replace(/\s+/g, ' ')
            .trim();

        // Add explanation if provided
        if (explanation) {
            speechText = `${speechText}. ${explanation}`;
        }

        return speechText;
    }

    /**
     * Speak step-by-step solution
     */
    public async speakStepByStepSolution(steps: { text: string; expression: string }[]): Promise<void> {
        if (!this.isSupported) {
            throw new Error('Speech synthesis is not supported');
        }

        // Speak each step with a pause between
        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            const stepNumber = i + 1;

            // Create step introduction
            const introduction = `Step ${stepNumber}: `;

            // Speak the step
            await this.speak(introduction + step.text);

            // Add a short pause between steps
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        // Final conclusion
        await this.speak("That completes the solution.");
    }
}