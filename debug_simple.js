// Simple debug script to test tokenization
const fs = require('fs');

// Read the lexer source directly and create a simple test
const lexerCode = `
const { MathLexer, TokenType } = require('./src/core/parser/lexer.ts');

console.log('Testing lexer with "2 + 3":');
try {
  const lexer = new MathLexer('2 + 3');
  const tokens = lexer.tokenize();
  console.log('Tokens:', tokens.map(t => ({ type: t.type, value: t.value })));
} catch (error) {
  console.error('Error:', error.message);
}
`;

console.log('Let me create a simple test to debug the tokenization issue...');

// Let's test the lexer directly in the test environment
console.log('Creating a simple tokenization test...');