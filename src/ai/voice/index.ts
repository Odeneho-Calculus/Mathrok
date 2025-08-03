/**
 * Voice module for Mathrok
 * Provides speech-to-text and text-to-speech capabilities
 */

import { SpeechToText } from './speech-to-text.js';
import { TextToSpeech } from './text-to-speech.js';

/**
 * Voice service options
 */
export interface VoiceServiceOptions {
    speechToText?: {
        language?: string;
        continuous?: boolean;
        interimResults?: boolean;
        maxAlternatives?: number;
    };
    textToSpeech?: {
        voice?: string;
        rate?: number;
        pitch?: number;
        volume?: number;
        language?: string;
    };
}

/**
 * Voice service result
 */
export interface VoiceResult {
    text: string;
    confidence: number;
    alternatives?: { text: string; confidence: number }[];
    isFinal: boolean;
}

/**
 * Voice service for Mathrok
 * Provides a unified interface for voice input and output
 */
export class VoiceService {
    private speechToText: SpeechToText;
    private textToSpeech: TextToSpeech;
    private isInitialized: boolean = false;

    constructor(options?: VoiceServiceOptions) {
        this.speechToText = new SpeechToText(options?.speechToText);
        this.textToSpeech = new TextToSpeech(options?.textToSpeech);
        this.isInitialized = true;
    }

    /**
     * Check if voice services are supported
     */
    public isVoiceSupported(): { input: boolean; output: boolean } {
        return {
            input: this.speechToText.isRecognitionSupported(),
            output: this.textToSpeech.isSynthesisSupported()
        };
    }

    /**
     * Listen for mathematical expression
     */
    public async listenForMathExpression(): Promise<VoiceResult> {
        if (!this.isInitialized) {
            throw new Error('Voice service not initialized');
        }

        return this.speechToText.recognizeMathExpression();
    }

    /**
     * Speak mathematical expression
     */
    public async speakMathExpression(expression: string, explanation?: string): Promise<void> {
        if (!this.isInitialized) {
            throw new Error('Voice service not initialized');
        }

        return this.textToSpeech.speakMathExpression(expression, explanation);
    }

    /**
     * Speak step-by-step solution
     */
    public async speakStepByStepSolution(steps: { text: string; expression: string }[]): Promise<void> {
        if (!this.isInitialized) {
            throw new Error('Voice service not initialized');
        }

        return this.textToSpeech.speakStepByStepSolution(steps);
    }

    /**
     * Stop all voice activity
     */
    public stopAll(): void {
        if (this.isInitialized) {
            this.speechToText.stopListening();
            this.textToSpeech.stop();
        }
    }

    /**
     * Get available voices
     */
    public getAvailableVoices() {
        return this.textToSpeech.getVoices();
    }
}

// Export classes
export { SpeechToText } from './speech-to-text.js';
export { TextToSpeech } from './text-to-speech.js';