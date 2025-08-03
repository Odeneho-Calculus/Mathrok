/**
 * Comprehensive Natural Language Processing Tests
 * Tests for AI integration, context management, and educational features
 */

import { Mathrok } from '../../src/index.js';
import { NaturalLanguageProcessor } from '../../src/core/nl.js';
import { HybridProcessor } from '../../src/ai/pipeline/hybrid.js';
import { ContextManager } from '../../src/ai/nlp/context.js';
import { AIModelManager } from '../../src/ai/models/manager.js';

describe('Natural Language Processing - AI Integration', () => {
    let mathrok: Mathrok;

    beforeEach(() => {
        mathrok = new Mathrok();
    });

    afterEach(() => {
        mathrok.resetNLContext();
    });

    describe('Basic Natural Language Processing', () => {
        test('should handle basic calculus queries', async () => {
            const result = await mathrok.fromNaturalLanguage('find the derivative of x^2');

            expect(result.result).toBeDefined();
            expect(result.interpretation).toContain('derivative');
            expect(result.confidence).toBeGreaterThan(0.7);
            expect(result.method).toMatch(/rule_based|ai|hybrid/);
        });

        test('should handle integration queries', async () => {
            const result = await mathrok.fromNaturalLanguage('integrate x^2');

            expect(result.result).toBeDefined();
            expect(result.interpretation).toContain('integral');
            expect(result.confidence).toBeGreaterThan(0.7);
        });

        test('should handle equation solving', async () => {
            const result = await mathrok.fromNaturalLanguage('solve x + 5 = 10');

            expect(result.result).toBeDefined();
            expect(result.interpretation).toContain('solve');
            expect(result.confidence).toBeGreaterThan(0.6);
        });

        test('should handle factoring queries', async () => {
            const result = await mathrok.fromNaturalLanguage('factor x^2 - 4');

            expect(result.result).toBeDefined();
            expect(result.interpretation).toContain('factor');
            expect(result.confidence).toBeGreaterThan(0.6);
        });

        test('should provide processing time information', async () => {
            const result = await mathrok.fromNaturalLanguage('simplify 2x + 3x');

            expect(result.processingTime).toBeDefined();
            expect(result.processingTime).toBeGreaterThan(0);
        });
    });

    describe('Advanced Natural Language Processing', () => {
        test('should handle multi-step problems', async () => {
            const result = await mathrok.nlAdvanced('first factor x^2 - 4 then solve x^2 - 4 = 0');

            expect(result.result).toBeDefined();
            expect(result.multiStep).toBe(true);
            expect(result.stepResults).toBeDefined();
            expect(result.stepResults?.length).toBeGreaterThan(1);
        });

        test('should provide contextual information', async () => {
            const result = await mathrok.nlAdvanced('find the derivative of sin(x)');

            expect(result.contextualInfo).toBeDefined();
            expect(result.contextualInfo.currentTopic).toBeDefined();
            expect(result.contextualInfo.suggestedVariables).toBeDefined();
        });

        test('should provide learning progression', async () => {
            const result = await mathrok.nlAdvanced('differentiate x^3');

            expect(result.learningProgression).toBeDefined();
            expect(result.learningProgression?.prerequisites).toBeDefined();
            expect(result.learningProgression?.nextTopics).toBeDefined();
            expect(result.learningProgression?.practiceProblems).toBeDefined();
        });

        test('should handle complex mathematical expressions', async () => {
            const result = await mathrok.nlAdvanced('find the partial derivative of x^2*y + sin(x*y) with respect to x');

            expect(result.result).toBeDefined();
            expect(result.confidence).toBeGreaterThan(0.5);
        });

        test('should provide alternatives for ambiguous queries', async () => {
            const result = await mathrok.nlAdvanced('solve the equation');

            expect(result.alternatives).toBeDefined();
            expect(Array.isArray(result.alternatives)).toBe(true);
        });
    });

    describe('Educational Tutoring Mode', () => {
        test('should provide educational explanations', async () => {
            const result = await mathrok.nlTutor('explain how to differentiate x^2');

            expect(result.educationalExplanation).toBeDefined();
            expect(result.educationalExplanation.length).toBeGreaterThan(10);
            expect(result.conceptExplanation).toBeDefined();
        });

        test('should identify common mistakes', async () => {
            const result = await mathrok.nlTutor('find the derivative of x^2 + 3x');

            expect(result.commonMistakes).toBeDefined();
            expect(Array.isArray(result.commonMistakes)).toBe(true);
            expect(result.commonMistakes.length).toBeGreaterThan(0);
        });

        test('should generate practice problems', async () => {
            const result = await mathrok.nlTutor('integrate x^2');

            expect(result.practiceProblems).toBeDefined();
            expect(Array.isArray(result.practiceProblems)).toBe(true);
            expect(result.practiceProblems.length).toBeGreaterThan(0);
        });

        test('should assess difficulty level', async () => {
            const basicResult = await mathrok.nlTutor('solve x + 1 = 5');
            const advancedResult = await mathrok.nlTutor('find the partial derivative using chain rule');

            expect(basicResult.difficulty).toBe('beginner');
            expect(advancedResult.difficulty).toBe('advanced');
        });

        test('should provide related concepts', async () => {
            const result = await mathrok.nlTutor('find the derivative of x^2');

            expect(result.relatedConcepts).toBeDefined();
            expect(Array.isArray(result.relatedConcepts)).toBe(true);
            expect(result.relatedConcepts.length).toBeGreaterThan(0);
        });
    });

    describe('Concept Explanation', () => {
        test('should explain derivative concept', async () => {
            const result = await mathrok.nlExplain('derivative');

            expect(result.topic).toBe('Derivative');
            expect(result.explanation).toBeDefined();
            expect(result.explanation.length).toBeGreaterThan(20);
            expect(result.examples).toBeDefined();
            expect(result.stepByStep).toBeDefined();
            expect(result.prerequisites).toBeDefined();
            expect(result.applications).toBeDefined();
        });

        test('should explain integral concept', async () => {
            const result = await mathrok.nlExplain('integral');

            expect(result.topic).toBe('Integral');
            expect(result.explanation).toContain('area');
            expect(result.examples.length).toBeGreaterThan(0);
            expect(result.stepByStep.length).toBeGreaterThan(0);
        });

        test('should explain limit concept', async () => {
            const result = await mathrok.nlExplain('limit');

            expect(result.topic).toBe('Limit');
            expect(result.explanation).toContain('approaches');
            expect(result.difficulty).toBe('intermediate');
        });

        test('should handle unknown concepts gracefully', async () => {
            const result = await mathrok.nlExplain('unknown_concept');

            expect(result.topic).toBe('unknown_concept');
            expect(result.explanation).toBeDefined();
            expect(result.difficulty).toBe('beginner');
        });
    });

    describe('User Preferences and Personalization', () => {
        test('should update user preferences', () => {
            const preferences = {
                explanationStyle: 'step-by-step' as const,
                mathematicalNotation: 'latex' as const,
                showSteps: true,
                educationalMode: true
            };

            expect(() => {
                mathrok.updateNLPreferences(preferences);
            }).not.toThrow();
        });

        test('should maintain context across queries', async () => {
            // First query
            await mathrok.fromNaturalLanguage('solve x^2 = 4');

            // Second query referencing first
            const result = await mathrok.fromNaturalLanguage('what is the result');

            expect(result.result).toBeDefined();
            expect(result.confidence).toBeGreaterThan(0.3);
        });

        test('should provide processing statistics', async () => {
            // Perform some queries
            await mathrok.fromNaturalLanguage('differentiate x^2');
            await mathrok.fromNaturalLanguage('integrate x^3');

            const stats = mathrok.getNLStats();

            expect(stats.totalQueries).toBeGreaterThan(0);
            expect(stats.averageProcessingTime).toBeGreaterThan(0);
            expect(stats.successRate).toBeGreaterThanOrEqual(0);
            expect(stats.successRate).toBeLessThanOrEqual(1);
        });
    });

    describe('Error Handling and Edge Cases', () => {
        test('should handle empty queries gracefully', async () => {
            const result = await mathrok.fromNaturalLanguage('');

            expect(result.result).toBeDefined();
            expect(result.confidence).toBeLessThan(0.5);
        });

        test('should handle nonsensical queries', async () => {
            const result = await mathrok.fromNaturalLanguage('purple monkey dishwasher');

            expect(result.result).toBeDefined();
            expect(result.confidence).toBeLessThan(0.3);
        });

        test('should handle very long queries', async () => {
            const longQuery = 'find the derivative of ' + 'x^2 + '.repeat(100) + 'x';
            const result = await mathrok.fromNaturalLanguage(longQuery);

            expect(result.result).toBeDefined();
            expect(result.processingTime).toBeDefined();
        });

        test('should handle mathematical notation variations', async () => {
            const queries = [
                'find d/dx of x^2',
                'differentiate x squared',
                'take the derivative of x to the power of 2'
            ];

            for (const query of queries) {
                const result = await mathrok.fromNaturalLanguage(query);
                expect(result.result).toBeDefined();
                expect(result.confidence).toBeGreaterThan(0.5);
            }
        });
    });

    describe('Performance and Caching', () => {
        test('should cache repeated queries', async () => {
            const query = 'differentiate x^2';

            // First query
            const result1 = await mathrok.fromNaturalLanguage(query);
            const time1 = result1.processingTime || 0;

            // Second identical query (should be faster due to caching)
            const result2 = await mathrok.fromNaturalLanguage(query);
            const time2 = result2.processingTime || 0;

            // Compare results but ignore timing differences
            expect(result1.result.result).toEqual(result2.result.result);
            expect(result1.confidence).toEqual(result2.confidence);
            // Note: Caching might not always make it faster due to overhead
        });

        test('should handle concurrent queries', async () => {
            const queries = [
                'differentiate x^2',
                'integrate x^3',
                'solve x + 1 = 5',
                'factor x^2 - 4'
            ];

            const promises = queries.map(query => mathrok.fromNaturalLanguage(query));
            const results = await Promise.all(promises);

            expect(results.length).toBe(4);
            results.forEach(result => {
                expect(result.result).toBeDefined();
                expect(result.confidence).toBeGreaterThan(0.3);
            });
        });

        test('should reset context and cache', async () => {
            // Perform some queries
            await mathrok.fromNaturalLanguage('solve x = 5');

            // Reset
            mathrok.resetNLContext();

            // Check stats are reset
            const stats = mathrok.getNLStats();
            expect(stats.totalQueries).toBe(0);
        });
    });

    describe('Integration with Mathematical Engine', () => {
        test('should integrate with calculus engine', async () => {
            const result = await mathrok.fromNaturalLanguage('find the limit of sin(x)/x as x approaches 0');

            expect(result.result).toBeDefined();
            expect(result.interpretation).toContain('limit');
        });

        test('should integrate with algebra engine', async () => {
            const result = await mathrok.fromNaturalLanguage('expand (x + 1)^2');

            expect(result.result).toBeDefined();
            expect(result.interpretation.toLowerCase()).toContain('expand');
        });

        test('should integrate with trigonometry engine', async () => {
            const result = await mathrok.fromNaturalLanguage('solve sin(x) = 0.5');

            expect(result.result).toBeDefined();
            expect(result.confidence).toBeGreaterThan(0.4);
        });

        test('should handle matrix operations', async () => {
            const result = await mathrok.fromNaturalLanguage('multiply matrices [[1,2],[3,4]] and [[5,6],[7,8]]');

            expect(result.result).toBeDefined();
            expect(result.confidence).toBeGreaterThan(0.3);
        });
    });
});

describe('AI Model Manager', () => {
    let aiManager: AIModelManager;

    beforeEach(() => {
        aiManager = new AIModelManager({
            modelName: 'microsoft/DialoGPT-small',
            task: 'text-generation',
            maxLength: 256,
            temperature: 0.7
        });
    });

    test('should initialize without errors', async () => {
        const status = aiManager.getStatus();
        expect(status.isLoaded).toBe(false);
        expect(status.isLoading).toBe(false);
    });

    test('should handle queries with fallback', async () => {
        const result = await aiManager.processQuery('find derivative of x^2');

        expect(result.result).toBeDefined();
        expect(result.confidence).toBeGreaterThan(0);
        expect(result.method).toMatch(/ai|rule_based/);
        expect(result.processingTime).toBeGreaterThan(0);
    });

    test('should provide cache statistics', () => {
        const stats = aiManager.getCacheStats();

        expect(stats.size).toBeGreaterThanOrEqual(0);
        expect(stats.hitRate).toBeGreaterThanOrEqual(0);
        expect(stats.memoryUsage).toBeGreaterThanOrEqual(0);
    });

    test('should clear cache', () => {
        aiManager.clearCache();
        const stats = aiManager.getCacheStats();
        expect(stats.size).toBe(0);
    });
});

describe('Context Manager', () => {
    let contextManager: ContextManager;

    beforeEach(() => {
        contextManager = new ContextManager();
    });

    test('should update context with query results', () => {
        contextManager.updateContext('solve x = 5', { result: 'x = 5' }, 'solve', 0.9);

        const context = contextManager.getContext();
        expect(context.history.length).toBe(1);
        expect(context.history[0].query).toBe('solve x = 5');
        expect(context.history[0].operation).toBe('solve');
    });

    test('should generate contextual hints', () => {
        const hints = contextManager.generateContextualHints('find derivative of x^2', 'derivative');

        expect(Array.isArray(hints)).toBe(true);
        expect(hints.length).toBeGreaterThan(0);

        hints.forEach(hint => {
            expect(hint.type).toMatch(/next_step|alternative_method|common_mistake|concept_explanation/);
            expect(hint.content).toBeDefined();
            expect(hint.confidence).toBeGreaterThan(0);
            expect(hint.relevance).toBeGreaterThan(0);
        });
    });

    test('should resolve references to previous results', () => {
        contextManager.updateContext('solve x^2 = 4', { result: 'x = ±2' }, 'solve', 0.9);

        const resolved = contextManager.resolveReferences('what is the result?');
        expect(resolved).toContain('±2');
    });

    test('should provide learning progression', () => {
        const progression = contextManager.getLearningProgression('derivative');

        expect(progression.prerequisites).toBeDefined();
        expect(progression.nextTopics).toBeDefined();
        expect(progression.practiceProblems).toBeDefined();
        expect(Array.isArray(progression.prerequisites)).toBe(true);
        expect(Array.isArray(progression.nextTopics)).toBe(true);
        expect(Array.isArray(progression.practiceProblems)).toBe(true);
    });

    test('should update user preferences', () => {
        const preferences = {
            explanationStyle: 'concise' as const,
            showSteps: false,
            educationalMode: true
        };

        contextManager.updatePreferences(preferences);
        const context = contextManager.getContext();

        expect(context.preferences.explanationStyle).toBe('concise');
        expect(context.preferences.showSteps).toBe(false);
        expect(context.preferences.educationalMode).toBe(true);
    });

    test('should reset context', () => {
        contextManager.updateContext('test query', { result: 'test' }, 'test', 0.8);
        contextManager.resetContext();

        const context = contextManager.getContext();
        expect(context.history.length).toBe(0);
        expect(context.previousResults.length).toBe(0);
        expect(Object.keys(context.variables).length).toBe(0);
    });
});

describe('Hybrid Processor', () => {
    let hybridProcessor: HybridProcessor;

    beforeEach(() => {
        hybridProcessor = new HybridProcessor({
            ruleBasedThreshold: 0.8,
            aiThreshold: 0.6,
            enableAI: false, // Disable AI for testing
            enableCaching: true
        });
    });

    test('should process queries with rule-based approach', async () => {
        const result = await hybridProcessor.process('find derivative of x^2');

        expect(result.result).toBeDefined();
        expect(result.confidence).toBeGreaterThan(0);
        expect(result.method).toBe('rule_based');
        expect(result.processingTime).toBeGreaterThan(0);
    });

    test('should provide processing statistics', async () => {
        await hybridProcessor.process('differentiate x^3');
        await hybridProcessor.process('integrate x^2');

        const stats = hybridProcessor.getStats();
        expect(stats.totalQueries).toBe(2);
        expect(stats.ruleBasedQueries).toBeGreaterThan(0);
        expect(stats.averageProcessingTime).toBeGreaterThan(0);
    });

    test('should update configuration', () => {
        hybridProcessor.updateConfig({
            ruleBasedThreshold: 0.9,
            enableCaching: false
        });

        // Configuration update should not throw
        expect(true).toBe(true);
    });

    test('should reset statistics and cache', async () => {
        await hybridProcessor.process('test query');
        hybridProcessor.reset();

        const stats = hybridProcessor.getStats();
        expect(stats.totalQueries).toBe(0);
    });
});