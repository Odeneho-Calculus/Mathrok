const { MathLexer } = require('./dist/mathrok.cjs.js');

console.log('Testing lexer with "2 + 3":');
const lexer = new MathLexer('2 + 3');
const tokens = lexer.tokenize();
console.log('Tokens:', tokens.map(t => ({ type: t.type, value: t.value })));