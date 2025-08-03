/**
 * AI Integration Demonstration
 * Shows the enhanced natural language processing capabilities
 */

import { Mathrok } from '../src/index.js';

async function demonstrateAIIntegration() {
    console.log('🚀 Mathrok AI Integration Demo\n');
    console.log('='.repeat(50));

    const mathrok = new Mathrok();

    // Test basic natural language processing
    console.log('\n📝 Basic Natural Language Processing:');
    console.log('-'.repeat(40));

    try {
        const queries = [
            'find the derivative of x^2',
            'integrate x^3',
            'solve x + 5 = 10',
            'factor x^2 - 4',
            'simplify 2x + 3x'
        ];

        for (const query of queries) {
            console.log(`\nQuery: "${query}"`);
            try {
                const result = await mathrok.fromNaturalLanguage(query);
                console.log(`✅ Result: ${JSON.stringify(result.result)}`);
                console.log(`📊 Confidence: ${(result.confidence * 100).toFixed(1)}%`);
                console.log(`⚡ Method: ${result.method}`);
                console.log(`⏱️  Time: ${result.processingTime?.toFixed(2)}ms`);
            } catch (error) {
                console.log(`❌ Error: ${error.message}`);
            }
        }
    } catch (error) {
        console.log(`❌ Basic NL Error: ${error.message}`);
    }

    // Test advanced natural language processing
    console.log('\n\n🧠 Advanced Natural Language Processing:');
    console.log('-'.repeat(45));

    try {
        const advancedQuery = 'first factor x^2 - 4 then solve x^2 - 4 = 0';
        console.log(`\nAdvanced Query: "${advancedQuery}"`);

        const advancedResult = await mathrok.nlAdvanced(advancedQuery);
        console.log(`✅ Multi-step: ${advancedResult.multiStep}`);
        console.log(`📊 Confidence: ${(advancedResult.confidence * 100).toFixed(1)}%`);
        console.log(`🎯 Learning Progression:`, advancedResult.learningProgression);

        if (advancedResult.stepResults) {
            console.log(`📋 Steps (${advancedResult.stepResults.length}):`);
            advancedResult.stepResults.forEach((step, index) => {
                console.log(`  ${index + 1}. ${step.interpretation}: ${JSON.stringify(step.result)}`);
            });
        }
    } catch (error) {
        console.log(`❌ Advanced NL Error: ${error.message}`);
    }

    // Test educational tutoring mode
    console.log('\n\n🎓 Educational Tutoring Mode:');
    console.log('-'.repeat(35));

    try {
        const tutorQuery = 'explain how to differentiate x^2';
        console.log(`\nTutor Query: "${tutorQuery}"`);

        const tutorResult = await mathrok.nlTutor(tutorQuery);
        console.log(`✅ Educational Explanation: ${tutorResult.educationalExplanation}`);
        console.log(`💡 Concept: ${tutorResult.conceptExplanation}`);
        console.log(`⚠️  Common Mistakes: ${tutorResult.commonMistakes.join(', ')}`);
        console.log(`📚 Difficulty: ${tutorResult.difficulty}`);
        console.log(`🔗 Related Concepts: ${tutorResult.relatedConcepts.join(', ')}`);
        console.log(`📝 Practice Problems:`);
        tutorResult.practiceProblems.forEach((problem, index) => {
            console.log(`  ${index + 1}. ${problem}`);
        });
    } catch (error) {
        console.log(`❌ Tutor Mode Error: ${error.message}`);
    }

    // Test concept explanation
    console.log('\n\n📖 Concept Explanation:');
    console.log('-'.repeat(30));

    try {
        const concepts = ['derivative', 'integral', 'limit'];

        for (const concept of concepts) {
            console.log(`\nConcept: "${concept}"`);
            const explanation = await mathrok.nlExplain(concept);
            console.log(`📝 Explanation: ${explanation.explanation}`);
            console.log(`🎯 Difficulty: ${explanation.difficulty}`);
            console.log(`📚 Prerequisites: ${explanation.prerequisites.join(', ')}`);
            console.log(`🔧 Applications: ${explanation.applications.join(', ')}`);
            console.log(`💡 Examples: ${explanation.examples.slice(0, 2).join(', ')}`);
        }
    } catch (error) {
        console.log(`❌ Concept Explanation Error: ${error.message}`);
    }

    // Test user preferences
    console.log('\n\n⚙️  User Preferences:');
    console.log('-'.repeat(25));

    try {
        mathrok.updateNLPreferences({
            explanationStyle: 'step-by-step',
            mathematicalNotation: 'latex',
            showSteps: true,
            educationalMode: true
        });
        console.log('✅ Preferences updated successfully');
    } catch (error) {
        console.log(`❌ Preferences Error: ${error.message}`);
    }

    // Show processing statistics
    console.log('\n\n📊 Processing Statistics:');
    console.log('-'.repeat(30));

    try {
        const stats = mathrok.getNLStats();
        console.log(`📈 Total Queries: ${stats.totalQueries}`);
        console.log(`🤖 AI Queries: ${stats.aiQueries}`);
        console.log(`📏 Rule-based Queries: ${stats.ruleBasedQueries}`);
        console.log(`🔄 Hybrid Queries: ${stats.hybridQueries}`);
        console.log(`⏱️  Average Processing Time: ${stats.averageProcessingTime.toFixed(2)}ms`);
        console.log(`✅ Success Rate: ${(stats.successRate * 100).toFixed(1)}%`);
        console.log(`💾 Cache Hit Rate: ${(stats.cacheHitRate * 100).toFixed(1)}%`);
    } catch (error) {
        console.log(`❌ Stats Error: ${error.message}`);
    }

    // Test context and conversation
    console.log('\n\n💬 Context and Conversation:');
    console.log('-'.repeat(35));

    try {
        // First query
        await mathrok.fromNaturalLanguage('solve x^2 = 4');
        console.log('✅ First query: "solve x^2 = 4" processed');

        // Reference previous result
        const contextResult = await mathrok.fromNaturalLanguage('what is the result?');
        console.log(`✅ Context query result: ${JSON.stringify(contextResult.result)}`);
        console.log(`📊 Confidence: ${(contextResult.confidence * 100).toFixed(1)}%`);
    } catch (error) {
        console.log(`❌ Context Error: ${error.message}`);
    }

    console.log('\n' + '='.repeat(50));
    console.log('🎉 AI Integration Demo Complete!');
    console.log('\nKey Features Demonstrated:');
    console.log('✅ Enhanced Natural Language Processing');
    console.log('✅ Multi-step Problem Solving');
    console.log('✅ Educational Tutoring Mode');
    console.log('✅ Concept Explanations');
    console.log('✅ User Preferences');
    console.log('✅ Processing Statistics');
    console.log('✅ Context-aware Conversations');
    console.log('✅ Hybrid AI + Rule-based Processing');
}

// Run the demonstration
demonstrateAIIntegration().catch(console.error);